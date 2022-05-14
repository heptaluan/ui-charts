import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs'
import { API } from '../../states/api.service'
import * as fromRoot from '../../states/reducers'

@Component({
  selector: 'lx-index-introduce',
  templateUrl: './index-introduce.component.html',
  styleUrls: ['./index-introduce.component.scss'],
})
export class IndexIntroduceComponent implements OnInit {
  isShowTip = false
  isLogin = false
  getUserInfoSubscription = new Subscription()

  constructor(private _api: API, private _store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.getUserLogin()

    document.addEventListener('touchmove', this.touchmoveEvent.bind(this), {
      passive: false,
    } as any)
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) || /(Android)/i.test(navigator.userAgent)) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      window.scrollTo(0, 0)
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
  }

  linkRegister() {
    window.location.href = `${this._api.getOldUrl()}/vis/auth/signin.html`
  }

  getUserLogin() {
    this.getUserInfoSubscription.add(
      this._store
        .select(fromRoot.getUserInfo)
        .filter((user) => !!user)
        .subscribe((user) => {
          let userName = user.nickname || user.loginname
          if (!userName) {
            this.isLogin = false
          } else {
            this.isLogin = true
          }
        })
    )
  }

  ngOnDestroy() {
    this.getUserInfoSubscription.unsubscribe()
    this.isShowTip = false
  }

  showTip(flag) {
    this.isShowTip = flag
  }

  linkTo(url) {
    if (`${window.location.href.split('#')[0]}#${url}` === window.location.href) {
      location.reload()
      return
    }
    location.href = `${window.location.href.split('#')[0]}#${url}`
  }

  link(flag) {
    if (flag) {
      location.href = `${this._api.getOldUrl()}/vis/auth/signin.html`
    } else {
      location.href = `${this._api.getOldUrl()}/vis/auth/logout`
    }
  }

  touchmoveEvent(event) {
    //监听滚动事件
    if (this.isShowTip) {
      event.preventDefault() //阻止默认的处理方式(阻止下拉滑动的效果)
    } else {
      window.event.returnValue = true
    }
  }
}
