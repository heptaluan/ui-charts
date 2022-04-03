import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareModule } from '../../share/share.module';

import { FavoriteRoutingModule } from '../favorite/favorite-routing.module';

import { FavoriteComponent } from '../favorite/favorite.component';
import { ChartComponent } from './chart/chart.component';
import { CasedetailComponent } from './casedetail/casedetail.component';
import { FavoriteService } from './favorite.service';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    FavoriteRoutingModule
  ],
  declarations: [
    FavoriteComponent,
    ChartComponent,
    CasedetailComponent
  ],
  providers: [ FavoriteService ]
})
export class FavoriteModule { }
