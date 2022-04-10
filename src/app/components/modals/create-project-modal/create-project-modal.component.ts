import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import { Subscription } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import * as ProjectActions from '../../../states/actions/project.action'
import * as ProjectModels from '../../../states/models/project.model'
import * as _ from 'lodash'
import { skip, filter, take } from 'rxjs/operators'
import { Router } from '@angular/router'
import { VipService } from '../../../share/services/vip.service'
import { UpgradeMemberComponent } from '../../../components/modals/upgrade-member/upgrade-member.component'
import { ContactUsModalComponent } from '../../../components/modals/contact-us-modal/contact-us-modal.component'
import * as CaseActions from '../../../states/actions/project-case.action'
import { GetChartTemplateListAction } from '../../../states/actions/template.action'
import { API } from '../../../states/api.service'
import { ToastrService } from 'ngx-toastr'
import { CreateProjectService } from '../../../share/services/create-project.service'

@Component({
  selector: 'lx-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss'],
})
export class CreateProjectModalComponent implements OnInit {
  initialState
  createProjectBoxStyle

  getInfoDetailTimer

  isVpl: string = ''
  loadTip: string = '加载更多...'

  // 新图表列表方便打 new 标签11个
  newChartTagList = [
    '5612096174443311145',
    '154777693253141239',
    '7612096173333355103',
    '7612096173333355101',
    '7612096176663355107',
    '7612096176663355103',
    '7612096176663355104',
    '7612096176663355105',
    '7612096174443355101',
    '7612096174443355102',
    '7612096176663355106',
  ]

  @ViewChild('sysScroll') sysScroll: ElementRef
  updateMasonryLayout: boolean = false

