import { Component, OnInit } from '@angular/core';
import * as fromRoot from '../../../../../states/reducers';
import { Store } from '@ngrx/store';
import * as ProjectModels from '../../../../../states/models/project.model';
import * as _ from 'lodash';
import { UpdateCurrentProjectArticleAction } from '../../../../../states/actions/project.action';
import { UpdateProjectContent } from '../../../../../states/models/project.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataTransmissionService } from '../../../../../share/services';

@Component({
  selector: 'lx-page-right-settings',
  templateUrl: './page-right-settings.component.html',
  styleUrls: ['./page-right-settings.component.scss']
})
export class PageRightSettingsComponent implements OnInit {
  themeColorList;
  project: ProjectModels.ProjectInfo;
  design: ProjectModels.ProjectDesign = {
    backgroundColor: '#ffffff',
    height: '800',
    width: '400',
    sizeType: 'A4',
    ratio: null
  };
  pageSizeIndex = 13;

  blankInfoType = '自定义';

  infoType = [
    '信息图 (700px*1200px)',
    '微信公众号首图 (900px*383px)',
    '微博焦点图片 (560px*260px)',
    // '头条号首图 (660px*370px)',
    '正文配图（横版）(400px*300px)',
    '正文配图（方形）(400px*400px)',
    '正文配图（竖版）(400px*600px)',
    '图表报告 (A4) (595px*893px)',
    // '工作报告 (A4) (595px*808px)',
    '手机海报 (640px*1008px)',
    '新闻长图 (800px*2000px)',
    '数据图说 (640px*1920px)',
    '简历 (A4) (595px*842px)',
    'PPT (16:9) (700px*394px)',
    'PPT (4:3) (700px*525px)',
    '数据大屏 1920*1080',
    '自定义'
  ];

  infoShowType = [
    '信息图 700*1200',
    '微信公众号首图 900*383',
    '微博焦点图片 560*260',
    // '头条号首图 (660px*370px)',
    '正文配图(横版) 400*300',
    '正文配图(方形) 400*400',
    '正文配图(竖版) 400*600',
    '图表报告(A4) 595*893',
    // '工作报告 (A4) (595px*808px)',
    '手机海报 640*1008',
    '新闻长图 800*2000',
    '数据图说 640*1920',
    '简历(A4) 595*842',
    'PPT(16:9) 700*394',
    'PPT(4:3) 700*525',
    '数据大屏 1920*1080',
    '自定义'
  ];

  infoSizes = [
    { width: '700', height: '1200' },      // 信息图
    { width: '900', height: '383' },       // 微信公众号首图
    { width: '560', height: '260' },       // 微博焦点图片
    // {width: '660', height: '370'},    // 头条号首图
    { width: '400', height: '300' },       // 正文配图（横版）
    { width: '400', height: '400' },       // 正文配图（方形）
    { width: '400', height: '600' },       // 正文配图（竖版）
    { width: '595', height: '893' },       // 图表报告 (A4)
    // {width: '595', height: '808'},    // 数据图说 (A4)
    { width: '640', height: '1008' },      // 手机海报
    { width: '800', height: '2000' },      // 新闻长图
    { width: '640', height: '1920' },      // 数据图说
    { width: '595', height: '842' },       // 简历
    { width: '700', height: '394' },       // PPT (16:9)
    { width: '700', height: '525' },       // PPT (4:3)
    { width: '1920', height: '1080' },       // 数据大屏 1920*1080
    null                                 // 自定义
  ];

  pageTypes = []
  pageSizes = [];

  mySubscription = new Subscription()

  constructor(
    private _store: Store<fromRoot.State>,
    private _router: ActivatedRoute,
    private _dataTransmissionService: DataTransmissionService
  ) { }

