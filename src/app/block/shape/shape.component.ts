import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../states/reducers'
import { ActivatedRoute } from '@angular/router'

import * as _ from 'lodash'
import * as $ from 'jquery'
import 'jquery-ui/ui/widgets//draggable'

import { UpdateCurrentProjectArticleAction } from '../../states/actions/project.action'
import { DataTransmissionService } from '../../share/services/data-transmission.service'
import { ShapeMapService } from '../shape-map.service'

@Component({
  selector: 'lx-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.scss'],
})
export class ShapeComponent implements OnInit {
  _data
  set data(val) {
    this._data = val
    if (val.setting) {
      this.initShapeData()
    }
  }
  get data() {
    return this._data
  }

  _isSelected
  set isSelected(val) {
    this._isSelected = val
  }
  get isSelected() {
    return this._isSelected
  }

  shapeBoxStyles
  iconStyles
  shapeStyles
  gradient
  dragItemOneStyles
  dragItemTwoStyles
  iconHTML
  projectId: string

  // 渐变配置项
  showLinearGradient
  linearGradientStart = {
    'stop-color': 'red',
    'stop-opacity': 1,
  }
  linearGradientEnd = {
    'stop-color': 'black',
    'stop-opacity': 1,
  }

  constructor(
    private router: Router,
    private _store: Store<fromRoot.State>,
    private _el: ElementRef,
    private _router: ActivatedRoute,
    private _render: Renderer2,
    private _dataTransmissionService: DataTransmissionService,
    private _shapeMapService: ShapeMapService
  ) {}

  ngOnInit() {
    this.initShapeData()
    this.projectId = this._router.snapshot.queryParams.project

    // 针对直线 && 箭头 禁用缩放
    if (this.data.setting.shapeType === 'line') {
      $(this._el.nativeElement.parentElement).resizable({ disabled: true })
    }
  }

  ngAfterViewInit() {
    if ($('.line-item1')[0] && this._router.snapshot.routeConfig.path !== 'download') {
      this.drag($(this._el.nativeElement.querySelectorAll('.line-item')))
    }

    // 改变传进来的svg的宽高为100%
    let svgs = this._el.nativeElement.querySelectorAll('.svgIcon svg')
    let svgLength = svgs.length
    for (let i = 0; i < svgLength; i++) {
      svgs[i].attributes.width.nodeValue = '100%'
      svgs[i].attributes.height.nodeValue = '100%'
    }

    // 确保改变的颜色再次进入会赋值给div
    let svgPath = this._el.nativeElement.querySelector('.svgIcon svg path')
    if (svgPath) {
      svgPath.style.fill = this.data.setting.props.fill.fillColor[0]
    }
  }

