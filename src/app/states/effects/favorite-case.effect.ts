/*
 * @Description: 案例相关effect
 */

import { Injectable } from '@angular/core'
import { Effect, Actions, ofType } from '@ngrx/effects'
import { Action } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { map, tap, switchMap, catchError } from 'rxjs/operators'
import { empty } from 'rxjs/observable/empty'
import { of } from 'rxjs/observable/of'

import * as CaseActions from '../actions/favorite-case.action'
import { FavoriteCaseService } from '../services/favorite-case.service'

@Injectable()
export class FavoriteCaseEffect {
  // 获取喜欢列表
  @Effect()
  getFavoriteCaseList$: Observable<Action> = this._actions$.pipe(
    ofType(CaseActions.GET_FAVORITE_CASE_LIST),
    switchMap((data: CaseActions.GetFavoriteCaseListAction) => this._service.getFavoriteCaseList(data.payload)),
    map((res) => new CaseActions.GetFavoriteCaseListSuccessAction(res))
  )

  // 删除列表数据
  @Effect()
  deleteFavoriteCaseList$: Observable<Action> = this._actions$.pipe(
    ofType(CaseActions.DELETE_FAVORITE_CASE_LIST),
    switchMap((data: CaseActions.DeleteFavoriteCaseListAction) =>
      this._service
        .deleteFavoriteCaseList(data.payload)
        .map((res) => new CaseActions.DeleteFavoriteCaseListSuccessAction(data.payload))
    )
  )

  constructor(private _service: FavoriteCaseService, private _actions$: Actions) {}
}
