/*
 * @Description: 公共模块，提供公共组件及服务
 */
import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { RouterModule, Router } from '@angular/router'

import { ColorPickerModule } from './color-picker/color-picker.module'
import { HtmlPipe } from './shape-pipe'
import { PropertiesPipe } from './pipe/keyvalue.pipe'
import { NgxLoadingModule } from 'ngx-loading'

// import { NgxMasonryModule } from 'ngx-masonry';

import { QRCodeModule } from 'angular2-qrcode'

import { FormatDataTimePipe } from './pipe/format-data-time.pipe'

import {
  NbThemeModule,
  NbLayoutModule,
  NbUserModule,
  NbContextMenuModule,
  NbMenuModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbCardModule,
  NbCheckboxModule,
  NbSidebarModule,
} from '@nebular/theme'

import {
  BsDropdownModule,
  PaginationModule,
  ModalModule,
  ButtonsModule,
  TabsModule,
  AccordionModule,
  ProgressbarModule,
  PopoverModule,
  CarouselModule,
  TooltipModule,
} from 'ngx-bootstrap'

import { UiSwitchModule } from 'ngx-ui-switch'

import { HeaderComponent } from './header/header.component'
import { CaseItemComponent } from './case-item/case-item.component'
import { FormSearchComponent } from './form-search/form-search.component'
import { ModalComponent } from './modal/modal.component'
import { PromptComponent } from './prompt/prompt.component'
import { PaginationComponent } from './pagination/pagination.component'
import { SizeComponent } from './settings/size/size.component'
import { DropdownsComponent } from './settings/dropdowns/dropdowns.component'
import { SliderComponent } from './settings/slider/slider.component'
import { SwitchComponent } from './settings/switch/switch.component'
import { CheckboxComponent } from './settings/checkbox/checkbox.component'
import { RadioComponent } from './settings/radio/radio.component'
import { FooterComponent } from './footer/footer.component'
import { WheelColorPickerComponent } from './wheel-color-picker/wheel-color-picker.component'
import { ColorListComponent } from './color-list/color-list.component'

import {
  VipService,
  CreateProjectService,
  DataTransmissionService,
  NotifyChartRenderService,
  UtilsService,
  SetBlockZIndexService,
  CompleteBlockService,
  SearchTypeService,
  IndexService,
  WaterfallService,
} from './services'

import { ToolComponent } from './tool/tool.component'
import { ClassifyComponent } from './settings/classify/classify.component'
import { LoadingComponent } from './loading/loading.component'

import { HotTableModule } from '@handsontable/angular'
import { MagicBoxComponent } from './magic-box/magic-box.component'

import { ChangeZoomDirective } from '../pages/workspace/changeZoom.directive'
import { DropUploadDirective } from '../pages/workspace/drag-upload.directive'

import { FloatMenuComponent } from './float-menu/float-menu.component'
import { referLineDirective } from '../pages/workspace/referLine.directive'
import { InputGroupComponent } from './input-group/input-group.component'
import { ProcessComponent } from './process/process.component'
import { ElementsAlignedComponent } from './elements-aligned/elements-aligned.component'
import { ElementsLockedComponent } from './elements-locked/elements-locked.component'

import {
  SwitchSettingComponent,
  DyCarouselComponent,
  DySearchComponent,
  DyPanelComponent,
  DyIndexFooterComponent,
  DyFooterComponent,
} from './index'
import { SafePipe } from './pipe/safe.pipe'

import { magicBoxDirective } from '../pages/workspace/magicBox.directive'
import { DyScrollComponent } from './dy-ui/dy-scroll/dy-scroll.component'
import { ClickOutsideDirective } from './directives/clickoutside.directive'

const COMMON_MODULES = [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, ColorPickerModule]

const NB_MODULES = [
  NbThemeModule,
  NbLayoutModule,
  NbUserModule,
  NbContextMenuModule,
  NbMenuModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbCardModule,
  NbCheckboxModule,
  NbSidebarModule,
]

