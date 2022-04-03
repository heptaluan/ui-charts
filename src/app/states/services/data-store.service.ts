/*
 * @Description: data store service
 */

import { Injectable } from '@angular/core';
import { API } from '../api.service';
import { HttpService } from './custom-http.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataStoreService {
  constructor(private _api: API, private _http: HttpService) { }

  getDataStoreList(data): Observable<any> {
    const getDataStoreListUrl = this._api.getDataStoreList();
    return this._http.post(getDataStoreListUrl, data.payload);
  }
}
