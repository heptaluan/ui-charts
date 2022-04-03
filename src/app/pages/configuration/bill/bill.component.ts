/*
 * @Description: 个人设置-我的账单
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../states/reducers';
import * as UserModels from '../../../states/models/user.model';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { VipService } from '../../../share/services/vip.service';
import * as _ from 'lodash';
import { skip, take } from 'rxjs/operators';
import * as UserActions from '../../../states/actions/user.action';

@Component({
  selector: 'lx-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
})
export class BillComponent implements OnInit, OnDestroy {
  memberDate = '会员期限：';
  buttonMsg = '购买会员';
  billList$: Observable<UserModels.UserBill>;
  billListSubscribe = new Subscription();
  listTop: UserModels.UserBillItem[] = [
    {
      type: '账单类型',
      pro_name: '名称',
      invate_code: '邀请码',
      discount: '优惠',
      price: '付款金额',
      pay_type: '支付方式',
      time: '支付时间',
    },
  ];
  billList = [];
  isVip: boolean;
  billListFlag: boolean;

  constructor(private router: Router, private _store: Store<fromRoot.State>, private _vipService: VipService) {
    // this.billList$ = this._store.select(fromRoot.getUserBill);
  }

  ngOnInit() {
    this._store.dispatch(new UserActions.GetUserBillAction());
    this.billList$ = this._store.select(fromRoot.getUserBill);
    this.billListSubscribe = this.billList$.pipe(skip(1), take(1)).subscribe((info) => {
      if (info) {
        const arr = _.cloneDeep(info.order);
        arr.map((item) => {
          item['total_time'] = item['pro_name'].indexOf('年') > -1 ? '12个月' : '1个月';
        });
        this.billList = this.listTop.concat(arr);
        // 判断加载有数据或者无数据的页面，1 表示 listTop
        this.billListFlag = this.billList.length > 1;
      }
    });
    this.isVip = this._vipService.isVip();
    if (this.isVip) {
      this.buttonMsg = '续费';
    }
  }

  onBuyClicked() {
    this.router.navigate(['pages', 'configuration', 'member']);
  }

  ngOnDestroy() {
    this.billListSubscribe.unsubscribe();
  }
}
