import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import * as _ from 'lodash'
import { TabsetComponent } from 'ngx-bootstrap'
import { VipService } from '../../../../share/services/vip.service'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { API } from '../../../../states/api.service'
import { Router } from '@angular/router'
import { DataTransmissionService } from '../../../../share/services'
import { Subscription } from 'rxjs'

@Component({
  selector: 'lx-image-sidebar',
  templateUrl: './image-sidebar.component.html',
  styleUrls: ['./image-sidebar.component.scss'],
})
export class ImageSidebarComponent implements OnInit {
  @ViewChild('staticTab') staticTab: TabsetComponent
  @ViewChild('sysScroll') sysScroll: ElementRef
  @ViewChild('personScroll') personScroll: ElementRef
  @Input() pageId: string
  @Output() closeSidebarEvent = new EventEmitter()

  styles
  categories
  partCategories
  tabActive: boolean = true // 控制切换图标库跟我的上传
  imageTemplates = [] // 服务端取得的图片的数据
  userUpdateImages = [] // 服务端取得的用户的数据
  isVpl: string // 是否 vip
  imgClassTemplates = []
  usedCapacity // 非 vip 用户上传图片使用的容量
  capacity // 非 vip 用户上传的总容量
  usedPercent // 百分比
  bsModalRef: BsModalRef
  nextPage: string = ''
  nextPage2: string = ''
  nextSearchPage: string = ''
  deleteFlag: boolean = true
  isHideUpload: boolean = false
  text: string = '加载更多...'
  imageSuc: boolean = false
  contentBox: boolean = true

  isAddImages: boolean = false

  isHidePreview: boolean = true
  showImageLayout: boolean = false
  isConnect: boolean = false
  showUnderline: boolean = false
  imageLayout: string = '/dyassets/images/drop-upload/code-suc.svg'
  imageText: string = '扫一扫，用手机上传图片'
  timer: any
  qrCodeUrl: string

  sysTimer
  personTimer

  constructor(
    private _http: HttpClient,
    private _vipService: VipService,
    private _api: API,
    private _router: Router,
    private _dataTransmissionService: DataTransmissionService
  ) {}

  private userImageUrl = `${this._api.getOldUrl()}/vis/dychart/v2/upload/filelist` // 获取个人上传图片
  private sysImageUrl = `${this._api.getOldUrl()}/vis/dychart/v2/imagelib` // 获取系统提供的图片
  private categoriesUrl = `${this._api.getOldUrl()}/vis/dychart/v2/imagelib/categories`

  private getCodeSubjectStateSubscription: Subscription = new Subscription()

  httpOptions = { withCredentials: true } // 跨域允许

  ngOnInit() {
    this.styles = {
      height: innerHeight - 50 + 'px',
      width: '280px',
    }

    window.onresize = _.debounce((event) => (this.styles.height = innerHeight - 50 + 'px'), 500)

    this.isVpl = this._vipService.getVipLevel()
    this.initGetImgs(this.sysImageUrl, false)
    this.initGetImgsCate()
    this.getUserImgs(this.userImageUrl)

    // 监听手机是否已经扫码
    this.getCodeSubjectStateSubscription.add(
      this._dataTransmissionService.getCodeSubjectState().subscribe((res) => {
        if (res.code === 0) {
          clearInterval(this.timer)
          this.showUnderline = true
          this.isConnect = true
          this.contentBox = false
          this.imageSuc = true
          this.imageLayout = '/dyassets/images/drop-upload/code-suc.svg'
          this.imageText = '重新扫描'
        }
      })
    )

    // 设置扫码跳转的地址
    this.getCode()
  }

  getCode() {
    const codeUrl = `${this._api.getOldUrl()}/vis/dychart/scan_upload/qrcode`
    this._http.get(codeUrl, { withCredentials: true }).subscribe((res) => {
      if (res['resultCode'] === 1000) {
        this.qrCodeUrl = `${this._api.getOldUrl()}/vis/dychart/scan_upload/file/${res['data'].sec_code}`
      }
    })
  }

