import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import * as fromRoot from '../../../../states/reducers'
import { Store } from '@ngrx/store'
import * as ProjectModels from '../../../../states/models/project.model'
import * as _ from 'lodash'
import { Subscription } from 'rxjs'
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'lx-image-settings',
  templateUrl: './image-settings.component.html',
  styleUrls: ['./image-settings.component.scss'],
})
export class ImageSettingsComponent implements OnInit {
  mySubscription = new Subscription()
  themeColorList
  borderStyle = [
    '无',
    '<svg width="65" height="7"><line stroke-dasharray="65" x1="0" y1="1" x2="66" y2="1" stroke-width="2" stroke="#ffffff"></line></svg>',
    '<svg width="65" height="7"><line stroke-dasharray="4, 2" x1="0" y1="1" x2="66" y2="1" stroke-width="2" stroke="#ffffff"></line></svg>',
    '<svg width="65" height="7"><line stroke-dasharray="2, 2" x1="0" y1="1" x2="66" y2="1" stroke-width="2" stroke="#ffffff"></line></svg>',
  ]
  borderStyleIndex: number = 0
  borderWidth: number = 0
  tooltipText: string

  title = ''
  width = ''
  height = ''
  rotate = 0
  ratio
  sizeLock = false

  radius
  opacity
  shadowRadius
  shadowAngle
  shadowBlur
  shadowOpacity
  shadowColor

  isShadowOpen: boolean = true
  shadowNum: number = 0

  colors: any[] = []
  borderColors: string

  curBlock
  curPageId: string
  projectId: string

  // 配置显示项
  showRadius: boolean = true
  showSizeOption: boolean = true

  @ViewChild('borderWidthInput') borderWidthInput: ElementRef

  constructor(private _store: Store<fromRoot.State>, private _router: ActivatedRoute) {}

  ngOnInit() {
    this.projectId = this._router.snapshot.queryParams.project
    this.initShapeData()
    this.mySubscription.add(
      this._store.select(fromRoot.getCurrentProjectFull).subscribe((project) => {
        this.themeColorList = project.article.contents.theme.colors
      })
    )
  }

  // 初始化数据
  initShapeData() {
    if (this.curBlock) {
      // 不透明度
      this.opacity = this.curBlock.props.opacity

      // 圆角
      this.radius = this.curBlock.props.borderRadius

      // 图片阴影
      this.isShadowOpen = this.curBlock.props.shadow.display
      this.shadowRadius = this.curBlock.props.shadow.shadowRadius // 距离
      this.shadowAngle = this.curBlock.props.shadow.shadowAngle // 角度
      this.shadowBlur = this.curBlock.props.shadow.shadowBlur // 模糊大小
      this.shadowOpacity = this.curBlock.props.shadow.shadowOpacity // 透明度
      this.shadowColor = this.curBlock.props.shadow.shadowColor // 颜色
      // 启用透明度单独配置 加入颜色模块统一渲染
      if (this.shadowOpacity !== 100) {
        if (this.shadowColor.length === 4) {
          this.shadowColor =
            this.shadowColor[0] +
            this.shadowColor[1] +
            this.shadowColor[1] +
            this.shadowColor[2] +
            this.shadowColor[2] +
            this.shadowColor[3] +
            this.shadowColor[3]
        }
        this.shadowColor =
          this.shadowColor.substring(0, 7) +
          Math.round(this.shadowOpacity * 2.55)
            .toString(16)
            .padStart(2, '0')
        this.shadowOpacity = 100
      }

      // 边框样式 && 颜色
      this.borderWidth = this.curBlock.props.border.strokeWidth
      this.borderColors = this.curBlock.props.border.strokeColor

      // 初始化下拉框
      switch (this.curBlock.props.border.strokeType) {
        case 'default':
          this.borderStyleIndex = 0
          break

        case 'solid':
          this.borderStyleIndex = 1
          break

        case 'dashed':
          this.borderStyleIndex = 2
          break

        case 'dotted':
          this.borderStyleIndex = 3
          break

        default:
          break
      }
    }
  }

  // 接收数据
  updateBlock(block: ProjectModels.Block, pageId?: string) {
    this.curBlock = _.cloneDeep(block)
    this.curPageId = _.cloneDeep(pageId)
    // 数据变化的时候，更新面板
    this.initShapeData()
  }

  // 更新数据
  updateCurBlock() {
    let block = _.cloneDeep(this.curBlock)
    let newData: any = {
      target: {
        blockId: block.blockId,
        pageId: this.curPageId,
        type: block.type,
      },
      method: 'put',
      block: block as any,
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
  }

  // 长度 && 宽度 && 旋转角度
  onSizeChanged(event) {
    const blockProps = this.curBlock.props

    blockProps.size.height = event.value0
    blockProps.size.width = event.value1
    blockProps.size.rotate = event.value2

    if (event.type === 'locked') {
      blockProps.size.ratio = event.locked ? blockProps.size.height / blockProps.size.width : null
      this.ratio = blockProps.size.ratio
    }

    this.updateCurBlock()
  }

  // 阴影开关
  tooltipSwitch(e) {
    this.isShadowOpen = e
    this.curBlock.props.shadow.display = this.isShadowOpen
    this.updateCurBlock()
  }

  // 圆角 && 透明度 图片阴影
  onInput(value, type) {
    const blockProps = this.curBlock.props
    switch (type) {
      case 'radius':
        blockProps.borderRadius = value
        break
      case 'opacity':
        blockProps.opacity = value
        break
      case 'borderWidth':
        // blockProps.border.strokeWidth = value.target.value;
        blockProps.border.strokeWidth = value
        break
      case 'shadowRadius':
        blockProps.shadow.shadowRadius = value
        break
      case 'shadowAngle':
        blockProps.shadow.shadowAngle = value
        break
      case 'shadowBlur':
        blockProps.shadow.shadowBlur = value
        break
      case 'shadowOpacity':
        blockProps.shadow.shadowOpacity = value
        break
    }
    this.updateCurBlock()
  }

  onInputHandle(event) {
    if (event.keyCode == '13') {
      this.borderWidthInput.nativeElement.blur()
    }
  }

  // 线条样式
  changeBorderStyle(event) {
    this.borderStyleIndex = event
    const blockProps = this.curBlock.props
    switch (event) {
      case 0:
        blockProps.border.strokeType = 'none'
        break
      case 1:
        blockProps.border.strokeType = 'solid'
        break
      case 2:
        blockProps.border.strokeType = 'dashed'
        break
      case 3:
        blockProps.border.strokeType = 'dotted'
        break
      default:
        break
    }
    this.updateCurBlock()
  }

  // 线条颜色 阴影颜色
  changeColor(event: string, type: string, data: any) {
    const blockProps = this.curBlock.props
    if (type == 'border') {
      switch (event) {
        case 'borderDragEnd':
          blockProps.border.strokeColor = data
          break
        case 'borderChange':
          blockProps.border.strokeColor = data
          break
        case 'borderColorPickerClick':
          blockProps.border.strokeColor = data
          break
        case 'default':
          break
      }
    } else if (type == 'shadow') {
      switch (event) {
        case 'borderDragEnd':
          blockProps.shadow.shadowColor = data
          break
        case 'borderChange':
          blockProps.shadow.shadowColor = data
          break
        case 'borderColorPickerClick':
          blockProps.shadow.shadowColor = data
          break
        case 'default':
          break
      }
    }
    this.updateCurBlock()
  }
}
