import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, AfterViewInit } from '@angular/core'
import NP from 'number-precision'

@Component({
  selector: 'lx-slider',
  styleUrls: ['./slider.component.scss'],
  template: `
    <div class="d-flex flex-row align-items-center slider-container" [ngClass]="{ active: isAudio }">
      <div class="progress-wrap" #slider [ngClass]="{ 'is-progress': !isProgress }">
        <input
          #sliderProgress
          type="range"
          class="progress"
          [min]="min"
          [max]="max"
          [step]="step"
          [value]="getProgress()"
          (input)="setProgress(sliderProgress.value)"
        />
        <div class="progress-foreground" [style.width.%]="getForeProgress()"></div>
      </div>
      <div class="input-container" *ngIf="isContainer">
        <input
          #sliderInput
          class="slider-button-input"
          inputmode="numeric"
          [min]="min"
          [max]="max"
          [value]="getProgresstext()"
          (blur)="onInput($event)"
          (keypress)="onKeyPress($event)"
        />
        <div class="d-flex flex-column btn-container">
          <div class="num-btn" (click)="addProgress(sliderProgress.value)">
            <div class="text slider-button"><i class="slider-button"></i></div>
          </div>
          <div class="num-btn" (click)="setProgress(sliderProgress.value - step)">
            <div class="text slider-button"><i class="slider-button"></i></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
// onkeyup="if(isNaN(value))execCommand('undo')"
// onafterpaste="if(isNaN(value))execCommand('undo')"
export class SliderComponent implements OnInit, AfterViewInit {
  @Input() step: any = 1
  @Input() min: any = 0
  @Input() max: any = 100
  @Input() isProgress: boolean = false
  @Input() isContainer: boolean = true
  @Input() isAudio: boolean = false // 是否是音乐模块
  @Input() cur: any = 0 // 根据最大值、最小值和百分比算出的当前值。
  // @Input() multiples = 1; // 倍数
  @Output() valueChanged = new EventEmitter<number>()
  @Output() valueBlurChanged = new EventEmitter<number>()
  @ViewChild('sliderInput') sliderInput: ElementRef

  curPercent: number = 0

  @ViewChild('slider') slider: ElementRef

  constructor() {}

  ngOnInit() {
    if (this.cur) {
      this.curPercent = NP.divide(NP.minus(this.cur, this.min), NP.minus(this.max, this.min))
    }
  }

  ngAfterViewInit() {}

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

  setProgress(value) {
    if (isNaN(value)) {
      value = this.min
    }
    value = NP.strip(parseFloat(value))
    this.afterInput(value)
  }

  getProgress(): number {
    return NP.strip(parseFloat(this.cur || 0))
  }

  getProgresstext() {
    return NP.strip(parseFloat(this.cur || 0))
  }

  getForeProgress(): number {
    // 减去圆圈的百分比宽度
    const totalW = this.slider.nativeElement.clientWidth
    return (((totalW - 9.1) * this.curPercent) / totalW) * 100
  }

  onInput(event) {
    const value = event.srcElement.value

    this.afterInput(value, 'blur')
  }

  onKeyPress(event) {
    if (event.keyCode == '13') {
      if (!isNaN(event.target.value) && /^[-\\+]?([0-9]+\\.?)?[0-9]+$/.test(event.target.value)) {
        this.sliderInput.nativeElement.blur()
      } else {
        document.execCommand('undo')
      }
    }
  }

  afterInput(value, type?) {
    if (value === '') {
      this.cur = this.min
    } else {
      this.cur = value > this.max ? this.max : value < this.min ? this.min : value
    }

    this.curPercent = NP.minus(this.cur, this.min) / NP.minus(this.max, this.min)
    this.valueChanged.emit(this.cur)
    if (type) {
      this.valueBlurChanged.emit(this.cur)
    }
    if (this.isContainer) {
      this.sliderInput.nativeElement.value = this.cur
    }
  }
}
