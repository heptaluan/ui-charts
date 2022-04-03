import { Component, OnInit } from '@angular/core';
import { API } from '../../../states/api.service';
import { HttpClient } from '@angular/common/http';
import Swiper from 'swiper';
import { Router } from '@angular/router';

@Component({
  selector: 'lx-templates-index',
  templateUrl: './templates-index.component.html',
  styleUrls: ['./templates-index.component.scss']
})

export class TemplatesIndexComponent implements OnInit {

  mySwiper: Swiper;
  displayFlag: boolean = false;
  inputValue;
  private httpOptions = { withCredentials: true };

  listTemplates = [];
  constructor(
    private _api: API,
    private _http: HttpClient,
    private _router: Router
  ) { }

  ngOnInit() {
    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2/#/pages/templates/index']);

    window.scrollTo(0, 0);
    setTimeout(() => {
      this._swiperInit();
    }, 300)

    // 获取展示数据
    this.getShowlist();
  }

  onSearchEmitValue(value) {
    if (!value) value = '';
    this._router.navigate(['pages', 'templates', 'list'], { queryParams: { keyword: value } });
  }

  _swiperInit() {
    this.mySwiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      scrollbar: {
        el: '.swiper-scrollbar',
      },
      speed: 1000,
      autoplay: {
        disableOnInteraction: true,
      },
    });
  }

  // 获取首页展示列表
  getShowlist() {
    this._http.get(this._api.getTemplateShowlist(), this.httpOptions)
      .subscribe(res => {
        this.listTemplates = res['data']['list'];
      })
  }

  // 查看更多
  viewMore(item) {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'templatecenter', 'template-index', 'template-index-more-byType', item.id]);

    this._router.navigate(['pages', 'templates', 'list'], { queryParams: { index: item.id } })
  }
}
