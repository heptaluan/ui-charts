import { Component, OnInit, Output, OnDestroy, ElementRef, EventEmitter, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';

import * as fromRoot from '../../../../../states/reducers';
import { ChartTemplate } from '../../../../../states/models/template.model';
import * as ProjectModels from '../../../../../states/models/project.model';
import * as $ from 'jquery';

@Component({
  selector: 'lx-toggle-chart',
  templateUrl: './toggle-chart.component.html',
  styleUrls: ['./toggle-chart.component.scss']
})
export class ToggleChartComponent implements OnInit, AfterViewInit {

  // 当前选中图表数据
  _curBlock;
  get curBlock() {
    if (this._curBlock) {
      return this._curBlock;
    }
  }
  set curBlock(curBlock) {
    this._curBlock = curBlock;
  }

  // 当前PageId
  curPageId: string;

  chartTemplates: ChartTemplate[];
  chartTemplates$: Observable<ChartTemplate[]>;
  mySubscription = new Subscription();

  @Output() closeSidebarEvent = new EventEmitter();
  searchText: string;

  selectedType = '全部';

  classifyBy = 'byChartType';  // byChartType 按图表类型分类，byFunction 按功能分类
  isToggleList: boolean = true;

  constructor(private _store: Store<fromRoot.State>, private el: ElementRef) {
    this.chartTemplates$ = this._store.select(fromRoot.getChartTemplates);
  }

  ngOnInit() {
    this.mySubscription = this.chartTemplates$.subscribe(data => {
      if (data) {
        const templateSwitch = this.curBlock.templateSwitch;
        // 只推荐同类型
        if (templateSwitch === 'tree' || templateSwitch === 'link-obj-valued' || templateSwitch === 'link-typed' || templateSwitch === 'sunburst') {
          this.chartTemplates = data.filter(item => item.templateSwitch == templateSwitch);
        } else if (templateSwitch === 'cross-time') {
          this.chartTemplates = data.filter(item => item.templateSwitch === 'cross' || item.templateSwitch === 'cross-time')
        } else if (templateSwitch === 'obj-n-value-time') {
          this.chartTemplates = data.filter(item => item.templateSwitch === 'obj-n-value-time')
        } else if (templateSwitch === 'cross') {  // 除了 obj-n-value-time tree link-typed link-obj-valued 特殊处理不推荐
          this.chartTemplates = data.filter(item => item.templateSwitch !== 'obj-n-value-time')
          .filter(item => item.templateSwitch !== 'tree')
          .filter(item => item.templateSwitch !== 'link-typed')
          .filter(item => item.templateSwitch !== 'link-obj-valued')
        } else {
          // tree link-typed link-obj-valued 特殊处理不推荐
          this.chartTemplates = data.filter(item => item.templateSwitch !== 'sunburst')
            .filter(item => item.templateSwitch !== 'tree')
            .filter(item => item.templateSwitch !== 'cross-time')
            .filter(item => item.templateSwitch !== 'link-obj-valued')
            .filter(item => item.templateSwitch !== 'link-typed')
            .filter(item => item.templateSwitch !== 'obj-n-value-time')
        }
        // 表格图表可以全转
        if (templateSwitch === 'obj-any') {
          this.chartTemplates.length = 0;
          // 过滤掉双 sheet 图表
          this.chartTemplates = data.filter(item => item.dataSrc.data.length < 2);
        }
      }
    })
  }

  ngAfterViewInit(): void {
    // 标题 Collapse
    $('.toggle-chart-template').on('click', '.chart-title', function () {
      $(this).find('.chart-title-arrow').toggleClass('arrow-down');
      $(this).siblings('.template-item-box').toggleClass('active');
    })
  }

  updateBlock(block: ProjectModels.Block, pageId?: string) {
    this.curBlock = block;
    this.curPageId = pageId;
  }

  selectType(e) {
    this.selectedType = e.target.innerText;
  }

  searchChart(e) {
    this.selectedType = '全部';
    this.searchText = e.currentTarget.value;
  }

  clickCloseBtn() {
    $('.right-content').css('width', '240px')
    // $('.header-container').css('padding-right', '240px')
    $('.change-page').css('right', '255px')
    this.closeSidebarEvent.emit(true);
  }

  ngOnDestroy() {
    window.onresize = null;
  }

  search(event) {
    this.selectedType = '全部';
    this.searchText = event;
  }

  changeClassifyBy(index) {
    if (index === 0) {
      this.classifyBy = 'byChartType';
    } else {
      this.classifyBy = 'byFunctionType';
    }
  }

  flodAll() {
    $('.toggle-chart-template .chart-title').each(function () {
      $(this).find('.chart-title-arrow').addClass('arrow-down');
      $(this).siblings('.template-item-box').addClass('active');
    })
  }

}
