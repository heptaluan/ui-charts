import { Directive, ElementRef, Output, EventEmitter } from '@angular/core'
import { NotifyChartRenderService } from '../../share/services/notify-chart-render.service'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../states/reducers'
import * as _ from 'lodash'
import * as $ from 'jquery'
import { UpdateProjectContent } from '../../states/models/project.model'
import { UpdateCurrentProjectArticleAction } from '../../states/actions/project.action'
import { ActivatedRoute } from '@angular/router'
import { DataTransmissionService } from '../../share/services'
import * as ProjectActions from '../../states/actions/project.action'

interface TransformRectType {
  point: any[]
  width: number
  height: number
  left: number
  right: number
  top: number
  bottom: number
}

interface ScaledRectType {
  left: number
  top: number
  width: number
  height: number
}

interface NewRectType {
  left: number
  top: number
  width: number
  height: number
}

interface PointAndOppositeType {
  current: {
    index: number
    point: any
  }
  opposite: {
    index: number
    point: any
  }
}

interface ConterPointType {
  left: number
  top: number
}

interface OptsType {
  left: number
  top: number
  width: number
  height: number
  rotate?: number
  scale?: number
}

interface UpdateDataType extends OptsType {}

interface BlockOptionsType {
  node: any
  box?: HTMLElement
  target: HTMLElement
  opts: OptsType
  offectDiffValue?: {
    left: number
    top: number
  }
  callback: Function
}

@Directive({
  selector: '[magicBox]',
})
export class magicBoxDirective {
  dragList: NodeList
  magicBox: HTMLElement
  dragBox: HTMLElement
  dragBoxWrap: HTMLElement
  dragElement: HTMLElement
  rotateHandler: HTMLElement
  resizeHandlers: NodeList[]
  dragResizeHandlers: NodeList[]
  subline: HTMLElement

  borderRightDrag: HTMLElement
  borderBottomDrag: HTMLElement

  blockLists: any[]
  pageId: string
  projectId: string

  getCurrentProjectArticleScription = new Subscription()
  mySubscription = new Subscription()

  domList: any[]
  idList: any
  groupList = []

  groupInitLeft = 0
  groupInitTop = 0

  @Output('selected') selected = new EventEmitter()

  constructor(
    private _el: ElementRef,
    private _notifyChartRenderService: NotifyChartRenderService,
    private _store: Store<fromRoot.State>,
    private _activatedRoute: ActivatedRoute,
    private _dataTransmissionService: DataTransmissionService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const that = this
    this.dragBox = this._el.nativeElement.querySelector('.drag-box')
    this.dragBoxWrap = this._el.nativeElement.querySelector('.drag-box-wrap')
    this.magicBox = this._el.nativeElement.querySelector('.magic-box')
    this.subline = this._el.nativeElement.querySelector('.subline')
    this.borderRightDrag = this._el.nativeElement.querySelector('.border-right-drag')
    this.borderBottomDrag = this._el.nativeElement.querySelector('.border-bottom-drag')

    this.eventDelegate('.workspace-wrap', '.block-container', 'click', function (e) {
      that.initMagicBoc(this)
    })

    this.eventDelegate('.workspace-wrap', '.block-container', 'mousedown', function (e) {
      e[0].stopPropagation()
      if (e[0].button === 2) {
        that.initMagicBoc(this)
      }
    })

    this.eventDelegate('.drag-box', '.rotate-input-box', 'click', function (e) {
      const target = e[0].target
      if (target.classList.contains('rotate-input')) {
        target.addEventListener('blur', function (e) {
          that.setCursorStyle(e.target['value'])
        })
      }
    })

    this.eventDelegate('.drag-box', '.map-block', 'click', function (e) {
      if (e[0].ctrlKey || e[0].metaKey) {
        const currentId = e[0].target.getAttribute('chartid')
        let idList = JSON.parse(localStorage.getItem('idList'))
        if (_.findIndex(idList, (item) => item === currentId) < 0) {
          idList.push(currentId)
        } else {
          idList = _.difference(idList, [currentId])
        }
        idList = _.uniq(idList)
        localStorage.setItem('idList', JSON.stringify(idList))
        if (idList.length > 1) {
          const newDomList = that.getSelectedBlockDomList(idList)
          if (newDomList.length > 1) {
            that.selection(newDomList)
          }
        } else {
          that.selected.emit({
            type: 'article',
          })
          Array.from(document.querySelectorAll('.block-container')).map((dom) => {
            dom.classList.remove('is-selceted')
            if (dom.getAttribute('chartid') === idList[0]) {
              that.initMagicBoc(dom)
            }
          })
        }
      }
    })

    this._notifyChartRenderService.getChartRender().subscribe((res) => {
      const currentBlock = this._el.nativeElement.querySelector('.block-container.show')
      if (res && currentBlock) {
        const rotate = currentBlock.style.transform
          ? Number.parseInt(/\(([^()]+)\)/g.exec(currentBlock.style.transform)[1])
          : 0
        this.setCursorStyle(rotate)
      }
    })

    const ds = new window['DragSelect']({
      selectables: this._el.nativeElement.querySelectorAll('.block-container'),
      area: document.querySelector('.center-content'),
      multiSelectKeys: [],
      onDragStart: function (e) {
        if (
          e.target.classList.contains('workspace') ||
          e.target.classList.contains('edit-area') ||
          e.target.classList.contains('page-container') ||
          e.target.classList.contains('center-content')
        ) {
          return
        } else {
          this.break()
        }
      },
      onElementSelect: function (el) {
        if ($('.drag-box').is(':hidden')) {
          if (!el.classList.contains('isLocked')) {
            el.classList.add('is-selceted')
          }
        }
      },
      onElementUnselect: function (el) {
        if ($('.drag-box').is(':hidden')) {
          el.classList.remove('is-selceted')
        }
      },
      callback: function (els) {
        that.selection(els)
      },
    })

    this._dataTransmissionService.getContextMenuData().subscribe((res) => {
      if (res.length > 1) {
        const newDomList = this.getSelectedBlockDomList(res)
        if (newDomList.length > 1) {
          this.selection(newDomList)
        }
      } else {
        Array.from(document.querySelectorAll('.block-container')).map((dom) => {
          if (dom.getAttribute('chartid') === res.blockId) {
            this.initMagicBoc(dom)
          }
        })
      }
    })

    this.mySubscription.add(
      this._store.select(fromRoot.getCurrentProjectArticle).subscribe((res) => {
        ds.addSelectables(this._el.nativeElement.querySelectorAll('.block-container'))
      })
    )

    this.getCurrentProjectArticleScription = this._store.select(fromRoot.getCurrentProjectArticle).subscribe((data) => {
      this.blockLists = data.contents.pages[0].blocks
      this.pageId = data.contents.pages[0].pageId
      this.projectId = this._activatedRoute.snapshot.queryParams.project
    })
  }

