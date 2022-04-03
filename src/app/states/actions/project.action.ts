/*
 * @Description: 个人项目相关操作
 */

import { Action } from '@ngrx/store';
import * as ProjectModel from '../models/project.model';

// 获取信息图项目信息
export const GET_PROJECT_INFO = '[Project] Get Project Info';
export const GET_PROEJCT_INFO_SUCCESS = '[Project] Get Project Info Success';

// 获取单图项目信息
export const GET_SINGLE_CHART_INFO = '[Project] Get Single Chart Info';
export const GET_SINGLE_CHART_INFO_SUCCESS = '[Project] Get Single Chart Success';

export const GET_CHART_PROJECT = '[Project] Get Chart Project';
export const GET_CHART_PROJECT_SUCCESS = '[Project] Get Chart Project Success';

// 获取信息图项目列表
export const GET_PROJECT_LIST = '[Project] Get Project List';
export const GET_PROJECT_LIST_SUCCESS = '[Project] Get Project List Successed';

// 获取单图项目列表
export const GET_CHART_LIST = '[Project] Get Chart List';
export const GET_CHART_LIST_SUCCESS = '[Project] Get Chart List Successed';

// 获取全部项目列表
export const GET_ALL_PROJECT_LIST = '[Project] Get All Project List';
export const GET_ALL_PROJECT_LIST_SUCCESS = '[Project] Get All Project List Successed';

// 新建信息图
export const CREATE_PROJECT = '[Project] Create Project';
export const CREATE_PROJECT_SUCCESS = '[Project] Create Project Success';

// 信息图弹窗修改信息
export const CONFIG_PROJECT = '[Project] Config Project';
export const CONFIG_PROJECT_SUCCESS = '[Project] Config Project Success';
export const CONFIG_PROJECT_FAIL = '[Project] Config Project Fail';

// 单图弹窗修改信息
export const CONFIG_CHART_PROJECT = '[Project] Config Chart Project';
export const CONFIG_CHART_PROJECT_SUCCESS = '[Project] Config Chart Project Success';
export const CONFIG_CHART_PROJECT_FAIL = '[Project] Config Chart Project Fail';

// 信息图 - article 更新
export const SET_PROJECT_TYPE = '[Project] Set Project Type';
export const UPDATE_CURRENT_PROJECT_ARTICLE = '[Project] Update Current Project Article';
export const UPDATE_CURRENT_PROJECT_ARTICLE_SUCCESS = '[Project] Update Current Project Article Success';

// 单图 - article 更新
export const UPDATE_CHART_CURRENT_PROJECT_ARTICLE = '[Project] Update Chart Current Project Article';
export const UPDATE_CHART_CURRENT_PROJECT_ARTICLE_SUCCESS = '[Project] Update Current Chart Project Article Success';

export const SET_RECENT_MODIFIED_PROJECT_OBJECT = '[Project] Set Recent Modified Project Object';
export const SET_PROJECT_SAVING_STATE = '[Project] Set Project Saving State';

// 保存/删除 信息图项目
export const SAVING_PROJECT = '[Project] Saving Info Project';
export const DELETE_PROJECT = '[Project] Delete Info Project';
export const DELETE_PROJECT_SUCCESS = '[Project] Delete Chart Project Success';

// 保存/删除 单图项目
export const SAVING_CHART_PROJECT = '[Project] Saving Chart Project';
export const DELETE_CHART_PROJECT = '[Project] Delete Chart Project';
export const DELETE_CHART_PROJECT_SUCCESS = '[Project] Delete Chart Project Success';

// 信息图 - 保存整个项目
export const UPDATE_AND_EXIT_CURRENT_PROJECT = '[Project] Update And Exit Current Project';
export const UPDATE_AND_EXIT_CURRENT_PROJECT_SUCCESS = '[Project] Update And Exit Current Project Success';

// 单图 - 保存整个项目
export const UPDATE_AND_EXIT_CURRENT_CHART_PROJECT = '[Project] Update And Exit Current Chart Project';
export const UPDATE_AND_EXIT_CURRENT_CHART_PROJECT_SUCCESS = '[Project] Update And Exit Current Chart Project Success';

// 获取主题
export const GET_PROJECT_THEME = '[Project] Get Project Theme';
export const GET_PROJECT_THEME_SUCCESS = '[Project] Get Project Theme Success';

// fork 模版
export const CREATE_TEMPLATE_PROJECT = '[Project] Create Template Project';
export const CREATE_TEMPLATE_PROJECT_SUCCESS = '[Project] Create Template Project Success';

// fork 单图
export const CREATE_CHART_TEMPLATE_PROJECT = '[Project] Create Chart Template Project';
export const CREATE_CHART_TEMPLATE_PROJECT_SUCCESS = '[Project] Create Chart Template Project Success';

