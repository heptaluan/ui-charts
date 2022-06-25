/*
 * @Description: Modify Here, Please
 */

import { Action } from '@ngrx/store'
import * as UserModel from '../models/user.model'

export const GET_USER_INFO = '[User] Get User Info'
export const GET_USER_INFO_SUCCESS = '[User] Get User Info Success'
export const GET_USER_INFO_FAIL = '[User] Get User Info Failed'
export const SET_USER_INFO = '[User] Set User Info'
export const SET_USER_INFO_SUCCESS = '[User] Set User Info Success'
export const SET_USER_INFO_FAIL = '[User] Set User Info Failed'
export const GET_USER_BILL = '[User] Get User Bill'
export const GET_USER_BILL_SUCCESS = '[User] Get User Bill Success'
export const GET_USER_BILL_FAIL = '[User] Get User Bill Fail'

export class GetUserInfoAction implements Action {
  readonly type = GET_USER_INFO
  constructor() {}
}

export class GetUserInfoSuccessAction implements Action {
  readonly type = GET_USER_INFO_SUCCESS
  constructor(public payload: UserModel.UserInfo) {}
}

export class GetUserInfoFailAction implements Action {
  readonly type = GET_USER_INFO_FAIL
  constructor(public payload: string) {}
}

export class SetUserInfoAction implements Action {
  readonly type = SET_USER_INFO
  constructor(public payload: FormData) {}
}

export class SetUserInfoSuccessAction implements Action {
  readonly type = SET_USER_INFO_SUCCESS
  constructor(public payload: UserModel.UserInfo) {}
}

export class SetUserInfoFailAction implements Action {
  readonly type = SET_USER_INFO_FAIL
  constructor() {}
}

export class GetUserBillAction implements Action {
  readonly type = GET_USER_BILL
  constructor() {}
}

export class GetUserBillSuccessAction implements Action {
  readonly type = GET_USER_BILL_SUCCESS
  constructor(public payload: UserModel.UserBill) {}
}

export class GetUserBillFailAction implements Action {
  readonly type = GET_USER_BILL_FAIL
}

export type Actions =
  | GetUserInfoAction
  | GetUserInfoSuccessAction
  | GetUserInfoFailAction
  | SetUserInfoAction
  | SetUserInfoSuccessAction
  | SetUserInfoFailAction
  | GetUserBillAction
  | GetUserBillSuccessAction
  | GetUserBillFailAction
