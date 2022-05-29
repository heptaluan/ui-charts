import { Component, OnInit, ViewChild } from '@angular/core'
import * as fromRoot from '../../../../states/reducers'
import { Store } from '@ngrx/store'
import * as ProjectModels from '../../../../states/models/project.model'
import { TabsetComponent } from 'ngx-bootstrap'

import { PageLeftSettingsComponent } from './page-left-settings/page-left-settings.component'
import { PageRightSettingsComponent } from './page-right-settings/page-right-settings.component'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import * as $ from 'jquery'
import { DataTransmissionService } from '../../../../share/services'

@Component({
  selector: 'lx-page-settings',
  templateUrl: './page-settings.component.html',
  styleUrls: ['./page-settings.component.scss'],
})
export class PageSettingsComponent implements OnInit {
  @ViewChild('staticTab') staticTab: TabsetComponent
  @ViewChild('leftSettings') leftSettings: PageLeftSettingsComponent
  @ViewChild('rightSettings') rightSettings: PageRightSettingsComponent
  showToggleTheme: boolean = false
  themeCover: string
  mySubscription = new Subscription()
  projectType: string

  constructor(
    private _store: Store<fromRoot.State>,
    private _router: ActivatedRoute,
    private _dataTransmissionService: DataTransmissionService
  ) {}

  ngOnInit() {
    this.projectType = this._router.snapshot.queryParams.type

    // 监听主题变化
    this.mySubscription
      .add(
        this._store.select(fromRoot.getCurrentProjectArticle).subscribe((article) => {
          if (article && article.contents.theme) {
            this.themeCover = article.contents.theme.thumb
          }
        })
      )
      .add(
        this._dataTransmissionService.getToggleThememData().subscribe((res) => {
          if (res) {
            this.showToggleTheme = false
          }
        })
      )
  }

  ngAfterViewInit(): void {
    $('.loading-box').hide()
  }

  // 父组件传值
  updatePage(project: ProjectModels.ProjectInfo) {
    this.rightSettings.updatePage(project)
  }

  onTabSelect(event) {
    if (event.id === 'tab1') {
      this.leftSettings.onSelected()
    } else if (event.id === 'tab2') {
      this.rightSettings.onSelected()
    }
  }

  showToggleThemeHandle() {
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-right-theme-click'])
    $('.right-content').css('width', '280px')
    $('.change-page').css('right', '295px')
    this.showToggleTheme = true
  }

  closeToggleChart(event) {
    this.showToggleTheme = !event
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe()
  }
}
