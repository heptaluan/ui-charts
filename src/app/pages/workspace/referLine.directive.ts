import { Directive, Renderer2, ElementRef, OnInit, Input, HostListener, EventEmitter, Output } from '@angular/core'
import { Subscription } from 'rxjs'
import { DataTransmissionService } from '../../share/services/data-transmission.service'
@Directive({
  selector: '[referLine]',
  inputs: ['project'],
  outputs: ['referData', 'clickReferLine'],
})
export class referLineDirective implements OnInit {
  constructor(
    private _render: Renderer2,
    private _el: ElementRef,
    private _dataTransmissionService: DataTransmissionService
  ) {}

  @Input('referLine') referLine = 'row' // 参考线方向
  @Input('id') id // 参考线 id
  @Input('project') project // 项目信息

  clickReferLine = new EventEmitter() // 点击删除参考线的 Id
  referData: EventEmitter<object> = new EventEmitter<object>() // 传送出去的数据

  scale: number = 1 // 页面缩放比例
  delFlag: boolean = false // 删除标识

  public isDown = false // 记录鼠标是否按下

  public disX // 记录鼠标点击事件的位置 X
  public disY // 记录鼠标点击事件的位置 Y

  private totalOffsetX = 0 // 记录总偏移量 X轴  记录当前比例下距离左边的距离
  private totalOffsetY = 0 // 记录总偏移量 Y轴  记录当前比例下距离上边的距离

  private referSubscription = new Subscription()

  ngOnInit() {
    this.scale = Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100
    this.totalOffsetX = Number(String(this.project.line.left).split('px')[0])
    this.totalOffsetY = Number(String(this.project.line.top).split('px')[0])
    // 获取页面比例缩放
    this.referSubscription.add(
      this._dataTransmissionService.getPageScaleChange().subscribe(() => {
        // 变化后的比例
        const trueScale = Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100
        // totalOffset / 变化之前的比例 = 100% 情况下距离左边的距离 * 变化后比例 = 实际距离
        if (this.referLine === 'row') {
          this._render.setStyle(this._el.nativeElement, 'top', (this.totalOffsetY / this.scale) * trueScale + 'px')
        } else if (this.referLine === 'col') {
          this._render.setStyle(this._el.nativeElement, 'left', (this.totalOffsetX / this.scale) * trueScale + 'px')
        }
      })
    )
  }
  // tooltip
  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event) {
    const trueScale = Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100
    const elTop = this._el.nativeElement.offsetTop
    const elLeft = this._el.nativeElement.offsetLeft
    const tip = this._render.createElement('div')

    // 动态创建参考线
    this._render.appendChild(this._el.nativeElement, tip)
    this._render.addClass(tip, 'referTip')

    if (this.referLine === 'row') {
      this._render.addClass(tip, 'referTipX')
      this._render.setStyle(tip, 'left', event.offsetX + 'px')
      // tooltip text
      tip.innerHTML = `Y: ${Math.floor(elTop / trueScale)}`
    } else {
      this._render.addClass(tip, 'referTipY')
      this._render.setStyle(tip, 'top', event.offsetY + 'px')
      // tooltip text
      tip.innerHTML = `X: ${Math.floor(elLeft / trueScale)}`
    }
  }

  // tooltip
  @HostListener('mousemove', ['$event'])
  onMouseMove(event) {
    const tip = document.querySelector('.referTip')
    // 修正 tooltip 的位置
    if (this.referLine === 'row') {
      this._render.addClass(tip, 'referTipX')
      // + 10 调整样式
      this._render.setStyle(tip, 'left', event.offsetX + 10 + 'px')
    } else {
      this._render.addClass(tip, 'referTipY')
      // + 10 调整样式
      this._render.setStyle(tip, 'top', event.offsetY + 10 + 'px')
    }
  }

  // tooltip
  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event) {
    // 鼠标移出参考线，移除对应 tooltip
    const tip = document.querySelector('.referTip')
    this._render.removeChild(this._el.nativeElement, tip)
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    // 记录鼠标按下
    this.isDown = true

    // 记录初始坐标
    this.disX = event.clientX
    this.disY = event.clientY

    // 修正初始化偏移量
    this.totalOffsetX = this._el.nativeElement.offsetLeft
    this.totalOffsetY = this._el.nativeElement.offsetTop
  }

  // tooltip
  @HostListener('click', ['$event'])
  onMouseClick(event) {
    this.clickReferLine.emit(this.id)
  }

  @HostListener('document:mousemove', ['$event'])
  onMousemove(event) {
    if (this.isDown) {
      const trueScale = Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100

      const left = this.totalOffsetX + event.clientX - this.disX
      const top = this.totalOffsetY + event.clientY - this.disY

      const tip = document.querySelector('.referTip')

      if (this.referLine === 'row') {
        // 处理移动
        const leftx =
          (document.querySelector('#focal').getBoundingClientRect() as any).x -
          (document.querySelector('.left-content').getBoundingClientRect() as any).width -
          (document.querySelector('.scrollable').getBoundingClientRect() as any).width
        const widthX = (document.querySelector('.edit-container') as HTMLElement).offsetWidth
        this._render.setStyle(this._el.nativeElement, 'left', -leftx + 'px')
        this._render.setStyle(this._el.nativeElement, 'width', widthX + 'px')
        this._render.setStyle(this._el.nativeElement, 'top', top + 'px')

        // 处理删除
        this.delFlag = top > this.project.height * trueScale || top < 0

        // 处理 tooltip
        if (!tip) return
        tip.innerHTML = this.delFlag ? '释放删除' : `Y: ${Math.floor(top / trueScale)}`
      } else {
        // 处理移动
        this._render.setStyle(this._el.nativeElement, 'left', left + 'px')
        this._render.setStyle(this._el.nativeElement, 'top', -46 + 'px')

        // 处理删除
        this.delFlag = left > this.project.width * trueScale || left < 0

        // 处理 tooltip
        if (!tip) return
        tip.innerHTML = this.delFlag ? '释放删除' : `X: ${Math.floor(left / trueScale)}`
      }
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event) {
    if (this.isDown) {
      // 记录结束位置坐标
      this.totalOffsetX += event.clientX - this.disX
      this.totalOffsetY += event.clientY - this.disY
      // 记录移动参考线后缩放比例
      this.scale = Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100

      // 是否触发删除操作
      if (this.delFlag) {
        this.referData.emit({
          type: 'deleteReferLine',
          id: this.id,
        })
      } else {
        // 更新坐标
        this.referData.emit({
          type: 'updateReferLine',
          data: {
            id: this.id,
            left: this.totalOffsetX / this.scale + 'px',
            top: this.totalOffsetY / this.scale + 'px',
            direction: this.referLine,
          },
        })
      }
      // 鼠标点击重置
      this.isDown = false
    }
  }

  ngOnDestroy(): void {
    this.referSubscription.unsubscribe()
  }
}
