/*
 * @Description: 页面路由
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PriceComponent } from './price.component';
import { PayComponent } from './pay/pay.component';
import { VipPrivilegeComponent } from './vip-privilege/vip-privilege.component';

// const routes: Routes = [
//   {
//     path: '', component: PriceComponent,
//     children: [
//       { path: '', redirectTo: 'index', pathMatch: 'full' },
//       { path: 'index', component: VipPrivilegeComponent },
//       { path: 'pay', component: PayComponent },
//     ]
//   }
// ];

@NgModule({
  //   imports: [RouterModule.forChild(routes)],
  //   exports: [RouterModule]
})
export class PriceRoutingModule {}
