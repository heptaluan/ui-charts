/*
 * @Description: data store effect
 */

import { Injectable } from '@angular/core'
import { Effect, Actions, ofType } from '@ngrx/effects'
import { Action } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { map, switchMap } from 'rxjs/operators'

import * as DataStoreActions from '../actions/data-store.action'
import { DataStoreService } from '../services/data-store.service'

@Injectable()
export class DataStoreEffect {
  @Effect()
  getProjectList$: Observable<Action> = this._actions$.pipe(
    ofType(DataStoreActions.GET_DATA_STORE_LIST),
    switchMap((data) =>
      this._service.getDataStoreList(data).pipe(map((res) => new DataStoreActions.GetDataStoreListSuccessAction(res)))
    )
  )

  constructor(private _service: DataStoreService, private _actions$: Actions) {}
}
