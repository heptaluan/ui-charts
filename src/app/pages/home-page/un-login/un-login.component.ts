import { Component, OnInit } from '@angular/core';
import { API } from '../../../states/api.service';

@Component({
  selector: 'lx-un-login',
  templateUrl: './un-login.component.html',
  styleUrls: ['./un-login.component.scss']
})
export class UnLoginComponent implements OnInit {

  constructor(
    private _api: API
  ) { }

  ngOnInit() {
  }

  login() {
    window['_hmt'].push(['_trackEvent', 'navigation', 'navi-center', 'navi-center-login']);
    window.location.href =
      `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
      encodeURIComponent(window.location.href.split('#')[0] + window.location.hash);
  }

}
