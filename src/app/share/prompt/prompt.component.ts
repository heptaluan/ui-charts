import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'

export interface ModalTitle {
  position: 'center' | 'right' | 'left'
  content: string
}

export interface ModalActions {
  position: 'center' | 'right' | 'left' | 'around'
  buttons: Array<{
    title: string
    action: string
  }>
}

export { ButtonType } from '../modal/modal.component'

@Component({
  selector: 'lx-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
})
export class PromptComponent implements OnInit {
  @Input('title') title: ModalTitle
  @Input('insertSong') insertSong: boolean = false
  @Input() actions: ModalActions
  @Output('promptHide') promptHide = new EventEmitter()

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}

  hidePrompt(button) {
    this.bsModalRef.hide()
    this.promptHide.emit(button)
  }
}
