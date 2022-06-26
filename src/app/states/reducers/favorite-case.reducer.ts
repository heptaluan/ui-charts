/*
 * @Description: 喜欢案例reducer处理器
 */

import * as CaseModels from '../models/case.model'
import * as CaseActions from '../actions/favorite-case.action'
import * as _ from 'lodash'

export interface State {
  cases: CaseModels.CaseList
  caseDetail: CaseModels.CaseDetail
  currentPageNum: number
}

export const initialState: State = {
  cases: {
    pagenum: 1,
    total: 1,
    list: [],
  },
  caseDetail: undefined,
  currentPageNum: 1,
}

export function reducer(state = initialState, action: CaseActions.Actions): State {
  switch (action.type) {
    case CaseActions.GET_FAVORITE_CASE_LIST_SUCCESS: {
      const newCases = action.payload
      return Object.assign({}, state, {
        cases: newCases,
      })
    }
    case CaseActions.DELETE_FAVORITE_CASE_LIST_SUCCESS: {
      let newCases = _.cloneDeep(state.cases)
      const deleteList = action.payload
      for (let i = 0; i < deleteList['length']; i++) {
        newCases['results'] = _.filter(newCases['results'], (item) => item.dataId !== deleteList[i])
      }
      return Object.assign({}, state, {
        cases: newCases,
      })
    }
    default:
      return state
  }
}

export const getCaseList = (state: State) => state.cases
export const getCaseDetail = (state: State) => state.caseDetail
export const getCurrentPageNum = (state: State) => state.currentPageNum
