import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpCenterComponent } from './help-center.component';
import { HelpIndexComponent } from './help-index/help-index.component';
import { HelpListComponent } from './help-list/help-list.component';

const routes: Routes = [{
  path: '', component: HelpCenterComponent,
  children: [
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full'
    },
    {
      path: 'index',
      component: HelpIndexComponent
    },
    {
      path: 'list',
      component: HelpListComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class HelpCenterRoutingModule { }
