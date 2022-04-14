import { Component, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap'
import { DataTransmissionService } from '../../../share/services'
import * as $ from 'jquery'

@Component({
  selector: 'lx-zip-loading',
  templateUrl: './zip-loading.component.html',
  styleUrls: ['./zip-loading.component.scss'],
})
export class ZipLoadingComponent implements OnInit {
  // 进度图宽度
  progressWidth = 0

  isFail = false

  intervalProgress

  constructor(private bsModalRef: BsModalRef, private _dataTransmission: DataTransmissionService) {}

  ngOnInit() {
    this._dataTransmission.getProcess().subscribe((res) => {
      switch (res) {
        case 'success':
          this.progressWidth = 100
          clearInterval(this.intervalProgress)
          setTimeout(() => {
            this.close()
          }, 800)
          break
        case 'fail':
          clearInterval(this.intervalProgress)
          this.isFail = true
          break
        default:
          break
      }
    })

    this.showProgress()
  }

  // 加载动画
  showProgress() {
    const num = Math.floor(Math.random() * 30) + 70
    this.intervalProgress = setInterval(() => {
      const randomNum = Math.floor(Math.random() * 8)
      if (this.progressWidth < num) {
        this.progressWidth = this.progressWidth + randomNum >= num ? num : this.progressWidth + randomNum
      }
    }, 50)
  }

  close() {
    this.bsModalRef.hide()
    this._dataTransmission.sendRetryStatus('clear')
  }
}
