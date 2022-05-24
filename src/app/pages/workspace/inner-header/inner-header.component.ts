import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { Store } from '@ngrx/store'
import { PublishModalComponent, RenameComponent } from '../../../components/modals'
import { Observable, Subscription } from 'rxjs'
import { DataTransmissionService } from '../../../share/services/data-transmission.service'
import {
  UpdateCurrentProjectArticleAction,
  UpdateCurrentChartProjectArticleAction,
} from '../../../states/actions/project.action'
import { UtilsService } from '../../../share/services/utils.service'
import { UpdateProjectContent } from '../../../states/models/project.model'
import { SetBlockZIndexService } from '../../../share/services/set-block-zIndex.service'
import { take } from 'rxjs/operators'
import { NotifyChartRenderService } from '../../../share/services/notify-chart-render.service'

import * as ProjectActions from '../../../states/actions/project.action'
import * as fromRoot from '../../../states/reducers'
import * as ProjectModels from '../../../states/models/project.model'

import * as $ from 'jquery'
import * as _ from 'lodash'

import { topMenuConfig } from './topMenuConfig'

@Component({
  selector: 'lx-inner-header',
  templateUrl: './inner-header.component.html',
  styleUrls: ['./inner-header.component.scss'],
})
export class InnerHeaderComponent implements OnInit {
  @Input('project') project: ProjectModels.ProjectInfo
  @Input('topbarEmitData') topbarEmitData

  savingState: boolean = true
  bsModalRef: BsModalRef
  projectType: string

  // 对应的 block
  blockId: string
  pageId: string
  type: string
  projectId: string
  block: any

  currentProjectArticle$ // 当前项目的 article 流
  currentProjectArticle // 当前项目的 article

  getCurrentProjectArticleScription: Subscription = new Subscription()
  savingStateSubscription: Subscription = new Subscription()
  getUndoButtonStateSubscription: Subscription = new Subscription()
  getRedoButtonStateSubscription: Subscription = new Subscription()

  // 菜单显示配置
  editblock: boolean = false
  copyblock: boolean = false
  deleteblock: boolean = false
  setKeyboardEvent: boolean = false
  disabledUndoButton: boolean = false
  disabledRedoButton: boolean = false
  lockedblock: boolean = false
  currentBlock: any
  currentType: any

  // 数据更新
  left
  top
  locked: boolean = false

  // 前进回退标识符
  undoFlag: boolean = false
  redoFlag: boolean = false

  // 层级调整
  // blockIndex;
  blockLists = []

  idList = []

  // 参考线
  deleteReferLineId

  // 顶部菜单栏配置项
  topMenuSetting: any = {}

  @Input('selectItems') selectItems: Observable<ProjectModels.ProjectContentObject[]>
  @Output() selected = new EventEmitter()
  selectSubscription = new Subscription()
  showAlignButton: boolean = false

  mySubscription = new Subscription()

  constructor(
    private _store: Store<fromRoot.State>,
    private _activedRoute: ActivatedRoute,
    private _modalService: BsModalService,
    private _dataTransmissionService: DataTransmissionService,
    private _utilsService: UtilsService,
    private _notifyChartRenderService: NotifyChartRenderService,
    private _blockService: SetBlockZIndexService
  ) {}

  ngOnInit() {
    this.projectId = this._activedRoute.snapshot.queryParams.project
    this.projectType = this._activedRoute.snapshot.queryParams.type
    this.savingStateSubscription.add(
      this._store.select(fromRoot.getProjectSavingState).subscribe((saving) => {
        setTimeout(() => {
          this.savingState = saving
        }, 0)
      })
    )

    // 添加快捷键
    if (this.projectType === 'infographic') {
      this.addKeyboardEvent()
    }

    // 判断 redo/undo 可用状态
    setTimeout(() => {
      this.getUndoButtonStateSubscription = this._store.select(fromRoot.getAllArticleRecords).subscribe((res) => {
        if (res && res.length <= 1) {
          this.disabledUndoButton = true
        } else {
          this.disabledUndoButton = false
        }
      })
      this.getRedoButtonStateSubscription = this._store.select(fromRoot.getNextArticle).subscribe((res) => {
        if (res && res.length === 0) {
          this.disabledRedoButton = true
        } else {
          this.disabledRedoButton = false
        }
      })
    }, 0)

    // 监听删除参考线 id
    this._dataTransmissionService.getDeleteReferLineId().subscribe((data) => {
      if (data.type === 'save') {
        this.deleteReferLineId = data.id
        if (data.id) {
          // 如果 id 存在 取消 block 选中状态
          this.goToPageSettings()
        }
      }
    })
  }