const NGX_BOOTSTRAP_MODULES = [
  BsDropdownModule,
  PaginationModule,
  ModalModule,
  ButtonsModule,
  TabsModule,
  AccordionModule,
  ProgressbarModule,
  PopoverModule,
  CarouselModule,
  TooltipModule,
]

// const CHARTS_PROVIDERS = [
//   ChartsModule.forRoot().providers
// ];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
    {
      name: 'default',
      // name: 'cosmic',
    }
    // [DEFAULT_THEME, COSMIC_THEME],
  ).providers,
  ...NbMenuModule.forRoot().providers,
  ...NbSidebarModule.forRoot().providers,
]

const NGX_BOOTSTRAP_PROVIDERS = [
  BsDropdownModule.forRoot().providers,
  PaginationModule.forRoot().providers,
  ModalModule.forRoot().providers,
  ButtonsModule.forRoot().providers,
  TabsModule.forRoot().providers,
  AccordionModule.forRoot().providers,
  ProgressbarModule.forRoot().providers,
  PopoverModule.forRoot().providers,
  CarouselModule.forRoot().providers,
  TooltipModule.forRoot().providers,
]

const SHARE_SERVICES = [
  WaterfallService,
  IndexService,
  VipService,
  CreateProjectService,
  CompleteBlockService,
  UtilsService,
  DataTransmissionService,
  SearchTypeService,
  NotifyChartRenderService,
  ChangeZoomDirective,
  DropUploadDirective,
  referLineDirective,
  SetBlockZIndexService,
  magicBoxDirective,
]

const SHARE_COMPONENTS = [
  HeaderComponent,
  CaseItemComponent,
  FormSearchComponent,
  ModalComponent,
  PromptComponent,
  PaginationComponent,
  SizeComponent,
  DropdownsComponent,
  SwitchComponent,
  CheckboxComponent,
  SliderComponent,
  RadioComponent,
  FooterComponent,
  ToolComponent,
  FloatMenuComponent,
  ClassifyComponent,
  LoadingComponent,
  MagicBoxComponent,
  InputGroupComponent,
  WheelColorPickerComponent,
  ColorListComponent,
  SwitchSettingComponent,
  DyCarouselComponent,
  DyFooterComponent,
  DySearchComponent,
  DyPanelComponent,
  DyIndexFooterComponent,
  DyScrollComponent,
  ProcessComponent,
  ElementsAlignedComponent,
  ElementsLockedComponent,
]

@NgModule({
  imports: [
    ...COMMON_MODULES,
    ...NGX_BOOTSTRAP_MODULES,
    ...NB_MODULES,
    UiSwitchModule,
    // NgxMasonryModule,
    QRCodeModule,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(0, 0, 0, 0.7)',
      fullScreenBackdrop: true,
    }),
    HotTableModule.forRoot(),
  ],
  exports: [
    ...NGX_BOOTSTRAP_MODULES,
    ...NB_MODULES,
    ...COMMON_MODULES,
    ...SHARE_COMPONENTS,
    HtmlPipe,
    PropertiesPipe,
    SafePipe,
    QRCodeModule,
    NgxLoadingModule,
    LoadingComponent,
    HotTableModule,
    // NgxMasonryModule,
    ChangeZoomDirective,
    DropUploadDirective,
    referLineDirective,
    FormatDataTimePipe,
    magicBoxDirective,
    ClickOutsideDirective,
  ],
  declarations: [
    ...SHARE_COMPONENTS,
    HtmlPipe,
    PropertiesPipe,
    SafePipe,
    ChangeZoomDirective,
    DropUploadDirective,
    referLineDirective,
    ClickOutsideDirective,
    FormatDataTimePipe,
    magicBoxDirective,
  ],
  entryComponents: [WheelColorPickerComponent],
})
export class ShareModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ShareModule,
      providers: [...NB_THEME_PROVIDERS, ...NGX_BOOTSTRAP_PROVIDERS, ...SHARE_SERVICES],
    }
  }
}
