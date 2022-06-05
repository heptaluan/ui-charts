import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import * as _ from 'lodash'
import { HttpClient } from '@angular/common/http'
import * as $ from 'jquery'
import { API } from '../../../../states/api.service'

@Component({
  selector: 'lx-shape-sidebar',
  templateUrl: './shape-sidebar.component.html',
  styleUrls: ['./shape-sidebar.component.scss'],
})
export class ShapeSidebarComponent implements OnInit {
  @Input() pageId: string
  @Input() blockId
  @Input() hideShape: boolean = false
  @Output() closeSidebarEvent = new EventEmitter()
  @ViewChild('iconScroll') iconScroll: ElementRef

  styles
  tabActive: boolean = true // 控制切换图标跟形状
  iconData = []
  iconDataCopy = [] // 存储总图片
  iconClassData = [] // 存储分类图片 避免总图片加载进分类的图片
  categories
  partCategories
  nextPage: string = ''
  nextSearchPage: string = ''
  timer
  text: string = '加载更多...'

  // 判断加载的是搜索的还是直接显示的
  isHideUpload: boolean = false

  shapeTemplates = [
    {
      title: '直线',
      content: '/dyassets/images/LineShape.svg',
      shapeType: 'line',
    },
    // {
    //   title: '箭头',
    //   content: '/dyassets/images/ArrowShape.svg',
    //   shapeType: 'line-arrow'
    // },
    {
      title: '矩形',
      content: '/dyassets/images/RectShape.svg',
      shapeType: 'rectangle',
    },
    {
      title: '圆',
      content: '/dyassets/images/OvalShape.svg',
      shapeType: 'oval',
    },
    {
      title: '圆角矩形',
      content: '/dyassets/images/RoundRectShape.svg',
      shapeType: 'round-rectangle',
    },
    {
      title: '三角形',
      content: '/dyassets/images/TriangleShape.svg',
      shapeType: 'triangle',
    },
    {
      title: '五边形',
      content: '/dyassets/images/PentagonShape.svg',
      shapeType: 'pentagon',
    },
  ]

  private iconImageUrl = `${this._api.getOldUrl()}/vis/dychart/v2/iconlib`
  private iconImageCateUrl = `${this._api.getOldUrl()}/vis/dychart/v2/iconlib/categories`

  httpOptions = { withCredentials: true } //跨域允许

  constructor(private _http: HttpClient, private _api: API) {}

  ngOnInit() {
    if (this.hideShape) {
      this.tabActive = false
    }
    this.styles = {
      height: innerHeight - 50 + 'px',
      width: '280px',
    }

    window.onresize = _.debounce((event) => (this.styles.height = innerHeight - 38 + 'px'), 500)

    //获取图标数据
    this.getSysIcons(this.iconImageUrl, false)
    this.initGetImgsCate()

    // 图标先加载前5页
    for (let i = 0; i < 4; i++) {
      this.getSysIcons(`${this.iconImageUrl}?page=${i + 2}`, false)
    }
  }

  // 滚动到底部加载
  handleScroll() {
    var e = e || window.event

    // 节流
    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(() => {
      const top = Math.round(e.target.scrollTop)
      var maxHeight = e.target.scrollHeight - e.target.clientHeight - 10 // 最大滚动距离
      if (top >= maxHeight) {
        if (this.isHideUpload && this.nextSearchPage) {
          this.search('', this.nextSearchPage)
        } else if (this.nextPage) {
          this.getSysIcons(this.nextPage, false)
        }
      }
    }, 50)
  }

  // 加载更多
  loadMore() {
    if (this.isHideUpload === true) {
      if (this.nextSearchPage) {
        this.search('', this.nextSearchPage)
      } else {
        this.text = '- 没有更多了 -'
        return
      }
    } else {
      if (this.nextPage) {
        this.getSysIcons(this.nextPage, false)
      } else {
        this.text = '- 没有更多了 -'
      }
    }
  }

  // 获取系统图标分类
  initGetImgsCate() {
    this._http.get(this.iconImageCateUrl, this.httpOptions).subscribe((data) => {
      this.categories = data['data']
      // console.log(this.categories);

      this.categories.unshift({ category: 'all', category_cn: '全部' })
      this.partCategories = this.categories.slice(0, 5)
    })
  }

  // 分类
  classify(category) {
    if (category == 'all') {
      this.iconDataCopy = []
      this.getSysIcons(this.iconImageUrl, false)
      for (let i = 0; i < 4; i++) {
        this.getSysIcons(`${this.iconImageUrl}?page=${i + 2}`, false)
      }
    } else {
      this.iconClassData = []
      this.getSysIcons(`${this.iconImageUrl}/${category}`, true)
      for (let i = 0; i < 4; i++) {
        this.getSysIcons(`${this.iconImageUrl}/${category}?page=${i + 2}`, false)
      }
    }
  }

  // 获取系统图标
  getSysIcons(url, iconFlag) {
    this.text = '加载更多...'
    this._http.get(url, this.httpOptions).subscribe((data) => {
      if (data['resultCode'] === 1000) {
        this.nextPage = data['data']['next']
        if (iconFlag) {
          this.iconDataCopy = this.iconClassData
        }
        if (this.nextPage) {
          this.text = '加载更多...'
        } else {
          this.text = '- 没有更多了 -'
        }
        data['data']['results'].map((item) => {
          var that = this
          $.get(item.url, function (data) {
            var $svg = $(data).find('svg')[0]
            that.iconDataCopy.push($svg)
          })
        })
      } else {
        this.text = '- 没有更多了 -'
        this.nextPage = ''
      }
    })
  }

  // 切换标签方法
  onTabSelect(e) {
    if (e.id === 'tab2') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-left-icon'])
    }
    this.tabActive = !this.tabActive
    if (!this.tabActive) {
      setTimeout(() => {
        this.iconScroll.nativeElement.addEventListener('scroll', this.handleScroll.bind(this))
      }, 100)
    }
  }

  // 图标搜索
  search(title, nextSearchPage: string = '') {
    if (title !== '') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-search-icon'])
    }
    this.text = '加载更多...'
    if (!nextSearchPage) {
      if (title) {
        this._http.get(`${this.iconImageUrl}?tag=${title}`, this.httpOptions).subscribe((data) => {
          this.iconDataCopy = []
          data['data']['results'].map((item) => {
            var that = this
            $.get(item.url, function (data) {
              var $svg = $(data).find('svg')[0]
              that.iconDataCopy.push($svg)
            })
          })
          this.isHideUpload = true
          this.nextSearchPage = data['data']['next']
        })
      } else {
        this.isHideUpload = false
        this.getSysIcons(this.iconImageUrl, true)
        this.nextSearchPage = ''
      }
    } else {
      this._http.get(this.nextSearchPage, this.httpOptions).subscribe((data) => {
        this.iconData = []
        this.iconData = this.iconDataCopy
        this.iconDataCopy = []
        data['data']['results'].map((item) => {
          var that = this
          $.get(item.url, function (data) {
            var $svg = $(data).find('svg')[0]
            that.iconDataCopy.push($svg)
          })
        })
        this.iconDataCopy = this.iconData.concat(this.iconDataCopy)
        this.isHideUpload = true
        this.nextSearchPage = data['data']['next']
      })
    }
  }

  clickCloseBtn() {
    this.closeSidebarEvent.emit()
  }

  ngOnDestroy() {
    window.onresize = null
    if (!this.tabActive) {
      this.iconScroll.nativeElement.removeEventListener('scroll', this.handleScroll)
    }
  }
}
