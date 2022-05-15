import { Component, OnInit, ViewChild } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { ActivatedRoute } from '@angular/router'

import { HttpClient } from '@angular/common/http'
import { API } from '../../../states/api.service'
import { VipService, IndexService } from '../../../share/services'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'

import * as fromRoot from '../../../states/reducers'
import * as CaseActions from '../../../states/actions/project-case.action'
import * as _ from 'lodash'

import { DomSanitizer } from '@angular/platform-browser'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { PublishShareComponent } from '../../../components/modals'
import { ToastrService } from 'ngx-toastr'
import { CreateProjectService } from '../../../share/services/create-project.service'

@Component({
  selector: 'lx-templates-detail',
  templateUrl: './templates-detail.component.html',
  styleUrls: ['./templates-detail.component.scss'],
})
export class TemplatesDetailComponent implements OnInit {
  id: string

  url: string
  iframeLoading: boolean = true
  isDynamic: boolean = false
  infoTypes = [
    { id: 1, name: '微信公众号首图' },
    { id: 2, name: '微博焦点图片' },
    // {id: 3, name: "头条号首图"},
    { id: 4, name: '正文配图（横版）' },
    { id: 5, name: '正文配图（方形）' },
    { id: 6, name: '正文配图（竖版）' },
    { id: 7, name: '图表报告' },
    // {id: 8, name: "工作报告"},
    { id: 9, name: '手机海报' },
    // {id: 10, name: "营销长图"},
    { id: 11, name: '简历' },
    { id: 12, name: '新闻长图' },
    { id: 13, name: '数据图说' },
  ]

  itemDetailContent = {
    title: '',
    hot: '',
    type_tags: [],
    been_bought: 0,
    isFree: true,
    update_time: '',
    tpl_type: '',
    tpl_type_id: 0,
    is_fav: '',
    pre_img: '',
    size: '',
    tags: [],
    recommend: [],
  }

  isVpl: string
  isLike: boolean = false
  likeSrc: string = '/dyassets/images/dislike.png'
  userName: string

  heaerStyle = {
    'background-position': 'left',
  }

  infoDetailSubscription = new Subscription()
  getUserInfoSubscription = new Subscription()
  allProjectScription = new Subscription()
  forkInfoProject = new Subscription()

  allProjects$
  collectObj = null
  totalLength: number

  bsModalRef: BsModalRef
  httpOptions = { withCredentials: true }

  @ViewChild('iframe') iframe

  constructor(
    private _http: HttpClient,
    private _api: API,
    private _activatedRoute: ActivatedRoute,
    private _vipService: VipService,
    public sanitizer: DomSanitizer,
    private _store: Store<fromRoot.State>,
    private _modalService: BsModalService,
    private toastr: ToastrService,
    private _indexService: IndexService,
    private _createProjectService: CreateProjectService
  ) {
    this.allProjects$ = this._store.select(fromRoot.getAllProjectList)
  }

  ngOnInit() {
    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2/#/pages/templates/item?*']);

    this.id = this._activatedRoute.snapshot.queryParams.id
    // this.url = `http://39.105.112.224/show/${this.id}`;
    this.isVpl = this._vipService.getVipLevel()

    // 获取项目详情
    this.initDetail(this.id)

    // 获取是否登录
    this.getUserInfo()

    // 获取项目长度
    this.allProjectScription.add(
      this.allProjects$.subscribe((list) => {
        this.totalLength = list.length
      })
    )
  }

