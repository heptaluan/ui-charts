/*
 * @Description: 状态处理器入口
 */
import { Params, RouterStateSnapshot } from '@angular/router';
import { createSelector } from 'reselect';
import { ActionReducer, combineReducers, Action, ActionReducerMap } from '@ngrx/store';
import { routerReducer, RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../../environments/environment';
import { ProjectInfo, ProjectBase } from '../models/project.model';

import * as fromProject from './project.reducer';
import * as fromUser from './user.reducer';
import * as fromTemplate from './template.reducer';
import * as fromFavoriteCase from './favorite-case.reducer';
import * as fromProjectCase from './project-case.reducer';
import * as fromChart from './chart.reducer';
import * as fromDataStore from './data-store.reducer';

import * as _ from 'lodash';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const { url, root: { queryParams } } = routerState;
    const { params } = route;
    return { url, params, queryParams };
  }
}

export interface State {
  router: RouterReducerState<RouterStateUrl>;
  project: fromProject.State;
  user: fromUser.SubState;
  template: fromTemplate.State;
  favoriteCase: fromFavoriteCase.State;
  projectCase: fromProjectCase.State;
  chartV1: fromChart.State;
  dataStoreList: fromDataStore.State;
}

const initialRouterState = {
  state: {
    url: '/',
    params: undefined,
    queryParams: undefined
  },
  navigationId: undefined
};

export const emptyState: State = {
  router: initialRouterState,
  project: fromProject.initialState,
  user: fromUser.initialState,
  template: fromTemplate.initialState,
  favoriteCase: fromFavoriteCase.initialState,
  projectCase: fromProjectCase.initialState,
  chartV1: fromChart.initialState,
  dataStoreList: fromDataStore.initialState
};

export const reducers: ActionReducerMap<State> = {
  router: routerReducer,
  project: fromProject.reducer,
  user: fromUser.reducer,
  template: fromTemplate.reducer,
  favoriteCase: fromFavoriteCase.reducer,
  projectCase: fromProjectCase.reducer,
  chartV1: fromChart.reducer,
  dataStoreList: fromDataStore.reducer
};

// project selectors
export const getProjects = (state: State) => {
  return state.project;
};
export const getProjectList = createSelector(getProjects, fromProject.getProjectList);
export const getChartProjectList = createSelector(getProjects, fromProject.getChartProjectList);
export const getAllProjectList = createSelector(getProjects, fromProject.getAllProjectList);

// 合并 redo/undo 更新数据
export const getRedoUndoUpdateType = createSelector(getProjects, fromProject.getRedoUndoUpdateType);
export const getRedoUndoUpdateData = createSelector(getProjects, fromProject.getRedoUndoUpdateData);
export const getAllArticleRecords = createSelector(getProjects, fromProject.getAllArticleRecords);
export const getNextArticle = createSelector(getProjects, fromProject.getNextArticle);
export const getRedoUndoUpdateTypeAndData = createSelector(getRedoUndoUpdateType, getRedoUndoUpdateData, (updateType, updateData) => {
  if (!updateType) {
    return {
      target: undefined,
      data: undefined
    }
  } else {
    return {
      target: _.omit(updateType, ['article']),
      data: _.omit(updateData, ['type', 'data'])
    }
  }
})

export const getRecentModifiedObject = createSelector(getProjects, fromProject.getRecentModify);
export const getCurrentProjectTheme = createSelector(getProjects, fromProject.getCurrentProjectTheme);
export const getCurrentProject = createSelector(getProjects, fromProject.getCurrentProject);
export const getCurrentProjectArticle = createSelector(getProjects, fromProject.getCurrentProjectArticle);
export const getCurrentProjectFull = createSelector(getCurrentProject, getCurrentProjectArticle, (basic, content): ProjectInfo => {
  if (basic && content) {
    const fullInfo = _.cloneDeep(basic);
    Object.assign(fullInfo, {
      article: content,
      // theme: theme
    });
    return <ProjectInfo>fullInfo;
  }
});
export const getProjectSavingState = createSelector(getProjects, fromProject.getSavingState);
export const getProjectContents = createSelector(getCurrentProjectArticle, (article) => {
  if (article) {
    return article.contents;
  }
})

// 获取 fork 返回的 id
export const getForkTemplateProjectId = createSelector(getProjects, fromProject.getCurrentTemplateProjectId);
export const getForkChartProjectId = createSelector(getProjects, fromProject.getCurrentChartProjectId);
export const getForkInfoProjectId = createSelector(getProjects, fromProject.getCurrentInfoProjectId);

// 单图
export const getCurrentChartProject = createSelector(getProjects, fromProject.getCurrentChartProject);
export const getCurrentChartArticle = createSelector(getProjects, fromProject.getCurrentChartArticle);
export const getCurrentChartProjectFull = createSelector(getCurrentChartProject, getCurrentChartArticle, (basic, content): ProjectInfo => {
  if (basic && content) {
    const fullInfo = _.cloneDeep(basic);
    Object.assign(fullInfo, {
      article: content
    });
    return <ProjectInfo>fullInfo;
  }
});

// user selects
export const getUsers = (state: State) => {
  return state.user;
};

export const getUserInfo = createSelector(getUsers, fromUser.getUserInfo);
export const getUserBill = createSelector(getUsers, fromUser.getUserBill);
export const getUserVip = createSelector(getUserInfo, (info) => {
  return info ? info.is_vip : false;
})

// template selectors
export const getTemplate = (state: State) => {
  return state.template;
};

export const getProjectTemplates = createSelector(getTemplate, fromTemplate.getProjectTemplates);
export const getProjectTemplatesCurrentType = createSelector(getTemplate, fromTemplate.getProjectTemplatesCurrentType);
export const getProjectTemplateCurrentTypeList = createSelector(getProjectTemplates, getProjectTemplatesCurrentType, (templates, currentType) => {
  const ret = _.find(templates, { type: currentType });
  if (ret) {
    return ret.list;
  } else {
    return [];
  }
});
export const getChartTemplates = createSelector(getTemplate, fromTemplate.getChartTemplates);

// project case
export const getProjectCases = (state: State) => {
  return state.projectCase;
}

export const getProjectCaseList = createSelector(getProjectCases, fromProjectCase.getCaseList);
export const getProjectCaseDetail = createSelector(getProjectCases, fromProjectCase.getCaseDetail);
export const getProjectCaseTotal = createSelector(getProjectCases, fromProjectCase.getCaseTotal);
export const getProjectCaseCurrentPageNum = createSelector(getProjectCases, fromProjectCase.getCurrentPageNum);
export const getProjectCaseSortType = createSelector(getProjectCases, fromProjectCase.getCaseSort);
export const getProjectCaseSearch = createSelector(getProjectCases, fromProjectCase.getCaseSearch);

// favorite case
export const getFavoriteCases = (state: State) => {
  return state.favoriteCase;
};

export const getFavoriteCaseList = createSelector(getFavoriteCases, fromFavoriteCase.getCaseList);

// chart v1.0
export const getChart = (state: State) => {
  return state.chartV1;
};

export const getChartList = createSelector(getChart, fromChart.getChartList);
export const getCurrentChartId = createSelector(getChart, fromChart.getCurrentChart);
export const getCurrentChart = createSelector(getChartList, getCurrentChartId, (list, id) => {
  return _.find(list, id);
});


// data store
export const getDataStore = (state: State) => {
  return state.dataStoreList;
};

export const getDataStoreList = createSelector(getDataStore, fromDataStore.getDataStoreList);

export const getLastRecods = (state: State) => {
  return state.project.allArticleRecords;
}; 