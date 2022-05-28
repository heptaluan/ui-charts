/*
 * @Description: 图表表格配置项
 */
import { Component, OnInit, ViewChild } from '@angular/core'
import * as ProjectModels from '../../../../states/models/project.model'

import { TabsetComponent } from 'ngx-bootstrap'
import { ChartLeftSettingsComponent } from './chart-left-settings/chart-left-settings.component'
import { ChartRightSettingsComponent } from './chart-right-settings/chart-right-settings.component'
import { SettingsTemplate } from '../settings-template.component'
import { ToggleChartComponent } from './toggle-chart/toggle-chart.component'
import { DataTransmissionService } from '../../../../share/services/data-transmission.service'

@Component({
  selector: 'lx-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss'],
})
export class ChartSettingsComponent implements OnInit, SettingsTemplate {
  @ViewChild('staticTab') staticTab: TabsetComponent
  @ViewChild('leftSettings') leftSettings: ChartLeftSettingsComponent
  @ViewChild('rightSettings') rightSettings: ChartRightSettingsComponent
  @ViewChild('toggleChart') toggleChart: ToggleChartComponent

  block: ProjectModels.Block
  showToggleChartNav: boolean = true
  showToggleIconNav: boolean = true
  blockId
  isChartLocked: boolean = false

  constructor(private _dataTransmissionService: DataTransmissionService) {}

  ngOnInit() {
    this.staticTab.tabs[1].active = true
  }

  updateBlock(block: ProjectModels.Block, pageId?: string) {
    this.block = block
    this.leftSettings.updateBlock(block, pageId)
    this.rightSettings.updateBlock(block, pageId)
    this.toggleChart.updateBlock(block, pageId)
    if (this.block.type === 'chart' && this.block['locked']) {
      this.isChartLocked = true
    } else {
      this.isChartLocked = false
    }
  }

  onTabSelect(event) {
    if (event.id === 'tab1') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-right-chart-tab-datatable'])
      this.leftSettings.onSelected()
    } else if (event.id === 'tab2') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-right-chart-tab-settings'])
      this.rightSettings.onSelected()
    }
  }

  closeToggleChart(e) {
    this.showToggleChartNav = e
  }

  closeToggleIcon(e) {
    this.showToggleIconNav = e
  }

  showToggleChartHandle(e) {
    this.showToggleChartNav = e
  }

  showToggleIconHandle(e) {
    this.showToggleIconNav = e.flag
    this.blockId = e.blockId
  }

  ngAfterViewInit() {
    this._dataTransmissionService.getData().subscribe((data) => {
      if (data.show && this.staticTab.tabs[0]) {
        this.staticTab.tabs[0].active = true
      } else if (!data.show && this.staticTab.tabs[1]) {
        this.staticTab.tabs[1].active = true
      }
    })
  }
}
