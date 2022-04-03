import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'lx-export-to-phone-modal',
  templateUrl: './export-to-phone-modal.component.html',
  styleUrls: ['./export-to-phone-modal.component.scss']
})
export class ExportToPhoneModalComponent implements OnInit {
  url;

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
  }

  // 关闭按钮
  close() {
    this.bsModalRef.hide();
  }


}
