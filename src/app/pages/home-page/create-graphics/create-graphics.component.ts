import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { CaseType } from '../generate-case/generate-case.component'
import { ActivatedRoute } from '@angular/router'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { BsModalService } from 'ngx-bootstrap/modal'
import {
  InitializeProjectComponent,
  ProjectSizeLimitComponent,
  UpgradeMemberComponent,
} from '../../../components/modals'

import { Store } from '@ngrx/store'
import * as TemplateModels from '../../../states/models/template.model'
import * as TemplateActions from '../../../states/actions/template.action'
import * as CaseActions from '../../../states/actions/project-case.action'
import * as fromRoot from '../../../states/reducers'
import { Subscription, Observable } from 'rxjs'
import { VipService } from '../../../share/services/vip.service'
import { take } from 'rxjs/operators'

@Component({
  selector: 'lx-create-graphics',
  templateUrl: './create-graphics.component.html',
  styleUrls: ['./create-graphics.component.scss'],
})
export class CreateGraphicsComponent implements OnInit, OnDestroy {
  limited: boolean = true
  type: CaseType
  templates$: Observable<TemplateModels.ProjectTemplate[]>
  initSearch: string = ''
  mySubscription = new Subscription()

  constructor(
    private _store: Store<fromRoot.State>,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private _vipService: VipService
  ) {
    switch (route.snapshot.data.type) {
      case 'charts':
        this.type = {
          title: '多图',
          tag: 'charts',
          picture: 'http://placehold.it/96x122',
        }
        break
      case 'infographic':
        this.type = {
          title: '信息图',
          tag: 'infographic',
          picture: '/dyassets/images/news.png',
        }
        break
      case 'chart':
        this.type = {
          title: '单图',
          tag: 'chart',
          picture: 'http://placehold.it/92x92',
        }
        break
      default:
        this.type = {
          title: '信息图',
          tag: 'infographic',
          picture: 'http://placehold.it/96x122',
        }
        break
    }
    this.templates$ = this._store.select(fromRoot.getProjectTemplateCurrentTypeList)
    this.mySubscription
      .add(
        this._store.select(fromRoot.getProjectList).subscribe((list) => {
          if (this._vipService.isVip()) {
            this.limited = list.length >= 50
          } else {
            this.limited = list.length >= 10
          }
        })
      )
      .add(
        this._store
          .select(fromRoot.getProjectCaseSearch)
          .pipe(take(1))
          .subscribe((search) => (this.initSearch = search))
      )
  }

  ngOnInit() {
    this._store.dispatch(new TemplateActions.SetProjectCurrentTemplateTypeAction(this.type.tag))
    this.mySubscription.add(
      this.templates$.subscribe((templates) => {
        if (templates.length === 0) {
          this._store.dispatch(new TemplateActions.GetProjectTemplateListAction({ type: this.type.tag }))
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe()
  }

  initializeProject(fromTemplate?: number) {
    if (!this.limited) {
      this.modalService.show(InitializeProjectComponent, {
        initialState: {
          fromTemplate: fromTemplate ? fromTemplate : 0,
          fromType: this.type.tag,
          isVip: this._vipService.isVip(),
        },
      })
    } else {
      if (this._vipService.isVip()) {
        this.modalService.show(ProjectSizeLimitComponent)
      } else {
        this.modalService.show(UpgradeMemberComponent)
      }
    }
  }

  search(evt) {
    this._store.dispatch(new CaseActions.SetProjectCaseSearchAction(evt))
  }
}
