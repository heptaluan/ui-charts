import { Component, OnInit, Input, OnDestroy, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../states/reducers';
import * as ProjectModels from '../../../states/models/project.model';
import { PublishModalComponent, RenameComponent } from '../../../components/modals';
import { Subscription, Subject, Observable } from 'rxjs';
import * as $ from 'jquery';
import { API } from '../../../states/api.service';
import * as ProjectActions from '../../../states/actions/project.action';
declare const domtoimage: any;
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { DataTransmissionService } from '../../../share/services/data-transmission.service';
import { HttpService } from '../../../states/services/custom-http.service';

@Component({
  selector: 'lx-workspace-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input('project') project: ProjectModels.ProjectInfo;
  @Output() selected = new EventEmitter();
  mySubscription: Subscription = new Subscription();
  savingState: boolean = true;
  bsModalRef: BsModalRef;
  projectType: string;
  timeTip: string;
  loading: boolean = false;
  projectId: string;
  @Input('selectItems') selectItems: Observable<ProjectModels.ProjectContentObject[]>;
  savingTip: string = '已保存';
  loadState = -1; // 0 正在加载 1 已加载 -1 加载结束
  interval;

  constructor(private _store: Store<fromRoot.State>,
    private _activedRoute: ActivatedRoute,
    private _modalService: BsModalService,
    private _api: API,
    private _activetedRouter: ActivatedRoute,
    private toastr: ToastrService,
    private _dataTransmissionService: DataTransmissionService,
    private _router: Router,
    private _http: HttpService,
  ) {

  }

  ngOnInit() {
    this.projectId = this._activetedRouter.snapshot.queryParams.project;
    this.projectType = this._activedRoute.snapshot.queryParams.type;

    this.mySubscription.add(this._store.select(fromRoot.getProjectSavingState).subscribe(saving => {
      setTimeout(() => {
        this.savingState = saving;
        // this.savingTip = this.savingState ? '已保存' : '正在保存...';
      }, 0);
    }))
    .add(this._dataTransmissionService.getSaveLoading().subscribe(res => {
      if (res === 0) {
        this.loadState = 0;
        this.savingTip = '正在保存';
        this.timeTip = '';
      } else if (res === 1) {
        this.timeTip = '';
        this.savingTip = '保存成功';
        this.loadState = 1;
        clearInterval(this.interval);
        this.interval = this.setInterval();
        setTimeout(() => {
          this.timeTip = this.getNow();
          this.savingTip = '已保存';
          this.loadState = -1;
        },1500)
      }
    }) )

    this.interval = this.setInterval();

    window.onbeforeunload = function (e) {
      e = e || window.event;

      if (e) {
        e.returnValue = '关闭提示';
      }
      return '关闭提示';
    };
  }

  ngOnDestroy() {
    this.mySubscription.unsubscribe();
    window.onbeforeunload = null;
    clearInterval(this.interval);
  }

  setPrivilege() {
    this.bsModalRef = this._modalService.show(PublishModalComponent, {
      initialState: {
        project: this.project,
        privilege: this.project.private ? 'private' : 'public'
      }
    });
  }

  save() {
    // 点击触发重置
    clearInterval(this.interval);
    this.interval = this.setInterval();

    // this.loadWidth = "69px";
    // 过滤当前 project 中所使用的字体

    // if (this.projectType === 'infographic') {
    //   this.selectItems.next([{ type: 'article' }]);
    // }
    let uploadUrl;
    if (this.projectType === 'infographic') {
      uploadUrl = this._api.getProject(this.projectId);
      // this._store.dispatch(new ProjectActions.UpdateAndExitCurrentProjectAction(this.projectId, {
      //   action: 'save_project',
      //   article: this.project.article
      // }));
    } else if (this.projectType === 'chart') {
      uploadUrl = this._api.getSingleChartProject(this.projectId);
      // this._store.dispatch(new ProjectActions.UpdateAndExitCurrentChartProjectAction(this.projectId, {
      //   action: 'save_project',
      //   article: this.project.article
      // }));
    }

    // $('.workspace-wrap').click();
    if (this.project.article.contents.pages[0].blocks.length !== $("lx-block").length) {
      console.error("手动保存：当前保存的block数量与页面显示的不相等",`保存的数量：${this.project.article.contents.pages[0].blocks.length}`,`展示的数量：${$("lx-block").length}`)
    }
    this.saveProject("tipUnchange")

    setTimeout(() => {
      let that = this;
      return that.handle(uploadUrl, that);
    })
  }

  handle(uploadUrl, that) {
    // 退出时使当前缩放比例恢复为 100%，裁剪溢出部分以便生成图片
    // $('.workspace').css('transform', 'scale(1)');
    // $('.workspace').css('overflow', 'hidden');
    // 点击 logo 返回个人项目页面时，触发图片上传
    const scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100
    if (this.projectType === 'infographic') {
      // 目前截图直接取消选中状态
      this.selected.emit({
        type: 'article'
      });
      (document.querySelector('.magic-box') as HTMLElement).style.display = 'none';
      (document.querySelector('.drag-box') as HTMLElement).style.display = 'none';
      Array.from(document.querySelectorAll('.block-container')).map(item => item.classList.remove('is-selceted'))
    }
    domtoimage.toBlob($('.workspace-wrap')[0], {
      width: $('.workspace-wrap').width() / scale * 0.3,
      height: $('.workspace-wrap').height() / scale * 0.3,
      style: {
        "width": $('.workspace-wrap').width() + 'px',
        "height": $('.workspace-wrap').height() + 'px',
        'overflow': 'hidden',
        'transform': `scale(${0.3/scale})`,
        'transformOrigin': '0 0'
      },
      // 目前截图直接取消选中状态
      filter: (node)=>{
        return node.tagName !== 'LX-REFER';        // 截图参考线隐藏 
      }
    })
    .then(function (blob) {
        $.ajax({
          url: uploadUrl,
          type: 'post',
          // 保证是同步执行的，完成图片上传，才跳转
          async: true,
          xhrFields: {
            withCredentials: true
          },
          processData: false,
          contentType: false,
          cache: false,
          data: blob,
          dataType: 'json',
          success: function () {
            console.log(`save sussess`);
            // that.savingTip = '保存成功';
            // that.loadState = 1;
           
            // clearInterval(that.interval);
            // that.interval = that.setInterval();
            // setTimeout(() => {
            //   that.timeTip = that.getNow();
            //   that.savingTip = '已保存';
            //   that.loadState = -1;
            // },1500)
            
            that.toastr.success(null, '保存成功');
          },
          error: function () {
            console.log(`save failed`);
            that.timeTip = '';
            that.savingTip = '保存失败';
            that.toastr.error(null, '保存失败');
          },
          complete: function () {
            $('.workspace').css('overflow', 'visible');
            that.timeTip = '';
            // location.href = '#/pages/home/projectmanagement';
            that.savingTip = '保存成功';
            that.loadState = 1;

            setTimeout(() => {
              that.timeTip = that.getNow();
              that.savingTip = '已保存';
              that.loadState = -1;
            },1500)
          }
        });
      });
  }

  filterProjectFonts() {
    const projectFonts = [];
    const blocks = _.cloneDeep(this.project.article.contents.pages[0].blocks)
    if (!blocks) {
      return;
    }
    _.each(blocks, (item, key) => {
      if (item.type === 'text') {
        if (item.props.fontFamily) {
          projectFonts.push(item.props.fontFamily)
        }
      } else {
        if (item.props.font) {
          projectFonts.push(item.props.font.fontFamily)
        }
        if (item.props.titleDisplay) {
          projectFonts.push(item.props.titleDisplay.fontFamily)
        }
        // 标签
        if (item.props.label) {
          item.props.label.textLabel && projectFonts.push(item.props.label.textLabel.fontFamily)
          item.props.label.numberLabel&& projectFonts.push(item.props.label.numberLabel.fontFamily)
          item.props.label.rb_numberLabel && projectFonts.push(item.props.label.rb_numberLabel.fontFamily)
          item.props.label.rb_picLabel && projectFonts.push(item.props.label.rb_picLabel.fontFamily)
          item.props.label.rb_textLabel && projectFonts.push(item.props.label.rb_textLabel.fontFamily)
          item.props.label.timeLabel && projectFonts.push(item.props.label.timeLabel.fontFamily)
          item.props.label.nl_numberLabel && projectFonts.push(item.props.label.nl_numberLabel.fontFamily)
          item.props.label.nl_picLabel && projectFonts.push(item.props.label.nl_picLabel.fontFamily)
          item.props.label.nl_textLabel && projectFonts.push(item.props.label.nl_textLabel.fontFamily)
          item.props.label.rl_numberLabel && projectFonts.push(item.props.label.rl_numberLabel.fontFamily)
          item.props.label.rl_picLabel && projectFonts.push(item.props.label.rl_picLabel.fontFamily)
          item.props.label.rl_textLabel && projectFonts.push(item.props.label.rl_textLabel.fontFamily)
          item.props.label.pc_level1Label && projectFonts.push(item.props.label.pc_level1Label.fontFamily)
          item.props.label.pc_level2Label && projectFonts.push(item.props.label.pc_level2Label.fontFamily)
          item.props.label.pc_level3Label && projectFonts.push(item.props.label.pc_level3Label.fontFamily)
        }
      }
    })
    const filterFonts = _.uniq(projectFonts).map(function (item) {
      if (item === 'noto') {
        return item = '"Noto Sans SC"'
      } else if (item === 'Droid Sans Fallback') {
        return item = '"Droid Sans Fallback"'
      } else {
        return item;
      }
    })
    $('body').attr('data-json', filterFonts)

  }

  rename() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-top-rename']);
    this.bsModalRef = this._modalService.show(RenameComponent, {
      initialState: {
        project: this.project
      }
    });
  }

  publish() {
    this.autoSave();
    this.bsModalRef = this._modalService.show(PublishModalComponent, {
      initialState: {
        project: this.project,
        isEdit: true
      }
    });
  }

  goDownload() {
    this.saveProject("goDownload");
  }
  
  getNow() {
    let date = new Date();
    let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    let min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${hour}:${min}`;
  }

  setInterval() {
    return setInterval(() => {
      this.autoSave();
    },60000);
  }

  autoSave() {
    // this.loadWidth = "69px";
    // 过滤当前 project 中所使用的字体
   
    
    if (this.project.article.contents.pages[0].blocks.length !== $("lx-block").length) {
      console.error("自动保存：当前保存的block数量与页面显示的不相等",`保存的数量：${this.project.article.contents.pages[0].blocks.length}`,`展示的数量：${$("lx-block").length}`)
    }
    this.saveProject();
  }

  saveProject (type?) {
    // console.log(this.project.article.contents.pages[0].blocks);
    this.filterProjectFonts();
    this.loadState = 0;
    this.savingTip = '正在保存';
    this.timeTip = '';

    var configProjectUrl = this._api.getSingleChartProject(this.projectId);
    let data = {
      action: 'save_project',
      article: _.cloneDeep(this.project.article),
    }

    if (this.projectType === 'infographic') {
      configProjectUrl = this._api.getProject(this.projectId);
    } else if (this.projectType === 'chart') {
      configProjectUrl = this._api.getSingleChartProject(this.projectId);
    } 
      
    let that = this;
    $.ajax({
      url: configProjectUrl,
      type: 'put',
      async: true,
      xhrFields: {
        withCredentials: true
      },
      processData: false,
      contentType: false,
      cache: false,

      dataType: 'json',
      data: JSON.stringify(data),
      success: function (data) {
        if (type === 'goDownload') {
          that._router.navigate(['pages', 'download'],{queryParams : {project: that.projectId, type: that.projectType}});    
        } else if (type === "tipUnchange") {
          // 将保存状态展示由外部方法执行
        } else{
          that.timeTip = '';
          that.loadState = 1;
          that.savingTip = '保存成功';
          clearInterval(that.interval);
          that.interval = that.setInterval();
          setTimeout(() => {
            that.timeTip = that.getNow();
            that.savingTip = '已保存';
            that.loadState = -1;
          },1500); 
        }         
      },
      error: function () {
        that.timeTip = '';
        that.savingTip = '保存失败';
        that.toastr.error(null, '保存失败');
        return;
      }
    });
  }
}
