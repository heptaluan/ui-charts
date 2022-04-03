/*
 * @Description: 案例页action
 */

import { Action } from '@ngrx/store';
import * as CaseModels from '../models/case.model';

export const GET_PROJECT_CASE_LIST = '[PROJECT CASE] Get Project Case List';
export const GET_PROJECT_CASE_LIST_SUCCESS = '[PROJECT CASE] Get Project Case List Success';

export const GET_PROJECT_CASE_DETAIL = '[PROJECT CASE] Get Project Case Detail';
export const GET_PROJECT_CASE_DETAIL_SUCCESS = '[PORJECT CASE] Get Project Case Detail Success';

export const GET_PROJECT_CHART_CASE_DETAIL = '[PROJECT CASE] Get Project Chart Case Detail';
export const GET_PROJECT_CHART_CASE_DETAIL_SUCCESS = '[PORJECT CASE] Get Project Chart Case Detail Success';


export const SET_PROJECT_CASE_SORT_TYPE = '[PROJECT CASE] Set Project Case Sort Type';
export const SET_PROJECT_CASE_CURRENT_PAGE = '[PROJECT CASE] Set Project Case Current Page';
export const SET_PROJECT_CASE_SEARCH = '[PROJECT CASE] Set Project Case Search';

export const TOGGLE_LIKE_CASE = '[PROJECT CASE] Toggle Like Case';
export const TOGGLE_LIKE_CASE_SUCCESS = '[PROJECT CASE] Toggle Like Case Success';
export const TOGGLE_LIKE_CASE_FAIL = '[PROJECT CASE] Toggle Like Case Fail';

export const RESET_PROJECT_CASE_LIST = '[PROJECT CASE] Reset Project Case List';

export class GetProjectCaseListAction implements Action {
  readonly type = GET_PROJECT_CASE_LIST;
  constructor(public payload: CaseModels.GetCaseList) { }
}

export class GetProjectCaseListSuccessAction implements Action {
  readonly type = GET_PROJECT_CASE_LIST_SUCCESS;
  constructor(public payload: CaseModels.CaseList) { }
}

// 信息图
export class GetProjectCaseDetailAction implements Action {
  readonly type = GET_PROJECT_CASE_DETAIL;
  constructor(public id: string) { }
}

export class GetProjectCaseDetailSuccessAction implements Action {
  readonly type = GET_PROJECT_CASE_DETAIL_SUCCESS;
  constructor(public payload: CaseModels.CaseDetail) { }
}

// 单图
export class GetProjectChartCaseDetailAction implements Action {
  readonly type = GET_PROJECT_CHART_CASE_DETAIL;
  constructor(public id: string) { }
}

export class GetProjectChartCaseDetailSuccessAction implements Action {
  readonly type = GET_PROJECT_CHART_CASE_DETAIL_SUCCESS;
  constructor(public payload: CaseModels.CaseDetail) { }
}

export class SetProjectCaseSortTypeAction implements Action {
  readonly type = SET_PROJECT_CASE_SORT_TYPE;
  constructor(public sort: 'hot' | 'time' | 'choice') { }
}

export class SetProjectCaseCurrentPageAction implements Action {
  readonly type = SET_PROJECT_CASE_CURRENT_PAGE;
  constructor(public page: number) { }
}

export class SetProjectCaseSearchAction implements Action {
  readonly type = SET_PROJECT_CASE_SEARCH;
  constructor(public payload: string) { }
}

export class ToggleLikeCaseAction implements Action {
  readonly type = TOGGLE_LIKE_CASE;
  constructor(public payload: CaseModels.ToggleLikeCase) { }
}

export class ToggleLikeCaseSuccessAction implements Action {
  readonly type = TOGGLE_LIKE_CASE_SUCCESS;
  constructor(public payload: CaseModels.ToggleLikeCase) { }
}

export class ToggleLikeCaseFailAction implements Action {
  readonly type = TOGGLE_LIKE_CASE_FAIL;
  constructor() { }
}

export class ResetCaseListAction implements Action {
  readonly type = RESET_PROJECT_CASE_LIST;
  constructor() { }
}

export type Actions
  = GetProjectCaseListAction
  | GetProjectCaseListSuccessAction
  | GetProjectCaseDetailAction
  | GetProjectCaseDetailSuccessAction
  | SetProjectCaseSortTypeAction
  | SetProjectCaseCurrentPageAction
  | SetProjectCaseSearchAction
  | ToggleLikeCaseAction
  | ToggleLikeCaseSuccessAction
  | ToggleLikeCaseFailAction
  | ResetCaseListAction
  | GetProjectChartCaseDetailAction
  | GetProjectChartCaseDetailSuccessAction;
