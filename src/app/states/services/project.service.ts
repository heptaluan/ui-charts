/*
 * @Description: 个人项目相关服务
 */

import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { API } from '../api.service';
import * as ProjectModels from '../models/project.model';
import { HttpService, CommonResponse } from './custom-http.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as _ from 'lodash';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ProjectService {
  constructor(private _api: API, private _http: HttpService) { }

  // 获取信息图项目列表
  getProjectList(): Observable<any> {
    const getProjectListUrl = this._api.getProject();
    return this._http.get<ProjectModels.ProjectList>(getProjectListUrl, { withCredentials: true });
  }

  // 获取单图项目列表
  getSingleChartProject(): Observable<any> {
    const getSingleChartProjectUrl = this._api.getSingleChartProject();
    return this._http.get<ProjectModels.ChartList>(getSingleChartProjectUrl, { withCredentials: true });
  }

  // 获取全部项目列表
  getAllProjectList(): Observable<any> {
    const getAllProjectListUrl = this._api.getAllProjectList();
    return this._http.get<ProjectModels.ChartList>(getAllProjectListUrl, { withCredentials: true });
  }

  // 新建信息图（单图）
  createProject(data: ProjectModels.CreateProjectInfo): Observable<any> {
    const createProjectUrl = this._api.getProject();
    return this._http.post<ProjectModels.ProjectInfo>(createProjectUrl, data, { withCredentials: true });
  }

  // 模版 fork
  createTemplateProject(data): Observable<any> {
    const createProjectUrl = this._api.getForkTemplateProject(data.payload);
    return this._http.post<ProjectModels.ProjectInfo>(createProjectUrl, {}, { withCredentials: true });
  }

  // 单图 fork
  createChartTemplateProject(data): Observable<any> {
    const createProjectUrl = this._api.getForkChartProject(data.payload);
    return this._http.post<ProjectModels.ProjectInfo>(createProjectUrl, {}, { withCredentials: true });
  }

  // 信息图 fork
  createInfoTemplateProject(data): Observable<any> {
    const createProjectUrl = this._api.getForkInfoProject(data.payload);
    return this._http.post<ProjectModels.ProjectInfo>(createProjectUrl, {}, { withCredentials: true });
  }

  // 批量删除
  deleteProjectList(data): Observable<any> {
    const deleteProjectListUrl = this._api.getDeleteProjectList();
    return this._http.post<ProjectModels.ProjectInfo>(deleteProjectListUrl, data.payload, { withCredentials: true });
  }

  // 获取信息图项目信息
  getProject(id: string, type?: string): Observable<any> {
    const getProjectUrl = this._api.getInfographic(id);
    return this._http.get<CommonResponse<ProjectModels.ProjectBase>>(getProjectUrl, { withCredentials: true });
  }

  // 获取单图项目信息
  getSingleChart(id: string, type?: string): Observable<any> {
    const getSingleChartUrl = this._api.getSingleChartProject(id);
    return this._http.get<CommonResponse<ProjectModels.ProjectBase>>(getSingleChartUrl, { withCredentials: true })
  }

  // 保存/删除/更新 信息图项目（block）
  updateProjectContent(projectId: string, data: ProjectModels.UpdateProjectContent): Observable<any> {
    const updateProjectContentUrl = this.getInfographicUrl(projectId, data.target);
    switch (data.method) {
      case 'add':
        return this._http.post<CommonResponse<any>>(updateProjectContentUrl, _.omit(data, 'target'), { withCredentials: true });
      case 'put':
        return this._http.put<CommonResponse<any>>(updateProjectContentUrl, _.omit(data, 'target'), { withCredentials: true });
      case 'delete':
        return this._http.delete<CommonResponse<any>>(updateProjectContentUrl, { withCredentials: true });
    }
  }

  getInfographicUrl(projectId: string, data: ProjectModels.ProjectContentObject) {
    let url;
    switch (data.type) {
      case 'article':
        url = this._api.getInfographic(projectId);
        break;
      case 'page':
        url = this._api.getInfographic(projectId, data.pageId);
        break;
      case 'chart':
        url = this._api.getInfographic(projectId, data.pageId, data.blockId);
        break;
      case 'text':
        url = this._api.getInfographic(projectId, data.pageId, data.blockId);
        break;
      case 'shape':
        url = this._api.getInfographic(projectId, data.pageId, data.blockId);
        break;
      case 'image':
        url = this._api.getInfographic(projectId, data.pageId, data.blockId);
        break;
      case 'audio':
        url = this._api.getInfographic(projectId, data.pageId, data.blockId);
        break;
      case 'video':
        url = this._api.getInfographic(projectId, data.pageId, data.blockId);
        break;
      case 'group':
        url = this._api.getInfographic(projectId, data.pageId, data.blockId);
        break;
      default:
        url = this._api.getInfographic(projectId, data.pageId, data.blockId);
        break;
    }
    return url;
  }

  // 保存/删除/更新 单图项目（block）
  updateChartProjectContent(projectId: string, data: ProjectModels.UpdateProjectContent): Observable<any> {
    const updateProjectContentUrl = this.getChartUrl(projectId, data.target);
    switch (data.method) {
      case 'add':
        return this._http.post<CommonResponse<any>>(updateProjectContentUrl, _.omit(data, 'target'), { withCredentials: true });
      case 'put':
        return this._http.put<CommonResponse<any>>(updateProjectContentUrl, _.omit(data, 'target'), { withCredentials: true });
      case 'delete':
        return this._http.delete<CommonResponse<any>>(updateProjectContentUrl, { withCredentials: true });
    }
  }

  getChartUrl(projectId: string, data: ProjectModels.ProjectContentObject) {
    let url;
    switch (data.type) {
      case 'article':
        url = this._api.getChartInfo(projectId);
        break;
      case 'page':
        url = this._api.getChartInfo(projectId, data.pageId);
        break;
      case 'chart':
        url = this._api.getChartInfo(projectId, data.pageId, data.blockId);
        break;
      case 'text':
        url = this._api.getChartInfo(projectId, data.pageId, data.blockId);
        break;
      default:
        break;
    }
    return url;
  }

  // 信息图信息修改
  configProject(id: string, data: ProjectModels.ConfigProject): Observable<any> {
    // 处理层级更改,
    if (data.action === 'save_blocks') {
      return of(data)
    } else {
      const configProjectUrl = this._api.getProject(id);
      return this._http.put<Object>(configProjectUrl, data, { withCredentials: true });
    }
  }

  // 单图信息修改
  configChartProject(id: string, data: ProjectModels.ConfigProject): Observable<any> {
    const configChartProjectUrl = this._api.getSingleChartProject(id);
    return this._http.put<Object>(configChartProjectUrl, data, { withCredentials: true });
  }

  // 删除信息图项目列表
  deleteProject(id: string): Observable<any> {
    const deleteProjectUrl = this._api.getProject(id);
    return this._http.delete<CommonResponse<any>>(deleteProjectUrl, { withCredentials: true });
  }

  // 删除单图项目列表
  deleteChartProject(id: string): Observable<any> {
    const deleteChartProjectUrl = this._api.getSingleChartProject(id);
    return this._http.delete<CommonResponse<any>>(deleteChartProjectUrl, { withCredentials: true });
  }

  // 获取主题
  getThemeList(): Observable<any> {
    const getThemeListUrl = this._api.getTheme();
    return this._http.get<ProjectModels.ProjectThemeList>(getThemeListUrl, { withCredentials: true });
  }

}
