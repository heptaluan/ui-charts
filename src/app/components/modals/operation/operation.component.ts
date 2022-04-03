import { Component, OnInit, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'lx-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss'],
})
export class OperationComponent implements OnInit, AfterViewInit {
  // leftDay = 3;
  constructor(public bsModalRef: BsModalRef, private rd2: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    // this.leftDay = this.getLeftDay();
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'modal', '1216-modal', 'show']);
  }
  ngAfterViewInit(): void {
    this.rd2.setStyle(this.el.nativeElement.parentElement, 'border-radius', '16px');
    this.rd2.setStyle(this.el.nativeElement.parentElement, 'border', 'none');
    this.rd2.setStyle(this.el.nativeElement.parentElement, 'background', 'transparent');
  }

  closeModal() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'modal', '1216-modal', 'close']);
    this.bsModalRef.hide();
  }

  // getLeftDay(): number {
  //   return new Date('2020/04/23').getDate() - new Date().getDate();
  // }

  // goBanner(): void {
  //   const tempPage = window.open('', '_blank');
  //   tempPage.location.href = "https://dycharts.com/show/f1519bc68ec6edbd1f1adc50a78ca8ce";
  // }

  // 跳转并且关闭
  close() {
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'modal', '1216-modal', 'goWXPage']);
    
    this.bsModalRef.hide();
  }
}
