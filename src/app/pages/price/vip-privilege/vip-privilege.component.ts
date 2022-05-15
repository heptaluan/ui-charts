import { Component, OnInit, ViewChild } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { TabsetComponent } from 'ngx-bootstrap'
import { ContactUsModalComponent } from '../../../components/modals/contact-us-modal/contact-us-modal.component'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import { VipService } from '../../../share/services/vip.service'
import { API } from '../../../states/api.service'
import { BusinessPriceComponent } from '../../../components/modals'

@Component({
  selector: 'lx-vip-privilege',
  templateUrl: './vip-privilege.component.html',
  styleUrls: ['./vip-privilege.component.scss'],
})
export class VipPrivilegeComponent implements OnInit {
  userName
  getUserInfoSubscription = new Subscription()
  company: false

  @ViewChild('staticTab') staticTab: TabsetComponent

  // 文案
  updateTip1: string = '马上体验'
  updateTip2: string = '马上升级'
  updateTip3: string = '马上升级'

  // 样式(false 为蓝色)
  update1Flag: boolean = false
  update2Flag: boolean = false
  update3Flag: boolean = false

  // 是否可以点击(true 表示可以点击)
  click1Flag = true
  click2Flag = true
  click3Flag = true

  isVpl: string = 'None'

  constructor(
    private _modalService: BsModalService,
    private _router: Router,
    private _store: Store<fromRoot.State>,
    private _acticeRoute: ActivatedRoute,
    private _vipService: VipService,
    private _api: API
  ) {}

  ngOnInit() {
    this.company = this._acticeRoute.snapshot.queryParams.company
    if (this.company) {
      this.staticTab.tabs[1].active = true
    } else {
      this.staticTab.tabs[0].active = true
    }
    // 判断用户登录
    this.getUserInfo()

    // 判断会员
    this.isVpl = this._vipService.getVipLevel()

    if (this.isVpl === 'None' || this.isVpl === 'eip1' || this.isVpl === 'eip2') {
      this.updateTip1 = '马上体验'
      this.updateTip2 = '马上升级'
      this.updateTip3 = '马上升级'
      this.update1Flag = false
      this.update2Flag = false
      this.update3Flag = false
      this.click1Flag = true
      this.click2Flag = true
      this.click3Flag = true
    } else if (this.isVpl === 'vip1') {
      this.updateTip1 = '马上体验'
      this.updateTip2 = '续费'
      this.updateTip3 = '马上升级'
      this.update1Flag = true
      this.update2Flag = false
      this.update3Flag = false
      this.click1Flag = false
      this.click2Flag = true
      this.click3Flag = true
    } else if (this.isVpl === 'vip2') {
      this.updateTip1 = '马上体验'
      this.updateTip2 = '马上升级'
      this.updateTip3 = '续费'
      this.update1Flag = true
      this.update2Flag = true
      this.update3Flag = false
      this.click1Flag = false
      this.click2Flag = false
      this.click3Flag = true
    } else {
      this.updateTip1 = '马上体验'
      this.updateTip2 = '马上升级'
      this.updateTip3 = '马上升级'
      this.update1Flag = false
      this.update2Flag = false
      this.update3Flag = false
      this.click1Flag = true
      this.click2Flag = true
      this.click3Flag = true
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

  // 跳转领取会员页面
  goExchange() {
    if (this.userName) {
      this._router.navigate(['pages', 'home', 'invite'])
    } else {
      if (window.location.href.indexOf('hmsr') > -1) {
        location.href =
          `${this._api.getOldUrl()}/vis/auth/signin.html?hmsr=${
            window.location.href.split('hmsr=')[1].split('&')[0]
          }&redirect=` + encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
      } else {
        location.href =
          `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
          encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
      }
    }
  }

  // 联系我们弹框 询价
  contactUs() {
    this._modalService.show(ContactUsModalComponent, {
      initialState: {
        content: '定制服务请联系biz@dyclub.org',
        title: {
          position: 'center',
          content: '提示',
          button: '确定',
        },
      },
    })
  }

  askPrice() {
    this._modalService.show(BusinessPriceComponent)
  }

  // 跳转升级
  rightGo(e, vipText) {
    if (this.userName) {
      if (vipText === 'None') {
        e.stopPropagation()
        this._router.navigate(['pages', 'home'])
      } else if (vipText === 'vip1') {
        e.stopPropagation()
        this._router.navigate(['pages', 'home', 'pay'], { queryParams: { pay: 0 } })
      }
    }
  }
}
