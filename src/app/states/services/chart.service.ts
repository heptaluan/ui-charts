/*
 * @Description: v1.0 chart服务
 */

import { Injectable } from '@angular/core';
import { API } from '../api.service';
import * as ChartModels from '../models/chart.model';
import { HttpService } from './custom-http.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ChartService {
  constructor(private _api: API, private _http: HttpService) { }

  getChart(id: any): Observable<any> {
    const getChartUrl = this._api.getChart();
    return this._http.get<ChartModels.ChartBase>(getChartUrl, { withCredentials: true });
  }
}
