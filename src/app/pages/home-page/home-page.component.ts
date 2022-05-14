import { Component, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter, ElementRef } from '@angular/core'
import { CaseType } from './generate-case/generate-case.component'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { BsModalService } from 'ngx-bootstrap/modal'
import {
  InitializeProjectComponent,
  ProjectSizeLimitComponent,
  UpgradeMemberComponent,
  DataDemandFeedbackComponent,
  MobileDychartModelComponent,
} from '../../components/modals'
import { GetChartTemplateListAction } from '../../states/actions/template.action'

import { Store } from '@ngrx/store'
import * as TemplateActions from '../../states/actions/template.action'
import * as CaseActions from '../../states/actions/project-case.action'
import * as fromRoot from '../../states/reducers'
import { Subscription, Observable } from 'rxjs'
import { VipService } from '../../share/services/vip.service'
import { debounceTime, map } from 'rxjs/operators'
import { UtilsService } from '../../share/services/utils.service'
import { ScrollService } from '../../share/services/scroll.service'
import { API } from '../../states/api.service'
import { DataTransmissionService } from '../../share/services/data-transmission.service'
import * as UserActions from '../../states/actions/user.action'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'lx-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  @ViewChild('contentScroll') contentScroll: ElementRef

  browserType: string = ''
  isLogin: boolean = false

  show = true

  changeWidth
  contentStyle

  isShowBackTop: boolean = false

  isShowFloatBar: boolean = true

  isIframe = false

  isShowTip: boolean = true
  isShowHeaderTip: boolean = false

  onActivate(evt) {
    this.show = false
  }

  onDeactive(evt) {
    this.show = true
  }

  limited: boolean = true
  info: CaseType
  chart: CaseType
  initSearch: string = ''
  mySubscription = new Subscription()
  getUserInfoSubscription = new Subscription()
  projectTotal
  userName: string
  isMobile: boolean = false

  constructor(
    private _store: Store<fromRoot.State>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private _vipService: VipService,
    private _dataTransmissionService: DataTransmissionService,
    private _utilService: UtilsService,
    private _scrollService: ScrollService,
    private _api: API,
    private _http: HttpClient
  ) {
    this.chart = {
      title: '新建图表',
      tag: 'chart',
      picture: '/dyassets/images/add-chart.jpg',
      hover: '/dyassets/images/add-chart-hover.jpg',
    }

    this.info = {
      title: '新建信息图',
      tag: 'infographic',
      picture: '/dyassets/images/add-info.jpg',
      hover: '/dyassets/images/add-info-hover.jpg',
    }
  }

  ngOnInit() {
    let isChrome = this._utilService.getBrowserInfo() === 'Chrome' || this._utilService.getBrowserInfo() === 'Safari'
    let isCloseTip = this._utilService.isCloseTip
    this.isShowTip = !isCloseTip && !isChrome

    this._dataTransmissionService.getShowTip().subscribe((res) => {
      this.isShowTip = res
    })

    // 请求图表
    this._store.dispatch(new GetChartTemplateListAction())

    this._store.dispatch(new TemplateActions.SetProjectCurrentTemplateTypeAction(this.info.tag))

    this.resetWidth()

    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) || /(Android)/i.test(navigator.userAgent)) {
      this.isMobile = true
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      window.scrollTo(0, 0)

      // 08-19 新增埋点转发
      const hmsr = this.activatedRoute.snapshot.queryParams.hmsr || ''
      const keyword = this.activatedRoute.snapshot.queryParams.semkeyword || ''
      const hmpl = this.activatedRoute.snapshot.queryParams.hmpl || ''
      const channelCode = this.activatedRoute.snapshot.queryParams.channelCode || ''
      if (hmsr || keyword || hmpl || channelCode) {
        const url = `${this._api.getOldUrl()}/vis/auth/users/me/?hmsr=${hmsr}&keyword=${keyword}&hmpl=${hmpl}&channelCode=${channelCode}`
        this._http.get(url, { withCredentials: true }).subscribe((res) => {
          console.log(res)
        })
      } else {
        // app组件已请求无需重新拉起
        // this._store.dispatch(new UserActions.GetUserInfoAction());
      }

      // 加载 rem 布局
      ;(function (designWidth, maxWidth) {
        var doc = document,
          win = window,
          docEl = doc.documentElement,
          remStyle = document.createElement('style'),
          tid

        function refreshRem() {
          var width = docEl.getBoundingClientRect().width
          maxWidth = maxWidth || 540
          width > maxWidth && (width = maxWidth)
          var rem = (width * 100) / designWidth
          remStyle.innerHTML = 'html{font-size:' + rem + 'px;}'
        }

        if (docEl.firstElementChild) {
          docEl.firstElementChild.appendChild(remStyle)
        } else {
          var wrap = doc.createElement('div')
          wrap.appendChild(remStyle)
          doc.write(wrap.innerHTML)
          wrap = null
        }
        // 要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
        refreshRem()

        win.addEventListener(
          'resize',
          function () {
            // 防止执行两次
            clearTimeout(tid)
            tid = setTimeout(refreshRem, 300)
          },
          false
        )

        win.addEventListener(
          'pageshow',
          function (e) {
            // 浏览器后退的时候重新计算
            if (e.persisted) {
              clearTimeout(tid)
              tid = setTimeout(refreshRem, 300)
            }
          },
          false
        )

        if (doc.readyState === 'complete') {
          doc.body.style.fontSize = '16px'
        } else {
          doc.addEventListener(
            'DOMContentLoaded',
            function (e) {
              doc.body.style.fontSize = '16px'
            },
            false
          )
        }
      })(750, 750)
    }

    Observable.fromEvent(window, 'resize')
      .pipe(
        debounceTime(100) // 加点去抖，毕竟 `resize` 频率非常高
      )
      .subscribe((event) => {
        this.resetWidth()
        this.isShowFloatBar = document.documentElement.clientWidth > 1270
      })

    this.getLoginState()
    this.getUserLogin()

    if (window.self !== window.top) {
      this.isIframe = true
    }

    document.addEventListener('touchmove', this.touchmoveEvent.bind(this), {
      capture: false,
      passive: false,
    } as any)
  }

  ngAfterViewInit(): void {
    if (this.contentScroll) {
      this.contentScroll.nativeElement.addEventListener('scroll', this.handleScroll.bind(this))
    }
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe()
    this.getUserInfoSubscription.unsubscribe()
    this.isShowHeaderTip = false
  }

  // 获取登录状态
  getLoginState() {
    if (!this.isMobile) {
      this.setloginByurl(this.router.url.split('/home/')[1])
    }

    this.router.events.subscribe((data) => {
      if (!this.contentScroll) return
      this.contentScroll.nativeElement.scrollTo(0, 0)
      this.isLogin = false
      if (!this.isMobile && data instanceof NavigationEnd) {
        this.setloginByurl(data.url.split('/home/')[1])
      }
    })
  }

  getUserLogin() {
    this.getUserInfoSubscription.add(
      this._store
        .select(fromRoot.getUserInfo)
        .filter((user) => !!user)
        .subscribe((user) => {
          this.userName = user.nickname || user.loginname
          if (!this.userName) {
            this.isLogin = false
          } else {
            this.isLogin = true
          }
        })
    )
  }

  setloginByurl(url) {
    if (url === 'project' || url === 'collect' || url === 'data') {
      this.getUserInfoSubscription.add(
        this._store
          .select(fromRoot.getUserInfo)
          .filter((user) => !!user)
          .subscribe((user) => {
            if (user.nickname || user.loginname) {
              this.isLogin = true
            }
          })
      )
    } else {
      this.isLogin = true
    }
  }

  handleScroll() {
    var e = e || window.event
    const top = Math.round(e.target.scrollTop)
    // 最大滚动距离
    var maxHeight = e.target.scrollHeight - e.target.clientHeight - 10
    let flag = top >= maxHeight

    this._scrollService.sendCollectScroll(flag)
    this._scrollService.sendInfoScroll(flag)

    if (top >= 500) {
      this.isShowBackTop = true
    } else {
      this.isShowBackTop = false
    }
  }

  initializeProject(fromTemplate?: number) {
    if (!this.limited) {
      // 1 单图，空 信息图
      if (fromTemplate === 1) {
        this.modalService.show(InitializeProjectComponent, {
          initialState: {
            fromTemplate: fromTemplate ? fromTemplate : 0,
            fromType: this.chart.tag,
            isVip: this._vipService.isVip(),
          },
        })
      } else {
        this.modalService.show(InitializeProjectComponent, {
          initialState: {
            fromTemplate: fromTemplate ? fromTemplate : 0,
            fromType: this.info.tag,
            isVip: this._vipService.isVip(),
          },
        })
      }
    } else {
      if (this._vipService.isVip()) {
        this.modalService.show(ProjectSizeLimitComponent)
      } else {
        this.modalService.show(UpgradeMemberComponent)
      }
    }
  }

  resetWidth() {
    if (window.self !== window.top) {
      this.contentStyle = {
        width: innerWidth + 'px',
        height: innerHeight + 'px',
      }
      // 如果在 iframe 当中，预加载 noto 字体
      this.preLoad()
    } else {
      let nowWidth = document.documentElement.clientWidth
      let nowHeight = document.documentElement.clientHeight
      if (nowWidth > 1263) {
        this.changeWidth = Math.floor(nowWidth - 63) + 'px'
      } else {
        this.changeWidth = '1200px'
      }
      this.contentStyle = {
        height: nowHeight - 60 + 'px',
      }
    }
  }

  search(evt) {
    this._store.dispatch(new CaseActions.SetProjectCaseSearchAction(evt))
  }

  // 预加载字体
  preLoad() {
    const preloadLink = document.createElement('link')
    preloadLink.href = 'https://ss1.dydata.io/Noto-Sans-Regular.ttf'
    preloadLink.rel = 'preload'
    preloadLink['as'] = 'font'
    preloadLink.type = 'font/ttf'
    document.head.appendChild(preloadLink)
  }

  // 模板需求弹窗
  demand() {
    if (this.userName) {
      this.modalService.show(DataDemandFeedbackComponent, {
        initialState: {
          title: '模板需求反馈',
          type: 'template',
          yourRequest: '请描述你的需求',
        },
      })
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  // 跳转注册页面
  linkRedirect() {
    if (!this.isLogin) {
      window.location.href =
        'https://dycharts.com/vis/auth/signin.html?redirect=https%3A%2F%2Fdycharts.com%2Fappv2%2F%23%2Fpages%2Fhome%2Findex'
    } else {
      this.showModel()
    }
  }

  showModel() {
    this.modalService.show(MobileDychartModelComponent)
  }

  linkRegister() {
    window.location.href = `${this._api.getOldUrl()}/vis/auth/signin.html`
  }

  showHeaderTip(flag) {
    this.isShowHeaderTip = flag
  }

  link(flag) {
    if (flag) {
      location.href = `${this._api.getOldUrl()}/vis/auth/signin.html`
    } else {
      location.href = `${this._api.getOldUrl()}/vis/auth/logout`
    }
  }

  linkTo(url) {
    if (`${window.location.href.split('#')[0]}#${url}` === window.location.href) {
      location.reload()
      return
    }
    window.location.href = `${window.location.href.split('#')[0]}#${url}`
  }

  touchmoveEvent(event) {
    //监听滚动事件
    if (this.isShowHeaderTip) {
      event.preventDefault() //阻止默认的处理方式(阻止下拉滑动的效果)
    } else {
      window.event.returnValue = true
    }
  }
}
