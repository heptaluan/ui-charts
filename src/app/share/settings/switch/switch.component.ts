import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'lx-switch',
  styleUrls: ['./switch.component.scss'],
  template: `
    <ui-switch
      [checked]="checked"
      [disabled]="disabled"
      (change)="switchChange($event)"
      (changeEvent)="switchChangeEvent($event)"
      (valueChange)="switchValueChange($event)"
      color="#36AF47"
      switchColor="#fcfcfc"
      defaultBgColor="#282828"
    ></ui-switch>
  `,
})
export class SwitchComponent {
  @Input() checked: boolean = false
  @Input() disabled: boolean = false
  @Output() change = new EventEmitter()
  @Output() changeEvent = new EventEmitter()
  @Output() valueChange = new EventEmitter()

  switchChange(event) {
    this.change.emit(event)
  }

  switchChangeEvent(event) {
    this.changeEvent.emit(event)
  }

  switchValueChange(event) {
    this.valueChange.emit(event)
  }
}
