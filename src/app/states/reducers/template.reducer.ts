/*
 * @Description: 模板reducer
 */

import * as TemplateActions from '../actions/template.action'
import * as TemplateModels from '../models/template.model'
import * as _ from 'lodash'

interface StateListItem {
  type: string
  list: TemplateModels.ProjectTemplate[]
}

export interface State {
  currentType: string
  projectTemplates: StateListItem[]
  chartTemplates: TemplateModels.ChartTemplate[]
}

export const initialState: State = {
  currentType: '',
  projectTemplates: [],
  chartTemplates: [],
}

function CSVToArray(data) {
  const dataList = data.split('\n')
  const table = _.map(dataList, (item) => {
    const col = item.split(',')
    return _.map(col, (cell) => cell.trim())
  })
  return [table]
}

export function reducer(state = initialState, action: TemplateActions.Actions): State {
  switch (action.type) {
    case TemplateActions.GET_PROJECT_TEMPLATE_LIST_SUCCESS:
      const templateType = action.templateType
      const templateList = action.payload
      const templates = _.cloneDeep(state.projectTemplates)
      if (_.findIndex(templates, { type: templateType }) < 0) {
        templates.push({
          type: templateType,
          list: templateList,
        })
        return Object.assign({}, state, {
          projectTemplates: templates,
        })
      } else {
        return state
      }
    case TemplateActions.SET_PROJECT_TEMPLATE_CURRENT_TYPE:
      return Object.assign({}, state, {
        currentType: action.payload,
      })
    case TemplateActions.GET_CHART_TEMPLATE_LIST_SUCCESS:
      const chartTemplates = _.cloneDeep(action.payload.templates)
      _.map(chartTemplates, (template) => {
        if (typeof template.dataSrc.data === 'string') {
          template.dataSrc.data = CSVToArray(template.dataSrc.data)
        }
      })
      return Object.assign({}, state, {
        chartTemplates: chartTemplates,
      })
    default:
      return state
  }
}

export const getProjectTemplates = (state: State) => state.projectTemplates
export const getProjectTemplatesCurrentType = (state: State) => state.currentType
export const getChartTemplates = (state: State) => state.chartTemplates