  ngAfterViewInit(): void {
    if (this.selectItems) {
      this.selectSubscription = this.selectItems.subscribe((objects) => {
        // 层级调整
        this.getArticleAndCurrentBlockIndex(objects[0])
        this.currentType = objects[0]

        // 控制右侧栏的大小
        if (!objects[0]['newData'] && objects[0]['type'] !== 'multiple') {
          let oldBlockId = localStorage.getItem('oldBlockId')
          if (
            $('.right-content').css('width') === '280px' &&
            (oldBlockId !== objects[0]['blockId'] || objects[0]['type'] === 'article')
          ) {
            $('.right-content').css('width', '240px')
            $('.change-page').css('right', '255px')
          }
          if (!oldBlockId || oldBlockId !== objects[0]['blockId']) {
            localStorage.setItem('oldBlockId', objects[0]['blockId'])
          }
        }

        if (objects[0] && objects[0]['data']) {
          this.currentBlock = _.cloneDeep(objects[0]['data'].block)
        } else {
          this.currentBlock = this.block
        }
        // 显示顶部菜单栏
        setTimeout(() => {
          this.showTopMenu(objects[0])
          if (this.currentBlock && this.currentBlock.locked) {
            this.locked = true
          } else {
            this.locked = false
          }
        }, 0)

        // 修复先点 block 再点参考线删除两个参考线bug
        if (objects[0] && objects[0].type !== 'article') {
          this.resetDeleteReferLineId()
        }
      })
    }

    // 获取当前元素用于更新界面元素
    if (this.projectType === 'infographic') {
      this.mySubscription.add(
        this._store.select(fromRoot.getCurrentProjectArticle).subscribe((res) => {
          if (res && this.currentBlock) {
            const blockLists = res.contents.pages[0].blocks
            const index = blockLists.findIndex((x) => x.blockId === this.currentBlock.blockId)
            this.currentBlock = blockLists[index]
            setTimeout(() => {
              this.showTopMenu(this.currentBlock)
              if (this.currentBlock && this.currentBlock.locked) {
                this.locked = true
              } else {
                this.locked = false
              }
            }, 0)
          }
        })
      )
    }
  }

  ngOnChanges(changes): void {
    if (changes.topbarEmitData) {
      if (changes.topbarEmitData.currentValue) {
        const type = changes.topbarEmitData.currentValue.type
        this.blockId = changes.topbarEmitData.currentValue.blockId
        this.pageId = changes.topbarEmitData.currentValue.pageId
        this.type = type
        this.block = changes.topbarEmitData.currentValue.block
        /**
         * 控制菜单显示
         */

        // 当前配置界面
        if (!$('.edit-data-tab').is(':hidden')) {
          this.editblock = true
        }

        // 如果当前处于切换图表界面，隐藏编辑按钮
        if ($('.showToggleChart').length > 0 || $('.right-content .song').length > 0) {
          this.editblock = false
          $('.right-content').css('width', '280px')
          // $('.header-container').css('padding-right', '280px')
          $('.change-page').css('right', '295px')
        }
        if (changes.topbarEmitData.previousValue && changes.topbarEmitData.previousValue.type) {
          if (
            (changes.topbarEmitData.currentValue.type === 'audio' &&
              changes.topbarEmitData.previousValue.type === 'chart') ||
            (changes.topbarEmitData.currentValue.type === 'chart' &&
              changes.topbarEmitData.previousValue.type === 'audio')
          ) {
            $('.right-content').css('width', '240px')
          }
        }
      }
    }
  }

