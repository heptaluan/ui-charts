/*
 * @Description: Modify Here, Please
 */

import { Injectable } from '@angular/core'
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { API } from '../api.service'
import * as CaseModels from '../models/case.model'
import { HttpService } from './custom-http.service'

import { Observable } from 'rxjs/Observable'

@Injectable()
export class FavoriteCaseService {
  constructor(private _api: API, private _http: HttpService) {}

  // 获取喜欢列表
  getFavoriteCaseList(type): Observable<any> {
    const getCaseListUrl = this._api.getFavoriteCaseList(type)
    return this._http.get<CaseModels.Case[]>(getCaseListUrl, { withCredentials: true })
  }

  // 删除列表数据
  deleteFavoriteCaseList(data): Observable<any> {
    const deleteCaseListUrl = this._api.deleteFavoriteCaseList()
    const formData = new FormData()
    formData.append('data_list', JSON.stringify(data))
    formData.append('action', 'DELETE')
    return this._http.post<CaseModels.Case[]>(deleteCaseListUrl, formData, { withCredentials: true })
  }
}
