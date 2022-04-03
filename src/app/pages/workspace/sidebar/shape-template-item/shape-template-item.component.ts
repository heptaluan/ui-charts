import { Component, OnInit, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { UtilsService } from '../../../../share/services/utils.service';
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action';
import * as fromRoot from '../../../../states/reducers';
import { UpdateProjectContent, Block, TextBlockProps, ShapeBlockProps } from '../../../../states/models/project.model';
import { ShapeMapService } from '../../../../block/shape-map.service';
import * as $ from 'jquery';

@Component({
  selector: 'lx-shape-template-item',
  templateUrl: './shape-template-item.component.html',
  styleUrls: ['./shape-template-item.component.scss']
})
export class ShapeTemplateItemComponent implements OnInit {


  @Input() pageId: string;
  @Input('data') shapeTemplates;

  projectId: string;

  constructor(private _utilsService: UtilsService,
    private _activateRouter: ActivatedRoute,
    private _store: Store<fromRoot.State>,
    private _shapeMapService: ShapeMapService,
    ) {
    this.projectId = this._activateRouter.snapshot.queryParams.project;
  }

  ngOnInit() {}

  insertShape(e, i) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-insert-shape-index', i]);
    const shapeType = e.currentTarget.parentElement.getAttribute('shapeType');
    let newBlock;
    switch (shapeType) {
      // 直线
      case 'line':
        newBlock = _.cloneDeep(this._shapeMapService.LineShapeBlockTemplate);
        newBlock.arrowLeftPath = '';
        newBlock.arrowRightPath = '';
        break;

      // 带箭头
      case 'line-arrow':
        newBlock = _.cloneDeep(this._shapeMapService.LineShapeBlockTemplate);
        break;

      // 矩形
      case 'rectangle':
        newBlock = _.cloneDeep(this._shapeMapService.RectShapeBlockTemplate);
        break;

      // 圆形
      case 'oval':
        newBlock = _.cloneDeep(this._shapeMapService.OvalShapeBlockTemplate);
        break;

      // 圆角矩形
      case 'round-rectangle':
        newBlock = _.cloneDeep(this._shapeMapService.RoundRectShapeBlockTemplate);
        break;

      // 三角形
      case 'triangle':
        newBlock = _.cloneDeep(this._shapeMapService.TriangleShapeBlockTemplate);
        break;

      // 五边形
      case 'pentagon':
        newBlock = _.cloneDeep(this._shapeMapService.PentagonShapeBlockTemplate);
        break;

      default:
        break;
    }
    this.addShape(newBlock);
  }

  addShape(newBlock) {
    newBlock.blockId = this._utilsService.generate_uuid();
    newBlock.pageId = this.pageId;
    newBlock.props.size.rotate = 0;

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
      left: left
    }
    
    let newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: 'shape'
      },
      method: 'add',
      block: newBlock as any
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
    this.curSelected(newBlock);
  }

  // 选中当前对象
  curSelected(newBlock) {
    let blockList = []
    let blockBoxList = $('.page').find('.block-container');
    setTimeout(() => {
      blockBoxList.each((k, v) => {
        blockList.push($(v).attr('chartid'))
      })
      const index = blockList.findIndex(x => x === newBlock.blockId);
      if (index !== -1) {
        $(blockBoxList[index]).click();
      }
    }, 300);
  }

}