// fork 信息图
export const CREATE_INFO_TEMPLATE_PROJECT = '[Project] Create Info Template Project';
export const CREATE_INFO_TEMPLATE_PROJECT_SUCCESS = '[Project] Create Info Template Project Success';

// 批量删除
export const DELETE_PROJECT_LIST = '[Project] Delete Project List';
export const DELETE_PROJECT_LIST_SUCCESS = '[Project] Delete Project List Success';
export const DELETE_PROJECT_LIST_FAIL = '[Project] Delete Project List Fail';

// redo/undo
export const SET_PROJECT_UNDO = '[Project] Set Project Undo';
export const SET_PROJECT_REDO = '[Project] Set Project Redo';

// 组合删除
export const GROUP_DELETE = '[Project] Group Delete';

// 参考线
export const SET_PROJECT_REFERLINE = '[Project] Set referLine';

export class UpdateCurrentProjectGroupDeleteAction implements Action {
  readonly type = GROUP_DELETE;
  constructor(public payload) { }
}

// 组合移动
export const GROUP_MOVE = '[Project] Group Move';

export class UpdateCurrentProjectGroupMoveAction implements Action {
  readonly type = GROUP_MOVE;
  constructor(public payload) { }
}

// 层级调整
export const SET_BLOCK_INDEX = '[Project] Set Block Index';

export class SetCurrentProjectBlockIndexAction implements Action {
  readonly type = SET_BLOCK_INDEX;
  constructor(public payload) { }
}

// 组合锁定
export const GROUP_LOCKED = '[Project] Group Locked';

export class UpdateCurrentProjectGroupLockedAction implements Action {
  readonly type = GROUP_LOCKED;
  constructor(public payload) { }
}

// =========================================


// 保存 article 不走 redo/undo
export const SAVE_ARTICLE_NO_REDO_UNDO = '[Project] Save article not enter redo/undo';

export class SaveCurrentProjectAritcleAction implements Action {
  readonly type = SAVE_ARTICLE_NO_REDO_UNDO;
  constructor(public payload) { }
}

// fork 模版
export class CreateTemplateProjectAction implements Action {
  readonly type = CREATE_TEMPLATE_PROJECT;
  constructor(public payload) { }
}

export class CreateTemplateProjectSuccessAction implements Action {
  readonly type = CREATE_TEMPLATE_PROJECT_SUCCESS;
  constructor(public payload: ProjectModel.ProjectInfo) { }
}

// fork 单图
export class CreateChartTemplateProjectAction implements Action {
  readonly type = CREATE_CHART_TEMPLATE_PROJECT;
  constructor(public payload) { }
}

export class CreateChartTemplateProjectSuccessAction implements Action {
  readonly type = CREATE_CHART_TEMPLATE_PROJECT_SUCCESS;
  constructor(public payload: ProjectModel.ProjectInfo) { }
}

// fork 信息图
export class CreateInfoTemplateProjectAction implements Action {
  readonly type = CREATE_INFO_TEMPLATE_PROJECT;
  constructor(public payload: ProjectModel.CreateProjectInfo) { }
}

export class CreateInfoTemplateProjectSuccessAction implements Action {
  readonly type = CREATE_INFO_TEMPLATE_PROJECT_SUCCESS;
  constructor(public payload: ProjectModel.ProjectInfo) { }
}

// 批量删除
export class DeleteProjectListAction implements Action {
  readonly type = DELETE_PROJECT_LIST;
  constructor(public payload) { }
}

export class DeleteProjectListSuccessAction implements Action {
  readonly type = DELETE_PROJECT_LIST_SUCCESS;
  constructor(public payload) { }
}

export class DeleteProjectListFailAction implements Action {
  readonly type = DELETE_PROJECT_LIST_FAIL;
  constructor() { }
}







// 主题
export class GetProjectThemeAction implements Action {
  readonly type = GET_PROJECT_THEME;
  constructor() { }
}

export class GetProjectThemeSuccessAction implements Action {
  readonly type = GET_PROJECT_THEME_SUCCESS;
  constructor(public payload: ProjectModel.ProjectThemeList) { }
}

// 获取信息图项目信息
export class GetProjectInfoAction implements Action {
  readonly type = GET_PROJECT_INFO;
  constructor(public id: string, public projectType: string) { }
}

export class GetProjectInfoSuccessAction implements Action {
  readonly type = GET_PROEJCT_INFO_SUCCESS;
  constructor(public payload: ProjectModel.ProjectInfo) { }
}

// 获取单图项目信息
export class GetSingleChartInfoAction implements Action {
  readonly type = GET_SINGLE_CHART_INFO;
  constructor(public id: string, public projectType?: string) { }
}

export class GetSingleChartInfoSuccessAction implements Action {
  readonly type = GET_SINGLE_CHART_INFO_SUCCESS;
  constructor(public payload: ProjectModel.ProjectInfo) { }
}

