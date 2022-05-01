import { Component, OnInit, OnDestroy } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import {
  CreateProjectModalComponent,
  UploadDataModalComponent,
  ContactUsModalComponent,
} from '../../../components/modals'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import { Subscription } from 'rxjs'
import * as ProjectActions from '../../../states/actions/project.action'
import { Router } from '@angular/router'
import { VipService } from '../../../share/services/vip.service'
import { DataTransmissionService } from '../../../share/services/data-transmission.service'
import { API } from '../../../states/api.service'
import { CreateProjectService } from '../../../share/services/create-project.service'

@Component({
  selector: 'lx-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit, OnDestroy {
  mySubscription = new Subscription()
  getTemplateListSubscription = new Subscription()
  chartTemplates = []
  forkChartProject = new Subscription()
  forkInfoProject = new Subscription()
  allProjectScription = new Subscription()
  infoTemplates
  totalTemplates
  allProjects$
  totalLength: number // 信息图与单图总长度
  userName: string // 用户名字（判断登录）

  dataHtml = '搜索想要的数据<p>一键编辑图表</p>'
  blankHtml = '输入或粘贴你的数据<p>快速生成图表</p>'
  uploadHtml = '上传Excel/CSV文件<p>编辑制作图表</p>'
  isVpl: string = ''

  // 跨域允许
  httpOptions = { withCredentials: true }

  constructor(
    private modalService: BsModalService,
    private _store: Store<fromRoot.State>,
    private _router: Router,
    private _vipService: VipService,
    private _dataTransmissionService: DataTransmissionService,
    private _api: API,
    private _createProjectService: CreateProjectService
  ) {
    this.allProjects$ = this._store.select(fromRoot.getAllProjectList)
  }

  ngOnInit() {
    // 判断是否会员
    this.isVpl = this._vipService.getVipLevel()

    // 判断是否登录
    this.getUserInfo()

    // 获取 template 列表
    this.getChartList()

    // 获取信息图列表
    this.getInfoList()

    // 获取全部项目数
    this.allProjectScription.add(
      this.allProjects$.subscribe((list) => {
        this.totalLength = list.length
      })
    )
  }

  // 获取用户信息（判断是否登录）
  getUserInfo() {
    this.mySubscription.add(
      this._store
        .select(fromRoot.getUserInfo)
        .filter((user) => !!user)
        .subscribe((user) => {
          this.userName = user.nickname || user.loginname
        })
    )
  }

  getChartList() {
    this.chartTemplates = [
      {
        title: '基础柱状图',
        thumb: 'https://image.dydata.io/S9mQy7TtDPRefubPR9f5hY.jpg?imageView2/2/w/500/quality/90',
        templateId: '444734748594536323',
        isFree: true,
      },
      {
        title: '弦图',
        thumb: 'https://image.dydata.io/3uFuFuK93wbDeDDuTLwDwY.jpg?imageView2/2/w/500/quality/90',
        templateId: '5544734748594536500',
        isFree: true,
      },
      {
        title: '桑基图',
        thumb: 'https://image.dydata.io/GAn9rzy6Hyg9PJTjc2RToc.jpg?imageView2/2/w/500/quality/90',
        templateId: '5543733748594536504',
        isFree: true,
      },
      {
        title: '词云图',
        thumb: 'https://image.dydata.io/7cGzb2aZxoeV6oVRiUnFcf.png?imageView2/2/w/500/quality/90',
        templateId: '114473474859453649',
        isFree: false,
      },
    ]
  }

  // 进入信息图弹窗
  openOneType(id, i) {
    this.modalService.show(CreateProjectModalComponent, {
      initialState: {
        type: 'infographic',
        id: id,
      },
    })
  }

  // 获取信息图列表
  getInfoList() {
    this.infoTemplates = [
      { title: '微信公众号首图', thumb: 'https://ss1.dydata.io/v2/template/1.png', id: 1 },
      { title: '正文配图（横版）', thumb: 'https://ss1.dydata.io/v2/template/2.png', id: 4 },
      { title: '图表报告', thumb: 'https://ss1.dydata.io/v2/template/3.png', id: 7 },
      { title: '正文配图（方形）', thumb: 'https://ss1.dydata.io/v2/template/4.png', id: 5 },
    ]
  }

  createProject(type) {
    this.modalService.show(CreateProjectModalComponent, {
      initialState: {
        type: type,
      },
    })
  }

  createBlankExcel() {
    if (this.userName) {
      this.modalService.show(UploadDataModalComponent, {
        initialState: {
          modalType: 'blank',
        },
      })
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  dataUpload() {
    if (this.userName) {
      this.modalService.show(UploadDataModalComponent, {})
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  createOneChart(item, i) {
    window['_hmt'].push(['_trackEvent', 'chart', 'createproject', `chart-shortcut-choose-${i + 1}`])
    if (this.userName) {
      const urla = `${this._api.getOldUrl()}/vis/dychart/fork/template/${item.templateId}`
      this._createProjectService.createProject(urla, 'chart')
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  ngOnDestroy() {
    this.getTemplateListSubscription.unsubscribe()
    this.forkChartProject.unsubscribe()
    this.forkInfoProject.unsubscribe()
    this.allProjectScription.unsubscribe()
  }
}
