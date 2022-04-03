import { Component, OnInit, ViewChild, ElementRef, Renderer2, ViewChildren } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../states/reducers';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as ProjectModels from '../../../states/models/project.model';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { VipService } from '../../../share/services/vip.service';
import { UpgradeMemberComponent } from '../../../components/modals/upgrade-member/upgrade-member.component';
import { GetChartTemplateListAction } from '../../../states/actions/template.action';
import { API } from '../../../states/api.service';
import { ToastrService } from 'ngx-toastr';
import { CreateProjectService } from '../../../share/services/create-project.service';
import { chartContent } from './index';
import { DataTransmissionService, IndexService } from '../../../share/services';
import { DataDemandFeedbackComponent } from '../../../components/modals';
@Component({
  selector: 'lx-chart-template',
  templateUrl: './chart-template.component.html',
  styleUrls: ['./chart-template.component.scss'],
})
export class ChartTemplateComponent implements OnInit {
  initialState;
  createProjectBoxStyle;

  getInfoDetailTimer;

  isVpl: string = '';

  hotWords = [];
  keyword: string = '';

  // 新图表列表方便打 new 标签9个
  newChartTagList = [
    '7955555777700001201',
    '7955555777700001202',
    '7955555777700001203',
    '7955555777700001204',
    '7955555777700001205',
    '7955555777700001206',
    '7955555777700001207',
    '7955555777700001208',
    '7955555777700001209',
  ];

  // 节流
  timer;

  chartClassifyTemplateList = [
    {
      cover: '/dyassets/images/chart-list/all.svg',
      title: '全部',
    },
    {
      cover: '/dyassets/images/chart-list/bingtu.svg',
      title: '饼图',
    },
    {
      cover: '/dyassets/images/chart-list/zhexiantu.svg',
      title: '线形图',
    },
    {
      cover: '/dyassets/images/chart-list/zhuzhuangtu.svg',
      title: '柱状图',
    },
    {
      cover: '/dyassets/images/chart-list/mianjitu.svg',
      title: '面积图',
    },
    {
      cover: '/dyassets/images/chart-list/sandiantu.svg',
      title: '散点图',
    },
    {
      cover: '/dyassets/images/chart-list/leidatu.svg',
      title: '极坐标图',
    },
    {
      cover: '/dyassets/images/chart-list/guanxitu.svg',
      title: '关系图',
    },
    {
      cover: '/dyassets/images/chart-list/yibiaopan.svg',
      title: '仪表盘',
    },
    {
      cover: '/dyassets/images/chart-list/shutu.svg',
      title: '树图',
    },
    {
      cover: '/dyassets/images/chart-list/sangjitu.svg',
      title: '桑基图',
    },
    {
      cover: '/dyassets/images/chart-list/loudoutu.svg',
      title: '漏斗图',
    },
    {
      cover: '/dyassets/images/chart-list/rilitu.svg',
      title: '热力图',
    },
    {
      cover: '/dyassets/images/chart-list/ciyuntu.svg',
      title: '其他',
    },
    {
      cover: '/dyassets/images/chart-list/ciyuntu.svg',
      title: '动态图表',
    },
  ];
  chartFunctionTemplateList = [
    {
      cover: '/dyassets/images/chart-list/all.svg',
      title: '全部',
    },
    {
      cover: '/dyassets/images/chart-list/bijiaolei.svg',
      title: '比较',
    },
    {
      cover: '/dyassets/images/chart-list/shijianlei.svg',
      title: '趋势',
    },
    {
      cover: '/dyassets/images/chart-list/zhanbilei.svg',
      title: '占比',
    },
    {
      cover: '/dyassets/images/chart-list/fenbulei.svg',
      title: '分布',
    },
    {
      cover: '/dyassets/images/chart-list/liuchenglei.svg',
      title: '流向',
    },
    {
      cover: '/dyassets/images/chart-list/guanxilei.svg',
      title: '层级',
    },
  ];
  chartClassifyIndex = 0; // 图表类型
  chartPriceIndex = 0; // 图表价格
  activeIndex: number = 0; // 默认选中
  chartTitleTemplates = []; // 顶部分类选择
  chartTemplates = []; // 模版列表
  chartFilterTemplates = [];
  chartPriceTotalTemplates = []; // 模版总数
  // 图表数组备份
  backupCharts = [];

