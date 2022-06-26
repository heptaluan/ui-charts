/*
 * @Description: 程序入口组件
 */
import { Component, OnInit, ElementRef } from '@angular/core'
import { NbMenuService } from '@nebular/theme'
import { BsModalService } from 'ngx-bootstrap/modal'
import * as $ from 'jquery'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'
import { BindPhoneComponent, ContactUsModalComponent, UserInfoCollectModalComponent } from './components/modals'
import * as ProjectModels from './states/models/project.model'
import { ZipLoadingComponent } from './components/modals'

declare const domtoimage: any
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import * as fromRoot from './states/reducers'
import { VipService } from './share/services/vip.service'
import { API } from './states/api.service'
import { HttpClient } from '@angular/common/http'
import { ToastrService } from 'ngx-toastr'
import { DomSanitizer } from '@angular/platform-browser'
import { DataTransmissionService } from './share/services'
import * as UserActions from './states/actions/user.action'
import { take } from 'rxjs/operators'

declare const io: any

@Component({
  selector: 'lx-root',
  template: `
    <div class="iframe-box" *ngIf="isInIframe" [ngClass]="{ 'auto-height': iframeBox }">
      <div class="iframe-header">
        <div class="header-logo">
          <a *ngIf="hideLogo !== 'true'" [attr.href]="logoInfoSrc" [attr.target]="logoInfoSrcTarget">
            <img [src]="logoInfo" />
          </a>
          <div (click)="backIframeHome()">{{ backIframeText }}</div>
          <a *ngIf="hideDataStore !== 'true'" href="https://dydata.io" target="_blank">
            <div>数据商城</div>
          </a>
        </div>
        <div class="btns-box">
          <div id="iframeBtns" class="header-btns" *ngIf="showIframeBtns">
            <div *ngIf="hideExportIframe !== 'true'" (click)="exportIframe()">
              <img src="/dyassets/images/iframe-home/export-iframe.svg" />
              <span>导出iframe</span>
            </div>
            <div *ngIf="hideExportImage !== 'true'" (click)="exportImage()">
              <img src="/dyassets/images/iframe-home/export-image.svg" />
              <span>导出图片</span>
            </div>
            <div *ngIf="showExportZip === 'true'" (click)="exportZip()">
              <img src="/dyassets/images/iframe-home/export-zip.svg" />
              <span>导出本地资源包</span>
            </div>
            <div *ngIf="showSendZip === 'true'" (click)="sendZip()">
              <img src="/dyassets/images/iframe-home/export-zip.svg" />
              <span>发送资源包</span>
            </div>
          </div>
          <div class="header-user-box" *ngIf="hideUser !== 'true'">
            <img src="{{ userImage }}" alt="" />
            <div class="header-user">
              <span>{{ userName }}</span>
              <i [ngClass]="vipLogo"></i>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="showIframeHome" class="iframe-content" [ngStyle]="iframeContent">
        <h2 *ngIf="hideTitle !== 'true'">镝数图表，您身边的图表专家</h2>
        <h2 *ngIf="hideTitle === 'true'"></h2>
        <div class="workspace-box">
          <div (click)="createChart()">
            <img src="/dyassets/images/iframe-home/1.png" />
          </div>
          <div (click)="createInfographic()">
            <img src="/dyassets/images/iframe-home/2.png" />
          </div>
          <div (click)="openLastProject()">
            <img src="/dyassets/images/iframe-home/3.png" />
          </div>
          <div (click)="jumpToProjectManagement()">
            <img src="/dyassets/images/iframe-home/4.png" />
          </div>
        </div>
      </div>
    </div>
    <ngx-loading [show]="loading"></ngx-loading>
    <div [hidden]="showIframeHome" [ngClass]="{ 'iframe-box': isInIframe }">
      <router-outlet></router-outlet>
    </div>
    <ng-container *ngIf="isShowTip">
      <lx-update-tip></lx-update-tip>
    </ng-container>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // Loading
  public loading = false

  userImage: string = 'https://dydata.io/dyassets/images/logo-new.svg'
  userName: any
  backIframeText: string = '新建项目'
  vipLogo: string

  title = 'dy-镝数'
  isInIframe: boolean = false
  showIframeBtns: boolean = false
  showIframeHome: boolean = false
  iframeBox
  iframeContent
  userIsLogin: boolean = false
  isVpl: string = ''
  totalLength // 信息图项目长度
  projectLists // 信息图项目列表

  getUserInfoSubscription = new Subscription()
  allProjectScription = new Subscription()
  createEmptyTemplateSubscription = new Subscription()

  // 跨域允许
  httpOptions = { withCredentials: true }

  // 第三方配置项
  hideLogo: string
  hideUser: string
  hideTitle: string
  hideDataStore: string
  hideExportIframe: string
  hideExportImage: string
  hideChartLogo: string
  showExportZip: string = 'false'
  hideToolbar: string = 'false'
  showSendZip: string = 'false'

  logoInfo: string = '/dyassets/images/logo-new.svg'
  logoInfoSrc: any = 'https://dycharts.com/appv2/#/pages/home/index'
  logoInfoSrcTarget: any = '_blank'
  isShowTip: boolean = false

  constructor(
    private menuService: NbMenuService,
    private _modalService: BsModalService,
    private _el: ElementRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _store: Store<fromRoot.State>,
    private _vipService: VipService,
    private _api: API,
    private _http: HttpClient,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private _dataTransmissionService: DataTransmissionService
  ) {
    // 根据路由判断是否显示下载按钮组
    _router.events.subscribe((event) => {
      if (window.self !== window.top && event instanceof NavigationEnd) {
        // 如果当前处于工作台或者下载界面，显示按钮组
        if (_activatedRoute.snapshot.queryParams.type) {
          this.showIframeBtns = true
          this.backIframeText = '项目管理'
        } else {
          this.backIframeText = '新建项目'
        }
      }
    })
  }

  ngOnInit() {
    // 获取用户信息
    this._store.dispatch(new UserActions.GetUserInfoAction())

    var socket = io(`${this._api.getOldUrl()}/img_upload`, {
      secure: true,
      rejectUnauthorized: false,
    })

    // 扫码绑定（0 为扫码，1 为上传）
    this.getUserInfoSubscription.add(
      this._store
        .select(fromRoot.getUserInfo)
        .filter((user) => !!user)
        .subscribe((user) => {
          socket.on(`user_${user.id}`, (res) => {
            if (res && res.notify_info && res.notify_type === 'img_upload') {
              this._dataTransmissionService.sendImageSubjectState({
                code: 1,
                data: res,
              })
            } else if (res && res.notify_info === '0') {
              this._dataTransmissionService.sendCodeSubjectState({
                code: 0,
                data: res,
              })
            }
          })
        })
    )

    /**
     *  针对于嵌入 iframe 当中单独设置
     */

    // 获取参数显示对应配置项
    const params = this.urlParam(location.href)
    this.hideLogo = params['hideLogo']
    this.hideTitle = params['hideTitle']
    this.hideDataStore = params['hideDataStore']
    this.hideExportIframe = params['hideExportIframe']
    this.hideExportImage = params['hideExportImage']
    this.showExportZip = params['showExportZip']
    this.hideUser = params['hideUser']
    this.hideToolbar = params['hideToolbar']

    // 页面加载完成后延迟一秒关闭 loading
    setTimeout(() => {
      $('.home-loading').hide()
      $('.workspace-loading').hide()
    }, 1000)

    // 获取项目长度
    this.allProjectScription.add(
      this._store.select(fromRoot.getAllProjectList).subscribe((list) => {
        this.projectLists = list
        this.totalLength = list.length
      })
    )

    // 如果该页面被嵌入在 ifrmae 当中
    if (window.self !== window.top) {
      this.isInIframe = true
      this.showIframeHome = true
      this.iframeBox = true
      this.iframeContent = {
        width: '100%',
      }

      // 设置左上角 logo
      const logoUrl = `${this._api.getOldUrl()}/partner/logo_info`
      this._http.get(logoUrl, { withCredentials: true }).subscribe((res) => {
        console.log(res)
        if (res['resultCode'] === 1000 && res['data'].logo) {
          this.logoInfo = res['data'].logo
          this.logoInfoSrc = this.sanitizer.bypassSecurityTrustUrl('javascript:;')
          this.logoInfoSrcTarget = '_self'
          if (res['data'].export_notify) {
            this.showExportZip = 'false'
            this.showSendZip = 'true'
          } else if (this.showExportZip === 'true') {
            this.showExportZip = 'true'
            this.showSendZip = 'false'
          } else {
            this.showExportZip = 'false'
            this.showSendZip = 'false'
          }
        } else {
          this.logoInfo = '/dyassets/images/logo-new.svg'
          this.logoInfoSrc = this.sanitizer.bypassSecurityTrustUrl('https://dycharts.com/appv2/#/pages/home/index')
          this.logoInfoSrcTarget = '_blank'
        }
      })
    }
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.isShowTip = true;
    // },1000)

    // return;
    // 获取用户是否绑定了手机号
    this.getUserInfoSubscription.add(
      this._store
        .select(fromRoot.getUserInfo)
        .filter((user) => !!user)
        .subscribe((user) => {
          // 赋值
          this.userImage = user.avatar
          this.userName = user.nickname || user.loginname

          // 判断会员级别
          switch (this._vipService.getVipLevel()) {
            case 'vip1':
              this.vipLogo = 'vip1'
              break

            case 'vip2':
              this.vipLogo = 'vip2'
              break

            case 'eip1':
              this.vipLogo = 'eip1'
              break

            case 'eip2':
              this.vipLogo = 'eip2'
              break

            default:
              break
          }

          // 判断是否绑定了手机号码
          if (user && user.phoneno !== '') {
            this.userIsLogin = true
          } else {
            this.userIsLogin = false
          }
          if (
            window.self === window.top &&
            !(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) || /(Android)/i.test(navigator.userAgent))
          ) {
            // 版本更新提示
            if (this.userName) {
              const isUiAdd = this._vipService.getIsUiAdd()
              // 用户信息采集
              if (isUiAdd && isUiAdd === 'False') {
                this._modalService.show(UserInfoCollectModalComponent, {
                  ignoreBackdropClick: true,
                })

                this._modalService.onHidden.pipe(take(1)).subscribe(() => {
                  this.updateTip(1000)
                })
              } else {
                // 版本更新
                this.updateTip(2000)
              }
            }
          }
        })
    )
  }

  ngOnDestroy(): void {
    this.getUserInfoSubscription.unsubscribe()
    this.allProjectScription.unsubscribe()
    this.createEmptyTemplateSubscription.unsubscribe()
  }

  // 判断是否是移动端
  IsPC() {
    var userAgentInfo = navigator.userAgent
    var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod', 'WindowsWechat']
    var flag = true
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  }

  urlParam(url) {
    const param = {}
    url.replace(/[?&](.*?)=([^&]*)/g, (m, $1, $2) => (param[$1] = $2))
    return param
  }

  /**
   *  导航栏和绑定手机号
   */

  // 返回工作台
  backIframeHome() {
    this.showIframeBtns = false
    // 如果当前处于工作台，保存项目在退出
    if (this._router.url.indexOf('pages/workspace') > 0) {
      $('.go-home').click()
    } else {
      // this._router.navigate(['pages', 'home', 'projectmanagement']);
      this.showIframeBtns = false
      this.showIframeHome = true
      this.iframeBox = true
    }
  }

  // 绑定手机弹窗
  bindPhone() {
    this._modalService.show(BindPhoneComponent)
  }

  /**
   *  四个板块
   */

  createChart() {
    this.createProject('chart')
  }

  createInfographic() {
    this.createProject('infographic')
  }

  createProject(type) {
    // 权限判断，同 SPA
    const createProjectUrl = this._api.getProject()
    const payload: ProjectModels.CreateProjectInfo = {
      title: '未命名',
      description: '',
      type: type,
      templateId: '0',
      public: true,
    }

    this._http
      .post<ProjectModels.ProjectInfo>(createProjectUrl, payload, { withCredentials: true })
      .subscribe((res) => {
        switch (res['resultCode']) {
          // 可以创建
          case 1000:
            this._router.navigate(['pages', 'workspace'], { queryParams: { project: res['data'].id, type: type } })
            setTimeout(() => {
              this.showIframeHome = false
              this.iframeBox = false
            }, 1000)
            break

          // 项目未找到
          case 3001:
            alert(`项目未找到，请刷新后重新尝试`)
            break

          // 项目数超限
          case 3002:
          case 3003:
            this._modalService.show(ContactUsModalComponent, {
              initialState: {
                content: '项目数超限，请在「项目管理」中删除部分图表后再进行创建项目操作。',
                title: {
                  position: 'center',
                  content: '提示',
                  button: '确定',
                },
              },
            })
            break

          default:
            break
        }
      })
  }

  openLastProject() {
    // 直接去取最后编辑的项目
    const id = localStorage.getItem('lastProjectId')
    const type = localStorage.getItem('lastProjectType')

    // 判断项目是否存在
    let projectUrl
    if (!type) {
      return
    } else {
      if (type === 'infographic') {
        projectUrl = this._api.getInfographicProject(id)
      } else {
        projectUrl = this._api.getSingleChartProject(id)
      }
    }

    this._http.get(projectUrl, this.httpOptions).subscribe((res) => {
      if (res['resultCode'] === 1000) {
        setTimeout(() => {
          this.showIframeHome = false
          this.iframeBox = false
        }, 1000)
        this._router.navigate(['pages', 'workspace'], { queryParams: { project: id, type: type } })
      } else {
        this.toastr.error(null, '上一次编辑的项目不存在！')
      }
    })
  }

  jumpToProjectManagement() {
    this.showIframeHome = false
    this.iframeBox = false
    this._router.navigate(['pages', 'home', 'projectmanagement'])
  }

  /**
   *  下载设置
   */

  exportZip() {
    const vip = this._vipService.getVipLevel()
    const projectType = localStorage.getItem('projectType')
    const shareUrl = localStorage.getItem('shareUrl')
    // const shareUrl = 'c_8e3c3156472407b609364a80aa027abc'
    const projectTitle = document.querySelector('.project-title').textContent
    const fonts = $('body').attr('data-json')

    console.log(vip)
    console.log(projectType)
    console.log(shareUrl)
    console.log(projectTitle)

    if (vip && vip.startsWith('eip')) {
      this._modalService.show(ZipLoadingComponent, {
        ignoreBackdropClick: true,
      })
      let getUrl = ''
      if (shareUrl && projectType === 'chart') {
        getUrl = `https://dycharts.com/chartzipdownload?id=${shareUrl}&type=chart&hideToolbar=${
          this.hideToolbar
        }&fonts=${encodeURI(fonts)}`
        // getUrl = `http://localhost:3000/chartzipdownload?id=${shareUrl}&type=chart&hideToolbar=${this.hideToolbar}&fonts=${encodeURI(fonts)}`
      } else {
        // getUrl = `http://localhost:3000/chartzipdownload?id=${shareUrl}&hideToolbar=${this.hideToolbar}&fonts=${encodeURI(fonts)}`
        getUrl = `https://dycharts.com/chartzipdownload?id=${shareUrl}&hideToolbar=${
          this.hideToolbar
        }&fonts=${encodeURI(fonts)}`
      }
      const xhr = new XMLHttpRequest()
      const that = this
      xhr.open('get', getUrl, true)
      xhr.responseType = 'blob'
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            var blob = this.response
            let url = URL.createObjectURL(blob)
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', `${projectTitle}.zip`)
            document.body.appendChild(link)
            link.click()
            that._dataTransmissionService.saveProcess('success')
          }
        }
      }
    } else {
      alert(`该功能仅企业会员可用`)
    }
  }

  sendZip() {
    const vip = this._vipService.getVipLevel()
    const projectType = localStorage.getItem('projectType')
    const shareUrl = localStorage.getItem('shareUrl')
    // const shareUrl = 'c_8e3c3156472407b609364a80aa027abc'
    const projectTitle = document.querySelector('.project-title').textContent
    const fonts = $('body').attr('data-json')

    console.log(vip)
    console.log(projectType)
    console.log(shareUrl)
    console.log(projectTitle)

    if (vip && vip.startsWith('eip')) {
      this._modalService.show(ZipLoadingComponent, {
        ignoreBackdropClick: true,
      })
      let getUrl = ''
      if (shareUrl && projectType === 'chart') {
        getUrl = `https://dycharts.com/partner/eip_export_notify?id=${shareUrl}&type=chart&hideToolbar=${
          this.hideToolbar
        }&fonts=${encodeURI(fonts)}`
        // getUrl = `http://localhost:3000/sendchartzip?id=${shareUrl}&type=chart&hideToolbar=${this.hideToolbar}&fonts=${encodeURI(fonts)}`
      } else {
        // getUrl = `http://localhost:3000/sendchartzip?id=${shareUrl}&hideToolbar=${this.hideToolbar}&fonts=${encodeURI(fonts)}`
        getUrl = `https://dycharts.com/partner/eip_export_notify?id=${shareUrl}&hideToolbar=${
          this.hideToolbar
        }&fonts=${encodeURI(fonts)}`
      }
      const xhr = new XMLHttpRequest()
      const that = this
      xhr.open('get', getUrl, true)
      // xhr.responseType = 'blob'17
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            alert(`发送成功`)
            that._dataTransmissionService.saveProcess('success')
          }
        }
      }
    } else {
      alert(`该功能仅企业会员可用`)
    }
  }

  exportIframe() {
    // 如果当前处于工作台或者下载界面
    console.log(this._api.getShareUrl() + $('.iframe-box').attr('private_url').split('/show/')[1])
    if (this._router.url.indexOf('workspace') > 0) {
      const exportElement = this.getPageElement()
      parent.postMessage(
        {
          iframeData: {
            url: this._api.getShareUrl() + $('.iframe-box').attr('private_url').split('/show/')[1],
            width: (exportElement as any).clientWidth,
            height: (exportElement as any).clientHeight,
          },
        },
        '*'
      )
    } else if (this._router.url.indexOf('download') > 0) {
      const exportElement = this.getPageElement()
      parent.postMessage(
        {
          iframeData: {
            url: this._api.getShareUrl() + $('.iframe-box').attr('private_url').split('/show/')[1],
            width: (exportElement as any).clientWidth,
            height: (exportElement as any).clientHeight,
          },
        },
        '*'
      )
    }
  }

  exportImage() {
    this.loading = true
    const exportElement = this.getPageElement()
    const uploadUrl = this.getDownloadImgUrl()
    if (!exportElement) {
      return
    }
    const that = this

    // 剔除焦点
    $('.change-page').click()

    // 获取封面
    setTimeout(() => {
      $('.workspace').css('transform', 'scale(1)')
      $('.workspace').css('overflow', 'hidden')
      domtoimage.toBlob(exportElement).then(function (blob) {
        $.ajax({
          url: uploadUrl,
          type: 'post',
          async: false,
          xhrFields: {
            withCredentials: true,
          },
          processData: false,
          contentType: false,
          cache: false,
          data: blob,
          dataType: 'json',
          success: function (res) {
            console.log(res.data)
            parent.postMessage(
              {
                img: 'https://image.dydata.io/' + res.data,
              },
              '*'
            )
            that.loading = false
          },
          error: function (err) {
            console.log(err)
            that.loading = false
          },
        })
      })
    })
  }

  getPageElement() {
    // 根据页面不同获取对应的元素
    let exportElement = ''
    if (this._router.url.indexOf('workspace') > 0) {
      exportElement = $('.workspace-wrap')[0]
    } else if (this._router.url.indexOf('download') > 0) {
      exportElement = $('.page-box')[1]
    }
    return exportElement
  }

  getDownloadImgUrl() {
    // 获取对应的下载地址
    let uploadUrl = ''
    const projectType = this._activatedRoute.snapshot.queryParams.type
    const projectId = this._activatedRoute.snapshot.queryParams.project
    if (this._router.url.indexOf('workspace') > 0 || this._router.url.indexOf('download') > 0) {
      if (projectType === 'infographic') {
        uploadUrl = this._api.getProject(projectId)
      } else if (projectType === 'chart') {
        uploadUrl = this._api.getSingleChartProject(projectId)
      }
    }
    return uploadUrl
  }

  // 版本更新提示
  updateTip(time: number) {
    const historyEdition = [
      '0809',
      '1018',
      '1031',
      '1220',
      '0119',
      '0201',
      '0215',
      '0222',
      '0229',
      '0307',
      '0314',
      '0515',
      '0605',
      '0612',
      '0706',
      '1016',
      '1030',
      '1113',
      '1204',
      '20201218',
      '20201231',
      '20210115',
      '20210128',
    ]

    // 版本更新提示
    var updateTip = localStorage.getItem('updateTip')
    var updateTime = new Date().getTime()
    if (updateTip && updateTip.length !== 4) {
      updateTime = new Date(updateTip.slice(0, 4) + '/' + updateTip.slice(4, 6) + '/' + updateTip.slice(6, 8)).getTime()
    }
    // 1.不存在updateTip缓存，版本为旧版本，兼容旧逻辑标识为4位数
    // 2.最新版本更新时间和当前时间小于60天
    // 3.非移动端
    // 满足以上三点显示版本更新弹窗
    // 最新版本日期 2021/03/04 00:00:00 (版本更新时需要更新if判断以及缓存存值)
    if (
      (!updateTip || historyEdition.indexOf(updateTip) > -1 || (updateTip && updateTip.length === 4)) &&
      new Date().getTime() - new Date('2021/03/04 00:00:00').getTime() < 60 * 24 * 60 * 60 * 1000
    ) {
      localStorage.removeItem('updateTip')
      setTimeout(() => {
        this.isShowTip = true
      }, time)
      localStorage.setItem('updateTip', '20210304')
    }
  }
}
