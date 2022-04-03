/*
 * @Description: 个人设置相关服务
 */
import { Injectable } from '@angular/core';
import { API } from '../api.service';
import { HttpService } from './custom-http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as UserModel from '../models/user.model';

@Injectable()
export class UserService {
  constructor(private _api: API, private _http: HttpService) { }

  getUserInfo(): Observable<any> {
    const url = this._api.userInfo();
    return this._http.get<UserModel.UserInfo>(url, { withCredentials: true });
  }

  setUserInfo(options: FormData): Observable<any> {
    const url = this._api.userInfo();
    return this._http.patch(url, options, { withCredentials: true });
  }

  getUserBill(): Observable<any> {
    const url = this._api.userBill();
    return this._http.get<UserModel.UserBill>(url, { withCredentials: true });
  }

  // 更新用户版本号
  updateUserVer(data): Observable<any> {
    const url = this._api.getUserInfoVer();
    return this._http.post<UserModel.UserInfo>(url, data, { withCredentials: true });
  }
}