  //
  new_window = null;

  // 用户名字（判断登录）
  userName: string;

  // 信息图与单图总长度
  totalLength;
  allProjects$;

  getTemplateListSubscription = new Subscription();
  createEmptyTemplateSubscription = new Subscription();
  forkChartProject = new Subscription();
  forkInfoProject = new Subscription();
  allProjectScription = new Subscription();
  getUserInfoSubscription = new Subscription();
  infoDetailSubscription = new Subscription();

  // 跨域允许
  httpOptions = { withCredentials: true };

  // 空白模板类型
  blankInfoType = '信息图';

  // 空白模板样式
  blankHeight: string = '397px';

  // 弹框宽度自适应
  widthStyle: string = 'auto';

  // 详细信息高度
  heightStyle: string = 'auto';

  isErroImg = false;

  isShowTip: boolean = false;

  // 结果
  resultLength = 0;

  @ViewChildren('slider') slider: ElementRef;

  @ViewChildren('sliderShadow') sliderShadow: ElementRef;
  constructor(
    private modalService: BsModalService,
    private _store: Store<fromRoot.State>,
    private _router: ActivatedRoute,
    private _http: HttpClient,
    private _vipService: VipService,
    private _api: API,
    private _el: ElementRef,
    private _renderer2: Renderer2,
    private toastr: ToastrService,
    private _createProjectService: CreateProjectService,
    private _indexService: IndexService,
    private _dataTransmissionService: DataTransmissionService
  ) {
    // this._store.dispatch(new GetChartTemplateListAction());
    this.allProjects$ = this._store.select(fromRoot.getAllProjectList);
  }

  ngOnInit() {
    // 是否有浏览器兼容提示
    this._dataTransmissionService.getShowTip().subscribe(res => {
      this.isShowTip = res;
    })

    // 接受搜索值，并且搜索
    this.keyword = this._router.snapshot.queryParams.keyword;
   
    // 判断是否登录
    this.getUserInfo();
    // 判断是否会员
    this.isVpl = this._vipService.getVipLevel();

    this.initialState = {
      id: 0,
      type: 'chart',
    };

    // 默认按分类排序
    this.chartTitleTemplates = this.chartClassifyTemplateList;

    // 获取项目长度
    this.allProjectScription.add(
      this.allProjects$.subscribe((list) => {
        this.totalLength = list.length;
      })
    );

    // 获取热词
    this.getHotSearchWords();

    // 获取图表
    this.getChartList(this.keyword)
    this.chartPriceTotalTemplates = this.chartTemplates;

    // 如果有 keyword
    if (this.keyword) {
      window.location.href = location.href.split('keyword')[0];
    }
  }

  showContent(item) {
    if (item !== '') {
      // 8px为重叠部分
      let height = this.slider['_results'][item].nativeElement.offsetHeight - 8;
      this._renderer2.setStyle(this.slider['_results'][item].nativeElement, 'shadow', 'none');
      this._renderer2.setStyle(this.sliderShadow['_results'][item].nativeElement, 'height', 'calc(100% + ' + height + 'px)');
      this._renderer2.setStyle(this.sliderShadow['_results'][item].nativeElement, 'top', '-' + height + 'px');
    }
  }

  // 获取用户信息（判断是否登录）
  getUserInfo() {
    this.getUserInfoSubscription.add(
      this._store
        .select(fromRoot.getUserInfo)
        .filter((user) => !!user)
        .subscribe((user) => {
          this.userName = user.nickname || user.loginname;
        })
    );
  }

