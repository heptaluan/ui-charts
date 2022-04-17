/*
 * @Description: 个人设置-安全隐私
 */
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { SecurityResetpwComponent } from '../security-resetpw/security-resetpw.component'
import { SecurityResetphoneComponent } from '../security-resetphone/security-resetphone.component'
import { SecurityResetmailComponent } from '../security-resetmail/security-resetmail.component'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import * as UserModels from '../../../states/models/user.model'
import { Subscription, Observable } from 'rxjs'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { HttpService } from '../../../states/services/custom-http.service'
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http'
import { API } from '../../../states/api.service'
import { map, tap, switchMap, catchError } from 'rxjs/operators'
import { empty } from 'rxjs/observable/empty'
import * as ErrType from '../../../share/error.type'

@Component({
  selector: 'lx-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit, OnDestroy {
  @ViewChild('resetPwChild', undefined)
  resetPwChild: SecurityResetpwComponent // 修改密码
  @ViewChild('resetPhoneChild', undefined)
  resetPhoneChild: SecurityResetphoneComponent // 修改手机号
  @ViewChild('resetMailChild', undefined)
  resetMailChild: SecurityResetmailComponent // 绑定邮箱

  userinfo$: Observable<UserModels.UserInfo>
  userinfoSubscribe = new Subscription()
  userinfo: any
  email = ''
  securityEmail = ''
  phoneno = ''

  errorTip = ''
  title = '请输入登录密码'

  password = ''
  type = '1' // 1是没有绑定邮箱， 2是已经绑定邮箱
  oldEmail = ''
  newEmail = ''

  @ViewChild('resetMailModal', undefined)
  resetMailModal: ModalDirective // 修改密码
  @ViewChild('rmVerifyPwdDiv') rmVerifyPwdDiv
  @ViewChild('rmBindNewMailDiv') rmBindNewMailDiv
  @ViewChild('rmResetMailDiv') rmResetMailDiv
  @ViewChild('rmBindSuccessDiv') rmBindSuccessDiv

  constructor(private _store: Store<fromRoot.State>, private _http: HttpClient, private _api: API) {
    this.userinfo$ = this._store.select(fromRoot.getUserInfo)
  }

  ngOnInit() {
    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2/#/pages/configuration/security']);

    this.userinfoSubscribe = this.userinfo$.subscribe((info) => {
      if (info) {
        this.userinfo = info
        this.email = info.email ? info.email.trim() : ''
        this.securityEmail = this.email.slice(0, 2) + '***' + this.email.slice(this.email.length - 3)
        this.phoneno = info.phoneno ? info.phoneno.trim() : ''
      }
    })
  }

  openModal(index) {
    switch (index) {
      // 修改密码
      case 0:
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-change-password'])
        this.resetPw()
        break
      // 修改手机号
      case 1:
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-change-phone'])
        this.resetPhone()
        break
      // 修改邮箱
      case 2:
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-change-email'])
        this.resetMail()
        break
      default:
        break
    }
  }

  resetPw() {
    this.resetPwChild.show(this.email)
  }

  resetPhone() {
    this.resetPhoneChild.show()
  }

  resetMail() {
    this.resetMailChild.show(this.email)
  }

  ngOnDestroy() {
    this.userinfoSubscribe.unsubscribe()
  }

  show(email) {
    this.type = !email.trim() ? '1' : '2'
    this.resetMailModal.show()
  }

  hide() {
    this.resetMailModal.hide()
    setTimeout(() => {
      this.title = '请输入登录密码'
      this.rmVerifyPwdDiv.nativeElement.hidden = false
      this.rmBindNewMailDiv.nativeElement.hidden = true
      this.rmResetMailDiv.nativeElement.hidden = true
      this.rmBindSuccessDiv.nativeElement.hidden = true
      this.resetInput()
    }, 500)
  }

  resetInput() {
    this.errorTip = ''
    this.password = ''
    this.oldEmail = ''
    this.newEmail = ''
  }

  onKeyDown(event) {
    this.errorTip = ''
  }

  // 验证登录密码
  onVerityPwd() {
    if (!this.password.trim()) {
      this.errorTip = '请输入登录密码'
      return
    }
    const url = this._api.resetEmailVerifyPwd()
    const form = new FormData()
    form.append('password', this.password)
    form.append('type', this.type)
    this._http.post(url, form, { withCredentials: true }).subscribe(
      (res: any) => {
        const errTip = ErrType.getError(res.resultCode)
        if (errTip) {
          this.errorTip = errTip
        } else {
          if (this.type === '2') {
            // 已绑定邮箱
            this.title = '请输入已绑定的邮箱'
            this.rmVerifyPwdDiv.nativeElement.hidden = true
            this.rmResetMailDiv.nativeElement.hidden = false
          } else {
            this.title = '绑定邮箱信息'
            this.rmVerifyPwdDiv.nativeElement.hidden = true
            this.rmBindNewMailDiv.nativeElement.hidden = false
          }
        }
      },
      (error: any) => {
        alert(error.message)
      }
    )
  }

  // 绑定新邮箱完成
  onBindNewMail() {
    if (!this.newEmail.trim()) {
      this.errorTip = '邮箱不能为空'
      return
    }
    const url = this._api.resetEmailSetNew()
    const form = new FormData()
    form.append('email', this.newEmail)
    form.append('type', this.type)
    this._http.post(url, form, { withCredentials: true }).subscribe(
      (res: any) => {
        const errTip = ErrType.getError(res.resultCode)
        if (errTip) {
          this.errorTip = errTip
        } else {
          this.title = '邮箱链接发送成功'
          this.rmBindNewMailDiv.nativeElement.hidden = true
          this.rmBindSuccessDiv.nativeElement.hidden = false
        }
      },
      (error: any) => {
        alert(error.message)
      }
    )
  }

  // 解绑旧邮箱下一步
  onResetOldMail() {
    if (!this.oldEmail.trim()) {
      this.errorTip = '请输入已绑定的邮箱'
      return
    }
    let reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
    if (!reg.test(this.oldEmail.trim())) {
      this.errorTip = '请输入正确的邮箱地址'
      return
    }
    const url = this._api.resetEmailVerifyOld()
    const form = new FormData()
    form.append('email', this.oldEmail)
    this._http.post(url, form, { withCredentials: true }).subscribe(
      (res: any) => {
        const errTip = ErrType.getError(res.resultCode)
        if (errTip) {
          this.errorTip = errTip
        } else {
          this.title = '绑定邮箱信息'
          this.rmResetMailDiv.nativeElement.hidden = true
          this.rmBindNewMailDiv.nativeElement.hidden = false
        }
      },
      (error: any) => {
        alert(error.message)
      }
    )
  }

  onBindSuccess() {
    this.hide()
  }
}
