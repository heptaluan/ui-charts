import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../states/reducers'
import { API } from '../../states/api.service'
import * as UserActions from '../../states/actions/user.action'

@Component({
  selector: 'lx-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
})
export class InvitationComponent implements OnInit {
  timer
  day
  dayOne: number = 0
  dayTwo: number = 0
  hour
  hourOne: number = 0
  hourTwo: number = 0
  min
  minOne: number = 0
  minTwo: number = 0
  s
  sOne: number = 0
  sTwo: number = 0

  isInvited: boolean = false
  userName

  loopTop: number = 0
  loopTimer
  loopFlag: boolean = true

  getUserInfoSubscription = new Subscription()

  // 活动展示页数据
  dataList = [
    {
      avatar: 'https://ss1.dydata.io//oldAvatar/1.jpg',
      name: '追***月',
      desc: '无线蓝牙音箱',
    },
    {
      avatar: 'https://ss1.dydata.io//oldAvatar/2.jpg',
      name: '因***乎',
      desc: '1周会员',
    },
    {
      avatar: 'https://ss1.dydata.io//oldAvatar/3.jpg',
      name: '薰***泪',
      desc: '1周会员',
    },
    {
      avatar: 'https://ss1.dydata.io//oldAvatar/4.jpg',
      name: '无***烟',
      desc: '镝数定制U盘',
    },
    {
      avatar: 'https://ss1.dydata.io//oldAvatar/5.jpg',
      name: '无***败',
      desc: '1个月高级会员',
    },
    {
      avatar: 'https://ss1.dydata.io//oldAvatar/6.jpg',
      name: '逝***华',
      desc: '1周会员',
    },
    {
      avatar: 'https://ss1.dydata.io//oldAvatar/7.jpg',
      name: '似***昔',
      desc: '小米蓝牙耳机',
    },
    {
      avatar: 'https://ss1.dydata.io//oldAvatar/8.jpg',
      name: '南***草',
      desc: '1个月高级会员',
    },
    {
      avatar: 'https://ss1.dydata.io//oldAvatar/9.jpg',
      name: '那***美',
      desc: '1个月高级会员',
    },
    {
      avatar: 'https://ss1.dydata.io//oldAvatar/10.jpg',
      name: '此***开',
      desc: '网易严选U型枕',
    },
  ]

  constructor(private _router: Router, private _store: Store<fromRoot.State>, private _api: API) {
    this._store.dispatch(new UserActions.GetUserInfoAction())
  }

  ngOnInit() {
    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2#/pages/invitation']);

    this.getUserInfo()
    this.go()
    this.timer = setInterval(this.go.bind(this), 1000)
    this.loopTimer = setInterval(this.loopData.bind(this), 2000)
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

  // 时间要向下取整避免小数
  go() {
    var time1 = new Date() // 获取当前时间 获取的市 1970 年 1 年 1 月日到现在的毫秒数（每一次变化都要重新获取当前时间）
    var time2 = new Date(2019, 2, 17, 23, 59, 59) // 设置需要到达的时间 也是获取的毫秒数
    var conS = Math.floor((time2.getTime() - time1.getTime()) / 1000) // 获得差值除以 1000 转为秒
    this.day = this.totwo(Math.floor(conS / 86400)) // 差值 /60/60/24 获取天数
    this.hour = this.totwo(Math.floor((conS % 86400) / 3600)) // 取余 /60/60 获取时(取余是获取conS对应位置的小数位)
    this.min = this.totwo(Math.floor(((conS % 86400) % 3600) / 60)) // 取余 /60 获取分
    this.s = this.totwo(Math.floor(conS % 60)) // 取总秒数的余数
    this.dayOne = this.day / 10 >= 1 ? Math.floor(this.day / 10) : 0
    this.dayTwo = this.day % 10
    this.hourOne = this.hour / 10 >= 1 ? Math.floor(this.hour / 10) : 0
    this.hourTwo = this.hour % 10
    this.minOne = this.min / 10 >= 1 ? Math.floor(this.min / 10) : 0
    this.minTwo = this.min % 10
    this.sOne = this.s / 10 >= 1 ? Math.floor(this.s / 10) : 0
    this.sTwo = this.s % 10
    if (conS < 0) {
      // 执行功能时要清除时间函数
      clearInterval(this.timer)
      this.dayOne = 0
      this.dayTwo = 0
      this.hourOne = 0
      this.hourTwo = 0
      this.minOne = 0
      this.minTwo = 0
      this.sOne = 0
      this.sTwo = 0
      this.isInvited = true
    }
  }

  // 如果取得的数字为个数则在其前面增添一个 0
  totwo(e) {
    return e < 10 ? '0' + e : '' + e
  }

  // 循环函数
  loopData() {
    this.loopFlag = true
    this.loopTop = -95 + this.loopTop
    if (this.loopTop === -950) {
      this.loopTop = 0
      this.loopFlag = false
    }
  }

  goPerson() {
    if (this.userName) {
      if (this.isInvited) {
        return
      } else {
        this._router.navigate(['/pages', 'configuration', 'invite'])
      }
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  goPrice() {
    this._router.navigate(['pages', 'price', 'index'])
  }

  ngOnDestroy(): void {
    clearInterval(this.timer)
    clearInterval(this.loopTimer)
  }
}
