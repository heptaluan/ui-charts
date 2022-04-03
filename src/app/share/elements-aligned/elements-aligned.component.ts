import { Component, Input, OnInit } from '@angular/core';
import { UpdateProjectContent } from '../../states/models/project.model';
import * as fromRoot from '../../states/reducers';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { UpdateCurrentProjectArticleAction } from '../../states/actions/project.action';

@Component({
  selector: 'lx-elements-aligned',
  templateUrl: './elements-aligned.component.html',
  styleUrls: ['./elements-aligned.component.scss']
})
export class ElementsAlignedComponent implements OnInit {

  @Input() block: any;
  @Input() projectId: any;
  @Input() pageId: any;
  scale: any

  constructor(
    private _store: Store<fromRoot.State>
  ) { }

  ngOnInit() { }

  // 对齐事件
  onAlignedClick(type, e?) {
    this.scale = Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100
    switch (type) {
      case 'l':
        if (this.block.type === 'chart' && !e.isTrusted) {
          window['_hmt'].push(['_trackEvent', 'editpage', 'right-menu', 'right-menu-chartobject-align-left']);
        }
        this.handleAlignLeft()
        break;
      case 'r':
        if (this.block.type === 'chart' && !e.isTrusted) {
          window['_hmt'].push(['_trackEvent', 'editpage', 'right-menu', 'right-menu-chartobject-align-right']);
        }
        this.handleAlignRight()
        break;
      case 'c':
        if (this.block.type === 'chart' && !e.isTrusted) {
          window['_hmt'].push(['_trackEvent', 'editpage', 'right-menu', 'right-menu-chartobject-align-hmiddle']);
        }
        this.handleAlignCenter()
        break;
      case 't':
        if (this.block.type === 'chart' && !e.isTrusted) {
          window['_hmt'].push(['_trackEvent', 'editpage', 'right-menu', 'right-menu-chartobject-align-top']);
        }
        this.handleAlignTop()
        break;
      case 'b':
        if (this.block.type === 'chart' && !e.isTrusted) {
          window['_hmt'].push(['_trackEvent', 'editpage', 'right-menu', 'right-menu-chartobject-align-bottom'])
        }
        this.handleAlignBottom()
        break;
      case 'm':
        if (this.block.type === 'chart' && !e.isTrusted) {
          window['_hmt'].push(['_trackEvent', 'editpage', 'right-menu', 'right-menu-chartobject-align-vcenter']);
        }
        this.handleAlignMiddle()
        break;

      default:
        break;
    }
  }

  // 左对齐
  handleAlignLeft() {
    const itemLeft = this.block.position.left | 0
    if (itemLeft === 0) {
      return
    } else {
      const diffX = document.querySelector('.magic-box').getBoundingClientRect()['x'] - document.querySelector('#focal').getBoundingClientRect()['x'];
      const res = Number(this.block.position.left) - diffX / this.scale
      this.block.position.left = res;
      this.updateBlockData(res, 'l')
    }
  }

  // 右对齐
  handleAlignRight() {
    const itemLeft = this.block.position.left | 0
    const itemWidth = (this.block.props.size.width * this.scale) | 0
    const pageWidth = (document.querySelector('.workspace.page') as HTMLElement).offsetWidth
    if (itemLeft === (pageWidth - itemWidth)) {
      return
    } else {
      const diffX = document.querySelector('.magic-box').getBoundingClientRect()['x'] - document.querySelector('#focal').getBoundingClientRect()['x'];
      const res = Number(this.block.position.left) - diffX / this.scale + document.querySelector('#focal').getBoundingClientRect()['width'] / this.scale - document.querySelector('.magic-box').getBoundingClientRect()['width'] / this.scale
      this.block.position.left = res;
      this.updateBlockData(res, 'r')
    }
  }

  // 居中对齐
  handleAlignCenter() {
    const itemLeft = this.block.position.left | 0
    const itemWidth = (this.block.props.size.width * this.scale) | 0
    const pageWidth = (document.querySelector('.workspace.page') as HTMLElement).offsetWidth
    const basePoint = (pageWidth / 2) | 0
    if (itemLeft === (basePoint - (itemWidth / 2))) {
      return
    } else {
      const offect = basePoint - (itemWidth / 2)
      this.block.position.left = offect
      this.updateBlockData(offect / this.scale, 'm')
    }
  }

  // 顶对齐
  handleAlignTop() {
    const itemTop = this.block.position.top | 0
    if (itemTop === 0) {
      return
    } else {
      const diffY = Math.floor(document.querySelector('.magic-box').getBoundingClientRect()['y']) - document.querySelector('#focal').getBoundingClientRect()['y'];
      const res = Number(this.block.position.top) - diffY / this.scale
      this.block.position.top = res
      this.updateBlockData(res, 't')
    }
  }
  // 底对齐
  handleAlignBottom() {
    const itemTop = this.block.position.top | 0
    const itemHeight = (this.block.props.size.height * this.scale) | 0
    const pageHeight = (document.querySelector('.workspace.page') as HTMLElement).offsetHeight
    if (itemTop === (pageHeight - itemHeight)) {
      return
    } else {
      //   const offect = pageHeight - itemHeight
      //   this.block.position.top = offect
      //   this.updateBlockData(offect / this.scale, 'b')
      const diffY = Math.floor(document.querySelector('.magic-box').getBoundingClientRect()['y']) - document.querySelector('#focal').getBoundingClientRect()['y'];
      const res = Number(this.block.position.top) - diffY / this.scale + document.querySelector('#focal').getBoundingClientRect().height / this.scale - document.querySelector('.magic-box').getBoundingClientRect().height / this.scale;
      this.block.position.top = res
      this.updateBlockData(res, 'b')
    }
  }

  // 垂直对齐
  handleAlignMiddle() {
    const itemTop = this.block.position.top | 0
    const itemHeight = (this.block.props.size.height * this.scale) | 0
    const pageHeight = (document.querySelector('.workspace.page') as HTMLElement).offsetHeight
    const basePoint = (pageHeight / 2) | 0
    if (itemTop === (basePoint - (itemHeight / 2))) {
      return
    } else {
      const offect = basePoint - (itemHeight / 2)
      this.block.position.top = offect
      this.updateBlockData(offect / this.scale, 'c')
    }
  }

  // 更新 JSON
  updateBlockData(value, type) {
    const newBlock = _.cloneDeep(this.block)
    switch (type) {
      case 'l':
      case 'r':
      case 'm':
        newBlock.position.left = value
        break;
      case 'c':
        newBlock.position.top = value
        break;
      default:
        break;
    }
    let newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: newBlock.type
      },
      method: 'put',
      block: newBlock
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
  }

}
