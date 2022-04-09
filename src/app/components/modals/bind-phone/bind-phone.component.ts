import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { API } from '../../../states/api.service'
import * as ErrType from '../../../share/error.type'

@Component({
  selector: 'lx-bind-phone',
  templateUrl: './bind-phone.component.html',
  styleUrls: ['./bind-phone.component.scss'],
})
export class BindPhoneComponent implements OnInit {
  errorTip = ''
  phoneNo: string = ''
  telCode: string = ''
  sendCodeTip: string = '发送验证码'
  codestate = ''
  codeTimer = null

  constructor(private _http: HttpClient, private _api: API) {}

  ngOnInit() {}

  onKeyDown() {
    this.errorTip = ''
  }

  // 发送验证码
  onPhoneSendSMS() {
    if (!this.phoneNo.trim()) {
      this.errorTip = '请输入手机号码'
      return
    }
    if (this.phoneNo.trim().length !== 11) {
      this.errorTip = '请输入正确的手机号'
      return
    }
    this.sendSMS()
  }

  sendSMS() {
    this.sendCodeTip = `验证码发送中...`
    this.codestate = `disabled`
    let url = this._api.resetPwdSendSmsCode()
    const form = new FormData()
    form.append('phoneNo', this.phoneNo)

    this._http.post(url, form, { withCredentials: true }).subscribe(
      (res: any) => {
        const errTip = ErrType.getError(res.resultCode)
        if (errTip) {
          this.errorTip = errTip
          this.sendCodeTip = `发送验证码`
          this.codestate = ``
        } else {
          this.codeCountDown()
        }
      },
      (error) => {
        this.sendCodeTip = `发送验证码`
        this.codestate = ``
        alert(error.message)
      }
    )
  }

  // 倒计时
  codeCountDown() {
    let count = 60
    if (this.codeTimer) {
      clearInterval(this.codeTimer)
      this.codeTimer = null
    }
    this.codeTimer = setInterval(() => {
      if (count >= 1) {
        this.sendCodeTip = `${count}秒后重新发送`
        this.codestate = `disabled btn-disable`
      } else {
        this.sendCodeTip = `发送验证码`
        this.codestate = ``
        clearInterval(this.codeTimer)
        this.codeTimer = null
      }
      count--
    }, 1000)
  }

  bindPhone() {
    if (!this.phoneNo.trim()) {
      this.errorTip = '请输入手机号码'
      return
    }
    if (this.phoneNo.trim().length !== 11) {
      this.errorTip = '请输入正确的手机号'
      return
    }
  }
}
