import { Component, Input, OnInit, Inject, ViewChildren, ElementRef, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import Swiper from 'swiper';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import * as _ from 'lodash';

@Component({
  selector: 'lx-dy-carousel',
  templateUrl: './dy-carousel.component.html',
  styleUrls: ['./dy-carousel.component.scss']
})
export class DyCarouselComponent implements OnInit, OnChanges {
  mySwiper: Swiper;
  perLineNum: number = 5; // 轮播一行个数
  showArr = []; // 处理后展示的数组

  @ViewChildren('slider') slider: ElementRef;
  @Input() showColumnNum: number = 1; // 轮播展示列数
  @Input() arr = []; // 传进来数组

  @Output() clickItem = new EventEmitter();

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  ngOnInit() {

    this.getPage(this.arr);
    Observable.fromEvent(window, 'resize')
      .pipe(
        debounceTime(100) // 加点去抖，毕竟 `resize` 频率非常高
      )
      .subscribe(() => {
        this.getPage(this.arr);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.arr && this.arr) {
      this.getPage(this.arr);
    }
  }
  ngAfterViewInit(): void {
    this._swiperInit();
  }

  _swiperInit() {
    this.mySwiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      speed: 1000,
      mousewheel: {
        forceToAxis: true,
        invert: true,
      },
      observer: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  // 将值传出去
  private onClick(item, index, ind) {
    this.clickItem.emit({item, index, ind});
  }

  // 处理传进来的数组
  private getPage(arr) {
    const clientWidth = this.doc.documentElement.clientWidth;
    this.perLineNum = clientWidth > 1366 ? 6 : 5;
    const result = this.getShowArr(arr, this.perLineNum);
    this.showArr = result;
    // if (JSON.stringify(result) !== JSON.stringify(this.showArr)) {
    //   this.showArr = result;
    // }
  }

  /**
   * @description 将原数组按照指定数量分成二维数组
   * @param {*} 原数组
   * @param {*} 每一页数量
   * @returns 展示的数组
   */
  private getShowArr(arr, num) {
    if (arr.length < num) {
      return [arr];
    } else {
      const pagenum = Math.ceil(arr.length / (num * this.showColumnNum));
      let cloneArr = _.cloneDeep(arr);
      let showArr = [];
      for (let i = 0; i < pagenum; i++) {
        showArr.push(cloneArr.splice(0, num * this.showColumnNum));
      }
      return showArr;
    }
  }

  // private onMouseEnter(index, item, ind = 0) {
  //   if (!item.hoverUrl) return;
  //   const trueIndex = ind === 0 ? index : index + this.perLineNum * this.showColumnNum;
  //   this.slider['_results'][trueIndex].nativeElement.style.background = this.getUrl(item.hoverUrl);
  // }

  // private onMouseLeave(index, item, ind = 0) {
  //   if (!item.hoverUrl) return;
  //   const trueIndex = ind === 0 ? index : index + this.perLineNum * this.showColumnNum;
  //   this.slider['_results'][trueIndex].nativeElement.style.background = this.getUrl(item.bgUrl);
  // }

  private getUrl(url) {
    return `url(${url}) no-repeat center / contain`;
  }

  private getBottom() {
    return this.showColumnNum !== 1 ? `24px` : `0`;
  }
}