// Chart（1.0）
export class GetChartProjectAction implements Action {
  readonly type = GET_CHART_PROJECT;
  constructor(public payload: string) { }
}

export class GetChartProjectSuccessAction implements Action {
  readonly type = GET_CHART_PROJECT_SUCCESS;
  constructor(public payload: ProjectModel.ProjectArticle) { }
}

// 获取信息图项目列表
export class GetProjectListAction implements Action {
  readonly type = GET_PROJECT_LIST;
  constructor() { }
}

export class GetProjectListSuccessAction implements Action {
  readonly type = GET_PROJECT_LIST_SUCCESS;
  constructor(public payload: ProjectModel.ProjectBase[]) { }
}

// 获取单图项目列表
export class GetSingleChartProjectAction implements Action {
  readonly type = GET_CHART_LIST;
  constructor() { }
}

export class GetSingleChartProjectSuccessAction implements Action {
  readonly type = GET_CHART_LIST_SUCCESS;
  constructor(public payload: ProjectModel.ProjectBase[]) { }
}

// 获取全部项目列表
export class GetAllProjectListAction implements Action {
  readonly type = GET_ALL_PROJECT_LIST;
  constructor() { }
}

export class GetAllProjectListSuccessAction implements Action {
  readonly type = GET_ALL_PROJECT_LIST_SUCCESS;
  constructor(public payload: ProjectModel.ProjectBase[]) { }
}






// 新建信息图（单图）
export class CreateProjectAction implements Action {
  readonly type = CREATE_PROJECT;
  constructor(public payload: ProjectModel.CreateProjectInfo) { }
}

export class CreateProjectSuccessAction implements Action {
  readonly type = CREATE_PROJECT_SUCCESS;
  constructor(public payload: ProjectModel.ProjectInfo) { }
}

// 信息图弹窗修改信息
export class ConfigProjectAction implements Action {
  readonly type = CONFIG_PROJECT;
  constructor(public id: string, public payload: ProjectModel.ConfigProject) { }
}

export class ConfigProjectSuccessAction implements Action {
  readonly type = CONFIG_PROJECT_SUCCESS;
  constructor(public id: string, public payload: ProjectModel.ConfigProject) { }
}

export class ConfigProjectFailAction implements Action {
  readonly type = CONFIG_PROJECT_FAIL;
  constructor() { }
}

// 单图弹窗修改信息
export class ConfigChartProjectAction implements Action {
  readonly type = CONFIG_CHART_PROJECT;
  constructor(public id: string, public payload: ProjectModel.ConfigProject) { }
}

export class ConfigChartProjectSuccessAction implements Action {
  readonly type = CONFIG_CHART_PROJECT_SUCCESS;
  constructor(public id: string, public payload: ProjectModel.ConfigProject) { }
}

export class ConfigChartProjectFailAction implements Action {
  readonly type = CONFIG_CHART_PROJECT_FAIL;
  constructor() { }
}

export class SetProjectTypeAction implements Action {
  readonly type = SET_PROJECT_TYPE;
  constructor(public payload: string) { }
}

// 信息图 - article 更新
export class UpdateCurrentProjectArticleAction implements Action {
  readonly type = UPDATE_CURRENT_PROJECT_ARTICLE;
  constructor(public projectId: string, public payload: ProjectModel.UpdateProjectContent) { }
}

export class UpdateCurrentProjectArticleSuccessAction implements Action {
  readonly type = UPDATE_CURRENT_PROJECT_ARTICLE_SUCCESS;
  constructor(public payload: ProjectModel.UpdateProjectContent) { }
}

// 单图 - article 更新
export class UpdateCurrentChartProjectArticleAction implements Action {
  readonly type = UPDATE_CHART_CURRENT_PROJECT_ARTICLE;
  constructor(public projectId: string, public payload: ProjectModel.UpdateProjectContent) { }
}

export class UpdateCurrentChartProjectArticleSuccessAction implements Action {
  readonly type = UPDATE_CHART_CURRENT_PROJECT_ARTICLE_SUCCESS;
  constructor(public payload: ProjectModel.UpdateProjectContent) { }
}

// export class UpdateCurrentProjectHashAction implements Action {
//     readonly type = UPDATE_CURRENT_PROJECT_HASH;
//     constructor(public payload: ProjectModel.ProjectArticle) {}
// }

export class SetRecentModifyAction implements Action {
  readonly type = SET_RECENT_MODIFIED_PROJECT_OBJECT;
  constructor(public payload: ProjectModel.ProjectContentObject) { }
}


// 设置信息图保存状态
export class SetProjectSavingStateAction implements Action {
  readonly type = SET_PROJECT_SAVING_STATE;
  constructor(public payload: boolean) { }
}

