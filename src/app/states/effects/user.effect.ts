/*
 * @Description: Modify Here, Please
 */

import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

import * as UserActions from '../actions/user.action';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class UserEffect {

  constructor(
    private _service: UserService,
    private _actions$: Actions,
    private toastr: ToastrService
  ) { }

  @Effect()
  getUserInfo$: Observable<Action> = this._actions$.pipe(
    ofType(UserActions.GET_USER_INFO),
    switchMap(() => this._service.getUserInfo()
      .pipe(
        map(res => new UserActions.GetUserInfoSuccessAction(res)),
        catchError((err, caught) => {
          console.log(err);
          return of({ type: UserActions.GET_USER_INFO_FAIL });
        })
      )
    )
  );

  @Effect()
  setUserInfo$: Observable<Action> = this._actions$.pipe(
    ofType(UserActions.SET_USER_INFO),
    switchMap((data: UserActions.SetUserInfoAction) => this._service.setUserInfo(data.payload)
      .pipe(
        map(res => {
          if (res.resultCode === 1000) {
            this.toastr.success(null, '修改成功');
            return new UserActions.SetUserInfoSuccessAction(res.data);
          }
        }),
        catchError((err, caught) => {
          console.log(err);
          this.toastr.error(null, '修改失败');
          return of({ type: UserActions.SET_USER_INFO_FAIL });
        })
      )
    )
  );

  @Effect()
  getUserBill$: Observable<Action> = this._actions$.pipe(
    ofType(UserActions.GET_USER_BILL),
    switchMap(() => this._service.getUserBill()
      .pipe(
        map(res => new UserActions.GetUserBillSuccessAction(res)),
        catchError((err, caught) => {
          console.log(err);
          return of({ type: UserActions.GET_USER_BILL_FAIL });
        })
      )
    )
  );
}
