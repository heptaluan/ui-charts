import { Component, OnInit } from '@angular/core'
import { ModalActions, ModalTitle, ButtonType } from '../../../share/prompt/prompt.component'
import { BsModalRef } from 'ngx-bootstrap/modal'
import * as _ from 'lodash'
import { DataTransmissionService } from '../../../share/services'

@Component({
  selector: 'lx-upload-tips',
  templateUrl: './upload-tips.component.html',
  styleUrls: ['./upload-tips.component.scss'],
})
export class UploadTipsComponent implements OnInit {
  deleteTitle: ModalTitle = {
    position: 'left',
    content: '提示',
  }

  deleteActions: ModalActions = {
    position: 'right',
    buttons: [
      {
        title: '取消',
        action: 'cancel',
      },
      {
        title: '确认',
        action: 'confirm',
      },
    ],
  }

  block

  constructor(public bsModalRef: BsModalRef, private _dataTransmissionService: DataTransmissionService) {}

  ngOnInit() {}

  onModalClosed(evt: ButtonType) {
    switch (evt.action) {
      case 'confirm':
        this._dataTransmissionService.sendData2Table(this.block)
      default:
        break
    }
  }
}
