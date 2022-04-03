import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import NP from 'number-precision';
import { min } from 'rxjs/operator/min';

export interface SettingsSizeEvent {
  locked: boolean,
  value0: string,
  value1: string,
  value2: string,
}

@Component({
  selector: 'lx-settings-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})

export class SizeComponent implements OnInit {
  @Input() title0: string = '高度(px)';
  @Input() title1: string = '宽度(px)';
  @Input() title2: string = '角度(deg)';
  @Input() letter0: string = '';
  @Input() letter1: string = '';
  @Input() letter2: string = '';
  @Output() onChanged = new EventEmitter();
  isBorder : number = -1;

  private _locked: boolean = false;
  @Input()
  set locked(locked: boolean) {
    this._locked = locked;
  }
  get locked() { return this._locked }

  @Input() value0: number = 0;
  @Input() value1: number = 0;
  @Input() value2: number = 0;
  
  @Input() max0: number = null;
  @Input() min0: number = null;
  @Input() max1: number = null;
  @Input() min1: number = null;
  @Input() max2: number = null;
  @Input() min2: number = null;
  @Input() ratio: number = null; // 是否需要控件根据比例自动计算出对应 value null 默认不锁定
  @Input() decimal: number = 0;  // 结果保留小数位数，默认为 0
  @Input() pageSetting: boolean;
  @Input() isLockClick: boolean = true; // 设置 lock 是否可以点击

  @ViewChild('input0') childInput0: ElementRef;
  @ViewChild('input1') childInput1: ElementRef;
  @ViewChild('input2') childInput2: ElementRef;

  constructor(
    private _el: ElementRef
  ) { }

  ngOnInit() {
    if (!this.value2) this.value2 = 0;
  }

  ngAfterViewInit() {

  }

  onLockClicked() {
    if (this.isLockClick) {
      this._locked = !this._locked;
      this.emitValue('locked');
    }
  }

  onInput0(event) {
    this.isBorder = -1;
    this.value0 = event.srcElement.value;
    this.emitValue('value0');
  }

  onInput1(event) {
    this.isBorder = -1;
    this.value1 = event.srcElement.value;
    this.emitValue('value1');
  }

  onInput2(event) {
    this.isBorder = -1;
    this.value2 = Number(event.srcElement.value) % 360;
    this.emitValue('value2');
  }

  onfocus(num) {
    this.isBorder = num;
  }

  onKeyPress(event, type) {
    if (event.keyCode == "13") {
      if (type == 'value0') {
        this.value0 = event.srcElement.value;
      } else if (type == 'value1') {
        this.value1 = event.srcElement.value;
      } else if (type == 'value2') {
        this.value2 = event.srcElement.value;
      }
      this.childInput0.nativeElement.blur();
      this.childInput1.nativeElement.blur();
      this.childInput2.nativeElement.blur();
      event.preventDefault();
    } else {
      this.formatInput(event);
    }
  }

  formatInput(event) {
    // 兼容 Safari 左右键控制光标
    if (event.keyCode != "37" && event.keyCode != "39") {
      event.srcElement.value = event.srcElement.value.replace(/\D/g, '');
    }
  }

  emitValue(type: 'value0' | 'value1' | 'value2' | 'locked') {
    this.value0 = this.countExtremeNum(this.value0, this.max0, this.min0).result;
    this.value1 = this.countExtremeNum(this.value1, this.max1, this.min1).result;
    this.value2 = this.countExtremeNum(this.value2, this.max2, this.min2).result;

    // 根据比例计算 value
    if (this.locked && type != 'locked' && this.ratio) {
      if (type == 'value0') {
        const data = this.countExtremeNum(this.value0 / this.ratio, this.max1, this.min1);
        this.value1 = data.result;
        if (data.limit) {
          this.value0 = this.value1 * this.ratio;
        }
      } else if (type == 'value1') {
        const data = this.countExtremeNum(this.value1 * this.ratio, this.max0, this.min0);
        this.value0 = data.result;
        if (data.limit) {
          this.value1 = this.value0 / this.ratio;
        }
      }
    }

    this.value0 = NP.round(this.value0, this.decimal);
    this.value1 = NP.round(this.value1, this.decimal);
    this.value2 = NP.round(this.value2, this.decimal);
    this.childInput0.nativeElement.value = this.value0;
    this.childInput1.nativeElement.value = this.value1;
    this.childInput2.nativeElement.value = this.value2;
    const eventData = {
      locked: this.locked ? true : false,
      value0: this.value0,
      value1: this.value1,
      value2: this.value2,
      type
    };
    this.onChanged.emit(eventData);
  }

  countExtremeNum(value, max, min) {
    let result = value || 0;
    let limit = false;
    if (max != null && min != null) {
      result = value > max ? max : (value < min ? min : value)
      limit = true;
    } else if (max != null && min == null) {
      result = value > max ? max : value;
      limit = true;
    } else if (max == null && min != null) {
      result = value < min ? min : value;
      limit = true;
    }
    return {
      result,
      limit
    };
  }
}
