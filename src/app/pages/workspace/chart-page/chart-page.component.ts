/*
 * @Description: chart-page 页面，负责加载页面组件
 */
import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  Output,
  EventEmitter,
  ComponentFactory,
  ComponentRef,
  ElementRef,
  Renderer2,
} from '@angular/core'
import * as ProjectModels from '../../../states/models/project.model'
import { ChartDirective } from '../../../block/chart.directive'
import { BlockComponent } from '../../../block/block.component'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import { Observable, Subscription } from 'rxjs'
import { withLatestFrom, skip } from 'rxjs/operators'
import * as _ from 'lodash'
import * as ProjectActions from '../../../states/actions/project.action'
import { ActivatedRoute } from '@angular/router'
import { UpdateProjectContent } from '../../../states/models/project.model'
import { UpdateCurrentChartProjectArticleAction } from '../../../states/actions/project.action'
import { API } from '../../../states/api.service'
import { HttpClient } from '@angular/common/http'
import { VipService, DataTransmissionService } from '../../../share/services'

export interface ComponentRefItem {
  id: any
  componentRef: ComponentRef<BlockComponent>
}

@Component({
  selector: 'lx-chart-page',
  templateUrl: './chart-page.component.html',
  styleUrls: ['./chart-page.component.scss'],
})
export class ChartPageComponent implements OnInit {
  @ViewChild(ChartDirective) chartHost: ChartDirective
  @Output('selected') selected = new EventEmitter()

  mySubscription = new Subscription()
  mySubscription2 = new Subscription()

  blockComponentRef: ComponentRefItem[] = []
  selectItems: Observable<ProjectModels.ProjectContentObject[]>

  contents: any
  article: any
  setting: any
  id: any
  project: any
  projectId: any
  blockProps: any
  themeList: any
  projectType: string
  projectFrom: string
  publishDisplayText: any
  publishDisplayImage: any
  logoDisplay: any
  chartTemplates: any[]
  design: any
  pageId

  blockLogoSrc: string = '/dyassets/images/block-logo.svg'
  logoUrl: string = `${this._api.getOldUrl()}/partner/logo_info`

  // 展示右上角 logo
  isShowLogo = false

  // 展示 水印 logo 与出品方
  isShowWatermark = false

  constructor(
    private _router: ActivatedRoute,
    private _store: Store<fromRoot.State>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _api: API,
    private _http: HttpClient,
    private _vipService: VipService,
    private _dataTransmissionService: DataTransmissionService
  ) {}

  ngOnInit() {
    this._dataTransmissionService.getLogoWatermark().subscribe((res) => {
      this.isShowWatermark = res.isShow
      if (res.data) {
        this.blockProps = _.cloneDeep(res.data.props)
        this.setPageStyle()
        this.updateBlock(this.pageId, res.data, 'redo')
      }
    })
    const newContents = _.cloneDeep(this.contents)
    if (newContents.length > 0) {
      this.blockProps = newContents[0].props
    }
    this.projectType = this._router.snapshot.queryParams.type
    this.projectFrom = this._router.snapshot.queryParams.from
    this.projectId = this._router.snapshot.queryParams.project

    this.mySubscription
      .add(
        this._store.select(fromRoot.getCurrentChartProjectFull).subscribe((project) => {
          this.project = project
        })
      )
      .add(
        this._store.select(fromRoot.getChartTemplates).subscribe((list) => {
          if (list.length > 0) {
            this.chartTemplates = list
          }
        })
      )
      .add(
        this._store.select(fromRoot.getCurrentProjectTheme).subscribe((themeList) => {
          if (themeList) {
            this.themeList = themeList
            const newProject = _.cloneDeep(this.project)
            const newThemeList = _.cloneDeep(this.themeList)
            if (!this.project.article.contents.theme) {
              newProject.article.contents.theme = newThemeList.themes[0]
              this._store.dispatch(
                new ProjectActions.UpdateAndExitCurrentChartProjectAction(newProject.id, {
                  action: 'save_project',
                  article: newProject.article,
                })
              )
            }
          }
        })
      )

    // 因为单图画布需要单独处理，提前更新
    setTimeout(() => {
      this.setPageStyle()
    }, 0)

    _.each(newContents, (content) => {
      this.loadBlock(content)
    })

    // reload 操作，首先获取两个流
    const stream1 = this._store.select(fromRoot.getCurrentChartArticle)
    const stream2 = this._store.select(fromRoot.getRecentModifiedObject)
    this.mySubscription2.add(
      stream2
        .pipe(
          skip(1),
          withLatestFrom(stream1, (modifyBlock, newArticle) => {
            let diffBlock: ProjectModels.Block
            // 根据类型更新数据
            if (newArticle.contents.pages[0].blocks.length > 0) {
              this.blockProps = newArticle.contents.pages[0].blocks[0].props
            }
            switch (modifyBlock.type) {
              case 'article':
                const newDesign = _.cloneDeep(newArticle.contents.design)
                this.setting = newDesign
                setTimeout(() => {
                  this.setPageStyle()
                }, 0)
                break
              case 'chart':
                diffBlock = _.find((<ProjectModels.InfographicProjectContents>newArticle.contents).pages[0].blocks, {
                  blockId: modifyBlock.blockId,
                })
                setTimeout(() => {
                  this.setPageStyle()
                }, 0)
                if (!diffBlock) {
                  this.deleteBlock(modifyBlock.blockId)
                } else {
                  this.reloadBlock(modifyBlock.blockId, diffBlock)
                }
                break
              default:
                break
            }
          })
        )
        .subscribe()
    )

    stream1.subscribe((res) => {
      // console.log(res);
      this.article = res.contents.design
      this.pageId = res.contents.pages[0].pageId
    })
  }

