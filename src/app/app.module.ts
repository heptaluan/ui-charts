/*
 * @Description: 根模块
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './states/services/in-memory-data.service';
// import { HotTableModule } from '@handsontable/angular';

/**
 * Redux数据架构
 */
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { storeFreeze } from 'ngrx-store-freeze';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpService, ProjectService, UserService, TemplateService, FavoriteCaseService, ChartService, ProjectCaseService, DataStoreService } from './states/services';
import { RouterEffects, ProjectEffect, TemplateEffect, UserEffect, FavoriteCaseEffect, ChartEffect, ProjectCaseEffect, DataStoreEffect } from './states/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { API } from './states/api.service';
import { State, emptyState } from './states/reducers';

import { reducers, CustomSerializer } from './states/reducers';

import { ShareModule } from './share/share.module';
import { BlockModule } from './block/block.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UpdateTipComponent } from './components/update-tip/update-tip.component';
// alert
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { TableComponent } from './pages/workspace/settings/table/table.component';

import {
  LoginModalComponent,
  ContactUsModalComponent,
  PublishModalComponent,
  InitializeProjectComponent,
  DeleteProjectComponent,
  RenameComponent,
  RenameTitleComponent,
  ExchangeModalComponent,
  DescriptionComponent,
  ProjectSizeLimitComponent,
  UpgradeMemberComponent,
  UpgradeMemberOldComponent,
  InsertSingleChartTipComponent,
  DataMemberComponent,
  DataDemandFeedbackComponent,
  CreateProjectModalComponent,
  UploadDataModalComponent,
  DeleteUploadComponent,
  PublishShareComponent,
  BindPhoneComponent,
  UserInfoCollectModalComponent,
  ProgressComponent,
  ZipLoadingComponent,
  PlayVideoComponent,
  BusinessPriceComponent,
  PayDataModalComponent,
  CommonDeleteModalComponent,
  ExportToPhoneModalComponent,
  UploadImgModalComponent,
  OperationComponent,
  MobileDychartModelComponent,
  ThirdVideoHelpComponent,
  InputModalComponent,
  UploadTipsComponent
} from './components/modals';


import { LocationStrategy, HashLocationStrategy } from '@angular/common';

const APP_SERVICE = [
  API,
  HttpService,
  ProjectService,
  TemplateService,
  FavoriteCaseService,
  UserService,
  ChartService,
  ProjectCaseService,
  DataStoreService
];

const APP_EFFECTS = [
  RouterEffects,
  ProjectEffect,
  TemplateEffect,
  FavoriteCaseEffect,
  UserEffect,
  ChartEffect,
  ProjectCaseEffect,
  DataStoreEffect
];

export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze] : [];

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    UpdateTipComponent,
    LoginModalComponent,
    ContactUsModalComponent,
    PublishModalComponent,
    InitializeProjectComponent,
    DeleteProjectComponent,
    RenameComponent,
    RenameTitleComponent,
    ExchangeModalComponent,
    DescriptionComponent,
    ExportToPhoneModalComponent,
    ProjectSizeLimitComponent,
    UpgradeMemberComponent,
    UpgradeMemberOldComponent,
    InsertSingleChartTipComponent,
    DataMemberComponent,
    DataDemandFeedbackComponent,
    CreateProjectModalComponent,
    UploadDataModalComponent,
    DeleteUploadComponent,
    PublishShareComponent,
    BindPhoneComponent,
    PlayVideoComponent,
    BusinessPriceComponent,
    MobileDychartModelComponent,
    UserInfoCollectModalComponent,
    ProgressComponent,
    ZipLoadingComponent,
    PayDataModalComponent,
    CommonDeleteModalComponent,
    UploadImgModalComponent,
    OperationComponent,
    ThirdVideoHelpComponent,
    InputModalComponent,
    UploadTipsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    // HotTableModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers: metaReducers, initialState: emptyState }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot(APP_EFFECTS),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router'
    }),
    environment.production ? [] : HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {
        dataEncapsulation: false,
        passThruUnknownUrl: true,
        put204: false // return entity after PUT/update
      }
    ),
    ShareModule.forRoot(),
    BlockModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      closeButton: true,
      positionClass: 'toast-top-center'
    })
    // 目前暂时没有用 https
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ...APP_SERVICE
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    InitializeProjectComponent,
    LoginModalComponent,
    ContactUsModalComponent,
    PublishModalComponent,
    DeleteProjectComponent,
    RenameComponent,
    RenameTitleComponent,
    ExchangeModalComponent,
    DescriptionComponent,
    ProjectSizeLimitComponent,
    UpgradeMemberComponent,
    UpgradeMemberOldComponent,
    InsertSingleChartTipComponent,
    DataMemberComponent,
    DataDemandFeedbackComponent,
    CreateProjectModalComponent,
    PlayVideoComponent,
    BusinessPriceComponent,
    MobileDychartModelComponent,
    UploadDataModalComponent,
    DeleteUploadComponent,
    PublishShareComponent,
    BindPhoneComponent,
    UserInfoCollectModalComponent,
    ProgressComponent,
    ZipLoadingComponent,
    PayDataModalComponent,
    CommonDeleteModalComponent,
    ExportToPhoneModalComponent,
    UploadImgModalComponent,
    OperationComponent,
    ThirdVideoHelpComponent,
    InputModalComponent,
    UploadTipsComponent
  ],
})
export class AppModule { }
