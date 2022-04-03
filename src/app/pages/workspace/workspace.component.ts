import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Renderer2, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../states/reducers';
import * as ProjectActions from '../../states/actions/project.action';
import * as ProjectModels from '../../states/models/project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject, Observable } from 'rxjs';
import { API } from '../../states/api.service';
import { UtilsService } from '../../share/services/utils.service';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { ContactUsModalComponent, DataDemandFeedbackComponent } from '../../components/modals';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DataTransmissionService } from '../../share/services/data-transmission.service';

declare const domtoimage: any;

@Component({
  selector: 'lx-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('centerContent') centerContent: ElementRef;

  public loading = false;

  isHelp: boolean = false;      // 控制帮助菜单出现
  assisFlag: boolean = false;   // 技术支持
  wechatFlag: boolean = false;  // 微信
  smallCodeFlag: boolean = false;

  projectType: string;
  projectId: string;
  project: ProjectModels.ProjectInfo;
  mySubscription = new Subscription();
  selectItems: Subject<ProjectModels.ProjectContentObject[]> = new Subject();
  selectItems$: Observable<ProjectModels.ProjectContentObject[]> = this.selectItems.asObservable(); // 用户选择的对象流

  // 默认显示图表
  sidebarType = '';
  sidebarStyle;
  showLeftType: string = "";
  centerContenStyles;

  topbarEmitData;
  // saveProject;

  @Output('selected') selected = new EventEmitter();

  constructor(
    private _store: Store<fromRoot.State>,
    private _activetedRouter: ActivatedRoute,
    private _api: API,
    private modalService: BsModalService,
    private _el: ElementRef,
    private _render: Renderer2,
    private _dataTransmissionService: DataTransmissionService,
  ) {
    this.projectType = this._activetedRouter.snapshot.queryParams.type;
    this.projectId = this._activetedRouter.snapshot.queryParams.project;

    // 获取项目详情
    if (this.projectType === 'infographic') {
      this._store.dispatch(new ProjectActions.GetProjectInfoAction(this.projectId, this.projectType));
      this.mySubscription
        .add(this._store.select(fromRoot.getCurrentProjectFull)
          .filter(project => !!project && project.id === this.projectId).subscribe((project: ProjectModels.ProjectInfo) => {
            this.project = project;
            localStorage.setItem('shareUrl', this.project.private_url.split('/show/')[1])
            localStorage.setItem('projectType', 'infographic')
          }));
    } else if (this.projectType === 'chart') {
      setTimeout(() => {
        $('#tool').hide();
      }, 300);
      this._store.dispatch(new ProjectActions.GetSingleChartInfoAction(this.projectId));
      this.mySubscription
        .add(this._store.select(fromRoot.getCurrentChartProjectFull)
          .filter(project => !!project && project.id === this.projectId).subscribe((project: ProjectModels.ProjectInfo) => {
            this.project = project;
            localStorage.setItem('shareUrl', this.project.private_url.split('/show/')[1])
            localStorage.setItem('projectType', 'chart')
          }));
    }

    this._dataTransmissionService.getSidebarState().subscribe(res => {
      if (res === 'image') {
        this.sidebarType = 'image'
      } else if (res === 'chart') {
        this.sidebarType = 'chart'
      }
    })

  }

  ngOnInit() {

    this.showLeftSideBar('chart');
    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2/#/pages/workspace?*']);

    // 动态计算画布高度
    // 如果该页面被嵌入在 ifrmae 当中
    if (window.self !== window.top) {

      // 保存当前项目 id，用于操作最后编辑项目（默认直接覆盖，只保留最后一个项目）
      localStorage.setItem('lastProjectId', this.projectId)
      localStorage.setItem('lastProjectType', this.projectType)

      const screenWidth = innerWidth > 1330 ? 240 : Math.abs(innerWidth - 1330) + 240;
      this.centerContenStyles = {
        height: innerHeight - 120 + 'px',
        'margin-right': screenWidth + 'px'
      }
    } else {
      this.centerContenStyles = {
        height: innerHeight - 50 + 'px'
      }
    }

    $(window).resize(() => {
      this.centerContenStyles.height = innerHeight - 50 + 'px';
    });

    setTimeout(() => {
      // 更新当前项目所用字体
      this.filterProjectFonts();
    }, 300);
  }

  ngAfterViewInit() {
    this.selectItems.next([{ type: 'article' }]);
    window.addEventListener('click', this.allClick.bind(this));

    this.centerContent.nativeElement.addEventListener('scroll', () => {
      if ([...$('.cdk-overlay-pane .ngx-contextmenu')].length > 0) {
        $('.cdk-overlay-container').children().remove();
      }
    });
    // window.addEventListener('beforeunload', this.handleReturn);
  }


  // 全局点击关闭用户下拉框，除了点击用户下拉框部分
  allClick() {
    var e = e || window.event;
    if (e.target !== this._el.nativeElement.querySelector('.no-click-area')) {
      this.isHelp = false;
    }
  }

  handShowClick() {
    this.isHelp = !this.isHelp;
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-left-help']);
  }


  // 左侧面板
  showLeftSideBar(type: string) {
    if (type === 'chart') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-left-chart']);
    } else if (type === 'text') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-left-text']);
    } else if (type === 'shape') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-left-shape']);
    } else if (type === 'image') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-left-image']);
    } else if (type === 'template') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-left-scene']);
    } else if (type === 'song') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-left-song']);
    } else if (type === 'video') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-left-video']);
    }

    if (this.showLeftType != type) {
      this.sidebarStyle = {
        transform: 'translateX(0)'
      }
      // 改变底部工具栏位置
      // $('#tool').css('width', '301px');
      // 定位 topbar
      $('.topbar-padding').show();
      this.sidebarType = type;
      this.showLeftType = type;
    } else {
      this.sidebarStyle = {
        transform: 'translateX(-100%)'
      }
      // 定位 topbar
      $('.topbar-padding').hide();
      setTimeout(() => {
        this.sidebarType = '';
      }, 200);

      this.showLeftType = "";
    }
  }

  // 设置工具左边边距
  setToolLeft() {
    const { clientWidth } = document.documentElement;
    const { width: scrollableWidth } = document.querySelector('.scrollable').getBoundingClientRect();
    const { width: leftWidth } = document.querySelector('.left-content').getBoundingClientRect();
    const { width: rightWidth } = document.querySelector('.right-content').getBoundingClientRect();
    const toolWidth = 301;    
    const toolLeft = (clientWidth - leftWidth - rightWidth - toolWidth - scrollableWidth) / 2;
    // 改变底部工具栏位置
    $('#tool').css('left', toolLeft + scrollableWidth + leftWidth + 'px');
  }

  // 单图下左侧面板
  showChartLeftSideBar() {
    this.modalService.show(ContactUsModalComponent, {
      initialState: {
        content: '图表项目仅开放「图表」的选择和编辑功能。若需要添加「文字」「形状」「图片」等元素，您可以尝试创建<a style="color: #007bff;text-decoration: underline;" target="_blank" href="https://dycharts.com/appv2/#/pages/home/info-template">数据图文</a>项目。',
        title: {
          position: 'center',
          content: '提示',
          button: '确定'
        }
      }
    });
    return false;
  }

  insertChart() {
    alert('inser chart');
  }

  onSelected(data) {
    this.topbarEmitData = data.newData;
    this.selectItems.next([data]);
  }

  onPageSelected(event) {
    if (this.projectType === 'chart') {
      this._dataTransmissionService.sendData(false);
    }
    if (this.projectType !== 'chart' && event.target.classList.contains('center-content')) {
      if (document.querySelector('.chart-right-table.active')) {
        return;
      } else {
        this.selectItems.next([{
          type: 'article'
        }]);
      }
    }
  }

  goHome() {
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-top-backproject']);
    // 过滤当前 project 中所使用的字体
    this.filterProjectFonts();
    this.loading = true;
    if (this.projectType === 'infographic') {
      this.selectItems.next([{ type: 'article' }]);
    }
    let uploadUrl;

    if (this.project.article.contents.pages[0].blocks.length !== $("lx-block").length) {
      console.error("项目管理：当前保存的block数量与页面显示的不相等",`保存的数量：${this.project.article.contents.pages[0].blocks.length}`,`展示的数量：${$("lx-block").length}`)
    }
    if (this.projectType === 'infographic') {
      uploadUrl = this._api.getProject(this.projectId);
      this._store.dispatch(new ProjectActions.UpdateAndExitCurrentProjectAction(this.projectId, {
        action: 'save_project',
        article: this.project.article
      }));
    } else if (this.projectType === 'chart') {
      uploadUrl = this._api.getSingleChartProject(this.projectId);
      this._store.dispatch(new ProjectActions.UpdateAndExitCurrentChartProjectAction(this.projectId, {
        action: 'save_project',
        article: this.project.article
      }));
    }

    if(this.projectType !== 'chart') {
      (document.querySelector('.magic-box') as HTMLElement).style.display = 'none';
      (document.querySelector('.drag-box') as HTMLElement).style.display = 'none';
      Array.from(document.querySelectorAll('.block-container')).map(item => item.classList.remove('is-selceted'))
      this.selected.emit({
        type: 'article',
      });
    }

    let that = this;
    setTimeout(() => {
      that._dataTransmissionService.sendSaveLoading(0);
      // 退出时使当前缩放比例恢复为 100%，裁剪溢出部分以便生成图片
      $('.workspace').css('transform', 'scale(1)');
      $('.workspace').css('overflow', 'hidden');
      // 点击 logo 返回个人项目页面时，触发图片上传
      domtoimage.toBlob($('.workspace-wrap')[0]
      // 目前截图直接取消选中状态
      , {
        filter: (node)=>{
          return node.tagName !== 'LX-REFER';        // 截图参考线隐藏
        }
      }
      )
        .then(function (blob) {
          $.ajax({
            url: uploadUrl,
            type: 'post',
            // 保证是同步执行的，完成图片上传，才跳转
            async: false,
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
              // this.loading = false;          
            },
            error: function () {
              console.log(`save failed`);
              // that.loading = false;
            },
            complete: function () {
              // this.loading = false;
              that._dataTransmissionService.sendSaveLoading(1);
              localStorage.removeItem("comefrom");
              location.href = '#/pages/home/project?from=workspace';
            }
          });
        });
    });
  }

  filterProjectFonts() {
    const projectFonts = [];
    let blocks;
    if (this.project) {
      blocks = _.cloneDeep(this.project.article.contents.pages[0].blocks);
    } else {
      blocks = []
    }
    if (!blocks) {
      return;
    }
    _.each(blocks, (item, key) => {
      if (item.type === 'text') {
        if (item.props.fontFamily) {
          projectFonts.push(item.props.fontFamily);
        }
      } else {
        if (item.props.font) {
          projectFonts.push(item.props.font.fontFamily);
        }
        if (item.props.titleDisplay) {
          projectFonts.push(item.props.titleDisplay.fontFamily);
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
    });
    const filterFonts = _.uniq(projectFonts).map(function (item) {
      if (item === 'noto') {
        return item = '"Noto Sans SC"';
      } else if (item === 'Droid Sans Fallback') {
        return item = '"Droid Sans Fallback"';
      } else {
        return item;
      }
    })
    $('body').attr('data-json', filterFonts)
  }

  closeSidebar() {
    this.showLeftType = "";
    this.sidebarStyle = {
      transform: 'translateX(-100%)'
    }
    setTimeout(() => {
      this.sidebarType = '';
    }, 200);
  }

  // 处理意见中心与帮助中心
  handleItemClick(e) {
    switch (e.target.innerText) {
      case '小程序':
        this.smallCodeFlag = false;
        break;
      case '微信客服':
        this.wechatFlag = false;
        break;
      case '技术支持':
        this.assisFlag = false;
        break;
      case '意见反馈':
        this.modalService.show(DataDemandFeedbackComponent, {
          initialState: {
            title: '意见反馈',
            type: 'request',
            yourRequest: '告诉我们你的建议或遇到的问题'
          }
        });
        break;
      case '帮助中心':
        let tempPage = window.open('', '_blank');
        tempPage.location.href = window.location.href.split('#')[0] + '#/pages/help/list';
        // window.open(window.location.href.split('#')[0] + '#/pages/help/list', '_blank');
        break;
      default:
        break;
    }
  }

  // 拖拽遮罩隐藏
  handleHideDropMask(e) {
    document.getElementById('show').style.display = 'none'
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe();
    window.removeEventListener('click', this.allClick.bind(this));
    // window.removeEventListener('beforeunload', this.handleReturn);
  }
}
