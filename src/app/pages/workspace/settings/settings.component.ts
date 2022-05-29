/*
 * @Description: Workspace右侧配置项栏
 */
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ComponentFactoryResolver,
  Input,
  ComponentRef,
} from '@angular/core'
import * as fromRoot from '../../../states/reducers'
import { Store } from '@ngrx/store'
import * as ProjectActions from '../../../states/actions/project.action'
import * as ProjectModels from '../../../states/models/project.model'
import { ActivatedRoute } from '@angular/router'
import * as _ from 'lodash'
import * as $ from 'jquery'
import { Subscription, Observable } from 'rxjs'
import { ChartDirective } from '../../../block/chart.directive'
import { filter, take } from 'rxjs/operators'
import { SettingsTemplate } from './settings-template.component'

import { ChartSettingsComponent } from './chart-settings/chart-settings.component'
import { PageSettingsComponent } from './page-settings/page-settings.component'
import { TextSettingsComponent } from './text-settings/text-settings.component'
import { ShapeSettingsComponent } from './shape-settings/shape-settings.component'
import { ImageSettingsComponent } from './image-settings/image-settings.component'
import { AudioSettingsComponent } from './audio-settings/audio-settings.component'
import { VideoSettingsComponent } from './video-settings/video-settings.component'
import { MultipleSettingsComponent } from './multiple-settings/multiple-settings.component'
import { GroupSettingsComponent } from './group-settings/group-settings.component'

