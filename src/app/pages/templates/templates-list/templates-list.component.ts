import { Component, OnInit, ElementRef } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { Store } from '@ngrx/store'
import { HttpClient } from '@angular/common/http'

import * as fromRoot from '../../../states/reducers'
import * as _ from 'lodash'
import * as CaseActions from '../../../states/actions/project-case.action'

import { Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
import { DataDemandFeedbackComponent } from '../../../components/modals'

import { Router, ActivatedRoute } from '@angular/router'
import { VipService } from '../../../share/services/vip.service'
import { API } from '../../../states/api.service'
import { ToastrService } from 'ngx-toastr'
import { CreateProjectService } from '../../../share/services/create-project.service'

@Component({
  selector: 'lx-templates-list',
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.scss'],
})
export class TemplatesListComponent implements OnInit {
  inputValue
  public loading = false

  infoTemplates = []
  infoFilterTemplates = []
  infoTypeIndex = 0
  infoClassifyIndex = 0
  infoSecondClassifyIndex = 0
  infoFirstClassify = []
  infoSecondClassify = []
  infoOrderIndex = 0
  infoOrders = ['最新', '最热']
  priceMenu = ['全部', '会员', '免费']
  priceIndex: number = 0
  leftTitle = '图表'
  isLike: boolean = false
  orderDropDownflag: boolean = false
  dropDownFlag: boolean = false
  priceValue = 'all'
  orderValue = 'date'

  // 存储按条件筛选参数
  infoScene_id = 0
  infoParent_id = 0
  infoOrder = 'date'
  infoLevel = 1
  infoPrice = 'all'
  infoType = ''
  infoPage: number = 1
  keyword: string = ''
  updateMasonryLayout: boolean = false

  // 搜索结果
  isSearchResult: boolean = false

  // 用户名
  userName: string

  // 会员信息
  isVpl: string

  // 项目长度
  totalLength: number

  // 节流
  timer
  getInfoDetailTimer

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

  // 瀑布流配置
  // public myOptions: NgxMasonryOptions = {
  //   percentPosition: true,
  //   transitionDuration: '0s',
  //   gutter: 14
  // };

  constructor(
    private _store: Store<fromRoot.State>,
    private _http: HttpClient,
    private _activatedRoute: ActivatedRoute,
    private _el: ElementRef,
    private _modalService: BsModalService,
    private _vipService: VipService,
    private _api: API,
    private _createProjectService: CreateProjectService
  ) {
    this.allProjects$ = this._store.select(fromRoot.getAllProjectList)
  }

  ngOnInit() {
    // 接受 index 选择第几个分类
    const index = this._activatedRoute.snapshot.queryParams.index

    // 接受搜索值，并且搜索
    this.keyword = this._activatedRoute.snapshot.queryParams.keyword

    // 如果是单个类别进来就走单个请求的，如果整个过来就请求整体
    if (index) {
      this.infoClassifyIndex = Number(index)

      this.infoClassifyIndex = 0
      this.infoSecondClassifyIndex = parseInt((index % 10) + '')
      this.infoLevel = 1
      this.infoType = index
    }

    // 获取对应的场景列表（全部或者分类）
    this.getByConditionsTemplates(
      this.infoScene_id,
      this.infoParent_id,
      this.infoLevel,
      this.infoOrder,
      this.infoPrice,
      this.infoType
    )

    // 回到顶部
    window.scrollTo(0, 0)

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
    window.document.addEventListener('scroll', this.handleScroll.bind(this))
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

  // 滚动到底部加载
  handleScroll() {
    this.updateMasonryLayout = false
    setTimeout(() => {
      this.updateMasonryLayout = true
    }, 0)
    var e = e || window.event

    // 节流
    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(() => {
      const top = Math.round(document.documentElement.scrollTop)
      // 最大滚动距离
      var maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight - 10
      if (this.infoPage && top >= maxHeight) {
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
    }, 50)
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
    if (tag) {
      this.inputValue = tag
      this._http
        .get(
          `${this.infoConditionUrl}?scene_id=${this.infoScene_id}&parent_id=${this.infoParent_id}&level=${this.infoLevel}&order=${this.infoOrder}&price=${this.infoPrice}&type=${this.infoType}&tag=${tag}&pagenum=${this.infoPage}`
        )
        .subscribe((data) => {
          this.infoFilterTemplates = data['data']['list']
          if (data['data']['total'] === 0) {
            this.isSearchResult = true
          } else {
            this.isSearchResult = false
          }
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
      // 改变第一级的时候，第二级第三级第四级初始化
      this.infoClassifyIndex = index
      this.infoScene_id = item.id
    } else if (item.level === 2) {
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
    if (order == '最新') {
      this.infoOrder = 'date'
      this.infoOrderIndex = 0
    } else if (order == '最热') {
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
      .subscribe((data) => {
        this.updateMasonryLayout = false
        setTimeout(() => {
          this.updateMasonryLayout = true
        }, 500)
        if (data['resultCode'] === 1000) {
          if (data['data']['total'] === 0) {
            this.isSearchResult = true
          } else {
            this.isSearchResult = false
            this.infoFilterTemplates = this.infoFilterTemplates.concat(data['data']['list'])
          }
        }
      })
  }

  // 创建信息图副本模版 this.initialState.type
  createInfoTemplateHandle(item) {
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

  // 展开下拉
  extendDrop() {
    this.dropDownFlag = !this.dropDownFlag
  }

  extendOrderDrop() {
    this.orderDropDownflag = !this.orderDropDownflag
  }

  // 信息图模版预览
  previewInfo(e, item) {
    e.stopPropagation()
    const tempPage = window.open('', '_blank')
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/templates/item?id=' + item.id
  }

  toggleLike(e, item) {
    e.stopPropagation()
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

  // 鼠标移入获取当前信息图详情，用来得知当前信息图的喜欢状态
  mouseEnterHandler(item) {
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

  mouseLeavwHandler() {
    clearTimeout(this.getInfoDetailTimer)
  }

  ngOnDestroy(): void {
    this.forkInfoProject.unsubscribe()
    this.infoDetailSubscription.unsubscribe()
    this.getUserInfoSubscription.unsubscribe()
    this.allProjectScription.unsubscribe()
    window.document.removeEventListener('scroll', this.handleScroll)
  }
}