  initDetail(id) {
    this._http.get(this._api.getTemplateDetail(id), this.httpOptions).subscribe((res) => {
      if (res) {
        const data = res['data']
        let template_size = ''
        console.log('res', res)
        if (data.dynamic) {
          this.isDynamic = data.dynamic === '1'
        }

        // 判断尺寸
        switch (data.tpl_type[0]) {
          case '微信公众号首图':
            template_size = '900*383'
            break
          case '微博焦点图片':
            template_size = '560*260'
            break
          case '头条号首图':
            template_size = '660*370'
            break
          case '正文配图（横版）':
            template_size = '400*300'
            break
          case '正文配图（方形）':
            template_size = '400*400'
            break
          case '正文配图（竖版）':
            template_size = '400*600'
            break
          case '图表报告':
            template_size = '595*893'
            break
          case '工作报告':
            template_size = '595*808'
            break
          case '数据图说':
            template_size = '640*1920'
            break
          case '简历':
            template_size = '595*842'
            break
          case '手机海报':
            template_size = '640*1008'
            break
          case '新闻长图':
            template_size = '800*2000'
            break
          default:
            break
        }

        let tags = data.tags ? data.tags.split('，') : ['']

        let recommend = data.recommend.map((item) => {
          item['imgUrl'] = item['thumb'].split('?')[0]
          item['name'] = item['title']
          return item
        })

        let tpl_type_id

        this.infoTypes.forEach((item) => {
          if (item.name === data.tpl_type[0]) {
            tpl_type_id = item.id
          }
        })

        if (this.isDynamic) {
          this.getImageHeight(data.pre_img)
        }

        this.itemDetailContent = {
          title: data.title,
          hot: data.hot,
          type_tags: data.type_tags,
          been_bought: 0,
          isFree: data.price === '0.00',
          update_time: data.update_time,
          tpl_type: data.tpl_type,
          tpl_type_id: tpl_type_id,
          is_fav: data.is_fav,
          pre_img: data.pre_img,
          size: template_size,
          tags: tags,
          recommend: recommend,
        }

        this.isLike = data.is_fav

        if (this.isLike) {
          this.heaerStyle = {
            'background-position': 'right',
          }
        } else {
          this.heaerStyle = {
            'background-position': 'left',
          }
        }
      }
    })
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

  getImageHeight(url) {
    const img = new Image()
    img.src = url
    img.onload = (e) => {
      const width = 458
      const height = (width / img.width) * img.height
      this.loadIframe(this.id, width, height)
    }
  }

  loadIframe(id, width, height) {
    this.iframeLoading = false
    this.iframe.nativeElement.innerHTML = ''
    const iframe = document.createElement('iframe')
    const that = this
    iframe.src = `${this._api.getShareUrl()}${id}`
    iframe.frameBorder = '0'
    iframe.scrolling = 'no'
    iframe.width = width
    iframe.height = height
    iframe.onload = function () {
      that.iframeLoading = true
    }
    this.iframe.nativeElement.appendChild(iframe)
  }

  // 切换喜欢的状态
  toggleLike() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'templatecenter', 'template-detail', 'template-detail-like'])

    if (this.userName) {
      this.isLike = !this.isLike

      this._store.dispatch(
        new CaseActions.ToggleLikeCaseAction({
          type: 'infographic',
          caseid: this.id,
          islike: this.isLike ? 1 : 0,
        })
      )

      if (this.isLike) {
        this.heaerStyle = {
          'background-position': 'right',
        }
      } else {
        this.heaerStyle = {
          'background-position': 'left',
        }
      }
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(`${window.location.href.split('#')[0]}#/pages/templates/item?id=${this.id}`)
    }
  }

  // 分享
  share() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'templatecenter', 'template-detail', 'template-detail-share'])
    this.bsModalRef = this._modalService.show(PublishShareComponent, {
      initialState: {
        url: this._api.getShareUrl() + this.id,
        title: '模板分享',
      },
    })
  }

  // 创建信息图
  createInfo() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'templatecenter', 'template-detail', 'template-detail-use'])

    if (this.userName) {
      // 判断是否可以创建
      const url = `${this._api.getOldUrl()}/vis/dychart/fork/infographic/${this.id}`
      this._createProjectService.createProject(url, 'infographic')
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  ngOnDestroy(): void {
    this.infoDetailSubscription.unsubscribe()
    this.getUserInfoSubscription.unsubscribe()
    this.allProjectScription.unsubscribe()
    this.forkInfoProject.unsubscribe()
  }

  hanleInfoClick(index, type) {
    const tempPage = window.open('', '_blank')
    tempPage.location.href = `${window.location.href.split('#')[0]}#/pages/home/info-template?${type}=${index}`
  }

  itemClick(id) {
    const tempPage = window.open('', '_blank')
    tempPage.location.href = `${window.location.href.split('#')[0]}#/pages/templates/item?id=${id}`
  }

  editClick(id: string) {
    if (this.userName) {
      // 判断是否可以创建
      const urla = `${this._api.getOldUrl()}/vis/dychart/fork/infographic/${id}`
      this._createProjectService.createProject(urla, 'infographic')
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  getCollectState(itemObj) {
    // 目前喜欢状态只能在组件里面更改，等后端将喜欢状态写进数组再改
    this._indexService.searchTemplateCollectedById(itemObj.id).subscribe((data) => {
      // itemObj.item.collected = data.islike;
      this.collectObj = {
        index: itemObj.index,
        collected: data.islike,
      }
    })
  }

  // 模板收藏状态改变
  collectChange(itemObj) {
    if (this.userName) {
      this._indexService.toggleCollectState(itemObj.collectState, itemObj.id)
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }
}
