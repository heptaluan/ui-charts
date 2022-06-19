import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, AfterViewInit } from '@angular/core'
import NP from 'number-precision'
import * as fromRoot from '../../states/reducers'
import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import * as $ from 'jquery'

@Component({
  selector: 'lx-process',
  styleUrls: ['./process.component.scss'],
  template: `
    <div class="d-flex flex-row align-items-center slider-container">
      <div class="process-button" [ngClass]="{ play: play, stop: !play }" (click)="handleProcessButtonClick()"></div>
      <div class="progress-wrap" #slider>
        <input
          #sliderProgress
          type="range"
          class="input-progress"
          [min]="min"
          [max]="max"
          [step]="step"
          [value]="getProgress()"
          (input)="setProgress(sliderProgress.value)"
        />
        <div class="progress-foreground" [style.width.%]="getForeProgress()"></div>
      </div>
      <div class="input-container">
        <input
          #sliderInput
          inputmode="numeric"
          [min]="min"
          [max]="max"
          [value]="getProgress()"
          (blur)="onInput($event)"
          (keypress)="onKeyPress($event)"
          onkeyup="if(isNaN(value))execCommand('undo')"
          onafterpaste="if(isNaN(value))execCommand('undo')"
        />
        <div class="d-flex flex-column btn-container">
          <div class="num-btn" (click)="addProgress(sliderProgress.value)">
            <div class="text"><i></i></div>
          </div>
          <div class="num-btn" (click)="setProgress(sliderProgress.value - step)">
            <div class="text"><i></i></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProcessComponent implements OnInit {
  @Input() startTime: any
  @Input() endTime: any
  @Input() data: any
  @Input() animationTimeInterval: any
  @Input() time: any
  @Input() step: any = 1
  @Input() min: any = 0
  @Input() max: any = 100
  @Input() cur: any = 0 // 根据最大值、最小值和百分比算出的当前值。
  @Output() valueChanged = new EventEmitter<number>()
  @Output() ButtonClick = new EventEmitter<boolean>()
  @Output() InputChangeValue = new EventEmitter<any>()
  @Output() clearD3ChartTimer = new EventEmitter<any>()
  @Output() timeEndRender = new EventEmitter<any>()
  @ViewChild('sliderInput') sliderInput: ElementRef
  @ViewChild('slider') slider: ElementRef

  curPercent: number = 0
  firstClick: boolean = true
  count: number = 0
  play: boolean = true
  interval: any
  startInterval: any
  mySubscription = new Subscription()
  projectType: string
  animationButton: any

  constructor(private _store: Store<fromRoot.State>, private _activatedRouter: ActivatedRoute) {
    this.projectType = this._activatedRouter.snapshot.queryParams.type
  }

  ngOnInit() {
    if (this.cur) {
      this.curPercent = NP.divide(NP.minus(this.cur, this.min), NP.minus(this.max, this.min))
    }
    const that = this
    this.slider.nativeElement.addEventListener('mouseup', function () {
      that.InputChangeValue.emit(that.data[that.count])
    })

    if (this.projectType === 'infographic') {
      this.mySubscription.add(
        this._store.select(fromRoot.getCurrentProjectArticle).subscribe((res) => {
          this.updateProgress()
          this.animationButton = $('.block-container.show .animation-button')
          if (this.animationButton) {
            this.animationButton.removeClass('active')
            this.animationButton.removeClass('hide-button')
          }
        })
      )
    } else if (this.projectType === 'chart') {
      this.mySubscription.add(
        this._store.select(fromRoot.getCurrentChartArticle).subscribe((res) => {
          this.updateProgress()
          this.animationButton = $('.block-container.show .animation-button')
          if (this.animationButton) {
            this.animationButton.removeClass('active')
            this.animationButton.removeClass('hide-button')
          }
        })
      )
    }

    // 动画事件
    setTimeout(() => {
      $(document).on('click', '.animation-button', function (e) {
        if (e.target) {
          e.target.classList.remove('active')
          that.handleProcessButtonClick(true)
        }
      })
    }, 0)
  }

  updateProgress() {
    this.clearD3ChartTimer.emit(undefined)
    this.animationButton = $('.block-container.show .animation-button')
    if (this.firstClick) {
      this.play = true
      this.setProgress(0)
    } else {
      if (!this.play) {
        this.play = true
        clearInterval(this.interval)
        this.setProgress(0)
        this.animationButton.removeClass('active')
      } else {
        this.setProgress(0)
        this.animationButton.addClass('active')
      }
    }
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe()
  }

  onInputKeyUp(e) {
    console.log(e)
  }

  handleProcessButtonClick(target?) {
    if (this.firstClick) {
      this.firstClick = false
    }
    this.animationButton = $('.block-container.show .animation-button')
    this.play = !this.play
    if (this.play) {
      this.animationButton.removeClass('active')
      if (!target) {
        this.animationButton.removeClass('hide-button')
      }
      this.ButtonClick.emit(false)
      this.InputChangeValue.emit(this.data[this.count])
      clearInterval(this.interval)
      clearInterval(this.startInterval)
    } else {
      this.animationButton.addClass('active')
      if (!target) {
        this.animationButton.addClass('hide-button')
      }
      this.setTime()
    }
  }

  setProgress(value) {
    if (isNaN(value)) {
      value = this.min
    }
    value = NP.strip(parseFloat(value))
    this.afterInput(value)
    this.count = value
    if (this.play) {
      clearInterval(this.interval)
    } else {
      clearInterval(this.startInterval)
      this.setTime()
    }
  }

  setTime() {
    this.count += 1
    this.afterInput(this.count)
    const that = this
    clearInterval(this.interval)
    this.startInterval = setTimeout(() => {
      this.ButtonClick.emit(true)
      that.interval = setInterval(function () {
        that.count += 1
        that.afterInput(that.count)
        if (that.count > that.time) {
          that.count = 0
          clearInterval(that.interval)
          setTimeout(() => {
            that.play = true
            that.afterInput(0)
            that.clearD3ChartTimer.emit(undefined)
            that.timeEndRender.emit(1)
            that.animationButton.removeClass('active')
            that.animationButton.removeClass('hide-button')
          }, that.endTime * 1000)
        }
      }, Number(that.animationTimeInterval) * 1000)
    }, that.startTime * 1000)
  }

  ngOnChanges(changes): void {
    if (changes.cur) {
      this.curPercent = NP.minus(Number(changes.cur.currentValue), this.min) / NP.minus(this.max, this.min)
    }
  }

  addProgress(value) {
    value = NP.strip(parseFloat(value))
    this.cur = NP.plus(this.step, value) > this.max ? this.max : NP.plus(this.step, value)
    this.curPercent = NP.minus(this.cur, this.min) / NP.minus(this.max, this.min)
    this.valueChanged.emit(this.cur)
  }

  getProgress(): number {
    return NP.strip(parseFloat(this.cur || 0))
  }

  getForeProgress(): number {
    // 减去圆圈的百分比宽度
    const totalW = this.slider.nativeElement.clientWidth
    return (((totalW - 14) * this.curPercent) / totalW) * 100
  }

  onInput(event) {
    const value = event.srcElement.value
    this.afterInput(value)
  }

  onKeyPress(event) {
    if (event.keyCode == '13') {
      this.sliderInput.nativeElement.blur()
    }
  }

  afterInput(value) {
    this.cur = value > this.max ? this.max : value < this.min ? this.min : value
    this.curPercent = NP.minus(this.cur, this.min) / NP.minus(this.max, this.min)
    this.valueChanged.emit(this.cur)
  }
}
