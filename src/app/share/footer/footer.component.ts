import { Component, OnInit } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { DataDemandFeedbackComponent } from '../../components/modals/data-demand-feedback/data-demand-feedback.component'

@Component({
  selector: 'lx-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(private _modalService: BsModalService) {}

  ngOnInit() {}

  // 意见反馈
  handleFeedback() {
    this._modalService.show(DataDemandFeedbackComponent, {
      initialState: {
        title: '意见反馈',
        type: 'request',
        yourRequest: '告诉我们你的建议或遇到的问题',
      },
    })
  }

  // 帮助中心/快速上手
  goHelp() {
    let tempPage = window.open('', '_blank')
    tempPage.location.href = window.location.href.split('#')[0] + '#/pages/help/list'
  }
}
