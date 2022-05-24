/*
 * @Description: 图表表格配置项-编辑图表
 */
import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../../../states/reducers'
import * as _ from 'lodash'
import { Subscription } from 'rxjs'
import * as ProjectModels from '../../../../../states/models/project.model'
import {
  UpdateCurrentProjectArticleAction,
  UpdateCurrentChartProjectArticleAction,
} from '../../../../../states/actions/project.action'
import { TabComponent } from '../../tab.component'
import { UpdateProjectContent } from '../../../../../states/models/project.model'
import * as $ from 'jquery'
import * as ProjectActions from '../../../../../states/actions/project.action'
import { NotifyChartRenderService } from '../../../../../share/services/notify-chart-render.service'
import { BsModalService, BsModalRef } from 'ngx-bootstrap'
import { UploadImgModalComponent } from '../../../../../components/modals'
import { API } from '../../../../../states/api.service'
import { HttpClient } from '@angular/common/http'
import { DataTransmissionService } from '../../../../../share/services/data-transmission.service'
import { hasMapFunc, handleNullItemMapDataFunc, isNullItemMapFunc } from './handleMap'
import { isCrossChartFunc, isBarLineChartFunc, down14Func } from './helper'
import { isLabelOne, isLabelTwo, isLabelThree, isLabelFour, isLabelFive } from './handleLabel'
import assignDeepFn from './assignDeep'
import { isAxisContainKeyFn } from './handleAxis'
import { handleAllChartsData, handleColorList } from './handleColor'
import { forkJoin } from 'rxjs/observable/forkJoin'
import { VipService } from '../../../../../share/services'

@Component({
  selector: 'lx-chart-right-settings',
  templateUrl: './chart-right-settings.component.html',
  styleUrls: ['./chart-right-settings.component.scss'],
})
export class ChartRightSettingsComponent implements TabComponent, OnInit, OnDestroy {
  // 当前选中图表数据
  _curBlock
  get curBlock() {
    if (this._curBlock) {
      return this._curBlock
    }
  }
  set curBlock(curBlock) {
    console.log(curBlock)

    this._curBlock = curBlock
    this.parseData()
  }

  @Output() toggleChart = new EventEmitter()
  @Output() toggleIcon = new EventEmitter()

  isVpl: string = 'None'
  toggleNum
  getTemplateListSubscription = new Subscription()
  getCurrentProjectSubscription = new Subscription()
  getSvgSubscription = new Subscription()

  httpOptions = { withCredentials: true }

  // 当前 PageId
  curPageId: string
  projectId: string
  projectType: string
  projectFrom: string
  currentProjectArticle: any

  newBlock: any // 拷贝当前 block，用于更新数据
  templateList: any // 图表列表

  // 输入框
  sizeLock = false
  height = '400'
  width = '500'
  rotate = 0
  ratio

  colorTypeList = ['自动', '固定颜色']

  /**--------------------映射-------------------------*/
  isShowMapPanel = false // 是否隐藏映射面板
  isCrossChart = false // 是否是 cross 图表
  isBarLineChart = false // 是否是折柱混合图表
  isNullItemMap = false // 是否需要空值处理

  // 针对分组气泡图的映射面板单独处理
  mapDropdownLists: any[]
  barLineChartLists = ['折线', '柱形']
  barLineChartMapLists = ['折线列', '柱图列']
  // 折柱混合映射
  lineBarValue
  lineBarDropdownList

  // 映射数据
  xMapList = []
  yMapList = []
  xMapName: string
  yMapName: string = '数值列'
  /**----------------------标题--------------------------*/

  showTitleSettings: boolean = true
  titleText
  titleColor

  titleFamilyIndex = -1
  titleSize
  titlePosList = ['上居左', '上居中', '上居右', '下居左', '下居中', '下居右']
  titlePos = -1
  showBlockTitle: boolean = false

  /*----------------------标签---------------------*/

  isLabelOne = false
  isLabelTwo = false
  isLabelThree = false
  isLabelFour = false
  isLabelFive = false

  // 标签面板
  labelPosList = []
  labelPosList1 = []
  labelPosList2 = []
  labelPosList4 = []

  labelPos = -1
  labelPos1 = -1
  labelPos2 = -1
  labelPos4 = -1

  // 标签面板
  labelBarPosList = []
  labelBarPos = -1

  // 标签面板
  labelLinePosList = []
  labelLinePos = -1

  labelContentOption = []
  labelContentOption1 = []
  labelContentOption2 = []
  labelContentOption3 = []

  labelContentPos = -1

  labelinitColor

  // 标签字体
  labelFontFamilyIndex
  labelFontFamilyIndex1
  labelFontFamilyIndex2
  labelFontFamilyIndex3
  labelFontFamilyIndex4

  // 进度图标签颜色，字体，字体大小
  labelProgessNumberColor
  labelProgessTextColor

  // 字体
  labelProgessNumberFontIndex = 0
  labelProgessTextFontIndex = 0

  // 字体大小
  labelProgessNumberFontSize
  labelProgessTextFontSize

  /*----------------------轴、网格线---------------------*/
  // 包含 X / Y 系列 的轴数组
  axisXYArr = []
  // 网格线 横向 / 纵向 all 数组里有xy, none 表示没有 x 表示横向 y表示纵向
  gridXYSet = new Set()
  // 网格线线条样式
  gridLineStyle = [
    '<svg width="65" height="7"><line stroke-dasharray="65" x1="0" y1="1" x2="66" y2="1" stroke-width="2" stroke="#ffffff"></line></svg>',
    '<svg width="65" height="7"><line stroke-dasharray="4, 2" x1="0" y1="1" x2="66" y2="1" stroke-width="2" stroke="#ffffff"></line></svg>',
    '<svg width="65" height="7"><line stroke-dasharray="2, 2" x1="0" y1="1" x2="66" y2="1" stroke-width="2" stroke="#ffffff"></line></svg>',
  ]
  gridLineStyleMap = {
    line: 0,
    dashline: 1,
    dottedline: 2,
  }
  // 轴 名称映射
  axisNameMap = {
    x: 'X',
    xt: 'X上',
    xb: 'X下',
    xl: 'X左',
    xr: 'X右',
    y: 'Y',
    z: 'Z',
    yt: 'Y上',
    yb: 'Y下',
    yl: 'Y左',
    yr: 'Y右',
    circular: '周向', // 与 X 一致，极坐标图表名字不一样
    radial: '径向', // 与 Y 一致，极坐标图表名字不一样
  }
  // 轴刻度下拉框
  stepOfLabelList = ['自动', '自定义']

  // 绘制方向
  totalAngleList = ['顺时针', '逆时针']
  totalAngleMap = {
    顺时针: 'clockwise',
    逆时针: 'counterclockwise',
  }

  // 径向轴角度
  radialAngleList = ['自动', '自定义']
  radialAngleMap = [null, 0]

  /*------------------------数据格式-------------------------*/
  separateArr = ['1000.00', '1,000.00', '1000,00', '1.000,00', '1 000.00', '1 000,00']
  separateIndex = 0

  /*------------------------颜色-------------------------*/

  // 颜色
  legendIndex
  legendList
  copyLegendList
  colors
  // linearGradientStyle;

  // 包含颜色的种类
  colorsType = []
  // 颜色分类映射
  colorMap = {
    single: '单色',
    multiple: '多色',
    linear: '渐变',
  }
  // 颜色列表
  colorLists = []
  // 图标列表
  iconsType = ['单个', '多个']
  // 图标分类映射
  iconMap = {
    single: '单个',
    multiple: '多个',
  }
  // 图标列表
  svgList = []

  /**-----------------------样式-------------------------------*/
  displayList

  // 针对某些特许颜色面板图表单独进行配置
  // ==========================================================================

  // 图例
  legendPosList = ['上居左', '上居中', '上居右', '下居左', '下居中', '下居右']
  legendPos

  // publishDisplayFontSize;
  // publishDisplayColor;
  // legendFontSize;
  // legendColor;

  // fontFamilyIndex;
  // axisFontFamilyIndex;
  // legendFontFamilyIndex;

  // logo 水印
  logo
  watermark
  publisher

  // 图例配置面板
  showChartLegend: boolean = false

  // 动画配置列表
  showDynamicChartAnimation: boolean = false
  // showBarTimeChartChangeColorSetting: boolean = false
  animationMoveStyleList: any[]
  animationMoveStyleIndex: Number
  animationPreviewButtonDisabled: boolean = false
  animationRankmoveTransitionDuraion: any[]
  animationDynamicChartImageList: any[]
  animationData: any
  animationTimeInterval: any
  startTime: any
  endTime: any

  // 文字映射
  fontFamilyListText = [
    // 'Noto Sans SC',
    '方正黑体',
    '方正楷体',
    '方正书宋',
    '方正仿宋',
    '站酷高端黑',
    // 'Droid Sans Fallback',
    '阿里巴巴普惠体 细体',
    '阿里巴巴普惠体 常规',
    '阿里巴巴普惠体 中等',
    '阿里巴巴普惠体 粗体',
    '阿里巴巴普惠体 特粗',
    '思源宋体 加细',
    '思源宋体 细体',
    '思源宋体 常规',
    '思源宋体 半粗',
    '思源宋体 中粗',
    '思源宋体 加粗',
    '思源宋体 超粗',
    '思源黑体 极细',
    '思源黑体 纤细',
    '思源黑体 细体',
    '思源黑体 常规',
    '思源黑体 中黑',
    '思源黑体 黑体',
    '思源黑体 粗体',
    'Caveat-Bold',
    'Caveat-Regular',
    'DancingScript-Bold',
    'DancingScript-Regular',
    'Girassol-Regular',
    'IbarraRealNova-Italic',
    'IbarraRealNova-SemiBold',
    'NotoSerif-Italic',
    'NotoSerif-Regular',
    'Orbitron Black',
    'Orbitron Light',
    'PlayfairDisplay-Bold',
    'PlayfairDisplay-Italic',
    'PlayfairDisplay-Regular',
    'Solway-ExtraBold',
    'Solway-Light',
  ]
  titleFamilyList = [
    // '<img src="/dyassets/fontSize/01.svg" />',
    '<img src="/dyassets/fontSize/02.svg" />',
    '<img src="/dyassets/fontSize/03.svg" />',
    '<img src="/dyassets/fontSize/04.svg" />',
    '<img src="/dyassets/fontSize/05.svg" />',
    '<img src="/dyassets/fontSize/06.svg" />',
    // '<img src="/dyassets/fontSize/07.svg" />',
    '<img src="/dyassets/fontSize/08.svg" />',
    '<img src="/dyassets/fontSize/09.svg" />',
    '<img src="/dyassets/fontSize/10.svg" />',
    '<img src="/dyassets/fontSize/11.svg" />',
    '<img src="/dyassets/fontSize/12.svg" />',
    '<img src="/dyassets/fontSize/13.svg" />',
    '<img src="/dyassets/fontSize/14.svg" />',
    '<img src="/dyassets/fontSize/15.svg" />',
    '<img src="/dyassets/fontSize/16.svg" />',
    '<img src="/dyassets/fontSize/17.svg" />',
    '<img src="/dyassets/fontSize/18.svg" />',
    '<img src="/dyassets/fontSize/19.svg" />',
    '<img src="/dyassets/fontSize/20.svg" />',
    '<img src="/dyassets/fontSize/21.svg" />',
    '<img src="/dyassets/fontSize/22.svg" />',
    '<img src="/dyassets/fontSize/23.svg" />',
    '<img src="/dyassets/fontSize/24.svg" />',
    '<img src="/dyassets/fontSize/25.svg" />',
    '<img src="/dyassets/fontSize/26.svg" />',
    '<img src="/dyassets/fontSize/caveatbold.svg" />',
    '<img src="/dyassets/fontSize/caveatregular.svg" />',
    '<img src="/dyassets/fontSize/dancingscriptbold.svg" />',
    '<img src="/dyassets/fontSize/dancingscriptregular.svg" />',
    '<img src="/dyassets/fontSize/girassolregular.svg" />',
    '<img src="/dyassets/fontSize/ibarrarealnovaitalic.svg" />',
    '<img src="/dyassets/fontSize/ibarrarealnovasemibold.svg" />',
    '<img src="/dyassets/fontSize/notoserifitalic.svg" />',
    '<img src="/dyassets/fontSize/notoserifregular.svg" />',
    '<img src="/dyassets/fontSize/orbitronblack.svg" />',
    '<img src="/dyassets/fontSize/orbitronlight.svg" />',
    '<img src="/dyassets/fontSize/playfairdisplaybold.svg" />',
    '<img src="/dyassets/fontSize/playfairdisplayitalic.svg" />',
    '<img src="/dyassets/fontSize/playfairdisplayregular.svg" />',
    '<img src="/dyassets/fontSize/solwayextrabold.svg" />',
    '<img src="/dyassets/fontSize/solwaylight.svg" />',
  ]

  // 词云
  isUseSingle: boolean = true
  wordCloudList = []
  minFontSizeValue: number
  maxFontSizeValue: number

  wordCloudShapeList = ['圆形', '星形', '菱形', '三角形', '箭头']
  wordCloudShapeIndex
  wordCloudTextList = ['横向', '对角线', '横竖混排', '横斜混排']
  wordCloudTextIndex

  @ViewChild('fontSizeInput') fontSizeInput: ElementRef

  // 动画
  chartPreviewButtonBackground: string = '/dyassets/images/setting/animation-play.svg'
  chartPreviewButtontitle: String = '预览'

  // 单图专用的一些配置参数和配置面板
  // ==========================================================================

  /**
   * 单图专用的一些配置参数（画布）
   */
  chartpageSizeIndex = 0
  chartPageTypes = ['5:4 (500px*400px)', '4:3 (400px*300px)', '16:9 (800px*450px)', '1:1 (500px*500px)', '自定义']
  chartPageSizes = [
    { width: '500', height: '400' },
    { width: '400', height: '300' },
    { width: '800', height: '450' },
    { width: '500', height: '500' },
    null,
  ]

  themeListIndex = 0
  themeListTypes = []
  project: any // 当前项目
  currentTheme: any // 当前主题
  themeLists: any // 主题列表

  design: ProjectModels.ProjectDesign = {
    backgroundColor: '#ffffff',
    height: '800',
    width: '400',
    sizeType: 'A4',
    ratio: null,
  }

  bsModalRef: BsModalRef

  isShowBottomBar
  oldPublishShow
  oldLogoShow
  oldBlockHeight

  // 表格图表专用配置项
  colModeStyle = ['自动', '等宽']
  colModeIndex = 0
  colModeWidth = 0

  tableChartFontFamilyIndex = 0
  tableChartThemeColorList: any

