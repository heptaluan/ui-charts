/*
 * @Description: project case service
 */

import { Injectable } from '@angular/core'
import {} from '@angular/common/http'
import { API } from '../api.service'
import * as CaseModels from '../models/case.model'
import { HttpService } from './custom-http.service'

import { Observable } from 'rxjs/Observable'

@Injectable()
export class ProjectCaseService {
  constructor(private _api: API, private _http: HttpService) {}

  getProjectGetDetail(data: string): Observable<any> {
    const getProjectCaseDetailUrl = this._api.getCaseDetail(data)
    return this._http.get<CaseModels.Case>(getProjectCaseDetailUrl, { withCredentials: true })
  }

  getChartProjectDetail(data: string): Observable<any> {
    const getChartProjectDetailUrl = this._api.getChartCaseDetail(data)
    return this._http.get<CaseModels.Case>(getChartProjectDetailUrl, { withCredentials: true })
  }

  // 信息图 - 我的喜欢
  toggleCaseLike(data: CaseModels.ToggleLikeCase): Observable<any> {
    const toggleLikeUrl = this._api.caseLike()
    return this._http.post<any>(toggleLikeUrl, data, { withCredentials: true })
  }
}
