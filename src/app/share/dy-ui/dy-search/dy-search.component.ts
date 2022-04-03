import { Component, OnInit, ElementRef, Input, Output, EventEmitter, OnDestroy,ViewChild } from '@angular/core';
import { HotWords } from '../../../pages/home-page/index/index.types';

type headTags = {
  tags: any[];
  showValue: string;
}
@Component({
  selector: 'lx-dy-search',
  templateUrl: './dy-search.component.html',
  styleUrls: ['./dy-search.component.scss']
})
export class DySearchComponent implements OnInit, OnDestroy {
  @Input() hotWords: HotWords;
  @Input() width = 556;
  @Input() placeHolderText = '搜索海量模板';
  @Input() keyWord: string;
  @Input() headTags: headTags;
  @Input() isShowHeadTag: boolean = false;
  @Input() isShowHot: boolean = true;
  @Output() onSearch = new EventEmitter<string>();
  @Output() onDeleteBtnClick = new EventEmitter<string>();
  @Output() onchangeHeadTags = new EventEmitter<string>();

  @ViewChild('input') input: ElementRef;

  isShowDropdown: boolean = false;
  timeout;

  isShowTagMenu: boolean = false;

  constructor(
    private _el: ElementRef,
  ) {}

  ngOnInit() {}

  // 搜索框点击
  handleSearchInputClick() {
    this.isShowDropdown = !this.isShowDropdown; 
    if (window.location.href.indexOf('index') > - 1) {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'index', 'topbanner', 'index-topbanner-input']);
    }
  }

  // 热词搜索
  hotSearch(item, index) {
    if (window.location.href.indexOf('index') > - 1) {
      const value = this.headTags.showValue === '图表' ? 'c' : 'i';
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'index', 'topbanner', `index-topbanner-${value}-hotword${index}`]);
    }
    this.keyWord = item;
    this.onSearchKeyWord(item);
  }

  // 回车处理
  onKeyPress(e: Event) {
    if (e['key'] === 'Enter' || e['which'] === 13 || e['keyCode'] === 13) {
      this.search();
      this.input.nativeElement.blur()
    }
  }

  // 搜索
  search(): void {
    let trueKeyWord = '';
    if (this.keyWord) {
      trueKeyWord = this.keyWord;
    }
    this.onSearchKeyWord(trueKeyWord);
  }

  // 传递搜索词
  onSearchKeyWord(word: string) {
    this.onSearch.emit(word);
  }

  // 改变 headTag
  changeTag(item) {
    this.isShowTagMenu = false;
    if (item === this.headTags.showValue) return;
    this.onchangeHeadTags.emit(item);
  }

  handleShowDropdown() {
    if (this.timeout) {
      this.timeout = null;
    }
    this.timeout = setTimeout(() => {
      this.isShowDropdown = false;
    }, 200);
  }

  ngOnDestroy(): void {
    this.timeout = null;
  }

  delete() {
    this.keyWord="";
    this.onDeleteBtnClick.emit();
  }
}