  headerColorList: string[] = ['单色填充', '间隔填充']
  headerColorListIndex: number

  isGradientShow = true
  // 信息图配置面板
  // ----------------------------------------------

  constructor(
    private _store: Store<fromRoot.State>,
    private _router: ActivatedRoute,
    private _notifyChartRenderService: NotifyChartRenderService,
    private _modalService: BsModalService,
    private _api: API,
    private _http: HttpClient,
    private _dataTransmissionService: DataTransmissionService,
    private _vipService: VipService
  ) {
    this.projectId = this._router.snapshot.queryParams.project
    this.projectType = this._router.snapshot.queryParams.type
    this.projectFrom = this._router.snapshot.queryParams.from
  }

  ngOnInit() {
    // 判断是否会员
    this.isVpl = this._vipService.getVipLevel()
    // this._modalService.show(UploadImgModalComponent);
    let temId = this.newBlock.templateId

    if (temId === '5543734748594536502' || temId === '5543734748595436502' || temId === '114473474859453649') {
      this.isGradientShow = false
    }

    // 获取 template 列表 补齐 json
    this.getTemplateListSubscription.add(
      this._store.select(fromRoot.getChartTemplates).subscribe((data) => {
        this.templateList = data

        this.templateList.map((item) => {
          // 补对应图表的 JSON
          if (item.templateId === temId) {
            let copyItem = _.cloneDeep(item)
            let targetProps = _.cloneDeep(this.newBlock.props)
            this.newBlock.props = assignDeepFn({}, copyItem.props, targetProps)
            if (this.newBlock.props.font && this.newBlock.props.font.fontFamily === 'noto') {
              this.newBlock.props.font.fontFamily = 'Noto Sans SC'
            }
            // 针对 json 错误情况特殊处理
            this.fixOldChartJSON()
            this.updateCurBlock('redo')
          }
        })
      })
    )

    if (this.projectType === 'chart') {
      // 获取当前项目和主题
      this.getCurrentProjectSubscription
        .add(
          this._store.select(fromRoot.getCurrentChartArticle).subscribe((project) => {
            this.currentProjectArticle = _.cloneDeep(project)
            this.design.backgroundColor = this.currentProjectArticle.contents.design.backgroundColor
            this.chartPageTypes.forEach((item, index) => {
              if (item === this.design.sizeType) {
                this.chartpageSizeIndex = index
              }
            })
            if (this.currentProjectArticle.contents.pages[0].blocks.length) {
              const blockProps = this.currentProjectArticle.contents.pages[0].blocks[0].props
              if (blockProps.publishDisplay) {
                this.publisher = blockProps.publishDisplay.text
              }
              if (blockProps.publishDisplay && blockProps.logoDisplay) {
                this.isShowBottomBar = blockProps && !(!blockProps.publishDisplay.show && !blockProps.logoDisplay.show)
                const pcMobileDiff = blockProps.logoDisplay.imgHeight === '32' ? '18' : '15'
                const diffHeightNum =
                  ~~blockProps.logoDisplay.imgHeight +
                  ~~blockProps.logoDisplay.topLineHeight +
                  ~~blockProps.logoDisplay.bottomLineHeight -
                  ~~pcMobileDiff

                // 更新同步 block
                this.reloadBlock(blockProps, diffHeightNum)
                // 判断画布是否需要改变
                if (this.isShowBottomBar) {
                  let newDesign = _.cloneDeep(this.design)
                  newDesign.width = blockProps.size.width
                  newDesign.height = ~~blockProps.size.height + diffHeightNum + ''
                  this.design = newDesign
                }
              }
            }
          })
        )
        .add(
          this._store.select(fromRoot.getCurrentProjectTheme).subscribe((themeList) => {
            if (themeList) {
              this.themeLists = themeList.themes
              let theme = themeList.themes

              for (let i = 0; i < theme.length; i++) {
                this.themeListTypes[i] = this.getThemeColorZone(theme[i]['colors'])
              }
            }
          })
        )
        .add(
          this._store.select(fromRoot.getCurrentChartProjectFull).subscribe((project) => {
            this.project = project
            if (this.project.article.contents.theme) {
              //id 修改为themeId
              // const index = _.findIndex(this.themeLists, { id: this.project.article.contents.theme.themeId });
              const index = _.findIndex(this.themeLists, { themeId: this.project.article.contents.theme.themeId })
              this.themeListIndex = index !== -1 ? index : 0
            } else {
              this.themeListIndex = 0
            }
          })
        )
    }

    // 表格图表配置
    if (this.newBlock.theme) {
      this.tableChartThemeColorList = this.newBlock.theme.colors
    }

    // 显示动态图表专用动画面板，动态图表部分没有映射面板
    if (
      temId === '8000000011111111001' ||
      temId === '8000000011111111002' ||
      temId === '8000000011111111003' ||
      temId === '8000000011111111004'
    ) {
      // 重新加载动态图表的时候，让动画归位
      this._notifyChartRenderService.sendChartRender(1)
      this.showDynamicChartAnimation = true
    }

    if (this.projectType === 'chart') {
      // 更新logo水印
      this.parseLogoWatermark()
    }

    if (this.curBlock.props.titleDisplay) {
      this.showBlockTitle = this.curBlock.props.titleDisplay.show
    }

    // 动态图表初始化颜色
    if (this.showDynamicChartAnimation) {
      this.labelinitColor = _.cloneDeep(this.newBlock.props.label)
    }

    /**-----------标签初始化---------------- */
    this.initLabel()
    /**-----------轴,格线初始化------------- */
    this.initAxis()
    /**-------------映射初始化-------------- */
    this.initMap()
    /**-------------颜色初始化-------------- */
    this.initColor()
    // /**------------字体初始化--------------- */
    // this.initFont();
    /**------------图例初始化--------------- */
    this.initLegend()
  }

  ngAfterViewInit(): void {
    let scrollTop =
      $('.chart-setting-content')[0].getBoundingClientRect().height - $('.boleft')[0].getBoundingClientRect().height
    $('.panel-heading').click(() => {
      let oldScrollTop = $('.right-container').scrollTop()
      let step = 100
      let num = 1
      let v = 15
      let total = 0
      let interval = setInterval(() => {
        if (scrollTop - oldScrollTop - total < v) {
          $('.right-container').scrollTop(scrollTop)
          clearInterval(interval)
        } else {
          $('.right-container').scrollTop(oldScrollTop + v * num)
          num += 1
          total = v * num
        }
      }, (scrollTop - oldScrollTop) / v / step)
    })
    $('.loading-box').hide()
  }

  getThemeColorZone(themeColors) {
    let themeColorZone = ''
    for (let i = 0; i < 6; i++) {
      themeColorZone += `<div class="theme-color-zone" style="background:${themeColors[i]}"></div>`
    }
    return themeColorZone
  }

  // 同步 block
  reloadBlock(blockProps, diffHeightNum) {
    if (this.projectType !== 'chart') return
    const newDesign = _.cloneDeep(this.design)
    this.isShowBottomBar = blockProps.logoDisplay.show || blockProps.publishDisplay.show

    if (this.isShowBottomBar) {
      if (Math.abs(~~blockProps.size.height + diffHeightNum - ~~newDesign.height) >= 5) {
        newDesign.height = ~~blockProps.size.height + diffHeightNum + ''
      }
    } else {
      if (Math.abs(~~blockProps.size.height - ~~newDesign.height) >= 5) {
        newDesign.height = blockProps.size.height
      }
    }
    newDesign.width = blockProps.size.width
    this.design = newDesign
  }

  // 宽高
  onChartPageSizeChanged(event) {
    if (event) {
      // 更新 design
      const newDesign = _.cloneDeep(this.design)
      newDesign.width = event.value1
      newDesign.height = event.value0
      if (event.type == 'locked') {
        newDesign.ratio = event.locked ? newDesign.height / newDesign.width : null
      }
      newDesign.sizeType = '自定义'
      this.chartpageSizeIndex = 7
      this.uploadDesign(newDesign)
      const blockProps = this.newBlock.props
      const pcMobileDiff = blockProps.logoDisplay.imgHeight === '32' ? '18' : '15'
      const diffHeightNum =
        ~~blockProps.logoDisplay.imgHeight +
        ~~blockProps.logoDisplay.topLineHeight +
        ~~blockProps.logoDisplay.bottomLineHeight -
        ~~pcMobileDiff
      const isShowBottomBar = blockProps.logoDisplay.show || blockProps.publishDisplay.show
      // 更新 block
      const diffHeight = isShowBottomBar ? diffHeightNum + '' : '0'
      blockProps.size.width = event.value1
      blockProps.size.height = event.value0 - ~~diffHeight
      this.updateCurBlock()
    }
  }

  // color-picker
  public onChartPageEventHandle(data: any): void {
    const chartDesign = _.cloneDeep(this.design)
    chartDesign.backgroundColor = data
    this.uploadDesign(chartDesign)
  }

