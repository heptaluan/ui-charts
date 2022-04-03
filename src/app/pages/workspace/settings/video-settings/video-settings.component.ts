import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as ProjectModels from '../../../../states/models/project.model';
import * as fromRoot from '../../../../states/reducers';
import { Store } from '@ngrx/store';
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action';
import { ActivatedRoute } from '@angular/router';
import { UpdateProjectContent } from '../../../../states/models/project.model';

@Component({
  selector: 'lx-video-settings',
  templateUrl: './video-settings.component.html',
  styleUrls: ['./video-settings.component.scss'],
})
export class VideoSettingsComponent implements OnInit {
  curBlock;
  curPageId: string;
  blockProps;
  ratio;
  projectId;
  opacity;
  isError = false;
  srcText = '';
  constructor(
    private _store: Store<fromRoot.State>,
    private _router: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.projectId = this._router.snapshot.queryParams.project;
  }

  // 接收数据
  updateBlock(block: ProjectModels.Block, pageId?: string) {
    this.curBlock = _.cloneDeep(block);
    this.curPageId = _.cloneDeep(pageId);
    this.blockProps = this.curBlock.props;
    // 数据变化的时候，更新面板
    this.initVideoData();
  }

  // 初始化数据
  initVideoData() {
    this.srcText = this.curBlock.props.data.src;
    this.opacity = this.curBlock.props.opacity;
  }

  // 长度 && 宽度 && 旋转角度
  onSizeChanged(event) {
    const blockProps = this.curBlock.props;

    blockProps.size.height = event.value0;
    blockProps.size.width = event.value1;
    blockProps.size.rotate = event.value2;

    if (event.type === 'locked') {
      blockProps.size.ratio = event.locked ? (blockProps.size.height / blockProps.size.width) : null;
      this.ratio = blockProps.size.ratio;
    }

    this.updateCurBlock();
  }

  // 改变透明度
  onInput(opacity) {
    this.curBlock.props.opacity = opacity;
    this.updateCurBlock();
  }

  // 替换视频链接
  handleSwap() {
    if (!this.srcText || !(this.isIframe(this.srcText) || /^.*\.(mp|MP|Mp)4$/.test(this.srcText))) {
       this.isError = true; 
       return
    };

    this.toggleVideo();
    // if (this.isIframe(this.srcText) === this.isIframe(this.curBlock.props.data.src)) {
    //   this.curBlock.props.data.src = this.srcText;
    //   this.updateCurBlock();
    // } else {     
    // }
  }

  // 判断是否是 iframe
  isIframe(str) {
    return /\<iframe/.test(str);
  }

  // 更新数据
  updateCurBlock() {
    let block = _.cloneDeep(this.curBlock);
    let newData: any = {
      target: {
        blockId: block.blockId,
        pageId: this.curPageId,
        type: block.type
      },
      method: 'put',
      block: block as any
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
  }


  toggleVideo() {
    // 删除之前的video
    let delBlock = _.cloneDeep(this.curBlock);
    let newBlock = _.cloneDeep(this.curBlock);
    let delData: any = {
      target: {
        blockId: delBlock.blockId,
        pageId: this.curPageId,
        type: delBlock.type
      },
      method: 'delete',
      block: delBlock
    }

    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, delData));

    newBlock.props.data.src = this.srcText;
    newBlock.props.data.sourceType = this.isIframe(this.srcText) ? 'iframe' : 'url';
    

    // if (newBlock.props.data.sourceType === 'iframe') {

    //   newBlock.props.size.width = this.getIframeWidth(this.srcText) !== 'false' ? this.getIframeWidth(this.srcText) : newBlock.props.size.width;
    //   newBlock.props.size.height = this.getIframeHeight(this.srcText) !== 'false' ? this.getIframeHeight(this.srcText) : newBlock.props.size.height;
    // }

    const newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.curPageId,
        type: 'video',
      },
      method: 'add',
      block: newBlock as any,
    };
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
  }


  // getIframeWidth(str) {
  //   let reg = new RegExp(`(?<=\width=).+(?=\\ss)`);
  //   return reg.exec(str) ? reg.exec(str)[0] : 'false';
  // }

  // getIframeHeight(str) {
  //   let reg = new RegExp(`(?<=\height=).+(?=\\sw)`);
  //   return reg.exec(str) ? reg.exec(str)[0] : 'false';
  // }
  resetError() {
    this.isError = false;
  }
}