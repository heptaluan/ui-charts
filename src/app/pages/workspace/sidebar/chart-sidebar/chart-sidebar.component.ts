import { Component, OnInit, ViewChild, Input, Output, OnDestroy, ElementRef, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { trigger, state, transition, animate, style } from '@angular/animations'

import * as fromRoot from '../../../../states/reducers';
import { GetChartTemplateListAction } from '../../../../states/actions/template.action';
import { ChartTemplate } from '../../../../states/models/template.model';
import { SetActionsActive } from '@ngrx/store-devtools/src/actions';
import * as $ from 'jquery'
import { ActivatedRoute } from '@angular/router';
import { DataTransmissionService } from '../../../../share/services/data-transmission.service';
import * as ProjectActions from '../../../../states/actions/project.action';

@Component({
  selector: 'lx-chart-sidebar',
  templateUrl: './chart-sidebar.component.html',
  styleUrls: ['./chart-sidebar.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(1000)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})

export class ChartSidebarComponent implements OnInit, OnDestroy {
  chartTemplates: ChartTemplate[];
  chartTemplates$: Observable<ChartTemplate[]>;
  mySubscription = new Subscription();
  singChartListSubscription = new Subscription();
  @Input() pageId: string;
  styles;
  @Output() closeSidebarEvent = new EventEmitter();
  searchText: string;

  listContentStyles;

  selectedType = '全部';
  classifyBy = 'byChartType';  // byChartType 按图表类型分类 byFunction 按功能分类
  tabActive: boolean = true;   // TAB 切换
  projectType: string;
  projectFrom: string;
  singleChartTemplates: any = [];

  constructor(
    private _store: Store<fromRoot.State>,
    private el: ElementRef,
    private _router: ActivatedRoute,
    private _dataTransmissionService: DataTransmissionService
  ) {
    this.chartTemplates$ = this._store.select(fromRoot.getChartTemplates);
  }

  ngOnInit() {
    this.projectType = this._router.snapshot.queryParams.type;
    this.projectFrom = this._router.snapshot.queryParams.from;

    // 设定盒子高度，防止滚动条消失
    if (this.projectType === 'infographic') {
      // 如果该页面被嵌入在 ifrmae 当中
      if (window.self !== window.top) {
        this.listContentStyles = {
          'height': innerHeight - 208 - 70 + 'px',
        }
      } else {
        this.listContentStyles = {
          'height': innerHeight - 208 + 'px',
        }
      }
    } else {
      // 如果该页面被嵌入在 ifrmae 当中
      if (window.self !== window.top) {
        this.listContentStyles = {
          'height': innerHeight - 166 - 70 + 'px',
        }
      } else {
        this.listContentStyles = {
          'height': innerHeight - 166 + 'px',
        }
      }
    }

    // 获取模版列表
    this._store.dispatch(new GetChartTemplateListAction());

    // 模版列表
    this.mySubscription = this.chartTemplates$.subscribe(data => {
      if (data) {
        this.chartTemplates = data;

        // 展开右侧面板
        $('.isChart').click();
        console.log(`isChart selected`)
      }
    })

    // 单图列表
    this.getSingChartList()

    this._dataTransmissionService.getForkChartState().subscribe(res => {
      this._store.dispatch(new ProjectActions.GetSingleChartProjectAction());
      setTimeout(() => {
        this.getSingChartList()
      }, 0);
    })

    this.styles = {
      height: innerHeight - 50 + 'px',
      width: '280px'
    }

    window.onresize = _.debounce((event) => (
      this.styles.height = innerHeight - 50 + 'px',
      (() => {
        // 设定盒子高度，防止滚动条消失
        if (this.projectType === 'infographic') {
          // 如果该页面被嵌入在 ifrmae 当中
          if (window.self !== window.top) {
            this.listContentStyles = {
              'height': innerHeight - 208 - 70 + 'px',
            }
          } else {
            this.listContentStyles = {
              'height': innerHeight - 208 + 'px',
            }
          }
        } else {
          // 如果该页面被嵌入在 ifrmae 当中
          if (window.self !== window.top) {
            this.listContentStyles = {
              'height': innerHeight - 166 - 70 + 'px',
            }
          } else {
            this.listContentStyles = {
              'height': innerHeight - 166 + 'px',
            }
          }
        }
      })()

    ), 500);
  }

  ngAfterViewInit(): void {
    // 标题 Collapse
    $('.toggle-chart').on('click', '.chart-title', function () {
      $(this).find('.chart-title-arrow').toggleClass('arrow-down');
      $(this).siblings('.template-item-box').toggleClass('active');
    })
  }

  getSingChartList() {
    this.singChartListSubscription = this._store.select(fromRoot.getChartProjectList).subscribe(res => {
      if (res) {
        this.singleChartTemplates = res;
      }
    })
  }

  selectType(e) {
    this.selectedType = e.target.innerText;
  }

  searchChart(e) {
    this.selectedType = '全部';
    this.searchText = e.currentTarget.value;
  }

  changeClassifyBy(index) {
    if (index === 0) {
      this.classifyBy = 'byChartType';
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-chart-tab-type']);
    } else {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-chart-tab-function']);
      this.classifyBy = 'byFunctionType';
    }
  }

  clickCloseBtn() {
    this.closeSidebarEvent.emit();
  }

  ngOnDestroy() {
    window.onresize = null;
    this.mySubscription.unsubscribe();
  }

  search(event) {
    this.selectedType = '全部';
    this.searchText = event;
    if (this.searchText !== '') {
      if (this.tabActive) {
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-search-chart']);
      } else {
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-search-mychart']);
      }
    }
  }

  // 切换标签方法
  onTabSelect(e) {
    this.tabActive = !this.tabActive;
    if (e.id === 'tab2') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-left-mychart']);
    }
  }

  // 折叠菜单
  flodAll() {
    $('.toggle-chart .chart-title').each(function () {
      $(this).find('.chart-title-arrow').addClass('arrow-down');
      $(this).siblings('.template-item-box').addClass('active');
    })
  }


}
