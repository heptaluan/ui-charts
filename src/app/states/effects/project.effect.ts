/*
 * @Description: Modify Here, Please
 */

import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, tap, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators/first';

import * as ProjectActions from '../actions/project.action';
import { ProjectService } from '../services/project.service';
import { ProjectTemplate } from '../models/template.model';
import { ToastrService } from 'ngx-toastr';
import { DataTransmissionService } from '../../share/services/data-transmission.service';

@Injectable()
export class ProjectEffect {

  // 获取信息图项目列表
  @Effect()
  getProjectList$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.GET_PROJECT_LIST),
    switchMap((data: ProjectActions.GetProjectListAction) => this._service.getProjectList().pipe(
      map(res => new ProjectActions.GetProjectListSuccessAction(res.projects))
    ))
  );

  // 获取单图项目列表
  @Effect()
  getSingleChartProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.GET_CHART_LIST),
    switchMap((data: ProjectActions.GetSingleChartProjectAction) => this._service.getSingleChartProject().pipe(
      map(res => new ProjectActions.GetSingleChartProjectSuccessAction(res.projects))
    ))
  );

  // 获取全部项目列表
  @Effect()
  getAllProjectList$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.GET_ALL_PROJECT_LIST),
    switchMap((data: ProjectActions.GetAllProjectListAction) => this._service.getAllProjectList().pipe(
      map(res => new ProjectActions.GetAllProjectListSuccessAction(res.projects))
    ))
  );


  // 获取主题
  @Effect()
  getProjectTheme$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.GET_PROJECT_THEME),
    switchMap((data: ProjectActions.GetProjectThemeAction) => this._service.getThemeList().pipe(
      map(res => new ProjectActions.GetProjectThemeSuccessAction(res))
    ))
  );

  // 获取信息图项目信息
  @Effect()
  getProjectInfo$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.GET_PROJECT_INFO),
    switchMap((data: ProjectActions.GetProjectInfoAction) => this._service.getProject(data.id, data.projectType).pipe(
      map(res => new ProjectActions.GetProjectInfoSuccessAction(res))
    ))
  );

  // 获取单图项目信息
  @Effect()
  getSingleChartInfo$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.GET_SINGLE_CHART_INFO),
    switchMap((data: ProjectActions.GetSingleChartInfoAction) => this._service.getSingleChart(data.id, data.projectType).pipe(
      map(res => new ProjectActions.GetSingleChartInfoSuccessAction(res))
    ))
  );

  // Chart（1.0）
  @Effect()
  getChartProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.GET_CHART_PROJECT),
    switchMap((data: ProjectActions.GetChartProjectAction) => this._service.getProject(data.payload, 'chart')
      .map(res => new ProjectActions.GetChartProjectSuccessAction(res))
    )
  );

  // 新建信息图
  @Effect()
  createProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.CREATE_PROJECT),
    switchMap((data: ProjectActions.CreateProjectAction) => this._service.createProject(data.payload)
      .map(res => new ProjectActions.CreateProjectSuccessAction(res.data))
    )
  );


  // 模版 fork
  @Effect()
  createTemplateProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.CREATE_TEMPLATE_PROJECT),
    switchMap((id) => this._service.createTemplateProject(id)
      .map(res => new ProjectActions.CreateTemplateProjectSuccessAction(res.data))
    )
  );

  // 单图 fork
  @Effect()
  createChartTemplateProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.CREATE_CHART_TEMPLATE_PROJECT),
    switchMap((id) => this._service.createChartTemplateProject(id)
      .map(res => new ProjectActions.CreateChartTemplateProjectSuccessAction(res.data))
    )
  );

  // 信息图 fork
  @Effect()
  createInfoTemplateProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.CREATE_INFO_TEMPLATE_PROJECT),
    switchMap((id) => this._service.createInfoTemplateProject(id)
      .map(res => new ProjectActions.CreateInfoTemplateProjectSuccessAction(res.data))
    )
  );

  // 批量删除
  @Effect()
  deleteProjectList$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.DELETE_PROJECT_LIST),
    switchMap((deleteArr) => this._service.deleteProjectList(deleteArr)
      .pipe(
        map(res => {
          if (res.resultCode === 1000) {
            this.toastr.success(null, '删除成功');
            return new ProjectActions.DeleteProjectListSuccessAction(res.data);
          }
        }),
        catchError(err => {
          this.toastr.error(null, '删除失败');
          return of({ type: ProjectActions.DELETE_PROJECT_LIST_FAIL });
        })

      )
    )
  );

  // 信息图弹窗修改信息
  @Effect()
  configProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.CONFIG_PROJECT),
    switchMap((data: ProjectActions.ConfigProjectAction) => this._service.configProject(data.id, data.payload)
      .pipe(
        map(res => {
          if (res.resultCode === 1000) {
            // 如果携带了 isNoToastrTip 值为 true 不提示修改成功
            const isTip = data.payload.isNoToastrTip ? false : true;
            if (isTip) {
              this.toastr.success(null, '修改成功');
            }
            return new ProjectActions.ConfigProjectSuccessAction(data.id, data.payload);
          }
        }),
        catchError(err => {
          console.log(err);
          this.toastr.error(null, '修改失败');
          return of({ type: ProjectActions.CONFIG_PROJECT_FAIL });
        })
      )
    )
  );

  // 单图弹窗修改信息
  @Effect()
  configChartProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.CONFIG_CHART_PROJECT),
    switchMap((data: ProjectActions.ConfigChartProjectAction) => this._service.configChartProject(data.id, data.payload)
      .pipe(
        map(res => {
          if (res.resultCode === 1000) {
            // 如果携带了 isNoToastrTip 值为 true 不提示修改成功
            const isTip = data.payload.isNoToastrTip ? false : true;
            if (isTip) {
              this.toastr.success(null, '修改成功');
            }
            return new ProjectActions.ConfigChartProjectSuccessAction(data.id, data.payload);
          }
        }),
        catchError((err, caught) => {
          console.log(err);
          this.toastr.error(null, '修改失败');
          return of({ type: ProjectActions.CONFIG_CHART_PROJECT_FAIL });
        })
      )
    )
  );





  // 信息图 - article 更新
  @Effect()
  updateCurrentProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.UPDATE_CURRENT_PROJECT_ARTICLE),
    switchMap((data: ProjectActions.UpdateCurrentProjectArticleAction) => {
      // 发 http 请求的同时直接改 store 避免操作延时，请求返回成功后修改 store 里的 hash
      // .map(res => new ProjectActions.UpdateCurrentProjectHashAction(res));
      return [
        // new ProjectActions.SetProjectSavingStateAction(false),
        // new ProjectActions.SavingProjectAction(data.projectId, data.payload),
        new ProjectActions.UpdateCurrentProjectArticleSuccessAction(data.payload)];
    }
    )
  );

  // 单图 - article 更新
  @Effect()
  updateCurrentChartProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.UPDATE_CHART_CURRENT_PROJECT_ARTICLE),
    switchMap((data: ProjectActions.UpdateCurrentChartProjectArticleAction) => {
      return [
        // new ProjectActions.SetProjectSavingStateAction(false),
        // new ProjectActions.SavingChartProjectAction(data.projectId, data.payload),
        new ProjectActions.UpdateCurrentChartProjectArticleSuccessAction(data.payload)
      ];
    }
    )
  );





  // 保存/删除 信息图项目
  @Effect()
  savingProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.SAVING_PROJECT),
    mergeMap((data: ProjectActions.SavingProjectAction) => this._service.updateProjectContent(data.projectId, data.payload).pipe(
      map(res => new ProjectActions.SetProjectSavingStateAction(true)),
      catchError(err => of(new ProjectActions.SetProjectSavingStateAction(true))))
    )
  );

  @Effect()
  deleteProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.DELETE_PROJECT),
    switchMap((data: ProjectActions.DeleteProjectAction) => this._service.deleteProject(data.projectId)
      .map(res => new ProjectActions.DeleteProjectSuccessAction(data.projectId)))
  );

  // 保存/删除 单图项目
  @Effect()
  savingChartProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.SAVING_CHART_PROJECT),
    mergeMap(
      (data: ProjectActions.SavingChartProjectAction) =>
        this._service.updateChartProjectContent(data.projectId, data.payload).pipe(
          map(res => new ProjectActions.SetProjectSavingStateAction(true)),
          catchError(err => of(new ProjectActions.SetProjectSavingStateAction(true))))
    )
  );

  @Effect()
  deleteChartProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.DELETE_CHART_PROJECT),
    switchMap((data: ProjectActions.DeleteChartProjectAction) => this._service.deleteChartProject(data.projectId)
      .map(res => new ProjectActions.DeleteChartProjectSuccessAction(data.projectId)))
  );

  // 信息图 - 保存整个项目
  @Effect()
  updateAndExitCurrentProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.UPDATE_AND_EXIT_CURRENT_PROJECT),
    switchMap((data: ProjectActions.UpdateAndExitCurrentProjectAction) => this._service.configProject(data.projectId, data.payload)
      .map(res => {
        return new ProjectActions.UpdateAndExitCurrentProjectSuccessAction(data.projectId, data.payload)
      }))
  );

  // 单图 - 保存整个项目
  @Effect()
  updateAndExitCurrentChartProject$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectActions.UPDATE_AND_EXIT_CURRENT_CHART_PROJECT),
    switchMap(
      (data: ProjectActions.UpdateAndExitCurrentChartProjectAction) => 
        this._service.configChartProject(data.projectId, data.payload)
          .map(res =>  {
            return new ProjectActions.UpdateAndExitCurrentChartProjectSuccessAction(data.projectId, data.payload)
          }))
  );

  constructor(
    private _service: ProjectService,
    private _actions$: Actions,
    private toastr: ToastrService,
    private _dataTransmissionService: DataTransmissionService
  ) { }
}
