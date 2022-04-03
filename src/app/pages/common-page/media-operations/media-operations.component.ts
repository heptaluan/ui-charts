import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../states/api.service';
import { Subscription } from 'rxjs';
import * as fromRoot from '../../../states/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lx-media-operations',
  templateUrl: './media-operations.component.html',
  styleUrls: ['./media-operations.component.scss'],
})
export class MediaOperationsComponent implements OnInit {
  codeText = '请输入验证码';
  disabled = false;
  records = [
    {
      text:
        '让繁杂的数据变简明，让复杂的编程“傻瓜化”，让重要新闻可视化。镝数图表帮助媒体人从大数据中挖掘新闻要点，高效利用数据工具，无门槛制作数据新闻产品，更好地专注于新闻本身，实现新闻数据化，用数据讲述好新闻。',
      name: '马轶群',
      position: '新华社融媒体产品创新中心总监',
    },
    {
      text:
        '镝次元是谷雨数据的重要合作伙伴。不论是针对新闻突发事件还是大事件节点，我们和镝次元的合作，都能看到他们专业的数据洞察和分析能力，充分展现了数据在新闻报道中的价值。',
      name: '杨瑞春',
      position: '腾讯网副总编辑',
    },
    {
      text:
        '零代码的制作流程，多样化的模板选择，镝数图表消除了很多人在“我希望我的图可交互”和“我不会写代码”之间的两难困境。让技术为更多普通人所用，让数据之美渗透到中国的新闻业，让新闻不仅有阅读价值，也有“观赏价值”。',
      name: '黄晨',
      position: '财新数据新闻中心主任',
    },
  ];

  realName = '';
  phoneNo = '';
  verifyCode = '';
  company = '';
  inviter = '';

  nameErrorText = '';
  phoneErrorText = '';
  codeErrorText = '';
  companyErrorText = '';
  inviterErrorText = '';

  mobileRe = /^1(3|4|5|6|7|8|9)\d{9}$/;

  // 提交成功
  isSucc = false;

  userName = '';
  getUserInfoSubscription = new Subscription();

  // 跨域允许
  httpOptions = { withCredentials: true };

  constructor(private _http: HttpClient, private _api: API, private _store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.getUserInfo();
  }
  // 获取用户信息（判断是否登录）
  getUserInfo() {
    this.getUserInfoSubscription.add(
      this._store
        .select(fromRoot.getUserInfo)
        .filter((user) => !!user)
        .subscribe((user) => {
          this.userName = user.nickname || user.loginname;
        })
    );
  }

  // 验证能否发送验证码
  getCode() {
    if (this.disabled) {
      return;
    } else {
      if (this.phoneTest()) {
        this.sendCode();
        const numbers = interval(1000);
        const takeFourNumbers = numbers.pipe(take(60));
        takeFourNumbers.subscribe(
          (x) => {
            this.codeText = 60 - x + 's';
            this.disabled = true;
          },
          (error) => {},
          () => {
            this.codeText = '请输入验证码';
            this.disabled = false;
          }
        );
      }
    }
  }

  // 发送验证码
  sendCode() {
    let url = `${this._api.getOldUrl()}/vis/biz/media/send_verify_sms`;
    let fd = new FormData();
    fd.append('phone_no', this.phoneNo);
    this._http.post(url, fd, this.httpOptions).subscribe((res) => {
      console.log('res', res);
    });
  }

  // 电话验证
  phoneTest() {
    if (!this.phoneNo) {
      this.phoneErrorText = '请输入';
      return false;
    }
    if (!this.mobileRe.test(this.phoneNo)) {
      this.phoneErrorText = '格式错误';
      return false;
    }
    this.clearErrorText('phoneErrorText');
    return true;
  }

  // 姓名验证
  nameTest() {
    if (!this.realName) {
      this.nameErrorText = '请输入';
      return false;
    }
    this.clearErrorText('nameErrorText');
    return true;
  }

  // 验证码验证
  codeTest() {
    if (!this.verifyCode) {
      this.codeErrorText = '请输入';
      return false;
    }
    this.clearErrorText('codeErrorText');
    return true;
  }

  // 单位验证
  companyTest() {
    if (!this.company) {
      this.companyErrorText = '请输入';
      return false;
    }
    this.clearErrorText('companyErrorText');
    return true;
  }

  // 清除错误信息
  clearErrorText(errorObj) {
    this[errorObj] = '';
  }

  // 提交
  submit() {
    if (!this.submitTest()) {
      return;
    }
    let url = `${this._api.getOldUrl()}/vis/biz/media/media_user_apply`;
    let fd = new FormData();
    fd.append('real_name', this.realName);
    fd.append('phone_no', this.phoneNo);
    fd.append('verify_code', this.verifyCode);
    fd.append('company', this.company);
    fd.append('inviter', this.inviter);
    this._http.post(url, fd, this.httpOptions).subscribe((res) => {
      switch (res['resultCode']) {
        case 1000:
          this.isSucc = true;
          break;
        case 2004:
          this.codeErrorText = '验证码错误';
          break;
        default:
          break;
      }
    });
  }

  // 提交验证
  submitTest() {
    if (this.userName) {
      return this.nameTest() && this.companyTest();
    } else {
      return this.nameTest() && this.phoneTest() && this.codeTest() && this.companyTest();
    }
  }
}
