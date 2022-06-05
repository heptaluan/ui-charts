import { Component, OnInit, Input } from '@angular/core'
import { Store } from '@ngrx/store'
import { ActivatedRoute } from '@angular/router'
import * as _ from 'lodash'

import { UtilsService } from '../../../../share/services/utils.service'
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action'
import * as fromRoot from '../../../../states/reducers'
import { UpdateProjectContent, Block, TextBlockProps } from '../../../../states/models/project.model'
import { ChartMapService } from '../../../../block/chart-map.service'
import * as $ from 'jquery'

@Component({
  selector: 'lx-text-template-item',
  templateUrl: './text-template-item.component.html',
  styleUrls: ['./text-template-item.component.scss'],
})
export class TextTemplateItemComponent implements OnInit {
  @Input() pageId: string
  @Input('data') textTemplates

  projectId: string
  defaultBlock

  constructor(
    private _utilsService: UtilsService,
    private _activateRouter: ActivatedRoute,
    private _store: Store<fromRoot.State>,
    private _chartMapService: ChartMapService
  ) {
    this.projectId = this._activateRouter.snapshot.queryParams.project
    this.defaultBlock = {
      ...this._chartMapService.TemplateTextBlock,
      projectId: this.projectId,
    }
  }

  ngOnInit() {}

  insertText(e, i) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-insert-text-index', i])
    const textType = e.currentTarget.getAttribute('title')
    let block = _.cloneDeep(this.defaultBlock)

    block.blockId = this._utilsService.generate_uuid()

    switch (textType) {
      case '一级标题':
        ;(<TextBlockProps>block.props).fontSize = 38
        ;(<TextBlockProps>block.props).basic.bold = true
        ;(<TextBlockProps>block.props).color = '#000'
        ;(<TextBlockProps>block.props).content = '一级标题'
        ;(<TextBlockProps>block.props).lineHeight = 1.4
        ;(<TextBlockProps>block.props).fontFamily = '阿里巴巴普惠体 粗体'
        break
      case '二级标题':
        ;(<TextBlockProps>block.props).fontSize = 26
        ;(<TextBlockProps>block.props).basic.bold = true
        ;(<TextBlockProps>block.props).color = '#222'
        ;(<TextBlockProps>block.props).content = '二级标题'
        ;(<TextBlockProps>block.props).lineHeight = 1.4
        ;(<TextBlockProps>block.props).fontFamily = '阿里巴巴普惠体 粗体'
        break
      case '正文':
        ;(<TextBlockProps>block.props).fontSize = 22
        ;(<TextBlockProps>block.props).color = '#333'
        ;(<TextBlockProps>block.props).content = '正文'
        ;(<TextBlockProps>block.props).lineHeight = 1.4
        break
      default:
        break
    }

    // 位置视野居中
    // let top = Math.round($('.center-content')[0].clientHeight / 2) + $('.center-content')[0].scrollTop  - 200 + 50;
    // // let left = Math.round(($('.page').width() + $('.center-content').scrollLeft()) / 2) - 250 ;
    // // 减去左右两侧操作面板距离，留下中间可视区域大小
    // let viewWidth = $(window).width() - 50 - 160 - 242;
    // let left;
    // if ($('.page').width() < viewWidth) {
    //   left = Math.round(($('.page').width() + $('.center-content').scrollLeft()) / 2) - 250
    // } else {
    //   left = (Math.round($('.center-content').scrollLeft()) + 450) - 150
    // }

    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    let left, top
    left = Math.round($('.center-content').scrollLeft() / (scale / 100)) + 200
    top = Math.round($('.center-content')[0].scrollTop / (scale / 100)) + 200

    if (scale < 100) {
      left = left + 100 * (scale / 100)
      top = top + 100 * (scale / 100)
    } else {
      left = left - 100 * (scale / 100)
      top = top - 100 * (scale / 100)
    }

    block.position = {
      top: top,
      left: left,
    }

    let newData: UpdateProjectContent = {
      target: {
        blockId: block.blockId,
        pageId: this.pageId,
        type: 'text',
      },
      method: 'add',
      block: block,
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
    this.curTextSelected(block)
  }

  // 选中当前文本对象
  curTextSelected(newBlock) {
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
    }, 300)
  }
}
