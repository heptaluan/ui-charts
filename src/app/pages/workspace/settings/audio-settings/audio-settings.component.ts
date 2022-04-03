import { Component, OnInit } from '@angular/core';
import * as ProjectModels from '../../../../states/models/project.model';
import * as _ from 'lodash';
import * as $ from 'jquery';
import * as fromRoot from '../../../../states/reducers';
import { Store } from '@ngrx/store';
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'lx-audio-settings',
  templateUrl: './audio-settings.component.html',
  styleUrls: ['./audio-settings.component.scss']
})
export class AudioSettingsComponent implements OnInit {
  curBlock;
  curPageId: string;
  blockProps;
  ratio;
  projectId;
  pageNum = 1;

  // 播放状态
  playing: boolean = false;

  musicTitle = '';
  skins = [];
  skinIndex = 0;
  autoplay = false;
  loopback = false;

  constructor(
    private _store: Store<fromRoot.State>,
    private _router: ActivatedRoute,
    private toastr: ToastrService
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
    this.initAudioData()
  }

  // 初始化数据
  initAudioData() {
    // 皮肤
    this.skins = this.blockProps.skins;
    this.skinIndex = this.skins.indexOf(this.blockProps.skinSelected) || 0;
    // 标题
    this.musicTitle = this.blockProps.data.title;
    // 循环播放
    this.loopback = this.blockProps.playControl.loopback;
    // 自动播放
    this.autoplay = this.blockProps.playControl.autoplay;
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

  // 更改皮肤
  changeSkins(index) {
    this.curBlock.props.skinSelected = this.skins[index];
    console.log('', this.curBlock.props.skinSelected);
    this.updateCurBlock();
  }

  // 更改播放方式
  changePlayMode(mode) {
    this.curBlock.props.playControl[mode] = !this[mode];
    this.updateCurBlock();
  }

  // 更改标题
  changeTitle(e) {
    this.curBlock.props.data.title = e.target.value;
    this.updateCurBlock();
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

  toggleMusic() {
    this.pageNum = 2;
  }

  changeOnePage() {
    this.pageNum = 1;
    $('.right-content').css('width', '240px')
  }

  // 改变歌曲item
  changeSong(data) {
    const blockProps = this.curBlock.props;
    blockProps.data.title = data.item.name;
    blockProps.data.src = data.item.url;
    blockProps.data.time = data.item.duration;
    blockProps.data.sourceType = data.type;
    this.updateCurBlock();
    this.toastr.success(null, '切换成功');
  }
}