  // 节流
  timer

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
  ]
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
  ]
  chartClassifyIndex = 0 // 图表类型
  chartPriceIndex = 0 // 图表价格
  activeIndex: number = 0 // 默认选中
  chartTitleTemplates = [] // 顶部分类选择
  chartTemplates = [] // 模版列表
  chartFilterTemplates = []
  chartPriceTotalTemplates = [] // 模版总数

  infoTemplates = [] // 信息图列表
  infoFilterTemplates = [] // 信息图筛选列表
  infoTypeIndex = 0 // 信息图类型
  infoClassifyIndex = 0 // 信息图分类目录
  infoSecondClassifyIndex = 0 // 信息图二级分类
  infoFirstClassify = [] // 信息图第一列分类列表
  infoSecondClassify = [] // 信息图第二列分类列表
  infoOrderIndex = 0 // 排序
  infoOrders = ['最新', '最热'] // 排序数组
  leftTitle = '图表'
  orderTag = '最新'

  priceValue = 'all' // 下拉框
  orderValue = 'date' // 下拉框

  priceMenu = ['全部', '会员', '免费']
  priceIndex = 0

  orderDropDownflag: boolean = false
  //
  new_window = null

  // 存储按条件筛选参数
  infoScene_id = 0
  infoParent_id = 0
  infoOrder = 'date'
  infoLevel = 1
  infoPrice = 'all'
  infoType = ''
  infoPage: number = 1
  // 用户名字（判断登录）
  userName: string

  // 模板尺寸
  templateSize = '700px*1200px'

  // 瀑布流配置
  // public myOptions: NgxMasonryOptions = {
  //   percentPosition: true,
  //   transitionDuration: '0s',
  //   initLayout: true,
  // };

  // 信息图与单图总长度
  totalLength
  allProjects$

  getTemplateListSubscription = new Subscription()
  createEmptyTemplateSubscription = new Subscription()
  forkChartProject = new Subscription()
  forkInfoProject = new Subscription()
  allProjectScription = new Subscription()
  getUserInfoSubscription = new Subscription()
  infoDetailSubscription = new Subscription()

  // 获取信息图的分类
  private infoClassifyUrl = `${this._api.getOldUrl()}/vis/dychart/scene/get_scene_list`

  // 按条件获取场景列表
  private infoConditionUrl = `${this._api.getOldUrl()}/vis/dychart/scene/get_scene_templates`

  // 跨域允许
  httpOptions = { withCredentials: true }

  // 信息图喜欢
  isLike: boolean = false

  // 空白模板类型
  blankInfoType = '信息图'

  // 空白模板样式
  blankHeight: string = '397px'

  // 弹框宽度自适应
  widthStyle: string = 'auto'

  // 下拉控制
  dropDownFlag: boolean = false

  constructor(
    private modalService: BsModalService,
    public bsModalRef: BsModalRef,
    private _store: Store<fromRoot.State>,
    private _router: Router,
    private _http: HttpClient,
    private _vipService: VipService,
    private _api: API,
    private _el: ElementRef,
    private toastr: ToastrService,
    private _createProjectService: CreateProjectService
  ) {
    this.allProjects$ = this._store.select(fromRoot.getAllProjectList)
  }

  ngOnInit() {
    // 判断是否登录
    this.getUserInfo()

    // 判断是否会员
    this.isVpl = this._vipService.getVipLevel()

    this.initialState = this.modalService.config.initialState
    this.initialState.type === 'chart' ? (this.leftTitle = '图表') : (this.leftTitle = '信息图')

    // 获取信息图分类
    if (this.initialState.type !== 'chart') {
      this.getInfoClassify()
      // 如果是单个类别进来就走单个请求的，如果整个过来就请求整体
      if (this.initialState.id) {
        this.infoClassifyIndex = this.initialState.id
        // 设置创建空白信息图的高度 这里就手动设置了。。
        switch (this.infoClassifyIndex) {
          // '全部'
          case 0:
            this.blankHeight = '397px'
            this.templateSize = '700px*1200px'
            break
          // "微信公众号首图"
          case 1:
            this.blankHeight = '120px'
            this.templateSize = '900px*383px'
            break
          // "微博焦点图片"
          case 2:
            this.blankHeight = '127.7px'
            this.templateSize = '560px*260px'
            break
          // // "头条号首图"
          // case 3:
          //   this.blankHeight = '150.05px';
          //   break;
          // "正文配图（横版）"
          case 4:
            this.blankHeight = '194px'
            this.templateSize = '400px*300px'
            break
          // "正文配图（方形）"
          case 5:
            this.blankHeight = '252px'
            this.templateSize = '400px*400px'
            break
          // "正文配图（竖版）"
          case 6:
            this.blankHeight = '368px'
            this.templateSize = '400px*600px'
            break
          // "图表报告"
          case 7:
            this.blankHeight = '368.19px'
            this.templateSize = '595px*893px'
            break
          // "工作报告"
          // case 8:
          //   this.blankHeight = '335.05px';
          //    this.templateSize = '595px*808px';
          //   break;
          // "手机海报"
          case 9:
            this.blankHeight = '385.39px'
            this.templateSize = '640px*1008px'
            break
          // 营销长图
          // case 10:
          //   this.blankHeight = '';
          //   this.templateSize = '';
          //   break;
          // "简历"
          case 11:
            this.blankHeight = '348.3px'
            this.templateSize = '595px*842px'
            break
          // "新闻长图"
          case 12:
            this.blankHeight = '600px'
            this.templateSize = '800px*2000px'
            break
          // 数据图说
          case 13:
            this.blankHeight = '600px'
            this.templateSize = '640px*1920px'

            break
          default:
            break
        }
        this.getByConditionsTemplates(
          this.initialState.id,
          this.infoParent_id,
          this.infoLevel,
          this.infoOrder,
          this.infoPrice,
          this.infoType
        )
      } else {
        // 获取信息图
        this.getByConditionsTemplates(
          this.infoScene_id,
          this.infoParent_id,
          this.infoLevel,
          this.infoOrder,
          this.infoPrice,
          this.infoType
        )
      }
    }

    // 默认按分类排序
    this.chartTitleTemplates = this.chartClassifyTemplateList

    // 限制弹窗里面大小
    this.resetWidth()

    // 弹窗大小
    this.createProjectBoxStyle = {
      width: innerWidth - 100 + 'px',
      height: innerHeight - 100 + 'px',
      'overflow-y': 'scroll',
      'margin-top': '50px',
    }

    // 获取图表
    this.getChartList()
    this.chartPriceTotalTemplates = this.chartTemplates

    // 获取项目长度
    this.allProjectScription.add(
      this.allProjects$.subscribe((list) => {
        this.totalLength = list.length
      })
    )

    this.updateMasonryLayout = false
    setTimeout(() => {
      this.updateMasonryLayout = true
    }, 500)
  }

  ngAfterViewInit() {
    this.sysScroll.nativeElement.addEventListener('scroll', this.handleScroll.bind(this))
    window.addEventListener('click', this.allClick.bind(this))
  }

  // 全局点击关闭用户下拉框，除了点击用户下拉框部分
  allClick() {
    var e = e || window.event
    if (e.target !== this._el.nativeElement.querySelectorAll('.no-click-area')[0]) {
      this.orderDropDownflag = false
    }
    if (e.target !== this._el.nativeElement.querySelectorAll('.no-click-area')[1]) {
      this.dropDownFlag = false
    }
  }

  // 初始化创建弹窗宽度
  resetWidth() {
    const nowWidth = document.documentElement.clientWidth //  获取屏幕宽度
    if (nowWidth < 1520) {
      this.widthStyle = '1140px'
    } else if (nowWidth >= 1520 && nowWidth < 1760) {
      this.widthStyle = '1402px'
    } else if (nowWidth >= 1760) {
      this.widthStyle = '1665px'
    }
  }

  // 滚动到底部加载
  handleScroll() {
    this.updateMasonryLayout = false
    setTimeout(() => {
      this.updateMasonryLayout = true
    }, 0)
    var e = e || window.event

    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(() => {
      const top = Math.round(e.target.scrollTop)

      // 最大滚动距离
      const maxHeight = e.target.scrollHeight - e.target.clientHeight - 10

      if (this.infoPage && top >= maxHeight) {
        this.infoPage++
        // this.getByConditionsTemplates(this.infoScene_id, this.infoParent_id, this.infoLevel, this.infoOrder,
        // this.infoPrice, this.infoType, this.infoPage);
        // 如果是单个类别进来就走单个请求的，如果整个过来就请求整体
        if (this.initialState.id) {
          this.getByConditionsTemplates(
            this.initialState.id,
            this.infoParent_id,
            this.infoLevel,
            this.infoOrder,
            this.infoPrice,
            this.infoType,
            this.infoPage
          )
        } else {
          // 获取信息图
          this.getByConditionsTemplates(
            this.infoScene_id,
            this.infoParent_id,
            this.infoLevel,
            this.infoOrder,
            this.infoPrice,
            this.infoType,
            this.infoPage
          )
        }
      }
    }, 50)
  }

  // 获取用户信息（判断是否登录）
  getUserInfo() {
    this.getUserInfoSubscription.add(
      this._store
        .select(fromRoot.getUserInfo)
        .filter((user) => !!user)
        .subscribe((user) => {
          this.userName = user.nickname || user.loginname
        })
    )
  }

  // 获取图表模版列表
  getChartList() {
    this._store.dispatch(new GetChartTemplateListAction())
    // 获取 template 列表
    this.getTemplateListSubscription.add(
      this._store.select(fromRoot.getChartTemplates).subscribe((data) => {
        if (data) {
          this.chartTemplates = data
          this.chartFilterTemplates = data
        }
      })
    )
  }

  // 获取信息图分类
  getInfoClassify() {
    this._http.get(this.infoClassifyUrl, this.httpOptions).subscribe((data) => {
      this.infoFirstClassify = data['data']['list'].filter((item) => {
        return item.level === 1
      })
      this.infoSecondClassify = data['data']['list'].filter((item) => {
        return item.level === 2
      })
      this.infoFirstClassify.unshift({ name: '全部', level: 1, id: 0, parent_id: 0, order: 'date', price: 'all' })
      this.infoSecondClassify.unshift({ name: '全部', level: 2, id: 0, parent_id: 1, order: 'date', price: 'all' })
    })
  }

  // 展开下拉
  extendDrop() {
    this.dropDownFlag = !this.dropDownFlag
  }

  extendOrderDrop() {
    this.orderDropDownflag = !this.orderDropDownflag
  }

  // 图标类型切换
  changeChartClassify(index) {
    this.chartFilterTemplates = []
    this.chartFilterTemplates = this.chartTemplates
    this.chartClassifyIndex = index
    this.activeIndex = 0
    this.chartPriceIndex = 0
    if (index === 0) {
      this.chartTitleTemplates = this.chartClassifyTemplateList
    } else if (index === 1) {
      this.chartTitleTemplates = this.chartFunctionTemplateList
    }
  }

  // 信息图切换
  changeInfoClassify(index, item) {
    // 改变空白模板高度
    switch (item.name) {
      case '全部':
        this.blankHeight = '397px'
        this.templateSize = '700px*1200px'
        break
      case '微信公众号首图':
        this.blankHeight = '120px'
        this.templateSize = '900px*383px'
        break
      case '微博焦点图片':
        this.blankHeight = '127.7px'
        this.templateSize = '560px*260px'
        break
      // case "头条号首图":
      //   this.blankHeight = '150.05px';
      //   this.templateSize = '660px*370px';
      //   break;
      case '正文配图（横版）':
        this.blankHeight = '194px'
        this.templateSize = '400px*300px'
        break
      case '正文配图（方形）':
        this.blankHeight = '252px'
        this.templateSize = '400px*400px'
        break
      case '正文配图（竖版）':
        this.blankHeight = '368px'
        this.templateSize = '400px*600px'
        break
      case '图表报告':
        this.blankHeight = '368.19px'
        this.templateSize = '595px*893px'
        break
      case '数据图说':
        this.blankHeight = '755.9px'
        this.templateSize = '640px*1920px'
        break
      // case "工作报告":
      //   this.blankHeight = '335.05px';
      //   this.templateSize = '595px*808px';
      //   break;
      case '手机海报':
        this.blankHeight = '385.39px'
        this.templateSize = '640px*1008px'
        break
      case '简历':
        this.blankHeight = '348.3px'
        this.templateSize = '595px*842px'
        break
      case '新闻长图':
        this.blankHeight = '600px'
        this.templateSize = '800px*2000px'
        break
      case '数据图说':
        this.blankHeight = '600px'
        this.templateSize = '640px*1920px'
        break
      default:
        break
    }
    if (item.name === '全部') {
      this.blankInfoType = '信息图'
    } else {
      this.blankInfoType = item.name
    }
    this.infoPage = 1
    this.infoFilterTemplates = []
    this.infoFilterTemplates = this.infoTemplates
    if (item.level === 1) {
      // 改变第一级的时候，第二级第三级第四级初始化
      this.infoClassifyIndex = index
      this.infoLevel = 1
      this.infoScene_id = item.id
    } else if (item.level === 2) {
      // 第二级
      this.infoSecondClassifyIndex = index
      this.infoLevel = 1
      this.infoType = item.id
    }
    // 选择全部
    if (index === 0) {
      this.infoLevel = 0
      if (item.level === 2) {
        this.infoLevel = 1
      }
    } else {
      this.infoLevel = 1
    }
    this.getByConditionsTemplates(
      this.infoScene_id,
      this.infoParent_id,
      this.infoLevel,
      this.infoOrder,
      this.infoPrice,
      this.infoType
    )
  }

  // 根据排序切换信息图
  changeInfoOrder(i, item) {
    this.infoPage = 1
    const order = item
    if (order === '最新') {
      this.infoOrder = 'date'
      this.infoOrderIndex = 0
    } else if (order === '最热') {
      this.infoOrder = 'hot'
      this.infoOrderIndex = 1
    }
    this.infoFilterTemplates = []
    this.getByConditionsTemplates(
      this.infoScene_id,
      this.infoParent_id,
      this.infoLevel,
      this.infoOrder,
      this.infoPrice,
      this.infoType
    )
  }

  // 根据价格切换信息图
  changeInfoPrice(i, item) {
    this.infoPage = 1
    this.priceIndex = i
    if (item === '全部') {
      this.infoPrice = 'all'
    } else if (item.trim() === '会员') {
      this.infoPrice = 'lv1'
    } else if (item === '免费') {
      this.infoPrice = 'free'
    }
    this.infoFilterTemplates = []
    this.getByConditionsTemplates(
      this.infoScene_id,
      this.infoParent_id,
      this.infoLevel,
      this.infoOrder,
      this.infoPrice,
      this.infoType
    )
  }

  // 获取按条件筛选的列表
  getByConditionsTemplates(scene_id, parent_id, level, order, price, type, page: number = 1) {
    this._http
      .get(
        `${this.infoConditionUrl}?scene_id=${scene_id}&parent_id=${parent_id}&level=${level}&order=${order}&price=${price}&type=${type}&pagenum=${page}`,
        this.httpOptions
      )
      .subscribe((data) => {
        this.updateMasonryLayout = false
        setTimeout(() => {
          this.updateMasonryLayout = true
        }, 500)
        if (data['resultCode'] === 1000) {
          if (data['data']['list'].length !== 0) {
            this.loadTip = '加载更多...'
          } else {
            this.loadTip = '没有更多了'
          }
          this.infoFilterTemplates = this.infoFilterTemplates.concat(data['data']['list'])
          if (page === 1) {
            this.infoFilterTemplates.unshift({
              id: '',
              title: '空白模版',
              thumb: '/dyassets/images/create-project.png',
              price: 0,
            })
          }
        }
      })
  }

  // 类型详情选择
  chartTemplateListClickHandle(item, index) {
    this.activeIndex = index
    this.chartPriceTotalTemplates = []
    if (this.chartClassifyIndex === 0) {
      this.chartFilterTemplates = []
      if (item.title === '全部') {
        this.chartFilterTemplates = this.chartTemplates
      } else {
        _.forEach(this.chartTemplates, (data) => {
          if (data.chart_type === item.title) {
            this.chartFilterTemplates.push(data)
          }
        })
      }
    } else {
      this.chartFilterTemplates = []
      if (item.title === '全部') {
        this.chartFilterTemplates = this.chartTemplates
      } else {
        _.forEach(this.chartTemplates, (data) => {
          if (_.includes(data.function_type, item.title + '类')) {
            this.chartFilterTemplates.push(data)
          }
        })
      }
    }
    this.chartPriceTotalTemplates = this.chartFilterTemplates
    this.changeChartPrice(this.chartPriceIndex)
  }

  // 价格筛选
  changeChartPrice(index) {
    this.chartPriceIndex = index
    switch (index) {
      case 0:
        this.chartFilterTemplates = this.chartPriceTotalTemplates
        break
      case 1:
        const arr = this.chartPriceTotalTemplates
        this.chartFilterTemplates = arr.filter((item) => item.isFree === '1')
        break
      case 2:
        const arr1 = this.chartPriceTotalTemplates
        this.chartFilterTemplates = arr1.filter((item) => item.isFree === '0')
        break
      default:
        break
    }
  }

  // 创建空白模版
  createEmptyTemplateHandle() {
    if (this.userName) {
      if (this.userName) {
        let templateId
        if (this.initialState.type === 'chart') {
          templateId = '0'
        } else {
          templateId = null
        }
        const payload: ProjectModels.CreateProjectInfo = {
          title: '未命名',
          description: '',
          type: this.initialState.type,
          templateId: templateId,
          public: true,
        }
        // 判断是否可以创建
        const urla = `${this._api.getOldUrl()}/vis/dychart/project`
        const returnCode = this._createProjectService.createProject(urla, this.initialState.type, payload)
        if (returnCode !== 1000) {
          this.bsModalRef.hide()
        }
      } else {
        window.location.href =
          `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
          encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
      }
    }
  }

  // 创建单图副本模版
  createChartTemplateHandle(item, i) {
    if (this.userName) {
      // 判断是否可以创建
      const urla = `${this._api.getOldUrl()}/vis/dychart/fork/template/${item.templateId}`
      const returnCode = this._createProjectService.createProject(urla, this.initialState.type)
      if (returnCode !== 1000) {
        this.bsModalRef.hide()
      }
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  // 信息图模版预览
  previewInfo(e, item) {
    e.stopPropagation()
    window.open(window.location.href.split('#')[0] + '#/pages/templates/item?id=' + item.id, '_blank')
  }

  // 创建信息图副本模版
  createInfoTemplateHandle(item, i) {
    if (i === 0) {
      this.createEmptyTemplateHandle()
    } else {
      if (this.userName) {
        // 判断是否可以创建
        const urla = `${this._api.getOldUrl()}/vis/dychart/fork/infographic/${item.id}`
        const returnCode = this._createProjectService.createProject(urla, 'infographic')
        if (returnCode !== 1000) {
          this.bsModalRef.hide()
        }
      } else {
        window.location.href =
          `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
          encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
      }
    }
  }

  // 鼠标移入获取当前信息图详情，用来得知当前信息图的喜欢状态
  getInfoDetail(e, item, index) {
    e.stopPropagation()
    if (index === 0) {
      return
    }
    this.getInfoDetailTimer = setTimeout(() => {
      this._store.dispatch(new CaseActions.GetProjectCaseDetailAction(item.id))
      this.infoDetailSubscription.add(
        this._store
          .select(fromRoot.getProjectCaseDetail)
          .pipe(filter((data) => !!data))
          .subscribe((data) => {
            this.isLike = data.islike
          })
      )
    }, 500)
  }

  // 信息图模版喜欢
  toggleLike(e, item) {
    e.stopPropagation()
    // 判断用户登录
    if (this.userName) {
      this.isLike = !this.isLike
      this._store.dispatch(
        new CaseActions.ToggleLikeCaseAction({
          type: 'infographic',
          caseid: item.id,
          islike: this.isLike ? 1 : 0,
        })
      )
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  // 加载更多
  loadMore() {
    if (this.loadTip === '加载更多...') {
      this.infoPage++
      // 如果是单个类别进来就走单个请求的，如果整个过来就请求整体
      if (this.initialState.id) {
        this.getByConditionsTemplates(
          this.initialState.id,
          this.infoParent_id,
          this.infoLevel,
          this.infoOrder,
          this.infoPrice,
          this.infoType,
          this.infoPage
        )
      } else {
        // 获取信息图
        this.getByConditionsTemplates(
          this.infoScene_id,
          this.infoParent_id,
          this.infoLevel,
          this.infoOrder,
          this.infoPrice,
          this.infoType,
          this.infoPage
        )
      }
    }
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
      })
    } else {
      this.modalService.show(UpgradeMemberComponent, {
        initialState: {
          chaeckType: 0,
          vipIds: ['7'],
          svipIds: ['7'],
        },
      })
    }
  }

  ngOnDestroy(): void {
    this.getTemplateListSubscription.unsubscribe()
    this.createEmptyTemplateSubscription.unsubscribe()
    this.forkChartProject.unsubscribe()
    this.forkInfoProject.unsubscribe()
    this.infoDetailSubscription.unsubscribe()
    this.getUserInfoSubscription.unsubscribe()
    this.sysScroll.nativeElement.removeEventListener('scroll', this.handleScroll.bind(this))
  }
}