  initMagicBoc(dom) {
    let { left, top, width, height } = dom.style
    // 初始化赋值
    this.groupInitLeft = Number(left.split('px')[0])
    this.groupInitTop = Number(top.split('px')[0])
    let opts: OptsType = {
      left: Number.parseInt(left),
      top: Number.parseInt(top),
      width: Number.parseInt(width),
      height: Number.parseInt(height),
      rotate: dom.style.transform ? Number.parseInt(/\(([^()]+)\)/g.exec(dom.style.transform)[1]) : 0,
      scale: 1,
    }
    this.bindSelectedEvent(dom, opts)
    this.emitSelectedBlock(dom)
  }

  eventDelegate(parentSelector, targetSelector, events, foo) {
    function triFunction(e) {
      var event = e || window.event
      var target = event.target || event.srcElement
      var currentTarget = event.currentTarget
      if (!Element.prototype.matches) {
        Element.prototype.matches =
          Element.prototype.webkitMatchesSelector ||
          function (s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
              i = matches.length
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1
          }
      }
      try {
        while (target && target !== currentTarget) {
          if (target.matches(targetSelector)) {
            var sTarget = target
            foo.call(sTarget, Array.prototype.slice.call(arguments))
          }
          target = target.parentNode
        }
      } catch (error) {
        console.log(error)
      }
    }
    events.split('.').forEach(function (evt) {
      Array.prototype.slice.call(document.querySelectorAll(parentSelector)).forEach(function ($p) {
        $p.addEventListener(evt, triFunction)
      })
    })
  }

  createDragBox(items: any[]) {
    if (items.length === 0) return
    if (items.length === 1) {
      items[0].click()
      return
    }
    let opts = this.setDragBoxStyle()
    this.bindSelectedEvent(this.dragBox, opts, items)
  }

  setDragBoxStyle() {
    this.updateSelectedBlockDomList()
    const dragBox = <HTMLElement>document.querySelector('.drag-box')
    if (!document.querySelector('.workspace-wrap')) return
    const wrapBoxRect = document.querySelector('.workspace-wrap').getBoundingClientRect()
    const offectDiffValue = {
      top: wrapBoxRect.top,
      left: wrapBoxRect.left,
    }
    let leftArr = [],
      topArr = [],
      rightArr = [],
      bottomArr = []
    this.domList.map((item) => {
      let itemClientRect = item.getBoundingClientRect()
      leftArr.push(itemClientRect.left - offectDiffValue.left)
      topArr.push(itemClientRect.top - offectDiffValue.top)
      rightArr.push(itemClientRect.right - offectDiffValue.left)
      bottomArr.push(itemClientRect.bottom - offectDiffValue.top)
    })

    let minLeft = Reflect.apply(Math.min, null, leftArr).toFixed()
    let minTop = Reflect.apply(Math.min, null, topArr).toFixed()
    let maxRight = Reflect.apply(Math.max, null, rightArr).toFixed()
    let maxBottom = Reflect.apply(Math.max, null, bottomArr).toFixed()

    dragBox.style.left = minLeft - 2 + 'px'
    dragBox.style.top = minTop - 2 + 'px'
    dragBox.style.width = maxRight - minLeft + 4 + 'px'
    dragBox.style.height = maxBottom - minTop + 4 + 'px'

    return {
      left: minLeft,
      top: minTop,
      width: maxRight - minLeft,
      height: maxBottom - minTop,
    }
  }

