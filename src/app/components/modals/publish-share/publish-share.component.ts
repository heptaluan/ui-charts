import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { API } from '../../../states/api.service';

@Component({
  selector: 'lx-publish-share',
  templateUrl: './publish-share.component.html',
  styleUrls: ['./publish-share.component.scss']
})
export class PublishShareComponent implements OnInit {

  url: string;
  copyText: boolean = false;
  title: string = '分享';
  type;
  showWeixinCode: boolean = false;
  shareCoverImg: string = '/dyassets/images/loading.gif'

  constructor(
    public bsModalRef: BsModalRef,
    private _http: HttpClient,
    private _router: ActivatedRoute,
    private _api: API
  ) { }

  ngOnInit() {
    if (this.type === 'datastore') {
      this.showWeixinCode = true;
      const weixinShareCoverUrl = `${this._api.getHost()}/dychart/wxa_code?itemId=${this.url.split('=')[1]}`
      this._http.get(weixinShareCoverUrl, { withCredentials: true })
        .subscribe(res => {
          if (res) {
            this.shareCoverImg = res['data']['url'];
          }
        })
    }
  }

  copyUrl() {
    // 复制进剪切板
    var oInput = document.createElement('input');
    oInput.value = this.url;
    document.body.appendChild(oInput);
    oInput.select();
    document.execCommand("Copy");
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    this.copyText = true;
  }

}
