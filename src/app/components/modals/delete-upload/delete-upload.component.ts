import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { ModalActions, ModalTitle, ButtonType } from '../../../share/prompt/prompt.component'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'lx-delete-upload',
  templateUrl: './delete-upload.component.html',
  styleUrls: ['./delete-upload.component.scss'],
})
export class DeleteUploadComponent implements OnInit {
  content = ''
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

  isInsertSong: boolean = false

  constructor(public bsModalRef: BsModalRef, private toastr: ToastrService) {}

  ngOnInit() {}

  onModalClosed(evt: ButtonType) {
    switch (evt.action) {
      case 'cancel':
        break
      case 'confirm':
        this.confirmFlag = true
        break
      default:
        break
    }
  }
}
