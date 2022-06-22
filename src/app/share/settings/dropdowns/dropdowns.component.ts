import { Component, OnInit, Input, Output, EventEmitter, ElementRef, SimpleChange, ViewChild } from '@angular/core'
declare const FontFaceObserver: any
import * as _ from 'lodash'
@Component({
  selector: 'lx-settings-dropdowns',
  templateUrl: './dropdowns.component.html',
  styleUrls: ['./dropdowns.component.scss'],
})
export class DropdownsComponent implements OnInit {
  @Input() index: number = 0
  @Input() theme: string = ''
  @Input() values: any[]
  @Input() isDisabled: boolean = false
  @Input() type: string
  @Input() id: string
  @Input() listIndex: any
  @Input() isBackgroundColor: boolean = false
  @Input() loadFont: any
  @Input() selector: any
  @Input() fontSelector: any
  @Output() onChanged = new EventEmitter()
  @Input() firstSize = 0
  @ViewChild('dropdown') dropdown
  autoClose: boolean = true
  isChinese: boolean = true
  oldValues: any[]

  // 文字映射
  fontFamilyListText = [
    // 'Noto Sans SC',
    '方正黑体',
    '方正楷体',
    '方正书宋',
    '方正仿宋',
    '站酷高端黑',
    // 'Droid Sans Fallback',
    '阿里巴巴普惠体 细体',
    '阿里巴巴普惠体 常规',
    '阿里巴巴普惠体 中等',
    '阿里巴巴普惠体 粗体',
    '阿里巴巴普惠体 特粗',
    '思源宋体 加细',
    '思源宋体 细体',
    '思源宋体 常规',
    '思源宋体 半粗',
    '思源宋体 中粗',
    '思源宋体 加粗',
    '思源宋体 超粗',
    '思源黑体 极细',
    '思源黑体 纤细',
    '思源黑体 细体',
    '思源黑体 常规',
    '思源黑体 中黑',
    '思源黑体 黑体',
    '思源黑体 粗体',
    'Caveat-Bold',
    'Caveat-Regular',
    'DancingScript-Bold',
    'DancingScript-Regular',
    'Girassol-Regular',
    'IbarraRealNova-Italic',
    'IbarraRealNova-SemiBold',
    'NotoSerif-Italic',
    'NotoSerif-Regular',
    'Orbitron Black',
    'Orbitron Light',
    'PlayfairDisplay-Bold',
    'PlayfairDisplay-Italic',
    'PlayfairDisplay-Regular',
    'Solway-ExtraBold',
    'Solway-Light',
  ]

  constructor(private _el: ElementRef) {}

  onClicked(index) {
    this.index = index
    this.onChanged.emit(index)
    const that = this
    if (!this._el.nativeElement.querySelector('.font-loading')) {
      return
    }
    this._el.nativeElement.querySelector('.font-loading').style.display = 'block'
    var font = new FontFaceObserver(this.fontFamilyListText[index])
    font.load(null, 15000).then(function () {
      that._el.nativeElement.querySelector('.font-loading').style.display = 'none'
    })
  }

  ngOnInit() {
    if (this.firstSize !== 0) {
      this.autoClose = false
      document.addEventListener('click', this.allClick.bind(this))
      this.oldValues = _.cloneDeep(this.values)
      this.selectType(this.index < this.firstSize)
    }

    // 针对分组气泡图，圆堆积图，散点图（顺序依次如下）的映射面板单独处理
    if (this.id === '4612096174443311107') {
      if (this.listIndex === 0 || this.listIndex === 1 || this.listIndex === 3) {
        const newValues = this.values.concat()
        newValues.pop()
        this.values = newValues
      }
    } else if (this.id === '8000000011111111004') {
      if (this.listIndex === 3 || this.listIndex === 4) {
        const newValues = this.values.concat()
        newValues.pop()
        this.values = newValues
      }
    } else if (this.id === '7955555555502346002') {
      if (this.listIndex !== 0) {
        const newValues = this.values.concat()
        newValues.pop()
        this.values = newValues
      }
    }

    if (this.fontSelector) {
      this.index = this.fontFamilyListText.indexOf(this.fontSelector)
    }

    if (this.selector) {
      this.index = this.values.indexOf(this.selector)
    }
  }

  ngOnChanges(changes: SimpleChange) {
    // console.log(changes);
    if (changes['selector'] && !changes['selector'].firstChange && changes['selector'].currentValue) {
      this.index = this.values.indexOf(this.selector)
    }
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.allClick.bind(this))
  }

  selectType(flag) {
    this.isChinese = flag
  }

  allClick() {
    var e = e || window.event
    if (!this._el.nativeElement.contains(e.target)) {
      this.dropdown.hide()
    }
  }
}
