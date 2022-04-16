import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CommonPageComponent } from './common-page.component'
import { CommonPageRoutingModule } from './common-page-routing.module'
import { MediaOperationsComponent } from './index'
import { ShareModule } from '../../share/share.module'

@NgModule({
  imports: [CommonModule, CommonPageRoutingModule, ShareModule],
  declarations: [CommonPageComponent, MediaOperationsComponent],
})
export class CommonPageModule {}
