/*
 * @Description: v1.0 chart reducer
 */

import * as ChartModels from '../models/chart.model';
import * as ChartActions from '../actions/chart.action';
import * as _ from 'lodash';

export interface State {
  currentChart: number;
  charts: ChartModels.ChartBase[];
}

export const initialState: State = {
  currentChart: null,
  charts: []
};

export function reducer(state = initialState, action: ChartActions.Actions): State {
  switch (action.type) {
    case ChartActions.GET_CHART_SUCCESS:
      const list = _.cloneDeep(state.charts);
      list.push(action.payload);
      return Object.assign({}, state, {
        charts: list
      });
    case ChartActions.SET_CURRENT_CHART:
      const current = action.payload;
      return Object.assign({}, state, {
        currentChart: current
      });
    default:
      return state;
  }
}

export const getChartList = (state: State) => state.charts;
export const getCurrentChart = (state: State) => state.currentChart;

