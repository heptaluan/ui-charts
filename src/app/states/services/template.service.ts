/*
 * @Description: 模板service
 */

import { Injectable } from '@angular/core';
import { API } from '../api.service';
import { HttpService } from './custom-http.service';
import * as TemplateModels from '../models/template.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

@Injectable()
export class TemplateService {
  constructor(private _api: API, private _http: HttpService) { }

  getProjectTemplateList(options: TemplateModels.GetTemplate): Observable<any> {
    const getTemplateListUrl = this._api.getProjectTemplate();
    const httpOptions = {
      params: options,
      withCredentials: true
    };
    return this._http.get<TemplateModels.ProjectTemplateList>(getTemplateListUrl, httpOptions);
  }

  getChartTemplateList(): Observable<any> {
    const getChartTemplateListUrl = this._api.getChartTemplate();
    return this._http.get<TemplateModels.ChartTemplateList>(getChartTemplateListUrl, { withCredentials: true });
  }
}
