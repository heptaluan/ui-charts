import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareModule } from '../../share/share.module';
import { TemplatesRoutingModule } from './templates-routing.module';

import { TemplatesComponent } from './templates.component';
import { TemplatesIndexComponent } from './templates-index/templates-index.component';
import { TemplatesListComponent } from './templates-list/templates-list.component';
import { TemplatesItemComponent } from './templates-item/templates-item.component';
import { TemplatesSearchInputComponent } from './templates-search-input/templates-search-input.component';
import { TemplatesDetailComponent } from './templates-detail/templates-detail.component';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    TemplatesRoutingModule,
  ],
  declarations: [
    TemplatesComponent,
    TemplatesIndexComponent,
    TemplatesListComponent,
    TemplatesItemComponent,
    TemplatesSearchInputComponent,
    TemplatesDetailComponent,
  ]
})

export class TemplatesModule { }
