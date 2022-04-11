import { Component, OnInit } from '@angular/core'
import { ModalActions, ModalTitle, ButtonType } from '../../../share/prompt/prompt.component'
import { BsModalRef } from 'ngx-bootstrap/modal'
import * as ProjectModels from '../../../states/models/project.model'
import * as ProjectActions from '../../../states/actions/project.action'
import * as fromRoot from '../../../states/reducers'
import { Store } from '@ngrx/store'

@Component({
  selector: 'lx-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss'],
})
export class DeleteProjectComponent implements OnInit {
  deleteTitle: ModalTitle = {
    position: 'left',
    content: '确认删除该项目吗?',
  }

  deleteActions: ModalActions = {
    position: 'right',
    buttons: [
      {
        title: '取消',
        action: 'cancel',
      },
      {
        title: '删除',
        action: 'confirm',
      },
    ],
  }
  project: ProjectModels.ProjectBase

  constructor(public bsModalRef: BsModalRef, private _store: Store<fromRoot.State>) {}

  ngOnInit() {}

  onModalClosed(evt: ButtonType) {
    switch (evt.action) {
      case 'cancel':
        break
      case 'confirm':
        if (this.project.type === 'infographic') {
          this._store.dispatch(new ProjectActions.DeleteProjectAction(this.project.id))
        } else if (this.project.type === 'chart') {
          this._store.dispatch(new ProjectActions.DeleteChartProjectAction(this.project.id))
        }
        break
      default:
        break
    }
  }
}
