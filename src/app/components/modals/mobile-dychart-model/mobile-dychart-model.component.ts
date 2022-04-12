import { Component, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap'

@Component({
  selector: 'lx-mobile-dychart-model',
  templateUrl: './mobile-dychart-model.component.html',
  styleUrls: ['./mobile-dychart-model.component.scss'],
})
export class MobileDychartModelComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}

  close() {
    this.bsModalRef.hide()
  }
}
