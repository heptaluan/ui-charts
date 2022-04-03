import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../states/reducers';
import * as ProjectActions from '../../states/actions/project.action';
import * as ProjectModels from '../../states/models/project.model';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { NotifyChartRenderService } from '../../share/services/notify-chart-render.service';

@Component({
  selector: 'lx-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})

export class DownloadComponent implements OnInit {
  exportPage: boolean = false; // 控制显示工具手掌与箭头隐藏
  project: any;
  projectId: string;
  projectType: string;
  projectName: string;
  // showLogo = true;
  showWatermark = true;
  bgTransparent = false;
  scale = 1;
  contents$: Observable<ProjectModels.InfographicProjectContents>;

  isPCShow: boolean = true;
  isToolShow: boolean =true;

  offsetLeft = 0;

  constructor(private _router: Router,
    private _activedRoute: ActivatedRoute,
    private _store: Store<fromRoot.State>,
    private _notifyChartRenderService: NotifyChartRenderService,
  ) {
    this.projectId = this._activedRoute.snapshot.queryParams.project;
    this.projectType = this._activedRoute.snapshot.queryParams.type;
    this.initData();
  }

  ngOnInit() {
    $('#tool').css('width', '240px')
    $('#tool').css('position', 'fixed')
    $('#tool .tool-box').css('width', '240px');
    $('#tool .change-size').css('margin', '0 9px 0 0');
  }

  ngAfterViewInit(): void {
    
  }

  // 设置工具左边边距
  setToolLeft() {
    this.isToolShow = true
    const { clientWidth } = document.documentElement;
    const { width: leftWidth } = document.querySelector('.download-left').getBoundingClientRect();
    const { width: rightWidth } = document.querySelector('.download-right').getBoundingClientRect();
    const toolWidth = 240;
    const toolLeft = (clientWidth + 17 - leftWidth - rightWidth - toolWidth) / 2;
    // 改变底部工具栏位置
    $('#tool').css('left', toolLeft + leftWidth + 'px');
  }

  onScaleChange(scale) {
    this.scale = scale + 1;
  }

  goBack() {
    // 清空图表状态
    this._notifyChartRenderService.sendChartRender(undefined)
    if (this.projectType === 'infographic') {
      this._router.navigate(['pages', 'workspace'], { queryParams: { type: 'infographic' }, queryParamsHandling: "merge" });
    } else if (this.projectType === 'chart') {
      this._router.navigate(['pages', 'workspace'], { queryParams: { type: 'chart' }, queryParamsHandling: "merge" });
    }
  }

  // 初始化数据
  initData() {
    if (this.projectType === 'infographic') {
      this.contents$ = this._store.select(fromRoot.getCurrentProjectFull).pipe(filter(project => !!project), map(project => {
        if (project) {
          this.project = project;
          // 居中画板，不用 transform 是因为 position: fixed 会受影响
          this.offsetLeft = Number(project.article.contents.design.width) / 2;
        }
        this.projectName = project.title; 
        return project.article.contents
      }));
      this._store.dispatch(new ProjectActions.GetProjectInfoAction(this.projectId, 'infographic'));
    } else if (this.projectType === 'chart') {
      this.contents$ = this._store.select(fromRoot.getCurrentChartProjectFull).pipe(filter(project => !!project), map(project => {
        let newProject = _.cloneDeep(project);
        if (project && newProject.article.contents.pages[0].blocks[0]) {
          let blockProps = newProject.article.contents.pages[0].blocks[0].props;
          if (blockProps.logoDisplay && blockProps.publishDisplay) {
            const flag = blockProps.logoDisplay.show || blockProps.publishDisplay.show;
            const pcMobileDiff = blockProps.logoDisplay.imgHeight === '32' ? '18' : '15';
            const diffHeightNum = (~~blockProps.logoDisplay.imgHeight + ~~blockProps.logoDisplay.topLineHeight + ~~blockProps.logoDisplay.bottomLineHeight - ~~pcMobileDiff);
            newProject.article.contents.design.height = flag ? (~~blockProps.size.height + diffHeightNum + '') : (blockProps.size.height);
            newProject.article.contents.design.width = blockProps.size.width;
            this.project = newProject;
          }
        }
        setTimeout(() => {
          $('#tool').hide();
        }, 300);
        this.projectName = project.title; 
        return newProject.article.contents
      }));
      this._store.dispatch(new ProjectActions.GetSingleChartInfoAction(this.projectId, 'chart'));
    }
  }

}
