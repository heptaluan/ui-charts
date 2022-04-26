import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core'
import { Subscription, Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { Router } from '@angular/router'

// import { CasedetailComponent } from '../casedetail/casedetail.component';
import { CaseItem } from '../../../share/case-item/case-item.component'
import * as fromRoot from '../../../states/reducers'
import * as CaseModels from '../../../states/models/case.model'

@Component({
  selector: 'lx-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  caselist: CaseItem[] = []
  caselist$: Observable<CaseModels.CaseList>
  mySubscription = new Subscription()
  totalItems: number
  currentPage: number
  @Output() change = new EventEmitter<any>()

  constructor(private _store: Store<fromRoot.State>, private _router: Router) {
    this.caselist$ = this._store.select(fromRoot.getFavoriteCaseList)
  }

  ngOnInit() {
    this.mySubscription = this.caselist$.subscribe((data) => {
      this.caselist = data.list
      this.totalItems = data.total
      this.currentPage = data.pagenum
    })
    this.change.emit(this.caselist)
  }

  getCaseDetail(caseId) {
    this._router.navigate(['pages', 'case'], { queryParams: { case: caseId } })
  }

  ngOnDestroy() {
    this.mySubscription.unsubscribe()
  }
}
