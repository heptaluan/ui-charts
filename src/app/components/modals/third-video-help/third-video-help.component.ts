import { Component, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap'

@Component({
  selector: 'lx-third-video-help',
  templateUrl: './third-video-help.component.html',
  styleUrls: ['./third-video-help.component.scss'],
})
export class ThirdVideoHelpComponent implements OnInit {
  thirdText = [
    {
      title: '1.优酷',
      img: '/dyassets/images/audio/youku.png',
    },
    {
      title: '2.腾讯视频',
      img: '/dyassets/images/audio/tencent.png',
    },
    {
      title: '3.bilibili',
      img: '/dyassets/images/audio/bilibili.png',
    },
  ]

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}

  close() {
    this.bsModalRef.hide()
  }
}
