import { Component, OnInit, SimpleChanges } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import * as _ from 'lodash'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../../states/reducers'
import { UpdateProjectContent } from '../../../../states/models/project.model'
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action'
import * as ProjectActions from '../../../../states/actions/project.action'
import { DataTransmissionService } from '../../../../share/services'

@Component({
  selector: 'lx-multiple-settings',
  templateUrl: './multiple-settings.component.html',
  styleUrls: ['./multiple-settings.component.scss'],
})
export class MultipleSettingsComponent implements OnInit {
  idList: string[]
  blockList: any = []
  domList: any = []
  dragBoxStyle: any
  dragBoxClientRect: any

  selectedBlockList: any
  pageId: any
  projectId: any
  scale: any

  moveEndBlockList: any

  getCurrentProjectArticleScription = new Subscription()

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _store: Store<fromRoot.State>,
    private _dataTransmissionService: DataTransmissionService
  ) {}

  ngOnInit() {
    // 监听页面变化的时候同步拖拽框
    const targetNode = document.querySelector('.page-size')
    const config = { attributes: true, childList: true, subtree: true }
    const observer = new MutationObserver((_) => {
      this.setDragBoxStyle()
    })
    observer.observe(targetNode, config)
  }

  ngAfterViewInit(): void {
    this.getCurrentProjectArticleScription = this._store
      .select(fromRoot.getCurrentProjectArticle)
      .subscribe((data) => {
        if (data.contents.pages[0].blocks.length > 0) {
          this.selectedBlockList = data.contents.pages[0].blocks
        }
        this.pageId = data.contents.pages[0].pageId
        this.projectId = this._activatedRoute.snapshot.queryParams.project
      })
      .add(
        // 监听鼠标右键复用事件
        this._dataTransmissionService
          .getLockedData()
          .take(1)
          .subscribe((res) => {
            this.handleGroupLocked()
          })
      )
  }

  // 组合锁定事件
  handleGroupLocked() {
    this.getSelectedBlockDomList()
    const groupList = []
    const newList = _.cloneDeep(this.selectedBlockList)
    this.domList.map((item) => {
      const newBlock = _.cloneDeep(this.getNewSelectedBlock(newList, item.getAttribute('chartid')))
      newBlock.locked = true
      groupList.push(newBlock)
      let newData: UpdateProjectContent = {
        target: {
          blockId: newBlock.blockId,
          pageId: this.pageId,
          type: newBlock.type,
          target: 'redo',
        },
        method: 'put',
        block: newBlock,
      }
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
    })
    Array.from(document.querySelectorAll('.block-container')).map((item) => item.classList.remove('is-selceted'))
    this._store.dispatch(new ProjectActions.UpdateCurrentProjectGroupLockedAction(groupList))
  }

  // 对齐事件
  onMultipleClick(type) {
    // 每次获取最新的数据
    this.getSelectedBlockList()
    this.getSelectedBlockDomList()
    this.getDragBoxCurrentStyle()
    this.getDragBoxCurrentClientRect()
    this.scale = Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100
    switch (type) {
      case 'l':
        this.handleAlignLeft()
        break
      case 'r':
        this.handleAlignRight()
        break
      case 'c':
        this.handleAlignCenter()
        break
      case 't':
        this.handleAlignTop()
        break
      case 'b':
        this.handleAlignBottom()
        break
      case 'm':
        this.handleAlignMiddle()
        break
      default:
        break
    }
    this._store.dispatch(new ProjectActions.UpdateCurrentProjectGroupMoveAction(this.blockList))
  }

  // 左对齐
  handleAlignLeft() {
    const dragBoxLeft = (this.dragBoxClientRect.left + 2) | 0
    this.domList.map((item) => {
      const itemLeft = item.getBoundingClientRect().left | 0
      if (itemLeft === dragBoxLeft) {
        return
      } else {
        let offect = itemLeft - dragBoxLeft
        let lastVal = parseInt(item.style.left) - offect
        item.style.left = lastVal / this.scale + 'px'
        this.updateBlockData(item, lastVal / this.scale, 'l')
      }
    })
    setTimeout(() => {
      this.setDragBoxStyle()
    }, 30)
  }

  // 右对齐
  handleAlignRight() {
    const dragBoxRight = (this.dragBoxClientRect.right - 2) | 0
    this.domList.map((item) => {
      const itemRight = item.getBoundingClientRect().right | 0
      if (itemRight === dragBoxRight) {
        return
      } else {
        let offect = dragBoxRight - itemRight
        let lastVal = parseInt(item.style.left) + offect
        item.style.left = lastVal / this.scale + 'px'
        this.updateBlockData(item, lastVal / this.scale, 'r')
      }
    })
    setTimeout(() => {
      this.setDragBoxStyle()
    }, 30)
  }

  // 居中对齐
  handleAlignCenter() {
    const dragBoxLeft = this.dragBoxClientRect.left | 0
    const dragBoxWidth = this.dragBoxClientRect.width | 0
    const dragBoxBasePoint = (dragBoxLeft + dragBoxWidth / 2) | 0
    this.domList.map((item) => {
      const itemLeft = item.getBoundingClientRect().left | 0
      const itemWidth = item.getBoundingClientRect().width | 0
      const itemBasePoint = (itemLeft + itemWidth / 2) | 0
      if (dragBoxBasePoint === itemBasePoint) {
        return
      } else if (dragBoxBasePoint < itemBasePoint) {
        let offect = itemBasePoint - dragBoxBasePoint
        let lastVal = parseInt(item.style.left) - offect
        item.style.left = lastVal / this.scale + 'px'
        this.updateBlockData(item, lastVal / this.scale, 'm')
      } else {
        let offect = dragBoxBasePoint - itemBasePoint
        let lastVal = parseInt(item.style.left) + offect
        item.style.left = lastVal / this.scale + 'px'
        this.updateBlockData(item, lastVal / this.scale, 'm')
      }
    })
    setTimeout(() => {
      this.setDragBoxStyle()
    }, 30)
  }

  // 顶对齐
  handleAlignTop() {
    const dragBoxTop = (this.dragBoxClientRect.top + 2) | 0
    this.domList.map((item) => {
      const itemTop = item.getBoundingClientRect().top | 0
      if (itemTop === dragBoxTop) {
        return
      } else {
        let offect = itemTop - dragBoxTop
        let lastVal = parseInt(item.style.top) - offect
        item.style.top = lastVal / this.scale + 'px'
        this.updateBlockData(item, lastVal / this.scale, 't')
      }
    })
    setTimeout(() => {
      this.setDragBoxStyle()
    }, 30)
  }

  // 底对齐
  handleAlignBottom() {
    const dragBoxBottom = (this.dragBoxClientRect.bottom - 2) | 0
    this.domList.map((item) => {
      const itemBottom = item.getBoundingClientRect().bottom | 0
      if (itemBottom === dragBoxBottom) {
        return
      } else {
        let offect = dragBoxBottom - itemBottom
        let lastVal = parseInt(item.style.top) + offect
        item.style.top = lastVal / this.scale + 'px'
        this.updateBlockData(item, lastVal / this.scale, 'b')
      }
    })
    setTimeout(() => {
      this.setDragBoxStyle()
    }, 30)
  }

  // 垂直对齐
  handleAlignMiddle() {
    const dragBoxTop = this.dragBoxClientRect.top | 0
    const dragBoxHeight = this.dragBoxClientRect.height | 0
    const dragBoxBasePoint = (dragBoxTop + dragBoxHeight / 2) | 0
    this.domList.map((item) => {
      const itemTop = item.getBoundingClientRect().top | 0
      const itemHeight = item.getBoundingClientRect().height | 0
      const itemBasePoint = (itemTop + itemHeight / 2) | 0
      if (dragBoxBasePoint === itemBasePoint) {
        return
      } else if (dragBoxBasePoint < itemBasePoint) {
        let offect = itemBasePoint - dragBoxBasePoint
        let lastVal = parseInt(item.style.top) - offect
        item.style.top = lastVal / this.scale + 'px'
        this.updateBlockData(item, lastVal / this.scale, 'c')
      } else {
        let offect = dragBoxBasePoint - itemBasePoint
        let lastVal = parseInt(item.style.top) + offect
        item.style.top = lastVal / this.scale + 'px'
        this.updateBlockData(item, lastVal / this.scale, 'c')
      }
    })
    setTimeout(() => {
      this.setDragBoxStyle()
    }, 30)
  }

  // 更新 JSON
  updateBlockData(item, value, type) {
    const newBlock = _.cloneDeep(this.getSelectedBlock(item.getAttribute('chartid')))
    switch (type) {
      case 'l':
      case 'r':
      case 'm':
        newBlock.position.left = value
        break
      case 't':
      case 'b':
      case 'c':
        newBlock.position.top = value
        break
      default:
        break
    }
    let newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: newBlock.type,
        target: 'redo',
      },
      method: 'put',
      block: newBlock,
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
  }

  // 接收数据
  updateBlock(data) {
    this.idList = data.idList
    this.selectedBlockList = data.selectedBlockList
    this.moveEndBlockList = data.selectedBlockList
  }

  // 获取当前选中 block 列表
  getSelectedBlockList() {
    this.blockList = []
    this.selectedBlockList.map((element) => {
      this.idList.map((item) => {
        if (element.blockId === item) {
          this.blockList.push(element)
        }
      })
    })
  }

  // 获取当前更新 block
  getSelectedBlock(id) {
    let newBlock = null
    this.selectedBlockList.map((element) => {
      if (element.blockId === id) {
        newBlock = element
      }
    })
    return newBlock
  }

  getNewSelectedBlock(list, id) {
    let newBlock = null
    list.map((element) => {
      if (element.blockId === id) {
        newBlock = element
      }
    })
    return newBlock
  }

  // 获取当前选中元素列表
  getSelectedBlockDomList() {
    this.domList = []
    Array.from(document.querySelectorAll('.block-container')).map((element) => {
      this.idList.map((item) => {
        if (element.getAttribute('chartid') === item) {
          this.domList.push(element)
        }
      })
    })
  }

  // 获取当前拖拽框的位置
  getDragBoxCurrentStyle() {
    this.dragBoxStyle = (document.querySelector('.drag-box') as HTMLElement).style
  }

  // 获取当前拖拽框的绝对位置
  getDragBoxCurrentClientRect() {
    this.dragBoxClientRect = (document.querySelector('.drag-box') as HTMLElement).getBoundingClientRect()
  }

  // 获取当前元素的旋转角度
  getDomRotate(dom) {
    return dom.style.transform ? Number.parseInt(/\(([^()]+)\)/g.exec(dom.style.transform)[1]) : 0
  }

  // 设置新的拖拽框位置
  setDragBoxStyle() {
    if (!document.querySelector('.workspace-wrap')) return
    this.getSelectedBlockDomList()
    const dragBox = document.querySelector('.drag-box') as HTMLElement
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
  }

  // 组合
  handleGroupClick() {
    this._dataTransmissionService.sendGroupData(false)
  }

  ngOnDestroy(): void {
    this.getCurrentProjectArticleScription.unsubscribe()
  }
}
