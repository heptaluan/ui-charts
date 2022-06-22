import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'lx-radio',
  styleUrls: ['./radio.component.scss'],
  template: `
    <label class="custom-control custom-radio align-items-center">
      <input type="radio" class="custom-control-input" [name]="name" [checked]="checked" (change)="onChange($event)" />
      <span class="custom-control-indicator"></span>
      <span class="custom-control-description">{{ description }}</span>
    </label>
  `,
})
export class RadioComponent implements OnInit {
  @Input() name
  @Input() description
  @Input() checked: boolean
  @Output() onChanged = new EventEmitter()
  constructor() {}

  ngOnInit() {}

  onChange(event) {
    this.onChanged.emit(event.target.checked)
  }
}