  // 获取图表模版列表
  getChartList(title = '') {
    this.keyword = title;
    // 获取 template 列表
    this.getTemplateListSubscription.add(
      this._store.select(fromRoot.getChartTemplates).subscribe((data) => {
        if (data) {
          const newData = data.reduce((acc, item) => {
            if (item.templateId === '8000000011111111004' || 
              item.templateId === '8000000011111111003' ||
              item.templateId === '8000000011111111002' ||
              item.templateId === '8000000011111111001'
            ) {
              acc.unshift(item);
            } else {
              acc.push(item);
            }
            return acc;
          }, []);
          this.resultLength = newData.length;
          this.chartFilterTemplates = _.cloneDeep(newData);
          this.chartTemplates = _.cloneDeep(this.chartFilterTemplates);
          this.backupCharts = _.cloneDeep(newData);
          // 添加描述
          this.addchartContent();
          // 分类标签点击搜索
          let num = this._router.snapshot.queryParams.index ? this._router.snapshot.queryParams.index : 0;
          this.changeChartClassify(0);
          this.chartTemplateListClickHandle(this.chartClassifyTemplateList[num], num);
        }
      })
    );
  }

  // 重新加载页面
  reload() {
    this.keyword = '';
    this.getChartList('');
  }

  // 搜索
  onSearch(title = '') {
    if (title) {
      this.getChartList(title);
    } else {
      this.changeChartClassify(0);
      this.keyword = title;
      this.chartFilterTemplates = _.cloneDeep(this.backupCharts);
      this.chartTemplates = _.cloneDeep(this.backupCharts);
      // 重新搜索
      this.chartTemplateListClickHandle(this.chartTitleTemplates[this.activeIndex], this.activeIndex);
    }
    document.querySelectorAll('.index-wrapper')[0].scrollTo(0, 0);
  }

  // 添加图表详细信息
  addchartContent() {
    this.chartTemplates.forEach((ele) => {
      chartContent.forEach((item) => {
        if (ele.projectId === item.projectId) {
          ele.definition = item.definition;
          ele.usedCase = item.usedCase;
        }
      });
    });
    this.chartFilterTemplates.forEach((ele) => {
      chartContent.forEach((item) => {
        if (ele.projectId === item.projectId) {
          ele.definition = item.definition;
          ele.usedCase = item.usedCase;
        }
      });
    });
  }


