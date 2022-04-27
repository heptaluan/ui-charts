import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HelpCenterRoutingModule } from './help-center-routing.module'
import { HelpCenterComponent } from './help-center.component'
import { ShareModule } from '../../share/share.module'
import { HelpListComponent } from './help-list/help-list.component'

@NgModule({
  imports: [CommonModule, ShareModule, HelpCenterRoutingModule],
  declarations: [HelpCenterComponent, HelpListComponent],
})
export class HelpCenterModule {}
