import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartTemplateComponent } from './chart-template/chart-template.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { DataDownloadComponent } from './data-download/data-download.component';
import { DataUploadComponent } from './data-upload/data-upload.component';
import { FavoriteTemplateComponent } from './favorite-template/favorite-template.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { HomePageComponent } from './home-page.component';
import { IndexComponent } from './index/index.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { InfoTemplateComponent } from './info-template/info-template.component';

import { SettingsComponent } from '../configuration/settings/settings.component';
import { SecurityComponent } from '../configuration/security/security.component';
import { InviteComponent } from '../configuration/invite/invite.component';
import { VipBillComponent } from './vip-bill/vip-bill.component';
import { VipPrivilegeComponent } from '../price/vip-privilege/vip-privilege.component';
import { PayComponent } from '../price/pay/pay.component';

const routes: Routes = [{
  path: '', component: HomePageComponent,
  children: [
    {
      path: '',
      redirectTo: 'index',
      pathMatch: 'full'
    },
    {
      path: 'index',
      component: IndexComponent
    },
    {
      path: 'chart-template',
      component: ChartTemplateComponent
    },
    {
      path: 'info-template',
      component: InfoTemplateComponent
    },
    {
      path: 'data',
      component: DataUploadComponent
    },
    {
      path: 'project',
      component: ProjectManagementComponent
    },
    {
      path: 'collect',
      component: FavoriteTemplateComponent
    },
    {
      path: 'createproject',
      component: CreateProjectComponent
    },
    {
      path: 'projectmanagement',
      component: ProjectManagementComponent
    },
    {
      path: 'dataupload',
      component: DataUploadComponent
    },
    {
      path: 'datadownload',
      component: DataDownloadComponent
    },
    {
      path: 'favorite',
      component: FavoriteComponent
    },
    {
      path: 'favoritetemplate',
      component: FavoriteTemplateComponent
    },
    {
      path: 'settings',
      component: SettingsComponent
    },
    {
      path: 'bill',
      component: VipBillComponent,
    },
    {
      path: 'security',
      component: SecurityComponent
    },
    {
      path: 'invite',
      component: InviteComponent
    },
    {
      path: 'price',
      component: VipPrivilegeComponent
    },
    {
      path: 'pay',
      component: PayComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
