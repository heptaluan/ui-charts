/*
 * @Description: 个人设置页面
 */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../states/reducers'
import * as UserActions from '../../states/actions/user.action'

import { Observable } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'
import { UtilsService } from '../../share/services/utils.service'

@Component({
  selector: 'lx-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit, AfterViewInit {
  @ViewChild('menuItems') menuItems
  changeWidth
  changeHeight

  browserType: string = ''
  isChrome: boolean = true
  isCloseTip: boolean = false

  menuList = [
    { title: '个人设置', path: 'settings' },
    { title: '安全设置', path: 'security' },
    { title: '我的会员', path: 'plan' },
    { title: '我的账单', path: 'bill' },
    { title: '特权兑换', path: 'exchange' },
    { title: '邀请有礼', path: 'invite' },
  ]

  constructor(
    private router: Router,
    private activedRouter: ActivatedRoute,
    private _store: Store<fromRoot.State>,
    private _utilService: UtilsService
  ) {
    router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((info: NavigationEnd) => {
        this.activeMenu(info.url)
      })
  }

  ngOnInit() {
    // this._store.dispatch(new UserActions.GetUserBillAction());

    // 判断谷歌浏览器
    this.isChrome = this._utilService.getBrowserInfo() === 'Chrome' || this._utilService.getBrowserInfo() === 'Safari'
    this.isCloseTip = this._utilService.isCloseTip

    // 初始化导航栏宽度
    this.resetWidth()

    // 改变窗口大小实时改变导航栏宽度
    Observable.fromEvent(window, 'resize')
      .pipe(
        debounceTime(100) // 加点去抖，毕竟 `resize` 频率非常高
      )
      .subscribe((event) => {
        this.resetWidth()
      })
  }

  ngAfterViewInit() {
    const url = this.router.url
    this.activeMenu(url)
  }

  // 重新设置导航栏宽度
  resetWidth() {
    let nowWidth = document.documentElement.clientWidth
    let nowHeight = document.documentElement.clientHeight
    if (nowWidth > 1263) {
      this.changeWidth = Math.floor(nowWidth - 63) + 'px'
    } else {
      this.changeWidth = '1200px'
    }
    this.changeHeight = nowHeight - 60 + 'px'
  }

  // 关闭提示语
  closeTip() {
    this.isCloseTip = true
    this._utilService.closeTip()
  }

  activeMenu(url) {
    const pathArr = url.split('/')
    const path = pathArr[pathArr.length - 1]
    if (
      !this.menuItems ||
      !this.menuItems.nativeElement.children ||
      this.menuItems.nativeElement.children.length === 0
    ) {
      return
    }
    for (const item of this.menuItems.nativeElement.children) {
      item.classList.remove('active')
    }
    let i = 0
    for (const item of this.menuList) {
      if (item.path === path) {
        this.menuItems.nativeElement.children[i].classList.add('active')
        break
      }
      i++
    }
  }

  listenFromChild(msg: string) {
    if (msg === '[Router] Go To Member') {
      this.onMenuClicked(undefined, 3)
    }
  }

  onMenuClicked(e, index) {
    switch (index) {
      case 0:
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'navigation', 'navi-me', 'navi-my-settings'])
        break
      case 1:
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'navigation', 'navi-me', 'navi-my-security'])
        break
      case 2:
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'navigation', 'navi-me', 'navi-my-membership'])
        break
      case 3:
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'navigation', 'navi-me', 'navi-my-bill'])
        break
      case 4:
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'navigation', 'navi-me', 'navi-my-invite'])
        break
      default:
        break
    }
    for (const item of this.menuItems.nativeElement.children) {
      item.classList.remove('active')
    }
    this.menuItems.nativeElement.children[index].classList.add('active')
    this.router.navigate(['pages', 'configuration', this.menuList[index].path])
  }
}
