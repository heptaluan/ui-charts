import { Component, OnInit } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap'

@Component({
  selector: 'lx-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss'],
})
export class InputModalComponent implements OnInit {
  styles
  data = {
    width: 420,
    height: 'auto',
  }
  url = ''
  confirmFlag: boolean = false
  confirmText
  isErrorUrl = false
  constructor(public bsModalRef: BsModalRef, private _modalService: BsModalService) {}

  ngOnInit() {
    this.styles = {
      width: this.data.width + 'px',
      height: this.data.height + 'px',
    }
  }

  close() {
    this.bsModalRef.hide()
  }

  testUrl() {
    if (/mp3|wma|wav|asf|aac|flac|vqf|ape|mid/.test(this.url)) {
      this.isErrorUrl = false
    } else {
      this.isErrorUrl = true
    }
  }

  handleConfirmClick() {
    if (/mp3|wma|wav|asf|aac|flac|vqf|ape|mid/.test(this.url)) {
      this.isErrorUrl = false
      this.confirmFlag = true
      this.close()
    } else {
      this.isErrorUrl = true
    }
  }

  clearUrl() {
    this.url = ''
    this.isErrorUrl = false
  }
}
