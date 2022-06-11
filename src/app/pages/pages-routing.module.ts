/*
 * @Description: 页面路由
 */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PagesComponent } from './pages.component'
import { AuthGuard } from '../auth-guard.service'
import { DownloadComponent } from './download/download.component'
import { CaseComponent } from './case/case.component'
import { IndexIntroduceComponent } from './index-introduce/index-introduce.component'
import { InvitationComponent } from './invitation/invitation.component'
import { ExchangePhoneComponent } from './exchange-phone/exchange-phone.component'
import { IndexIntroduceRegisterComponent } from './index-introduce-register/index-introduce-register.component'

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      // { path: 'index', loadChildren: './index/index.module#IndexModule' },
      { path: 'invitation', component: InvitationComponent },
      { path: 'help', loadChildren: './help-center/help-center.module#HelpCenterModule' },
      // { path: 'store', loadChildren: './store/store.module#StoreModule' },
      { path: 'templates', loadChildren: './templates/templates.module#TemplatesModule' },
      { path: 'common', loadChildren: './common-page/common-page.module#CommonPageModule' },
      { path: 'price', loadChildren: './price/price.module#PriceModule' },
      { path: 'home', loadChildren: './home-page/home-page.module#HomePageModule' },
      // { path: 'configuration', loadChildren: './configuration/configuration.module#ConfigurationModule' },
      { path: 'favorite', loadChildren: './favorite/favorite.module#FavoriteModule' },
      { path: 'index/introduce', component: IndexIntroduceRegisterComponent },
      { path: 'index/userhelp', component: IndexIntroduceComponent },
      { path: 'case', component: CaseComponent },
      { path: 'exchange', component: ExchangePhoneComponent },
    ],
  },
  { path: 'workspace', loadChildren: './workspace/workspace.module#WorkspaceModule' },
  { path: 'download', component: DownloadComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class PagesRoutingModule {}
