/*
 * @Description: 个人设置页模块
 */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { ShareModule } from '../../share/share.module'
import { ImageCropperModule } from 'ngx-img-cropper'

import { ConfigurationRoutingModule } from './configuration-routing.module'
import { ConfigurationComponent } from './configuration.component'
import { SettingsComponent } from './settings/settings.component'
import { SecurityComponent } from './security/security.component'
import { BillComponent } from './bill/bill.component'
import { PlanComponent } from './plan/plan.component'
import { MemberComponent } from './member/member.component'
import { BeginnerComponent } from './beginner/beginner.component'
import { SecurityResetpwComponent } from './security-resetpw/security-resetpw.component'
import { SecurityResetphoneComponent } from './security-resetphone/security-resetphone.component'
import { SecurityResetmailComponent } from './security-resetmail/security-resetmail.component'
import { InviteComponent } from './invite/invite.component'
import { ExchangeComponent } from './exchange/exchange.component'

@NgModule({
  imports: [CommonModule, ShareModule, ConfigurationRoutingModule, FormsModule, ImageCropperModule],
  exports: [PlanComponent, BillComponent, ExchangeComponent],
  declarations: [
    ConfigurationComponent,
    SettingsComponent,
    SecurityComponent,
    BillComponent,
    InviteComponent,
    PlanComponent,
    MemberComponent,
    BeginnerComponent,
    SecurityResetpwComponent,
    SecurityResetphoneComponent,
    SecurityResetmailComponent,
    ExchangeComponent,
  ],
})
export class ConfigurationModule {}