  initShapeData() {
    if (!this.data.setting.props.shadow) {
      Object.keys(this._shapeMapService).map((key) => {
        if (this._shapeMapService[key].shapeType === this.data.setting.shapeType) {
          let block = _.cloneDeep(this.data.setting)
          block.props['shadow'] = this._shapeMapService[key].props.shadow
          this.updateCurBlock(block)
        }
      })
    }
    if (this.data.setting) {
      const dataProps = this.data.setting.props
      let gradient = {}
      let isGradient = dataProps.fill.fillColor[0].indexOf('angle') > -1
      if (this.data.setting.shapeType === 'line') {
        isGradient = dataProps.strokeColor.indexOf('angle') > -1
      }
      // 判断是否开启渐变
      if (isGradient) {
        this.showLinearGradient = {
          fill: `url(#${this.data.setting.blockId})`,
        }
        if (this.data.setting.shapeType === 'line') {
          gradient = this.setGradient(dataProps.strokeColor)
          this.showLinearGradient = {
            stroke: `url(#${this.data.setting.blockId})`,
          }
        } else {
          gradient = this.setGradient(dataProps.fill.fillColor[0])
        }
      } else {
        this.showLinearGradient = {
          fill: '',
        }
        gradient = { colorList: [], position: { x1: 0, x2: 0, y1: 0, y2: 0 } }
      }

      // 盒子
      this.shapeBoxStyles = {
        width: dataProps.size.width + 'px',
        height: dataProps.size.height + 'px',
        filter:
          dataProps.shadow && dataProps.shadow.display
            ? `drop-shadow(
                                                ${dataProps.shadow.shadowColor} 
                                                ${Math.round(
                                                  dataProps.shadow.shadowRadius *
                                                    Math.cos((dataProps.shadow.shadowAngle * Math.PI) / 180)
                                                )}px
                                                ${Math.round(
                                                  dataProps.shadow.shadowRadius *
                                                    Math.sin((dataProps.shadow.shadowAngle * Math.PI) / 180)
                                                )}px 
                                                ${dataProps.shadow.shadowBlur}px)`
            : '',
      }

      // 元素
      this.shapeStyles = {
        width: dataProps.size.width + 'px',
        height: dataProps.size.height + 'px',
        opacity: dataProps.opacity / 100,
        fill: this.colorToRGBA(dataProps.fill.fillColor[0]),

        rx: dataProps.specified ? dataProps.specified.rx : 0,
        ry: dataProps.specified ? dataProps.specified.ry : 0,
        x: dataProps.specified ? dataProps.specified.x : 0,
        y: dataProps.specified ? dataProps.specified.y : 0,
        cx: dataProps.specified ? dataProps.specified.cx : 0,
        cy: dataProps.specified ? dataProps.specified.cy : 0,
        r: dataProps.specified ? dataProps.specified.r : 0,

        x1: dataProps.specified ? dataProps.specified.x1 : 0,
        y1: dataProps.specified ? dataProps.specified.y1 : 0,
        x2: dataProps.specified ? dataProps.specified.x2 : 0,
        y2: dataProps.specified ? dataProps.specified.y2 : 0,

        stroke: this.colorToRGBA(dataProps.strokeColor),
        strokeWidth: dataProps.strokeWidth,
        strokeDasharray: dataProps.strokeDasharray,

        linearGradient: gradient,
        colorList: gradient ? gradient['colorList'] : [],
        markerStart: 'url()',
        markerEnd: 'url()',
      }

      if (isGradient && this.data.setting.shapeType === 'line') {
        this.shapeStyles['y2'] = dataProps.specified ? Number(dataProps.specified.y2) + 0.1 : 0.1
      }

      this.iconStyles = {
        opacity: dataProps.opacity / 100,
        fill: isGradient ? `url(#${this.data.setting.blockId})` : this.colorToRGBA(dataProps.fill.fillColor[0]),

        rx: dataProps.specified ? dataProps.specified.rx : 0,
        ry: dataProps.specified ? dataProps.specified.ry : 0,
        x: dataProps.specified ? dataProps.specified.x : 0,
        y: dataProps.specified ? dataProps.specified.y : 0,
        cx: dataProps.specified ? dataProps.specified.cx : 0,
        cy: dataProps.specified ? dataProps.specified.cy : 0,
        r: dataProps.specified ? dataProps.specified.r : 0,

        x1: dataProps.specified ? dataProps.specified.x1 : 0,
        y1: dataProps.specified ? dataProps.specified.y1 : 0,
        x2: dataProps.specified ? dataProps.specified.x2 : 0,
        y2: dataProps.specified ? dataProps.specified.y2 : 0,

        stroke: this.colorToRGBA(dataProps.strokeColor),
        strokeWidth: dataProps.strokeWidth,
        strokeDasharray: dataProps.strokeDasharray,

        linearGradient: gradient,
        colorList: gradient ? gradient['colorList'] : [],

        markerStart: 'url()',
        markerEnd: 'url()',
      }

      // 拖拽把手
      this.dragItemOneStyles = {
        left: this.data.setting.dragPosition ? this.data.setting.dragPosition.oneLeft + 'px' : '',
        top: this.data.setting.dragPosition ? this.data.setting.dragPosition.oneTop + 'px' : '',
      }

      this.dragItemTwoStyles = {
        left: this.data.setting.dragPosition ? this.data.setting.dragPosition.twoLeft + 'px' : '',
        top: this.data.setting.dragPosition ? this.data.setting.dragPosition.twoTop + 'px' : '',
      }

      this.iconHTML = this.data.setting.src

      // path改颜色
      let svgPath = this._el.nativeElement.querySelector('.svgIcon svg path')
      if (svgPath) {
        svgPath.style.fill = isGradient
          ? `url(#${this.data.setting.blockId})`
          : this.colorToRGBA(dataProps.fill.fillColor[0])
      }
    }
  }