@Component({
  selector: 'lx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  entryComponents: [
    ChartSettingsComponent,
    PageSettingsComponent,
    TextSettingsComponent,
    ShapeSettingsComponent,
    ImageSettingsComponent,
    AudioSettingsComponent,
    VideoSettingsComponent,
    MultipleSettingsComponent,
    GroupSettingsComponent,
  ],
})
export class SettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() selectItems: Observable<ProjectModels.ProjectContentObject[]>

  projectId: string
  projectType: string
  project: ProjectModels.ProjectInfo
  projectSubscribe = new Subscription()
  selectSubscribe = new Subscription()
  lastItem: ProjectModels.ProjectContentObject

  curSetting

  @ViewChild(ChartDirective) settingContainer: ChartDirective

  constructor(
    private _store: Store<fromRoot.State>,
    private _router: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.projectId = this._router.snapshot.queryParams.project
    this.projectType = this._router.snapshot.queryParams.type
  }

  ngOnInit() {
    if (this.projectType === 'infographic') {
      this.projectSubscribe = this._store
        .select(fromRoot.getCurrentProjectFull)
        .pipe(filter((project: ProjectModels.ProjectInfo) => project && project.id === this.projectId))
        .subscribe((project) => {
          this.project = project
          $('.iframe-box').attr('private_url', project.private_url.replace('dydata.io', 'dycharts.com'))
          project.public_url = project.public_url.replace('dydata.io', 'dycharts.com')
          project.private_url = project.private_url.replace('dydata.io', 'dycharts.com')
          this.onSelected(this.lastItem || { type: 'article' }, true)
        })
    } else if (this.projectType === 'chart') {
      this.projectSubscribe = this._store
        .select(fromRoot.getCurrentChartProjectFull)
        .pipe(filter((project: ProjectModels.ProjectInfo) => project && project.id === this.projectId))
        .subscribe((project) => {
          project.public_url = project.public_url.replace('dydata.io', 'dycharts.com')
          project.private_url = project.private_url.replace('dydata.io', 'dycharts.com')
          $('.iframe-box').attr('private_url', project.private_url.replace('dydata.io', 'dycharts.com'))
          this.project = project
          this.onSelected(this.lastItem || { type: 'article' }, true)
        })
    }

    this.selectSubscribe = this.selectItems.subscribe((objects) => {
      this.onSelected(objects[0] || { type: 'article' })
    })
  }

  ngAfterViewInit() {}

  onSelected(item: ProjectModels.ProjectContentObject, projectUpdate: boolean = false) {
    if (!this.project) {
      return
    }

    if (
      this.lastItem &&
      this.lastItem.type === item.type &&
      this.lastItem.blockId === item.blockId &&
      this.lastItem.pageId === item.pageId
    ) {
      // 选中状态下 project 更新
      if (projectUpdate && this.curSetting) {
        const data = this.selectCurBlock(item.blockId)
        if (data) {
          const newData = _.cloneDeep(data)
          ;(<SettingsTemplate>this.curSetting.instance).updateBlock(newData.block, newData.pageId)
        }
        return
      } else if (this.lastItem.type === 'multiple') {
        this.onMultipleSelected(item['data'])
      } else {
        // 两次点击对象相同
        return
      }
    }

    this.lastItem = item

    // 判断当前选中的类型
    switch (item.type) {
      case 'chart':
        this.onChartSelected(item)
        break
      case 'text':
        this.onTextSelected(item)
        break
      case 'shape':
        this.onShapeSelected(item)
        break
      case 'image':
        this.onImageSelected(item)
        break
      case 'audio':
        this.onAudioSelected(item)
        break
      case 'video':
        this.onVideoSelected(item)
        break
      case 'group':
        this.onGroupSelected(item)
        break
      case 'multiple':
        this.onMultipleSelected(item['data'])
        break
      case 'page':
      case 'article':
      default:
        this.onPageSelected(item)
        break
    }
  }

  onChartSelected(item: ProjectModels.ProjectContentObject) {
    const data = this.selectCurBlock(item.blockId)
    if (data) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChartSettingsComponent)
      this.settingContainer.viewContainerRef.clear()
      this.curSetting = this.settingContainer.viewContainerRef.createComponent(componentFactory)
      ;(<ChartSettingsComponent>this.curSetting.instance).updateBlock(data.block, data.pageId)
    }
  }

  onTextSelected(item: ProjectModels.ProjectContentObject) {
    const data = this.selectCurBlock(item.blockId)
    if (data) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TextSettingsComponent)
      this.settingContainer.viewContainerRef.clear()
      this.curSetting = this.settingContainer.viewContainerRef.createComponent(componentFactory)
      ;(<TextSettingsComponent>this.curSetting.instance).updateBlock(data.block, data.pageId)
    }
  }

  onShapeSelected(item: ProjectModels.ProjectContentObject) {
    const data = this.selectCurBlock(item.blockId)
    if (data) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ShapeSettingsComponent)
      this.settingContainer.viewContainerRef.clear()
      this.curSetting = this.settingContainer.viewContainerRef.createComponent(componentFactory)
      ;(<ShapeSettingsComponent>this.curSetting.instance).updateBlock(data.block, data.pageId)
    }
  }

  onImageSelected(item: ProjectModels.ProjectContentObject) {
    const data = this.selectCurBlock(item.blockId)
    if (data) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ImageSettingsComponent)
      this.settingContainer.viewContainerRef.clear()
      this.curSetting = this.settingContainer.viewContainerRef.createComponent(componentFactory)
      ;(<ImageSettingsComponent>this.curSetting.instance).updateBlock(data.block, data.pageId)
    }
  }

  onAudioSelected(item: ProjectModels.ProjectContentObject) {
    const data = this.selectCurBlock(item.blockId)
    if (data) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AudioSettingsComponent)
      this.settingContainer.viewContainerRef.clear()
      this.curSetting = this.settingContainer.viewContainerRef.createComponent(componentFactory)
      ;(<AudioSettingsComponent>this.curSetting.instance).updateBlock(data.block, data.pageId)
    }
  }

  onVideoSelected(item: ProjectModels.ProjectContentObject) {
    const data = this.selectCurBlock(item.blockId)
    if (data) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(VideoSettingsComponent)
      this.settingContainer.viewContainerRef.clear()
      this.curSetting = this.settingContainer.viewContainerRef.createComponent(componentFactory)
      ;(<VideoSettingsComponent>this.curSetting.instance).updateBlock(data.block, data.pageId)
    }
  }

  onMultipleSelected(data) {
    if (data) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MultipleSettingsComponent)
      this.settingContainer.viewContainerRef.clear()
      this.curSetting = this.settingContainer.viewContainerRef.createComponent(componentFactory)
      ;(<MultipleSettingsComponent>this.curSetting.instance).updateBlock(data)
    }
  }

  onGroupSelected(item: ProjectModels.ProjectContentObject) {
    const data = this.selectCurBlock(item.blockId)
    if (data) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(GroupSettingsComponent)
      this.settingContainer.viewContainerRef.clear()
      this.curSetting = this.settingContainer.viewContainerRef.createComponent(componentFactory)
      ;(<GroupSettingsComponent>this.curSetting.instance).updateBlock(data.block, data.pageId)
    }
  }

  selectCurBlock(blockId: string) {
    let newProject = null
    if (this.projectType === 'infographic') {
      this.projectSubscribe = this._store
        .select(fromRoot.getCurrentProjectFull)
        .pipe(filter((project: ProjectModels.ProjectInfo) => project && project.id === this.projectId))
        .pipe(take(1))
        .subscribe((project) => {
          newProject = project
        })
    } else if (this.projectType === 'chart') {
      this.projectSubscribe = this._store
        .select(fromRoot.getCurrentChartProjectFull)
        .pipe(filter((project: ProjectModels.ProjectInfo) => project && project.id === this.projectId))
        .pipe(take(1))
        .subscribe((project) => {
          newProject = project
        })
    }
    const pages = newProject.article.contents.pages
    const curPage = pages[0]
    const blocks = curPage.blocks
    let data = null
    // 当前选中的 block
    blocks.forEach((element) => {
      if (element.blockId === blockId) {
        data = {
          block: element,
          pageId: curPage.pageId,
        }
        return
      }
    })
    return data
  }

  onPageSelected(item: ProjectModels.ProjectContentObject) {
    const pages = this.project.article.contents.pages
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PageSettingsComponent)
    this.settingContainer.viewContainerRef.clear()
    const component = this.settingContainer.viewContainerRef.createComponent(componentFactory)
    ;(<PageSettingsComponent>component.instance).updatePage(this.project)
    this.curSetting = null
  }

  ngOnDestroy() {
    this.projectSubscribe.unsubscribe()
    this.selectSubscribe.unsubscribe()
  }
}
