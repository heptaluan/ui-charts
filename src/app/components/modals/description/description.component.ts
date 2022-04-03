/*
 * @Description: 修改项目描述
 */
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as ProjectModels from '../../../states/models/project.model';
import { ModalTitle } from '../../../share/prompt/prompt.component';
import * as ProjectActions from '../../../states/actions/project.action';
import * as fromRoot from '../../../states/reducers';
import { Store } from '@ngrx/store';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'lx-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

  project: ProjectModels.ProjectBase;
  title: ModalTitle;
  description: FormControl;

  constructor(public bsModalRef: BsModalRef, private _store: Store<fromRoot.State>) {
    this.title = {
      content: '项目描述',
      position: 'center'
    };
  }

  ngOnInit() {
    this.description = new FormControl(this.project.description, Validators.maxLength(140));
  }

  onSubmit() {
    if (this.description.valid) {
      if (this.project.type === 'infographic') {
        this._store.dispatch(new ProjectActions.ConfigProjectAction(this.project.id, {action: 'set_description', description: this.description.value}));
      } else if (this.project.type === 'chart') {
        this._store.dispatch(new ProjectActions.ConfigChartProjectAction(this.project.id, {action: 'set_description', description: this.description.value}));
      }
      this.bsModalRef.hide();
    } else {
      return false;
    }
  }

}
