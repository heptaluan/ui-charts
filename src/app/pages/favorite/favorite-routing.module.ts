import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoriteComponent } from './favorite.component';
import { ChartComponent } from './chart/chart.component';
import { CasedetailComponent } from './casedetail/casedetail.component';

const routes: Routes = [
  {
    path: 'case',
    component: CasedetailComponent
  }, {
    path: '', component: FavoriteComponent,
    children: [
      {
        path: '',
        redirectTo: 'chart',
        pathMatch: 'full'
      }, {
        path: 'chart',
        component: ChartComponent
      }, {
        path: 'charts',
        component: ChartComponent
      }, {
        path: 'infographic',
        component: ChartComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavoriteRoutingModule { }
