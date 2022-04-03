import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VideoMapService } from '../../../../block/video-map.service';
import { UtilsService } from '../../../../share/services';
import { UpdateProjectContent } from '../../../../states/models/project.model';
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../states/reducers';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ThirdVideoHelpComponent } from '../../../../components/modals';

@Component({
  selector: 'lx-video-sidebar',
  templateUrl: './video-sidebar.component.html',
  styleUrls: ['./video-sidebar.component.scss']
})
export class VideoSidebarComponent implements OnInit {

  @Input() pageId: string;
  @Output() closeSidebarEvent = new EventEmitter();

  styles;
  projectId;
  videoText = '';
  isError = false;

  url = '<iframe src="//player.bilibili.com/player.html?aid=371053613&bvid=BV1xZ4y1H7d5&cid=204852140&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>';

  bsModalRef: BsModalRef;
  constructor(
    private _utilsService: UtilsService,
    private _videoService: VideoMapService,
    private _store: Store<fromRoot.State>,
    private _activateRouter: ActivatedRoute,
    private _modelService: BsModalService
  ) { 
    this.projectId = this._activateRouter.snapshot.queryParams.project;
  }

  ngOnInit() {
    // 组件高度
    this.styles = {
      height: innerHeight - 50 + 'px',
      width: '280px',
    };
  }

  // 关闭
  clickCloseBtn() {
    this.closeSidebarEvent.emit();
  }

  // 打开第三方视频弹框
  hanldleHelp() {
    this.bsModalRef = this._modelService.show(ThirdVideoHelpComponent, {
      ignoreBackdropClick: true
    })
  }

  // 插入视频
  insertVideo() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-insert-iframeMovie']);
    this.isError = false;
    if (!this.videoText) { this.isError = true; return};

    const newBlock = _.cloneDeep(this._videoService.VideoBlockTemplate);
    newBlock.blockId = this._utilsService.generate_uuid();
    newBlock.props.data.src = this.videoText;
    // 判断是否是iframe
    if (this.videoText.indexOf('<iframe') > -1) {
      newBlock.props.data.sourceType = 'iframe';
      newBlock.props.size.width = this.getIframeWidth(this.videoText) !== 'false' ? this.getIframeWidth(this.videoText) : newBlock.props.size.width;
      newBlock.props.size.height = this.getIframeHeight(this.videoText) !== 'false' ? this.getIframeHeight(this.videoText) : newBlock.props.size.height;
      // 设置 ratio
      newBlock.props.size.ratio = Number(newBlock.props.size.height) / Number(newBlock.props.size.width) + '';
    } else if (/^.*\.(mp|MP|Mp)4$/.test(this.videoText)) {
      newBlock.props.data.sourceType = 'url';
      newBlock.props.size.ratio = null; // 不锁定
    } else {
      this.isError = true;
      return;
    }
    // 位置视野居中
    let scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML);
    let left, top;
    left = Math.round($('.center-content').scrollLeft() / (scale / 100)) + 200;
    top = Math.round($('.center-content')[0].scrollTop / (scale / 100)) + 200;

    if (scale < 100) {
      left = left + 100 * (scale / 100);
      top = top + 100 * (scale / 100);
    } else {
      left = left - 100 * (scale / 100);
      top = top - 100 * (scale / 100);
    }

    newBlock.position = {
      top: top,
      left: left,
    };

    const newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: 'video',
      },
      method: 'add',
      block: newBlock as any,
    };
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
    this.videoText = '';
  }


  getIframeWidth(str) {
    let reg = new RegExp(`(?<=\width=).+(?=\\ss)`);
    return reg.exec(str) ? reg.exec(str)[0] : 'false';
  }

  getIframeHeight(str) {
    let reg = new RegExp(`(?<=\height=).+(?=\\sw)`);
    return reg.exec(str) ? reg.exec(str)[0] : 'false';
  }

  resetError() {
    this.isError = false;
  }
}
