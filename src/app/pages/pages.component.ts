/*
 * @Description: 页面布局
 */
import { Component, OnInit } from '@angular/core'
import * as $ from 'jquery'
import { Router } from '@angular/router'

@Component({
  selector: 'lx-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  isMobile: boolean = false

  constructor(private _router: Router) {}

  ngOnInit() {
    if (window.self !== window.top) {
      $('nb-layout-header').hide()
      $('.home-sidebar').hide()
      $('.content').addClass('iframe-box')
      $('.create-project').hide()
      $('.float-wrapper').hide()
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) || /(Android)/i.test(navigator.userAgent)) {
      this.isMobile = true
    }

    if (this._router.url.split('?')[1] !== 'from=workspace') {
      localStorage.setItem('comefrom', 'workspace')
    }
  }
}
