/*
 * @Description: 个人设置-安全隐私-修改手机号
 */
import { Component, OnInit, ViewChild, Input } from '@angular/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { HttpService } from '../../../states/services/custom-http.service'
import { API } from '../../../states/api.service'
import { map, tap, switchMap, catchError } from 'rxjs/operators'
import { empty } from 'rxjs/observable/empty'
import { Observable } from 'rxjs'
import * as ErrType from '../../../share/error.type'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import * as UserActions from '../../../states/actions/user.action'
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'lx-security-resetphone',
  templateUrl: './security-resetphone.component.html',
  styleUrls: ['./security-resetphone.component.scss'],
})
export class SecurityResetphoneComponent implements OnInit {
  codestate = ''
  errorTip = ''
  sendCodeTip = '发送验证码'
  title = '提示'

  phoneCode = ''
  phoneNo = ''
  newPhoneCode = ''
  newPhoneNo = ''

  codeTimer = null

  @ViewChild('resetPhoneModal', undefined)
  resetPhoneModal: ModalDirective // 修改密码
  @ViewChild('rpAskDiv') rpAskDiv
  @ViewChild('rpSmsUselessDiv') rpSmsUselessDiv
  @ViewChild('rpSmsAvailableDiv') rpSmsAvailableDiv
  @ViewChild('rpVerityNewDiv') rpVerityNewDiv

  @Input() userphone: string

  constructor(private _http: HttpClient, private _api: API, private _store: Store<fromRoot.State>) {}

  ngOnInit() {}

  show() {
    this.resetPhoneModal.show()
  }

  hide() {
    this.resetPhoneModal.hide()
    // 将弹框状态还原
    setTimeout(() => {
      this.title = '提示'
      this.rpAskDiv.nativeElement.hidden = false
      this.rpSmsUselessDiv.nativeElement.hidden = true
      this.rpSmsAvailableDiv.nativeElement.hidden = true
      this.rpVerityNewDiv.nativeElement.hidden = true
      this.resetInput()
    }, 500)
  }

  resetInput() {
    this.errorTip = ''
    this.phoneCode = ''
    this.phoneNo = ''
    this.newPhoneCode = ''
    this.newPhoneNo = ''
  }

  onKeyDown(event) {
    this.errorTip = ''
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

  sendSMS(phoneNo: string, step: string) {
    if (!phoneNo.trim()) {
      this.errorTip = '请输入手机号码'
      return
    }
    if (phoneNo.trim().length !== 11) {
      this.errorTip = '请输入正确的手机号'
      return
    }
    this.sendCodeTip = `验证码发送中...`
    this.codestate = `disabled`
    const url = this._api.resetPhoneSendSmsCode()
    const form = new FormData()
    form.append('phoneNo', phoneNo)
    form.append('step', step)
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
        alert(error.message)
      }
    )
  }

  verifySMS(phoneNo: string, phoneCode: string, step: string) {
    if (!phoneNo.trim()) {
      this.errorTip = '请输入手机号码'
      return
    }
    if (phoneNo.trim().length !== 11) {
      this.errorTip = '请输入正确的手机号'
      return
    }
    if (!phoneCode.trim()) {
      this.errorTip = '请输入验证码'
      return
    }
    const url = this._api.resetPhoneVerify()
    const form = new FormData()
    form.append('phoneNo', phoneNo)
    form.append('validateCode', phoneCode)
    form.append('step', step)
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
          if (step === '1') {
            this.title = '请验证新手机'
            this.rpSmsAvailableDiv.nativeElement.hidden = true
            this.rpVerityNewDiv.nativeElement.hidden = false
          } else {
            this._store.dispatch(new UserActions.GetUserInfoAction())
            this.hide()
            alert('手机修改成功！')
          }
        }
      },
      (error) => {
        alert(error.message)
      }
    )
  }

  // 用户操作方法
  // 点击旧手机可用
  onPhoneUsefull() {
    this.title = '请验证已绑定的手机'
    this.rpAskDiv.nativeElement.hidden = true
    this.rpSmsAvailableDiv.nativeElement.hidden = false
  }

  // 点击旧手机不可用
  onPhoneUseless() {
    this.title = '联系镝数小助手'
    this.rpAskDiv.nativeElement.hidden = true
    this.rpSmsUselessDiv.nativeElement.hidden = false
  }

  // 联系客服页面完成
  onServiceDone() {
    this.hide()
  }

  // 旧手机发送验证码
  onOldSendSms() {
    this.sendSMS(this.phoneNo, '1')
  }

  // 旧手机验证码下一步
  onOldPhoneNext() {
    this.verifySMS(this.phoneNo, this.phoneCode, '1')
  }

  // 新手机发送验证码
  onNewSendSms() {
    this.sendSMS(this.newPhoneNo, '2')
  }

  // 新手机完成
  onNewPhoneDone() {
    this.verifySMS(this.newPhoneNo, this.newPhoneCode, '2')
  }
}
