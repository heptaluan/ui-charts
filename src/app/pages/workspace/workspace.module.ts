import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { BlockModule } from '../../block/block.module';
// import { HotTableModule } from '@handsontable/angular';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './workspace.component';
import { EditorComponent } from './editor/editor.component';
import { SettingsComponent } from './settings/settings.component';

import { ChartSettingsComponent } from './settings/chart-settings/chart-settings.component';
import { PageComponent } from './page/page.component';
import { ChartRightSettingsComponent } from './settings/chart-settings/chart-right-settings/chart-right-settings.component';
import { ChartLeftSettingsComponent } from './settings/chart-settings/chart-left-settings/chart-left-settings.component';

import { TextSettingsComponent } from './settings/text-settings/text-settings.component';

import { PageSettingsComponent } from './settings/page-settings/page-settings.component';
import { PageRightSettingsComponent } from './settings/page-settings/page-right-settings/page-right-settings.component';
import { PageLeftSettingsComponent } from './settings/page-settings/page-left-settings/page-left-settings.component';
import { TableComponent } from './settings/table/table.component';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChartSidebarComponent } from './sidebar/chart-sidebar/chart-sidebar.component';
import { TextSidebarComponent } from './sidebar/text-sidebar/text-sidebar.component';
import { ChartTemplateItemComponent } from './sidebar/chart-template-item/chart-template-item.component';
import { TextTemplateItemComponent } from './sidebar/text-template-item/text-template-item.component';

import { WorkspaceResolveService } from './workspace-resolve.service';

import { ToggleChartComponent } from './settings/chart-settings/toggle-chart/toggle-chart.component';
import { ToggleIconComponent } from './settings/chart-settings/toggle-icon/toggle-icon.component';
import { ToggleThemeComponent } from './settings/page-settings/toggle-theme/toggle-theme.component';
import { ThemeListComponent } from './settings/page-settings/theme-list/theme-list.component';
import { ShapeTemplateItemComponent } from './sidebar/shape-template-item/shape-template-item.component';
import { ShapeSidebarComponent } from './sidebar/shape-sidebar/shape-sidebar.component';
import { ShapeSettingsComponent } from './settings/shape-settings/shape-settings.component';
import { ChartPageComponent } from './chart-page/chart-page.component';
import { InnerHeaderComponent } from './inner-header/inner-header.component';
import { ImageSidebarComponent } from './sidebar/image-sidebar/image-sidebar.component';
import { ImageTemplateItemComponent } from './sidebar/image-template-item/image-template-item.component';
import { ImageSettingsComponent } from './settings/image-settings/image-settings.component';
import { IconTemplateItemComponent } from './sidebar/icon-template-item/icon-template-item.component';
import { SingleChartTemplateItemComponent } from './sidebar/single-chart-template-item/single-chart-template-item.component';
import { SceneSidebarComponent } from './sidebar/scene-sidebar/scene-sidebar.component';
import { SceneTemplateItemComponent } from './sidebar/scene-template-item/scene-template-item.component';
import { ReferComponent } from './refer/refer.component';

// context menu
import { ContextMenuModule } from 'ngx-contextmenu';
import { VideoSidebarComponent } from './sidebar/video-sidebar/video-sidebar.component';
import { AudioSettingsComponent } from './settings/audio-settings/audio-settings.component';
import { VideoSettingsComponent } from './settings/video-settings/video-settings.component';
import { AudioSidebarComponent } from './sidebar/audio-sidebar/audio-sidebar.component';
import { MultipleSettingsComponent } from './settings/multiple-settings/multiple-settings.component';
import { GroupSettingsComponent } from './settings/group-settings/group-settings.component';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    BlockModule,
    WorkspaceRoutingModule,
    // HotTableModule.forRoot(),
    ContextMenuModule.forRoot()
  ],
  declarations: [
    WorkspaceComponent,
    EditorComponent,
    PageComponent,
    SettingsComponent,
    ChartSettingsComponent,
    ChartRightSettingsComponent,
    ChartLeftSettingsComponent,
    TextSettingsComponent,
    PageSettingsComponent,
    PageRightSettingsComponent,
    PageLeftSettingsComponent,
    TableComponent,
    HeaderComponent,
    SidebarComponent,
    ChartSidebarComponent,
    TextSidebarComponent,
    ChartTemplateItemComponent,
    TextTemplateItemComponent,
    ToggleChartComponent,
    ToggleIconComponent,
    ToggleThemeComponent,
    ThemeListComponent,
    ShapeTemplateItemComponent,
    ShapeSidebarComponent,
    ShapeSettingsComponent,
    ChartPageComponent,
    InnerHeaderComponent,
    ImageSidebarComponent,
    ImageTemplateItemComponent,
    ImageSettingsComponent,
    AudioSettingsComponent,
    VideoSettingsComponent,
    GroupSettingsComponent,
    IconTemplateItemComponent,
    SingleChartTemplateItemComponent,
    SceneSidebarComponent,
    SceneTemplateItemComponent,
    AudioSidebarComponent,
    VideoSidebarComponent,
    ReferComponent,
    MultipleSettingsComponent
    ],
    providers: [WorkspaceResolveService],
    entryComponents: [PageComponent, ChartPageComponent]
})
export class WorkspaceModule { }