  bindSelectedEvent(target: HTMLElement, opts: OptsType, items?): void {
    const that = this
    if (items) {
      this.dragBox.style.display = 'block'
      this.magicBox.style.display = 'none'
      this.dragResizeHandlers = Array.prototype.slice.call(
        this._el.nativeElement.querySelectorAll('.drag-box .resizable-handle'),
        0
      )
      const wrapBoxRect = this._el.nativeElement.querySelector('.workspace-wrap').getBoundingClientRect()
      const offectDiffValue = {
        top: wrapBoxRect.top,
        left: wrapBoxRect.left,
      }
      this.bindGroupMoveEvents({
        node: target,
        items: items,
        callback: function (options) {
          console.log(`拖拽`)
          that.createGroupMap()
          items.map((item) => {
            const block = that.blockLists.find((x) => x.blockId === item.getAttribute('chartid'))
            that.updateGroupBlock(item, block)
          })
          that._store.dispatch(new ProjectActions.UpdateCurrentProjectGroupMoveAction(that.groupList))
          that.groupList = []
        },
      })
      this.dragResizeHandlers.map(function (resizeElement) {
        that.bindGroupResizeEvents({
          node: resizeElement,
          target: target,
          opts: _.cloneDeep(opts),
          offectDiffValue: offectDiffValue,
          callback: function (options) {
            console.log(`缩放`)
          },
        })
      })
    } else {
      const wrapBoxRect = this._el.nativeElement.querySelector('.workspace-wrap').getBoundingClientRect()
      const offectDiffValue = {
        top: wrapBoxRect.top,
        left: wrapBoxRect.left,
      }
      this.dragElement = this._el.nativeElement.querySelector('.magic-box .draggable')
      this.rotateHandler = this._el.nativeElement.querySelector('.magic-box .rotate')
      this.resizeHandlers = Array.prototype.slice.call(
        this._el.nativeElement.querySelectorAll('.magic-box .resizable-handle'),
        0
      )
      this.dragBox.style.display = 'none'
      this.magicBox.style.display = 'block'
      this.draw(this.magicBox, opts)
      this.setCursorStyle(opts.rotate)
      this.bindMoveEvents({
        node: target,
        box: this.magicBox,
        target: target,
        opts: _.cloneDeep(opts),
        callback: function (options) {
          that.updateBlock(options, target.contains(target.querySelector('lx-group')))
        },
      })

      this.bindRotateEvents({
        node: this.rotateHandler,
        box: this.magicBox,
        target: target,
        opts: _.cloneDeep(opts),
        offectDiffValue: offectDiffValue,
        callback: function (options) {
          console.log(`旋转`)
          that.setCursorStyle(options.rotate)
          that.updateBlock(options)
        },
      })

      this.resizeHandlers.map(function (resizeElement) {
        that.bindResizeEvents({
          node: resizeElement,
          box: that.magicBox,
          target: target,
          opts: _.cloneDeep(opts),
          offectDiffValue: offectDiffValue,
          callback: function (options) {
            console.log(`缩放`)
            that.updateBlock(options)
          },
        })
      })
    }
  }

  updateBlock(options: UpdateDataType, isGroup = false): void {
    let data = _.cloneDeep(JSON.parse(localStorage.getItem('block')))
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    let newBlock = _.cloneDeep(data.block)
    newBlock.position.left = (options.left / (scale / 100)).toFixed()
    newBlock.position.top = (options.top / (scale / 100)).toFixed()
    newBlock.props.size.width = (options.width / (scale / 100)).toFixed()
    newBlock.props.size.height = (options.height / (scale / 100)).toFixed()
    newBlock.props.size.rotate = options.rotate
    this.updateShape(newBlock, options)
    let newData: UpdateProjectContent = {
      target: data.target,
      method: 'put',
      block: newBlock,
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(data['projectId'], newData))
    localStorage.setItem(
      'block',
      JSON.stringify({
        target: data.target,
        block: newBlock,
        projectId: data.projectId,
      })
    )
  }

