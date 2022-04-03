import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'lx-business-price',
  templateUrl: './business-price.component.html',
  styleUrls: ['./business-price.component.scss']
})
export class BusinessPriceComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
  }

  close() {
    this.bsModalRef.hide();
  }

}
