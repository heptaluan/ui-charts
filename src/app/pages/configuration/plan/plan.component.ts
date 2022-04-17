/*
 * @Description: 个人设置-我的方案
 */
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import * as UserModels from '../../../states/models/user.model'
import { Subscription, Observable } from 'rxjs'
import { Router } from '@angular/router'
import { VipService } from '../../../share/services/vip.service'
import * as UserActions from '../../../states/actions/user.action'
import { API } from '../../../states/api.service'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'lx-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
})
export class PlanComponent implements OnInit, OnDestroy {
  memberDate = '会员期限：'
  buttonMsg = '购买会员'
  billList$: Observable<UserModels.UserBill>
  billListSubscribe = new Subscription()
  listTop: UserModels.UserBillItem[] = []
  billList = []
  isVpl
  planListFlag: boolean = false
  priceNum: number

  userUsedStateList

  // 跨域允许
  httpOptions = { withCredentials: true }

  usedPermissionConsumeArr = []

  constructor(
    private router: Router,
    private _store: Store<fromRoot.State>,
    private _vipService: VipService,
    private _api: API,
    private _http: HttpClient
  ) {
    this.billList$ = this._store.select(fromRoot.getUserBill)
  }

  ngOnInit() {
    this._http.get(this._api.getUserPermissionConsume(), this.httpOptions).subscribe((res) => {
      const data = res['data']
      this.usedPermissionConsumeArr.push({
        title: '项目存储空间',
        used: data['projects_count'],
        total: data['max_projects_num'] === null ? '无限' : data['max_projects_num'],
        remained:
          data['max_projects_num'] === null
            ? '无限'
            : Number(data['max_projects_num'] - data['projects_count']) > 0
            ? Number(data['max_projects_num'] - data['projects_count'])
            : 0,
        unit: '个',
      })
      this.usedPermissionConsumeArr.push({
        title: '图表下载量',
        used: data['daily_export_count'],
        total: data['max_export_num'] === null ? '无限' : data['max_export_num'],
        remained:
          data['max_export_num'] === null
            ? '无限'
            : Number(data['max_export_num'] - data['daily_export_count']) > 0
            ? Number(data['max_export_num'] - data['daily_export_count'])
            : 0,
        unit: '次',
      })
      this.usedPermissionConsumeArr.push({
        title: '上传数据存储空间 ',
        used: data['uploaded_data_count'],
        total: data['max_upload_data_num'] === null ? '无限' : data['max_upload_data_num'],
        remained:
          data['max_upload_data_num'] === null
            ? '无限'
            : Number(data['max_upload_data_num'] - data['uploaded_data_count']) > 0
            ? Number(data['max_upload_data_num'] - data['uploaded_data_count'])
            : 0,
        unit: '个',
      })
      this.usedPermissionConsumeArr.push({
        title: '图片素材存储空间',
        used: data['img_upload_consumed_space'],
        total: data['img_upload_capacity_str'] === null ? '无限' : data['img_upload_capacity_str'],
        remained:
          data['img_upload_capacity_str'] === null
            ? '无限'
            : Math.round(Number(data['img_upload_capacity_str'] - data['img_upload_consumed_space']) * 100) / 100,
        unit: 'M',
      })
    })

    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2/#/pages/configuration/plan']);
    this._store.dispatch(new UserActions.GetUserBillAction())

    this.billListSubscribe = this.billList$.subscribe((info) => {
      if (info) {
        let end_time_1, start_time, end_time, end_time_2, end_time_3
        if (info['vip2_time'] !== '您还不是高级会员，请升级高级会员') {
          start_time = info['vip2_time'].split('：')[1].split('-')[0]
          end_time = info['vip2_time'].split('：')[1].split('-')[1]
        }
        if (info['vip1_time'] !== '您还不是会员，请升级会员') {
          end_time_1 = info['vip1_time'].split('：')[1].split('-')[1]
        }
        if (info['eip1_time'] !== '您还不是企业会员，请升级企业会员') {
          end_time_2 = info['eip1_time'].split('：')[1].split('-')[1]
        }
        if (info['eip2_time'] !== '您还不是企业高级会员，请升级企业高级会员') {
          end_time_3 = info['eip2_time'].split('：')[1].split('-')[1]
        }

        // 判断当前用户是什么会员类型
        const date = this.DateMinus(start_time, end_time)
        const timeLength = date > 40 ? '年付' : '月付'
        const price = timeLength === '年付' ? '99' : '9.9'
        const obj = {
          time: info['vip2_time'].split('：')[1],
          pro_name: '高级会员',
          price: price,
          invate_code: '无邀请码',
          total_time: timeLength,
        }
        const obj1 = {
          time: info['vip1_time'].split('：')[1],
          pro_name: '会员',
          price: price,
          invate_code: '无邀请码',
          total_time: timeLength,
        }
        const obj2 = {
          time: info['eip1_time'].split('：')[1],
          pro_name: '企业会员',
          price: price,
          invate_code: '无邀请码',
          total_time: timeLength,
        }
        const obj3 = {
          time: info['eip2_time'].split('：')[1],
          pro_name: '高级企业会员',
          price: price,
          invate_code: '无邀请码',
          total_time: timeLength,
        }
        this.listTop = []

        // obj 高级会员 obj1 会员 后端返回什么显示什么
        if (end_time) {
          this.listTop.push(obj)
        }

        if (end_time_1) {
          this.listTop.push(obj1)
        }

        if (end_time_2) {
          this.listTop.push(obj2)
        }

        if (end_time_3) {
          this.listTop.push(obj3)
        }

        this.listTop.unshift({
          pro_name: '会员类型',
          time: '时间段',
          invate_code: '邀请码',
          price: '金额',
          total_time: '会员时长',
        })
      }
    })
    this.isVpl = this._vipService.getVipLevel()
    if (this.isVpl !== 'None') {
      this.buttonMsg = '续费'
    }

    // 判断加载有数据或者无数据的页面，1 表示 listTop
    this.planListFlag = this.isVpl !== 'None' ? true : false
  }

  // 输入两个字符串日期输出相隔的天数
  DateMinus(date1, date2) {
    let sdate = new Date(date1)
    var now = new Date(date2)
    var days = now.getTime() - sdate.getTime()
    var day = parseInt(days / (1000 * 60 * 60 * 24) + '')
    return day
  }

  onBuyClicked() {
    this.router.navigate(['pages', 'configuration', 'member'])
  }

  ngOnDestroy() {
    this.billListSubscribe.unsubscribe()
  }

  returnPrice() {
    const tempPage = window.open('', '_blank')
    tempPage.location.href = `${window.location.href.split('#')[0]}#/pages/home/price`
  }

  returnPay() {
    const tempPage = window.open('', '_blank')
    tempPage.location.href = `${window.location.href.split('#')[0]}#/pages/home/pay`
  }

  // 计算进度条颜色
  getProgressColor(usedTotalNum, totalNum) {
    let progressColorType = ''
    // 用户使用空间与总空间
    const rate = usedTotalNum / totalNum
    // 占比 0 - 50% 默认
    if (rate < 0.5) {
      progressColorType = ''
    } else if (rate >= 0.5 && rate < 0.9) {
      // 占比 50% - 90% warning
      progressColorType = 'warning'
    } else {
      // 占比 90% + danger
      progressColorType = 'danger'
    }
    return progressColorType
  }
}
