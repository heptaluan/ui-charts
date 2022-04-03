import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SearchTypeService } from '../services';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';


@Component({
  selector: 'lx-switch-setting',
  templateUrl: './switch-setting.component.html',
  styleUrls: ['./switch-setting.component.scss']
})
export class SwitchSettingComponent implements OnInit {
  @Input() name = "lineWidth";
  @Input() themColorList;
  @Input() value;
  @Input() data;

  @Output() valueChange = new EventEmitter();
  @Output() valueBlurChange = new EventEmitter();

  sectionValue;
  showObj;
  initColor = '#333333ff';
  initNumber = '5';
  dataNumber = 0;
  minValue = '10';
  maxValue = '90';

  constructor(
    private _searchTypeService: SearchTypeService,
    private _el: ElementRef
  ) { }

  ngOnInit() {
    // 从字典里面取到的对应对象
    this.showObj = this._searchTypeService.selectDisplay(this.name);
    
    // 取到null时颜色控件初始化颜色
    if (typeof this.value === 'string' && this.value.indexOf('#') > -1) {
      this.initColor = this.value;
    }

    if (this.value && this.showObj.control === 'dropdown-toggle&number-input') {
      this.initNumber = this.value;
    }

    if (this.value && this.showObj.control === 'range-number-input') {
      this.minValue = String(Math.round(Number(this.value[0]) * 100));
      this.maxValue = String(Math.round(Number(this.value[1]) * 100));
    }
  }

  ngOnChanges(changes): void{
    if (changes.value && changes.value.currentValue) {
      this.initColor = changes.value.currentValue
    }
    if (changes.data && changes.data.isFirstChange) {
      if (this.data) {
        
        this.sectionValue = this.value.sectionValue;
        let numList = []
        
        this.data.data[0].map(d => {
          if(Number(d[1])) {
            numList.push(Number(d[1])) 
          }            
        })

        let min = Math.min(...numList); //最小值
        let max = Math.max(...numList); // 最大值
        let minInt = (String(min).indexOf(".") == -1) ? (min - 1) : min;//为整数就减一
        let maxInt = (String(max).indexOf(".") == -1) ? (max + 1) : max;  //为整数就加一
        this.dataNumber = maxInt - minInt;
      }
    }
  }

  onInput(num, ratio) {
    this.valueChange.emit({value:num / ratio,type:"redo"});
  }

  changeColor(color) {
    this.value = color;
    this.valueChange.emit(this.value);
  }

  /**
   * @description dropdown-toggle&color-picker
   * @param {number} index 0 传 null 1 传颜色
   */
  changeDrop(index) {
    this.value = index === 0 ? null : this.initColor;
    this.valueChange.emit(this.value);
  }

  // dropdown-toggle
  changeDropList(value) {
    this.valueChange.emit(value);
  }

  // multichoices-value
  changeDropListMult(value){
    
    let newValue = _.cloneDeep(this.value)

    if(newValue.key !== value) {
      let newSection = (this.dataNumber / Number(this.sectionValue)).toFixed(1)
      if (Number(newSection.split('.')[1]) === 0) {
        newSection = newSection.split('.')[0] ;
      } 
      newValue.sectionValue = newSection;
      this.sectionValue = newSection;

      // 组数四舍五入
      if(this.value.key !== 'groupNum') {
        newValue.sectionValue = Number(newSection).toFixed(0);
        this.sectionValue = Number(newSection).toFixed(0);
      }
    }
    newValue.key = value;
    
    
    this.valueChange.emit(newValue); 
  }

  changeMultSectionValue() {
    let newValue = _.cloneDeep(this.value)
    newValue.sectionValue = this.sectionValue;
    this.valueChange.emit(newValue);   
  }

  changeRange(event,type) {
    var targetValue = event.currentTarget.value ? event.currentTarget.value : event.target.value;
    console.log(targetValue);
    
    if (type === 0) {
      this.minValue = targetValue;
      if (targetValue === '' || Number(targetValue) < 10 || Number(targetValue) > 90) {
        this.value[0] = '0.1';
        this.minValue = '10';
      } 
      console.log(this.minValue);
      
      if (Number(this.minValue) < Number(this.maxValue)){
        this.value[0] = String((Number(this.minValue) / 100));
        this.value[1] = String(Number(this.maxValue) / 100);
      } else {
        this.value[0] = String(Number(this.maxValue) /100);
        this.value[1] = String((Number(this.minValue) / 100));
      }

      this.valueChange.emit(this.value);
    } else if (type === 1) {
      this.maxValue = targetValue;
      if (targetValue === '' || Number(targetValue) < 10 || Number(targetValue) > 90) {
        this.value[1] = '0.9';
        this.maxValue = '90';
      }
      
      if (Number(this.maxValue) > Number(this.minValue)){
        this.value[0] = String(Number(this.minValue) / 100);
        this.value[1] = String((Number(this.maxValue) / 100));
      } else {
        this.value[1] = String(Number(this.minValue) / 100);
        this.value[0] = String((Number(this.maxValue) / 100));
      }

      this.valueChange.emit(this.value);
    }
    console.log(this.value);
    
  }

  /**
   * @description dropdown-toggle&number-input
   * @param {number} index 0 传 null 1 传数字
   */
  changeNumberDrop(index) {
    this.value = index === 0 ? null : this.initNumber;
    this.valueChange.emit(this.value);
  }

  changeNumber(number) {
    if (number === "") {
      number = '0'
    } else if (Number(number) > 100) {
      number = '100'; 
    } else if (Number(number) < 0) {
      number = '0'; 
    }
    this.value = number;
    this.valueChange.emit(this.value);
  }

  validite(flag) {
    if (this.sectionValue < 0 || (!this.sectionValue && !flag) ) {
      this.sectionValue = 0;
    }
  }

  changeCorner(event,index:number) { 
    let list = _.cloneDeep(this.value);
    list.splice(index,1,parseInt(event))
    this.value = list;
    this.valueChange.emit({value:this.value,type:"redo"});

  }

  inputBlur(e) {
    if (e.key === "Enter") {
      e.target.blur();
    }  
  }

  emitvalueBlurChange() {
    this.valueBlurChange.emit();
  }
}
