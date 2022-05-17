import { Component, OnInit, Input } from '@angular/core'
import { Subscription } from 'rxjs'

import * as fromRoot from '../../../states/reducers'
import * as CaseActions from '../../../states/actions/project-case.action'
import * as _ from 'lodash'

import { Store } from '@ngrx/store'
import { filter } from 'rxjs/operators'
import { Router } from '@angular/router'

import { BsModalService } from 'ngx-bootstrap'
import { VipService } from '../../../share/services/vip.service'
import { API } from '../../../states/api.service'
import { ToastrService } from 'ngx-toastr'
import { HttpClient } from '@angular/common/http'
import { CreateProjectService } from '../../../share/services/create-project.service'

@Component({
  selector: 'lx-templates-item',
  templateUrl: './templates-item.component.html',
  styleUrls: ['./templates-item.component.scss'],
})
export class TemplatesItemComponent implements OnInit {
  @Input() type
  @Input() list
  userName
  isVpl: string = ''

  // 信息图喜欢
  isLike: boolean = false

  // 配合百度统计
  num: number = 1

  getUserInfoSubscription = new Subscription()
  forkInfoProject = new Subscription()
  infoDetailSubscription = new Subscription()
  allProjectScription = new Subscription()

  // 总项目长度
  totalLength: number
  allProjects$

  itemStyles = {
    height: 'auto',
  }

  // 定时器
  timer

  constructor(
    private _store: Store<fromRoot.State>,
    private _router: Router,
    private _modalService: BsModalService,
    private _vipService: VipService,
    private _api: API,
    private toastr: ToastrService,
    private _http: HttpClient,
    private _createProjectService: CreateProjectService
  ) {
    this.allProjects$ = this._store.select(fromRoot.getAllProjectList)
  }

  ngOnInit() {
    // 获取分类对应的数字
    this.getNumByType()

    // 获取会员
    this.isVpl = this._vipService.getVipLevel()

    // 获取项目长度
    this.allProjectScription.add(
      this.allProjects$.subscribe((list) => {
        this.totalLength = list.length
      })
    )

    // 获取登录信息
    this.getUserInfo()
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

  // 获取分类对应的数字
  getNumByType() {
    // 配合百度统计
    switch (this.type) {
      case '微信公众号首图':
        this.num = 1
        break
      case '微博焦点图片':
        this.num = 2
        break
      case '头条号首图':
        this.num = 3
        break
      case '正文配图（横版）':
        this.num = 4
        break
      case '正文配图（方形）':
        this.num = 5
        break
      case '正文配图（竖版）':
        this.num = 6
        break
      case '图表报告':
        this.num = 7
        break
      case '工作报告':
        this.num = 8
        break
      case '手机海报':
        this.num = 9
        break
      case '简历':
        this.num = 10
        break
      case '新闻长图':
        this.num = 11
        break
      default:
        break
    }
  }

  // 创建信息图
  createInfo() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'templatecenter', 'template-index', 'template-index-use-byType', this.num])

    if (this.userName) {
      // 判断是否可以创建
      const urla = `${this._api.getOldUrl()}/vis/dychart/fork/infographic/${this.list.id}`
      this._createProjectService.createProject(urla, 'infographic')
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  // 信息图模版预览
  previewInfo(e, item) {
    e.stopPropagation()
    // 百度统计
    window['_hmt'].push([
      '_trackEvent',
      'templatecenter',
      'template-index',
      'template-index-preview-click-byType',
      this.num,
    ])
    const tempPage = window.open('', '_blank')
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/templates/item?id=' + item.id
  }

  toggleLike(e, item) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'templatecenter', 'template-index', 'template-index-like-byType', this.num])
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
    this.timer = setTimeout(() => {
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
    clearTimeout(this.timer)
  }

  ngOnDestroy() {
    this.getUserInfoSubscription.unsubscribe()
    this.infoDetailSubscription.unsubscribe()
    this.forkInfoProject.unsubscribe()
  }
}
