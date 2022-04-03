import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ScrollService } from '../../share/services/scroll.service';
import { ShareModule } from '../../share/share.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import { PriceModule } from '../price/price.module';
import { CasesFilterComponent } from './cases-filter/cases-filter.component';
import { CasesLibraryComponent } from './cases-library/cases-library.component';
import { CasesComponent } from './cases/cases.component';
import { ChartTemplateComponent } from './chart-template/chart-template.component';
import { CreateGraphicsComponent } from './create-graphics/create-graphics.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { DataDownloadComponent } from './data-download/data-download.component';
import { DataUploadComponent } from './data-upload/data-upload.component';
import { FavoriteTemplateComponent } from './favorite-template/favorite-template.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { GenerateCaseComponent } from './generate-case/generate-case.component';
import { GenerateTemplateComponent } from './generate-template/generate-template.component';
import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './home-page.component';
import { HomeSidebarComponent } from './home-sidebar/home-sidebar.component';
import { IndexComponent } from './index/index.component';
import { InfoTemplateComponent } from './info-template/info-template.component';
import { ListItemComponent } from './list-item/list-item.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { ProjectTypeCollectionComponent } from './project-type-collection/project-type-collection.component';
import { UnLoginComponent } from './un-login/un-login.component';
import { VipBillComponent } from './vip-bill/vip-bill.component';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    ConfigurationModule,
    PriceModule,
    HomePageRoutingModule,
    ProgressbarModule.forRoot(),
    CollapseModule.forRoot(),
  ],
  declarations: [
    HomePageComponent,
    CasesLibraryComponent,
    GenerateCaseComponent,
    GenerateTemplateComponent,
    ProjectTypeCollectionComponent,
    CasesFilterComponent,
    CreateGraphicsComponent,
    CasesComponent,
    CreateProjectComponent,
    HomeSidebarComponent,
    ProjectManagementComponent,
    ProgressbarComponent,
    DataUploadComponent,
    ListItemComponent,
    DataDownloadComponent,
    FavoriteComponent,
    FavoriteTemplateComponent,
    IndexComponent,
    ChartTemplateComponent,
    InfoTemplateComponent,
    UnLoginComponent,
    VipBillComponent,
  ],
  providers: [ScrollService]
})
export class HomePageModule { }
