/*
 * @Description: v1.0 图表 Action
 */

import { Action } from '@ngrx/store'
import * as ChartModels from '../models/chart.model'

export const GET_CHART = '[Chart] Get Chart'
export const GET_CHART_SUCCESS = '[Chart] Get Chart Success'
export const SET_CURRENT_CHART = '[Chart] Set Current Chart'

export class GetChartAction implements Action {
  readonly type = GET_CHART
  constructor(public payload: any) {}
}

export class GetChartSuccessAction implements Action {
  readonly type = GET_CHART_SUCCESS
  constructor(public payload: ChartModels.ChartBase) {}
}

export class SetCurrentChartAction implements Action {
  readonly type = SET_CURRENT_CHART
  constructor(public payload: number) {}
}

export type Actions = GetChartAction | GetChartSuccessAction | SetCurrentChartAction
