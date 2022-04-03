import { Component, Input, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'lx-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  // @ViewChild(ChartDirective) chartHost: ChartDirective;
  // @ViewChildren('groupItem') groupItem;
  // blockComponentRef: ComponentRefItem[] = [];
  @Input('data') _data;
  set data(val) {
    this._data = val;
    if (val.setting) {
      this.initGroupData();
    }
  }
  get data() { return this._data; }

  _isSelected;
  set isSelected(val) {
    this._isSelected = val;
  }
  get isSelected() {
    return this._isSelected;
  }

  initData;
  timer = null;
  projectId;
  constructor(private rd2: Renderer2) { }

  ngOnInit() {
    // if (this.data && this.data.setting) {
    //   this.data.setting.props.children.forEach(block => {
    //     this.loadBlock(block)
    //   });
    // }
  }

  ngAfterViewInit(): void {
    // this.initData = _.cloneDeep(this.data);
    // this.groupItem._results.forEach((item, index) => {
    //   this.rd2.setStyle(item.nativeElement, 'left', this.getPos(this.data.setting.props.children[index], this.data, 'left') + 'px');
    //   this.rd2.setStyle(item.nativeElement, 'top', this.getPos(this.data.setting.props.children[index], this.data, 'top') + 'px');
    // });
    // console.log('🚗🚗🚗🚗🚗🚗');
    
  }

  initGroupData() {
    if (this.data.setting) {
      // && this.groupItem
      // this.timer = null;
      // this.timer = setTimeout(() => {
      //   this.groupItem._results.forEach((item, index) => {
      //     console.log(this.data.setting.props.children[index], this.data, this.getPos(this.data.setting.props.children[index], this.data, 'left'), '🚀🚀🚀🚀');
          
      //     this.rd2.setStyle(item.nativeElement, 'left', this.getPos(this.data.setting.props.children[index], this.data, 'left') + 'px');
      //     this.rd2.setStyle(item.nativeElement, 'top', this.getPos(this.data.setting.props.children[index], this.data, 'top') + 'px');
      //   });
      // }, 0);
      
      // const leftDiff = Number(this.data.setting.position.left) - Number(this.initData.setting.position.left);
      // const topDiff = Number(this.data.setting.position.top) - Number(this.initData.setting.position.top);
      // console.log(leftDiff, topDiff);
      
      // const copyData = _.cloneDeep(this.data);
      // copyData.setting.props.children.forEach(block => {
      //   block.position = {
      //     top: topDiff + Number(block.position.top),
      //     left: leftDiff + Number(block.position.left)
      //   }
      //   return block;
      // });
      // this.timer = null;
      // this.timer = setTimeout(() => {
      //   this.groupItem._results.forEach((item, index) => {
      //     this.rd2.setStyle(item.nativeElement, 'left', this.getPos(this.data.setting.props.children[index], this.initData, 'left') + 'px');
      //     this.rd2.setStyle(item.nativeElement, 'top', this.getPos(this.data.setting.props.children[index], this.initData, 'top') + 'px');
      //   });
      // }, 0);
      // 死循环 此路通
      // this.updateCurBlock(copyData.setting, true)
    }
  }


  // getPos(data, data2, pos) {
  //   return Number(data.position[pos]) - Number(data2.setting.position[pos]);
  // }

  ngOnDestroy() {
    // this.timer = null;
  }

}
