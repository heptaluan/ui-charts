import { Component, OnInit, Input } from '@angular/core';
import { DataTransmissionService } from '../services/data-transmission.service';

@Component({
  selector: 'lx-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss']
})

export class ToolComponent implements OnInit {

  @Input() exportPage: boolean = true;

  isShowRefer: boolean = false;

  constructor(
    private _dataTransmissionService: DataTransmissionService
  ) { }

  ngOnInit() {
  }

  // 控制参考线是否显示
  showRefer() {
    this.isShowRefer = !this.isShowRefer;
    // 百度统计
    window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-bottom-guideline-hover']);
  }

  // 新增/删除 参考线
  changeReferLine(type) {
    this._dataTransmissionService.changeReferLine(type);
  }

}
