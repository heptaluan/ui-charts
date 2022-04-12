import { Component, OnInit, Renderer2, ElementRef, AfterViewInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap'

@Component({
  selector: 'lx-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss'],
})
export class OperationComponent implements OnInit, AfterViewInit {
  constructor(public bsModalRef: BsModalRef, private rd2: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    window['_hmt'].push(['_trackEvent', 'modal', '1216-modal', 'show'])
  }
  ngAfterViewInit(): void {
    this.rd2.setStyle(this.el.nativeElement.parentElement, 'border-radius', '16px')
    this.rd2.setStyle(this.el.nativeElement.parentElement, 'border', 'none')
    this.rd2.setStyle(this.el.nativeElement.parentElement, 'background', 'transparent')
  }

  closeModal() {
    window['_hmt'].push(['_trackEvent', 'modal', '1216-modal', 'close'])
    this.bsModalRef.hide()
  }

  // 跳转并且关闭
  close() {
    window['_hmt'].push(['_trackEvent', 'modal', '1216-modal', 'goWXPage'])
    this.bsModalRef.hide()
  }
}
