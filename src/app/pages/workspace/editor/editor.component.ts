/*
 * @Description: 动态添加内容组件，监听项目改变，向子组件分发变化
 */
import {
  Component,
  OnInit,
  Input,
  ComponentFactoryResolver,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
  ElementRef,
  SimpleChanges,
} from '@angular/core'
import * as fromRoot from '../../../states/reducers'
import { Store } from '@ngrx/store'
import * as ProjectActions from '../../../states/actions/project.action'
import * as ProjectModels from '../../../states/models/project.model'
import { ActivatedRoute } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { take, filter } from 'rxjs/operators'
import { ChartDirective } from '../../../block/chart.directive'
import { PageComponent } from '../page/page.component'
import { ChartPageComponent } from '../chart-page/chart-page.component'
import { ChartMapService } from '../../../block/chart-map.service'
import * as _ from 'lodash'
import { NotifyChartRenderService } from '../../../share/services/notify-chart-render.service'
import { DataTransmissionService } from '../../../share/services'

@Component({
  selector: 'lx-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild(ChartDirective) chartHost: ChartDirective
  @Input('type') type: string
  @Input('selectItems') selectItems: Observable<ProjectModels.ProjectContentObject[]>
  @Output('selected') selected = new EventEmitter()

  projectId: string
  projectType: string
  project: ProjectModels.ProjectInfo
  mySubscription = new Subscription()
  pageComponentRefList = []
  paddingBottom: number = 100

  constructor(
    private _store: Store<fromRoot.State>,
    private _router: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private _notifyChartRenderService: NotifyChartRenderService,
    private _dataTransmissionService: DataTransmissionService
  ) {
    this.projectId = this._router.snapshot.queryParams.project
    this.projectType = this._router.snapshot.queryParams.type
  }

  ngOnInit() {
    this.paddingBottom = document.documentElement.clientHeight
    this._store.dispatch(new ProjectActions.GetProjectThemeAction())
    if (this.projectType === 'infographic') {
      this.mySubscription = this._store
        .select(fromRoot.getCurrentProjectFull)
        .pipe(
          filter((project: ProjectModels.ProjectInfo) => project && project.id === this.projectId),
          take(1)
        )
        .subscribe((project) => {
          this.project = project
          if (this.pageComponentRefList.length === 0) {
            _.each(project.article.contents.pages, (page) => {
              this.loadPage(page, page.pageId)
            })
          }
        })
    } else if (this.projectType === 'chart') {
      this.mySubscription = this._store
        .select(fromRoot.getCurrentChartProjectFull)
        .pipe(filter((project: ProjectModels.ProjectInfo) => project && project.id === this.projectId))
        .subscribe((project) => {
          this.project = project
          if (this.pageComponentRefList.length === 0) {
            _.each(project.article.contents.pages, (page) => {
              this.loadChartPage(page, page.pageId)
            })
          }
        })
    }
  }

  loadPage(page: ProjectModels.Page, id: any) {
    const viewContainerRef = this.chartHost.viewContainerRef
    viewContainerRef.clear()
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PageComponent)
    const pageComponentRef = viewContainerRef.createComponent(componentFactory)
    pageComponentRef.instance.contents = page.blocks
    pageComponentRef.instance.setting = _.merge({}, page.design, this.project.article.contents.design)
    pageComponentRef.instance.id = id
    pageComponentRef.instance.selectItems = this.selectItems
    pageComponentRef.instance.selected.subscribe((data) => {
      this.selected.emit(data)
    })
    this.pageComponentRefList.push(pageComponentRef)
  }

  loadChartPage(page: ProjectModels.Page, id: any) {
    const viewContainerRef = this.chartHost.viewContainerRef
    viewContainerRef.clear()
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChartPageComponent)
    const pageComponentRef = viewContainerRef.createComponent(componentFactory)
    pageComponentRef.instance.contents = page.blocks
    pageComponentRef.instance.setting = _.merge({}, page.design, this.project.article.contents.design)
    pageComponentRef.instance.id = id
    pageComponentRef.instance.selectItems = this.selectItems
    pageComponentRef.instance.selected.subscribe((data) => {
      this.selected.emit(data)
    })
    this.pageComponentRefList.push(pageComponentRef)
  }

  ngOnDestroy() {
    this.mySubscription.unsubscribe()
  }

  onEditorSelected(e) {
    if (this.projectType === 'infographic') {
      this._notifyChartRenderService.sendChartRender(undefined)
      if (
        e.target.classList.contains('workspace') ||
        e.target.classList.contains('edit-area') ||
        e.target.classList.contains('page-container')
      ) {
        this.changeBlurState()
        ;(document.querySelector('.magic-box') as HTMLElement).style.display = 'none'
        ;(document.querySelector('.drag-box') as HTMLElement).style.display = 'none'
        this.selected.emit({
          type: 'article',
        })
        localStorage.setItem('idList', JSON.stringify([]))
        Array.from(document.querySelectorAll('.block-container')).map((item) => item.classList.remove('is-selceted'))
        this._dataTransmissionService.sendToggleThememData(true)
      }
    }
  }

  changeBlurState() {
    const inputs = Array.from(document.querySelectorAll('input'))
    inputs.map((item) => {
      item.blur()
    })
  }
}