  ngOnInit() {
    this.pageTypes = this.infoType;
    this.pageSizes = this.infoSizes;

    // 判断传过来的空白模板类型
    const receiveType = this._router.snapshot.queryParams.infoType ? this._router.snapshot.queryParams.infoType : this.design.sizeType;

    if (receiveType) {
      // 改变下拉框的值
      this.blankInfoType = receiveType;
    } else {
      this.blankInfoType = '自定义';
    }

    // 将进来的infoType 去掉，不然创建空白模板，切换尺寸后点击外面区域会还原
    location.href = window.location.href.split('&infoType=')[0];

    // 初始化的时候更新下拉框
    this.pageTypes.filter((item, index) => {
      if (item.indexOf(this.blankInfoType) > -1) {
        this.pageSizeIndex = index;
        // 改变宽高
        this.onDropDownChanged(this.pageSizeIndex, 'redo');
      }
    })

    // 监听画布颜色和页面尺寸的改变
    this.mySubscription.add(this._store.select(fromRoot.getCurrentProjectArticle).subscribe(article => {
      if (article) {
        // 画布颜色
        this.design = article.contents.design;
        // 画布尺寸
        const index = _.indexOf(this.infoType, article.contents.design.sizeType)
        this.pageSizeIndex = index !== -1 ? index : 0;
      }
    }))
      .add(this._store.select(fromRoot.getCurrentProjectFull).subscribe(project => {
        if (project && project.article.contents.theme) {
          this.themeColorList = project.article.contents.theme.colors;
        } else {
          this.themeColorList = ["#4150d8", "#28bf7e", "#ed7c2f", "#f2a93b", "#f9cf36", "#4a5bdc", "#4cd698",
            "#f4914e", "#fcb75b", "#ffe180", "#b6c2ff", "#96edc1", "#ffbe92", "#ffd6ae"]
        }
      }))
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe()
  }

  onSelected() {
    console.log('page-right-selected');
  }

  onInput(value) {
    console.log(value);
  }

  onDropDownChanged(event, target?) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-right-infographic-size-change-index', event]);
    this.pageSizeIndex = event;
    const newDesign = _.cloneDeep(this.design);
    newDesign.sizeType = this.pageTypes[event];
    const size = this.pageSizes[event];
    if (size) {
      newDesign.width = size.width;
      newDesign.height = size.height;
    }
    if (target) {
      this.uploadDesign(newDesign, target);
    } else {
      this.uploadDesign(newDesign);
    }
    setTimeout(() => {
      this._dataTransmissionService.sendTemplateSwitchingData(true)
    }, 0);
  }

  onSizeChanged(event) {
    if (this.project.type === 'infographic') {
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-right-infographic-size-change-index', event]);
    } else {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-right-singlechart-size-change-index', event]);
    }
    if (event) {
      const newDesign = _.cloneDeep(this.design);
      newDesign.height = event.value0;
      newDesign.width = event.value1;
      if (event.type == 'locked') {
        newDesign.ratio = event.locked ? (newDesign.height / newDesign.width) : null;
      }
      newDesign.sizeType = '自定义';
      this.pageSizeIndex = 13;
      this.uploadDesign(newDesign);
      setTimeout(() => {
        this._dataTransmissionService.sendTemplateSwitchingData(true)
      }, 0);
    }
  }

  /** color-picker */
  public onEventLog(data: any): void {
    console.log(data)
    const infoDesign = _.cloneDeep(this.design);
    infoDesign.backgroundColor = data;
    this.uploadDesign(infoDesign);
  }

  uploadDesign(design, target?) {
    this.design = design;
    let newData: UpdateProjectContent = {
      target: {
        pageId: this.project.article.contents.pages[0].pageId,
        type: 'article',
        target: target ? target : null
      },
      method: 'put',
      design: design
    }
    if (this.project.type === 'infographic') {
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.project.id, newData));
    }
  }

  // 父组件传值
  updatePage(project: ProjectModels.ProjectInfo) {
    if (project) {
      this.project = project;
      this.design = project.article.contents.design;
      this.pageTypes.forEach((item, index) => {
        if (item === this.design.sizeType) {
          this.pageSizeIndex = index;
        }
      })
    }
  }
}
