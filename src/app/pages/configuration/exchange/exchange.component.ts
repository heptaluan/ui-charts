import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { API } from '../../../states/api.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap'
import { ExchangeModalComponent } from '../../../components/modals'
import { Router } from '@angular/router'

@Component({
  selector: 'lx-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit {
  exchangeCode: string = ''
  errorMsg: string = ''
  succMsg: string = ''
  isCode: boolean = false
  isService: boolean = false
  bsModalRef: BsModalRef

  @Output() goMyVip = new EventEmitter()

  // 跨域允许
  httpOptions = { withCredentials: true }

  constructor(
    private _http: HttpClient,
    private _api: API,
    private _modalService: BsModalService,
    private route: Router
  ) {}

  ngOnInit() {}

  onHandleFocus() {
    this.errorMsg = ''
    this.succMsg = ''
  }

  exchange() {
    if (!this.exchangeCode.trim()) {
      this.errorMsg = '兑换码不能为空'
      return
    } else {
      this.errorMsg = ''
    }
    let data = {
      code: this.exchangeCode,
      action: 'active',
    }
    let url = `${this._api.getOldUrl()}/vis/biz/vip_code_rights/`
    this._http.post(url, data, this.httpOptions).subscribe((data) => {
      if (data['resultCode'] === 2022) {
        this.errorMsg = '兑换码错误或已失效'
      } else if (data['resultCode'] === 2024) {
        this.errorMsg = '您已使用过该兑换码'
      } else if (data['resultCode'] === 1000) {
        this.errorMsg = ''

        this._modalService.show(ExchangeModalComponent, {
          initialState: {
            days: data['data']['days'],
          },
        })
      }
    })
  }

  handleGoMyVip() {
    this.goMyVip.emit()
  }

  // 处理参与
  handleEnterClick() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'exchange', 'exchange', 'exchange-activity-url'])
    this.route.navigate(['pages', 'home', 'invite'])
  }
}