  refreshCode() {
    this.getCode()
    this.isConnect = false
    this.contentBox = true
    clearInterval(this.timer)
    this.timer = setTimeout(() => {
      this.isConnect = true
      this.showUnderline = true
      this.contentBox = false
      this.imageLayout = '/dyassets/images/drop-upload/code-err.svg'
      this.imageText = '重新生成'
    }, 60000)
  }

  ngAfterViewInit() {
    this.sysScroll.nativeElement.addEventListener('scroll', this.handleScroll.bind(this))
  }

  // 滚动到底部加载
  handleScroll() {
    var e = e || window.event

    if (this.sysTimer) {
      clearTimeout(this.sysTimer)
    }

    this.sysTimer = setTimeout(() => {
      const top = Math.round(e.target.scrollTop)
      // 最大滚动距离
      var maxHeight = e.target.scrollHeight - e.target.clientHeight - 10
      if (top >= maxHeight) {
        if (this.isHideUpload && this.nextSearchPage) {
          this.search('', this.nextSearchPage)
        } else if (this.nextPage) {
          this.isAddImages = false
          this.initGetImgs(this.nextPage, false)
        }
      }
    }, 50)
  }

  // 加载更多
  loadMore(tip) {
    // 判断是不是在搜索
    if (this.isHideUpload === true) {
      if (this.nextSearchPage) {
        this.search('', this.nextSearchPage)
      } else {
        this.text = '- 没有更多了 -'
        return
      }
    } else if (tip === 'image') {
      if (this.nextPage) {
        this.initGetImgs(this.nextPage, false)
      } else {
        this.text = '- 没有更多了 -'
      }
    } else if (tip === 'upload') {
      if (this.nextPage2) {
        this.isAddImages = false
        this.getUserImgs(this.nextPage2)
      } else {
        this.text = '- 没有更多了 -'
      }
    }
  }

  // 滚动底部加载我的上传
  handlePersonScroll() {
    var e = e || window.event

    // 节流
    if (this.personTimer) {
      clearTimeout(this.personTimer)
    }

    this.personTimer = setTimeout(() => {
      const top = Math.round(e.target.scrollTop)
      // 最大滚动距离
      var maxHeight = e.target.scrollHeight - e.target.clientHeight - 10
      if (this.nextPage2 && top >= maxHeight) {
        if (this.isHideUpload) {
          this.search('', this.nextSearchPage)
        } else {
          // this.getUserImgs(this.nextPage2);
          this.loadMore('upload')
        }
      }
    }, 50)
  }

  // 分类
  classify(category) {
    if (category === 'all') {
      // 获取系统提供的图片
      this.imageTemplates = []
      this.initGetImgs(this.sysImageUrl, false)
    } else {
      this.initGetImgs(`${this.sysImageUrl}/${category}`, true)
    }
  }

