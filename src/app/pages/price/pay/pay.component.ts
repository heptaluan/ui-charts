import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { VipService } from '../../../share/services/vip.service'
import { UserInfoCollectModalComponent } from '../../../components/modals'
import { BsModalService } from 'ngx-bootstrap/modal'
import { HttpClient } from '@angular/common/http'
import { API } from '../../../states/api.service'

@Component({
  selector: 'lx-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
})
export class PayComponent implements OnInit {
  chaeckType: number = 0
  recommendType: number = 0
  vipLevel: string
  payId: Number // 支付 id
  payUrl: string // 支付链接

  isShowReceipt: boolean = false

  // 跨域允许
  httpOptions = { withCredentials: true }

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _vipService: VipService,
    private _modalService: BsModalService,
    private _http: HttpClient,
    private _api: API
  ) {}

  ngOnInit() {
    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2/#/pages/configuration/pay?*']);

    window.scrollTo(0, 0)
    if (this._activatedRoute.snapshot.queryParams.vip) {
      this.chaeckType = Number(this._activatedRoute.snapshot.queryParams.vip)
    } else {
      this.chaeckType = 0
    }
    this.createPayUrl()
  }

  changeChaeckType(index) {
    if (index === 0) {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'price', 'price-pay', 'price-choose-lv1'])
    } else {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'price', 'price-pay', 'price-choose-lv2'])
    }
    this.chaeckType = index
    window.location.href = location.href.split('vip')[0]
    this.createPayUrl()
  }

  recommendHandle(index) {
    if (index === 0) {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'price', 'price-pay', 'price-choose-duration-12'])
    } else {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'price', 'price-pay', 'price-choose-duration-1'])
    }
    this.recommendType = index
    this.createPayUrl()
  }

  createPayUrl() {
    switch (this.chaeckType) {
      case 0:
        if (this.recommendType === 0) {
          this.payId = 512
        } else if (this.recommendType === 1) {
          this.payId = 501
        }
        break
      case 1:
        if (this.recommendType === 0) {
          this.payId = 612
        } else if (this.recommendType === 1) {
          this.payId = 601
        }
        break
      default:
        break
    }
    this.payUrl = `${this._api.getOldUrl()}/vis/alipay/order?product=${this.payId}`
  }

  // 用户信息采集
  updateIsUiAdd(resolve) {
    // 检查用户是否提交职业信息
    const url = `${this._api.getOldUrl()}/vis/auth/user_need_add_info`
    this._http.get(url, this.httpOptions).subscribe((data) => {
      resolve(data)
    })
  }

  // 展示发票
  toggleReceipt(flag) {
    this.isShowReceipt = flag
  }

  /**
   * @description [goPay 去支付]
   * @memberof PayComponent
   */
  goPay() {
    // 先获取数据，再判断是否填写信息收集
    new Promise((resolve, reject) => {
      this.updateIsUiAdd(resolve)
    }).then((data) => {
      if (data['data']['is_u_i_add']) {
        window.location.href = this.payUrl
      } else {
        this._modalService.show(UserInfoCollectModalComponent, {
          ignoreBackdropClick: true,
          initialState: {
            payUrl: this.payUrl,
            isPriceEnter: true,
          },
        })
      }
    })
  }
}
