import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { CommonPageComponent } from './common-page.component'
import { MediaOperationsComponent } from './index'

const routes: Routes = [
  {
    path: '',
    component: CommonPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'media',
        pathMatch: 'full',
      },
      {
        path: 'media',
        component: MediaOperationsComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonPageRoutingModule {}
