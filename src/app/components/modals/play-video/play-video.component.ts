import { Component, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap'
import * as $ from 'jquery'

@Component({
  selector: 'lx-play-video',
  templateUrl: './play-video.component.html',
  styleUrls: ['./play-video.component.scss'],
})
export class PlayVideoComponent implements OnInit {
  url

  backdrop = true
  ignoreBackdropClick = false

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
    // 调整模态框背景颜色
    $('.modal')[0].style.background = 'rgba(0,0,0,0.6)'
  }

  // 关闭弹框
  close() {
    this.bsModalRef.hide()
  }
}