  setGradient(str) {
    let gradient = JSON.parse(str.replace(RegExp("'", 'g'), '"'))
    let colorList = []
    let position = {}
    let result = {}
    gradient.map((item) => {
      if (item.indexOf('angle') < 0) {
        let colorItem = {}
        colorItem['color'] = this.colorToRGBA(item.split(':')[0])
        colorItem['offset'] = item.split(':')[1]
        colorList.push(colorItem)
      } else {
        let angle = Number(item.split(':')[1])
        let x = Math.round(10000 * Math.sin(((90 - angle) / 180) * Math.PI)) / 100
        let y = Math.round(10000 * Math.cos(((90 - angle) / 180) * Math.PI)) / 100

        if (x >= 0 && y >= 0) {
          position['x1'] = `0%`
          position['y1'] = `0%`
          position['x2'] = `${x}%`
          position['y2'] = `${y}%`
        }

        if (x >= 0 && y <= 0) {
          position['x1'] = `0%`
          position['y1'] = `${-y}%`
          position['x2'] = `${x}%`
          position['y2'] = `0%`
        }

        if (x <= 0 && y <= 0) {
          position['x1'] = `${-x}%`
          position['y1'] = `${-y}%`
          position['x2'] = `0%`
          position['y2'] = `0%`
        }

        if (x <= 0 && y >= 0) {
          position['x1'] = `${-x}%`
          position['y1'] = `0%`
          position['x2'] = `0%`
          position['y2'] = `${y}%`
        }
      }
    })

    result['colorList'] = colorList
    result['position'] = position

    return result
  }

  showTooltip(e) {
    if (this.data.setting.props.tooltip) {
      let tooltip = document.querySelector('#tooltip') as HTMLElement
      tooltip.innerHTML = this.data.setting.props.tooltipText
      tooltip.style.display = 'block'
      tooltip.style.left = e.clientX + 10 + 'px'
      tooltip.style.top = e.clientY + 10 + 'px'
    }
  }

  hideTooltip() {
    let tooltip = document.querySelector('#tooltip') as HTMLElement
    if (tooltip) {
      tooltip.style.display = 'none'
    }
  }