  ngAfterViewInit() {
    if (this.projectFrom === 'old') {
      // 同步 block，解决旧项目报错
      const block = _.cloneDeep(this.contents[0])
      if (!block) return
      block.props = _.cloneDeep(this.blockProps)
      setTimeout(() => {
        this.updateBlock(this.pageId, block, 'redo')
      }, 100)
    }
    // 设置右上角 page logo
    this._http.get(this.logoUrl, { withCredentials: true }).subscribe((res) => {
      if (res['resultCode'] === 1000 && res['data'] && res['data'].miniwatermark) {
        this.blockLogoSrc = res['data'].miniwatermark
      } else {
        this.blockLogoSrc = '/dyassets/images/block-logo.svg'
      }
      this.isShowLogo = true
    })
  }

  ngOnDestroy() {
    this.mySubscription.unsubscribe()
    this.mySubscription2.unsubscribe()
  }

  // getPageLogo() {
  //   const vpl = this._vipService.getVipLevel();
  //   if (vpl === 'eip2' || vpl === 'eip1' && this.blockProps.logoDisplay.imgUrl === '') {

  //   }
  // }

  setPageStyle() {
    let w = document.querySelector('.page svg')
      ? document.querySelector('.page svg').getAttribute('width')
      : this.setting.width
    let h = document.querySelector('.page svg')
      ? document.querySelector('.page svg').getAttribute('height')
      : this.setting.height
    this._renderer.setStyle(this._el.nativeElement.getElementsByClassName('page')[0], 'width', ~~w + 2 + 'px')
    this._renderer.setStyle(this._el.nativeElement.getElementsByClassName('page')[0], 'height', ~~h + 2 + 'px')

    if (this.project.article.contents.pages[0].blocks.length > 0) {
      // 补齐 datastore 图表
      if (this.projectFrom === 'datastore' && !this.blockProps.logoDisplay) {
        this.makeUpFromDataStoreChart(this.blockProps)
      }
      // 兼容空白单图
      if (!this.blockProps.publishDisplay) {
        this.makeUpFromDataStoreChart(this.blockProps)
      }
      if (this.blockProps) {
        const pcMobileDiff = this.blockProps.logoDisplay.imgHeight === '32' ? '18' : '15'
        const paddingBetween = this.blockProps.logoDisplay.imgHeight === '32' ? '0 24px' : '0 16px'
        this.logoDisplay = {
          background: this.setting.backgroundColor,
          padding: paddingBetween,
          bottom:
            -(
              ~~this.blockProps.logoDisplay.imgHeight +
              ~~this.blockProps.logoDisplay.topLineHeight +
              ~~this.blockProps.logoDisplay.bottomLineHeight -
              ~~pcMobileDiff
            ) + 'px',
        }
        this.publishDisplayText = {
          color: this.blockProps.publishDisplay.color,
          fontSize: this.blockProps.publishDisplay.fontSize + 'px',
          fontFamily: this.blockProps.publishDisplay.fontFamily,
          lineHeight:
            ~~this.blockProps.logoDisplay.imgHeight +
            ~~this.blockProps.logoDisplay.topLineHeight +
            ~~this.blockProps.logoDisplay.bottomLineHeight -
            5 +
            'px',
        }
        this.publishDisplayImage = {
          maxHeight: this.blockProps.logoDisplay.imgHeight + 'px',
          marginTop: this.blockProps.logoDisplay.topLineHeight + 'px',
          marginBottom: this.blockProps.logoDisplay.bottomLineHeight + 'px',
        }
        if (this.blockProps.watermarkDisplay.show && this.isShowWatermark) {
          // no-repeat center/contain
          this._renderer.setStyle(
            this._el.nativeElement.getElementsByClassName('page')[0],
            'background',
            `${this.setting.backgroundColor} url(${this.blockProps.watermarkDisplay.imgUrl})`
          )
        } else {
          this._renderer.setStyle(
            this._el.nativeElement.getElementsByClassName('page')[0],
            'background',
            `${this.setting.backgroundColor}`
          )
        }
      }
    }
  }

