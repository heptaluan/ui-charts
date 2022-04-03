import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'lx-pay-data-modal',
  templateUrl: './pay-data-modal.component.html',
  styleUrls: ['./pay-data-modal.component.scss']
})
export class PayDataModalComponent implements OnInit {

  selectValue = true;
  selectType: string = '1';

  // 有无折扣
  isNoDiscount: boolean = true;

  // 打几折
  discountNum = 10;
  // 旧价格
  oldPrice;

  payPrice;

  dataItem = {
    title: '',
    thumb: '',
    source: '',
    time: '',
    geotype: '',
    type: '',
    id: ''
  };

  isOverContain: boolean = false;

  price;

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    // 初始化价格
    this.payPrice = this.price;
  }

  // 关闭按钮
  close() {
    this.bsModalRef.hide();
  }

  selectOption(flag) {
    this.selectValue = flag;
    this.payPrice = flag ? this.price : 49.9;
  }

  // 去价格
  goPrice() {
    const tempPage = window.open('', '_blank');
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/price/index';
  }

  // 支付数据
  payData() {
    if (this.selectValue) {
      const tempPage = window.open('', '_blank');
      tempPage.location.href = window.location.origin + `/vis/alipay/order?product=${this.dataItem.id}&type=dt`;
    } else {
      const tempPage = window.open('', '_blank');
      tempPage.location.href = window.location.origin + `/vis/alipay/order?product=601`;
    }
  }

}