// 保存/删除 信息图项目
export class SavingProjectAction implements Action {
  readonly type = SAVING_PROJECT;
  constructor(public projectId: string, public payload: ProjectModel.UpdateProjectContent) { }
}

export class DeleteProjectAction implements Action {
  readonly type = DELETE_PROJECT;
  constructor(public projectId: string) { }
}

export class DeleteProjectSuccessAction implements Action {
  readonly type = DELETE_PROJECT_SUCCESS;
  constructor(public projectId: string) { }
}

// 保存/删除 单图项目
export class SavingChartProjectAction implements Action {
  readonly type = SAVING_CHART_PROJECT;
  constructor(public projectId: string, public payload: ProjectModel.UpdateProjectContent) { }
}

export class DeleteChartProjectAction implements Action {
  readonly type = DELETE_CHART_PROJECT;
  constructor(public projectId: string) { }
}

export class DeleteChartProjectSuccessAction implements Action {
  readonly type = DELETE_CHART_PROJECT_SUCCESS;
  constructor(public projectId: string) { }
}

// 信息图 - 保存整个项目
export class UpdateAndExitCurrentProjectAction implements Action {
  readonly type = UPDATE_AND_EXIT_CURRENT_PROJECT;
  constructor(public projectId: string, public payload: ProjectModel.ConfigProject) { }
}

export class UpdateAndExitCurrentProjectSuccessAction implements Action {
  readonly type = UPDATE_AND_EXIT_CURRENT_PROJECT_SUCCESS;
  constructor(public id: string, public payload: ProjectModel.ConfigProject) { }
}

// 单图 - 保存整个项目
export class UpdateAndExitCurrentChartProjectAction implements Action {
  readonly type = UPDATE_AND_EXIT_CURRENT_CHART_PROJECT;
  constructor(public projectId: string, public payload: ProjectModel.ConfigProject) { }
}

export class UpdateAndExitCurrentChartProjectSuccessAction implements Action {
  readonly type = UPDATE_AND_EXIT_CURRENT_CHART_PROJECT_SUCCESS;
  constructor(public id: string, public payload: ProjectModel.ConfigProject) { }
}




// redo/undo（不走 @effect）
export class setProjectUndoAction implements Action {
  readonly type = SET_PROJECT_UNDO;
  constructor() { }
}

export class setProjectRedoAction implements Action {
  readonly type = SET_PROJECT_REDO;
  constructor() { }
}


// 设置参考线
export class SetProjectReferLineAction implements Action {
  readonly type = SET_PROJECT_REFERLINE;
  constructor(public payload) { }
}







export type Actions
  = GetProjectInfoAction
  | GetProjectInfoSuccessAction
  | GetSingleChartInfoAction
  | GetSingleChartInfoSuccessAction
  | GetProjectListAction
  | GetProjectListSuccessAction
  | GetSingleChartProjectAction
  | GetSingleChartProjectSuccessAction
  | CreateProjectAction
  | CreateProjectSuccessAction
  | ConfigProjectAction
  | ConfigProjectSuccessAction
  | ConfigProjectFailAction
  | ConfigChartProjectAction
  | ConfigChartProjectSuccessAction
  | ConfigChartProjectFailAction
  | SetProjectTypeAction
  | UpdateCurrentProjectArticleAction
  | UpdateCurrentProjectArticleSuccessAction
  // | UpdateCurrentProjectHashAction
  | UpdateCurrentChartProjectArticleAction
  | UpdateCurrentChartProjectArticleSuccessAction
  | SetRecentModifyAction
  | SetProjectSavingStateAction
  | SavingProjectAction
  | DeleteProjectAction
  | DeleteProjectSuccessAction
  | SavingChartProjectAction
  | UpdateAndExitCurrentProjectAction
  | UpdateAndExitCurrentProjectSuccessAction
  | GetProjectThemeAction
  | GetProjectThemeSuccessAction
  | UpdateAndExitCurrentChartProjectAction
  | UpdateAndExitCurrentChartProjectSuccessAction
  | CreateChartTemplateProjectAction
  | CreateChartTemplateProjectSuccessAction
  | DeleteChartProjectAction
  | DeleteChartProjectSuccessAction
  | CreateInfoTemplateProjectAction
  | CreateInfoTemplateProjectSuccessAction
  | CreateTemplateProjectAction
  | CreateTemplateProjectSuccessAction
  | DeleteProjectListAction
  | DeleteProjectListSuccessAction
  | DeleteProjectListFailAction
  | GetAllProjectListAction
  | GetAllProjectListSuccessAction
  | setProjectUndoAction
  | setProjectRedoAction
  | UpdateCurrentProjectGroupDeleteAction
  | SetCurrentProjectBlockIndexAction
  | UpdateCurrentProjectGroupMoveAction
  | SaveCurrentProjectAritcleAction
  | SetProjectReferLineAction
  | UpdateCurrentProjectGroupLockedAction
