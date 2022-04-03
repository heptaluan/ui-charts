import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'lx-float-menu',
  templateUrl: './float-menu.component.html',
  styleUrls: ['./float-menu.component.scss']
})
export class FloatMenuComponent implements OnInit {
  wechatFlag: boolean = false;
  assisFlag: boolean = false;
  smallCodeFlag: boolean = false;

  isShowFloatMenu: boolean = true;
  isShowTip: boolean = false;

  @Input() isShowBackTop: boolean = false;

  isShowBox = false;
  isShowSupport = false;

  boxImgTop = 0;

  boXImg = '/dyassets/images/index/xiaodi.jpg';

  boxImgText = '专属客服-小镝';

  constructor(private router: Router) {}

  ngOnInit() {
    if (window.self !== window.top) {
      this.isShowFloatMenu = false;
    } else {
      this.isShowFloatMenu = true;
    }

    if (localStorage.getItem("float-menu-show")) {
      this.isShowTip = true;
    }
  }

  // 回到顶部
  backToTop() {
    document.querySelectorAll('.index-wrapper')[0].scrollTo(0, 0);
    // 加动画
    // $('.index -wrapper').animate({ scrollTop: 0 }, 300);
  }

  // 处理点击事件
  handleItemClick(name) {
    switch (name) {
      case '赚钱':
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'navigation', 'navi-right', 'navi-right-earnmoney']);
        // 跳转
        window.open('', '_blank').location.href =  "https://dycharts.com/inviteu-e/index.html";
        // let temPage = window.open('', '_blank');
        // temPage.location.href = window.location.href.split('#')[0] + '#/pages/price/index';
        break;
      case '会员特权':
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'navigation', 'navi-right', 'navi-right-members']);
        // 跳转
        this.router.navigate(['pages', 'home', 'price']);
        // let temPage = window.open('', '_blank');
        // temPage.location.href = window.location.href.split('#')[0] + '#/pages/price/index';
        break;
      case '帮助中心':
        localStorage.removeItem("float-menu-show");
        this.isShowTip = false;
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'navigation', 'navi-right', 'navi-right-help']);
        // 跳转
        let tempPage = window.open('', '_blank');
        tempPage.location.href = window.location.href.split('#')[0] + '#/pages/help/list';
        break;
      case '返回顶部':
        this.backToTop();
        break;
      default:
        break;
    }
  }

  // 处理鼠标移入事件
  handleItemMove(name, event) {
    if (event === 'leave') {
      this.isShowBox = false;
      this.isShowSupport = false;
    } else {
      switch (name) {
        case '客服':
          // 百度统计
          window['_hmt'].push(['_trackEvent', 'navigation', 'navi-right', 'navi-right-service-hover']);
          this.boXImg = '/dyassets/images/index/xiaodi.jpg';
          this.boxImgTop = 70;
          this.boxImgText = '专属客服-小镝';
          this.isShowSupport = true;
          break;
        case '服务号':
          // 百度统计
          window['_hmt'].push(['_trackEvent', 'navigation', 'navi-right', 'navi-right-mp-hover']);
          this.isShowBox = true;
          this.boXImg = 'https://ss1.dydata.io/v2/home/code.jpg';
          this.boxImgTop = 130;
          this.boxImgText = '微信服务号';
          break;
        case '小程序':
          this.isShowBox = true;
          this.boXImg = '/dyassets/images/index/small-code.png';
          this.boxImgTop = 190;
          this.boxImgText = '小程序';
          break;
        case '赚钱':
          this.isShowBox = true;
          this.boXImg = '/dyassets/images/index/invite-e-code.png';
          this.boxImgTop = -64;
          this.boxImgText = '扫码赚千元现金';
          break;
        default:
          break;
      }
    }
  }
}
