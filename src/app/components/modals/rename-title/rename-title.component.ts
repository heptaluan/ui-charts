/*
 * @Description: fork 图表 重命名标题
 */
import { Component, OnInit, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as ProjectModels from '../../../states/models/project.model';
import { ModalTitle } from '../../../share/prompt/prompt.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'lx-rename-title',
  templateUrl: './rename-title.component.html',
  styleUrls: ['./rename-title.component.scss']
})

export class RenameTitleComponent implements OnInit {

  titleText: ProjectModels.ProjectBase;
  title: ModalTitle;
  projectName: FormControl;
  confirmFlag: boolean = false;

  constructor
  (
    public bsModalRef: BsModalRef,
    private _el: ElementRef,
  ) { }

  ngOnInit() {
    this.title = {
      content: '项目名称',
      position: 'center'
    };
    this.projectName = new FormControl(this.titleText, Validators.maxLength(50));
    setTimeout(() => {
      this._el.nativeElement.querySelector('input').focus();
    }, 300);
  }

  onSubmit() {
    this.confirmFlag = true
    this.title.content = this.projectName.value
    this.bsModalRef.hide();
  }

}
