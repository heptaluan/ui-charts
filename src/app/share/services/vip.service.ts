import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../states/reducers';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { API } from '../../states/api.service';

@Injectable()
export class VipService {

  private _isVip: boolean = false;
  private _isVipData: boolean = false;
  private _isDownLoadData: boolean = false;
  private _isCreateNewProject: boolean = false;

  constructor(
    private _store: Store<fromRoot.State>,
    private _http: HttpClient,
    private toastr: ToastrService,
    private _api: API
  ) { }

  isVip(): boolean {
    if (document.cookie.split(';').filter((item) => {
      return item.includes('isp=');
    }).length) {
      this._isVip = document.cookie.replace(/(?:(?:^|.*;\s*)isp\s*\=\s*([^;]*).*$)|^.*$/, "$1") === "True";
    } else {
      this._isVip = false;
    }
    return this._isVip;
  }

  isVipData(): boolean {
    if (document.cookie.split(';').filter((item) => {
      return item.includes('ispd=')
    }).length) {
      this._isVipData = document.cookie.replace(/(?:(?:^|.*;\s*)ispd\s*\=\s*([^;]*).*$)|^.*$/, "$1") === "True";
    } else {
      this._isVipData = false;
    }
    return this._isVipData;
  }

  // 是否可以下载数据（根据下载数判断用户是否可以继续进行下载）
  isDownLoadData(): boolean {
    this._http.get(`${this._api.getOldUrl()}/datastore/user_download_log/`, { withCredentials: true }).subscribe(res => {
      if (res['data']['downloaded_num'] > res['data']['max_download_num']) {
        this._isDownLoadData = false;
      } else {
        this._isDownLoadData = true;
      }
    })
    return this._isDownLoadData;
  }

  // 是否可以创建新的项目（用户项目总数是否超限）
  isCreateNewProject(): boolean {
    this._store.select(fromRoot.getAllProjectList).subscribe(list => {
      if (this.getVipLevel() === 'None' && list.length > 10) {
        this._isCreateNewProject = false;
        this.toastr.warning(null, '项目超限!');
        return false;
      } else if (this.getVipLevel() !== 'None' && list.length > 100) {
        this._isCreateNewProject = false;
        this.toastr.warning(null, '项目超限!');
        return false;
      } else {
        this._isCreateNewProject = true;
      }
    })
    return this._isCreateNewProject;
  }

  // 返回用户 vip 等级
  getVipLevel() {
    return this.getCookie('vpl');
  }

  // 获取完善用户信息
  getIsUiAdd() {
    return this.getCookie('is_u_i_add');
  }

  getCookie(objName) {
    const arrStr = document.cookie.split('; ');
    for (var i = 0; i < arrStr.length; i++) {
      var temp = arrStr[i].split('=');
      if (temp[0] == objName) {
        return decodeURI(temp[1]);
      }
    }
  }

  setCookie(name, value, time) {
    let strsec = this.getsec(time);
    let exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toUTCString();
  }

  getsec(str) {
    //s20是代表20秒
    //h是指小时，如12小时则是：h12
    //d是天数，30天则：d30
    let str1 = str.substring(1, str.length) * 1;
    let str2 = str.substring(0, 1);
    if (str2 == "s") {
      return str1 * 1000;
    } else if (str2 == "h") {
      return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
      return str1 * 24 * 60 * 60 * 1000;
    }
  }

  delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = this.getCookie(name);
    if(cval!=null)
    document.cookie= name + "=" + cval+";expires=" + exp.toUTCString();
  };


}
