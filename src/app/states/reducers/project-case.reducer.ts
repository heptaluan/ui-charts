/*
 * @Description: 案例页面reducer
 */

import * as CaseModels from '../models/case.model';
import * as CaseActions from '../actions/project-case.action';
import * as _ from 'lodash';

export interface State {
  cases: CaseModels.Case[];
  currentPageNum: number;
  total: number;
  sort: 'hot' | 'time' | 'choice';
  search: string;
  currentCaseDetail: CaseModels.CaseDetail;
}

export const initialState: State = {
  cases: [],
  currentPageNum: 1,
  total: 0,
  sort: 'choice',
  search: undefined,
  currentCaseDetail: undefined
}

export function reducer(state = initialState, action: CaseActions.Actions): State {
  switch (action.type) {
    case CaseActions.GET_PROJECT_CASE_LIST_SUCCESS:
      const list = action.payload.list;
      const page = action.payload.pagenum;
      const total = action.payload.total;
      return Object.assign({}, state, {
        cases: list,
        currentPageNum: page,
        total: total
      });
    case CaseActions.RESET_PROJECT_CASE_LIST:
      return Object.assign({}, state, initialState);
    case CaseActions.GET_PROJECT_CASE_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        currentCaseDetail: action.payload
      });
    case CaseActions.GET_PROJECT_CHART_CASE_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        currentCaseDetail: action.payload
      });
    case CaseActions.SET_PROJECT_CASE_SORT_TYPE:
      return Object.assign({}, state, {
        sort: action.sort
      });
    case CaseActions.SET_PROJECT_CASE_CURRENT_PAGE:
      return Object.assign({}, state, {
        currentPageNum: action.page
      });
    case CaseActions.SET_PROJECT_CASE_SEARCH:
      return Object.assign({}, state, {
        search: action.payload
      });
    case CaseActions.TOGGLE_LIKE_CASE_SUCCESS:
      const newCaseDetail = _.cloneDeep(state.currentCaseDetail);
      if (!newCaseDetail) {
        return;
      }
      newCaseDetail.islike = action.payload.islike ? true : false;
      if (action.payload.islike) {
        newCaseDetail.like++;
      } else {
        newCaseDetail.like--;
      }
      return Object.assign({}, state, {
        currentCaseDetail: newCaseDetail
      });
    default:
      return state;
  }
}

export const getCaseList = (state: State) => state.cases;
export const getCaseDetail = (state: State) => state.currentCaseDetail;
export const getCurrentPageNum = (state: State) => state.currentPageNum;
export const getCaseTotal = (state: State) => state.total;
export const getCaseSort = (state: State) => state.sort;
export const getCaseSearch = (state: State) => state.search;