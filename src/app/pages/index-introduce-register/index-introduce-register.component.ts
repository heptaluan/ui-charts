import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lx-index-introduce-register',
  templateUrl: './index-introduce-register.component.html',
  styleUrls: ['./index-introduce-register.component.scss']
})
export class IndexIntroduceRegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) || /(Android)/i.test(navigator.userAgent)) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
      // 加载 rem 布局
      (function (designWidth, maxWidth) {
        var doc = document,
          win = window,
          docEl = doc.documentElement,
          remStyle = document.createElement('style'),
          tid;

        function refreshRem() {
          var width = docEl.getBoundingClientRect().width;
          maxWidth = maxWidth || 540;
          width > maxWidth && (width = maxWidth);
          var rem = width * 100 / designWidth;
          remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
        }

        if (docEl.firstElementChild) {
          docEl.firstElementChild.appendChild(remStyle);
        } else {
          var wrap = doc.createElement('div');
          wrap.appendChild(remStyle);
          doc.write(wrap.innerHTML);
          wrap = null;
        }
        // 要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
        refreshRem();

        win.addEventListener('resize', function () {
          // 防止执行两次
          clearTimeout(tid);
          tid = setTimeout(refreshRem, 300);
        }, false);

        win.addEventListener('pageshow', function (e) {
          // 浏览器后退的时候重新计算
          if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
          }
        }, false);

        if (doc.readyState === 'complete') {
          doc.body.style.fontSize = '16px';
        } else {
          doc.addEventListener('DOMContentLoaded', function (e) {
            doc.body.style.fontSize = '16px';
          }, false);
        }
      })(750, 750);

    }  
  }

}
