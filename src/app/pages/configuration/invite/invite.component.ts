import { Component, OnInit } from '@angular/core';
import { API } from '../../../states/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'lx-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  code: string = '';
  url: string = '';

  shareUrl: string = '';
  copyText: boolean = false;

  // 定义邀请人的信息
  invitedNum: number = 0;        // 已邀请人数
  getVipDays: number = 0;        // 获取 vip 天数
  getSvipDays: number = 0;       // 获取 svip 天数
  dataList = [{
    user_info: {
      name: '暂无',
      avatar: ''
    },
    time: '暂无'
  }];

  // 跨域允许
  httpOptions = { withCredentials: true };

  constructor(
    private _http: HttpClient,
    private _api: API,
  ) { }

  ngOnInit() {
    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2/#/pages/configuration/invite']);
    // 获取用户邀请码
    this.getUserCode();
    // 获取用户邀请记录
    this.getUserInviteLog();
  }

  // 复制进剪切板
  copyUrl() {
    var oInput = document.createElement('textarea');
    oInput.value = this.url;
    document.body.appendChild(oInput);
    oInput.select();
    document.execCommand("Copy");
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    this.copyText = true;
  }

  // 获取用户邀请码
  getUserCode() {
    this._http.get(this._api.getUserInviteCode(), this.httpOptions)
      .subscribe(data => {
        this.code = data['data']['code'];
        // 活动链接
        this.url = `https://dycharts.com/inviteu/index.html?code=${this.code}`;
        // 分享二维码链接
        this.shareUrl = `https://dycharts.com/inviteu/index.html?code=${this.code}`;
      })
  }

  // 获取用户邀请的用户信息
  getUserInviteLog() {
    this._http.get(this._api.getUserInvited(), this.httpOptions)
      .subscribe(data => {
        this.invitedNum = data['data']['count'];
        if (data['data']['results'].length !== 0) {
          this.dataList = data['data']['results'];
        }
        this.getVipDays = this.invitedNum;
        this.getSvipDays = Math.floor(this.invitedNum / 5);
      })
  }

}
