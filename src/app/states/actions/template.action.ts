/*
 * @Description: 模板相关操作
 */

import { Action } from '@ngrx/store'
import * as TemplateModel from '../models/template.model'

export const GET_PROJECT_TEMPLATE_LIST = '[Template] Get Project Template List'
export const GET_PROJECT_TEMPLATE_LIST_SUCCESS = '[Template] Get Project Template List Success'
export const GET_PROJECT_TEMPLATE_LIST_FAIL = '[Template] Get Project Template List Fail'
export const SET_PROJECT_TEMPLATE_CURRENT_TYPE = '[Template] Set Project Current Template Type'
export const GET_CHART_TEMPLATE_LIST = '[Template] Get Chart Template List'
export const GET_CHART_TEMPLATE_LIST_SUCCESS = '[Template] Get Chart Template List Success'

export class GetProjectTemplateListAction implements Action {
  readonly type = GET_PROJECT_TEMPLATE_LIST
  constructor(public payload: TemplateModel.GetTemplate) {}
}

export class GetProjectTemplateListSuccessAction implements Action {
  readonly type = GET_PROJECT_TEMPLATE_LIST_SUCCESS
  constructor(public templateType: string, public payload: TemplateModel.ProjectTemplate[]) {}
}

export class GetChartTemplateListAction implements Action {
  readonly type = GET_CHART_TEMPLATE_LIST
  constructor(public payload = '') {}
}

export class GetChartTemplateListSuccessAction implements Action {
  readonly type = GET_CHART_TEMPLATE_LIST_SUCCESS
  constructor(public payload: TemplateModel.ChartTemplateList) {}
}

export class SetProjectCurrentTemplateTypeAction implements Action {
  readonly type = SET_PROJECT_TEMPLATE_CURRENT_TYPE
  constructor(public payload: string) {}
}

export type Actions =
  | GetProjectTemplateListAction
  | GetProjectTemplateListSuccessAction
  | SetProjectCurrentTemplateTypeAction
  | GetChartTemplateListAction
  | GetChartTemplateListSuccessAction
