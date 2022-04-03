import { Component, OnInit} from '@angular/core';
import * as ProjectModels from '../../../states/models/project.model';
import { ModalTitle } from '../../../share/prompt/prompt.component';
import * as ProjectActions from '../../../states/actions/project.action';
import * as fromRoot from '../../../states/reducers';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UpgradeMemberComponent } from '../upgrade-member/upgrade-member.component';
import { VipService } from '../../../share/services/vip.service';
import { FormControl, Validators } from '@angular/forms';
import { API } from '../../../states/api.service';
@Component({
  selector: 'lx-publish-modal',
  templateUrl: './publish-modal.component.html',
  styleUrls: ['./publish-modal.component.scss']
})
export class PublishModalComponent implements OnInit {

  isVpl: string;
  project: ProjectModels.ProjectBase;
  newProject: ProjectModels.ProjectBase;
  title: ModalTitle;
  enablePrivateLink: boolean;
  enablePassword = false;
  linkPasswd: string;
  showPassword = false;
  passwordLock = false;
  privilege = 'private';
  copyText = false;
  copyPriText = false;

  isEdit: boolean = false;

  isShare: boolean = true;

  iframeUrl: string = '';

  design;

  type: string = 'outerArea';
  projectName: FormControl;
  isRewaterfall: boolean = false;

  shareUrl: string;

  constructor(
    private _store: Store<fromRoot.State>,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private _vipService: VipService,
    private _api: API
  ) { }

  ngOnInit() {
    this.projectName = new FormControl(this.project.title, Validators.maxLength(50));
    this.isVpl = this._vipService.getVipLevel();
    this.newProject = Object.assign({}, this.project);
    this.title = {
      content: '分享',
      position: 'center'
    };
    this.enablePrivateLink = this.project.enable_private_link;
    this.linkPasswd = this.project.password;
    this.enablePassword = this.project.enable_private_link && !!this.linkPasswd;

    this.shareUrl = this._api.getShareUrl() + this.project.private_url.split('/show/')[1]

    if (this.isEdit) {
      this.design = this.project['article']['contents']['design'];
      this.iframeUrl = `<iframe src="${this.shareUrl}" width="${this.design.width}" height="${this.design.height}" scrolling="no" frameborder="0" align=""></iframe>`;
    }
  }
  close() {
    this.bsModalRef.hide();
  }

  changeTab(flag) {
    this.isShare = flag;
    this.copyText = false;
    this.copyPriText = false;
    // 编辑页面点击切换 分享 / iframe
    if (this.isEdit) {
      // 百度统计 isEdit\
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-share', `edit-share-btn-${flag ? 'share' : 'iframe'}-click`]);
    }
  }

  removePrivateLink() {
    this.enablePrivateLink = false;
    this.enablePassword = false;
    this.passwordLock = false;
    const payload: ProjectModels.ConfigProject = {
      action: 'publish',
      enable_private_link: false
    };
    if (this.project.type === 'chart') {
      this._store.dispatch(new ProjectActions.ConfigChartProjectAction(this.project.id, payload));
    } else {
      this._store.dispatch(new ProjectActions.ConfigProjectAction(this.project.id, payload));
    }
  }

  // true 设置密码
  togglePassword(evt) {
    if(evt) {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-share', 'edit-share-tab-private']);
    } else {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-share', 'edit-share-tab-public']);
    }
    this.copyPriText = false;
    this.enablePassword = evt;
    const payload: ProjectModels.ConfigProject = {
      action: 'publish',
      enable_private_link: this.enablePrivateLink,
      password: this.enablePassword ? this.linkPasswd : '',
      isNoToastrTip: true
    }
    // this._store.dispatch(new ProjectActions.ConfigProjectAction(this.project.id, payload));
    if (this.project.type === 'chart') {
      this._store.dispatch(new ProjectActions.ConfigChartProjectAction(this.project.id, payload));
    } else {
      this._store.dispatch(new ProjectActions.ConfigProjectAction(this.project.id, payload));
    }
  }

  createPrivateLink() {
    this.enablePrivateLink = true;
    const payload: ProjectModels.ConfigProject = {
      action: 'publish',
      enable_private_link: true
    };
    // this._store.dispatch(new ProjectActions.ConfigProjectAction(this.project.id, payload));
    if (this.project.type === 'chart') {
      this._store.dispatch(new ProjectActions.ConfigChartProjectAction(this.project.id, payload));
    } else {
      this._store.dispatch(new ProjectActions.ConfigProjectAction(this.project.id, payload));
    }
  }

  setPrivateLinkPassword() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-share', 'edit-share-btn-privatepassword']);
    this.passwordLock = true;
    this.newProject.password = this.linkPasswd;
    const payload: ProjectModels.ConfigProject = {
      action: 'publish',
      enable_private_link: true,
      password: this.linkPasswd
    };
    // this._store.dispatch(new ProjectActions.ConfigProjectAction(this.project.id, payload));
    if (this.project.type === 'chart') {
      this._store.dispatch(new ProjectActions.ConfigChartProjectAction(this.project.id, payload));
    } else {
      this._store.dispatch(new ProjectActions.ConfigProjectAction(this.project.id, payload));
    }
  }

  copyUrl(url) {
    // 复制进剪切板
    var oInput = document.createElement('input');
    oInput.value = url;
    document.body.appendChild(oInput);
    // 选择对象
    oInput.select();
    // 执行浏览器复制命令
    document.execCommand("Copy");
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    if (this.isShare) {
      this.copyPriText = true;
      this.copyText = false;
    } else {
      this.copyText = true;
      this.copyPriText = false;
    }
  }

  // 聚焦输入标题框
  focusTitle() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-share', 'edit-share-input-click']);
  }

  ProjectName(){
    if (this.project.title === this.projectName.value) {
      return;
    }
    if (this.project.type === 'infographic') {
      if (this.projectName.valid) {
        if (!!this.projectName.value && this.projectName.value.trim() !== '') {
          this._store.dispatch(new ProjectActions.ConfigProjectAction(this.project.id, {action: 'rename', title: this.projectName.value}));
        } else {
          this._store.dispatch(new ProjectActions.ConfigProjectAction(this.project.id, {action: 'rename', title: '未命名'}));
        }
        this.isRewaterfall = true;
      } else {
        return false;
      }
    } else if (this.project.type === 'chart') {
      if (this.projectName.valid) {
        if (!!this.projectName.value && this.projectName.value.trim() !== '') {
          this._store.dispatch(new ProjectActions.ConfigChartProjectAction(this.project.id, {action: 'rename', title: this.projectName.value}));
        } else {
          this._store.dispatch(new ProjectActions.ConfigChartProjectAction(this.project.id, {action: 'rename', title: '未命名'}));
        }
        this.isRewaterfall = true;
      } else {
        return false;
      }
    }
  }
}
