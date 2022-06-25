/*
 * @Description: 案例相关action
 */

import { Action } from '@ngrx/store'

// 获取喜欢数据列表
export const GET_FAVORITE_CASE_LIST = '[FAVORITE CASE] Get Favorite Case List'
export const GET_FAVORITE_CASE_LIST_SUCCESS = '[FAVORITE CASE] Get Favorite Case List Successed'

// 删除喜欢数据列表
export const DELETE_FAVORITE_CASE_LIST = '[FAVORITE CASE] Delete Favorite Case List'
export const DELETE_FAVORITE_CASE_LIST_SUCCESS = '[FAVORITE CASE] Delete Favorite Case List Successed'

// 获取喜欢数据列表
export class GetFavoriteCaseListAction implements Action {
  readonly type = GET_FAVORITE_CASE_LIST
  constructor(public payload) {}
}

export class GetFavoriteCaseListSuccessAction implements Action {
  readonly type = GET_FAVORITE_CASE_LIST_SUCCESS
  constructor(public payload) {}
}

// 删除喜欢数据列表
export class DeleteFavoriteCaseListAction implements Action {
  readonly type = DELETE_FAVORITE_CASE_LIST
  constructor(public payload) {}
}

export class DeleteFavoriteCaseListSuccessAction implements Action {
  readonly type = DELETE_FAVORITE_CASE_LIST_SUCCESS
  constructor(public payload) {}
}

export type Actions =
  | GetFavoriteCaseListAction
  | GetFavoriteCaseListSuccessAction
  | DeleteFavoriteCaseListAction
  | DeleteFavoriteCaseListSuccessAction
