import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalTitle } from '../../share/prompt/prompt.component';

export interface ButtonType {
  title: string;
  action?: string;
}

export type ActionPosition = 'center' | 'left' | 'right' | 'round';

@Component({
  selector: 'lx-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input('position') position: ActionPosition;
  @Input('title') title: ModalTitle;
  @Output('modalHide') modalHide = new EventEmitter();
  @Output('selectAction') selectAction = new EventEmitter();
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
