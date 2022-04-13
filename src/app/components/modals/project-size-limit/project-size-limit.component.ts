import { Component, OnInit } from '@angular/core'
import { ModalActions, ModalTitle, ButtonType } from '../../../share/prompt/prompt.component'

@Component({
  selector: 'lx-project-size-limit',
  templateUrl: './project-size-limit.component.html',
  styleUrls: ['./project-size-limit.component.scss'],
})
export class ProjectSizeLimitComponent implements OnInit {
  modalTitle: ModalTitle = {
    position: 'center',
    content: '提示',
  }

  modalActions: ModalActions = {
    position: 'right',
    buttons: [
      {
        title: '确定',
        action: 'cancel',
      },
    ],
  }

  constructor() {}

  ngOnInit() {}
}
