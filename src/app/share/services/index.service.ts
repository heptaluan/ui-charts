import { Injectable } from '@angular/core';
import { API } from '../../states/api.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as fromRoot from '../../states/reducers';
import { Store } from '@ngrx/store';
import * as CaseActions from '../../states/actions/project-case.action';

@Injectable()
export class IndexService {
  private httpOptions = { withCredentials: true };
  getTemplateListSubscription = new Subscription();
  constructor(private _api: API, private _http: HttpClient, private _store: Store<fromRoot.State>) {}

  // 获取首页
  showInfographicList() {
    return this._http.get(this._api.getTemplateShowlist(), this.httpOptions);
  }

  // 获取热词
  gotHotSearchWords(type = 'p') {
    return this._http.get(this._api.gotTemplateHotSearchWords(type), this.httpOptions);
  }

  // 获取首页轮播 banner
  gotSiteSliderBanner() {
    return this._http.get(this._api.gotSiteSliderBanner(), this.httpOptions);
  }

  // 查询模板用户是否喜欢
  searchTemplateCollectedById(id: string) {
    this._store.dispatch(new CaseActions.GetProjectCaseDetailAction(id));
    return this._store.select(fromRoot.getProjectCaseDetail).filter(res => !!res);
  }

  // 改变用户模板喜欢状态
  toggleCollectState(collectState: boolean, id: string) {
    this._store.dispatch(
      new CaseActions.ToggleLikeCaseAction({
        type: 'infographic',
        caseid: id,
        islike: collectState ? 1 : 0
      })
    );
  }
}
