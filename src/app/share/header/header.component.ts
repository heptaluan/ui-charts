/*
 * @Description: 头部导航组件
 */
import { Component, OnInit, HostBinding, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../states/reducers';
import { Subscription } from 'rxjs/Subscription';
import { VipService } from '../../share/services/vip.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as UserActions from '../../states/actions/user.action';
import { UserInfo } from '../../states/models/user.model';
import { API } from '../../states/api.service';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../share/services/utils.service';
import { DataTransmissionService } from '../../share/services/data-transmission.service';

@Component({
  selector: 'lx-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // @HostBinding('class.d-flex') flex = true;
  // @HostBinding('class.justify-content-between') align = true;
  // @HostBinding('class.d-block') dBlock = true;
  // @HostBinding('class.mx-auto') mxAuto = true;

  userMenu: any[] = [];
  menuTag = 'userMenu';
  config: any;
  mySubscription = new Subscription();
  isVpl: string;
  vipLogo: string;
  bsModalRef: BsModalRef;
  userDropdownFlag: boolean = false;
  userName: string = '';
  userInfo: UserInfo;
  ver: number = 3;

  isChrome: boolean = true;
  isCloseTip: boolean = false;

  constructor(
    private route: Router,
    private _store: Store<fromRoot.State>,
    private _vipService: VipService,
    private _el: ElementRef,
    private _api: API,
    private _http: HttpClient,
    private _activatedRoute: ActivatedRoute,
    private _utilService: UtilsService,
    private _dataTransmissionService: DataTransmissionService
  ) {
    // 08-19 新增埋点转发
    const hmsr = this._activatedRoute.snapshot.queryParams.hmsr || '';
    const keyword = this._activatedRoute.snapshot.queryParams.semkeyword || '';
    const hmpl = this._activatedRoute.snapshot.queryParams.hmpl || '';
    const channelCode = this._activatedRoute.snapshot.queryParams.channelCode || '';
    if (hmsr || keyword || hmpl || channelCode) {
      const url = `${this._api.getOldUrl()}/vis/auth/users/me/?hmsr=${hmsr}&keyword=${keyword}&hmpl=${hmpl}&channelCode=${channelCode}`
      this._http.get(url, { withCredentials: true }).subscribe(res => {
        console.log(res)
      })
    } else {
      // app组件已请求无需重新拉起
      // this._store.dispatch(new UserActions.GetUserInfoAction());
    }
    this.mySubscription.add(
      this._store
        .select(fromRoot.getUserInfo)
        .filter(user => !!user)
        .subscribe(user => {
          this.config = {
            name: user.nickname || user.loginname,
            picture: user.avatar
          };
          this.userName = this.config.name;
          this.userMenu = ['项目管理', '我的账户', '会员/账单', '邀请有礼', '特权兑换', '退出'];
        })
    );
  }

  ngOnInit() {
    this.vipLogo = this._vipService.getVipLevel();
    window.addEventListener('click', this.allClick.bind(this));

    this.isChrome = this._utilService.getBrowserInfo() === 'Chrome' || this._utilService.getBrowserInfo() === 'Safari';
    this.isCloseTip = this._utilService.isCloseTip;

    // true 56 / false 8
    setTimeout(() => {
      if (this.isChrome) {
        this._dataTransmissionService.sendShowTip(false);
      } else {
        if (this.isCloseTip) {
          this._dataTransmissionService.sendShowTip(false);
        } else {
          this._dataTransmissionService.sendShowTip(true);
        }
      }
    }, 0);

    if (location.href.indexOf("/pages/help/list") > -1) {
      this.isCloseTip = true;
      this._utilService.isCloseTip = true;
    }
  }

  // 全局点击关闭用户下拉框，除了点击用户下拉框部分
  allClick() {
    var e = e || window.event;

    if (e.target !== this._el.nativeElement.querySelector('.no-click-area')
      && (this._el.nativeElement.querySelector('.user-dropdown') && !this._el.nativeElement.querySelector('.user-dropdown').contains(e.target))) {
      this.userDropdownFlag = false;
    }
  }

  mouseouthide() {
    this.userDropdownFlag = false;
  }

  userDropDown() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-btn-click']);
    this.userDropdownFlag = !this.userDropdownFlag;
  }

  handleVip() {
    this.route.navigate(['pages', 'home', 'bill']);
    window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-member-icon-click']);
  }

  // 去媒体查询页
  goMedia() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'homepage', 'menu', 'media']);
    const tempPage = window.open('', '_blank');
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/common/media';
  }

  goPrice() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'homepage', 'menu', 'member']);
    const tempPage = window.open('', '_blank');
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/home/price';
  }

  handleItemClick(text) {
    switch (text) {
      case '项目管理':
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-project-click']);

        this.route.navigate(['pages/home', 'project']);
        break;
      case '我的账户':
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-settings-click']);

        this.route.navigate(['pages', 'home', 'settings']);
        break;
      case '会员/账单':
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-vip-click']);

        this.route.navigate(['pages', 'home', 'bill']);
        break;
      case '邀请有礼':
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-invite-click']);

        this.route.navigate(['pages', 'home', 'invite']);
        break;
      case '特权兑换':
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-exchange-click']);

        if (window.location.href.indexOf('bill') > -1 ) {
          this._dataTransmissionService.sendExchange(2);
        } else {
          this.route.navigate(['pages', 'home', 'bill'], {queryParams: {id: 2}});
        }
        break;

      case '退出':
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-logout-click']);
        location.href = `${this._api.getOldUrl()}/vis/auth/logout`;
        break;
      default:
        break;
    }
  }

  login() {
    window['_hmt'].push(['_trackEvent', 'navigation', 'navi-head', 'navi-head-login']);
    // window.location.href = `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` + encodeURIComponent(`${window.location.href.split('#')[0]}#/pages/home/index`);
    window.location.href =
      `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
      encodeURIComponent(window.location.href.split('#')[0] + window.location.hash);
  }

  register() {
    window['_hmt'].push(['_trackEvent', 'navigation', 'navi-head', 'navi-head-reg']);
    if (window.location.href.indexOf('hmsr') > -1) {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?hmsr=${window.location.href.split('hmsr=')[1].split('&')[0]}&redirect=` +
        encodeURIComponent(`${window.location.href.split('#')[0]}#/pages/home/index`);
    } else {
      // window.location.href = `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` + encodeURIComponent(`${window.location.href.split('#')[0]}#/pages/home/index`);
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash);
    }
  }

  goExchange() {
    if (this.userName) {
      this.route.navigate(['pages', 'configuration', 'exchange']);
    } else {
      if (window.location.href.indexOf('hmsr') > -1) {
        location.href =
          `${this._api.getOldUrl()}/vis/auth/signin.html?hmsr=${window.location.href.split('hmsr=')[1].split('&')[0]}&redirect=` +
          encodeURIComponent(window.location.href.split('#')[0] + window.location.hash);
      } else {
        location.href =
          `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
          encodeURIComponent(window.location.href.split('#')[0] + window.location.hash);
      }
    }
  }

  // 关闭提示语
  closeTip() {
    this.isCloseTip = true;
    this._utilService.closeTip();
    this._dataTransmissionService.sendShowTip(!this.isCloseTip && !this.isChrome);
  }

  ngOnDestroy() {
    this.mySubscription.unsubscribe();
    window.removeEventListener('click', this.allClick.bind(this));
  }
}
