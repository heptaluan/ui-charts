import { Component, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap'
import { Router } from '@angular/router'
import { API } from '../../../states/api.service'
import { HttpClient } from '@angular/common/http'
import * as _ from 'lodash'

@Component({
  selector: 'lx-user-info-collect-modal',
  templateUrl: './user-info-collect-modal.component.html',
  styleUrls: ['./user-info-collect-modal.component.scss'],
})
export class UserInfoCollectModalComponent implements OnInit {
  // 页数
  pageNum: number = 1

  // 第一页按钮颜色
  isShowPageOneButton: boolean = false

  // 第二页按钮颜色
  isShowPageTwoButton: boolean = false

  // 其他行业
  otherIndustry: string = ''

  // 其他职业
  otherCareer: string = ''

  // 用户行业
  userIndustry = ''

  // 用户职业
  userCareer = ''

  // input 样式
  pageOneInput
  pageTwoInput

  // 控制显示 input
  isShowPageOneInput = false
  isShowPageTwoInput = false

  // 是否价格页面进来
  isPriceEnter: boolean = false
  payUrl: string = ''

  titleInfo: string = '欢迎来到镝数，完善信息免费领取会员大礼包'

  industries: Array<any> = []
  jobs: Array<any> = []

  // 跨域允许
  httpOptions = { withCredentials: true }

  private baseUrl = `${this._api.getOldUrl()}/vis/auth/user_category`

  constructor(public bsModalRef: BsModalRef, private _router: Router, private _api: API, private _http: HttpClient) {}

  ngOnInit() {
    this.getUserCategory()
    this.getUserJobs()
    this.titleInfo = this.isPriceEnter ? '完善会员信息，订单享9折优惠' : '欢迎来到镝数，完善信息免费领取会员大礼包'
  }

  // 获取用户行业
  getUserCategory() {
    const url = `${this.baseUrl}?type=1`
    this._http.get(url, this.httpOptions).subscribe((data) => {
      this.industries = data as any
      this.industries = this.industries.filter((item) => item['icon'].indexOf('.svg') > -1)
      this.pageOneInput = {
        left: (this.industries.length % 6) * 98 + 'px',
        top: Math.floor(this.industries.length / 6) * 98 + 18 + 'px',
      }
    })
  }

  // 获取用户职业
  getUserJobs() {
    const url = `${this.baseUrl}?type=2`
    this._http.get(url, this.httpOptions).subscribe((data) => {
      this.jobs = data as any
      this.jobs = this.jobs.filter((item) => item['icon'].indexOf('.svg') > -1)
      this.pageTwoInput = {
        left: (this.jobs.length % 6) * 98 + 'px',
        top: Math.floor(this.jobs.length / 6) * 98 + 18 + 'px',
      }
    })
  }

  changePageNum(page: number) {
    this.pageNum = page
  }

  // 改变第一页选中
  changeSelectPageOne(name) {
    this.userIndustry = name

    this.isShowPageOneInput = name === '其他'

    // 按钮颜色
    if (this.userIndustry === '') {
      this.isShowPageOneButton = false
    } else if (this.userIndustry === '其他' && this.otherIndustry === '') {
      this.isShowPageOneButton = false
    } else {
      this.isShowPageOneButton = true
    }
  }

  // 改变第二页选中
  changeSelectPageTwo(name) {
    this.userCareer = name
    this.isShowPageTwoInput = name === '其他'

    // 按钮颜色
    if (this.userCareer === '') {
      this.isShowPageTwoButton = false
    } else if (this.userCareer === '其他' && this.otherCareer === '') {
      this.isShowPageTwoButton = false
    } else {
      this.isShowPageTwoButton = true
    }
  }

  handleUserIndustry() {
    this.userIndustry = '其他'

    // 按钮颜色
    if (this.userIndustry === '') {
      this.isShowPageOneButton = false
    } else if (this.userIndustry === '其他' && this.otherIndustry === '') {
      this.isShowPageOneButton = false
    } else {
      this.isShowPageOneButton = true
    }
  }

  handleUserCareer() {
    this.userCareer = '其他'
    // 按钮颜色
    if (this.userCareer === '') {
      this.isShowPageTwoButton = false
    } else if (this.userCareer === '其他' && this.otherCareer === '') {
      this.isShowPageTwoButton = false
    } else {
      this.isShowPageTwoButton = true
    }
  }

  // 完成数据选择，确保选择了再跳转
  comlete() {
    let data = {
      category: this.userIndustry === '其他' ? this.otherIndustry : this.userIndustry,
      job: this.userCareer === '其他' ? this.otherCareer : this.userCareer,
      source: '1',
    }
    new Promise((resolve, reject) => {
      if (this.isPriceEnter) {
        data.source = '2'
      }
      this.postData(data, resolve)
    }).then((res) => {
      if (this.isPriceEnter) {
        if (res['resultCode'] === 1000) {
          this.bsModalRef.hide()
          window.location.href = this.payUrl
        }
      } else {
        this.pageNum = 3
      }
    })
  }

  /**
   * @description [goPayImmediate 直接付费]
   * @memberof UserInfoCollectModalComponent
   */
  goPayImmediate() {
    this.close()
    window.location.href = this.payUrl
  }

  /**
   * @description [close 关闭弹框]
   * @memberof UserInfoCollectModalComponent
   */
  close() {
    // 3 表示不再提示
    let data = {
      category: '',
      job: '',
      source: '3',
    }
    new Promise((resolve, reject) => {
      this.postData(data, resolve)
    }).then((res) => {
      if (res['resultCode'] === 1000) {
        this.bsModalRef.hide()
      }
    })
  }

  postData(data, resolve) {
    const url = `${this._api.getOldUrl()}/vis/auth/improve_user_info`
    this._http.post(url, data, this.httpOptions).subscribe((res) => {
      resolve(res)
    })
  }

  goPrice() {
    this.close()
    this._router.navigate(['pages', 'home', 'price'])
  }
}
