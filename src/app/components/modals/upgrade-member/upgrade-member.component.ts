import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { VipService } from '../../../share/services/vip.service'
import { API } from '../../../states/api.service'
import { UserInfoCollectModalComponent } from '../user-info-collect-modal/user-info-collect-modal.component'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'lx-upgrade-member',
  templateUrl: './upgrade-member.component.html',
  styleUrls: ['./upgrade-member.component.scss'],
})
export class UpgradeMemberComponent implements OnInit {
  isShowReceipt: boolean = false
  chaeckType: number = 1
  recommendType: number = 0
  isVpl: string
  vipIds = []
  svipIds = []
  vipPriceList = [
    {
      id: '1',
      text: '每日可导出30个项目',
      upPrice: true,
    },
    {
      id: '3',
      text: '支持JPG/SVG/GIF文件导出',
      upPrice: true,
    },
    {
      id: '2',
      text: '支持透明底PNG文件导出',
      upPrice: true,
    },
    // {
    //   id: '3',
    //   text: '支持GIF文件导出',
    //   upPrice: true
    // },
    {
      id: '4',
      text: '100个项目存储空间',
      upPrice: false,
    },
    {
      id: '6',
      text: '500M图片素材存储空间',
      upPrice: true,
    },
    {
      id: '5',
      text: '100个上传数据存储空间',
      upPrice: true,
    },
    {
      id: '13',
      text: '支持全部图表模板类型',
      upPrice: true,
    },
    {
      id: '14',
      text: '支持全部信息图模板类型',
      upPrice: true,
    },
    {
      id: '15',
      text: '图表项目可自定义logo',
      upPrice: true,
    },
  ]

  svipPriceList = [
    {
      id: '1',
      text: '每日可导出30个项目',
      upPrice: true,
    },
    {
      id: '4',
      text: '100个项目存储空间',
      upPrice: false,
    },
    {
      id: '5',
      text: '100个上传数据存储空间',
      upPrice: true,
    },
    {
      id: '6',
      text: '500M图片素材存储空间',
      upPrice: true,
    },
    {
      id: '7',
      text: '会员专属精美信息图模板',
      upPrice: true,
    },
    {
      id: '9',
      text: '自营付费数据可免费下载',
      upPrice: true,
    },
    {
      id: '10',
      text: '自营付费数据可免费制作图表',
      upPrice: true,
    },
    {
      id: '11',
      text: '每月可下载100个免费/自营付费数据',
      upPrice: false,
    },
  ]

  payId: Number // 支付 id
  payUrl: string // 支付链接

  // 跨域允许
  httpOptions = { withCredentials: true }

  constructor(
    private _activatedRoute: ActivatedRoute,
    public bsModalRef: BsModalRef,
    private _vipService: VipService,
    private _modalService: BsModalService,
    private _api: API,
    private _http: HttpClient
  ) {}
  ngOnInit() {
    this.createPayUrl()
  }

  changeChaeckType(index) {
    if (index == 0) {
      window['_hmt'].push(['_trackEvent', 'payPopup', 'pay', 'popup-choose-lv1'])
    } else {
      window['_hmt'].push(['_trackEvent', 'payPopup', 'pay', 'popup-choose-lv2'])
    }
    this.chaeckType = index
    window.location.href = location.href.split('vip')[0]
    this.createPayUrl()
  }

  recommendHandle(index) {
    if (index == 0) {
      window['_hmt'].push(['_trackEvent', 'payPopup', 'pay', 'popup-choose-duration-12'])
    } else {
      window['_hmt'].push(['_trackEvent', 'payPopup', 'pay', 'popup-choose-duration-1'])
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
    const url = `${this._api.getOldUrl()}/vis/auth/user_need_add_info`
    this._http.get(url, this.httpOptions).subscribe((data) => {
      resolve(data)
    })
  }

  /**
   * @description [goPay 去支付]
   * @memberof PayComponent
   */
  goPay() {
    this.bsModalRef.hide()
    new Promise((resolve, reject) => {
      this.updateIsUiAdd(resolve)
    }).then((data) => {
      if (data['data']['is_u_i_add']) {
        const tempPage = window.open('', '_blank')
        tempPage.location.href = this.payUrl
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

  // 展示发票
  toggleReceipt(flag) {
    this.isShowReceipt = flag
  }
}
