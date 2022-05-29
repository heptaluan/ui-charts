/*
 * @Description: shape 配置项
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import * as fromRoot from '../../../../states/reducers'
import { Store } from '@ngrx/store'
import * as ProjectModels from '../../../../states/models/project.model'
import * as _ from 'lodash'
import { Observable, Subscription } from 'rxjs'
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action'
import { ChartMapService } from '../../../../block/chart-map.service'
import { ActivatedRoute } from '@angular/router'
import { ShapeMapService } from '../../../../block/shape-map.service'

@Component({
  selector: 'lx-shape-settings',
  templateUrl: './shape-settings.component.html',
  styleUrls: ['./shape-settings.component.scss'],
})
export class ShapeSettingsComponent implements OnInit {
  mySubscription = new Subscription()
  themeColorList
  fillStyle = ['无', '填充颜色']
  fillStyleIndex: number = 0

  lineStyle = ['直线', '空心箭头', '实心箭头', '小圆点', '大圆点', '矩形']
  lineStyleIndex: number = 0

  borderStyle = [
    '无',
    '<svg width="65" height="7"><line stroke-dasharray="65" x1="0" y1="1" x2="65" y2="1" stroke-width="2" stroke="#ffffff"></line></svg>',
    '<svg width="65" height="7"><line stroke-dasharray="4, 2" x1="0" y1="1" x2="65" y2="1" stroke-width="2" stroke="#ffffff"></line></svg>',
    '<svg width="65" height="7"><line stroke-dasharray="2, 2" x1="0" y1="1" x2="65" y2="1" stroke-width="2" stroke="#ffffff"></line></svg>',
  ]

  borderStyleIndex: number = 0
  borderWidth: number = 0
  tooltipText: string

  arrowStart = [
    '<svg width="55" height="70" viewBox="0 0 18 30" transform="scale(-1,1)"><line x1="0" y1="15" x2="16" y2="15" stroke-width="2" stroke="white" vector-effect="non-scaling-stroke"></line></svg>',
    '<svg width="55" height="70" viewBox="0 0 18 30" transform="scale(-1,1)"><line x1="0" y1="15" x2="16" y2="15" stroke-width="2" stroke="white" vector-effect="non-scaling-stroke"></line><path stroke="white" vector-effect="non-scaling-stroke" fill="transparent" stroke-width="2" d="M 13,12 17,15 13,18"></path></svg>',
    '<svg width="55" height="70" viewBox="0 0 18 30" transform="scale(-1,1)"><line x1="0" y1="15" x2="16" y2="15" stroke-width="2" stroke="white" vector-effect="non-scaling-stroke"></line><path stroke="white" vector-effect="non-scaling-stroke" fill="white" d="M 13,12 17,15 13,18 z"></path></svg>',
    '<svg width="55" height="70" viewBox="0 0 18 30" transform="scale(-1,1)"><line x1="0" y1="15" x2="16" y2="15" stroke-width="2" stroke="white" vector-effect="non-scaling-stroke"></line><circle stroke="white" vector-effect="non-scaling-stroke" fill="white" cx="15" cy="15" r="1"></circle></svg>',
    '<svg width="55" height="70" viewBox="0 0 18 30" transform="scale(-1,1)"><line x1="0" y1="15" x2="16" y2="15" stroke-width="2" stroke="white" vector-effect="non-scaling-stroke"></line><circle stroke="white" vector-effect="non-scaling-stroke" fill="white" cx="15" cy="15" r="2"></circle></svg>',
    '<svg width="55" height="70" viewBox="0 0 18 30" transform="scale(-1,1)"><line x1="0" y1="15" x2="16" y2="15" stroke-width="2" stroke="white" vector-effect="non-scaling-stroke"></line><path stroke="white" vector-effect="non-scaling-stroke" fill="white" d="M 13,13 17,13 17,17 13,17 z"></path></svg>',
  ]

  arrowEnd = [
    '<svg width="55" height="70" viewBox="0 0 18 30" transform="scale(-1,1)"><line x1="0" y1="15" x2="16" y2="15" stroke-width="2" stroke="white" vector-effect="non-scaling-stroke"></line></svg>',
    '<svg width="55" height="70" viewBox="0 0 18 30"><line x1="0" y1="15" x2="16" y2="15" stroke-width="2" stroke="white" vector-effect="non-scaling-stroke"></line><path stroke="white" vector-effect="non-scaling-stroke" fill="transparent" stroke-width="2" d="M 13,12 17,15 13,18"></path></svg>',
    '<svg width="55" height="70" viewBox="0 0 18 30"><line x1="0" y1="15" x2="16" y2="15" stroke-width="2" stroke="white" vector-effect="non-scaling-stroke"></line><path stroke="white" vector-effect="non-scaling-stroke" fill="white" d="M 13,12 17,15 13,18 z"></path></svg>',
    '<svg width="55" height="70" viewBox="0 0 18 30"><line x1="0" y1="15" x2="16" y2="15" stroke-width="2" stroke="white" vector-effect="non-scaling-stroke"></line><circle stroke="white" vector-effect="non-scaling-stroke" fill="white" cx="15" cy="15" r="1"></circle></svg>',
    '<svg width="55" height="70" viewBox="0 0 18 30"><line x1="0" y1="15" x2="16" y2="15" stroke-width="2" stroke="white" vector-effect="non-scaling-stroke"></line><circle stroke="white" vector-effect="non-scaling-stroke" fill="white" cx="15" cy="15" r="2"></circle></svg>',
    '<svg width="55" height="70" viewBox="0 0 18 30"><line x1="0" y1="15" x2="16" y2="15" stroke-width="2" stroke="white" vector-effect="non-scaling-stroke"></line><path stroke="white" vector-effect="non-scaling-stroke" fill="white" d="M 13,13 17,13 17,17 13,17 z"></path></svg>',
  ]

  arrowStartIndex: number = 0
  arrowEndIndex: number = 0

  title = ''
  width = ''
  height = ''
  rotate = 0
  ratio
  sizeLock = false

  radius
  opacity

  colors: any[] = []
  borderColors: string
  isShadowOpen: boolean
  shadowColor: string
  shadowRadius
  shadowAngle
  shadowBlur
  shadowOpacity
  @ViewChild('borderWidthInput') borderWidthInput: ElementRef
  @ViewChild('tooltipInput') tooltipInput: ElementRef

  curBlock
  curPageId: string
  projectId: string

  // 配置显示项
  showRadius: boolean = true
  showSizeOption: boolean = true
  showArrowOption: boolean = false

  constructor(
    private _store: Store<fromRoot.State>,
    private _chartMapService: ChartMapService,
    private _router: ActivatedRoute,
    private _el: ElementRef,
    private _shapeMapService: ShapeMapService
  ) {}

  ngOnInit() {
    this.projectId = this._router.snapshot.queryParams.project
    this.initShapeData()
    this.mySubscription.add(
      this._store.select(fromRoot.getCurrentProjectFull).subscribe((project) => {
        this.themeColorList = project.article.contents.theme.colors
      })
    )
    // 针对直线，单独处理
    if (this.curBlock.shapeType === 'line') {
      this.borderStyle = [
        '<svg width="65" height="7"><line stroke-dasharray="65" x1="0" y1="1" x2="66" y2="1" stroke-width="2" stroke="white"></line></svg>',
        '<svg width="65" height="7"><line stroke-dasharray="4, 2" x1="0" y1="1" x2="66" y2="1" stroke-width="2" stroke="white"></line></svg>',
        '<svg width="65" height="7"><line stroke-dasharray="2, 2" x1="0" y1="1" x2="66" y2="1" stroke-width="2" stroke="white"></line></svg>',
      ]
    }
  }

  ngOnDestroy() {}

  // 初始化数据
  initShapeData() {
    if (this.curBlock) {
      // 暂时隐藏图标渐变
      if (this.curBlock.shapeType === 'icon') {
        this.fillStyle = this.fillStyle.slice(0, 2)
      }

      // 标题
      this.title = this.curBlock.title

      // 各元素取圆角方式不同，需要针对处理
      if (this.curBlock.shapeType === 'rectangle' || this.curBlock.shapeType === 'round-rectangle') {
        this.radius = this.curBlock.props.specified.rx
      }

      if (this.curBlock.openGradient) {
        this.fillStyleIndex = 2
      } else {
        this.curBlock.props.fill.fillColor[0] === 'transparent' ? (this.fillStyleIndex = 0) : (this.fillStyleIndex = 1)
      }
      // 透明度
      this.opacity = this.curBlock.props.opacity

      // 填充颜色
      this.colors[0] = this.curBlock.props.fill.fillColor[0]

      // 启用透明度单独配置 加入颜色模块统一渲染
      if (this.opacity !== 100) {
        if (this.colors[0].length === 4) {
          this.colors[0] =
            this.colors[0][0] +
            this.colors[0][1] +
            this.colors[0][1] +
            this.colors[0][2] +
            this.colors[0][2] +
            this.colors[0][3] +
            this.colors[0][3]
        }
        this.curBlock.props.fill.fillColor[0] =
          this.colors[0].substring(0, 7) +
          Math.round(this.opacity * 2.55)
            .toString(16)
            .padStart(2, '0')
        this.curBlock.props.opacity = 100
        this.opacity = 100
        this.colors[0] = this.curBlock.props.fill.fillColor[0]
        this.updateCurBlock()
      }

      // 边框样式 && 颜色
      this.borderWidth = this.curBlock.props.strokeWidth
      this.borderColors =
        this.curBlock.props.strokeColor === 'transparent' ? '#c759a1ff' : this.curBlock.props.strokeColor

      this.isShadowOpen = this.curBlock.props.shadow.display // 阴影开关
      this.shadowColor = this.curBlock.props.shadow.shadowColor // 颜色
      this.shadowRadius = this.curBlock.props.shadow.shadowRadius // 距离
      this.shadowAngle = this.curBlock.props.shadow.shadowAngle // 角度
      this.shadowBlur = this.curBlock.props.shadow.shadowBlur // 模糊大小
      // 初始化下拉框
      switch (this.curBlock.props.strokeType) {
        case 'default':
          this.borderStyleIndex = 0
          break

        case 'solid':
          if (this.curBlock.shapeType === 'line') {
            this.borderStyleIndex = 0
          } else {
            this.borderStyleIndex = 1
          }
          break

        case 'dashed':
          if (this.curBlock.shapeType === 'line') {
            this.borderStyleIndex = 1
          } else {
            this.borderStyleIndex = 2
          }
          break

        case 'pointLine':
          if (this.curBlock.shapeType === 'line') {
            this.borderStyleIndex = 2
          } else {
            this.borderStyleIndex = 3
          }
          break

        default:
          break
      }

      // 提示文字
      this.tooltipText = this.curBlock.props.tooltipText

      // 显示对应配置项
      if (
        this.curBlock.shapeType === 'oval' ||
        this.curBlock.shapeType === 'triangle' ||
        this.curBlock.shapeType === 'pentagon' ||
        this.curBlock.shapeType === 'icon'
      ) {
        this.showRadius = false
      } else if (this.curBlock.shapeType === 'line') {
        this.showSizeOption = false
        this.showArrowOption = true
        this.showRadius = false
      }
    }
  }

  // 起点、终点、样式
  onDropDownChanged(e, type) {}

  // 长度 && 宽度 && 旋转角度
  onSizeChanged(event) {
    const blockProps = this.curBlock.props
    blockProps.fill.height = event.value0 - blockProps.strokeWidth
    blockProps.fill.width = event.value1 - blockProps.strokeWidth

    blockProps.size.height = event.value0
    blockProps.size.width = event.value1
    blockProps.size.rotate = event.value2

    if (event.type === 'locked') {
      blockProps.size.ratio = event.locked ? blockProps.size.height / blockProps.size.width : null
      this.ratio = blockProps.size.ratio
    }
    switch (this.curBlock.shapeType) {
      // 圆形（矩形 && 圆角矩形取默认）
      case 'oval':
        this.setRadiusOfCircle(blockProps)
        break

      // 三角形
      case 'triangle':
        const triangleBoxWidth = blockProps.size.width
        const triangleBoxHeight = blockProps.size.height
        this.curBlock.path = `${
          triangleBoxWidth / 2
        } 0, 0, ${triangleBoxHeight}, ${triangleBoxWidth}, ${triangleBoxHeight}`
        break

      // 五边形
      case 'pentagon':
        const pentagonBoxWidth = blockProps.size.width
        const pentagonBoxHeight = blockProps.size.height
        this.curBlock.path = `${pentagonBoxWidth / 2} 0, ${pentagonBoxWidth} ${pentagonBoxHeight * 0.4}, ${
          pentagonBoxWidth * 0.85
        } ${pentagonBoxHeight}, ${pentagonBoxWidth * 0.15} ${pentagonBoxHeight}, 0 ${pentagonBoxHeight * 0.4}`
        break

      default:
        break
    }

    this.updateCurBlock()
  }

  // 圆角 && 透明度
  onInput(value, type) {
    if (type === 'radius') {
      this.curBlock.props.specified.rx = value
      this.curBlock.props.specified.ry = value
    } else if (type == 'opacity') {
      this.curBlock.props.opacity = value
    } else if (type == 'shadowRadius') {
      this.curBlock.props.shadow.shadowRadius = value
    } else if (type == 'shadowAngle') {
      this.curBlock.props.shadow.shadowAngle = value
    } else if (type == 'shadowBlur') {
      this.curBlock.props.shadow.shadowBlur = value
    }
    this.updateCurBlock()
  }

  // 填充样式
  onColorListDropDownChanged(event) {
    this.fillStyleIndex = event
    switch (event) {
      case 0:
        this.colors[0] = 'transparent'
        this.curBlock.props.fill.fillColor[0] = 'transparent'
        this.curBlock.openGradient = false
        this.updateCurBlock()
        break
      case 1:
        this.curBlock.openGradient = false
        this.colors[0] = '#129cff'
        this.curBlock.props.fill.fillColor[0] = '#129cff'
        this.updateCurBlock()
        break
      case 2:
        this.colors = ['red', '#000']
        this.curBlock.props.fill.fillColor[1] = ['red', '#000']
        this.curBlock.openGradient = true
        this.updateCurBlock()
        break
      default:
        break
    }
  }

  // 填充样式 color-picker
  public changeColor(event: string, data: any, colorType?: string, i?: number): void {
    if (colorType && colorType === 'linear') {
      switch (event) {
        case 'cpSliderDragEnd':
        case 'cpInputChange':
          this.curBlock.props.fill.fillColor[i] = data
          break
        case 'colorPickerClick':
          this.curBlock.props.fill.fillColor[i] = data
          this.fillStyleIndex = 2
          break
        default:
          break
      }
      this.updateCurBlock()
    } else {
      switch (event) {
        case 'cpSliderDragEnd':
        case 'cpInputChange':
          this.curBlock.props.fill.fillColor[0] = data
          break
        case 'colorPickerClick':
          this.curBlock.props.fill.fillColor[0] = data
          this.fillStyleIndex = 1
          break
        default:
          break
        case 'borderChange':
        case 'borderDragEnd':
          this.curBlock.props.strokeColor = data
          break
        case 'borderColorPickerClick':
          this.curBlock.props.strokeColor = data
          break
        case 'shadow':
          this.curBlock.props.shadow.shadowColor = data
          break
      }
      this.updateCurBlock()
    }
  }

  // 线条样式
  onBorderDropDownChanged(event) {
    this.borderStyleIndex = event
    const blockProps = this.curBlock.props

    if (this.curBlock.shapeType === 'line') {
      switch (event) {
        case 0:
          if (blockProps.strokeColor === 'transparent') {
            this.setBorderDefaultStyle(blockProps)
          }
          blockProps.strokeDasharray = '0, 0'
          blockProps.strokeType = 'solid'
          break
        case 1:
          if (blockProps.strokeColor === 'transparent') {
            this.setBorderDefaultStyle(blockProps)
          }
          blockProps.strokeDasharray = '10, 10'
          blockProps.strokeType = 'dashed'
          break
        case 2:
          if (blockProps.strokeColor === 'transparent') {
            this.setBorderDefaultStyle(blockProps)
          }
          blockProps.strokeDasharray = '5, 5'
          blockProps.strokeType = 'pointLine'
          break
        default:
          break
      }
    } else {
      switch (event) {
        case 0:
          this.borderWidth = 0
          this.borderColors = 'transparent'
          blockProps.strokeWidth = 0
          blockProps.strokeColor = 'transparent'
          blockProps.strokeType = 'default'

          if (this.curBlock.shapeType === 'rectangle' || this.curBlock.shapeType === 'round-rectangle') {
            blockProps.fill.width = blockProps.size.width
            blockProps.fill.height = blockProps.size.height
            blockProps.specified.x = 0
            blockProps.specified.y = 0
          } else if (this.curBlock.shapeType === 'oval') {
            blockProps.fill.width = blockProps.size.width
            blockProps.fill.height = blockProps.size.height
            blockProps.specified.cx = blockProps.size.width / 2
            blockProps.specified.cy = blockProps.size.height / 2
            blockProps.specified.rx = blockProps.size.width / 2
            blockProps.specified.ry = blockProps.size.height / 2
          } else if (this.curBlock.shapeType === 'triangle') {
            const boxWidth = blockProps.size.width
            const boxHeight = blockProps.size.height
            this.curBlock.path = `${boxWidth / 2} 0, 0, ${boxHeight}, ${boxWidth}, ${boxHeight}`
          }

          break
        case 1:
          if (blockProps.strokeColor === 'transparent') {
            this.setBorderDefaultStyle(blockProps)
          }
          blockProps.strokeDasharray = '0, 0'
          blockProps.strokeType = 'solid'
          break
        case 2:
          if (blockProps.strokeColor === 'transparent') {
            this.setBorderDefaultStyle(blockProps)
          }
          blockProps.strokeDasharray = '10, 10'
          blockProps.strokeType = 'dashed'
          break
        case 3:
          if (blockProps.strokeColor === 'transparent') {
            this.setBorderDefaultStyle(blockProps)
          }
          blockProps.strokeDasharray = '5, 5'
          blockProps.strokeType = 'pointLine'
          break
        default:
          break
      }
    }

    this.updateCurBlock()
  }

  // 设置边框默认样式
  setBorderDefaultStyle(blockProps, width?) {
    this.borderWidth = width ? width : 1
    this.borderColors = '#c759a1ff'
    blockProps.strokeWidth = width ? width : 1
    blockProps.strokeColor = '#c759a1ff'

    switch (this.curBlock.shapeType) {
      case 'rectangle':
      case 'round-rectangle':
        blockProps.fill.width = width ? blockProps.size.width - width : blockProps.size.width
        blockProps.fill.height = width ? blockProps.size.height - width : blockProps.size.height
        blockProps.specified.x = 0
        blockProps.specified.y = 0
        break
      case 'oval':
        this.setRadiusOfCircle(blockProps)
        break
      case 'triangle':
        const boxWidth = blockProps.size.width
        const boxHeight = blockProps.size.height
        this.curBlock.path = `
          ${boxWidth / 2} 0,
          0, ${boxHeight},
          ${boxWidth}, ${boxHeight}
        `
        break
    }
  }

  // 设置边框指定宽度（因为 SVG 图形的特殊性，添加边框的同时需要缩减图形的长宽）
  setBorderStyle(borderWidth) {
    const blockProps = this.curBlock.props
    const blockType = this.curBlock.shapeType
    // 对直线及其他形状边框宽度做限制
    if (borderWidth > 10000) {
      borderWidth = 10000
    } else if (borderWidth < 1) {
      borderWidth = 1
    }
    if (
      blockType === 'rectangle' ||
      blockType === 'round-rectangle' ||
      blockType === 'oval' ||
      blockType === 'triangle' ||
      blockType === 'pentagon' ||
      blockType === 'icon'
    ) {
      if (borderWidth > 20) {
        borderWidth = 20
      }
    }
    this.borderWidth = borderWidth
    blockProps.strokeWidth = borderWidth
    switch (blockType) {
      case 'rectangle':
      case 'round-rectangle':
        if (borderWidth === 0) {
          blockProps.strokeDasharray = '0, 0'
          blockProps.fill.width = blockProps.size.width
          blockProps.fill.height = blockProps.size.height
          blockProps.specified.x = 0
          blockProps.specified.y = 0
        } else {
          blockProps.fill.width = blockProps.size.width - borderWidth
          blockProps.fill.height = blockProps.size.height - borderWidth
          blockProps.specified.x = 0
          blockProps.specified.y = 0
        }
        break
      case 'oval':
        this.setRadiusOfCircle(blockProps)
        break
      default:
        break
    }
  }

  // 边框长度
  borderWidthInputBlurHandle(event) {
    if (this.curBlock.props.strokeColor === 'transparent') {
      this.borderStyleIndex = 1
      this.curBlock.props.strokeDasharray = '0, 0'
      this.curBlock.props.strokeType = 'solid'
      this.setBorderDefaultStyle(this.curBlock.props, event)
    } else {
      this.setBorderStyle(event)
    }

    this.updateCurBlock()
  }

  // 提示文字
  tooltipInputBlurHandle(event) {
    if (event.target.value.trim() !== '') {
      this.curBlock.props.tooltip = true
      this.curBlock.props.tooltipText = event.target.value
    } else {
      this.curBlock.props.tooltip = false
      this.curBlock.props.tooltipText = null
    }
    this.tooltipText = event.target.value.trim()
    this.updateCurBlock()
  }

  // input 只处理键盘事件和触发失去焦点事件，其余在各自对应的事件当中处理
  onInputHandle(event) {
    if (event.keyCode == '13') {
      // this.borderWidthInput.nativeElement.blur();
      this.tooltipInput.nativeElement.blur()
    }
  }

  // 接收 block
  updateBlock(block: ProjectModels.Block, pageId?: string) {
    this.curBlock = _.cloneDeep(block)
    this.curPageId = _.cloneDeep(pageId)
    // 数据变化的时候，重新加载面板
    this.initShapeData()
  }

  // 更新数据
  updateCurBlock(flag?) {
    let block = _.cloneDeep(this.curBlock)
    let newData: any = {
      target: {
        blockId: block.blockId,
        pageId: this.curPageId,
        type: block.type,
        target: flag ? 'redo' : null,
      },
      method: 'put',
      block: block as any,
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
  }

  // 设置圆形边框
  setRadiusOfCircle(blockProps) {
    blockProps.specified.cx = blockProps.size.width / 2
    blockProps.specified.cy = blockProps.size.height / 2
    blockProps.specified.rx = blockProps.size.width / 2
    blockProps.specified.ry = blockProps.size.height / 2
  }

  // 阴影开关
  tooltipSwitch(e) {
    this.isShadowOpen = e
    this.curBlock.props.shadow.display = this.isShadowOpen
    this.updateCurBlock()
  }
}
