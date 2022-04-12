import { Component, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap'

@Component({
  selector: 'lx-pay-data-modal',
  templateUrl: './pay-data-modal.component.html',
  styleUrls: ['./pay-data-modal.component.scss'],
})
export class PayDataModalComponent implements OnInit {
  selectValue = true
  selectType: string = '1'
  isNoDiscount: boolean = true
  discountNum = 10
  oldPrice
  payPrice
  dataItem = {
    title: '',
    thumb: '',
    source: '',
    time: '',
    geotype: '',
    type: '',
    id: '',
  }

  isOverContain: boolean = false

  price

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
    this.payPrice = this.price
  }

  close() {
    this.bsModalRef.hide()
  }

  selectOption(flag) {
    this.selectValue = flag
    this.payPrice = flag ? this.price : 49.9
  }

  // 去价格
  goPrice() {
    const tempPage = window.open('', '_blank')
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/price/index'
  }

  // 支付数据
  payData() {
    if (this.selectValue) {
      const tempPage = window.open('', '_blank')
      tempPage.location.href = window.location.origin + `/vis/alipay/order?product=${this.dataItem.id}&type=dt`
    } else {
      const tempPage = window.open('', '_blank')
      tempPage.location.href = window.location.origin + `/vis/alipay/order?product=601`
    }
  }
}
