/*
 * @Description: 页面布局
 */
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../states/reducers';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { GetChartTemplateListAction } from '../states/actions/template.action';

@Component({
  selector: 'lx-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})

export class PagesComponent implements OnInit {

  isMobile: boolean = false;
  
  constructor(
    private _store: Store<fromRoot.State>,
    private _router: Router
  ) {
    // this._store.dispatch(new UserActions.GetUserInfoAction());
    // 获取项目列表
    // this._store.dispatch(new GetChartTemplateListAction());
  }

  ngOnInit() {
    // 如果该页面被嵌入在 ifrmae 当中
    if (window.self !== window.top) {
      $('nb-layout-header').hide();
      $('.home-sidebar').hide();
      $('.content').addClass('iframe-box');
      $('.create-project').hide();
      $('.float-wrapper').hide();
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) || /(Android)/i.test(navigator.userAgent)) {
      this.isMobile = true;
    } 

    if (this._router.url.split('?')[1] !== 'from=workspace') {
      localStorage.setItem("comefrom","workspace");
    }
    
  }

}
