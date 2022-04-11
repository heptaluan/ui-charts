/*
 * @Description: 新建项目弹窗
 */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ActionPosition } from '../../../share/modal/modal.component'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import * as ProjectActions from '../../../states/actions/project.action'
import * as ProjectModels from '../../../states/models/project.model'
import { Subscription } from 'rxjs'
import { skip } from 'rxjs/operators'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { UpgradeMemberComponent } from '../upgrade-member/upgrade-member.component'

@Component({
  selector: 'lx-initialize-project',
  templateUrl: './initialize-project.component.html',
  styleUrls: ['./initialize-project.component.scss'],
})
export class InitializeProjectComponent implements OnInit, OnDestroy {
  actionPosition: ActionPosition = 'center'
  fromTemplate: string = null
  fromType: string
  isVip: boolean = false
  chart: string
  initialState

  projectForm: FormGroup
  mySubscripyion = new Subscription()

  constructor(
    private _router: Router,
    private _store: Store<fromRoot.State>,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    this.projectForm = new FormGroup({
      privilege: new FormControl('public'),
      projectName: new FormControl('', Validators.maxLength(20)),
    })
  }

  ngOnInit() {
    this.initialState = this.modalService.config.initialState
  }

  ngOnDestroy(): void {
    this.mySubscripyion.unsubscribe()
  }

  // 返回 project_id 用作路由跳转
  createProject() {
    if (this.projectForm.valid) {
      let templateId
      if (this.initialState.fromType === 'chart') {
        templateId = '0'
      } else {
        templateId = this.fromTemplate
      }
      const formValue = this.projectForm.value
      const payload: ProjectModels.CreateProjectInfo = {
        title: formValue.projectName,
        description: '',
        type: this.fromType,
        templateId: templateId,
        public: formValue.privilege === 'private' ? false : true,
      }
      this._store.dispatch(new ProjectActions.CreateProjectAction(payload))
      this.mySubscripyion.add(
        this._store
          .select(fromRoot.getCurrentProject)
          .pipe(skip(1))
          .subscribe((project) => {
            this.bsModalRef.hide()
            this._router.navigate(['pages', 'workspace'], { queryParams: { project: project.id, type: this.fromType } })
          })
      )
    } else {
      return false
    }
  }

  upgrade(evt) {
    evt.preventDefault()
    evt.stopPropagation()
    this.bsModalRef.hide()
    this.modalService.show(UpgradeMemberComponent, {
      initialState: {
        chaeckType: 0,
        vipIds: ['11'],
        svipIds: ['11'],
      },
    })
  }
}
