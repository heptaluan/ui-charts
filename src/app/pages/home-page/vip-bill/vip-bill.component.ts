import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { DataTransmissionService } from '../../../share/services';

@Component({
  selector: 'lx-vip-bill',
  templateUrl: './vip-bill.component.html',
  styleUrls: ['./vip-bill.component.scss'],
})
export class VipBillComponent implements OnInit {
  titleList = ['我的会员', '我的账单', '特权兑换']; // 标题组
  activeIndex = 0;
  constructor(
    private _activeRoute: ActivatedRoute,
    private _dataTransmissionService: DataTransmissionService
  ) {}

  ngOnInit() {
    this._activeRoute.queryParams.subscribe(res => {
      if (res) {
        this.activeIndex = Number(res.id) || 0;
      }
    })
    this._dataTransmissionService.getExchange().subscribe(res => {
      this.activeIndex = res || 0;
    })
  }

  // 处理标题栏点击
  handleItemClick(index: number) {
    this.activeIndex = index;
  }
}
