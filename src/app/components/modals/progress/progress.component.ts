import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { DataTransmissionService } from '../../../share/services';

@Component({
  selector: 'lx-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  // 进度图宽度
  progressWidth = 0;

  isFail = false;

  intervalProgress;

  text: string = '正在生成，请打开手机准备“扫一扫”喔~';

  isHideCloseBtn = false;
  constructor(
    private bsModalRef: BsModalRef,
    private _dataTransmission: DataTransmissionService
  ) { }

  ngOnInit() {
    this._dataTransmission.getProcess()
      .subscribe(res => {
        switch (res) {
          case 'success':
            this.progressWidth = 100;
            clearInterval(this.intervalProgress);
            setTimeout(() => {
              this.close();
            }, 800);
            break;
          case 'fail':
            clearInterval(this.intervalProgress);
            this.isFail = true;
            break;
          default:
            break;
        }
      })
    
    this.showProgress();
  }

  // 加载动画
  showProgress() {
    const num = Math.floor(Math.random() * 30) + 70;
    this.intervalProgress = setInterval(() => {
      const randomNum = Math.floor(Math.random() * 8);
      if (this.progressWidth < num) {
        this.progressWidth = this.progressWidth + randomNum >= num ? num : this.progressWidth + randomNum;
      }
    }, 500);
  }

  close() {
    this.bsModalRef.hide();
    this._dataTransmission.sendRetryStatus('clear');
  }

  // 重试
  retry() {
    this._dataTransmission.sendRetryStatus('retry');
    this.isFail = false;
    this.progressWidth = 0;
    this.showProgress();
  }

}
