import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DataDemandFeedbackComponent } from '../../../components/modals';

@Component({
  selector: 'lx-dy-index-footer',
  templateUrl: './dy-index-footer.component.html',
  styleUrls: ['./dy-index-footer.component.scss']
})
export class DyIndexFooterComponent implements OnInit {
  // 底部数据
  qrcodeTip: string = '';

  bottomTip: string = '';

  constructor(private modalService: BsModalService) {}

  ngOnInit() {}

  // 处理显示二维码
  handleItemCode(tip, action) {
    if (action === 'enter') {
      this.qrcodeTip = tip;
    } else {
      this.qrcodeTip = '';
    }
  }

  // 处理显示文字
  handleItemTip(tip, action) {
    if (action === 'enter') {
      this.bottomTip = tip;
    } else {
      this.bottomTip = '';
    }
  }

  // 意见反馈
  handleFeedback() {
    this.modalService.show(DataDemandFeedbackComponent, {
      initialState: {
        title: '意见反馈',
        type: 'request',
        yourRequest: '告诉我们你的建议或遇到的问题'
      }
    });
  }

  goNewPage(str: string) {
    const tempPage = window.open('', '_blank');
    tempPage.location.href = window.location.href.split('#')[0] + str;
  }
}
