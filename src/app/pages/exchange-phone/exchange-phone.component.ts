import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { API } from '../../states/api.service';
import * as fromRoot from '../../states/reducers';

@Component({
  selector: 'lx-exchange-phone',
  templateUrl: './exchange-phone.component.html',
  styleUrls: ['./exchange-phone.component.scss']
})
export class ExchangePhoneComponent implements OnInit {

  isShowTip = false;
  isLogin = false;
  getUserInfoSubscription = new Subscription();
  showName = "";
  user;
  exchangeCode = '';
  errorMsg = '';
  isShowModal = false;
  days: number = 0;
  // 跨域允许
  httpOptions = { withCredentials: true };
  isShowRegisterModal = false;


  constructor(
    private _store: Store<fromRoot.State>,
    private _api: API,
    private _http: HttpClient,
    ) { }

  ngOnInit() {
    let param = this.formatUrl(location.href)
    if (param && param["register"] && param["register"] === "true") {
      this.showRegisterModal(true);
    }
    
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) || /(Android)/i.test(navigator.userAgent)) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
      // 加载 rem 布局
      (function (designWidth, maxWidth) {
        var doc = document,
          win = window,
          docEl = doc.documentElement,
          remStyle = document.createElement('style'),
          tid;

        function refreshRem() {
          var width = docEl.getBoundingClientRect().width;
          maxWidth = maxWidth || 540;
          width > maxWidth && (width = maxWidth);
          var rem = width * 100 / designWidth; 
          remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
        }

        if (docEl.firstElementChild) {
          docEl.firstElementChild.appendChild(remStyle);
        } else {
          var wrap = doc.createElement('div');
          wrap.appendChild(remStyle);
          doc.write(wrap.innerHTML);
          wrap = null;
        }
        // 要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
        refreshRem();

        win.addEventListener('resize', function () {
          // 防止执行两次
          clearTimeout(tid);
          tid = setTimeout(refreshRem, 300);
        }, false);

        win.addEventListener('pageshow', function (e) {
          // 浏览器后退的时候重新计算
          if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
          }
        }, false);

        if (doc.readyState === 'complete') {
          doc.body.style.fontSize = '16px';
        } else {
          doc.addEventListener('DOMContentLoaded', function (e) {
            doc.body.style.fontSize = '16px';
          }, false);
        }
      })(750, 750);

    }  
    this.getUserLogin()
    let that = this;
    document.removeEventListener('touchmove',this.touchmoveEvent.bind(this), ({
      passive: false
    }) as any); 
  }

  ngOnDestroy() {
    this.getUserInfoSubscription.unsubscribe()
    this.isShowTip = false;
  }

  loadRem() {
    (function (doc, win) {
      var docEl = doc.documentElement,
        resizeEvt =
        "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function () {
          var clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          if (clientWidth >= 750) {
            docEl.style.fontSize = "100px";
          } else {
            docEl.style.fontSize = 100 * (clientWidth / 750) + "px";
          }
        };
  
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener("DOMContentLoaded", recalc, false);
    })(document, window);
  }

  showTip(flag) {
    this.isShowTip = flag;
  }

  getUserLogin() {
    this.getUserInfoSubscription.add(this._store.select(fromRoot.getUserInfo).filter(user => !!user).subscribe(user => {
      let userName = user.nickname || user.loginname;
      if (!userName) {
        this.isLogin = false;
      } else {
        this.isLogin = true;
        this.user = user;
        this.showName = userName.length > 9 ? userName.substring(0,9) + "…" : userName;
    
      }
    }))
  }

  link(flag) {
    if(flag) {
      window.location.href = `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=`+ encodeURIComponent(`${window.location.href.split('#')[0]}#/pages/exchange`);;
    } else {
      location.href = `${this._api.getOldUrl()}/vis/auth/logout`;
    }
  }

  exchange() {
    if (!this.exchangeCode.trim()) {
      this.errorMsg = '兑换码不能为空';
      return;
    } else {
      this.errorMsg = '';
    }
    let data = {
      code: this.exchangeCode,
      action: 'active'
    }
    let url = `${this._api.getOldUrl()}/vis/biz/vip_code_rights/`;
    this._http.post(url, data, this.httpOptions)
      .subscribe(data => {
        if (data['resultCode'] === 2022) {
          this.errorMsg = '兑换码错误或已失效';
        } else if (data['resultCode'] === 2024){
          this.errorMsg = '您已使用过该兑换码';
        } else if (data['resultCode'] === 1000){
          this.errorMsg = '';
          this.days = data["data"]["days"]
          this.showModal(true);
        }
      })
  }

  showModal(flag) {
    this.isShowModal = flag; 
  }

  showRegisterModal(flag) {
    this.isShowRegisterModal = flag;
  }

  formatUrl(url) {
    const param = {};
    url.replace(/[?&](.*?)=([^&]*)/g, (m, $1, $2) => param[$1] = $2);
    return param;
  }

  linkTo(url) {
    if (`${window.location.href.split('#')[0]}#${url}` === window.location.href) {
      location.reload();
      return;
    }
    location.href = `${window.location.href.split('#')[0]}#${url}`;
  }

  touchmoveEvent (event) { //监听滚动事件
    console.log("exchange",this.isShowTip);
    if (this.isShowTip) {
      event.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
    } else {
      window.event.returnValue = true
    }
  }
} 
