/*
 * @Description: 个人设置-购买会员
 */
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { API } from '../../../states/api.service';

@Component({
  selector: 'lx-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  @ViewChild('selectDiv') selectDiv;

  curIndex = 0;
  selectTip = '您购买的会员为1个月';
  selectTotal = '￥9.9';
  selectPer = '/月';
  selectOrigin = '￥19.9';

  modalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private _api: API
  ) { }

  ngOnInit() {
  }

  onSelectClicked(index) {
    for (const child of this.selectDiv.nativeElement.children) {
      child.classList.remove('active');
    }
    this.selectDiv.nativeElement.children[index].classList.add('active');
    this.curIndex = index;
    if (index === 0) {
      this.selectTip = '您购买的会员为1个月';
      this.selectTotal = '￥9.9';
      this.selectPer = '/月';
      this.selectOrigin = '￥19.9';
    } else if (index === 1) {
      this.selectTip = '您购买的会员为3个月';
      this.selectTotal = '￥29';
      this.selectPer = '/季';
      this.selectOrigin = '￥59';
    } else if (index === 2) {
      this.selectTip = '您购买的会员为12个月';
      this.selectTotal = '￥99';
      this.selectPer = '/年';
      this.selectOrigin = '￥199';
    }
  }

  onBuyClicked() {
    const index = this.curIndex;
    let service = '';
    if (index === 0) {
      service = 'month';
    } else if (index === 1) {
      service = 'quarter';
    } else if (index === 2) {
      service = 'year';
    }
    const url = `${this._api.getOldUrl()}/vis/alipay/order?type=${service}`;
    window.location.href = url;
  }

  onAskClicked(template: TemplateRef<any>) {
    // // 价格 百度统计
    // window['_hmt'].push(['_trackEvent', 'price', 'contact', 'price-askforemail']);
    this.modalRef = this.modalService.show(template);
  }
}
