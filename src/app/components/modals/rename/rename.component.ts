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
  selector: 'lx-rename',
  templateUrl: './rename.component.html',
  styleUrls: ['./rename.component.scss'],
})
export class RenameComponent implements OnInit {
  project: ProjectModels.ProjectBase
  title: ModalTitle
  projectName: FormControl
  type: string
  confirmFlag: boolean = false
  isRewaterfall: boolean = false

  constructor(
    public bsModalRef: BsModalRef,
    private _store: Store<fromRoot.State>,
    private _el: ElementRef,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.title = {
      content: '重命名',
      position: 'center',
    }
    this.projectName = new FormControl(this.project.title, Validators.maxLength(50))
    setTimeout(() => {
      this._el.nativeElement.querySelector('input').focus()
    }, 300)
  }

  onSubmit() {
    // 如果值一样就不用请求了
    if (this.project.title === this.projectName.value) {
      this.bsModalRef.hide()
      return
    }
    // 如果上传过来
    if (this.type === 'upload') {
      if (this.projectName.valid && !!this.projectName.value && this.projectName.value.trim() !== '') {
        this.confirmFlag = true
      } else {
        return
      }
    } else {
      // 其他位置
      if (this.project.type === 'infographic') {
        if (this.projectName.valid) {
          if (!!this.projectName.value && this.projectName.value.trim() !== '') {
            this._store.dispatch(
              new ProjectActions.ConfigProjectAction(this.project.id, {
                action: 'rename',
                title: this.projectName.value,
              })
            )
          } else {
            this._store.dispatch(
              new ProjectActions.ConfigProjectAction(this.project.id, { action: 'rename', title: '未命名' })
            )
          }
          this.isRewaterfall = true
        } else {
          return false
        }
      } else if (this.project.type === 'chart') {
        if (this.projectName.valid) {
          if (!!this.projectName.value && this.projectName.value.trim() !== '') {
            this._store.dispatch(
              new ProjectActions.ConfigChartProjectAction(this.project.id, {
                action: 'rename',
                title: this.projectName.value,
              })
            )
          } else {
            this._store.dispatch(
              new ProjectActions.ConfigChartProjectAction(this.project.id, { action: 'rename', title: '未命名' })
            )
          }
          this.isRewaterfall = true
        } else {
          return false
        }
      }
    }

    this.bsModalRef.hide()
  }
}
