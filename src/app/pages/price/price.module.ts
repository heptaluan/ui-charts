import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceRoutingModule } from './price-routing.module';
import { PriceComponent } from './price.component';
import { ShareModule } from '../../share/share.module';
import { PayComponent } from './pay/pay.component';
import { VipPrivilegeComponent } from './vip-privilege/vip-privilege.component';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    PriceRoutingModule,
  ],
  declarations: [
    PriceComponent,
    PayComponent,
    VipPrivilegeComponent
  ],
  exports: [
    VipPrivilegeComponent,
    PayComponent
  ]
})

export class PriceModule { }