  // 图标类型切换
  changeChartClassify(index) {
    if (index === 0) {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'chart', 'createproject', 'chart-popup-tab-chartType']);
    } else {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'chart', 'createproject', 'chart-popup-tab-chartFunction']);
    }
    this.chartFilterTemplates = [];
    this.chartFilterTemplates = this.chartTemplates;
    this.chartClassifyIndex = index;
    this.activeIndex = 0;
    this.chartPriceIndex = 0;
    if (index === 0) {
      this.chartTitleTemplates = this.chartClassifyTemplateList;
    } else if (index === 1) {
      this.chartTitleTemplates = this.chartFunctionTemplateList;
    }
    this.resultLength = this.chartFilterTemplates.length;
  }

  // 类型详情选择
  chartTemplateListClickHandle(itemType, index) {
    if (this.chartClassifyIndex === 0) {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'chart', 'createproject', 'chart-popup-chang-ChartTypeIndex'], index);
    } else {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'chart', 'createproject', 'chart-popup-chang-ChartFunctionIndex'], index);
    }
    this.activeIndex = index;
    this.chartPriceTotalTemplates = [];
    // 关键词
    if (this.keyword) {
      this.chartTemplates = this.chartTemplates.filter(item => item.title.indexOf(this.keyword) > - 1);
    } else {
      this.chartFilterTemplates = [];
    }
    if (this.chartClassifyIndex === 0) {
      if (itemType.title === '全部') {
        this.chartFilterTemplates = this.chartTemplates;
      } else {
        this.chartFilterTemplates = this.chartTemplates.filter(item => item.chart_type === itemType.title);
        // _.forEach(this.chartTemplates, (data) => {
        //   if (data.chart_type === itemType.title) {
        //     this.chartFilterTemplates.push(data);
        //   }
        // });
      }
    } else {
      if (itemType.title === '全部') {
        this.chartFilterTemplates = this.chartTemplates;
      } else {
        this.chartFilterTemplates = this.chartTemplates.filter(item => item.function_type.includes(itemType.title + '类'))
        // _.forEach(this.chartTemplates, (data) => {
        //   if (_.includes(data.function_type, itemType.title + '类')) {
        //     this.chartFilterTemplates.push(data);
        //   }
        // });
      }
    }
    this.chartPriceTotalTemplates = this.chartFilterTemplates;
    this.resultLength = this.chartFilterTemplates.length;
    this.changeChartPrice(this.chartPriceIndex);
  }

  // 价格筛选
  changeChartPrice(index) {
    if (index === 0) {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'chart', 'createproject', 'chart-popup-tab-price-all'], index);
    } else if (index === 1) {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'chart', 'createproject', 'chart-popup-tab-price-member'], index);
    } else {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'chart', 'createproject', 'chart-popup-tab-price-free'], index);
    }
    this.chartPriceIndex = index;
    switch (index) {
      case 0:
        this.chartFilterTemplates = this.chartPriceTotalTemplates;
        break;
      case 1:
        const arr = this.chartPriceTotalTemplates;
        this.chartFilterTemplates = arr.filter((item) => item.isFree === '1');
        break;
      case 2:
        const arr1 = this.chartPriceTotalTemplates;
        this.chartFilterTemplates = arr1.filter((item) => item.isFree === '0');
        break;
      default:
        break;
    }
  }

  // 创建空白模版
  createEmptyTemplateHandle() {
    if (this.initialState.type === 'chart') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'chart', 'createproject', 'chart-popup-choose-chart-index'], 200);
    } else {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'chart', 'createproject', 'template-use-blank']);
    }

    if (this.userName) {
      let templateId;
      if (this.initialState.type === 'chart') {
        templateId = '0';
      } else {
        templateId = null;
      }
      const payload: ProjectModels.CreateProjectInfo = {
        title: '未命名',
        description: '',
        type: this.initialState.type,
        templateId: templateId,
        public: true,
      };
      // 判断是否可以创建
      const urla = `${this._api.getOldUrl()}/vis/dychart/project`;
      const returnCode = this._createProjectService.createProject(urla, this.initialState.type, payload);
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash);
    }
  }

  // 创建单图副本模版
  createChartTemplateHandle(item, i) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'chart', 'createproject', `edit-insert-chart-index${item.label}`]);

    if (this.userName) {
      // 判断是否可以创建
      const urla = `${this._api.getOldUrl()}/vis/dychart/fork/template/${item.templateId}`;
      const returnCode = this._createProjectService.createProject(urla, this.initialState.type);
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash);
    }
  }

  // 获取热词
  getHotSearchWords() {
    this._indexService.gotHotSearchWords('c').subscribe(res => {
      this.hotWords = res['data'];
    })
  }

  // 会员提示
  upgrade(tip) {
    if (tip === 'overContain') {
      this.modalService.show(UpgradeMemberComponent, {
        initialState: {
          chaeckType: 0,
          vipIds: ['4'],
          svipIds: ['4'],
        },
      });
    } else {
      this.modalService.show(UpgradeMemberComponent, {
        initialState: {
          chaeckType: 0,
          vipIds: ['7'],
          svipIds: ['7'],
        },
      });
    }
  }

  // 模板需求弹窗
  showTemplateDemandFeedback() {
    this.modalService.show(DataDemandFeedbackComponent, {
      initialState: {
        title: '模板需求反馈',
        type: 'template',
        yourRequest: '请描述你的需求'
      }
    });
  }

  ngOnDestroy(): void {
    this.getTemplateListSubscription.unsubscribe();
    this.createEmptyTemplateSubscription.unsubscribe();
    this.forkChartProject.unsubscribe();
    this.forkInfoProject.unsubscribe();
    this.infoDetailSubscription.unsubscribe();
    this.getUserInfoSubscription.unsubscribe();
  }

  imgerror(e){
    this.isErroImg = true;
    e.srcElement.src='/dyassets/images/share/dy-ui/load-err.svg'
  }
}
