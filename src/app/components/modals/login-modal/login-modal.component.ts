import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../states/api.service';
import * as ErrType from '../../../share/error.type';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'lx-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  @ViewChild('staticTab') staticTab: TabsetComponent;

  title: string = '';
  errorTip = '';                    // 提示信息
  tabActive: boolean = true;        // 切换验证码登录与帐号密码登录
  phoneNo: string = '';             // 手机号
  pwd: string = '';                 // 密码
  telCode: string = '';             // 验证码
  loginTxt: string = '';            // 登录注册文本
  sendCodeTip: string = '发送验证码';
  initialState;
  isLogin: boolean;                 // 判断登录还是注册
  bsModalRef: BsModalRef;

  codestate = '';
  codeTimer = null;
  constructor(
    private _http: HttpClient,
    private _api: API,
    private _modalService: BsModalService
  ) { }

  ngOnInit() {
    this.initialState = this._modalService.config.initialState;
    this.isLogin = this.initialState.isLogin;
    if (this.isLogin) {
      this.loginTxt = '登录';
      this.title = '欢迎使用镝数';
    } else {
      this.loginTxt = '注册';
      this.title = '使用手机号注册';
    }
  }

  onTabSelect() {
    // 重置信息
    this.onKeyDown();
    this.tabActive = !this.tabActive;
  }

  onKeyDown() {
    this.errorTip = '';
  }

  // 跳转登录
  jump() {
    this.bsModalRef = this._modalService.show(LoginModalComponent, {
      initialState: {
        isLogin: true
      }
    });
  }

  // 手机验证发送验证码
  onPhoneSendSMS() {
    if (!this.phoneNo.trim()) {
      this.errorTip = '请输入手机号码';
      return;
    }
    if (this.phoneNo.trim().length !== 11) {
      this.errorTip = '请输入正确的手机号';
      return;
    }
    this.sendSMS();
  }

  // 倒计时
  codeCountDown() {
    let count = 60;
    if (this.codeTimer) {
      clearInterval(this.codeTimer);
      this.codeTimer = null;
    }
    this.codeTimer = setInterval(() => {
      if (count >= 1) {
        this.sendCodeTip = `${count}秒后重新发送`;
        this.codestate = `disabled btn-disable`;
      } else {
        this.sendCodeTip = `发送验证码`;
        this.codestate = ``;
        clearInterval(this.codeTimer);
        this.codeTimer = null;
      }
      count--;
    }, 1000);
  }

  sendSMS(type?: string) {
    this.sendCodeTip = `验证码发送中...`;
    this.codestate = `disabled`;
    let url = this._api.resetPwdSendSmsCode();
    const form = new FormData();
    form.append('phoneNo', this.phoneNo);

    this._http.post(url, form, { withCredentials: true })
      .subscribe(
        (res: any) => {
          const errTip = ErrType.getError(res.resultCode);
          if (errTip) {
            this.errorTip = errTip;
            this.sendCodeTip = `发送验证码`;
            this.codestate = ``;
          } else {
            this.codeCountDown();
          }
        },
        error => {
          this.sendCodeTip = `发送验证码`;
          this.codestate = ``;
          alert(error.message);
        }
      );
  }

  login(txt) {
    if (!this.phoneNo.trim()) {
      this.errorTip = '请输入手机号码';
      return;
    }
    if (this.phoneNo.trim().length !== 11) {
      this.errorTip = '请输入正确的手机号';
      return;
    }
    if (this.tabActive) {
      if (!this.telCode.trim()) {
        this.errorTip = '请输入验证码';
        return;
      }
    } else {
      if (!this.pwd.trim()) {
        this.errorTip = '请输入密码';
        return;
      }
    }
  }

}
