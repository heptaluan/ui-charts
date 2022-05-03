import { Component, OnInit } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs/Subscription'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import { DataDemandFeedbackComponent } from '../../../components/modals'
import { API } from '../../../states/api.service'
import { HttpService } from '../../../states/services'
import { dataCollect } from '../../../utils/buryPoint'

@Component({
  selector: 'lx-home-sidebar',
  templateUrl: './home-sidebar.component.html',
  styleUrls: ['./home-sidebar.component.scss'],
})
export class HomeSidebarComponent implements OnInit {
  userIsLogin: boolean = false
  isCollapsed: boolean = false
  isFavCollapsed: boolean = false
  userName: string
  mySubscription = new Subscription()

  showSideBar = [
    [
      {
        className: 'index',
        route: ['index'],
        name: '发现',
        collect: ['_trackEvent', 'navigation', 'navi-chart', 'navi-index'],
      },
      {
        className: 'chart-template',
        name: '图表模板',
        route: ['chart-template'],
        collect: ['_trackEvent', 'navigation', 'navi-chart', 'navi-chart-template'],
      },
      {
        className: 'info-template',
        name: '数据图文',
        route: ['info-template'],
        collect: ['_trackEvent', 'navigation', 'navi-chart', 'navi-info-template'],
      },
    ],
    [
      {
        className: 'project',
        route: ['project'],
        name: '项目',
        collect: ['_trackEvent', 'navigation', 'navi-chart', 'navi-project'],
      },
      {
        className: 'collect',
        name: '收藏',
        route: ['collect'],
        collect: ['_trackEvent', 'navigation', 'navi-chart', 'navi-collect'],
      },
      {
        className: 'data',
        name: '数据',
        route: ['data'],
        collect: ['_trackEvent', 'navigation', 'navi-chart', 'navi-data'],
      },
    ],
  ]

  loginUrl =
    `${this._api.getHost()}/auth/signin.html?redirect=` +
    encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
  registerUrl =
    `${this._api.getHost()}/auth/signin.html?redirect=` +
    encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)

  constructor(
    private _modalService: BsModalService,
    private _store: Store<fromRoot.State>,
    private _api: API,
    private _httpService: HttpService
  ) {
    this._api.getHost()
    this.mySubscription.add(
      this._store
        .select(fromRoot.getUserInfo)
        .filter((user) => !!user)
        .subscribe((user) => {
          this.userIsLogin = user.nickname || user.loginname ? true : false
        })
    )
  }

  ngOnInit() {}

  getUserLogin() {
    if (this._httpService.code === 2007) {
      location.href =
        `${this._api.getHost()}/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  showDataDemandFeedback() {
    this._modalService.show(DataDemandFeedbackComponent)
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe()
  }

  // 埋点统计
  dataCollectBaidu(arr) {
    dataCollect(arr)
  }
}
