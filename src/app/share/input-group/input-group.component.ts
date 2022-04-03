import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lx-input-group',
  templateUrl: './input-group.component.html',
  styleUrls: ['./input-group.component.scss']
})
export class InputGroupComponent implements OnInit {

  @Input() inputTitle: string = '';
  @Input() inputDefaultValue: string = '';
  @Input() buttonValue: string = '';
  @Input() checked: boolean = false;
  @Input() isShowInput: boolean = false;

  @Output() inputValue = new EventEmitter();
  @Output() switchValue = new EventEmitter();
  @Output() btnClick = new EventEmitter();

  @ViewChild('input') input;

  constructor() { }

  ngOnInit() {
  }

  hanelSwitchChange(value) {
    this.switchValue.emit(value)
  }

  handleInputKeyup(e) {
    if (e.keyCode == '13') {
      this.input.nativeElement.blur();
    }
  }

  handleInputBlur() {
    this.inputValue.emit(this.input.nativeElement.value)
  }

  // 处理按钮点击事件
  handleBtnClick() {
    this.btnClick.emit();
  }

}
