import { Component, OnInit } from '@angular/core'
import { ModalActions, ModalTitle, ButtonType } from '../../../share/prompt/prompt.component'
import { BsModalRef } from 'ngx-bootstrap/modal'
import * as ProjectActions from '../../../states/actions/project.action'
import * as fromRoot from '../../../states/reducers'
import { Store } from '@ngrx/store'
import * as _ from 'lodash'
import * as $ from 'jquery'
import { UpdateCurrentChartProjectArticleAction } from '../../../states/actions/project.action'
import { UpdateProjectContent } from '../../../states/models/project.model'
import { DataTransmissionService } from '../../../share/services'

@Component({
  selector: 'lx-insert-single-chart-tip',
  templateUrl: './insert-single-chart-tip.component.html',
  styleUrls: ['./insert-single-chart-tip.component.scss'],
})
export class InsertSingleChartTipComponent implements OnInit {
  deleteTitle: ModalTitle = {
    position: 'left',
    content: '提示',
  }

  deleteActions: ModalActions = {
    position: 'right',
    buttons: [
      {
        title: '取消',
        action: 'cancel',
      },
      {
        title: '确认替换',
        action: 'confirm',
      },
    ],
  }

  projectId: string
  pageId
  newBlock
  curBlock
  project: any
  type: string

  constructor(
    public bsModalRef: BsModalRef,
    private _store: Store<fromRoot.State>,
    private _dataTransmissionService: DataTransmissionService
  ) {}

  ngOnInit() {}

  onModalClosed(evt: ButtonType) {
    switch (evt.action) {
      case 'cancel':
        window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-change-chart-cancel'])
        break
      case 'confirm':
        this._dataTransmissionService.sendLogoWatermark(false)
        window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-change-chart-confirm'])

        // 删除之前的图表
        let delBlock = _.cloneDeep(this.curBlock)
        let delData: any = {
          target: {
            blockId: delBlock.blockId,
            pageId: this.pageId,
            type: delBlock.type,
            target: 'redo',
          },
          method: 'delete',
          block: delBlock,
        }
        this._store.dispatch(new ProjectActions.UpdateCurrentChartProjectArticleAction(this.projectId, delData))

        // 改变主题色
        const theme = this.project.article.contents.theme
        this.uploadDesign(this.project.article.contents.design)
        this.newBlock.theme = theme

        // 添加图表数据
        let addData: any = {
          target: {
            blockId: this.newBlock.blockId,
            pageId: this.pageId,
            type: this.newBlock.type,
            target: 'init',
          },
          method: 'add',
          block: this.newBlock,
        }
        this._store.dispatch(new ProjectActions.UpdateCurrentChartProjectArticleAction(this.projectId, addData))
        this.curBlockSelected(this.newBlock.blockId)

        // 避免单图因失去焦点引起的菜单收缩
        $('.right-content').css('width', '240px')
        $('.change-page').css('right', '255px')

        // 同时更新一下单图的画布
        const newArticle = _.cloneDeep(this.project.article)
        newArticle.contents.design.width = 600
        newArticle.contents.design.height = 510
        newArticle.contents.pages[0].blocks[0] = this.newBlock
        this._store.dispatch(
          new ProjectActions.UpdateAndExitCurrentChartProjectAction(this.projectId, {
            action: 'save_project',
            article: newArticle,
          })
        )
        break
      default:
        break
    }
  }

  // 选中当前图表
  curBlockSelected(blockId) {
    let blockList = []
    let blockBoxList = $('.page').find('.block-container')
    setTimeout(() => {
      blockBoxList.each((k, v) => {
        blockList.push($(v).attr('chartid'))
      })
      const index = blockList.findIndex((x) => x === blockId)
      if (index !== -1) {
        $(blockBoxList[index]).click()
      }
    }, 300)
  }

  // 更新design
  uploadDesign(design) {
    let newDesign = _.cloneDeep(design)
    let newData: UpdateProjectContent = {
      target: {
        pageId: this.pageId,
        type: 'article',
        target: 'redo',
      },
      method: 'put',
      design: newDesign,
    }
    this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData))
  }
}