  drag(objs) {
    const that = this
    objs.each(function (index, dragEleDom) {
      // 移动标记
      let _move = false
      let _moving = false
      // 鼠标离控件左上角的相对位置
      let _x, _y
      const dragEle = $(dragEleDom)
      dragEle
        .click(function () {
          // 备用
        })
        .mousedown(function (e) {
          // 禁用外层拖拽
          $(that._el.nativeElement).parents('.block-container').draggable({ disabled: true })
          _move = true
          _x = e.pageX - parseInt(dragEle.css('left'))
          _y = e.pageY - parseInt(dragEle.css('top'))

          // 添加开始拖动效果
          $('.line-item').css('transition', 'none')
          $('.toolbar').hide()
        })

      $(document).mousemove(function (e) {
        if (_move) {
          _moving = true
          // 移动时根据鼠标位置计算控件左上角的绝对位置
          var x = e.pageX - _x
          var y = e.pageY - _y

          // 控件新位置赋值 初始位置
          dragEle.css({ top: y, left: x })

          // 移动过程中重绘 line
          const pos1 = getElCoordinate(that._el.nativeElement.querySelector('.line-item1'))
          const pos2 = getElCoordinate(that._el.nativeElement.querySelector('.line-item2'))
          $(that._el.nativeElement.querySelector('.line')).attr({
            x1: pos1.left + pos1.width / 2,
            y1: pos1.top,
            x2: pos2.left + pos2.width / 2,
            y2: pos2.top,
          })
          // 隐藏拖拽框
          $(that._el.nativeElement).parents('.box').css('border', 'none')
        }
      })

      $(document).mouseup(function (e) {
        // 监听 document 由 _moving 与 _move 控制
        // dragEle.mouseup(function (e) {
        if (_move && _moving) {
          // 恢复边框
          $(that._el.nativeElement).parents('.box').css('border', '1px solid rgb(132, 181, 235)')
          // page 的距离
          const pageLeft = $('.page').offset().left + 10
          const pageTop = $('.page').offset().top + 10

          // 按钮
          const lineOneElClientRect = that._el.nativeElement.parentElement.parentElement
            .querySelector('.line-item1')
            .getBoundingClientRect()
          const lineOneLeft = lineOneElClientRect.left - pageLeft
          const lineOneTop = lineOneElClientRect.top - pageTop

          const lineTwoElClientRect = that._el.nativeElement.parentElement.parentElement
            .querySelector('.line-item2')
            .getBoundingClientRect()
          const lineTwoLeft = lineTwoElClientRect.left - pageLeft
          const lineTwoTop = lineTwoElClientRect.top - pageTop

          // 直线
          const lineEl = $(that._el.nativeElement).find('.line')
          const { width, height } = lineEl.get(0).getBoundingClientRect()

          // 如果按钮一在左侧
          if (lineOneLeft < lineTwoLeft) {
            // 按钮一在按钮二下方，以按钮二为基准
            if (lineOneTop > lineTwoTop) {
              // 从新设定位置
              $(that._el.nativeElement.parentElement.parentElement).css({
                width: width + 10 + 'px',
                height: height + 10 + 'px',
                left: lineOneLeft + 10 + 'px',
                top: lineTwoTop + 8 + 'px',
              })
              $(that._el.nativeElement.parentElement.parentElement)
                .find('.line-item1')
                .css({
                  left: 0,
                  top: height + 'px',
                })
              $(that._el.nativeElement.parentElement.parentElement)
                .find('.line-item2')
                .css({
                  left: width + 'px',
                  top: 0,
                })
              lineEl.attr({ x1: 5, y1: height, x2: width, y2: 5 })

              // 按钮一在按钮二上方，以按钮一为基准
            } else {
              // 从新设定位置
              $(that._el.nativeElement.parentElement.parentElement).css({
                width: width + 10 + 'px',
                height: height + 10 + 'px',
                left: lineOneLeft + 10 + 'px',
                top: lineOneTop + 10 + 'px',
              })
              $(that._el.nativeElement.parentElement.parentElement).find('.line-item1').css({
                left: 0,
                top: 0,
              })
              $(that._el.nativeElement.parentElement.parentElement)
                .find('.line-item2')
                .css({
                  left: width + 'px',
                  top: height + 'px',
                })
              lineEl.attr({ x1: 5, y1: 5, x2: width + 5, y2: height + 5 })
            }

            // 如果按钮一在右侧
          } else {
            // 按钮一在按钮二下方，以按钮二为基准
            if (lineOneTop > lineTwoTop) {
              // 从新设定位置
              $(that._el.nativeElement.parentElement.parentElement).css({
                width: width + 10 + 'px',
                height: height + 10 + 'px',
                left: lineTwoLeft + 8 + 'px',
                top: lineTwoTop + 8 + 'px',
              })
              $(that._el.nativeElement.parentElement.parentElement)
                .find('.line-item1')
                .css({
                  left: width + 'px',
                  top: height + 'px',
                })
              $(that._el.nativeElement.parentElement.parentElement).find('.line-item2').css({
                left: 0,
                top: 0,
              })
              lineEl.attr({ x1: 5, y1: 5, x2: width + 5, y2: height + 5 })

              // 按钮一在按钮二上方，以按钮一为基准
            } else {
              // 从新设定位置
              $(that._el.nativeElement.parentElement.parentElement).css({
                width: width + 10 + 'px',
                height: height + 10 + 'px',
                left: lineTwoLeft + 8 + 'px',
                top: lineOneTop + 10 + 'px',
              })
              $(that._el.nativeElement.parentElement.parentElement)
                .find('.line-item1')
                .css({
                  left: width + 'px',
                  top: 0,
                })
              $(that._el.nativeElement.parentElement.parentElement)
                .find('.line-item2')
                .css({
                  left: 0,
                  top: height + 'px',
                })
              lineEl.attr({ x1: 5, y1: height + 5, x2: width + 5, y2: 5 })
            }
          }

          // 更新数据
          const block = _.cloneDeep(that.data.setting)
          block.position.left = parseInt($(that._el.nativeElement.parentElement.parentElement).css('left'))
          block.position.top = parseInt($(that._el.nativeElement.parentElement.parentElement).css('top'))
          block.props.specified.x1 = Math.round(lineEl.attr('x1'))
          block.props.specified.x2 = Math.round(lineEl.attr('x2'))
          block.props.specified.y1 = Math.round(lineEl.attr('y1'))
          block.props.specified.y2 = Math.round(lineEl.attr('y2'))
          block.props.size.width = parseInt($(that._el.nativeElement.parentElement.parentElement).css('width'))
          block.props.size.height = parseInt($(that._el.nativeElement.parentElement.parentElement).css('height'))
          block.dragPosition.oneLeft = parseInt(
            $(that._el.nativeElement.parentElement.parentElement).find('.line-item1').css('left')
          )
          block.dragPosition.oneTop = parseInt(
            $(that._el.nativeElement.parentElement.parentElement).find('.line-item1').css('top')
          )
          block.dragPosition.twoLeft = parseInt(
            $(that._el.nativeElement.parentElement.parentElement).find('.line-item2').css('left')
          )
          block.dragPosition.twoTop = parseInt(
            $(that._el.nativeElement.parentElement.parentElement).find('.line-item2').css('top')
          )
          that.updateCurBlock(block)
          $('.line-item').css('transition', 'all .3s')
          $(that._el.nativeElement).parents('.block-container').draggable({ disabled: false })
          e.preventDefault()
        }
        _move = false
        _moving = false
      })
    })

    function getElCoordinate(dom) {
      var t = dom.offsetTop
      var l = dom.offsetLeft
      var w = dom.offsetWidth
      var h = dom.offsetHeight
      dom = dom.offsetParent
      while (!$(dom).hasClass('wrap-box')) {
        t += dom.offsetTop
        l += dom.offsetLeft
        dom = dom.offsetParent
      }
      return {
        top: t + 5,
        left: l,
        width: w,
        height: h,
      }
    }
  }

  // 更新数据
  updateCurBlock(block) {
    let newBlock = _.cloneDeep(block)
    let newData: any = {
      target: {
        blockId: newBlock.blockId,
        pageId: newBlock.pageId,
        type: newBlock.type,
      },
      method: 'put',
      block: block as any,
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
  }

  // 3 位 6 位 8 位 16 进制颜色转 RGBA
  colorToRGBA(color) {
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
    color4 = 1
    if (color.length === 8) {
      color4 = Math.round((parseInt(color[6] + color[7], 16) / 255) * 100) / 100
      color = color.substring(0, 6)
    }
    if (/^[0-9a-fA-F]{6}$/.test(color)) {
      color1 = parseInt(color.substr(0, 2), 16)
      color2 = parseInt(color.substr(2, 2), 16)
      color3 = parseInt(color.substr(4, 2), 16)
    }
    return 'rgba(' + color1 + ',' + color2 + ',' + color3 + ',' + color4 + ')'
  }
}
