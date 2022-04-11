/*
 * @Description: 项目重命名
 */
import { Component, OnInit, ElementRef } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'
import * as ProjectModels from '../../../states/models/project.model'
import { ModalTitle } from '../../../share/prompt/prompt.component'
import * as ProjectActions from '../../../states/actions/project.action'
import * as fromRoot from '../../../states/reducers'
import { Store } from '@ngrx/store'
import { FormControl, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'lx-exchange-modal',
  templateUrl: './exchange-modal.component.html',
  styleUrls: ['./exchange-modal.component.scss'],
})
export class ExchangeModalComponent implements OnInit {
  project: ProjectModels.ProjectBase
  title: ModalTitle
  days: number = 0

  constructor(
    public bsModalRef: BsModalRef,
    private _store: Store<fromRoot.State>,
    private _el: ElementRef,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.bsModalRef.hide()
  }
}