  themeListChanged(index) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-right-theme-changed-index-chart', index])
    if (this.themeLists) {
      this.currentTheme = this.themeLists[index]
      this.themeListIndex = this.themeLists[index].id
      const newProject = _.cloneDeep(this.project)
      const block = newProject.article.contents.pages[0].blocks[0]
      const newDesign = newProject.article.contents.design
      newDesign.backgroundColor = this.themeLists[index].backgroundColor
      newProject.article.contents.theme = this.themeLists[index]
      this.uploadDesign(newDesign)
      this.loadTheme(block)
      this.newBlock = block
      this.updateCurBlock()
      this._store.dispatch(
        new ProjectActions.UpdateAndExitCurrentChartProjectAction(this.projectId, {
          action: 'save_project',
          article: newProject.article,
        })
      )
    }
  }

  loadTheme(block) {
    if (block.props.axis) {
      block.props.axis.color = this.currentTheme.axis.color
      if (block.props.axis.grid) {
        block.props.axis.grid.color = this.currentTheme.grid.color
      }
    }
    block.theme = this.currentTheme
    if (block.props.font) {
      block.props.font.color = this.currentTheme.fonts.color
      block.props.font.fontFamily = this.currentTheme.fonts.fontFamily
      block.props.font.fontSize = this.currentTheme.fonts.fontSize
    }

    // 新增部分
    if (block.props.legend) {
      block.props.legend.color = this.currentTheme.fonts.color
      block.props.legend.fontFamily = this.currentTheme.fonts.fontFamily
    }

    block.props.unitDisplay.fontFamily = this.currentTheme.fonts.fontFamily
    block.props.sourceDisplay.fontFamily = this.currentTheme.fonts.fontFamily
    block.props.publishDisplay.fontFamily = this.currentTheme.fonts.fontFamily

    block.props.unitDisplay.color = this.currentTheme.fonts.accessoryColor
    block.props.sourceDisplay.color = this.currentTheme.fonts.accessoryColor
    block.props.publishDisplay.color = this.currentTheme.fonts.accessoryColor

    block.props.titleDisplay.color = this.currentTheme.titleFont.color
    block.props.titleDisplay.fontFamily = this.currentTheme.titleFont.fontFamily
  }

  uploadDesign(design, flag?) {
    let newDesign = _.cloneDeep(design)
    let newData: UpdateProjectContent = {
      target: {
        pageId: this.curPageId,
        type: 'article',
        target: flag ? 'redo' : null,
      },
      method: 'put',
      design: newDesign,
    }
    this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData))
    // 更新 pageSizeIndex
    this.design = this.currentProjectArticle.contents.design
    this.chartPageTypes.forEach((item, index) => {
      if (item === this.design.sizeType) {
        this.chartpageSizeIndex = index
      }
    })
  }

  // 推荐配置修改
  handleChangeBlockStyle(type) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', type])
    let blockProps = this.newBlock.props
    const newDesign = _.cloneDeep(this.design)
    const isShowBottomBar = blockProps.logoDisplay.show || blockProps.publishDisplay.show
    switch (type) {
      case 'pc':
        // block 调整
        blockProps.size.width = '600'
        blockProps.size.height = '470'
        // 画布调整
        if (isShowBottomBar && this.projectType === 'chart') {
          newDesign.width = '600'
          newDesign.height = '510'
        } else {
          newDesign.width = '600'
          newDesign.height = '470'
        }

        // 标题
        blockProps.titleDisplay.fontFamily = '阿里巴巴普惠体 常规'
        blockProps.titleDisplay.fontSize = '36'
        blockProps.titleDisplay.color = '#4c4c4c'
        blockProps.titleDisplay.lineHeight = '10'
        // 单位
        blockProps.unitDisplay.fontFamily = '阿里巴巴普惠体 常规'
        blockProps.unitDisplay.fontSize = '14'
        blockProps.unitDisplay.color = '#878787'
        blockProps.unitDisplay.bottomLineHeight = '15'
        // 数据来源
        blockProps.sourceDisplay.fontFamily = '阿里巴巴普惠体 常规'
        blockProps.sourceDisplay.fontSize = '14'
        blockProps.sourceDisplay.color = '#878787'
        blockProps.sourceDisplay.topLineHeight = '15'
        // 出品方
        blockProps.publishDisplay.fontFamily = '阿里巴巴普惠体 常规'
        blockProps.publishDisplay.fontSize = '14'
        blockProps.publishDisplay.color = '#878787'
        // 网格线 && 轴
        if (blockProps.axis) {
          blockProps.axis.grid.color = '#e9e9e9'
          blockProps.axis.color = '#bfbfbf'
        }
        // 文字标签
        if (blockProps.font) {
          blockProps.font.fontFamily = '阿里巴巴普惠体 常规'
          blockProps.font.fontSize = '14'
          blockProps.font.color = '#545454'
        }
        // 轴标签
        if (blockProps.label && blockProps.label.textLabel) {
          blockProps.label.textLabel.fontFamily = '阿里巴巴普惠体 常规'
          blockProps.label.textLabel.fontSize = '14'
          blockProps.label.textLabel.color = '#545454'
        }
        // 图例
        if (blockProps.legend) {
          blockProps.legend.fontFamily = '阿里巴巴普惠体 常规'
          blockProps.legend.fontSize = '14'
          blockProps.legend.color = '#545454'
          blockProps.legend.lineHeight = '15'
        }
        // LOGO
        blockProps.logoDisplay.imgHeight = '32'
        blockProps.logoDisplay.bottomLineHeight = '15'
        blockProps.logoDisplay.topLineHeight = '11'
        // Padding
        blockProps.paddings = {
          top: '20',
          bottom: '23',
          left: '24',
          right: '24',
          chartBottom: '5',
        }
        break

      case 'mobile':
        // block 调整
        blockProps.size.width = '600'
        blockProps.size.height = '509'
        // 画布调整
        if (isShowBottomBar && this.projectType === 'chart') {
          newDesign.width = '600'
          newDesign.height = '570'
        } else {
          newDesign.width = '600'
          newDesign.height = '509'
        }
        // 标题
        blockProps.titleDisplay.fontFamily = '阿里巴巴普惠体 常规'
        blockProps.titleDisplay.fontSize = '32'
        blockProps.titleDisplay.color = '#4c4c4c'
        blockProps.titleDisplay.lineHeight = '15'
        // 单位
        blockProps.unitDisplay.fontFamily = '阿里巴巴普惠体 常规'
        blockProps.unitDisplay.fontSize = '18'
        blockProps.unitDisplay.color = '#878787'
        blockProps.unitDisplay.bottomLineHeight = '20'
        // 数据来源
        blockProps.sourceDisplay.fontFamily = '阿里巴巴普惠体 常规'
        blockProps.sourceDisplay.fontSize = '18'
        blockProps.sourceDisplay.color = '#878787'
        blockProps.sourceDisplay.topLineHeight = '20'
        // 出品方
        blockProps.publishDisplay.fontFamily = '阿里巴巴普惠体 常规'
        blockProps.publishDisplay.fontSize = '18'
        blockProps.publishDisplay.color = '#878787'
        // 网格线 && 轴
        if (blockProps.axis) {
          blockProps.axis.grid.color = '#e9e9e9'
          blockProps.axis.color = '#bfbfbf'
        }
        // 文字标签
        if (blockProps.font) {
          blockProps.font.fontFamily = '阿里巴巴普惠体 常规'
          blockProps.font.fontSize = '18'
          blockProps.font.color = '#545454'
        }
        // 轴标签
        if (blockProps.label && blockProps.label.textLabel) {
          blockProps.label.textLabel.fontFamily = '阿里巴巴普惠体 常规'
          blockProps.label.textLabel.fontSize = '18'
          blockProps.label.textLabel.color = '#545454'
        }
        // 图例
        if (blockProps.legend) {
          blockProps.legend.fontFamily = '阿里巴巴普惠体 常规'
          blockProps.legend.fontSize = '18'
          blockProps.legend.color = '#545454'
          blockProps.legend.lineHeight = '20'
        }
        // LOGO
        blockProps.logoDisplay.imgHeight = '40'
        blockProps.logoDisplay.bottomLineHeight = '20'
        blockProps.logoDisplay.topLineHeight = '16'
        // Padding
        blockProps.paddings = {
          top: '30',
          bottom: '20',
          left: '15',
          right: '15',
          chartBottom: '5',
        }
        break
      default:
        break
    }

    this.updateCurBlock()
    if (this.projectType === 'chart') {
      this.uploadDesign(newDesign)
    }
  }

  // ------------------------------------ 初始化 / 格式化（parse 操作） ---------------------------------------------

  parseData() {
    this.newBlock = _.cloneDeep(this.curBlock)

    // 动画面板处理
    if (
      this.newBlock.templateId === '8000000011111111001' ||
      this.newBlock.templateId === '8000000011111111002' ||
      this.newBlock.templateId === '8000000011111111003' ||
      this.newBlock.templateId === '8000000011111111004'
    ) {
      this.showDynamicChartAnimation = true
    } else {
      this.showDynamicChartAnimation = false
    }

    // 时间间隔处理
    if (this.newBlock.props.timerControl && this.newBlock.props.timerControl.options) {
      this.animationRankmoveTransitionDuraion = this.newBlock.props.timerControl.options
    } else {
      this.animationRankmoveTransitionDuraion = [['rankmoveTransitionDuraion', '换位动画', 0.5]]
    }

    // 动画时间轴
    if (this.newBlock.props.map) {
      let mapIndex =
        this.newBlock.props.map[0][
          _.findIndex(this.newBlock.props.map[0], (o: any) => {
            return o.function === 'timeCol'
          })
        ]
      mapIndex = mapIndex ? mapIndex.index : 0

      // 圆堆积要去重
      if (this.newBlock.templateId === '8000000011111111004') {
        this.animationData = _.uniq(_.unzip(this.newBlock.dataSrc.data[0])[mapIndex].slice(1))
      } else {
        this.animationData = _.unzip(this.newBlock.dataSrc.data[0])[mapIndex].slice(1)
      }
    }

    // 更新起止时间
    if (this.newBlock.props.animation) {
      this.startTime = Math.ceil(Number(this.newBlock.props.animation.startDelay))
      this.endTime = Math.ceil(Number(this.newBlock.props.animation.endPause))
    }

    // 更新间隔时间
    if (this.newBlock.props.timerControl) {
      this.animationTimeInterval = this.newBlock.props.timerControl.frameDuration
    }

    // 词云图，散点图 ,表格 图例面板处理
    if (
      this.newBlock.templateId === '114473474859453649' ||
      (this.newBlock.templateId === '7955555555502346002' && this.newBlock.props.colors.type === 'single') ||
      this.newBlock.templateId === '7955555555502346001'
    ) {
      this.showChartLegend = true
    } else {
      this.showChartLegend = false
    }

    // 表格图表数据处理
    if (this.newBlock.templateId === '7955555555502346001') {
      const tableData = this.newBlock.props.table
      if (tableData.rowColorType === 'single') {
        this.headerColorListIndex = 0
      } else {
        this.headerColorListIndex = 1
      }
      if (tableData.columnOptions.indexOf(tableData.columnStyle) > -1) {
        this.colModeIndex = tableData.columnOptions.indexOf(tableData.columnStyle)
      } else {
        this.colModeIndex = 0
      }
      // 处理线宽
      if (tableData.columnStyle === 'equalwidth') {
        this.colModeWidth = tableData.columnWidth
      }

      // 表格图表配置
      if (this.newBlock.theme) {
        this.tableChartThemeColorList = this.newBlock.theme.colors
      }
    }

    this.parseSize()
    this.parseMap()
    this.parseColorList()
    this.parseTitle()
    this.parseLabel()
    this.parseAnimation()
    this.parseDisplay()
    this.parseLegend()
    this.initAxis()
    this.initNumberFormat()

    // 词云图面板配置
    if (this.curBlock.templateId === '114473474859453649') {
      // 字号范围
      this.minFontSizeValue = Number(this.newBlock.props.display.fontSizeMin)
      this.maxFontSizeValue = Number(this.newBlock.props.display.fontSizeMax)

      // 形状和排列方式
      switch (this.newBlock.props.display.textDirection) {
        case '横向':
          this.wordCloudTextIndex = 0
          break

        case '对角线':
          this.wordCloudTextIndex = 1
          break

        case '横竖混排':
          this.wordCloudTextIndex = 2
          break

        case '横斜混排':
          this.wordCloudTextIndex = 3
          break

        default:
          break
      }

      switch (this.newBlock.props.display.outerShape) {
        case 'circle':
          this.wordCloudShapeIndex = 0
          break

        case 'star':
          this.wordCloudShapeIndex = 1
          break

        case 'diamond':
          this.wordCloudShapeIndex = 2
          break

        case 'triangle':
          this.wordCloudShapeIndex = 3
          break

        case 'triangle-forward':
          this.wordCloudShapeIndex = 4
          break

        default:
          break
      }
    }
  }

  // 格式化 map
  parseMap() {
    this.initMap()
    if (isCrossChartFunc(this.newBlock)) {
      let dataMap = this.newBlock.props.map[0]
      const dataSrc = this.newBlock.dataSrc.data[0]

      let xIndex = _.findIndex(dataMap, (o: any) => {
        return o.function === 'objCol'
      })

      // 折柱混合单独处理
      if (isBarLineChartFunc(this.newBlock)) {
        // 初始化下拉框
        this.lineBarValue = _.drop(dataSrc[0])

        // 找到折线列
        const lineItem = dataMap.filter((item) => {
          return item['name'] === '折线列'
        })

        // 生成 map 对应配置列表以及 index
        let lineBarList = []
        _.each(dataMap, (item, index) => {
          if (item.function === 'vCol') {
            lineBarList.push({
              configurable: item.configurable,
              mapIndex: item.index,
            })
          }
        })

        // 根据配置列表以及 index 去对应的 dataSrc 当中取值
        const dataList = []
        _.each(lineBarList, (item, index) => {
          if (!item.configurable) {
            dataList.push({
              name: dataSrc[0][item.mapIndex],
              index: item.mapIndex,
              checked: false,
              show: true,
            })
          } else {
            dataList.push({
              name: dataSrc[0][item.mapIndex],
              index: item.mapIndex,
              checked: true,
              show: true,
            })
          }
        })

        // 隐藏当前下拉框选取的值 true 为折线 false 为柱状
        for (let i = 0; i < dataList.length; i++) {
          if (lineItem.length > 0 && lineItem.filter((item) => item.index - 1 === i).length > 0) {
            dataList[i].show = true
          } else {
            dataList[i].show = false
          }
        }

        this.lineBarDropdownList = dataList
      } else {
        this.xMapName = dataMap[xIndex].name
        this.xMapList = dataSrc[0][xIndex]

        let yIndexList = []
        // 补齐 map
        const dataMapLength = dataSrc[0].length - 1
        if (dataMap.length === 1) {
          for (let i = 1; i <= dataMapLength; i++) {
            dataMap.push({
              name: '数值列',
              index: i,
              allowType: ['number'],
              isLegend: false,
              function: 'vCol',
              configurable: true,
            })
          }
        }

        _.each(dataMap, (item, index) => {
          if (item.function === 'vCol') {
            yIndexList.push(item.configurable)
          }
        })

        // 根据 map 对应的列表取得 data（错位取，因为已经默认过滤掉了 dataSrc 的第一行数据）
        const dataList = []
        _.each(yIndexList, (item, index) => {
          if (!item) {
            dataList.push({
              name: dataSrc[0][index + 1],
              index: index + 1,
              checked: false,
            })
          } else {
            dataList.push({
              name: dataSrc[0][index + 1],
              index: index + 1,
              checked: true,
            })
          }
        })
        this.yMapList = dataList
      }
    }
  }

  // map 改变
  changeMapList(item) {
    const index = item.index
    item.checked = !item.checked
    // 折柱混合
    if (this.newBlock.templateId === '5544734748594536332') {
      // 找到当前勾选的对应的 index
      const mapIndex = _.findIndex(this.newBlock.props.map[0], function (o: any) {
        return o.index === index
      })

      // 去配置列表当中找到当前选中的
      const curItem = _.find(this.lineBarDropdownList, (item) => {
        return item.index === mapIndex
      })

      if (item.checked) {
        curItem.checked = true
        this.newBlock.props.map[0][mapIndex].configurable = true
      } else {
        curItem.checked = false
        this.newBlock.props.map[0][mapIndex].configurable = false
      }
    } else {
      if (item.checked) {
        this.yMapList[index - 1].checked = true
        this.newBlock.props.map[0][index].configurable = true
      } else {
        this.yMapList[index - 1].checked = false
        this.newBlock.props.map[0][index].configurable = false
      }
    }
    // 处理完映射走颜色处理逻辑
    this.colorLists = handleColorList(this.newBlock)
    this.updateCurBlock()
  }

  parseTitle() {
    if (this.newBlock.props.titleDisplay) {
      this.titleText = this.newBlock.props.titleDisplay.text
      this.titleColor = this.newBlock.props.titleDisplay.color.toString()
      this.titleSize = this.newBlock.props.titleDisplay.fontSize
      this.showBlockTitle = this.newBlock.props.titleDisplay.show

      let index = _.indexOf(this.fontFamilyListText, this.newBlock.props.titleDisplay.fontFamily)
      this.titleFamilyIndex = index === -1 ? 0 : index

      // 标题位置
      switch (this.newBlock.props.titleDisplay.yPosition) {
        case 'top':
          switch (this.newBlock.props.titleDisplay.xPosition) {
            case 'left':
              this.titlePos = 0
              break
            case 'center':
              this.titlePos = 1
              break
            case 'right':
              this.titlePos = 2
              break
            default:
              break
          }
          break
        case 'bottom':
          switch (this.newBlock.props.titleDisplay.xPosition) {
            case 'left':
              this.titlePos = 3
              break
            case 'center':
              this.titlePos = 4
              break
            case 'right':
              this.titlePos = 5
              break
            default:
              break
          }
          break
        default:
          break
      }
    } else {
      this.newBlock.props.titleDisplay = {
        text: '',
        xPosition: 'center',
        yPosition: 'top',
        fontSize: '16',
        color: '#000000',
        fontFamily: 'Noto Sans SC',
        show: true,
      }
      this.titleText = ''
      this.titleColor = '#000000'
      this.titleSize = '16'
      this.titlePos = 1
      this.titleFamilyIndex = 0
    }
  }

  parseSize() {
    this.height = this.newBlock.props.size.height
    this.width = this.newBlock.props.size.width
    this.rotate = this.newBlock.props.size.rotate
    if (this.newBlock.props.size.ratio) {
      this.ratio = this.newBlock.props.size.ratio
      this.sizeLock = true
    }
  }

  // 获取表格图表颜色
  getTableColor(color) {
    return typeof color === 'number' ? this.colors[color] : color
  }

  parseColorList() {
    if (!this.newBlock.props.colors) {
      return
    }
    this.parseColorsType()
    this.legendList = handleAllChartsData(this.newBlock)
    this.copyLegendList = _.cloneDeep(this.legendList)
    this.colorLists = handleColorList(this.newBlock)
    // 不是图标图片模式
    if (this.newBlock.props.pictures == undefined) {
      if (this.newBlock.props.colors.type === 'linear') {
        if (
          (typeof this.colorLists[0] === 'string' && this.colorLists[0].indexOf('angle') > -1) ||
          (typeof this.colorLists[1] === 'string' && this.colorLists[1].indexOf('angle') > -1)
        ) {
          this.colorLists[0] = this.newBlock.theme.colors[0]
          this.colorLists[1] = this.newBlock.theme.colors[1]
        }

        this.colorLists.length = 2
        this.copyLegendList.length = 2
      } else if (this.newBlock.props.colors.type === 'single') {
        this.colorLists.length = 1
        this.copyLegendList.length = 1
      }
    } else if (this.newBlock.props.pictures.type === 'multiple') {
      if (this.legendList.length > this.svgList.length && this.newBlock.props.pictures.svglist) {
        this.legendList.forEach(() => {
          this.svgList.push(this.newBlock.props.pictures.svglist[0])
        })
      }
    }
  }

  parseLegend() {
    if (!this.newBlock.props.legend) return
    // 图例位置
    switch (this.newBlock.props.legend.yPosition) {
      case 'top':
        switch (this.newBlock.props.legend.xPosition) {
          case 'left':
            this.legendPos = 0
            break
          case 'center':
            this.legendPos = 1
            break
          case 'right':
            this.legendPos = 2
            break
          default:
            break
        }
        break
      case 'bottom':
        switch (this.newBlock.props.legend.xPosition) {
          case 'left':
            this.legendPos = 3
            break
          case 'center':
            this.legendPos = 4
            break
          case 'right':
            this.legendPos = 5
            break
          default:
            break
        }
        break
      default:
        break
    }
  }

  // 获取对应字体的索引
  getFontFamilyIndex(familyType: string): number {
    if (typeof familyType !== 'string') {
      familyType = familyType + ''
    }
    return this.fontFamilyListText.indexOf(familyType) > -1 ? this.fontFamilyListText.indexOf(familyType) : 0
  }

  // 获取图例对应颜色
  getLegendColor(color: string | string[]) {
    return Array.isArray(color) ? color[0] : color
  }

  parseLabel() {
    this.initLabel()
    // 标签 1 正常标签 位置
    if (this.newBlock.props.label && this.newBlock.props.label.positionOptions) {
      // 下拉列表
      this.labelPosList = this.newBlock.props.label.positionOptions

      // 下拉列表默认位置
      let labelPositionSelectedIndex = this.newBlock.props.label.positionOptions.indexOf(
        this.newBlock.props.label.positionChoice
      )
      this.labelPos = labelPositionSelectedIndex = labelPositionSelectedIndex > -1 ? labelPositionSelectedIndex : 0
    }

    // 标签 1 正常标签 内容
    if (this.newBlock.props.label && this.newBlock.props.label.contentOption) {
      // 显示内容
      let labelContentOption = this.newBlock.props.label.contentOption
      let labelContentChoice = this.newBlock.props.label.contentChoice
      let checkedFlag = false
      let checkedItem = []

      // 循环遍历，生成选中数组
      for (let i = 0; i < labelContentOption.length; i++) {
        const needCheckedIndex = labelContentChoice.indexOf(labelContentOption[i])
        if (needCheckedIndex > -1) {
          checkedFlag = true
        } else {
          checkedFlag = false
        }
        checkedItem.push({
          value: labelContentOption[i],
          checked: checkedFlag,
        })
      }
      this.labelContentOption = checkedItem
    }

    // 标签 3 折住混合 下拉 位置
    if (this.newBlock.props.label && this.newBlock.props.label.barpositionOptions) {
      // 折柱混合 柱状下拉
      this.labelBarPosList = this.newBlock.props.label.barpositionOptions

      // 下折柱混合拉 设置下拉默认位置
      const labelBarPosition = this.newBlock.props.label.barpositionOptions.indexOf(
        this.newBlock.props.label.barpositionChoice
      )
      this.labelBarPos = labelBarPosition > -1 ? labelBarPosition : 0
    }

    // 标签 3 折住混合 下拉 位置
    if (this.newBlock.props.label && this.newBlock.props.label.linepositionOptions) {
      // 折柱混合 线下拉
      this.labelLinePosList = this.newBlock.props.label.linepositionOptions

      // 下折柱混合拉 设置下拉默认位置
      const labelLinePosition = this.newBlock.props.label.linepositionOptions.indexOf(
        this.newBlock.props.label.linepositionChoice
      )
      this.labelLinePos = labelLinePosition > -1 ? labelLinePosition : 0
    }

    // 标签 2 文字标签 进度图配置 文字 / 数字 字体 颜色 大小
    if (this.newBlock.props.label && this.newBlock.props.label.textLabel) {
      // 文字 / 数字 字体颜色
      this.labelProgessTextColor = this.newBlock.props.label.textLabel.color
      if (typeof this.labelProgessTextColor === 'number') {
        this.labelProgessTextColor = this.newBlock.theme.colors[this.labelProgessTextColor]
      }
      // 文字 / 数字 字体类型
      let textIndex = this.fontFamilyListText.indexOf(this.newBlock.props.label.textLabel.fontFamily)
      this.labelProgessTextFontIndex = textIndex > -1 ? textIndex : 0
      // 文字 / 数字 字体大小
      this.labelProgessTextFontSize = this.newBlock.props.label.textLabel.fontSize
    }

    // 数字标签 针对进度图等的标签 2
    if (this.newBlock.props.label && this.newBlock.props.label.numberLabel) {
      this.labelProgessNumberColor = this.newBlock.props.label.numberLabel.color
      if (typeof this.labelProgessNumberColor === 'number') {
        this.labelProgessNumberColor = this.newBlock.theme.colors[this.labelProgessNumberColor]
      }
      let numberIndex = this.fontFamilyListText.indexOf(this.newBlock.props.label.numberLabel.fontFamily)
      this.labelProgessNumberFontIndex = numberIndex > -1 ? numberIndex : 0
      this.labelProgessNumberFontSize = this.newBlock.props.label.numberLabel.fontSize
    }

    // 标签 4
    if (isLabelFour(this.newBlock)) {
      // 显示内容
      let labelContentOption1 = this.newBlock.props.label.pc_level1Label.contentOption
      let labelContentChoice1 = this.newBlock.props.label.pc_level1Label.contentChoice
      this.labelContentOption1 = this.getCheckBoxList(labelContentOption1, labelContentChoice1)

      let labelContentOption2 = this.newBlock.props.label.pc_level2Label.contentOption
      let labelContentChoice2 = this.newBlock.props.label.pc_level2Label.contentChoice
      this.labelContentOption2 = this.getCheckBoxList(labelContentOption2, labelContentChoice2)

      let labelContentOption3 = this.newBlock.props.label.pc_level3Label.contentOption
      let labelContentChoice3 = this.newBlock.props.label.pc_level3Label.contentChoice
      this.labelContentOption3 = this.getCheckBoxList(labelContentOption3, labelContentChoice3)

      let numberIndex1 = this.fontFamilyListText.indexOf(this.newBlock.props.label.pc_level1Label.fontFamily)
      this.labelFontFamilyIndex1 = numberIndex1 > -1 ? numberIndex1 : 0

      let numberIndex2 = this.fontFamilyListText.indexOf(this.newBlock.props.label.pc_level2Label.fontFamily)
      this.labelFontFamilyIndex2 = numberIndex2 > -1 ? numberIndex2 : 0

      let numberIndex3 = this.fontFamilyListText.indexOf(this.newBlock.props.label.pc_level3Label.fontFamily)
      this.labelFontFamilyIndex3 = numberIndex3 > -1 ? numberIndex3 : 0

      let numberIndex4 = this.fontFamilyListText.indexOf(this.newBlock.props.label.timeLabel.fontFamily)
      this.labelFontFamilyIndex4 = numberIndex4 > -1 ? numberIndex4 : 0

      this.labelPosList1 = this.newBlock.props.label.pc_level1Label.positionOptions
      let labelPositionSelectedIndex1 = this.newBlock.props.label.pc_level1Label.positionOptions.indexOf(
        this.newBlock.props.label.pc_level1Label.positionChoice
      )
      this.labelPos1 = labelPositionSelectedIndex1 > -1 ? labelPositionSelectedIndex1 : 0

      this.labelPosList2 = this.newBlock.props.label.pc_level1Label.positionOptions
      let labelPositionSelectedIndex2 = this.newBlock.props.label.pc_level2Label.positionOptions.indexOf(
        this.newBlock.props.label.pc_level2Label.positionChoice
      )
      this.labelPos2 = labelPositionSelectedIndex2 > -1 ? labelPositionSelectedIndex2 : 0

      this.labelPosList4 = this.newBlock.props.label.timeLabel.positionOptions
      let labelPositionSelectedIndex4 = this.newBlock.props.label.timeLabel.positionOptions.indexOf(
        this.newBlock.props.label.timeLabel.positionChoice
      )
      this.labelPos4 = labelPositionSelectedIndex4 > -1 ? labelPositionSelectedIndex4 : 0
    }
  }

  getCheckBoxList(labelContentOption, labelContentChoice) {
    let checkedFlag = false
    let checkedItem = []
    // 循环遍历，生成选中数组
    for (let i = 0; i < labelContentOption.length; i++) {
      const needCheckedIndex = labelContentChoice.indexOf(labelContentOption[i])
      if (needCheckedIndex > -1) {
        checkedFlag = true
      } else {
        checkedFlag = false
      }
      checkedItem.push({
        value: labelContentOption[i],
        checked: checkedFlag,
      })
    }
    return checkedItem
  }

  parseAnimation() {
    if (this.newBlock.props.animation) {
      this.animationMoveStyleList = this.newBlock.props.animation.moveOptions
      let animationIndex = _.indexOf(this.animationMoveStyleList, this.newBlock.props.animation.moveStyle)
      this.animationMoveStyleIndex = animationIndex === -1 ? 0 : animationIndex
    }
    if (this.newBlock.props.pictures) {
      this.animationDynamicChartImageList = this.newBlock.props.pictures.urlList
    } else {
      this.animationDynamicChartImageList = []
    }
  }

  parseDisplay() {
    if (this.newBlock.props.display) {
      this.displayList = Object.keys(this.newBlock.props.display)
    }
  }

  // 初始化水印 logo
  parseLogoWatermark() {
    this.getUserLogoWatermark().then(() => {
      this.newBlock.props.logoDisplay.imgUrl = this.logo
      this.newBlock.props.watermarkDisplay.imgUrl = this.watermark
      this.newBlock.props.publishDisplay.text = this.publisher
      this._dataTransmissionService.sendLogoWatermark({ isShow: true, data: this.newBlock })
      this.updateCurBlock('redo')
    })
  }

  // 重置水印 logo
  resetLogoAndWatermark(type) {
    const url = `${this._api.getOldUrl()}/vis/dychart/watermark_and_logo/0/`
    return this._http.put(url, { option: type }, this.httpOptions)
  }

  // ------------------------------------ 初始化自动以组件数据 ---------------------------------------------

  onSizeChanged(event) {
    this.newBlock.props.size.height = event.value0
    this.newBlock.props.size.width = event.value1
    this.newBlock.props.size.rotate = event.value2
    if (event.type === 'locked') {
      this.newBlock.props.size.ratio = event.locked
        ? this.newBlock.props.size.height / this.newBlock.props.size.width
        : null

      this.ratio = this.newBlock.props.size.ratio
    }

    this.updateCurBlock()
  }

  onDropDownChanged(label, index) {
    // 针对分组气泡图，圆堆积图，散点图，维诺图（顺序依次如下）的映射面板单独处理
    if (
      this.curBlock.templateId === '4612096174443311107' ||
      this.curBlock.templateId === '8000000011111111004' ||
      this.curBlock.templateId === '7955555555502346002' ||
      this.curBlock.templateId === '7955555777700001201'
    ) {
      if (this.mapDropdownLists[index] === '(空)') {
        this.newBlock.props.map[0][
          _.findIndex(this.newBlock.props.map[0], function (o: any) {
            return o.name === label
          })
        ].index = null

        // 散点图 分组气泡图在分类映射为空时颜色面板调整为单色
        if (this.curBlock.templateId === '7955555555502346002' || this.curBlock.templateId === '4612096174443311107') {
          this.showChartLegend = true
          this.newBlock.props.colors.type = 'single'
          this.newBlock.props.colors.list.length = 1
        }
      } else {
        this.newBlock.props.map[0][
          _.findIndex(this.newBlock.props.map[0], function (o: any) {
            return o.name === label
          })
        ].index = index

        // 散点图，分组气泡图，维诺图在分类映射非空时颜色面板还原为 multiple
        if (
          this.curBlock.templateId === '7955555555502346002' ||
          this.curBlock.templateId === '4612096174443311107' ||
          this.curBlock.templateId === '7955555777700001201'
        ) {
          this.showChartLegend = false
          this.newBlock.props.colors.type = 'multiple'
          const colorsList = this.newBlock.props.colors.list
          const legendLength = _.uniq(_.unzip(this.newBlock.dataSrc.data[0])[0]).slice(1).length
          const colorsListLength = colorsList.length
          const diffNum = ~~(legendLength - colorsListLength)
          const newColorLists = _.cloneDeep(colorsList)
          const lastNum = newColorLists.pop()
          if (typeof lastNum === 'number') {
            for (let i = 0; i < diffNum; i++) {
              let num = lastNum + i + 1
              if (num > 14) {
                num = down14Func(num)
              }
              this.newBlock.props.colors.list.push(num)
            }
          } else {
            for (let i = 0; i < diffNum; i++) {
              let num = i
              if (num > 14) {
                num = down14Func(num)
              }
              this.newBlock.props.colors.list.push(num)
            }
          }
        }
      }
    } else {
      this.newBlock.props.map[0][
        _.findIndex(this.newBlock.props.map[0], function (o: any) {
          return o.name === label
        })
      ].index = index
    }
    // 处理完映射走颜色处理逻辑
    this.colorLists = handleColorList(this.newBlock)
    this.updateCurBlock()
  }

  onCheckboxChanged(value) {
    console.log(value)
  }

  onSwitchChanged(value) {
    console.log(value)
  }

  // ------------------------------------ 标签 ---------------------------------------------

  // 初始化标签
  initLabel() {
    // 是否有标签
    if (this.newBlock.props.label) {
      this.isLabelThree = isLabelThree(this.newBlock)
      // 是否是折柱混合
      if (!this.isLabelThree) {
        this.isLabelFour = isLabelFour(this.newBlock)
        // 是否是圆堆积图
        if (!this.isLabelFour) {
          this.isLabelFive = isLabelFive(this.newBlock)
          // 是否是动态图表
          if (!this.isLabelFive) {
            this.isLabelOne = isLabelOne(this.newBlock)
            // 是否是有display属性
            if (!this.isLabelOne) {
              this.isLabelTwo = isLabelTwo(this.newBlock)
            }
          }
        }
      }
    }
  }

  handlelabel(val, item, response) {
    this.newBlock.props.label[response][item] = val
    this.updateCurBlock()
  }

  // 改变 label 中的属性值
  changeLabelProp(obj, prop, subProp?) {
    if (subProp) {
      this.newBlock.props.label[prop][subProp] = obj.target.value
    } else {
      this.newBlock.props.label[prop] = obj.target.value
    }
    this.updateCurBlock()
  }

  // 标签是否显示
  lableSwitch(isShow) {
    this.newBlock.props.label.display = isShow
    this.updateCurBlock()
  }

  lableSwitchTip5(isShow, type) {
    this.newBlock.props.label[type].show = isShow
    this.updateCurBlock()
  }

  labelProgessSwitch(isShow, type = 'text') {
    if (type === 'text') {
      this.newBlock.props.label.textLabel.show = isShow
    } else {
      this.newBlock.props.label.numberLabel.show = isShow
    }
    this.updateCurBlock()
  }

  // 标签折住是否显示
  lableBarLineSwitch(isShow, type) {
    // 改变柱状还是折线
    if (type === 'bar') {
      this.newBlock.props.label.bardisplay = isShow
    } else {
      this.newBlock.props.label.linedisplay = isShow
    }
    this.updateCurBlock()
  }

  // 标签位置
  changeLabelPos(index, type = 'nomal') {
    let posChoice = 'positionChoice'
    let positions = 'positionOptions'
    switch (type) {
      case 'nomal':
        positions = 'positionOptions'
        posChoice = 'positionChoice'
        break
      case 'bar':
        positions = 'barpositionOptions'
        posChoice = 'barpositionChoice'
        break
      case 'line':
        positions = 'linepositionOptions'
        posChoice = 'linepositionChoice'
        break
      default:
        posChoice = 'positionChoice'
        positions = 'positionOptions'
        break
    }
    this.newBlock.props.label[posChoice] = this.newBlock.props.label[positions][index]
    this.updateCurBlock()
  }

  // 改变玉玦图标签位置
  changeLabelTwoPos(index: number, type: 'numberLabel' | 'textLabel') {
    this.newBlock.props.label[type].positionChoice = this.newBlock.props.label[type].positionOptions[index]
    this.updateCurBlock()
  }

  changeLabelPosTip5(index, type, selector, list) {
    if (selector.indexOf('Choice') !== -1 && selector !== 'positionChoice') {
      this.newBlock.props.label[type][selector] = this.newBlock.props.label[type][list][index].split()
    } else {
      this.newBlock.props.label[type][selector] = this.newBlock.props.label[type][list][index]
    }

    if (type === 'rl_picLabel' && this.newBlock.props.label[type][list][index] === '圆形') {
      this.newBlock.props.label.rl_textLabel.positionChoice = '居右'
      this.newBlock.props.label.rl_picLabel.endPointHeight = 10
      this.newBlock.props.label.rl_picLabel.picHeight = 10
      this.newBlock.props.label.rl_textLabel.color = null
      this.newBlock.props.label.rl_numberLabel.color = null
    } else if (type === 'rl_picLabel' && this.newBlock.props.label[type][list][index] === '方形') {
      this.newBlock.props.label.rl_textLabel.positionChoice = '换行'
      this.newBlock.props.label.rl_picLabel.endPointHeight = 45
      this.newBlock.props.label.rl_picLabel.picHeight = 40
      this.newBlock.props.label.rl_textLabel.color = '#ffffffff'
      this.newBlock.props.label.rl_numberLabel.color = '#ffffffff'
    } else if (type === 'nl_picLabel' && this.newBlock.props.label[type][list][index] === '圆形') {
      this.newBlock.props.label.nl_textLabel.positionChoice = '居右'
      this.newBlock.props.label.nl_picLabel.endPointHeight = 10
      this.newBlock.props.label.nl_picLabel.picHeight = 10
      this.newBlock.props.label.nl_textLabel.color = null
      this.newBlock.props.label.nl_numberLabel.color = null
    } else if (type === 'nl_picLabel' && this.newBlock.props.label[type][list][index] === '方形') {
      this.newBlock.props.label.nl_textLabel.positionChoice = '换行'
      this.newBlock.props.label.nl_picLabel.endPointHeight = 45
      this.newBlock.props.label.nl_picLabel.picHeight = 40
      this.newBlock.props.label.nl_textLabel.color = '#ffffffff'
      this.newBlock.props.label.nl_numberLabel.color = '#ffffffff'
    }

    this.updateCurBlock()
  }
  // 标签显示内容更新
  changeLabelContentList(item, index) {
    let labelContentChoice = []
    item.checked = !item.checked

    for (let i = 0; i < this.labelContentOption.length; i++) {
      if (this.labelContentOption[i].checked) {
        labelContentChoice.push(this.labelContentOption[i].value)
      }
    }
    this.newBlock.props.label.contentChoice = labelContentChoice
    this.updateCurBlock()
  }

  // 标签显示内容更新
  changeLabelContentListTip5(item, index) {
    let labelContentChoice = []
    item.checked = !item.checked
    switch (index) {
      case '1':
        for (let i = 0; i < this.labelContentOption1.length; i++) {
          if (this.labelContentOption1[i].checked) {
            labelContentChoice.push(this.labelContentOption1[i].value)
          }
        }
        this.newBlock.props.label.pc_level1Label.contentChoice = labelContentChoice
        break
      case '2':
        for (let i = 0; i < this.labelContentOption2.length; i++) {
          if (this.labelContentOption2[i].checked) {
            labelContentChoice.push(this.labelContentOption2[i].value)
          }
        }
        this.newBlock.props.label.pc_level2Label.contentChoice = labelContentChoice
        break
      case '3':
        for (let i = 0; i < this.labelContentOption3.length; i++) {
          if (this.labelContentOption3[i].checked) {
            labelContentChoice.push(this.labelContentOption3[i].value)
          }
        }
        this.newBlock.props.label.pc_level3Label.contentChoice = labelContentChoice
        break
      case '4':
        for (let i = 0; i < this.labelContentOption3.length; i++) {
          if (this.labelContentOption3[i].checked) {
            labelContentChoice.push(this.labelContentOption3[i].value)
          }
        }
        this.newBlock.props.label.pc_level3Label.contentChoice = labelContentChoice
        break
      default:
        break
    }
    this.updateCurBlock()
  }

  // 标签颜色设置 针对标签 2 和标签 1 的文字标签
  changeProgessFontColor(data: any, type = 'text') {
    if (type === 'text') {
      this.newBlock.props.label.textLabel.color = data
    } else if (type === 'number') {
      this.newBlock.props.label.numberLabel.color = data
    } else {
      this.newBlock.props.label[type].color = data
    }
    this.updateCurBlock()
  }

  // 自动固定色的切换
  changeDrop(index, type = 'text', item) {
    if (this.labelinitColor[type][item] === null) {
      this.labelinitColor[type][item] = '#333333ff'
    }
    this.newBlock.props.label[type][item] = index === 0 ? null : this.labelinitColor[type][item]
    this.updateCurBlock()
  }

  // 改变标签字体设置， 针对标签 2
  changeLabelFontFamily(index, type = 'text') {
    if (type === 'text') {
      this.newBlock.props.label.textLabel.fontFamily = this.fontFamilyListText[index]
    } else if (type === 'number') {
      this.newBlock.props.label.numberLabel.fontFamily = this.fontFamilyListText[index]
    } else if (type === 'font') {
      this.newBlock.props.font.fontFamily = this.fontFamilyListText[index]
    } else {
      this.newBlock.props.label[type].fontFamily = this.fontFamilyListText[index]
    }
    this.updateCurBlock()
  }

  // 改变标签字体大小设置， 针对标签 2 和 普通标签文字字体部分
  changeProgessFontSize(fontSize: string, type = 'text') {
    if (type === 'text') {
      this.newBlock.props.label.textLabel.fontSize = fontSize
    } else if (type === 'number') {
      this.newBlock.props.label.numberLabel.fontSize = fontSize
    } else if (type === 'font') {
      this.newBlock.props.font.fontSize = fontSize
    } else {
      this.newBlock.props.label[type].fontSize = fontSize
    }
    this.updateCurBlock('redo')
  }

  // ------------------------------------ 标题 ---------------------------------------------

  // 标题
  changeTitleName(event) {
    this.newBlock.props.titleDisplay.text = event.currentTarget.value
    this.updateCurBlock()
  }

  changeTitleColor(data: any) {
    this.newBlock.props.titleDisplay.color = data
    this.updateCurBlock()
  }

  changeTitleFontFamily(index) {
    this.newBlock.props.titleDisplay.fontFamily = this.fontFamilyListText[index]
    this.updateCurBlock()
  }

  changeTitleFontSize(fontSize: string) {
    this.newBlock.props.titleDisplay.fontSize = fontSize
    this.updateCurBlock()
  }

  changeTitlePos(index) {
    switch (index) {
      case 0:
        this.newBlock.props.titleDisplay.xPosition = 'left'
        this.newBlock.props.titleDisplay.yPosition = 'top'
        break
      case 1:
        this.newBlock.props.titleDisplay.xPosition = 'center'
        this.newBlock.props.titleDisplay.yPosition = 'top'
        break
      case 2:
        this.newBlock.props.titleDisplay.xPosition = 'right'
        this.newBlock.props.titleDisplay.yPosition = 'top'
        break
      case 3:
        this.newBlock.props.titleDisplay.xPosition = 'left'
        this.newBlock.props.titleDisplay.yPosition = 'bottom'
        break
      case 4:
        this.newBlock.props.titleDisplay.xPosition = 'center'
        this.newBlock.props.titleDisplay.yPosition = 'bottom'
        break
      case 5:
        this.newBlock.props.titleDisplay.xPosition = 'right'
        this.newBlock.props.titleDisplay.yPosition = 'bottom'
        break
      default:
        break
    }
    this.updateCurBlock()
  }

  titleSwitch(isShow) {
    this.newBlock.props.titleDisplay.show = isShow
    this.updateCurBlock()
  }

  // ------------------------------------ 颜色 ---------------------------------------------
  initColor() {
    this.parseColorsType()
    this.parseIcons()
  }

  // 处理颜色类型
  parseColorsType() {
    if (this.newBlock.props.colors && this.newBlock.props.colors.colorControlers) {
      let { colorControlers } = this.newBlock.props.colors
      colorControlers.forEach((item) => {
        if (this.colorMap[item]) {
          this.colorsType.push(this.colorMap[item])
        }
      })
      this.colorsType = Array.from(new Set(this.colorsType))
    }
  }

  // 处理 icon
  parseIcons() {
    if (this.newBlock.props.pictures && this.newBlock.props.pictures.svglist) {
      this.svgList = _.cloneDeep(this.newBlock.props.pictures.svglist)
    } else {
      return
    }

    // 处理 svg
    this.getSvgSubscription.add(
      this._dataTransmissionService.getSvg().subscribe((res) => {
        if (this.curBlock.blockId === res.blockId) {
          if (this.newBlock.props.pictures.type === 'multiple') {
            this.newBlock.props.pictures.svglist[this.toggleNum] = res.svg
            this.svgList[this.toggleNum] = res.svg
          } else if (this.curBlock.props.pictures.type === 'single') {
            this.newBlock.props.pictures.svglist[0] = res.svg
            this.svgList[0] = res.svg
          }
          this.updateCurBlock()
        }
      })
    )
  }

  // 处理切换颜色类型
  handleColorTypeChange(index) {
    this.newBlock.props.colors.type = this.handleTypeTransform(this.colorMap, this.colorsType, index)
    // 只有 icon 与 picture 不需要截断 保证单色多个图标
    if (this.newBlock.props.pictures == undefined) {
      this.colorLists = handleColorList(this.newBlock)

      if (this.newBlock.props.colors.type === 'linear') {
        // this.colorLists.length = 2;
        if (
          (typeof this.colorLists[0] === 'string' && this.colorLists[0].indexOf('angle') > -1) ||
          (typeof this.colorLists[1] === 'string' && this.colorLists[1].indexOf('angle') > -1)
        ) {
          this.colorLists[0] = this.newBlock.theme.colors[0]
          this.colorLists[1] = this.newBlock.theme.colors[1]
        }

        this.copyLegendList.length = 2
      } else if (this.newBlock.props.colors.type === 'single') {
        // this.colorLists.length = 1;
        this.copyLegendList.length = 1
      }
    } else {
      // 图标或者图片保留第一个颜色，别的不用
      if (this.newBlock.props.colors.type === 'multiple') {
        let firstColor = this.colorLists[0]
        this.colorLists.length = 0
        this.colorLists[0] = firstColor
        this.colorLists = handleColorList(this.newBlock)
      }
    }
    this.updateCurBlock()
  }

  // 处理切换 icon 颜色类型
  handleIconTypeChange(index) {
    this.newBlock.props.pictures.type = this.handleTypeTransform(this.iconMap, this.iconsType, index)
    if (this.newBlock.props.pictures.type === 'single') {
      this.svgList.length = 1
    }
    if (this.newBlock.props.pictures.type === 'multiple' && this.legendList.length > this.svgList.length) {
      this.svgList = []
      this.legendList.forEach(() => {
        this.svgList.push(this.newBlock.props.pictures.svglist[0])
      })
    }
    this.newBlock.props.pictures.svglist = this.svgList
    this.updateCurBlock()
  }

  // 根据值找到对象中的 key
  handleTypeTransform(map, typeArr, index) {
    let keyString = ''
    Object.keys(map).forEach((key) => {
      if (map[key] === typeArr[index]) {
        keyString = key
      }
    })
    return keyString
  }

  // 处理更改颜色 (单色 / 多色 / 渐变)
  handleColorChange(color: string | number, index: number) {
    // 处理主题色改为数字情况
    this.colorLists[index] = this.formatThemeChangeColor(color)
    this.newBlock.props.colors.list = this.colorLists
    this.updateCurBlock()
  }

  changeColor(data: any, colorType: string, i: number): void {
    let colorlist = []
    this.curBlock.theme.colors.forEach((ele) => {
      colorlist.push(ele + 'ff')
    })
    let index = colorlist.indexOf(data)
    switch (colorType) {
      case 'multiple':
        this.newBlock.props.colors.list[i] = index === -1 ? data : index
        this.updateCurBlock()
        break
      case 'single':
        this.newBlock.props.colors.list[i] = index === -1 ? data : index
        this.updateCurBlock()
        break
      case 'linear':
        this.newBlock.props.colors.list[i] = index === -1 ? data : index
        this.updateCurBlock()
        break
      default:
        break
    }
  }

  // 如果颜色面板选择的是主题颜色，['#111', '#222'] ==> [1, 2]
  formatThemeChangeColor(data) {
    const index = _.findIndex(this.curBlock.theme.colors, (item) => {
      return item + 'ff' === data
    })
    return index > -1 ? index : data
  }

  // 转换数字到主题色
  transformNumber2ThemeColor(color): string {
    if (typeof color === 'number') {
      return this.newBlock.theme.colors[color]
    }
    return color
  }

  // 换取切换颜色面板时候的 legendList
  getChangeColorLegendList() {
    let colorLegendList
    switch (this.newBlock.templateSwitch) {
      case 'key-value':
        colorLegendList = _.unzip(this.newBlock.dataSrc.data[0])[0]
        if (colorLegendList.length > 0) {
          return colorLegendList.slice(1)
        }
        break
      case 'obj-n-value-time':
        // 动态圆堆积图需要单独处理
        let mapIndex = 1
        let levelOen =
          this.newBlock.props.map[0][
            _.findIndex(this.newBlock.props.map[0], (o: any) => {
              return o.name === '层级1'
            })
          ].index
        let levelTwo =
          this.newBlock.props.map[0][
            _.findIndex(this.newBlock.props.map[0], (o: any) => {
              return o.name === '层级2'
            })
          ].index
        let levelThree =
          this.newBlock.props.map[0][
            _.findIndex(this.newBlock.props.map[0], (o: any) => {
              return o.name === '层级3'
            })
          ].index

        if (levelOen === null) {
          mapIndex = levelTwo
          if (levelTwo === null) {
            mapIndex = levelThree
            if (levelThree === null) {
              mapIndex = 0
            } else {
              mapIndex = levelThree
            }
          } else {
            mapIndex = levelTwo
          }
        } else {
          mapIndex = levelOen
        }

        if (mapIndex === 0) {
          return []
        } else {
          return _.uniq(_.unzip(this.newBlock.dataSrc.data[0])[mapIndex].slice(1))
        }
      case 'cross-time':
        return this.newBlock.dataSrc.data[0][0].slice(1)
      default:
        break
    }
  }

  // ------------------------------------ 字体 ---------------------------------------------
  // initFont() {
  //   this.parseFont();
  // }

  // 字体
  changeFontColor(data: any) {
    this.newBlock.props.unitDisplay.color = data
    this.newBlock.props.sourceDisplay.color = data
    this.newBlock.props.publishDisplay.color = data
    this.updateCurBlock()
  }

  changeFontFamily(index) {
    this.newBlock.props.unitDisplay.fontFamily = this.fontFamilyListText[index]
    this.newBlock.props.sourceDisplay.fontFamily = this.fontFamilyListText[index]
    this.newBlock.props.publishDisplay.fontFamily = this.fontFamilyListText[index]
    this.updateCurBlock()
  }

  changeFontSize(fontSize: string) {
    this.newBlock.props.unitDisplay.fontSize = fontSize
    this.newBlock.props.sourceDisplay.fontSize = fontSize
    this.newBlock.props.publishDisplay.fontSize = fontSize
    this.updateCurBlock('redo')
  }

  // 单图专用字体配置

  // 显示单位
  handleSwitchUnitDisplay(e) {
    this.newBlock.props.unitDisplay.show = e
    this.updateCurBlock()
  }

  handleInputUnitDisplay(e) {
    this.newBlock.props.unitDisplay.text = e
    this.updateCurBlock()
  }

  // 数据来源
  handleSwitchSourceDisplay(e) {
    this.newBlock.props.sourceDisplay.show = e
    this.updateCurBlock()
  }

  handleInputSourceDisplay(e) {
    this.newBlock.props.sourceDisplay.text = e
    this.updateCurBlock()
  }

  // 出品方
  handleSwitchPublishDisplay(e) {
    this.newBlock.props.publishDisplay.show = e
    this.updateCurBlock()
    this.uploadDesign(this.design, 'redo')
  }

  handleInputPublishDisplay(e) {
    this.newBlock.props.publishDisplay.text = e
    this.updateCurBlock()
  }

  // 显示 logo
  handleSwitchLogoDisplay(e) {
    this.newBlock.props.logoDisplay.show = e
    this.updateCurBlock()
    this.uploadDesign(this.design, 'redo')
  }

  // 显示水印
  handleSwitchWatermarkDisplay(e) {
    this.newBlock.props.watermarkDisplay.show = e
    this.updateCurBlock()
  }

  // 获取水印 logo
  getUserLogoWatermark() {
    let p1 = new Promise((resolve, reject) => {
      this.getLogoWatermarkData('logo', resolve)
    })
    let p2 = new Promise((resolve, reject) => {
      this.getLogoWatermarkData('watermark', resolve)
    })
    let p3 = new Promise((resolve, reject) => {
      this.getPublisher(resolve)
    })
    return Promise.all([p1, p2, p3])
  }

  getPublisher(resolve) {
    // 处理企业用户 logo 等
    this._http.get(`${this._api.getOldUrl()}/partner/logo_info`, { withCredentials: true }).subscribe((res) => {
      if (res['resultCode'] === 1000 && res['data']) {
        const data = res['data']
        if (data.publisher) {
          this.publisher = data.publisher
        }
      }
      resolve()
    })
  }

  getLogoWatermarkData(type, resolve) {
    const url = `${this._api.getOldUrl()}/vis/dychart/watermark_and_logo/?option=${type}`
    this._http.get(url).subscribe((res) => {
      const imgs = res['data']
      if (imgs) {
        imgs.forEach((item) => {
          if (item.enable) {
            if (type === 'logo') {
              this.logo = item.url
            } else {
              this.watermark = item.url
            }
          }
          return item
        })
        resolve()
      }
    })
  }

  // -------------------------------------- 映射 -------------------------------------------------
  initMap() {
    // 初始化是否存在 map
    this.isShowMapPanel = hasMapFunc(this.curBlock)
    if (this.isShowMapPanel) {
      // 是否是 cross 表
      this.isCrossChart = isCrossChartFunc(this.curBlock)
      if (this.isCrossChart) {
        // 是否是折柱混合
        this.isBarLineChart = isBarLineChartFunc(this.curBlock)
      } else {
        // 是否手动处理空值
        this.isNullItemMap = isNullItemMapFunc(this.curBlock)
        // 处理下拉菜单
        this.mapDropdownLists = handleNullItemMapDataFunc(this.curBlock)
      }
    }
  }

  // ------------------------------------ 轴、网格线 ---------------------------------------------

  // 初始化轴网格线的 X, Y, grid 判断
  initAxis() {
    if (this.newBlock.props.axis) {
      // axis
      this.axisXYArr = []
      const xArr = isAxisContainKeyFn(this.newBlock.props.axis, 'x')
      const yArr = isAxisContainKeyFn(this.newBlock.props.axis, 'y')
      const zArr = isAxisContainKeyFn(this.newBlock.props.axis, 'z')
      const cArr = isAxisContainKeyFn(this.newBlock.props.axis, 'circular')
      const rArr = isAxisContainKeyFn(this.newBlock.props.axis, 'radial')
      this.axisXYArr = [...this.axisXYArr, ...xArr, ...yArr, ...zArr, ...cArr, ...rArr]
      // grid
      if (this.newBlock.props.axis.grid && this.newBlock.props.axis.grid.show) {
        const gridShow = this.newBlock.props.axis.grid.show
        this.gridXYSet.clear()
        if (gridShow === 'all') {
          this.gridXYSet.add('x')
          this.gridXYSet.add('y')
          // 类型是 triangle 有 z
          if (this.newBlock.props.axis.axistype === 'triangle') {
            this.gridXYSet.add('z')
          }
        } else if (gridShow === 'none') {
          this.gridXYSet.clear()
        } else {
          if (Array.isArray(gridShow)) {
            gridShow.forEach((item) => this.gridXYSet.add(item))
          } else {
            this.gridXYSet.add(gridShow)
          }
        }
      }
    }
  }

  // 获取网格线名字
  getGridName(type: string, directionType: 'x' | 'y' | 'z'): string {
    const axisNameMap = {
      default: ['横向', '纵向'],
      polar: ['周向', '径向'],
      triangle: ['x轴', 'y轴', 'z轴'],
    }
    // 输出 0 1 2
    enum directionMap {
      x,
      y,
      z,
    }
    return axisNameMap[type][directionMap[directionType]]
  }

  // 改变轴网格线 展示状态 axis.grid.show 'all', 'none', 'x', 'y'
  changeGridXYShow(flag, gridType) {
    if (flag) {
      this.gridXYSet.add(gridType)
    } else {
      if (this.gridXYSet.has(gridType)) {
        this.gridXYSet.delete(gridType)
      }
    }
    // 三元图 有 x y z 三个轴
    if (this.newBlock.props.axis.axistype === 'triangle') {
      if (this.gridXYSet.size === 3) {
        this.newBlock.props.axis.grid.show = 'all'
      } else if (this.gridXYSet.size === 0) {
        this.newBlock.props.axis.grid.show = 'none'
      } else {
        this.newBlock.props.axis.grid.show = Array.from(this.gridXYSet)
      }
    } else {
      if (this.gridXYSet.size === 2) {
        this.newBlock.props.axis.grid.show = 'all'
      } else if (this.gridXYSet.size === 0) {
        this.newBlock.props.axis.grid.show = 'none'
      } else {
        // 只有x, y的情况就只显示一个值
        this.newBlock.props.axis.grid.show = Array.from(this.gridXYSet)[0]
      }
    }
    this.updateCurBlock()
  }

  // 改变网格线颜色
  changeGridColor(data: any) {
    this.newBlock.props.axis.grid.color = data
    this.updateCurBlock()
  }

  changeGridLineWidth(data) {
    this.newBlock.props.axis.grid.gridLineWidth = data
    this.updateCurBlock()
  }

  // 改变 x y 的属性 axisType 为 x | y | yt 等 prop 表示 name 等属性
  changeXYProp(event, axisType, prop) {
    if (prop === 'labelSuffix' && event.currentTarget.value.length > 10) {
      event.currentTarget.value = event.currentTarget.value.substring(0, 10)
    }

    if (prop === 'stepOfLabel' && (event.currentTarget.value === '' || Number(event.currentTarget.value) < 0)) {
      event.currentTarget.value = 0
    }

    if (prop === 'startAngle') {
      event.currentTarget.value = this.validateNumberByRange(event.currentTarget.value, [0, 360])
    }

    if (prop === 'totalAngle') {
      event.currentTarget.value = this.validateNumberByRange(event.currentTarget.value, [1, 361])
    }

    console.log(event.currentTarget.value)
    this.newBlock.props.axis[axisType][prop] = event.currentTarget.value
    this.updateCurBlock()
  }

  // 改变轴属性 item 表示 x y y1 yl yr等
  changeAxisXY(flag, axisType, type) {
    // 处理角度
    if (type === 'labelDirection' && flag === '竖排') {
      if (this.newBlock.props.axis[axisType].labelAngle > 90) {
        this.newBlock.props.axis[axisType].labelAngle = 90
      }
      if (this.newBlock.props.axis[axisType].labelAngle < -90) {
        this.newBlock.props.axis[axisType].labelAngle = -90
      }
    }

    // 方向为自动时，轴刻度为自动 方向只存在x轴上
    if (type === 'labelDirection' && flag === '自动' && this.newBlock.props.axis[axisType].stepOfLabel !== undefined) {
      this.newBlock.props.axis[axisType].stepOfLabel = null
    }

    this.newBlock.props.axis[axisType][type] = flag

    // 轴刻度为自定义时，方向为横排 方向只存在x轴上
    if (type === 'stepOfLabel') {
      if (flag === 0) {
        this.newBlock.props.axis[axisType][type] = null
      } else if (flag === 1) {
        if (this._curBlock.templateId === '4612096174443311107') {
          this.newBlock.props.axis[axisType][type] = this.getStepOfLabelNum(axisType)
        } else {
          this.newBlock.props.axis[axisType][type] = this.getStepOfLabelNum()
        }

        if (this.newBlock.props.axis.x && this.newBlock.props.axis.x.labelDirection !== undefined) {
          this.newBlock.props.axis.x.labelDirection = '横排'
        }
      }
    }
    this.updateCurBlock()
  }

  // 改变轴属性 item 表示 x y y1 yl yr等 lx-slider组件修改不进redo池
  changeAxisXYSize(flag, axisType, type) {
    this.newBlock.props.axis[axisType][type] = flag
    this.updateCurBlock('redo')
  }

  // 改变网格线线宽
  changeAxisGrid(data, type) {
    this.newBlock.props.axis.grid[type] = data
    this.updateCurBlock('redo')
  }

  // 改变 XY 轴最小值范围
  changeAxisXYMinRange(event, axisType) {
    const targetValue = event.currentTarget.value ? event.currentTarget.value : event.target.value
    const axis = this.newBlock.props.axis[axisType]

    if (targetValue === '') {
      axis.range[0] = null
    } else {
      // 最大值存在且大于 targetValue（此时是最小值） 或者 最大值不存在
      if ((axis.range[1] && Number(targetValue) < axis.range[1]) || !axis.range[1]) {
        axis.range[0] = Number(targetValue)
      }
    }
    this.updateCurBlock()
  }

  // 改变 XY 轴最大值范围
  changeAxisXYMaxRange(event, axisType) {
    const targetValue = event.currentTarget.value ? event.currentTarget.value : event.target.value
    const axis = this.newBlock.props.axis[axisType]

    if (targetValue === '') {
      axis.range[1] = null
    } else {
      // 最小值存在且小于 targetValue（此时是最大值） 或者 最小值不存在
      if ((axis.range[0] && Number(targetValue) > axis.range[0]) || !axis.range[0]) {
        axis.range[1] = Number(targetValue)
      }
    }
    this.updateCurBlock()
  }

  // 改变网格线
  changeGridLineStyle(index) {
    // 找到对应的 key
    let lineStyle = Object.keys(this.gridLineStyleMap).filter((item) => this.gridLineStyleMap[item] === index)[0]
    this.newBlock.props.axis.grid.lineStyle = lineStyle
    this.updateCurBlock()
  }

  // 新增的轴标签设置
  handleChangeAxisLabelColor(data: any) {
    this.newBlock.props.font.color = data
    this.updateCurBlock()
  }

  handleChangeAxisFontFamily(index) {
    this.newBlock.props.font.fontFamily = this.fontFamilyListText[index]
    this.updateCurBlock()
  }

  haneleChangeAxisFontSize(fontSize: string) {
    this.newBlock.props.font.fontSize = fontSize
    this.updateCurBlock('redo')
  }

  // 格式化数据
  validateNumberByRange(data: number, range: number[]) {
    range.sort((a, b) => a - b)
    return data < range[0] ? range[0] : data >= range[1] ? data % 360 : data
  }

  /**-----------------------------------------------------------------------------------------------------------*/

  // 计算 key-value 值域
  getKeyValueRange(data) {
    let newData, dataRange
    if (data) {
      newData = data.slice(1).map((item) => Number(item))
      dataRange = [Math.min.apply(null, newData), Math.max.apply(null, newData)]
    } else {
      dataRange = []
    }
    const difVal = dataRange[1] - dataRange[0]
    const betVal = [difVal / 2 - difVal, difVal / 2 + difVal]
    return {
      dataRange,
      betVal,
    }
  }

  getCrossRange() {
    const data = _.unzip(this.newBlock.dataSrc.data[0])
    const newData = []
    let dataRange
    _.each(data.slice(1), (item, key) => {
      _.each(item.slice(1), (item) => {
        newData.push(Number(item))
      })
    })
    dataRange = [Math.min.apply(null, newData), Math.max.apply(null, newData)]
    const difVal = dataRange[1] - dataRange[0]
    const betVal = [difVal / 2 - difVal, difVal / 2 + difVal]
    return {
      dataRange,
      betVal,
    }
  }

  // ------------------------------------ 数据格式 ---------------------------------------------
  // 初始化
  initNumberFormat() {
    if (this.newBlock.props.numberFormat) {
      const index = this.separateArr.indexOf(this.newBlock.props.numberFormat.style)
      this.separateIndex = index !== -1 ? index : 0
    }
  }

  changeNumberDecimalShow(flag) {
    this.newBlock.props.numberFormat.decimalPlaces = flag ? '2' : null
    this.updateCurBlock()
  }

  handleNumberTypeChange(index) {
    this.newBlock.props.numberFormat.style = this.separateArr[index]
    this.updateCurBlock()
  }

  // 改变格式
  changeNumberDecimal(value) {
    this.newBlock.props.numberFormat.decimalPlaces = value
    this.updateCurBlock()
  }

  // ------------------------------------ 图例 ---------------------------------------------
  // 初始化
  initLegend() {
    this.parseLegend()
  }

  // 图例开关
  legendSwitch(isShow) {
    this.newBlock.props.legend.show = isShow

    this.updateCurBlock()
  }

  // 图例位置
  changeLegendPos(index) {
    switch (index) {
      case 0:
        this.newBlock.props.legend.xPosition = 'left'
        this.newBlock.props.legend.yPosition = 'top'
        break
      case 1:
        this.newBlock.props.legend.xPosition = 'center'
        this.newBlock.props.legend.yPosition = 'top'
        break
      case 2:
        this.newBlock.props.legend.xPosition = 'right'
        this.newBlock.props.legend.yPosition = 'top'
        break
      case 3:
        this.newBlock.props.legend.xPosition = 'left'
        this.newBlock.props.legend.yPosition = 'bottom'
        break
      case 4:
        this.newBlock.props.legend.xPosition = 'center'
        this.newBlock.props.legend.yPosition = 'bottom'
        break
      case 5:
        this.newBlock.props.legend.xPosition = 'right'
        this.newBlock.props.legend.yPosition = 'bottom'
        break
      default:
        break
    }

    this.updateCurBlock()
  }

  handleChangeLegendColor(data: any) {
    this.newBlock.props.legend.color = data
    this.updateCurBlock()
  }

  handleChangeLegendFontFamily(index) {
    this.newBlock.props.legend.fontFamily = this.fontFamilyListText[index]
    this.updateCurBlock()
  }

  haneleChangeLegendFontSize(fontSize: string) {
    this.newBlock.props.legend.fontSize = fontSize
    this.updateCurBlock('redo')
  }

  // ------------------------------------ 动画 -----------------------------------------------
  handleOpenChartAnimation(e) {
    this.newBlock.props.animation.transition = e
    this.updateCurBlock()
  }

  handleChartPreviewButton() {
    // 播放/暂停
    if (!this.animationPreviewButtonDisabled) {
      this._notifyChartRenderService.sendChartRender(true)
      const time =
        (~~this.newBlock.props.animation.duration +
          ~~this.newBlock.props.animation.startDelay +
          ~~this.newBlock.props.animation.endPause) *
        1000
      this.chartPreviewButtonBackground = '/dyassets/images/setting/amination-pause.svg'
      this.chartPreviewButtontitle = '停止'
      this.animationPreviewButtonDisabled = true
      setTimeout(() => {
        this.chartPreviewButtonBackground = '/dyassets/images/setting/animation-play.svg'
        this.chartPreviewButtontitle = '预览'
        this.animationPreviewButtonDisabled = false
      }, time)
    } else {
      this.chartPreviewButtonBackground = '/dyassets/images/setting/animation-play.svg'
      this.chartPreviewButtontitle = '预览'
      this.animationPreviewButtonDisabled = false
      this._notifyChartRenderService.sendChartRender(false)
    }
  }

  handleChangeChartAnimationMoveStyle(index) {
    this.newBlock.props.animation.moveStyle = this.animationMoveStyleList[index]
    this.updateCurBlock()
  }

  handleChangeChartAnimationDuration(e) {
    this.newBlock.props.animation.duration = e
    this.updateCurBlock('redo')
  }

  handleChangeChartAnimationStartDelay(e) {
    this.newBlock.props.animation.startDelay = e
    this.updateCurBlock('redo')
  }

  handleChangeChartAnimationEndPause(e) {
    this.newBlock.props.animation.endPause = e
    this.updateCurBlock('redo')
  }

  // 动态图表
  handleChangeDynamicChartFrameDuration(e) {
    this.newBlock.props.timerControl.frameDuration = e
    this.updateCurBlock('redo')
  }

  handleChangeDynamicChartRankmoveTransitionDuraion(e) {
    this.animationRankmoveTransitionDuraion = [['rankmoveTransitionDuraion', '换位动画', Number(e)]]
    this.newBlock.props.timerControl.options = [['rankmoveTransitionDuraion', '换位动画', Number(e)]]
    this.updateCurBlock('redo')
  }

  handleUploadImage(e, index) {
    e.preventDefault()
    const that = this
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('img_file', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', that._api.getUserUploadImg())
    xhr.withCredentials = true
    xhr.send(formData)
    xhr.onreadystatechange = function (data) {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
        const dataText = JSON.parse(data.target['response'])
        if (dataText.resultCode === 1000) {
          that.animationDynamicChartImageList[index] = 'http://' + dataText['data'].img_url
          that.updateCurBlock()
        }
      }
    }
  }

  deleteImgCover(index) {
    this.animationDynamicChartImageList[index] = null
    this.updateCurBlock()
  }

  handleProceeChange(e) {
    this._notifyChartRenderService.sendChartRender(e)
  }

  handleButtonClick(e) {
    if (e) {
      this._notifyChartRenderService.sendChartRender(true)
    } else {
      this._notifyChartRenderService.sendChartRender(false)
    }
  }

  handleClearD3ChartTimer(e) {
    this._notifyChartRenderService.sendChartRender(e)
  }

  handleTimeEndRender(e) {
    this._notifyChartRenderService.sendChartRender(e)
  }

  // ------------------------------------ 交互提示框（tooltip） ---------------------------------------------

  // 标注
  tooltipSwitch(isShow) {
    this.newBlock.props.tooltip = isShow
    this.updateCurBlock()
  }

  // 父组件传值，图表切换
  updateBlock(block: ProjectModels.Block, pageId?: string) {
    this.curBlock = block
    this.curPageId = pageId
  }

  // ------------------------------------ 样式 ---------------------------------------------
  handleDisplay(val, item) {
    if (val && typeof val === 'object' && val.type && val.type === 'redo') {
      this.newBlock.props.display[item] = val.value
      this.updateCurBlock('redo')
    } else {
      this.newBlock.props.display[item] = val
      this.updateCurBlock()
    }
  }

  // ------------------------------------ 方法 / 工具函数 ---------------------------------------------

  // 右侧栏被选中
  onSelected() {
    console.log('right-selected')
  }

  /** 面板主题颜色选择 **/
  // color-picker
  // chartColorChangeThemeHandle(colorType: string, i: number, color: any): void {
  //   const currentColorIndex = _.findIndex(this.newBlock.theme.colors, (n) => { return n == color });
  //   switch (colorType) {
  //     case 'multiple':
  //       if (currentColorIndex > 0) {
  //         this.newBlock.props.colors.list[i] = currentColorIndex;
  //       } else {
  //         this.newBlock.props.colors.list[i] = color;
  //       }
  //       break;
  //     case 'single':
  //       if (currentColorIndex > 0) {
  //         this.newBlock.props.colors.list[i] = currentColorIndex;
  //       } else {
  //         this.newBlock.props.colors.list[i] = color;
  //       }
  //       break;
  //     case 'linear':
  //       if (currentColorIndex > 0) {
  //         this.newBlock.props.colors.list[i] = currentColorIndex;
  //       } else {
  //         this.newBlock.props.colors.list[i] = color;
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  //   this.updateCurBlock();
  // }

  // 轴
  axisChangeThemeHandle(color) {
    this.newBlock.props.axis.color = color
    this.updateCurBlock()
  }

  // 网格线
  gridChangeThemeHandle(color) {
    if (this.newBlock.props.axis.grid) {
      this.newBlock.props.axis.grid.color = color
      this.updateCurBlock()
    }
  }

  updateCurBlock(flag?) {
    let block = _.cloneDeep(this.newBlock)
    let newData: any = {
      target: {
        blockId: block.blockId,
        pageId: this.curPageId,
        type: block.type,
        target: flag ? 'redo' : null,
      },
      method: 'put',
      block: block,
    }

    // 更新当前项目所用字体
    this.updateProjectFonts()

    if (this.projectType === 'infographic') {
      this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
    } else if (this.projectType === 'chart') {
      this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData))
    }
  }

  updateProjectFonts() {
    const projectFonts = []
    const item = _.cloneDeep(this.newBlock)
    if (item.type === 'text') {
      if (item.props.fontFamily) {
        projectFonts.push(item.props.fontFamily)
      }
    } else {
      // 文字
      if (item.props.font) {
        projectFonts.push(item.props.font.fontFamily)
      }
      // 标题
      if (item.props.titleDisplay) {
        projectFonts.push(item.props.titleDisplay.fontFamily)
      }
      // 标签
      if (item.props.label && item.props.label.textLabel) {
        projectFonts.push(item.props.label.textLabel.fontFamily)
      }
      // 附加信息
      if (item.props.sourceDisplay) {
        projectFonts.push(item.props.sourceDisplay.fontFamily)
      }
      // 图例
      if (item.props.legend) {
        projectFonts.push(item.props.legend.fontFamily)
      }
    }

    const filterFonts = _.uniq(projectFonts).map(function (item) {
      if (item === 'noto') {
        return (item = '"Noto Sans SC"')
      } else if (item === 'Droid Sans Fallback') {
        return (item = '"Droid Sans Fallback"')
      } else {
        return item
      }
    })

    $('body').attr('data-json', filterFonts)
  }

  isChinese(temp) {
    const pattern = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi
    if (pattern.exec(temp)) return true
    return false
  }

  isLengthOver(val) {
    let length = 0
    _.forEach(val, (w) => {
      if (this.isChinese(w)) {
        length += 2
      } else {
        length += 1
      }
    })

    return length > 20
  }

  cutAxisName(val) {
    let length = 0
    let index = 0
    while (length < 20) {
      if (length === 19 && this.isChinese(val[index])) {
        length += 2
      } else {
        if (this.isChinese(val[index])) {
          length += 2
        } else {
          length += 1
        }

        index++
      }
    }

    return val.slice(0, index)
  }

  // 格式化 color，[0, 1, ..] ==》 ['#111', '#222', ..]
  formatColor(list): any[] {
    try {
      const colors = _.cloneDeep(list)
      const themeColors = _.cloneDeep(this.newBlock.theme.colors)
      for (let i = 0; i < colors.length; i++) {
        if (!isNaN(colors[i])) {
          colors[i] = themeColors[colors[i]]
        }
      }
      return colors
    } catch (err) {
      console.log(err)
    }
  }

  showToggleChart(e) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-right-changechart-click'])
    $('.right-content').css('width', '280px')
    // $('.header-container').css('padding-right', '280px')
    $('.change-page').css('right', '295px')
    this.toggleChart.emit(false)
  }

  showToggleIcon(e) {
    $('.right-content').css('width', '280px')
    $('.change-page').css('right', '295px')
    this.toggleNum = e
    this.toggleIcon.emit({ flag: false, blockId: this.newBlock.blockId })
  }

  lineBarDropDownChanged(event, i) {
    // 根据下拉的值设定 map 对应项为 折线列
    const dataMap = _.drop(this.newBlock.props.map[0])
    dataMap[i]['name'] = this.barLineChartMapLists[event]

    this.updateCurBlock()
  }

  // 格式化 legend
  formatData(data) {
    const dataArray = data.dataSrc.data
    const mapArray = data.props.map
    let temIndex = {
      kIndex: '',
      vIndex: '',
    }
    const resultData = []
    for (let i = 0; i < mapArray.length; i++) {
      for (let j = 0; j < mapArray[i].length; j++) {
        if (mapArray[i][j].function === 'objCol') {
          temIndex.kIndex = mapArray[i][j].index
        }
        if (mapArray[i][j].function === 'vCol') {
          temIndex.vIndex = mapArray[i][j].index
        }
      }
      const temArr = []
      const indexArr = [temIndex.kIndex, temIndex.vIndex]
      for (let j = 1; j < dataArray[i].length; j++) {
        const el = dataArray[i][j]
        temArr.push(el[indexArr[0]])
      }
      resultData.push(temArr)
    }
    return resultData
  }

  // 字号范围（px）
  formatFontSizeInput(event) {
    if (event.keyCode == '13') {
      this.fontSizeInput.nativeElement.blur()
    }
  }

  changeFontSizeMin(event) {
    let value = Number(event.target.value)
    if (value < 12) {
      value = 12
    } else if (value > 150) {
      value = 150
    } else if (value > this.maxFontSizeValue) {
      value = 12
    }
    this.newBlock.props.display.fontSizeMin = value
    this.minFontSizeValue = value
    this.updateCurBlock()
  }

  changeFontSizeMax(event) {
    let value = Number(event.target.value)
    if (value < 12) {
      value = 12
    } else if (value > 150) {
      value = 150
    } else if (value < this.minFontSizeValue) {
      value = 150
    }
    this.newBlock.props.display.fontSizeMax = value
    this.maxFontSizeValue = value
    this.updateCurBlock()
  }

  // 形状
  changeWordCloudShape(event) {
    switch (event) {
      case 0:
        this.newBlock.props.display.outerShape = 'circle'
        break

      case 1:
        this.newBlock.props.display.outerShape = 'star'
        break

      case 2:
        this.newBlock.props.display.outerShape = 'diamond'
        break

      case 3:
        this.newBlock.props.display.outerShape = 'triangle'
        break

      case 4:
        this.newBlock.props.display.outerShape = 'triangle-forward'
        break

      default:
        break
    }
    this.updateCurBlock()
  }

  // 文字
  changeWordCloudText(event) {
    switch (event) {
      case 0:
        this.newBlock.props.display.textDirection = '横向'
        break
      case 1:
        this.newBlock.props.display.textDirection = '对角线'
        break
      case 2:
        this.newBlock.props.display.textDirection = '横竖混排'
        break
      case 3:
        this.newBlock.props.display.textDirection = '横斜混排'
        break
      default:
        break
    }
    this.updateCurBlock()
  }

  // 处理修改 logo
  handleLogoClick() {
    this.bsModalRef = this._modalService.show(UploadImgModalComponent, {
      ignoreBackdropClick: true,
      initialState: {
        type: 'logo',
        block: this.newBlock,
        projectId: this.projectId,
        curPageId: this.curPageId,
        oldImgUrl: this.newBlock.props.logoDisplay.imgUrl,
      },
    })
  }

  // 处理修改 水印
  handleWatermarkClick() {
    this.bsModalRef = this._modalService.show(UploadImgModalComponent, {
      ignoreBackdropClick: true,
      initialState: {
        type: 'watermark',
        block: this.newBlock,
        projectId: this.projectId,
        curPageId: this.curPageId,
        oldImgUrl: this.newBlock.props.watermarkDisplay.imgUrl,
      },
    })
  }

  // 重置事件
  resetHandle(type) {
    // 找到当前选中的 block 的原始数据
    const templateId = this.newBlock.templateId
    let currentBackupBlock
    _.each(this.templateList, (item) => {
      if (item.templateId === templateId) {
        currentBackupBlock = _.cloneDeep(item)
      }
    })
    switch (type) {
      // 动态图表动画
      case 'dynamic-chart':
        this.newBlock.props.timerControl = currentBackupBlock.props.timerControl
        this.newBlock.props.animation = currentBackupBlock.props.animation
        this.updateCurBlock()
        break

      // 映射
      case 'map':
        this.newBlock.props.map = currentBackupBlock.props.map
        this.parseMap()
        this.updateCurBlock()
        break

      // 标题
      case 'title':
        this.newBlock.props.titleDisplay = {
          text: this.titleText,
          xPosition: 'left',
          yPosition: 'top',
          fontSize: currentBackupBlock.props.titleDisplay.fontSize,
          color: currentBackupBlock.props.titleDisplay.color,
          fontFamily: currentBackupBlock.props.titleDisplay.fontFamily,
          show: true,
        }
        this.updateCurBlock()
        break

      // 颜色
      case 'color':
        const newColorLength = this.newBlock.props.colors.list.length
        const oldColorLength = currentBackupBlock.props.colors.list.length
        const diffLength = newColorLength - oldColorLength
        let newColorList = [...currentBackupBlock.props.colors.list]
        if (diffLength > 0) {
          for (let i = 0; i < diffLength; i++) {
            let lastColor = newColorList[newColorList.length - 1]
            if (typeof lastColor === 'string') {
              newColorList.push(down14Func(i))
            } else {
              newColorList.push(down14Func(lastColor + 1))
            }
          }
        } else if (diffLength < 0) {
          newColorList.length = newColorLength
        }
        this.newBlock.props.colors.list = newColorList
        this.newBlock.props.colors.type = currentBackupBlock.props.colors.type
        if (this.newBlock.props.pictures) {
          this.newBlock.props.pictures = currentBackupBlock.props.pictures
          this.svgList = []
        }
        this.parseColorsType()
        this.updateCurBlock()
        break

      // 轴，网格线
      case 'axis':
        this.newBlock.props.font = currentBackupBlock.props.font
        this.newBlock.props.axis = currentBackupBlock.props.axis
        this.initAxis()
        this.updateCurBlock()
        break

      // 数据格式
      case 'numberFormat':
        this.newBlock.props.numberFormat = currentBackupBlock.props.numberFormat
        this.updateCurBlock()
        break

      // 文字对象
      case 'font':
        this.newBlock.props.unitDisplay = currentBackupBlock.props.unitDisplay
        this.newBlock.props.sourceDisplay = currentBackupBlock.props.sourceDisplay
        this.newBlock.props.publishDisplay = currentBackupBlock.props.publishDisplay
        this.newBlock.props.watermarkDisplay = currentBackupBlock.props.watermarkDisplay
        this.newBlock.props.logoDisplay = currentBackupBlock.props.logoDisplay
        forkJoin(this.resetLogoAndWatermark('logo'), this.resetLogoAndWatermark('watermark')).subscribe(() => {
          this.getUserLogoWatermark().then(() => {
            this.newBlock.props.logoDisplay.imgUrl = this.logo
            this.newBlock.props.watermarkDisplay.imgUrl = this.watermark
            if (this.isVpl === 'eip1' || this.isVpl === 'eip2') {
              this.newBlock.props.publishDisplay.text = this.publisher
            }
            this.updateCurBlock()
          })
        })
        break

      // 图例
      case 'legend':
        this.newBlock.props.legend = currentBackupBlock.props.legend
        this.updateCurBlock()
        break

      // 词云图字号范围
      case 'wordCloudFontSizeRange':
        this.newBlock.props.display = currentBackupBlock.props.display
        this.updateCurBlock()
        break

      // 标签
      case 'label':
        this.newBlock.props.label = currentBackupBlock.props.label
        this.updateCurBlock()
        break

      // 样式
      case 'display':
        this.newBlock.props.display = currentBackupBlock.props.display
        this.updateCurBlock()
        break

      // 阴影
      case 'shadow':
        this.newBlock.props.shadow = currentBackupBlock.props.shadow
        this.updateCurBlock()
        break

      // 动画
      case 'animation':
        this.newBlock.props.animation = currentBackupBlock.props.animation
        this.updateCurBlock()
        break

      // 交互提示框
      case 'tooltip':
        this.newBlock.props.tooltip = currentBackupBlock.props.tooltip
        this.updateCurBlock()
        break

      // 表格图表的文字面板
      case 'table-chart-text':
        this.tableChartFontFamilyIndex = 0
        this.newBlock.props.font = currentBackupBlock.props.font
        this.updateCurBlock()
        break

      // 表格图表的样式面板
      case 'table-chart-style':
        this.newBlock.props.table = currentBackupBlock.props.table
        this.updateCurBlock()
        break

      default:
        break
    }
  }
  // ----------------------- 表格设置 -------------------------

  // 表格线宽
  handleColModeChange(index) {
    this.colModeIndex = index
    this.newBlock.props.table.columnStyle = this.newBlock.props.table.columnOptions[index]
    if (this.newBlock.props.table.columnStyle === 'equalwidth') {
      this.colModeWidth = this.newBlock.props.table.columnWidth
    }
    this.updateCurBlock()
  }

  // 处理线宽
  handleColModeWidthChange(width) {
    this.colModeWidth = width
    this.newBlock.props.table.columnWidth = this.colModeWidth
    this.updateCurBlock('redo')
  }

  // 表格图表专用
  onTableChartDropDownChanged(event) {
    this.tableChartFontFamilyIndex = event
    this.newBlock.props.font.fontFamily = this.fontFamilyListText[event]
    this.updateCurBlock()
  }

  onTableChartEventLog(data: any): void {
    // 主题色判断
    let colorlist = []
    this.curBlock.theme.colors.forEach((ele) => {
      colorlist.push(ele + 'ff')
    })
    let index = colorlist.indexOf(data)
    this.newBlock.props.font.color = index > -1 ? index : data
    this.updateCurBlock()
  }

  // 字号
  handleTableChartTextInputChange(value, type) {
    switch (type) {
      case 'opacity':
        this.newBlock.props.font.opacity = value
        break
      case 'fontSize':
        this.newBlock.props.font.fontSize = value
        break
      case 'lineHeight':
        this.newBlock.props.font.lineHeight = value
        break
      case 'letterSpacing':
        this.newBlock.props.font.letterSpacing = value
        break
      default:
        break
    }
    this.updateCurBlock('redo')
  }

  // 样式
  onTableChartTextStyleClicked(index) {
    switch (index) {
      case 0:
        this.newBlock.props.font.basic.bold = !this.newBlock.props.font.basic.bold
        break
      case 1:
        this.newBlock.props.font.basic.italic = !this.newBlock.props.font.basic.italic
        break
      case 2:
        const underline = this.newBlock.props.font.basic.underline
        this.newBlock.props.font.basic.underline = !underline
        if (!underline) {
          this.newBlock.props.font.basic.deleteline = false
        }
        break
      case 3:
        const deleteline = this.newBlock.props.font.basic.deleteline
        this.newBlock.props.font.basic.deleteline = !deleteline
        if (!underline) {
          this.newBlock.props.font.basic.underline = false
        }
        break
      case 4:
        this.newBlock.props.font.basic.align = 'left'
        break
      case 5:
        this.newBlock.props.font.basic.align = 'center'
        break
      case 6:
        this.newBlock.props.font.basic.align = 'right'
        break
      case 7:
        this.newBlock.props.font.basic.align = 'justify'
        break
      default:
        break
    }
    this.updateCurBlock()
  }

  // 表头颜色选择
  // handleChangeHeaderColor(e) {
  //   this.newBlock.props.table.headColor = e
  //   this.updateCurBlock()
  // }

  // 数据区域单色多色切换
  handleChangeDataListRange(e) {
    switch (e) {
      case 0:
        this.newBlock.props.table.rowColorType = 'single'
        break
      case 1:
        this.newBlock.props.table.rowColorType = 'double'
        break
      default:
        break
    }
    this.updateCurBlock()
  }

  // 处理数据区域颜色
  handleDataAreaColor(color, index) {
    this.newBlock.props.table.rowColor[index] = this.formatThemeChangeColor(color)
    this.updateCurBlock()
  }

  // 首行/列颜色开关
  handleFirstColRowToggle(flag, type) {
    this.newBlock.props.table[type].show = flag
    this.updateCurBlock()
  }

  // 首行/列颜色切换
  /**
   * type 行/列
   * colorType 底色/文字
   */
  handleFirstColRowColowrChange(color, type, colorType) {
    this.newBlock.props.table[type][colorType] = this.formatThemeChangeColor(color)
    this.updateCurBlock()
  }

  // 列宽切换
  handleShowEqualWidth(e) {
    this.newBlock.props.table.equalWidth = e
    this.updateCurBlock()
  }

  // 边框线颜色
  handleChangeBorderColor(color) {
    this.newBlock.props.table.strokeColor = this.formatThemeChangeColor(color)

    this.updateCurBlock()
  }

  // 边框线长宽
  handleChangeBorderWidth(e) {
    this.newBlock.props.table.strokeWidth = e
    this.updateCurBlock('redo')
  }

  onInput(value, type) {
    this.newBlock.props.shadow[type] = value
    this.updateCurBlock()
  }

  // -------------------------------------------------公用方法----------------------------------------------------------------
  // 根据选择与值获取索引
  getIndexByChoice(key, values) {
    const index = values.indexOf(key)
    return index > -1 ? index : 0
  }

  // 修复旧 JSON 存在问题的部分
  fixOldChartJSON() {
    // ------ 标签 -----
    if (!this.newBlock.props.label) return
    // display, numberLabel, textLabel 都有的情况
    if (
      this.newBlock.props.label.display !== undefined &&
      this.newBlock.props.label.textLabel !== undefined &&
      this.newBlock.props.label.numberLabel !== undefined
    ) {
      const { display, textLabel, ...otherLabelProps } = this.newBlock.props.label
      // textLabel 有 show 只删除 display
      if (textLabel.show !== undefined) {
        this.newBlock.props.label = { textLabel, ...otherLabelProps }
      } else {
        // textLabel 没有 show 删除 display textLabel
        this.newBlock.props.label = otherLabelProps
      }
    }
    // -----------------
  }
  // ------------------------------------------------------------------------------------------------------------------------

  // 处理 redo/undo
  @HostListener('mouseup', ['$event.target']) onMouseEnter(e) {
    if (e.classList.contains('progress')) {
      setTimeout(() => {
        this.updateCurBlock()
      }, 30)
    }
  }

  @HostListener('click', ['$event.target']) onMouseClick(e) {
    if (e.classList.contains('slider-button')) {
      setTimeout(() => {
        this.updateCurBlock()
      }, 30)
    }
  }

  handleValueBlurChanged(time = 10) {
    setTimeout(() => {
      this.updateCurBlock()
    }, time)
  }

  getStepOfLabelNum(axisType?) {
    let data = _.cloneDeep(this._curBlock.dataSrc.data[0])
    let numList = []
    let start,
      stop,
      count = 5
    if (
      this._curBlock.templateId === '5544734748594536495' ||
      this._curBlock.templateId === '154778102528502157' ||
      this._curBlock.templateId === '154778025133261039'
    ) {
      // 李克特量表图、百分比堆叠柱状图、百分比堆叠面积图
      start = 0
      stop = 100
    } else if (this._curBlock.templateId === '7955555555502345004') {
      //纵向堆叠面积图
      let sumList = []
      this._curBlock.props.map[0].map((item) => {
        if (item.function === 'vCol') {
          numList.push(_.unzip(data)[item.index].slice(1))
        }
      })
      sumList.length = numList[0].length

      numList.map((item, index) => {
        item.map((num, i) => {
          num = Number(num)
          sumList[i] = index === 0 ? num : sumList[i] + num
        })
      })
      start = Math.min(Math.min.apply(null, sumList), 0)
      stop = Math.max.apply(null, sumList)
    } else if (this._curBlock.templateId === '4612096174443311107') {
      this._curBlock.props.map[0].map((item) => {
        if (item.name === `${axisType.toUpperCase()}轴`) {
          numList.push(_.uniq(_.unzip(data)[item.index]).slice(1))
        }
      })
      start = Number(numList[0][0])
      stop = Number(numList[0][0])
      numList.map((item) => {
        item.map((num, index) => {
          num = Number(num)
          if (start > num) {
            start = num
          }
          if (stop < num) {
            stop = num
          }
        })
      })
      start = Math.min(start, 0)
    } else {
      this._curBlock.props.map[0].map((item) => {
        if (item.function === 'vCol') {
          numList.push(_.uniq(_.unzip(data)[item.index]).slice(1))
        }
      })
      start = Number(numList[0][0])
      stop = Number(numList[0][0])
      numList.map((item) => {
        item.map((num, index) => {
          num = Number(num)
          if (start > num) {
            start = num
          }
          if (stop < num) {
            stop = num
          }
        })
      })
    }

    var e10 = Math.sqrt(50),
      e5 = Math.sqrt(10),
      e2 = Math.sqrt(2)
    var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1
    if (error >= e10) step1 *= 10
    else if (error >= e5) step1 *= 5
    else if (error >= e2) step1 *= 2
    return stop < start ? -step1 : step1

    // var step = (stop - start) / Math.max(0, count),
    //     power = Math.floor(Math.log(step) / Math.LN10),
    //     error = step / Math.pow(10, power);

    // console.log(power >= 0
    //   ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
    //   : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1));

    // return power >= 0
    //     ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
    //     : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
  }

  setBlur(e) {
    if (e.keyCode === 13) {
      e.target.blur()
    }
  }

  ngOnDestroy(): void {
    this.getTemplateListSubscription.unsubscribe()
    this.getCurrentProjectSubscription.unsubscribe()
    this.getSvgSubscription.unsubscribe()
  }
}
