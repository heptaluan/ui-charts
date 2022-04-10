import { Component, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { ModalActions, ModalTitle, ButtonType } from '../../../share/prompt/prompt.component'

@Component({
  selector: 'lx-common-delete-modal',
  templateUrl: './common-delete-modal.component.html',
  styleUrls: ['./common-delete-modal.component.scss'],
})
export class CommonDeleteModalComponent implements OnInit {
  content: string = ''
  showTip: boolean
  isChecked: boolean = false

  deleteTitle: ModalTitle = {
    position: 'left',
    content: '确认删除该图片吗?',
  }
  text

  deleteActions: ModalActions = {
    position: 'right',
    buttons: [
      {
        title: '取消',
        action: 'cancel',
      },
      {
        title: '删除',
        action: 'confirm',
      },
    ],
  }

  confirmFlag: boolean = false

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}

  onModalClosed(evt: ButtonType) {
    switch (evt.action) {
      case 'cancel':
        break
      case 'confirm':
        this.confirmFlag = true
        if (this.isChecked) {
          localStorage.setItem('modalTipStartTime', new Date().getTime().toString())
        }
        break
      default:
        break
    }
  }
}
