import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { FavoriteComponent } from './favorite.component'
import { ChartComponent } from './chart/chart.component'

const routes: Routes = [
  {
    path: '',
    component: FavoriteComponent,
    children: [
      {
        path: '',
        redirectTo: 'chart',
        pathMatch: 'full',
      },
      {
        path: 'chart',
        component: ChartComponent,
      },
      {
        path: 'charts',
        component: ChartComponent,
      },
      {
        path: 'infographic',
        component: ChartComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoriteRoutingModule {}
