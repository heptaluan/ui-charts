import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'lx-classify',
  templateUrl: './classify.component.html',
  styleUrls: ['./classify.component.scss']
})
export class ClassifyComponent implements OnInit {
  @Input() type; // 传进来的类型
  @Input('data') categories;  // 总共的
  @Input() isFix: boolean = false;  // 总共的
  @Input() partCategories;   // 部分的
  @Input() hideShape = false;
  @Input() isTemplates = false;
  @Output() private category = new EventEmitter();

  activeIndex: number = 0;
  title: string = '展开';
  more: boolean = false; // 开关

  constructor() { }

  ngOnInit() {
    this.title = this.hideShape ?  '展开更多' : '展开';
  }

  // 展开
  extends() {
    this.more = !this.more;
    if (this.more) {
      this.partCategories = this.categories;
      this.title = '收起';
    } else {
      if (this.isFix) {
        this.partCategories = this.partCategories.slice(0, 3);
      } else {
        this.partCategories = this.partCategories.slice(0, 5);
      }
      this.title = this.hideShape ?  '展开更多' : '展开';
      
    }
  }

  // onSelect
  onSelect(item,i) {
    this.activeIndex = i;
    this.category.emit(item.category);
    if(this.type === 'icon') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-select-icontype-index', i]);
    } else if (this.type === 'image') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-select-imagetype-index', i]);
    }
  }

}