  baiduCollect(type: string) {
    if (type === 'align') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'edit-top-align-hover'])
    } else if (type === 'layer') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'edit-top-layer-hover'])
    }
  }

  handleAlignButtonClick(type, event?) {
    const rightContentBox = document.querySelector('.right-content') as HTMLElement
    if (this.currentBlock && this.currentBlock.type === 'chart') {
      switch (type) {
        case 't':
          if (event) {
            window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'toptoolbar-chartobject-align-top'])
          } else {
            window['_hmt'].push(['_trackEvent', 'editpage', 'shortcut', 'shortcut-chartobject-align-top'])
          }
          break
        case 'b':
          if (event) {
            window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'toptoolbar-chartobject-align-bottom'])
            console.log(`click-l`)
          } else {
            window['_hmt'].push(['_trackEvent', 'editpage', 'shortcut', 'shortcut-chartobject-align-bottom'])
            console.log(`shortcut-l`)
          }
          break
        case 'l':
          if (event) {
            window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'toptoolbar-chartobject-align-left'])
          } else {
            window['_hmt'].push(['_trackEvent', 'editpage', 'shortcut', 'shortcut-chartobject-align-left'])
          }
          break
        case 'r':
          if (event) {
            window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'toptoolbar-chartobject-align-right'])
          } else {
            window['_hmt'].push(['_trackEvent', 'editpage', 'shortcut', 'shortcut-chartobject-align-right'])
          }
          break
        case 'c':
          if (event) {
            window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'toptoolbar-chartobject-align-vcenter'])
          } else {
            window['_hmt'].push(['_trackEvent', 'editpage', 'shortcut', 'shortcut-chartobject-align-vcenter'])
          }
          break

        case 'm':
          if (event) {
            window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'toptoolbar-chartobject-align-hmiddle'])
          } else {
            window['_hmt'].push(['_trackEvent', 'editpage', 'shortcut', 'shortcut-chartobject-align-hmiddle'])
          }
          break
        default:
          break
      }
    }
    if (rightContentBox) {
      ;(rightContentBox.querySelector('.align-' + type) as HTMLElement).click()
    }
  }

  undo() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'edit-top-undo-click'])
    this.executeUndoAction()
    if (this.undoFlag) {
      this.executeUndoAction()
      this.undoFlag = null
    }
  }

  redo() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'edit-top-redo-click'])
    this.executeRedoAction()
    if (this.redoFlag) {
      this.executeRedoAction()
      this.redoFlag = null
    }
  }

  executeUndoAction() {
    this._store.dispatch(new ProjectActions.setProjectUndoAction())
    this._store
      .select(fromRoot.getRedoUndoUpdateTypeAndData)
      .pipe(take(1))
      .subscribe((res) => {
        if (res.target && res.target.type === 'group-delete') {
          const projectList = _.cloneDeep(res.target.projectBlockList)
          const projectListCopy = _.cloneDeep(res.target.projectBlockList)
          const toDeleteList = _.pullAllBy(projectListCopy, res.target.groupDeleteData, 'blockId')
          try {
            toDeleteList.map((item) => this.changeBlock(item, 'delete'))
            projectList.map((item) => this.changeBlock(item, 'add'))
          } catch (error) {
            console.log(error)
          }
          this.goToPageSettings()
        } else if (res.target && res.target.type === 'group-move') {
          this.updateGroupList(res)
        } else if (res.target && res.target.type === 'set-index') {
          this._blockService.backNode(
            res.target.indexData.moveArr,
            res.target.indexData.oldList,
            this.blockLists,
            res.target.indexData.changeAction
          )
          // 更新数据
          let oldContents = _.cloneDeep(res.data.contents ? res.data.contents : res.data.article.contents)
          oldContents.pages[0].blocks = res.target.indexData.oldList
          let newArticle = {
            contents: oldContents,
          }
          this._store.dispatch(
            new ProjectActions.SaveCurrentProjectAritcleAction({
              article: newArticle,
            })
          )
        } else if (res.target && res.target.type !== 'article') {
          if (res.target.flag) {
            this.undoFlag = true
          }

          let article = res.data.contents ? res.data.contents : res.data.article.contents
          let pageId = article.pages[0].pageId
          let blocks = _.cloneDeep(article.pages[0].blocks)
          let index = blocks.findIndex((x) => x.blockId === res.target.data.block.blockId)

          // 新增的元素在之前的列表当中是没有的，这里单独处理
          let newBlock, method
          if (res.target.method === 'add') {
            newBlock = res.target.data.block
          } else {
            if (this.projectType === 'chart') {
              newBlock = article.pages[0].blocks[0]
            } else {
              newBlock = index === -1 ? res.target.data.block : blocks[index]
            }
          }

          // 回退操作是反向的，所以将反向操作逆行
          if (res.target.method === 'add') {
            method = 'delete'
          } else if (res.target.method === 'delete') {
            method = 'add'
          } else {
            method = res.target.method
          }

          // 删除回退单独处理，其余还是走之前的逻辑
          // 原理是删除之前所有的元素，重新添加排序
          if (res.target.method === 'delete') {
            const newBlocks = _.cloneDeep(res.target.prevBlockList)
            const toDeleteList = newBlocks.filter((item) => item.blockId !== res.target.data.block.blockId)
            try {
              toDeleteList.map((item) => this.changeBlock(item, 'delete'))
              newBlocks.map((item) => this.changeBlock(item, 'add'))
            } catch (error) {
              console.log(error)
            }
          } else {
            let newData: UpdateProjectContent = {
              target: {
                blockId: newBlock.blockId,
                pageId: pageId,
                type: newBlock.type,
                target: 'redo',
                index,
              },
              method: method,
              block: newBlock,
            }
            if (this.projectType === 'infographic') {
              this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
            } else if (this.projectType === 'chart') {
              this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData))
            }
          }
          // 如果是删除操作，切换到选择画布
          if (method === 'delete' && this.undoFlag !== true) {
            this.goToPageSettings()
          } else {
            this.curBlockSelected(newBlock)
          }
        } else {
          const design = res.data.contents ? res.data.contents.design : res.data.article.contents.design
          let newData: UpdateProjectContent = {
            target: {
              pageId: this.project.article.contents.pages[0].pageId,
              type: 'article',
              target: 'redo',
            },
            method: 'put',
            design: design,
          }
          if (this.projectType === 'infographic') {
            this._store.dispatch(new UpdateCurrentProjectArticleAction(this.project.id, newData))
          } else if (this.projectType === 'chart') {
            this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.project.id, newData))
          }
        }

        // 更新图表状态
        this._notifyChartRenderService.sendChartRender(true)
      })
  }

  changeBlock(block, type) {
    let newData: UpdateProjectContent = {
      target: {
        blockId: block.blockId,
        pageId: this.pageId,
        type: block.type,
        target: 'redo',
      },
      method: type,
      block: block,
    }
    if (this.projectType === 'infographic') {
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
    } else if (this.projectType === 'chart') {
      this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData))
    }
  }

  executeRedoAction() {
    this._store.dispatch(new ProjectActions.setProjectRedoAction())
    this._store
      .select(fromRoot.getRedoUndoUpdateTypeAndData)
      .pipe(take(1))
      .subscribe((res) => {
        if (res.target && res.target.type === 'group-delete') {
          // 还原批量删除元素
          const list = _.cloneDeep(res.target.groupDeleteData)
          list.map((item) => {
            let newData: any = {
              target: {
                blockId: item.blockId,
                pageId: this.pageId,
                type: item.type,
                target: 'redo',
              },
              method: 'delete',
              block: item,
            }
            this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
          })
          this.goToPageSettings()
        } else if (res.target && res.target.type === 'group-move') {
          this.updateGroupList(res)
        } else if (res.target && res.target.type === 'set-index') {
          this._blockService.moveNode(
            _.cloneDeep(res.target.indexData.moveArr),
            res.target.indexData.changeAction,
            true
          )
          // 更新数据
          let oldContents = _.cloneDeep(res.data.contents ? res.data.contents : res.data.article.contents)
          oldContents.pages[0].blocks = res.target.indexData.newList
          let newArticle = {
            contents: oldContents,
          }
          this._store.dispatch(
            new ProjectActions.SaveCurrentProjectAritcleAction({
              article: newArticle,
            })
          )
        } else if (res.target && res.target.type !== 'article') {
          if (res.target.flag) {
            this.redoFlag = true
          }
          let article = res.data.contents ? res.data.contents : res.data.article.contents
          let pageId = article.pages[0].pageId
          let blocks = _.cloneDeep(article.pages[0].blocks)
          let index = blocks.findIndex((x) => x.blockId === res.target.data.block.blockId)
          let method = res.target.method

          // 新增的元素在之前的列表当中是没有的，这里单独处理
          let newBlock
          if (res.target.method === 'add' || res.target.method === 'delete') {
            newBlock = _.cloneDeep(res.target.data.block)
          } else {
            newBlock = _.cloneDeep(blocks[index])
          }

          let newData: UpdateProjectContent = {
            target: {
              blockId: newBlock.blockId,
              pageId: pageId,
              type: newBlock.type,
              target: 'redo',
            },
            method: method,
            block: newBlock,
          }
          if (this.projectType === 'infographic') {
            this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
          } else if (this.projectType === 'chart') {
            this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData))
          }
          // 如果是删除操作，切换到选择画布
          if (method === 'delete' && this.redoFlag !== true) {
            this.goToPageSettings()
          } else {
            // this.curBlockSelected(newBlock)
          }
        } else {
          const design = res.data.contents ? res.data.contents.design : res.data.article.contents.design
          let newData: UpdateProjectContent = {
            target: {
              pageId: this.project.article.contents.pages[0].pageId,
              type: 'article',
              target: 'redo',
            },
            method: 'put',
            design: design,
          }
          if (this.projectType === 'infographic') {
            this._store.dispatch(new UpdateCurrentProjectArticleAction(this.project.id, newData))
          } else if (this.projectType === 'chart') {
            this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.project.id, newData))
          }
        }
      })
  }

  updateGroupList(res) {
    let article = res.data.contents ? res.data.contents : res.data.article.contents
    let blocks = _.cloneDeep(article.pages[0].blocks)
    const newBlockIdList = []
    res.target.groupMoveData.map((item) => {
      const index = blocks.findIndex((x) => x.blockId === item.blockId)
      const block = blocks[index]
      newBlockIdList.push(block.blockId)
      let newData: any = {
        target: {
          blockId: block.blockId,
          pageId: this.pageId,
          type: block.type,
          target: 'redo',
        },
        method: 'put',
        block: block,
      }
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
    })
    this.goToPageSettings()
    setTimeout(() => {
      this._dataTransmissionService.sendContextMenuData(newBlockIdList)
    }, 0)
  }

  addKeyboardEvent() {
    const that = this
    const debounceUploadBlock = _.debounce(that.updateBlock.bind(this), 500)

    $(document).keydown(function (event) {
      const keyNum = event.keyCode || event.which || event.charCode
      let ctrlKey
      if (/macintosh|mac os x/i.test(navigator.userAgent)) {
        ctrlKey = event.metaKey
      } else {
        ctrlKey = event.ctrlKey
      }
      const altKey = event.altKey
      const shiftKey = event.shiftKey

      // console.log(keyNum);
      if ($('.edit-data-tab .nav-item:first-child').hasClass('active')) {
        return
      } else {
        switch (keyNum) {
          case 37:
            // 如果是 TEXT 对象，选中状态启动原有光标
            if ($('.block-text .textMask').is(':hidden') || $('input').is(':focus')) {
              return
            } else {
              event.preventDefault()
            }
            // 如果有选择目标才执行操作
            if (shiftKey && $('.block-container').hasClass('show')) {
              var item = $('.block-container.show')
              if (!item) return
              item.css({ left: '-=10px' })
              that.left = parseInt(item.css('left'))
              that.setMagicBoxStyle()
              debounceUploadBlock()
            } else if ($('.block-container').hasClass('show')) {
              var item = $('.block-container.show')
              if (!item) return
              item.css({ left: '-=1px' })
              that.left = parseInt(item.css('left'))
              that.setMagicBoxStyle()
              debounceUploadBlock()
            }
            break
          case 38:
            // 如果是 TEXT 对象，选中状态启动原有光标
            if ($('.block-text .textMask').is(':hidden') || $('input').is(':focus')) {
              return
            } else {
              event.preventDefault()
            }

            // 如果有选择目标才执行操作
            if (shiftKey && $('.block-container').hasClass('show')) {
              var item = $('.block-container.show')
              if (!item) return
              item.css({ top: '-=10px' })
              that.top = parseInt(item.css('top'))
              that.setMagicBoxStyle()
              debounceUploadBlock()
            } else if ($('.block-container').hasClass('show')) {
              var item = $('.block-container.show')
              if (!item) return
              item.css({ top: '-=1px' })
              that.top = parseInt(item.css('top'))
              that.setMagicBoxStyle()
              debounceUploadBlock()
            }
            break
          case 39:
            // 如果是 TEXT 对象，选中状态启动原有光标
            if ($('.block-text .textMask').is(':hidden') || $('input').is(':focus')) {
              return
            } else {
              event.preventDefault()
            }

            // 如果有选择目标才执行操作
            if (shiftKey && $('.block-container').hasClass('show')) {
              var item = $('.block-container.show')
              if (!item) return
              item.css({ left: '+=10px' })
              that.left = parseInt(item.css('left'))
              that.setMagicBoxStyle()
              debounceUploadBlock()
            } else if ($('.block-container').hasClass('show')) {
              var item = $('.block-container.show')
              if (!item) return
              item.css({ left: '+=1px' })
              that.left = parseInt(item.css('left'))
              that.setMagicBoxStyle()
              debounceUploadBlock()
            }
            break
          case 40:
            // 如果是 TEXT 对象，选中状态启动原有光标
            if ($('.block-text .textMask').is(':hidden') || $('input').is(':focus')) {
              return
            } else {
              event.preventDefault()
            }

            // 如果有选择目标才执行操作
            if (shiftKey && $('.block-container').hasClass('show')) {
              var item = $('.block-container.show')
              if (!item) return
              item.css({ top: '+=10px' })
              that.top = parseInt(item.css('top'))
              that.setMagicBoxStyle()
              debounceUploadBlock()
            } else if ($('.block-container').hasClass('show')) {
              var item = $('.block-container.show')
              if (!item) return
              item.css({ top: '+=1px' })
              that.top = parseInt(item.css('top'))
              that.setMagicBoxStyle()
              debounceUploadBlock()
            }
            break
          case 46:
            // 屏蔽选色板的渐变色模块有相同的键盘监听
            if ($('.block-container').hasClass('show') && $('.color-picker-wrapper-show').length === 0) {
              event.preventDefault()
              if (!(that.currentBlock && that.currentBlock.locked)) {
                that.delete()
              }
            }
            break
          // 键盘 backspace 具有相同的删除功能
          case 8:
            // 判断具有focuse对象
            if (
              $('.block-container').hasClass('show') &&
              $('.color-picker-wrapper-show').length === 0 &&
              document.activeElement.localName !== 'input' &&
              document.activeElement['type'] !== 'text' &&
              document.activeElement.localName !== 'textarea'
            ) {
              event.preventDefault()
              if (!(that.currentBlock && that.currentBlock.locked)) {
                that.delete()
              }
            }
            break
          case 68:
            // 复用
            if (ctrlKey && $('.block-container').hasClass('show')) {
              event.preventDefault()
              that.copy()
            }
            break
          case 76:
            if (ctrlKey && altKey) {
              event.preventDefault()
              that.handleAlignButtonClick('l')
            }
            if (ctrlKey && shiftKey) {
              event.preventDefault()
              that.lockedHandle()
            }
            break
          case 67:
            if (ctrlKey && altKey) {
              event.preventDefault()
              that.handleAlignButtonClick('c')
            }
            break
          case 82:
            if (ctrlKey && altKey) {
              event.preventDefault()
              that.handleAlignButtonClick('r')
            }
            break
          case 84:
            if (ctrlKey && altKey) {
              event.preventDefault()
              that.handleAlignButtonClick('t')
            }
            break
          case 77:
            if (ctrlKey && altKey) {
              event.preventDefault()
              that.handleAlignButtonClick('m')
            }
            break
          case 66:
            if (ctrlKey && altKey) {
              event.preventDefault()
              that.handleAlignButtonClick('b')
            }
            break
          case 219:
            // ctrl + shift + [ 调整至底部
            if (ctrlKey && shiftKey && ($('.block-container').hasClass('show') || !$('.drag-box').is(':hidden'))) {
              console.log('执行了调整至底部')
              event.preventDefault()
              that.setBlockMoveLevel('moveDownBottom')
            }
            // ctrl + [ 下移一层
            if (ctrlKey && !shiftKey && ($('.block-container').hasClass('show') || !$('.drag-box').is(':hidden'))) {
              console.log('执行了下移一层')
              event.preventDefault()
              that.setBlockMoveLevel('moveDownOneLevel')
            }
            break
          case 221:
            // ctrl + shift + ] 调整至顶部
            if (ctrlKey && shiftKey && ($('.block-container').hasClass('show') || !$('.drag-box').is(':hidden'))) {
              console.log('执行了调整至顶部')
              event.preventDefault()
              that.setBlockMoveLevel('moveUpTop')
            }
            // ctrl + ] 上移一层
            if (ctrlKey && !shiftKey && ($('.block-container').hasClass('show') || !$('.drag-box').is(':hidden'))) {
              console.log('执行了上移一层')
              event.preventDefault()
              that.setBlockMoveLevel('moveUpOneLevel')
            }
            break
          default:
            break
        }
      }
    })
  }

  rename() {
    this.bsModalRef = this._modalService.show(RenameComponent, {
      initialState: {
        project: this.project,
      },
    })
  }

  publish() {
    this.bsModalRef = this._modalService.show(PublishModalComponent, {
      initialState: {
        project: this.project,
      },
    })
  }

  // changePageHandle() {
  //   this.goToPageSettings()
  //   // $('.workspace').click();
  //   // 百度统计
  //   window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-float-settings-click']);
  // }

  // edit(e) {
  //   e.stopPropagation();
  //   this._dataTransmissionService.sendData(true);
  //   window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'toptoolbar-chartobject-editdata']);
  // }

  copy(event?) {
    if (this.currentBlock && this.currentBlock.type === 'chart') {
      if (event) {
        // window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'toptoolbar-chartobject-clone']);
      } else {
        window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'shortcut-chartobject-clone'])
      }
    }
    let newBlock = _.cloneDeep(this.currentBlock)
    newBlock.blockId = this._utilsService.generate_uuid()
    newBlock.position.top = (newBlock.position.top | 0) + 20
    newBlock.position.left = (newBlock.position.left | 0) + 20
    let newData: any = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: newBlock.type,
      },
      method: 'add',
      block: newBlock,
    }
    if (this.projectType === 'infographic') {
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
    } else if (this.projectType === 'chart') {
      this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData))
    }
    this.curBlockSelected(newBlock)
    setTimeout(() => {
      this._dataTransmissionService.sendContextMenuData(newBlock)
    }, 0)
  }

  delete(event?) {
    if (this.currentBlock && this.currentBlock.type === 'chart') {
      if (event) {
        // window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'toptoolbar-chartobject-delete']);
      } else {
        window['_hmt'].push(['_trackEvent', 'editpage', 'toptoolbar', 'shortcut-chartobject-delete'])
      }
    }
    if (this.currentBlock) {
      let newBlock = _.cloneDeep(this.currentBlock)
      let newData: any = {
        target: {
          blockId: newBlock.blockId,
          pageId: this.pageId,
          type: newBlock.type,
        },
        method: 'delete',
        block: newBlock,
      }
      this._notifyChartRenderService.sendChartRender(undefined)
      if (this.projectType === 'infographic') {
        this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
      } else if (this.projectType === 'chart') {
        this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData))
      }
      this.goToPageSettings()
    }
  }

  // 切换至页面设置
  goToPageSettings() {
    this.selected.emit({
      type: 'article',
    })
    ;(document.querySelector('.magic-box') as HTMLElement).style.display = 'none'
    ;(document.querySelector('.drag-box') as HTMLElement).style.display = 'none'
    Array.from(document.querySelectorAll('.block-container')).map((item) => item.classList.remove('is-selceted'))
  }

  // 设置拖拽框位置
  setMagicBoxStyle() {
    const target = document.querySelector('.block-container.show') as HTMLElement
    const magicBox = document.querySelector('.magic-box') as HTMLElement
    if (target && magicBox) {
      const magicBoxStyle = magicBox.style
      magicBoxStyle.top = target.style.top
      magicBoxStyle.left = target.style.left
      magicBoxStyle.height = target.style.height
      magicBoxStyle.width = target.style.width
      magicBoxStyle.transform = target.style.transform
    }
  }

  lockedHandle() {
    if (this.currentType.type === 'multiple') {
      this._dataTransmissionService.sendLockedData(true)
      this.goToPageSettings()
    } else {
      this.locked = !this.currentBlock.locked
      let newBlock = _.cloneDeep(JSON.parse(localStorage.getItem('block')).block)
      newBlock.locked = this.locked
      let newData: any = {
        target: {
          blockId: newBlock.blockId,
          pageId: this.pageId,
          type: newBlock.type,
        },
        method: 'put',
        block: newBlock,
      }
      if (this.projectType === 'infographic') {
        this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
      }
    }
  }

  updateBlock() {
    if (!this.currentBlock) return
    let newBlock = _.cloneDeep(this.currentBlock)
    const data = _.cloneDeep(JSON.parse(localStorage.getItem('block')).block)
    newBlock.position = _.cloneDeep(data.position)
    newBlock.props.size = _.cloneDeep(data.props.size)
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)

    if (this.left) {
      newBlock.position.left = (this.left / (scale / 100)).toFixed()
    }
    if (this.top) {
      newBlock.position.top = (this.top / (scale / 100)).toFixed()
    }

    let newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: newBlock.type,
      },
      method: 'put',
      block: newBlock,
    }

    // 更新完成以后将 left 和 top 置空
    this.left = null
    this.top = null

    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
  }

  // 选中当前图表
  curBlockSelected(newBlock) {
    let blockList = []
    let blockBoxList = $('.page').find('.block-container')
    setTimeout(() => {
      blockBoxList.each((k, v) => {
        blockList.push($(v).attr('chartid'))
      })
      const index = blockList.findIndex((x) => x === newBlock.blockId)
      if (index !== -1) {
        $(blockBoxList[index]).click()
      }
    }, 0)
  }

  // 层级调整
  getArticleAndCurrentBlockIndex(e) {
    this.currentProjectArticle$ = this._store.select(fromRoot.getCurrentProjectArticle)
    this.getCurrentProjectArticleScription = this.currentProjectArticle$.subscribe((data) => {
      if (data) {
        this.blockLists = data.contents.pages[0].blocks
        if (e.type === 'multiple') {
          this.idList = e.data.idList.map((item) => this.blockLists.findIndex((x) => x.blockId === item))
        } else {
          this.idList = [this.blockLists.findIndex((x) => x.blockId === e.blockId)]
        }
        // if (this.blockLists && this.blockLists.length) {
        //   this.blockIndex = this.blockLists.findIndex(x => x.blockId === e.blockId);
        // }
        this.currentProjectArticle = data
      }
    })
  }

  // 移动层级
  setBlockMoveLevel(pos) {
    this._blockService.handleMultiLevel(this.idList, pos, this.currentProjectArticle)
    // 移动的 json lists, 当前要移动的 block 处于的 index,当前的 article
    // this._blockService.handleIndexChange(this.blockIndex, pos, this.currentProjectArticle)
    // magicBox 蓝框修正
    // this.curBlockSelected(this.blockLists[this.blockIndex].blockId);
  }

  // --------------------------- 参考线 ------------------------------------
  sendDeleteReferLineId() {
    this._dataTransmissionService.sendDeleteReferLineId({ type: 'delete', id: this.deleteReferLineId })
  }

  resetDeleteReferLineId() {
    this._dataTransmissionService.sendDeleteReferLineId({ type: 'save', id: undefined })
  }

  ngOnDestroy() {
    this.savingStateSubscription.unsubscribe()
    this.getCurrentProjectArticleScription.unsubscribe()
    this.getUndoButtonStateSubscription.unsubscribe()
    this.getRedoButtonStateSubscription.unsubscribe()
    this.selectSubscription.unsubscribe()
    this.mySubscription.unsubscribe()
    $(document).unbind('keydown')
  }

  // --------------------------- 顶部菜单栏 ------------------------------------
  showTopMenu(data) {
    if (!data) return
    if (this.projectType === 'infographic') {
      if (data.type === 'article') {
        this.topMenuSetting = topMenuConfig.article
      } else if (data.type === 'multiple') {
        this.topMenuSetting = topMenuConfig.infographic.multiple
      } else {
        if (this.currentBlock && this.currentBlock.locked) {
          this.setTopMenuLockedType(data.type)
        } else {
          this.setTopMenuUnLockedType(data.type)
        }
      }
    } else if (this.projectType === 'chart') {
      this.topMenuSetting = topMenuConfig.singleChart
    } else {
      // ...
    }
  }

  setTopMenuLockedType(type) {
    this.topMenuSetting = topMenuConfig.infographic.locked[type]
  }

  setTopMenuUnLockedType(type) {
    this.topMenuSetting = topMenuConfig.infographic.unLocked[type]
  }
}
