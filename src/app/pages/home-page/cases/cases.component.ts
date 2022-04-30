import { Component, OnInit, OnDestroy } from '@angular/core'
import { Store } from '@ngrx/store'
import * as CaseActions from '../../../states/actions/project-case.action'
import * as fromRoot from '../../../states/reducers'
import { Subscription } from 'rxjs'
import { take } from 'rxjs/operators'
import * as ProjectActions from '../../../states/actions/project.action'

@Component({
  selector: 'lx-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss'],
})
export class CasesComponent implements OnInit, OnDestroy {
  initSearch: string = ''
  mySubscription = new Subscription()

  constructor(private _store: Store<fromRoot.State>) {
    this._store.dispatch(new ProjectActions.GetProjectListAction())
    this.mySubscription.add(this._store.select(fromRoot.getProjectList).subscribe()).add(
      this._store
        .select(fromRoot.getProjectCaseSearch)
        .pipe(take(1))
        .subscribe((search) => (this.initSearch = search))
    )
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe()
  }

  search(evt) {
    this._store.dispatch(new CaseActions.SetProjectCaseSearchAction(evt))
  }
}
