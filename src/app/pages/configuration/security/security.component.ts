/*
 * @Description: 个人设置-安全隐私
 */
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SecurityResetpwComponent } from '../security-resetpw/security-resetpw.component';
import { SecurityResetphoneComponent } from '../security-resetphone/security-resetphone.component';
import { SecurityResetmailComponent } from '../security-resetmail/security-resetmail.component';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../states/reducers';
import * as UserModels from '../../../states/models/user.model';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'lx-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})

export class SecurityComponent implements OnInit, OnDestroy {
  @ViewChild('resetPwChild', undefined)
  resetPwChild: SecurityResetpwComponent;       // 修改密码
  @ViewChild('resetPhoneChild', undefined)
  resetPhoneChild: SecurityResetphoneComponent; // 修改手机号
  @ViewChild('resetMailChild', undefined)
  resetMailChild: SecurityResetmailComponent;   // 绑定邮箱

  userinfo$: Observable<UserModels.UserInfo>;
  userinfoSubscribe = new Subscription();
  userinfo: any;
  email = '';
  securityEmail = '';
  phoneno = '';

  constructor(private _store: Store<fromRoot.State>) {
    this.userinfo$ = this._store.select(fromRoot.getUserInfo);
  }

  ngOnInit() {
    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2/#/pages/configuration/security']);

    this.userinfoSubscribe = this.userinfo$.subscribe(info => {
      if (info) {
        this.userinfo = info;
        this.email = info.email ? info.email.trim() : '';
        this.securityEmail = this.email.slice(0, 2) + '***' + this.email.slice(this.email.length - 3);
        this.phoneno = info.phoneno ? info.phoneno.trim() : '';
      }
    });
  }

  openModal(index) {
    switch (index) {
      // 修改密码
      case 0:
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-change-password']);
        this.resetPw();
        break;
      // 修改手机号
      case 1:
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-change-phone']);
        this.resetPhone();
        break;
      // 修改邮箱
      case 2:
        // 百度统计
        window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-change-email']);
        this.resetMail();
        break;
      default:
        break;
    }
  }

  resetPw() {
    this.resetPwChild.show(this.email);
  }

  resetPhone() {
    this.resetPhoneChild.show();
  }

  resetMail() {
    this.resetMailChild.show(this.email);
  }

  ngOnDestroy() {
    this.userinfoSubscribe.unsubscribe();
  }
}
