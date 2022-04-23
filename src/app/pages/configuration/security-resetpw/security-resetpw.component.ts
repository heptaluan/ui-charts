/*
 * @Description: 个人设置-安全隐私-修改密码弹窗
 */
import { Component, OnInit, ViewChild } from '@angular/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { HttpService } from '../../../states/services/custom-http.service'
import { API } from '../../../states/api.service'
import { map, tap, switchMap, catchError } from 'rxjs/operators'
import { empty } from 'rxjs/observable/empty'
import { Observable } from 'rxjs'
import * as ErrType from '../../../share/error.type'
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'lx-security-resetpw',
  templateUrl: './security-resetpw.component.html',
  styleUrls: ['./security-resetpw.component.scss'],
})
export class SecurityResetpwComponent implements OnInit {
  emailstate = 'disabled btn-disable'
  codestate = ''
  title = '身份验证'
  errorTip = ''
  sendCodeTip = '发送验证码'

  phoneCode = ''
  phoneNo = ''
  emailCode = ''
  emailNo = ''
  pwd0 = ''
  pwd1 = ''

  pwdLengthFlag: boolean = true

  codeTimer = null

  @ViewChild('resetPwModal', undefined)
  resetPwModal: ModalDirective // 修改密码
  @ViewChild('findPw0') findPw0
  @ViewChild('findPw1Phone') findPw1Phone
  @ViewChild('findPw1Mail') findPw1Mail
  @ViewChild('findPw2Reset') findPw2Reset

  constructor(private _http: HttpClient, private _api: API) {}

  ngOnInit() {}

  show(email) {
    if (email !== '') {
      // 已绑定邮箱
      this.emailstate = ''
    } else {
      this.emailstate = 'disabled btn-disable'
    }
    this.resetPwModal.show()
  }

  hide() {
    this.resetPwModal.hide()
    setTimeout(() => {
      this.findPw0.nativeElement.hidden = false
      this.findPw1Phone.nativeElement.hidden = true
      this.findPw1Mail.nativeElement.hidden = true
      this.findPw2Reset.nativeElement.hidden = true
      this.resetInput()
    }, 500)
  }

  resetInput() {
    this.errorTip = ''
    this.phoneCode = ''
    this.phoneNo = ''
    this.emailCode = ''
    this.emailNo = ''
    this.pwd0 = ''
    this.pwd1 = ''
  }

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

  onKeyDown(ev) {
    this.errorTip = ''
  }

  onKeyUpPwd(ev) {
    if (ev.target.value.length < 6 || ev.target.value.length > 16) {
      this.errorTip = '密码长度应为6-16位'
      this.pwdLengthFlag = false
    } else {
      this.errorTip = ''
    }
  }

  // 手机验证
  onPhone() {
    this.title = '手机验证'
    this.findPw0.nativeElement.hidden = true
    this.findPw1Phone.nativeElement.hidden = false
  }

  // 邮箱验证
  onMail() {
    this.title = '邮箱验证'
    this.findPw0.nativeElement.hidden = true
    this.findPw1Mail.nativeElement.hidden = false
  }

  // 手机验证发送验证码
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

  // 邮箱验证发送验证码
  onMailSendSMS() {
    if (!this.emailNo.trim()) {
      this.errorTip = '请输入邮箱'
      return
    }
    this.sendSMS('email')
  }

  sendSMS(type?: string) {
    this.sendCodeTip = `验证码发送中...`
    this.codestate = `disabled`
    let url = this._api.resetPwdSendSmsCode()
    const form = new FormData()
    form.append('phoneNo', this.phoneNo)
    if (type === 'email') {
      url = this._api.resetPwdSendEmailCode()
      form.delete('phoneNo')
      form.append('email', this.emailNo)
    }
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
        console.log(error)
        alert(error.message)
      }
    )
  }

  // 手机验证下一步
  onPhoneNext() {
    if (!this.phoneNo.trim()) {
      this.errorTip = '请输入手机号码'
      return
    }
    if (this.phoneNo.trim().length !== 11) {
      this.errorTip = '请输入正确的手机号'
      return
    }
    if (!this.phoneCode.trim()) {
      this.errorTip = '请输入验证码'
      return
    }
    this.setNewPwd()
  }

  // 邮箱验证下一步
  onMailNext() {
    if (!this.emailNo.trim()) {
      this.errorTip = '请输入邮箱'
      return
    }
    if (!this.emailCode.trim()) {
      this.errorTip = '请输入验证码'
      return
    }
    this.setNewPwd('email')
  }

  setNewPwd(type?: string) {
    const url = this._api.resetPwdVerify()
    const form = new FormData()
    if (type === 'email') {
      form.append('findpwd', 'byEmail')
      form.append('email', this.emailNo)
      form.append('validateCode', this.emailCode)
    } else {
      form.append('findpwd', 'byPhone')
      form.append('phoneNo', this.phoneNo)
      form.append('validateCode', this.phoneCode)
    }
    this._http.post(url, form, { withCredentials: true }).subscribe(
      (res: any) => {
        const errTip = ErrType.getError(res.resultCode)
        if (errTip) {
          this.errorTip = errTip
        } else {
          if (this.codeTimer) {
            this.sendCodeTip = `发送验证码`
            this.codestate = ``
            clearInterval(this.codeTimer)
            this.codeTimer = null
          }
          if (type === 'email') {
            this.findPw1Mail.nativeElement.hidden = true
          } else {
            this.findPw1Phone.nativeElement.hidden = true
          }
          this.title = '设置新密码'
          this.findPw2Reset.nativeElement.hidden = false
        }
      },
      (error: any) => {
        alert(error.message)
      }
    )
  }

  // 设置新密码完成
  onNewPwdDone() {
    const pwd0Trim = this.pwd0.trim()
    const pwd1Trim = this.pwd1.trim()

    if (!pwd0Trim || !pwd1Trim) {
      this.errorTip = '请输入新密码'
      return
    }
    if (pwd0Trim !== pwd1Trim) {
      this.errorTip = '两次输入的密码不一致'
      return
    }
    if (this.pwdLengthFlag) {
      this.errorTip = '密码长度应为6-16位'
      return
    }
    const url = this._api.resetPwdSetPwd()
    const form = new FormData()
    form.append('password', pwd0Trim)
    form.append('passwordRepeat', pwd1Trim)
    this._http.post(url, form, { withCredentials: true }).subscribe(
      (res: any) => {
        const errTip = ErrType.getError(res.resultCode)
        if (errTip) {
          this.errorTip = this.errorTip
        } else {
          this.hide()
          alert('密码修改成功！')
        }
      },
      (error: any) => {
        alert(error.message)
      }
    )
  }
}
