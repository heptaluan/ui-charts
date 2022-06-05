import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core'
import { Store } from '@ngrx/store'
import { ActivatedRoute } from '@angular/router'
import * as _ from 'lodash'
import { UtilsService } from '../../../../share/services/utils.service'
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action'
import * as fromRoot from '../../../../states/reducers'
import { UpdateProjectContent } from '../../../../states/models/project.model'
import { ShapeMapService } from '../../../../block/shape-map.service'
import * as $ from 'jquery'
import { DataTransmissionService } from '../../../../share/services/data-transmission.service'

@Component({
  selector: 'lx-icon-template-item',
  templateUrl: './icon-template-item.component.html',
  styleUrls: ['./icon-template-item.component.scss'],
})

export class IconTemplateItemComponent implements OnInit {
  @Input() pageId: string
  @Input() blockId: string
  @Input() hideShape = false
  @Input('data') iconTemplates
  @Input('dataCopy') iconDataCopy

  projectId: string

  constructor(
    private _utilsService: UtilsService,
    private _activateRouter: ActivatedRoute,
    private _store: Store<fromRoot.State>,
    private _shapeMapService: ShapeMapService,
    private _dataTransmissionService: DataTransmissionService
  ) {
    this.projectId = this._activateRouter.snapshot.queryParams.project
  }

  ngOnInit() {}

  // 插入图标
  insertImage(e) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-insert-icon'])
    let newBlock = _.cloneDeep(this._shapeMapService.IconShapeBlockTemplate)

    const iconHTML = e.currentTarget.parentElement.getAttribute('iconHTML')
    if (this.hideShape) {
      // 颜色面板插入图标
      if (this.blockId) {
        let data = {
          svg: iconHTML,
          blockId: this.blockId,
        }
        this._dataTransmissionService.sendSvg(data)
      }
    } else {
      // 信息图正常插入图标
      newBlock.src = iconHTML
      newBlock.props.size = {
        width: '128',
        height: '128',
        rotate: '0',
      }
      this.addImage(newBlock)
      this.curSelected(newBlock)
    }
  }

  addImage(newBlock) {
    newBlock.blockId = this._utilsService.generate_uuid()
    newBlock.props.size.rotate = 0
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

    newBlock.position = {
      top: top,
      left: left,
    }

    let newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: 'shape',
      },
      method: 'add',
      block: newBlock as any,
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
  }

  // 选中当前对象
  curSelected(newBlock) {
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