  // 图片搜索
  search(title, nextSearchPage: string = '') {
    if (title !== '') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-search-image'])
    }
    this.text = '加载更多...'
    if (!nextSearchPage) {
      if (title) {
        this._http.get(`${this.sysImageUrl}?tag=${title}`, this.httpOptions).subscribe((data) => {
          this.imageTemplates = []
          this.imageTemplates = data['data']['results']
          this.isHideUpload = true
          this.nextSearchPage = data['data']['next']
        })
      } else {
        this.isHideUpload = false
        this.initGetImgs(this.sysImageUrl, true)
        this.nextSearchPage = ''
      }
    } else {
      this._http.get(this.nextSearchPage, this.httpOptions).subscribe((data) => {
        this.imageTemplates = this.imageTemplates.concat(data['data']['results'])
        this.isHideUpload = true
        this.nextSearchPage = data['data']['next']
      })
    }
  }

  clickCloseBtn() {
    this.closeSidebarEvent.emit()
  }

  // 切换标签方法
  onTabSelect(e) {
    if (e.id === 'tab2') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-left-myimage'])
    }
    this.tabActive = !this.tabActive
    if (!this.tabActive) {
      setTimeout(() => {
        this.personScroll.nativeElement.addEventListener('scroll', this.handlePersonScroll.bind(this))
      }, 100)
      // 切换时分别判断有无更多
      if (!this.nextPage2) {
        this.text = '- 没有更多了 -'
      } else {
        this.text = '加载更多...'
      }
    } else {
      setTimeout(() => {
        this.sysScroll.nativeElement.addEventListener('scroll', this.handleScroll.bind(this))
      }, 100)
      // 切换时分别判断有无更多
      if (!this.nextPage) {
        this.text = '- 没有更多了 -'
      } else {
        this.text = '加载更多...'
      }
    }
  }

  // 获取系统图片
  initGetImgs(url, imgFlag) {
    this.text = '加载更多...'
    this.isHideUpload = false
    this._http.get(url, this.httpOptions).subscribe((data) => {
      this.nextPage = data['data']['next']
      if (!this.nextPage) {
        this.text = '- 没有更多了 -'
      } else {
        this.text = '加载更多...'
      }
      // 如果数据需要清空 imgFlag为true
      if (imgFlag) {
        this.imageTemplates = []
        this.imageTemplates = data['data']['results']
      } else {
        this.imageTemplates = this.imageTemplates.concat(data['data']['results'])
      }
    })
  }

  // 获取系统图片分类
  initGetImgsCate() {
    this._http.get(this.categoriesUrl, this.httpOptions).subscribe((data) => {
      this.categories = data['data']
      this.categories.unshift({ category: 'all', category_cn: '全部' })
      this.partCategories = this.categories.slice(0, 5)
    })
  }

  // 获取用户图片
  getUserImgs(url) {
    this._http.get(url, this.httpOptions).subscribe((data) => {
      if (data['resultCode'] === 1000) {
        this.text = '加载更多...'
        this.nextPage2 = data['data']['next']
        if (this.isAddImages) {
          this.userUpdateImages = []
        }
        if (!this.nextPage2) {
          this.text = '- 没有更多了 -'
        } else {
          this.text = '加载更多...'
        }
        data['data']['results'].map((obj) => {
          obj['url'] = `https://${obj.img_url}`
          this.userUpdateImages.push(obj)
        })
        this.usedCapacity = data['data']['consumed_space']
        this.capacity = data['data']['total_space']
        this.usedPercent = data['data']['consumed_percent'] * 100
      } else {
        this.text = '- 没有更多了 -'
      }
    })
  }

  // 上传成功跳转
  getSysImgs() {
    this.staticTab.tabs[1].active = true
    // this.userUpdateImages = [];
    this.isAddImages = true
    this.getUserImgs(`${this._api.getOldUrl()}/vis/dychart/v2/upload/filelist`)
  }

  updateImages(data) {
    this.usedCapacity = this.usedCapacity.indexOf('M') > 0 ? `${data}M` : `${Math.round((data / 1024) * 100) / 100}G`
  }

  deleteImg(id) {
    this.userUpdateImages = this.userUpdateImages.filter((item) => item.id !== id)
  }

  switchTab() {
    this.staticTab.tabs[1].active = true
  }

  // 会员提示
  upgrade() {
    this._router.navigate(['pages', 'home', 'price'])
  }

  // 扫码上传
  handleShowImageLayout() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-insert-mobileupload'])
    this.getCode()
    this.showImageLayout = !this.showImageLayout
    if (this.showImageLayout) {
      clearInterval(this.timer)
      this.timer = setTimeout(() => {
        this.isConnect = true
        this.showUnderline = true
        this.contentBox = false
        this.imageLayout = '/dyassets/images/drop-upload/code-err.svg'
        this.imageText = '重新生成'
      }, 60000)
    } else {
      clearInterval(this.timer)
      this.isConnect = false
      this.showUnderline = false
      this.imageText = '扫一扫，用手机上传图片'
    }
  }

  handleHideImageLayout() {
    this.showImageLayout = false
    clearInterval(this.timer)
    this.isConnect = false
    this.showUnderline = false
    this.imageText = '扫一扫，用手机上传图片'
  }

  ngOnDestroy() {
    window.onresize = null
    clearInterval(this.timer)
    if (!this.tabActive) {
      this.personScroll.nativeElement.removeEventListener('scroll', this.handlePersonScroll.bind(this))
    } else {
      this.sysScroll.nativeElement.removeEventListener('scroll', this.handleScroll.bind(this))
    }
    this.getCodeSubjectStateSubscription.unsubscribe()
  }
}
