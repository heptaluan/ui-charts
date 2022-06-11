/*
 * @Description: 页面模块，由各个路由页面构成
 */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ShareModule } from '../share/share.module'
import { BlockModule } from '../block/block.module'

import { PagesRoutingModule } from './pages-routing.module'
import { PagesComponent } from './pages.component'
import { DownloadComponent } from './download/download.component'
import { ConfigDownloadComponent } from './download/config-download/config-download.component'
import { PreviewComponent } from '../components/preview/preview.component'
import { ThumbnailComponent } from './download/thumbnail/thumbnail.component'
import { CaseComponent } from './case/case.component'
import { InvitationComponent } from './invitation/invitation.component'
import { IndexIntroduceComponent } from './index-introduce/index-introduce.component'
import { ExchangePhoneComponent } from './exchange-phone/exchange-phone.component'
import { IndexIntroduceRegisterComponent } from './index-introduce-register/index-introduce-register.component'

@NgModule({
  imports: [CommonModule, ShareModule, BlockModule, PagesRoutingModule],
  exports: [],
  declarations: [
    PagesComponent,
    DownloadComponent,
    ConfigDownloadComponent,
    PreviewComponent,
    ThumbnailComponent,
    InvitationComponent,
    CaseComponent,
    IndexIntroduceComponent,
    IndexIntroduceRegisterComponent,
    ExchangePhoneComponent,
  ],
})
export class PagesModule {}