  updateGroupBlock(item, block): void {
    let newBlock = _.cloneDeep(this.getSelectedBlock(block.blockId))
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    newBlock.position.left = (parseInt(item.style.left) / (scale / 100)).toFixed()
    newBlock.position.top = (parseInt(item.style.top) / (scale / 100)).toFixed()
    this.groupList.push(newBlock)
    let newData: UpdateProjectContent = {
      target: {
        blockId: block.blockId,
        pageId: this.pageId,
        type: block.type,
        target: 'redo',
      },
      method: 'put',
      block: newBlock,
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
  }

  updateShape(newBlock, options) {
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    options.width = (options.width / (scale / 100)).toFixed()
    options.height = (options.height / (scale / 100)).toFixed()
    if (newBlock.type === 'shape') {
      if (newBlock.shapeType === 'line') {
        newBlock.props.specified.x1 = `0`
        newBlock.props.specified.y1 = `${options.height / 2}`
        newBlock.props.specified.x2 = `${options.width}`
        newBlock.props.specified.y2 = `${options.height / 2}`
      } else if (newBlock.shapeType === 'rectangle' || newBlock.shapeType === 'round-rectangle') {
        newBlock.props.fill.width = `${options.width}`
        newBlock.props.fill.height = `${options.height}`
      } else if (newBlock.shapeType === 'oval') {
        newBlock.props.specified.cx = options.width ? options.width / 2 : newBlock.props.size.width / 2
        newBlock.props.specified.cy = options.width ? options.height / 2 : newBlock.props.size.height / 2
        newBlock.props.specified.rx = options.width ? options.width / 2 : newBlock.props.size.width / 2
        newBlock.props.specified.ry = options.width ? options.height / 2 : newBlock.props.size.height / 2
      } else if (newBlock.shapeType === 'triangle') {
        newBlock.path = `${options.width / 2} 0, 0 ${options.height}, ${options.width} ${options.height}`
      } else if (newBlock.shapeType === 'pentagon') {
        if (options.width) {
          newBlock.path = `${options.width / 2} 0, ${options.width} ${options.height * 0.4}, ${options.width * 0.85} ${
            options.height
          }, ${options.width * 0.15} ${options.height}, 0 ${options.height * 0.4}`
        } else {
          newBlock.path = `${newBlock.props.size.width / 2} 0, ${newBlock.props.size.width} ${
            newBlock.props.size.height * 0.4
          }, ${newBlock.props.size.width * 0.85} ${newBlock.props.size.height}, ${newBlock.props.size.width * 0.15} ${
            newBlock.props.size.height
          }, 0 ${newBlock.props.size.height * 0.4}`
        }
      }
    }
  }

  updateLocalStorageBlock(opts: OptsType): void {
    const newBlock = _.cloneDeep(JSON.parse(localStorage.getItem('block')).block)
    opts.left = newBlock.position.left
    opts.top = newBlock.position.top
    opts.width = newBlock.props.size.width
    opts.height = newBlock.props.size.height
    opts.rotate = newBlock.props.size.rotate
  }

  fixedDragMoveOptions(target: HTMLElement, opts: OptsType): void {
    opts.left = Number.parseInt(target.style.left)
    opts.top = Number.parseInt(target.style.top)
    opts.width = Number.parseInt(target.style.width)
    opts.height = Number.parseInt(target.style.height)
    opts.rotate = target.style.transform ? Number.parseInt(/\(([^()]+)\)/g.exec(target.style.transform)[1]) : 0
  }

  fixedDragMoveStyles(node, box) {
    if (!node.classList.contains('isLocked') && box) {
      this.rotateHandler.style.display = 'flex'
      this.resizeHandlers.map((item) => {
        ;(item as any).style.pointerEvents = 'auto'
      })
    }
  }

  updateTargetData(opts) {
    const newBlock = _.cloneDeep(JSON.parse(localStorage.getItem('block')).block)
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    opts.top = newBlock.position.top * (scale / 100)
    opts.left = newBlock.position.left * (scale / 100)
    opts.width = newBlock.props.size.width * (scale / 100)
    opts.height = newBlock.props.size.height * (scale / 100)
  }

  bindGroupMoveEvents(options): void {
    const { node, callback } = options
    const that = this
    node.onmousedown = function () {
      let opts = that.setDragBoxStyle()
      const items = that.domList
      const originLeft = opts.left
      const originTop = opts.top
      var event = event || window.event
      var deltaX = event.pageX - opts.left
      var deltaY = event.pageY - opts.top
      that.borderRightDrag.style.display = 'none'
      that.borderBottomDrag.style.display = 'none'
      event.preventDefault()
      if (event.target.classList.contains('resizable-handle')) return
      items.map((item) => {
        item.setAttribute('itemDeltaX', event.pageX - Number.parseInt(item.style.left))
        item.setAttribute('itemDeltaY', event.pageY - Number.parseInt(item.style.top))
      })
      opts.width = opts.width + 4
      opts.height = opts.height + 4
      document.onmousemove = function (e) {
        if (e.buttons === 2) return
        var event = event || window.event
        opts.left = event.pageX - deltaX - 2
        opts.top = event.pageY - deltaY - 2
        that.draw(node, opts)
        that.drawItems(items, event.pageX, event.pageY)
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        that.borderRightDrag.style.display = 'block'
        that.borderBottomDrag.style.display = 'block'
        if (originLeft !== opts.left || originTop !== opts.top) {
          callback && callback(opts)
        }
      }
    }
    node.ondragstart = function (event) {
      event.preventDefault()
      return false
    }
  }

  bindGroupResizeEvents(options: BlockOptionsType): void {
    let { node, target, opts, offectDiffValue, callback } = options
    let that = this
    node.onmousedown = function () {
      var event = event || window.event
      var tip = event.target.getAttribute('tips')
      event.preventDefault()
      var { left, top, width, height, rotate } = opts
      var oPoint = {
        left: left | 0,
        top: top | 0,
        rotate: rotate ? rotate : 0,
        width: Number(width),
        height: Number(height),
      }
      var start_x = event.pageX
      var start_y = event.pageY
      var ex = event.pageX - offectDiffValue.left
      var ey = event.pageY - offectDiffValue.top
      var transformedRect = that.getTransformRectAngle(
        {
          left,
          top,
          width,
          height,
        },
        rotate
      )
      var { point } = transformedRect
      var { opposite } = that.getPointAndOpposite(point, tip)
      var baseIndex = opposite.index
      var oppositeX = opposite.point['left']
      var oppositeY = opposite.point['top']
      var offsetWidth = Math.abs(ex - oppositeX)
      var offsetHeight = Math.abs(ey - oppositeY)

      document.onmousemove = function () {
        var event = event || window.event
        var end_x = event.pageX
        var end_y = event.pageY
        var dx = end_x - start_x
        var dy = end_y - start_y
        var _angle = rotate
        if (_angle) {
          var r = Math.sqrt(dx * dx + dy * dy),
            theta = Math.atan2(dy, dx) - (_angle * Math.PI) / 180.0
          dx = r * Math.cos(theta)
          dy = r * Math.sin(theta)
        }
        var equalScale = 1
        var widthScale = 1
        var heightScale = 1
        var scale = {
          left: 1,
          top: 1,
        }
        if (tip == 0) {
          widthScale = (width - dx) / width
          heightScale = (height - dy) / height
        } else if (tip == 2) {
          widthScale = (width + dx) / width
          heightScale = (height - dy) / height
        } else if (tip == 4) {
          widthScale = (width + dx) / width
          heightScale = (height + dy) / height
        } else if (tip == 6) {
          widthScale = (width - dx) / width
          heightScale = (height + dy) / height
        }
        if ([1, 7].indexOf(baseIndex) >= 0) {
          widthScale = (width + dx) / width
          heightScale = (height + dy) / height
        }
        if ([3, 5].indexOf(baseIndex) >= 0) {
          widthScale = (width - dx) / width
          heightScale = (height - dy) / height
        }
        if (offsetWidth > offsetHeight) {
          equalScale = widthScale
        } else {
          equalScale = heightScale
        }
        widthScale = widthScale < 0.15 ? 0.15 : widthScale
        heightScale = heightScale < 0.15 ? 0.15 : heightScale
        equalScale = equalScale < 0.15 ? 0.15 : equalScale
        if ([0, 2, 4, 6].indexOf(baseIndex) >= 0) {
          scale.left = widthScale
          scale.top = heightScale
        } else if ([1, 5].indexOf(baseIndex) >= 0) {
          scale.top = heightScale
        } else if ([3, 7].indexOf(baseIndex) >= 0) {
          scale.left = widthScale
        }
        var newRect = that.getNewRect(oPoint, scale, transformedRect, baseIndex)
        opts.left = newRect.left
        opts.top = newRect.top
        opts.width = newRect.width < 25 ? 25 : newRect.width
        opts.height = newRect.height < 25 ? 25 : newRect.height
        that._notifyChartRenderService.sendChartRender('chartResize')
        that.draw(target, opts)
        console.log(opts)
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        callback && callback(opts)
      }
    }
  }

  bindMoveEvents(options: BlockOptionsType): void {
    const { node, box, target, opts, callback } = options
    const that = this
    node.onmousedown = function () {
      if (node.classList.contains('isLocked')) return
      that.fixedDragMoveOptions(target, opts)
      var event = event || window.event
      var deltaX = event.pageX / opts.scale - opts.left
      var deltaY = event.pageY / opts.scale - opts.top
      event.preventDefault()
      const originLeft = opts.left
      const originTop = opts.top
      that.borderRightDrag.style.display = 'none'
      that.borderBottomDrag.style.display = 'none'
      document.onmousemove = function (e) {
        if (e.buttons === 2 || e.buttons === 0) return
        var event = event || window.event
        opts.left = event.pageX / opts.scale - deltaX
        opts.top = event.pageY / opts.scale - deltaY
        that.fixedDragMoveStyles(node, box)
        that.draw(box, opts)
        that.draw(target, opts)
        that.subline.style.display = 'block'
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        that.subline.style.display = 'none'
        that.borderRightDrag.style.display = 'block'
        that.borderBottomDrag.style.display = 'block'
        if (originLeft !== opts.left || originTop !== opts.top) {
          that.fixedDragMoveStyles(node, box)
          callback && callback(opts)
        }
      }
    }
    node.ondragstart = function (event) {
      event.preventDefault()
      return false
    }
  }

  bindRotateEvents(options: BlockOptionsType): void {
    let { node, box, target, opts, offectDiffValue, callback } = options
    const rotatBox = <HTMLElement>document.querySelector('.rotate-text')
    const rotatText = <HTMLElement>document.querySelector('.rotate-text span')
    let that = this
    node.onmousedown = function () {
      that.borderRightDrag.style.display = 'none'
      that.borderBottomDrag.style.display = 'none'
      target = <HTMLElement>document.querySelector('.block-container.show')
      that.fixedDragMoveOptions(target, opts)
      that.updateTargetData(opts)
      var event = event || window.event,
        point = that.getConterPoint(box),
        prevAngle =
          Math.atan2(event.pageY - offectDiffValue.top - point.top, event.pageX - offectDiffValue.left - point.left) -
          (opts.rotate * Math.PI) / 180
      event.preventDefault()
      document.onmousemove = function () {
        var event = event || window.event,
          angle = Math.atan2(
            event.pageY - offectDiffValue.top - point.top,
            event.pageX - offectDiffValue.left - point.left
          ),
          rotate = Math.floor(((angle - prevAngle) * 180) / Math.PI)
        if (rotate < 0) {
          rotate = 360 - Math.abs(rotate)
        } else if (rotate > 360) {
          rotate = rotate - Math.floor(rotate / 360) * 360
        }
        opts.rotate = rotate
        rotatText.innerHTML = rotate.toString()
        rotatBox.style.display = `block`
        rotatBox.style.transform = `rotate(${360 - Math.abs(rotate)}deg)`
        that.draw(box, opts)
        that.draw(target, opts)
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        that.borderRightDrag.style.display = 'block'
        that.borderBottomDrag.style.display = 'block'
        rotatBox.style.display = `none`
        callback && callback(opts)
      }
    }
    node.ondragstart = function (event) {
      event.preventDefault()
      return false
    }
  }

  bindResizeEvents(options: BlockOptionsType): void {
    let { node, box, target, opts, offectDiffValue, callback } = options
    let that = this
    let _locked
    node.onmousedown = function () {
      that.borderRightDrag.style.display = 'none'
      that.borderBottomDrag.style.display = 'none'
      target = <HTMLElement>document.querySelector('.block-container.show')
      const block = that.blockLists.find((x) => x.blockId === target.getAttribute('chartid'))
      if (document.querySelector('.is-focus') === document.activeElement) {
        return
      }
      that.fixedDragMoveOptions(target, opts)
      that.updateTargetData(opts)
      var event = event || window.event
      var tip = event.target.getAttribute('tips')
      event.preventDefault()
      var { left, top, width, height, rotate } = opts
      var oPoint = {
        left,
        top,
        rotate,
        width: Number(width),
        height: Number(height),
      }
      var start_x = event.pageX
      var start_y = event.pageY
      var ex = event.pageX - offectDiffValue.left
      var ey = event.pageY - offectDiffValue.top
      var transformedRect = that.getTransformRectAngle(
        {
          left,
          top,
          width,
          height,
        },
        rotate
      )
      var { point } = transformedRect
      var { opposite } = that.getPointAndOpposite(point, tip)
      var baseIndex = opposite.index
      var oppositeX = opposite.point['left']
      var oppositeY = opposite.point['top']
      var offsetWidth = Math.abs(ex - oppositeX)
      var offsetHeight = Math.abs(ey - oppositeY)

      document.onmousemove = function () {
        var event = event || window.event
        if (event.shiftKey || event.metaKey) {
          _locked = true
        } else {
          if (block && block.props.size.ratio && block.props.size.ratio !== null) {
            _locked = true
          } else {
            _locked = false
          }
        }
        var end_x = event.pageX
        var end_y = event.pageY
        var dx = end_x - start_x
        var dy = end_y - start_y
        var _angle = rotate
        if (_angle) {
          var r = Math.sqrt(dx * dx + dy * dy),
            theta = Math.atan2(dy, dx) - (_angle * Math.PI) / 180.0
          dx = r * Math.cos(theta)
          dy = r * Math.sin(theta)
        }
        var equalScale = 1
        var widthScale = 1
        var heightScale = 1
        var scale = {
          left: 1,
          top: 1,
        }

        if (tip == 0) {
          widthScale = (width - dx) / width
          heightScale = (height - dy) / height
        } else if (tip == 2) {
          widthScale = (width + dx) / width
          heightScale = (height - dy) / height
        } else if (tip == 4) {
          widthScale = (width + dx) / width
          heightScale = (height + dy) / height
        } else if (tip == 6) {
          widthScale = (width - dx) / width
          heightScale = (height + dy) / height
        }
        if ([1, 7].indexOf(baseIndex) >= 0) {
          widthScale = (width + dx) / width
          heightScale = (height + dy) / height
        }
        if ([3, 5].indexOf(baseIndex) >= 0) {
          widthScale = (width - dx) / width
          heightScale = (height - dy) / height
        }
        if (offsetWidth > offsetHeight) {
          equalScale = widthScale
        } else {
          equalScale = heightScale
        }
        if ([0, 2, 4, 6].indexOf(baseIndex) >= 0) {
          if (_locked) {
            scale.left = scale.top = equalScale
          } else {
            scale.left = widthScale
            scale.top = heightScale
          }
        } else if ([1, 5].indexOf(baseIndex) >= 0) {
          if (_locked) {
            scale.left = scale.top = equalScale
          } else {
            scale.top = heightScale
          }
        } else if ([3, 7].indexOf(baseIndex) >= 0) {
          if (_locked) {
            scale.left = scale.top = equalScale
          } else {
            scale.left = widthScale
          }
        }
        var newRect = that.getNewRect(oPoint, scale, transformedRect, baseIndex)
        if (newRect.width > 30 && newRect.height > 30) {
          opts.left = newRect.left
          opts.top = newRect.top
          opts.width = newRect.width
          opts.height = newRect.height
        }
        that._notifyChartRenderService.sendChartRender('chartResize')
        that.draw(box, opts)
        that.draw(target, opts)
        that.renderImage(target, opts)
        that.renderAudio(target, opts)
        that.renderShape(target, opts)
        that.renderTextarea(target, opts)
        that.renderChart(target, opts)
        that.renderGroup(target, opts)
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        that.borderRightDrag.style.display = 'block'
        that.borderBottomDrag.style.display = 'block'
        callback && callback(opts)
      }
    }
  }

  draw(el: HTMLElement, opts): void {
    this.setCss(el, {
      left: opts.left.toFixed() + 'px',
      top: opts.top.toFixed() + 'px',
      width: opts.width.toFixed() + 'px',
      height: opts.height.toFixed() + 'px',
      transform: 'rotate(' + opts.rotate + 'deg)',
    })
  }

  drawItems(items, x, y) {
    items.map((item) => {
      item.style.left = x - item.getAttribute('itemDeltaX') + 'px'
      item.style.top = y - item.getAttribute('itemDeltaY') + 'px'
    })
  }

  renderImage(target: HTMLElement, options: any): void {
    const img = <HTMLElement>target.querySelector('.image-box img')
    if (img) {
      img.style.width = options.width + 'px'
      img.style.height = options.height + 'px'
    }
  }

  renderAudio(target: HTMLElement, options: any): void {
    const audio = <HTMLElement>target.querySelector('.audio-wrapper')
    const title = <HTMLElement>target.querySelector('.audio-wrapper p')
    const playBtn = <HTMLElement>target.querySelector('.audio-wrapper .play-btn')
    const wrapper = <HTMLElement>target.querySelector('.audio-wrapper .wrapper')
    const bgm = <HTMLElement>target.querySelector('.bgm-wrapper')
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100
    if (bgm) {
      bgm.style.width = options.width + 'px'
      bgm.style.height = options.height + 'px'
      bgm.style['zoom'] = '1'
    }
    if (audio) {
      audio.style.width = options.width / scale + 'px'
      audio.style.height = options.height / scale + 'px'
      audio.style['zoom'] = scale + ''
      title.style.fontSize = this.getChangedSize(options.height / scale, 30)
      playBtn.style.width = this.getChangedSize(options.height / scale, 70)
      playBtn.style.height = this.getChangedSize(options.height / scale, 70)
      wrapper.style.fontSize = this.getChangedSize(options.height / scale, 20)
    }
  }

  getChangedSize(height, initSize) {
    return (height / 186) * initSize + 'px'
  }

  renderTextarea(target: HTMLElement, options: any): void {
    const textarea = <HTMLElement>target.querySelector('.block-text')
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    if (textarea) {
      textarea.style.width = options.width / (scale / 100) + 'px'
      textarea.style.height = options.height / (scale / 100) + 'px'
    }
  }

  renderChart(target: HTMLElement, options: any): void {
    const chart = <HTMLElement>target.querySelector('.echart-container')
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    if (chart) {
      chart.style.width = options.width / (scale / 100) + 'px'
      chart.style.height = options.height / (scale / 100) + 'px'
    }
  }

  renderShape(target: HTMLElement, opts: any): void {
    const options = _.cloneDeep(opts)
    const newBlock = _.cloneDeep(JSON.parse(localStorage.getItem('block')).block)
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    if (newBlock.type !== 'shape') return
    const shapeBox = <HTMLElement>target.querySelector('.block-shape')
    const svgEl = <HTMLElement>target.querySelector('.svg-element')
    options.width = options.width.toFixed() / (scale / 100)
    options.height = options.height.toFixed() / (scale / 100)
    shapeBox.style.width = options.width + 'px'
    shapeBox.style.height = options.height + 'px'
    switch (newBlock.shapeType) {
      case 'line':
        const line = <HTMLElement>target.querySelector('.block-shape .line')
        line.setAttribute('x1', `0`)
        line.setAttribute('y1', `${options.height / 2}`)
        line.setAttribute('x2', `${options.width}`)
        line.setAttribute('y2', `${options.height / 2}`)
      case 'icon':
        shapeBox.setAttribute('width', options.width + 2 + 'px')
        shapeBox.setAttribute('height', options.height + 2 + 'px')
        break
      case 'oval':
        svgEl.setAttribute('cx', `${options.width / 2}`)
        svgEl.setAttribute('cy', `${options.height / 2}`)
        svgEl.setAttribute('rx', `${options.width / 2}`)
        svgEl.setAttribute('ry', `${options.height / 2}`)
        break
      case 'triangle':
        svgEl.setAttribute('points', `${options.width / 2} 0, 0 ${options.height}, ${options.width} ${options.height}`)
        break
      case 'pentagon':
        svgEl.setAttribute(
          'points',
          `${options.width / 2} 0, ${options.width} ${(options.height * 0.4).toFixed()}, ${options.width * 0.85} ${
            options.height
          }, ${options.width * 0.15} ${options.height}, 0 ${(options.height * 0.4).toFixed()}`
        )
      default:
        svgEl.setAttribute('width', `${options.width}`)
        svgEl.setAttribute('height', `${options.height}`)
        break
    }
  }

  // 重绘 group
  renderGroup(target: HTMLElement, options: any): void {
    const group = <HTMLElement>target.querySelector('.group-container')
    if (group) {
      group.style.width = options.width + 'px'
      group.style.height = options.height + 'px'
    }
  }

  setCursorStyle(angle): void {
    var cursorsArr = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
    var domListIndex = _.cloneDeep(cursorsArr)
    var steps = Math.round(angle / 45)
    if (steps < 0) steps += 8
    while (steps > 0) {
      cursorsArr.push(cursorsArr.shift())
      steps--
    }
    const domList = {}
    for (var item of domListIndex) {
      domList[item] = document.querySelector('.' + item)
    }
    var i = 0
    for (var dir in domList) {
      domList[dir].setAttribute('style', 'cursor:' + cursorsArr[i] + '-resize')
      i++
    }
  }

  setCss(node: HTMLElement, opts): void {
    for (var index in opts) {
      node['style'][index] = opts[index]
    }
  }

  getConterPoint(box): ConterPointType {
    return {
      left: box.offsetLeft + box.offsetWidth / 2,
      top: box.offsetTop + box.offsetHeight / 2,
    }
  }

  getPointAndOpposite(point, tip): PointAndOppositeType {
    let oppositePoint = {}
    let currentPoint = {}

    let currentIndex = 0
    let oppositeIndex = 0
    point.forEach((target, index) => {
      if (index == tip) {
        currentPoint = target
        currentIndex = index
        let offset = 4
        let oIndex = index - offset
        if (oIndex < 0) {
          oIndex = index + offset
        }
        oppositePoint = point.slice(oIndex, oIndex + 1)[0]
        oppositeIndex = oIndex
      }
    })
    return {
      current: {
        index: currentIndex,
        point: currentPoint,
      },
      opposite: {
        index: oppositeIndex,
        point: oppositePoint,
      },
    }
  }

  getNewRect(oPoint, scale, oTransformedRect, baseIndex): NewRectType {
    var scaledRect = this.getScaledRect({
      left: Number(oPoint.left),
      top: Number(oPoint.top),
      width: Number.parseInt(oPoint.width),
      height: Number.parseInt(oPoint.height),
      scale: scale,
    })
    var transformedRotateRect = this.getTransformRectAngle(scaledRect, oPoint.rotate)
    var translatedX =
      oTransformedRect.point[baseIndex].left - transformedRotateRect.point[baseIndex].left + transformedRotateRect.left
    var translatedY =
      oTransformedRect.point[baseIndex].top - transformedRotateRect.point[baseIndex].top + transformedRotateRect.top
    var newX = translatedX + transformedRotateRect.width / 2 - scaledRect.width / 2
    var newY = translatedY + transformedRotateRect.height / 2 - scaledRect.height / 2
    var newWidth = scaledRect.width
    var newHeight = scaledRect.height
    return {
      left: newX,
      top: newY,
      width: newWidth,
      height: newHeight,
    }
  }

  getScaledRect(params, baseIndex?): ScaledRectType {
    var { left, top, width, height, scale } = params
    var offset = {
      left: 0,
      top: 0,
    }
    var deltaXScale = scale.left - 1
    var deltaYScale = scale.top - 1
    var deltaWidth = width * deltaXScale
    var deltaHeight = height * deltaYScale
    var newWidth = width + deltaWidth
    var newHeight = height + deltaHeight
    var newX = left - deltaWidth / 2
    var newY = top - deltaHeight / 2
    if (baseIndex) {
      var points = [
        { left, top },
        { left: left + width, top },
        { left: left + width, top: top + height },
        { left, top: top + height },
      ]
      var newPoints = [
        { left: newX, top: newY },
        { left: newX + newWidth, top: newY },
        { left: newX + newWidth, top: newY + newHeight },
        { left: newX, top: newY + newHeight },
      ]
      offset.left = points[baseIndex].left - newPoints[baseIndex].left
      offset.top = points[baseIndex].top - newPoints[baseIndex].top
    }
    return {
      left: newX + offset.left,
      top: newY + offset.top,
      width: newWidth,
      height: newHeight,
    }
  }

  getTransformRectAngle(options: OptsType, angle: number = 0): TransformRectType {
    var originLeft = options.left | 0
    var originTop = options.top | 0
    var width = options.width | 0
    var height = options.height | 0
    var r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2
    var a = (Math.atan(height / width) * 180) / Math.PI
    var tlbra = 180 - angle - a
    var trbla = a - angle
    var ta = 90 - angle
    var ra = angle
    var halfWidth = width / 2
    var halfHeight = height / 2
    var middleX = originLeft + halfWidth
    var middleY = originTop + halfHeight
    var topLeft = {
      left: middleX + r * Math.cos((tlbra * Math.PI) / 180),
      top: middleY - r * Math.sin((tlbra * Math.PI) / 180),
    }
    var top = {
      left: middleX + halfHeight * Math.cos((ta * Math.PI) / 180),
      top: middleY - halfHeight * Math.sin((ta * Math.PI) / 180),
    }
    var topRight = {
      left: middleX + r * Math.cos((trbla * Math.PI) / 180),
      top: middleY - r * Math.sin((trbla * Math.PI) / 180),
    }
    var right = {
      left: middleX + halfWidth * Math.cos((ra * Math.PI) / 180),
      top: middleY + halfWidth * Math.sin((ra * Math.PI) / 180),
    }
    var bottomRight = {
      left: middleX - r * Math.cos((tlbra * Math.PI) / 180),
      top: middleY + r * Math.sin((tlbra * Math.PI) / 180),
    }
    var bottom = {
      left: middleX - halfHeight * Math.sin((ra * Math.PI) / 180),
      top: middleY + halfHeight * Math.cos((ra * Math.PI) / 180),
    }
    var bottomLeft = {
      left: middleX - r * Math.cos((trbla * Math.PI) / 180),
      top: middleY + r * Math.sin((trbla * Math.PI) / 180),
    }
    var left = {
      left: middleX - halfWidth * Math.cos((ra * Math.PI) / 180),
      top: middleY - halfWidth * Math.sin((ra * Math.PI) / 180),
    }
    var minX = Number(Math.min(topLeft.left, topRight.left, bottomRight.left, bottomLeft.left) as any)
    var maxX = Number(Math.max(topLeft.left, topRight.left, bottomRight.left, bottomLeft.left) as any)
    var minY = Number(Math.min(topLeft.top, topRight.top, bottomRight.top, bottomLeft.top) as any)
    var maxY = Number(Math.max(topLeft.top, topRight.top, bottomRight.top, bottomLeft.top) as any)
    return {
      point: [topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left],
      width: maxX - minX,
      height: maxY - minY,
      left: minX,
      right: maxX,
      top: minY,
      bottom: maxY,
    }
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe()
  }

  getTargetBlock(id: string) {
    let data = null
    this.blockLists.forEach((element) => {
      if (element.blockId === id) {
        data = {
          blockId: element.blockId,
          pageId: this.pageId,
          type: element.type,
          block: element,
          projectId: this.projectId,
        }
        return
      }
    })
    return data
  }

  emitSelectedBlock(item) {
    const newBlock = this.getTargetBlock(item.getAttribute('chartid'))
    this.selected.emit({
      blockId: newBlock.blockId,
      type: newBlock.type,
      data: newBlock,
      dom: item,
    })
  }

  updateSelectedBlockDomList() {
    this.domList = []
    Array.prototype.slice.call(document.querySelectorAll('.block-container')).map((element) => {
      this.idList.map((item) => {
        if (element.getAttribute('chartid') === item) {
          this.domList.push(element)
        }
      })
    })
  }

  getSelectedBlock(id) {
    let newBlock = null
    this.blockLists.map((element) => {
      if (element.blockId === id) {
        newBlock = element
      }
    })
    return newBlock
  }

  getSelectedBlockDomList(list: any[]) {
    const newDomList = []
    Array.from(document.querySelectorAll('.block-container')).map((dom) => {
      list.map((id) => {
        if (dom.getAttribute('chartid') === id) {
          newDomList.push(dom)
        }
      })
    })
    return newDomList
  }

  selection(list) {
    if (list.length === 0) return
    this.displayPanel(list)
    this.groupMove(list)
    this.groupRotate(list)
    this.groupResize(list)
    this.createGroupMap()
  }

  displayPanel(list) {
    if (list.length === 1) {
    } else if (list.length > 1) {
      const idList = []
      const newBlockLists = []
      Array.from(document.querySelectorAll('.block-container')).map((item) => item.classList.remove('is-selceted'))
      list.map((item) => {
        if (!item.classList.contains('isLocked')) {
          item.classList.add('is-selceted')
          idList.push(item.getAttribute('chartid'))
          newBlockLists.push(this.getSelectedBlock(item.getAttribute('chartid')))
        }
      })
      this.idList = idList
      localStorage.removeItem('idList')
      localStorage.setItem('idList', JSON.stringify(idList))
      if (this.idList.length > 1) {
        this.selected.emit({
          type: 'multiple',
          data: {
            idList: idList,
            selectedBlockList: newBlockLists,
            selectedDomList: list,
          },
        })
      }
    }
  }

  groupMove(list) {
    const newArr = list.filter((item) => !item.classList.contains('isLocked'))
    this.createDragBox(newArr)
  }

  groupRotate(list) {}

  groupResize(list) {}

  createGroupMap() {
    this.dragBoxWrap.innerHTML = ''
    const { left, top } = this.dragBox.style
    Array.from(document.querySelectorAll('.block-container')).map((item) => {
      const node = <HTMLElement>item.cloneNode(false)
      node.className = 'map-block'
      node.style.position = 'absolute'
      node.style.border = 'none'
      node.style.left = parseInt(node.style.left) - parseInt(left) - 2 + 'px'
      node.style.top = parseInt(node.style.top) - parseInt(top) - 2 + 'px'
      this.dragBoxWrap.appendChild(node)
    })
  }
}
