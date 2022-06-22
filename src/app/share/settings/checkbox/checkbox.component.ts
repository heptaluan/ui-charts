import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'lx-checkbox',
  styleUrls: ['./checkbox.component.scss'],
  template: `
    <div
      class="lx-checkbox"
      [ngClass]="{ 'box-checked': checked, 'box-disabled': disabled }"
      (click)="onClicked()"
    ></div>
  `,
})
export class CheckboxComponent implements OnInit {
  @Input() checked = false
  @Input() disabled = false
  @Output() change = new EventEmitter()

  constructor() {}

  onClicked() {
    if (this.disabled) {
      return
    }
    this.checked = !this.checked
    this.change.emit(this.checked)
  }

  ngOnInit() {}
}
