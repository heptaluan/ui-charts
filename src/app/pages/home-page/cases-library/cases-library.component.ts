/*
 * @Description: 案例列表
 */
import { Component, OnInit, OnDestroy } from '@angular/core'
import * as fromRoot from '../../../states/reducers'
import * as CaseActions from '../../../states/actions/project-case.action'
import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs'
import { combineLatest } from 'rxjs/operators'
import { Router, NavigationStart } from '@angular/router'
import { HttpService } from '../../../states/services'

@Component({
  selector: 'lx-cases-library',
  templateUrl: './cases-library.component.html',
  styleUrls: ['./cases-library.component.scss'],
})
export class CasesLibraryComponent implements OnInit, OnDestroy {
  cases: any[] = []
  currentPage = 1
  total = 0
  search: string
  pageSize = 25
  sort: 'hot' | 'time' | 'choice'
  mySubscription = new Subscription()

  constructor(private _store: Store<fromRoot.State>, private _router: Router, private _http: HttpService) {
    this.mySubscription
      .add(
        this._store.select(fromRoot.getProjectCaseList).subscribe((list) => {
          this.cases = list
        })
      )
      .add(
        this._store
          .select(fromRoot.getProjectCaseSortType)
          .pipe(
            combineLatest(
              this._store.select(fromRoot.getProjectCaseCurrentPageNum),
              this._store.select(fromRoot.getProjectCaseSearch)
            )
          )
          .subscribe((data) => {
            this.sort = data[0]
            this.currentPage = data[1]
            this.search = data[2]
            this._store.dispatch(
              new CaseActions.GetProjectCaseListAction({
                page_num: this.currentPage,
                page_size: this.pageSize,
                sort: this.sort,
                search: this.search || '',
              })
            )
          })
      )
      .add(
        this._store.select(fromRoot.getProjectCaseTotal).subscribe((total) => {
          this.total = total
        })
      )
  }

  ngOnInit() {
    this.mySubscription.add(
      this._router.events
        .filter((event) => event instanceof NavigationStart)
        .subscribe((route: NavigationStart) => {
          if (!route.url.includes('/case?')) {
            this._store.dispatch(new CaseActions.ResetCaseListAction())
          }
        })
    )
    let url = 'https://dydata.io/vis/dychart/cases/chosen'
    this._http.get(url, { withCredentials: true }).subscribe((data) => {
      this.cases = data
    })
  }

  onPageChanged(evt) {
    this.currentPage = evt.page
    this._store.dispatch(new CaseActions.SetProjectCaseCurrentPageAction(this.currentPage))
  }

  onSortChange(evt) {
    this.sort = evt
    this._store.dispatch(new CaseActions.SetProjectCaseSortTypeAction(this.sort))
    this._store.dispatch(new CaseActions.SetProjectCaseCurrentPageAction(1))
  }

  getCaseDetail(caseId) {
    this._router.navigate(['pages', 'case'], { queryParams: { case: caseId } })
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe()
  }
}
