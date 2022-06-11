import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { WorkspaceComponent } from './workspace.component'
import { EditorComponent } from './editor/editor.component'
import { WorkspaceResolveService } from './workspace-resolve.service'

const routes: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspaceRoutingModule {}
