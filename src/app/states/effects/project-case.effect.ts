/*
 * @Description: Modify Here, Please
 */

import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { ProjectCaseService } from '../services/project-case.service';
import * as ProjectCaseActions from '../actions/project-case.action';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ProjectCaseEffect {

  @Effect()
  getProjectCaseDetail$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectCaseActions.GET_PROJECT_CASE_DETAIL),
    switchMap((data: ProjectCaseActions.GetProjectCaseDetailAction) => this._service.getProjectGetDetail(data.id).pipe(
      map(res => new ProjectCaseActions.GetProjectCaseDetailSuccessAction(res))
    ))
  )

  @Effect()
  getProjectChartCaseDetail$: Observable<Action> = this._actions$.pipe(
    ofType(ProjectCaseActions.GET_PROJECT_CHART_CASE_DETAIL),
    switchMap((data: ProjectCaseActions.GetProjectChartCaseDetailAction) => this._service.getChartProjectDetail(data.id).pipe(
      map(res => new ProjectCaseActions.GetProjectChartCaseDetailSuccessAction(res))
    ))
  )

  // 信息图 - 我的喜欢
  @Effect()
  toggleListCase$ = this._actions$.pipe(
    ofType(ProjectCaseActions.TOGGLE_LIKE_CASE),
    switchMap((data: ProjectCaseActions.ToggleLikeCaseAction) => this._service.toggleCaseLike(data.payload)
      .pipe(
        map(res => {
          if (res.resultCode === 1000) {
            if (data.payload['islike'] === 1) {
              this.toastr.success(null, '收藏成功');
            } else {
              this.toastr.success(null, '已取消收藏');
            }
            return new ProjectCaseActions.ToggleLikeCaseSuccessAction(data.payload)
          }
        }),
        catchError(err => {
          this.toastr.error(null, '收藏失败');
          return of({ type: ProjectCaseActions.TOGGLE_LIKE_CASE_FAIL });
        })
      ))
  )

  constructor(
    private _service: ProjectCaseService,
    private _actions$: Actions,
    private toastr: ToastrService) { }
}