  makeUpFromDataStoreChart(blockProps) {
    const props = _.cloneDeep(blockProps)
    if (!props.legend.color) {
      props.legend.color = '#545454'
    }

    if (!props.legend.fontFamily) {
      props.legend.fontFamily = '阿里巴巴普惠体 常规'
    }

    if (!props.legend.fontSize) {
      props.legend.fontSize = '14'
    }

    if (!props.publishDisplay) {
      props.publishDisplay = {
        color: '#878787',
        fontFamily: '阿里巴巴普惠体 常规',
        fontSize: '14',
        text: '镝数出品',
      }
      if (this.projectFrom === 'datastore') {
        props.publishDisplay.show = true
      } else {
        props.publishDisplay.show = false
      }
    }

    if (!props.unitDisplay) {
      props.unitDisplay = {
        bottomLineHeight: '15',
        color: '#878787',
        fontFamily: '阿里巴巴普惠体 常规',
        fontSize: '14',
        show: false,
        text: '单位：万元',
        xPosition: 'left',
        yPosition: 'top',
      }
    }

    if (!props.sourceDisplay) {
      props.sourceDisplay = {
        color: '#878787',
        fontFamily: '阿里巴巴普惠体 常规',
        fontSize: '14',
        show: false,
        text: '数据来源：示例数据',
        topLineHeight: '15',
        xPosition: 'left',
        yPosition: 'bottom',
      }
    }

    if (!props.animation) {
      if (this.projectFrom === 'datastore') {
        props.animation = {
          duration: '2',
          easeStyle: '',
          endPause: '1',
          moveOptions: ['横向展开'],
          moveStyle: '横向展开',
          startDelay: '0',
          transition: true,
        }
      }
    }

    if (!props.watermarkDisplay) {
      props.watermarkDisplay = {
        imgHeight: '80',
        imgUrl: 'https://ss1.dydata.io/newchartWatermark.png',
        imgWidth: '80',
        show: false,
      }
      if (props.logoDisplay && props.logoDisplay.show) {
        if (this.contents.length <= 0) {
          props.logoDisplay.show = false
        } else {
          props.logoDisplay.show = true
        }
      }
    }

    if (!props.logoDisplay) {
      props.logoDisplay = {
        bottomLineHeight: '15',
        imgHeight: '32',
        imgUrl: 'https://ss1.dydata.io/newchartLogo.png',
        topLineHeight: '10',
      }
      if (this.projectFrom === 'datastore' || this.contents.length <= 0) {
        props.logoDisplay.show = true
      } else {
        props.logoDisplay.show = false
      }
    }

    this.blockProps = props
  }

  loadBlock(block) {
    try {
      const componentFactory: ComponentFactory<BlockComponent> =
        this.componentFactoryResolver.resolveComponentFactory(BlockComponent)
      const viewContainerRef = this.chartHost.viewContainerRef
      const componentRef = viewContainerRef.createComponent(componentFactory)
      componentRef.instance.blockId = block.blockId
      componentRef.instance.data = {
        setting: block,
      }
      componentRef.instance.selectItems = this.selectItems
      componentRef.instance.pageId = this.id
      componentRef.instance.selected.subscribe((evt) => {
        this.selected.emit(evt)
      })
      this.blockComponentRef.push({
        id: block.blockId,
        componentRef: componentRef,
      })
    } catch (error) {
      console.log(error)
    }
  }

  reloadBlock(blockId: String, block?: ProjectModels.Block) {
    try {
      if (!_.find(this.blockComponentRef, { id: blockId } as any)) {
        this.loadBlock(block)
        return
      }
      const componentInstance = _.find(this.blockComponentRef, { id: blockId } as any).componentRef.instance
      const newData = Object.assign({}, componentInstance.data)
      _.assign(newData, {
        setting: block,
      })
      componentInstance.data = newData
    } catch (error) {
      console.log(error)
    }
  }

  deleteBlock(blockId: string) {
    try {
      const delIndex = _.findIndex(this.blockComponentRef, { id: blockId } as any)
      if (this.blockComponentRef[delIndex]) {
        this.blockComponentRef[delIndex].componentRef.destroy()
        this.blockComponentRef.splice(delIndex, 1)
      }
    } catch (error) {
      console.log(error)
    }
  }

  updateBlock(pageId, block, flag?) {
    let newData: any = {
      target: {
        blockId: block.blockId,
        pageId: pageId,
        type: block.type,
        target: flag ? 'redo' : null,
      },
      method: 'put',
      block: block,
    }
    this._store.dispatch(new ProjectActions.UpdateCurrentChartProjectArticleAction(this.project.id, newData))
  }

  // 更新 design
  uploadDesign(design) {
    let newDesign = _.cloneDeep(design)
    let newData: UpdateProjectContent = {
      target: {
        pageId: this.id,
        type: 'article',
      },
      method: 'put',
      design: newDesign,
    }
    this._store.dispatch(new UpdateCurrentChartProjectArticleAction(this.projectId, newData))
  }
}
