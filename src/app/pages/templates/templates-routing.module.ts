import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { TemplatesComponent } from '../templates/templates.component'
import { TemplatesIndexComponent } from './templates-index/templates-index.component'
import { TemplatesListComponent } from './templates-list/templates-list.component'
import { TemplatesDetailComponent } from './templates-detail/templates-detail.component'

const routes: Routes = [
  {
    path: '',
    component: TemplatesComponent,
    children: [
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full',
      },
      {
        path: 'index',
        component: TemplatesIndexComponent,
      },
      {
        path: 'list',
        component: TemplatesListComponent,
      },
      {
        path: 'item',
        component: TemplatesDetailComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatesRoutingModule {}
