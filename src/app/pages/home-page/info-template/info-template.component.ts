import { Component, OnInit, ElementRef } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { Store } from '@ngrx/store'
import { HttpClient } from '@angular/common/http'

import * as fromRoot from '../../../states/reducers'
import * as _ from 'lodash'
import * as CaseActions from '../../../states/actions/project-case.action'
import { debounceTime, map } from 'rxjs/operators'

import { Observable, Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
import { DataDemandFeedbackComponent } from '../../../components/modals'
import * as ProjectModels from '../../../states/models/project.model'

import { Router, ActivatedRoute } from '@angular/router'
import { VipService } from '../../../share/services/vip.service'
import { API } from '../../../states/api.service'
import { ToastrService } from 'ngx-toastr'
import { CreateProjectService } from '../../../share/services/create-project.service'
import { ScrollService } from '../../../share/services/scroll.service'
import { HotWords } from '../index/index.types'
import { IndexService, WaterfallService } from '../../../share/services'
import { DataTransmissionService } from '../../../share/services/data-transmission.service'
import { UtilsService } from '../../../share/services/utils.service'

declare var jQuery: any

@Component({
  selector: 'lx-info-template',
  templateUrl: './info-template.component.html',
  styleUrls: ['./info-template.component.scss'],
})
export class InfoTemplateComponent implements OnInit {
  inputValue
  hoverIndex
  hotWords: HotWords[] = []
  public loading = false

  infoTemplates = [] // 信息图列表
  infoFilterTemplates = [] // 信息图筛选列表
  infoTypeIndex = 0 // 信息图类型
  infoClassifyIndex = 0 // 信息图分类目录
  infoSecondClassifyIndex = 0 // 信息图二级分类
  infoFirstClassify = [] // 信息图第一列分类列表
  infoSecondClassify = [] // 信息图第二列分类列表
  infoOrderIndex = 0 // 排序
  infoOrders = ['最新模板', '最热模板'] // 排序数组
  priceMenu = ['全部', '会员', '免费']
  priceIndex: number = 0
  leftTitle = '图表'
  isLike: boolean = false
  isLikeText: string = '收藏'

  dropDownFlag: boolean = false // 下拉控制

  priceValue = 'all' // 下拉框
  orderValue = 'date' // 下拉框

  // 存储按条件筛选参数
  infoScene_id = 0
  infoParent_id = 0
  infoOrder = 'date'
  infoLevel = 1
  infoPrice = 'all'
  infoType = ''
  infoTypeName = ''
  infoPage: number = 1
  keyword: string = ''
  scrollevent

  // 搜索结果
  isSearchResult: boolean = false
  showMasonryLoading: boolean = true

  // 用户名
  userName: string

  // 空白信息图图片
  blankImg

  // 会员信息
  isVpl: string

  // 项目长度
  totalLength: number

  // 空白模板样式
  blankHeight: string = '397px'

  infoTypeList = [
    '信息图 (700px*1200px)',
    '微信公众号首图 (900px*383px)',
    '微博焦点图片 (560px*260px)',
    '头条号首图 (660px*370px)',
    '正文配图（横版）(400px*300px)',
    '正文配图（方形）(400px*400px)',
    '正文配图（竖版）(400px*600px)',
    '图表报告 (A4) (595px*893px)',
    '工作报告 (A4) (595px*808px)',
    '手机海报 (640px*1008px)',
    '营销长图',
    '简历 (A4) (595px*842px)',
    '新闻长图 (800px*2000px)',
    '数据图说 (640px*1920px)',
  ]

  // 模板尺寸
  templateSize = '700px*1200px'

  // 节流
  timer
  getInfoDetailTimer

  isShowTip: boolean = true

  totalNum = 0

  // 获取信息图的分类
  private infoClassifyUrl = `${this._api.getOldUrl()}/vis/dychart/scene/get_scene_list`

  // 按条件获取场景列表
  private infoConditionUrl = `${this._api.getOldUrl()}/vis/dychart/scene/get_scene_templates`

  // 跨域允许
  httpOptions = { withCredentials: true }

  // 项目流
  allProjects$
  forkInfoProject = new Subscription()
  infoDetailSubscription = new Subscription()
  getUserInfoSubscription = new Subscription()
  allProjectScription = new Subscription()

  infoSubscription = new Subscription()

  showWaterfallArr = []
  containerHeight = 0

  constructor(
    private _store: Store<fromRoot.State>,
    private _router: Router,
    private _http: HttpClient,
    private _activatedRoute: ActivatedRoute,
    private _el: ElementRef,
    private _modalService: BsModalService,
    private _vipService: VipService,
    private _api: API,
    private toastr: ToastrService,
    private _createProjectService: CreateProjectService,
    private _scrollService: ScrollService,
    private _indexService: IndexService,
    private _utilService: UtilsService,
    private _dataTransmissionService: DataTransmissionService,
    private _waterfallService: WaterfallService
  ) {
    this.allProjects$ = this._store.select(fromRoot.getAllProjectList)
    this.getHotSearchWords()
  }

  ngOnInit() {
    this.infoPage = 1

    let isChrome = this._utilService.getBrowserInfo() === 'Chrome' || this._utilService.getBrowserInfo() === 'Safari'
    let isCloseTip = this._utilService.isCloseTip
    this.isShowTip = !isCloseTip && !isChrome

    this._dataTransmissionService.getShowTip().subscribe((res) => {
      this.isShowTip = res
    })
    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2/#/pages/templates/list']);

    // 接受 index 选择第几个分类
    const index = this._activatedRoute.snapshot.queryParams.index

    // 接受搜索值，并且搜索
    this.keyword = this._activatedRoute.snapshot.queryParams.keyword

    // 如果是单个类别进来就走单个请求的，如果整个过来就请求整体
    if (index) {
      this.infoClassifyIndex = Number(index)
      // 判断是 level1 还是 level2 (见信息图切换函数) index > 100 为 level2
      if (this.infoClassifyIndex < 100) {
        this.infoLevel = 1
        this.infoScene_id = this.infoClassifyIndex
      } else {
        this.infoClassifyIndex = 0
        this.infoSecondClassifyIndex = parseInt((index % 10) + '')
        this.infoLevel = 1
        this.infoType = index
      }
    }

    // 设置创建空白信息图的高度 这里就手动设置了。。
    this.setBlankHeightandSize(index)

    // 获取对应的场景列表（全部或者分类）
    this.getByConditionsTemplates(
      this.infoScene_id,
      this.infoParent_id,
      this.infoLevel,
      this.infoOrder,
      this.infoPrice,
      this.infoType
    )

    // 获取信息图分类
    this.getInfoClassify()

    // 获取登录信息
    this.getUserInfo()

    // 获取会员信息
    this.isVpl = this._vipService.getVipLevel()

    // 获取项目长度
    this.allProjectScription.add(
      this.allProjects$.subscribe((list) => {
        this.totalLength = list.length
      })
    )

    if (this.keyword) {
      window.location.href = location.href.split('keyword')[0]
      this.onSearchEmitValue(this.keyword)
    }
  }

  ngAfterViewInit() {
    this.infoSubscription.add(
      this._scrollService
        .getCollectScroll()
        .pipe(debounceTime(20))
        .subscribe((res) => {
          if (res) {
            if (this.totalNum > this.infoFilterTemplates.length + 1) {
              this.infoPage++
              this.getByConditionsTemplates(
                this.infoScene_id,
                this.infoParent_id,
                this.infoLevel,
                this.infoOrder,
                this.infoPrice,
                this.infoType,
                this.infoPage,
                this.inputValue
              )
            }
          }
        })
    )

    Observable.fromEvent(window, 'resize')
      .pipe(
        debounceTime(100) // 加点去抖，毕竟 `resize` 频率非常高
      )
      .subscribe(async (event) => {
        const containerWidth = document.documentElement.clientWidth - 350
        if (containerWidth > 930) {
          // 加载瀑布流
          const { data: aData, containerHeight } = await this._waterfallService.initWaterFall(this.infoFilterTemplates)
          this.showWaterfallArr = aData
          this.containerHeight = containerHeight
        }
      })
  }

  getHotSearchWords() {
    this._indexService.gotHotSearchWords().subscribe((res) => {
      this.hotWords = res['data']
    })
  }

  // 手动设置空白模板的高度以及显示的size
  setBlankHeightandSize(index) {
    let that = this

    index = index ? Number(index) : index
    if (index) {
      this.blankImg = '/dyassets/images/info-temple/blank-' + index + '.svg'
    } else {
      this.blankImg = '/dyassets/images/info-temple/blank-0.svg'
    }

    switch (index) {
      // '全部'
      case 0:
        // this.blankHeight = '397px';
        this.templateSize = '700px*1200px'
        break
      // "微信公众号首图"
      case 1:
        // this.blankHeight = '78px';
        this.templateSize = '900px*383px'
        break
      // "微博焦点图片"
      case 2:
        // this.blankHeight = '82.96px';
        this.templateSize = '560px*260px'
        break
      // // "头条号首图"
      // case 3:
      //   this.blankHeight = '150.05px';
      //   break;
      // "正文配图（横版）"
      case 4:
        // this.blankHeight = '134.03px';
        this.templateSize = '400px*300px'
        break
      // "正文配图（方形）"
      case 5:
        // this.blankHeight = '178.7px';
        this.templateSize = '400px*400px'
        break
      // "正文配图（竖版）"
      case 6:
        // this.blankHeight = '268.05px';
        this.templateSize = '400px*600px'
        break
      // "图表报告"
      case 7:
        // this.blankHeight = '268.2px';
        this.templateSize = '595px*893px'
        break
      // "工作报告"
      // case 8:
      //   this.blankHeight = '335.05px';
      //    this.templateSize = '595px*808px';
      //   break;
      // "手机海报"
      case 9:
        // this.blankHeight = '281.45px';
        this.templateSize = '640px*1008px'
        break
      // 营销长图
      // case 10:
      //   this.blankHeight = '';
      //   this.templateSize = '';
      //   break;
      // "简历"
      case 11:
        // this.blankHeight = '252.88px';
        this.templateSize = '595px*842px'
        break
      // "新闻长图"
      case 12:
        // this.blankHeight = '446.76px';
        this.templateSize = '800px*2000px'
        break
      // 数据图说
      case 13:
        // this.blankHeight = '536.1px';
        this.templateSize = '640px*1920px'

        break
      default:
        // this.blankHeight = '397px';
        this.templateSize = '700px*1200px'
        break
    }

    this.infoTypeName = this.infoTypeList[index]
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

  // 搜索
  onSearchEmitValue(tag) {
    this.infoPage = 1
    this.inputValue = ''
    this.infoFilterTemplates = []
    this.infoScene_id = 0
    this.infoParent_id = 0
    this.infoType = ''
    this.infoPrice = 'all'
    this.infoOrderIndex = 0
    this.infoClassifyIndex = 0
    this.infoSecondClassifyIndex = 0
    this.keyword = tag
    if (tag) {
      this.inputValue = tag
      this._http
        .get(
          `${this.infoConditionUrl}?scene_id=${this.infoScene_id}&parent_id=${this.infoParent_id}&level=${this.infoLevel}&order=${this.infoOrder}&price=${this.infoPrice}&type=${this.infoType}&tag=${tag}&pagenum=${this.infoPage}`
        )
        .subscribe(async (data) => {
          this.infoFilterTemplates = data['data']['list']
          this.totalNum = data['data']['total']
          if (this.infoPage === 1) {
            this.infoFilterTemplates.unshift({
              id: '',
              title: '空白模版',
              thumb: this.blankImg,
              price: 0,
            })
          }
          if (data['data']['total'] === 0) {
            this.isSearchResult = true
          } else {
            this.isSearchResult = false
          }
          // 加载瀑布流
          const { data: aData, containerHeight } = await this._waterfallService.initWaterFall(this.infoFilterTemplates)
          this.showWaterfallArr = aData
          this.containerHeight = containerHeight
        })
    } else {
      this.isSearchResult = false
      // 搜索全部的数据
      this.infoPage = 1
      this.inputValue = ''
      this.infoFilterTemplates = []
      this.infoOrderIndex = 0
      this.infoClassifyIndex = 0
      this.infoSecondClassifyIndex = 0
      this.getByConditionsTemplates(0, 0, 1, 'date', 'all', '', 1, '')
    }
    document.querySelectorAll('.index-wrapper')[0].scrollTo(0, 0)
  }

  // 重新加载页面
  reload() {
    this.keyword = ''
    this.onSearchEmitValue('')
  }

  // 模板需求弹窗
  showTemplateDemandFeedback() {
    this._modalService.show(DataDemandFeedbackComponent, {
      initialState: {
        title: '模板需求反馈',
        type: 'template',
        yourRequest: '请描述你的需求',
      },
    })
  }

  // 获取信息图分类
  getInfoClassify() {
    // 获取信息图分类
    this._http.get(this.infoClassifyUrl, this.httpOptions).subscribe((data) => {
      this.infoFirstClassify = data['data']['list'].filter((item) => {
        return item.level == 1
      })
      this.infoSecondClassify = data['data']['list'].filter((item) => {
        return item.level == 2
      })
      this.infoFirstClassify.unshift({ name: '全部', level: 1, id: 0, parent_id: 0, order: 'date', price: 'all' })
      this.infoSecondClassify.unshift({ name: '全部', level: 2, id: 0, parent_id: 1, order: 'date', price: 'all' })
    })
  }

  // 信息图切换
  changeInfoClassify(index, item) {
    this.infoPage = 1
    this.infoFilterTemplates = []
    this.infoFilterTemplates = this.infoTemplates
    if (item.level === 1) {
      this.setBlankHeightandSize(index)
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'infographic', 'createproject', 'infor-popup-change-scene-index', index])
      // 改变第一级的时候，第二级第三级第四级初始化
      this.infoClassifyIndex = index
      this.infoScene_id = item.id
    } else if (item.level === 2) {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'infographic', 'createproject', 'infor-popup-change-type-index', index])
      this.infoSecondClassifyIndex = index
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
      this.infoType,
      this.infoPage,
      this.inputValue
    )
  }

  // 根据排序切换信息图
  changeInfoOrder(i, item) {
    this.infoPage = 1
    let order = item
    if (order == '最新模板') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'infographic', 'createproject', 'infor-popup-change-order', 1])
      this.infoOrder = 'date'
      this.infoOrderIndex = 0
    } else if (order == '最热模板') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'infographic', 'createproject', 'infor-popup-change-order', 2])
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
      this.infoType,
      this.infoPage,
      this.inputValue
    )
  }

  // 根据价格切换信息图
  changeInfoPrice(i, item) {
    this.infoPage = 1
    this.priceIndex = i
    if (item == '全部') {
      this.infoPrice = 'all'
    } else if (item == '会员') {
      this.infoPrice = 'lv1'
    } else if (item == '免费') {
      this.infoPrice = 'free'
    }
    this.infoFilterTemplates = []
    this.getByConditionsTemplates(
      this.infoScene_id,
      this.infoParent_id,
      this.infoLevel,
      this.infoOrder,
      this.infoPrice,
      this.infoType,
      this.infoPage,
      this.inputValue
    )
  }

  // 获取按条件筛选的列表
  getByConditionsTemplates(scene_id, parent_id, level, order, price, type, page: number = 1, tag: string = '') {
    this._http
      .get(
        `${this.infoConditionUrl}?scene_id=${scene_id}&parent_id=${parent_id}&level=${level}&order=${order}&price=${price}&type=${type}&tag=${tag}&pagenum=${page}`,
        this.httpOptions
      )
      .subscribe(async (data) => {
        if (data['resultCode'] === 1000) {
          this.showMasonryLoading = false
          this.infoFilterTemplates = this.infoFilterTemplates.concat(data['data']['list'])
          this.totalNum = data['data']['total']
          // 第一页没有数据 或者第一个数据不是空白模板
          if (page === 1 && (!this.infoFilterTemplates.length || this.infoFilterTemplates[0].title !== '空白模版')) {
            this.infoFilterTemplates.unshift({
              id: '',
              title: '空白模版',
              thumb: this.blankImg,
              price: 0,
            })
          }
          // 加载瀑布流
          const { data: aData, containerHeight } = await this._waterfallService.initWaterFall(this.infoFilterTemplates)
          this.showWaterfallArr = aData
          this.containerHeight = containerHeight
        }
      })
  }

  // 创建信息图副本模版 this.initialState.type
  createInfoTemplateHandle(e, item) {
    e.stopPropagation()
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'infographic', 'createproject', 'template-use'])

    if (this.userName) {
      // 判断是否可以创建
      const urla = `${this._api.getOldUrl()}/vis/dychart/fork/infographic/${item.id}`
      this._createProjectService.createProject(urla, 'infographic')
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  // 创建空白模版
  createEmptyTemplateHandle() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'infographic', 'createproject', 'template-use-blank'])

    if (this.userName) {
      let templateId = null
      const payload: ProjectModels.CreateProjectInfo = {
        title: '未命名',
        description: '',
        type: 'infographic',
        templateId: templateId,
        public: true,
        infoType: this.infoTypeName,
      }
      // 判断是否可以创建
      const urla = `${this._api.getOldUrl()}/vis/dychart/project`
      const returnCode = this._createProjectService.createProject(urla, 'infographic', payload)
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  // 信息图模版预览
  previewInfo(item) {
    if (item.id === '') {
      this.createEmptyTemplateHandle()
      return
    }
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'infographic', 'createproject', 'template-preview'])
    const tempPage = window.open('', '_blank')
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/templates/item?id=' + item.id
  }

  toggleLike(e, item) {
    e.stopPropagation()
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'infographic', 'createproject', 'template-like'])
    if (this.userName) {
      this.isLike = !this.isLike
      if (this.isLike) {
        this.isLikeText = '取消'
      } else {
        this.isLikeText = '收藏'
      }
      this._store.dispatch(
        new CaseActions.ToggleLikeCaseAction({
          type: 'infographic',
          caseid: item.id,
          islike: this.isLike ? 1 : 0,
        })
      )
      if (this.isLike) {
        jQuery(function ($) {
          const img = new Image()
          img.src = item.url
          img.classList.add('fly-item')
          img.onload = () => {
            const flyer = $(img)
            const target = $('.create-project .my li').eq(1)
            flyer.fly({
              start: {
                left: e.pageX,
                top: e.pageY,
              },
              end: {
                left: 71,
                top: 321,
                width: 0,
                height: 0,
              },
              speed: 1.2,
              onEnd: function () {
                flyer.remove()
                target.addClass('shake-animation')
                setTimeout(() => {
                  target.removeClass('shake-animation')
                }, 600)
                target.append('<div class="top-tips">+ 1</div>')
                $('.top-tips').addClass('top-tips-animation')
                setTimeout(() => {
                  $('.top-tips').remove()
                }, 1500)
              },
            })
          }
        })
      }
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  // 鼠标移入获取当前信息图详情，用来得知当前信息图的喜欢状态
  mouseEnterHandler(item, i) {
    this.hoverIndex = i
    this.getInfoDetailTimer = setTimeout(() => {
      this._store.dispatch(new CaseActions.GetProjectCaseDetailAction(item.id))
      this.infoDetailSubscription.add(
        this._store
          .select(fromRoot.getProjectCaseDetail)
          .pipe(filter((data) => !!data))
          .subscribe((data) => {
            this.isLike = data.islike
            if (this.isLike) {
              this.isLikeText = '取消'
            } else {
              this.isLikeText = '收藏'
            }
          })
      )
    }, 500)
  }

  coverHover(index) {
    this.hoverIndex = index
  }

  mouseLeaveHandler() {
    clearTimeout(this.getInfoDetailTimer)
    this.coverHover(-1)
  }

  ngOnDestroy(): void {
    this.forkInfoProject.unsubscribe()
    this.infoDetailSubscription.unsubscribe()
    this.getUserInfoSubscription.unsubscribe()
    this.allProjectScription.unsubscribe()
    this.infoSubscription.unsubscribe()
  }
}
