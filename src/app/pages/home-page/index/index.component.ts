import { Component, OnInit, OnDestroy } from '@angular/core'
import { IndexService, CreateProjectService } from '../../../share/services'
import * as _ from 'lodash'
import { Router } from '@angular/router'
import { API } from '../../../states/api.service'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import { HotWords } from './index.types'
import { Subscription } from 'rxjs'
import { indexChartArr } from '../../../utils/helper'
import { BsModalService } from 'ngx-bootstrap'
import { OperationComponent } from '../../../components/modals'
import { GetChartTemplateListAction } from '../../../states/actions/template.action'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'lx-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, OnDestroy {
  bannerTitle = '新岁气象常如新，镝数图表伴你行'
  headTags = {
    tags: ['图表', '数据图文'],
    showValue: '数据图文',
  }
  hotWords: HotWords[] = []
  userName = ''
  hotTemplateWords = []
  hotChartWords = []
  placeHolderText = '搜索图文模板'

  getUserInfoSubscription = new Subscription()
  getTemplateListSubscription = new Subscription()
  recommandArr = []
  chartArr = []
  chartTypes = [
    { name: '动态图表', id: 14 },
    { name: '饼图', id: 1 },
    { name: '线形图', id: 2 },
    { name: '柱状图', id: 3 },
    { name: '散点图', id: 5 },
    { name: '关系图', id: 7 },
    { name: '仪表盘', id: 8 },
  ]
  // 信息图轮播
  showInfographicList = []
  widerArr = ['微信公众号首图', '微博焦点图片']
  sortList = ['正文配图（方形）', '数据图说', '手机海报', '微信公众号首图', '简历']
  collectObj = null
  infoTypes = [
    { id: 4, name: '正文配图（横版）' },
    { id: 13, name: '数据图说' },
    { id: 9, name: '手机海报' },
    { id: 1, name: '微信公众号首图' },
    { id: 11, name: '简历' },
    { id: 2, name: '微博焦点图片' },
    { id: 5, name: '正文配图（方形）' },
    { id: 6, name: '正文配图（竖版）' },
    { id: 7, name: '图表报告' },
    { id: 12, name: '新闻长图' },
  ]

  constructor(
    private _indexService: IndexService,
    private _api: API,
    private router: Router,
    private store$: Store<fromRoot.State>,
    private _createProjectService: CreateProjectService,
    private _http: HttpClient,
    private _modalService: BsModalService
  ) {
    // 请求图表
    this.store$.dispatch(new GetChartTemplateListAction())
  }

  ngOnInit() {
    this.getTemplateListSubscription.add(
      this.store$.select(fromRoot.getChartTemplates).subscribe((data) => {
        if (data) {
          this.watchChartTemplates(data)
        }
      })
    )

    this._indexService.showInfographicList().subscribe((res) => {
      this.watchInfoList(res)
    })
    this.getSiteBannerList()
    this.getHotSearchWords()
    this.getUserInfo()
  }
  ngAfterViewInit(): void {}

  // 获取用户信息（判断是否登录）
  getUserInfo() {
    this.getUserInfoSubscription.add(
      this.store$
        .select(fromRoot.getUserInfo)
        .filter((user) => !!user)
        .subscribe((user) => {
          this.userName = user.nickname || user.loginname
        })
    )
  }

  // 获取热词
  getHotSearchWords() {
    this._indexService.gotHotSearchWords().subscribe((res) => {
      this.hotWords = res['data']
      this.hotTemplateWords = res['data']
    })
    this._indexService.gotHotSearchWords('c').subscribe((res) => {
      this.hotChartWords = res['data']
    })
  }

  // 获取首页 bannerList
  getSiteBannerList() {
    this._indexService.gotSiteSliderBanner().subscribe((res: { data: any }) => {
      const oldArr = []
      res.data.forEach((item) => {
        oldArr.push({
          bgUrl: item.image,
          name: item.title,
          link: item.link,
          desc: item.content,
        })
      })
      this.recommandArr = oldArr
    })
  }

  goNew() {
    const tempPage = window.open('', '_blank')
    tempPage.location.href = 'https://dycharts.com/appv2/#/pages/home/invite'
  }

  /**
   * @description 搜索跳转
   * @param {string} word 搜索词
   * @param {boolean} [isDeleteBtnClick] 是否是关闭按钮
   * @returns {void}
   */
  onSearch(word: string, isDeleteBtnClick = false): void {
    if (isDeleteBtnClick) return
    const typeMap = {
      图表: 'chart-template',
      数据图文: 'info-template',
    }
    if (this.headTags.showValue === '图表') {
      const url = `${this._api.getOldUrl()}/vis/dychart/log_chart_tpl_search?keyword=${word}`
      this._http.get(url).subscribe(() => {})
    }

    this.router.navigate(['/pages', 'home', typeMap[this.headTags.showValue]], { queryParams: { keyword: word } })
  }

  // 改变搜索栏搜索类型
  onchangeHeadTags(tag) {
    this.headTags.showValue = tag
    const wordMap = {
      图表: {
        words: this.hotChartWords,
        placeHolderText: '搜索图表模板',
      },
      数据图文: {
        words: this.hotTemplateWords,
        placeHolderText: '搜索图文模板',
      },
    }
    this.hotWords = wordMap[tag].words
    this.placeHolderText = wordMap[tag].placeHolderText
  }

  // 处理首页推荐 banner
  handleRecommandClick({ item, index }) {
    const tempPage = window.open('', '_blank')
    tempPage.location.href = item.link
  }

  // 接收图表
  watchChartTemplates(data) {
    const dynamicArr = ['8000000011111111001', '8000000011111111002', '8000000011111111003', '8000000011111111004']
    const newArr = [
      '7955555777700001201',
      '7955555777700001202',
      '7955555777700001203',
      '7955555777700001204',
      '7955555777700001205',
      '7955555777700001206',
      '7955555777700001207',
      '7955555777700001208',
      '7955555777700001209',
    ]
    const oldArr = []
    let temp = []
    const result = _.cloneDeep(data)
    temp = result.map((item) => {
      item['bgUrl'] = item['gif']
      item['name'] = item['title']
      if (dynamicArr.indexOf(item.templateId) > -1) {
        item['dynamicIcon'] = true
      }
      if (newArr.indexOf(item.templateId) > -1) {
        item['new'] = true
      }
      return item
    })
    indexChartArr
      .sort((a, b) => Number(a.order) - Number(b.order))
      .forEach((item) => {
        temp.forEach((_item) => {
          if (_item.templateId === item.tempId) {
            oldArr.push(_item)
          }
        })
      })
    this.chartArr = oldArr
  }

  // 接收信息图
  watchInfoList(res) {
    this.showInfographicList = []
    const result = _.cloneDeep(res['data'].list)
    this.sortList.forEach((item) => {
      result.map((_item) => {
        if (item === _item.name) {
          _item['shows'] = _item['shows'].map((it) => {
            _item['typeArr'] = []
            _item['needMore'] = true
            it['imgUrl'] = `https://image.dydata.io/${it.snapshot}`
            it['count'] = it['cite_count']
            it['collected'] = false
            return it
          })
          if (item === '正文配图（方形）') {
            _item.name = '微信配图'
            _item.needMore = false
            _item['typeArr'] = [
              { name: '方形', id: 5 },
              { name: '横板', id: 4 },
              { name: '竖版', id: 6 },
            ]
          }
          this.showInfographicList.push(_item)
        }
      })
    })
  }

  // 处理图表的点击
  handleChartsClick({ item }) {
    if (this.userName) {
      // 判断是否可以创建
      const urla = `${this._api.getOldUrl()}/vis/dychart/fork/template/${item.templateId}`
      this._createProjectService.createProject(urla, 'chart')
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(window.location.href.split('#')[0] + window.location.hash)
    }
  }

  // 处理图表上方推荐按钮点击
  hanleChartTypeClick({ item, index }) {
    this.router.navigate(['/pages', 'home', 'chart-template'], { queryParams: { index: item.id } })
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

  // 获取收藏状态
  getCollectState(itemObj) {
    if (this.userName) {
      this._indexService.searchTemplateCollectedById(itemObj.id).subscribe((data) => {
        this.collectObj = {
          index: itemObj.index,
          collected: data.islike,
        }
      })
    }
  }

  // 处理信息图编辑点击
  hanleInfoEditClick(id: string) {
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

  // 处理信息图点击
  hanleInfoClick({ id, index }, id2) {
    const indexRecommendMap = {
      '5': 'weixin',
      '13': 'tushuo',
    }
    const type = indexRecommendMap[id2]
    const tempPage = window.open('', '_blank')
    tempPage.location.href = `${window.location.href.split('#')[0]}#/pages/templates/item?id=${id}`
  }

  // 模板上方类型按钮点击 id 是模板类型（比如微信公众号首图）的 id
  hanleInfoTypeClick(obj, index: number, id) {
    const indexRecommendMap = {
      '5': 'weixin',
      '13': 'tushuo',
    }
    let num = 0
    if (obj.item.id === 0) {
      num = 1
    } else if (obj.item.id > 0) {
      num = obj.item.id - 3
    }
    // 主体逻辑
    if (obj.item.name === '更多') {
      this.router.navigate(['/pages', 'home', 'info-template'], { queryParams: { index: this.infoTypes[index].id } })
    } else {
      this.router.navigate(['/pages', 'home', 'info-template'], { queryParams: { index: obj.item.id } })
    }
  }

  IsShowOperation(): boolean {
    if (!localStorage.getItem('direct')) {
      localStorage.setItem('direct', 'seen')
      return true
    } else {
      return false
    }
  }

  ngOnDestroy(): void {
    this.getTemplateListSubscription.unsubscribe()
  }
}
