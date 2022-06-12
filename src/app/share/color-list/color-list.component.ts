import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef,
  SimpleChanges,
} from '@angular/core'
import { WheelColorPickerComponent } from '../wheel-color-picker/wheel-color-picker.component'

interface ColorPickerData {
  clientRect: any
  isShowColorPicker: boolean
  themColorList: string[]
  isOpacityShow: boolean
  isOverflow: boolean
  isGradientShow: boolean
  colorSeleced: string
  left: number
  top: number
}

@Component({
  selector: 'lx-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss'],
})
export class ColorListComponent implements OnInit {
  @Input() clickPosition = ''

  @Input() isOpacityShow: boolean = true
  @Input() isOverflow: boolean = false
  @Input() isGradientShow: boolean = false
  @Input() themColorList = [
    '#4150d8',
    '#28bf7e',
    '#ed7c2f',
    '#f2a93b',
    '#f9cf36',
    '#4a5bdc',
    '#4cd698',
    '#f4914e',
    '#fcb75b',
    '#ffe180',
    '#b6c2ff',
    '#96edc1',
    '#ffbe92',
    '#ffd6ae',
  ]
  @Input() colorSeleced: string = '#ffffff'
  colorSelecedData: string = '#ffffff'
  @Output() onChanged = new EventEmitter()
  @ViewChild('dyncomp', { read: ViewContainerRef })
  private dyncomp: ViewContainerRef
  private comp: ComponentRef<WheelColorPickerComponent>

  public isShowColorPicker: boolean = false
  public bindFlag: boolean = false
  public isSingle: boolean = false

  constructor(private _el: ElementRef, private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.colorSeleced && changes.colorSeleced.currentValue) {
      this.colorSeleced = this.formatBackground(changes.colorSeleced.currentValue)
      this.colorSelecedData = changes.colorSeleced.currentValue
    }
  }

  ngOnInit() {}

  public formatBackground(color: string): string {
    return ~color.indexOf(',') ? this.formatGradientColor(JSON.parse(color.replace(RegExp("'", 'g'), '"'))) : color
  }

  public handleClicked(): void {
    if (this.clickPosition === 'bgColor') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-right-changeBgColor'])
    }
    this.isShowColorPicker = !this.isShowColorPicker
    this.bindFlag = this.isShowColorPicker
    const clientRect = this._el.nativeElement.getBoundingClientRect()
    this.loadColorPicked({
      clientRect: clientRect,
      isShowColorPicker: this.isShowColorPicker,
      themColorList: this.themColorList,
      isOpacityShow: this.isOpacityShow,
      isOverflow: this.isOverflow,
      isGradientShow: this.isGradientShow,
      colorSeleced: this.colorSelecedData,
      left: clientRect.x - 212,
      top: document.body.clientHeight - clientRect.y < 320 ? document.body.clientHeight - 320 : clientRect.y,
    })
  }

  // 点击菜单外部
  public onClickOutSide(): void {
    this.bindFlag = false
    this.isShowColorPicker = false
  }

  public loadColorPicked(data: ColorPickerData): void {
    if (this.isShowColorPicker) {
      try {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(WheelColorPickerComponent)
        this.dyncomp.clear()
        this.comp = this.dyncomp.createComponent(componentFactory)
        this.comp.instance.initRefData(data)
        this.comp.instance.onChanged.subscribe((res) => {
          if (res) {
            this.colorSeleced = this.formatBackground(res)
            this.onChanged.emit(res)
          }
        })
        this.comp.instance.onClosed.subscribe((res) => {
          res && this.comp.destroy()
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  // 转为渐变色显示
  private formatGradientColor(colorList: string[]): string {
    let length = colorList.length
    let colorPos = ''
    this.sortGradient(colorList).map((item) => {
      if (item.indexOf('angle') < 0) {
        colorPos += `${this.colorToRGB(item.split(':')[0], false)} ${this.toPercent(item.split(':')[1])},`
      }
    })
    colorPos = colorPos.substring(0, colorPos.length - 1)
    return `linear-gradient(${Number(colorList[length - 1].split(':')[1]) + 90}deg, ${colorPos})`
  }

  private sortGradient(colorList: string[]): any[] {
    let arr = [...colorList]
    for (let i = 0; i < arr.length - 2; i++) {
      for (let j = 0; j < arr.length - 2 - i; j++) {
        if (Number(arr[j].split(':')[1]) > Number(arr[j + 1].split(':')[1])) {
          var temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }
      }
    }
    return arr
  }

  private colorToRGB(color: string, flag: boolean = false): string | string[] {
    let color1, color2, color3, color4
    color = '' + color
    if (typeof color !== 'string') {
      return
    }
    if (color.charAt(0) === '#') {
      color = color.substring(1)
    } else {
      return color
    }
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
    }
    color4 = Math.round((parseInt(color.substring(7, 9), 16) / 255) * 100) / 100 || 1
    if (color.length === 8) {
      color4 = Math.round((parseInt(color[6] + color[7], 16) / 255) * 100) / 100
      color = color.substring(0, 6)
    }
    if (/^[0-9a-fA-F]{6}$/.test(color)) {
      color1 = parseInt(color.substr(0, 2), 16)
      color2 = parseInt(color.substr(2, 2), 16)
      color3 = parseInt(color.substr(4, 2), 16)
    }
    if (flag) {
      return [color1, color2, color3, color4]
    } else {
      return 'rgba(' + color1 + ',' + color2 + ',' + color3 + ',' + color4 + ')'
    }
  }

  private toPercent(point: number): string | number {
    if (point == 0) {
      return 0
    }
    var str = Number(Number(point) * 100).toFixed(2)
    str += '%'
    return str
  }
}
