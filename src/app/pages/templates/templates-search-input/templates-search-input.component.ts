import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { API } from '../../../states/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'lx-templates-search-input',
  templateUrl: './templates-search-input.component.html',
  styleUrls: ['./templates-search-input.component.scss']
})
export class TemplatesSearchInputComponent implements OnInit {

  searchValue;
  @Output() searchEmitValue = new EventEmitter();
  @ViewChild('searchInput') searchInput: ElementRef;
  @Input() value;

  hotSearchWords = [];

  constructor(
    private _api: API,
    private _http: HttpClient

  ) { }

  ngOnInit() {
    if (this.value) {
      this.searchValue = this.value;
    }
    // this.hotSearchWords = ['双十二','圣诞节','微信公众号','工作汇报','Banner','海报','商务风格'];
    this._http.get(this._api.gotTemplateHotSearchWords(), { withCredentials: true })
      .subscribe(res => {
        this.hotSearchWords = res['data'];
      })
  }

  searchHandle() {
    this.searchEmitValue.emit(this.searchValue);
    this.searchInput.nativeElement.blur();
  }

  onKeyPress(event) {
    if (event.keyCode == "13") {
      this.searchValue = event.target.value;
      this.searchInput.nativeElement.blur();
      this.searchHandle();
    }
  }

  // 只判断当前用户清空搜索框的情况，重新搜索全部数据
  onKeyUp(event) {
    if (window.location.href.indexOf('index') > 0) {
      return;
    } else {
      this.searchValue = event.target.value;
      if (this.searchValue === '') {
        this.searchEmitValue.emit(this.searchValue);
      }
    }

  }

  // 搜索全部数据
  searchAll() {
    this.searchValue = '';
    this.searchInput.nativeElement.blur();
    this.searchHandle();
  }

  searchHotWords(item, i) {
    this.searchValue = item;
    this.searchEmitValue.emit(item);
  }

}
