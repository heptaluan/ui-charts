/*
 * @Description: 案列筛选条件
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import { Subscription } from 'rxjs'

@Component({
  selector: 'lx-cases-filter',
  templateUrl: './cases-filter.component.html',
  styleUrls: ['./cases-filter.component.scss'],
})
export class CasesFilterComponent implements OnInit {
  classify = 'shape'
  sortType = 'choice'
  @Output('sortChange') sortChange = new EventEmitter()
  mySubscription = new Subscription()

  constructor(private _store: Store<fromRoot.State>) {
    this.mySubscription.add(
      this._store.select(fromRoot.getProjectCaseSortType).subscribe((type) => {
        this.sortType = type
      })
    )
  }

  ngOnInit() {}

  onTabChanged(tab) {
    if (tab.tabTitle === '功能分类') {
      this.classify = 'utility'
    } else if (tab.tabTitle === '图表分类') {
      this.classify = 'shape'
    } else {
      this.classify = 'shape'
    }
  }

  sort(evt) {
    this.sortType = evt
    this.sortChange.emit(evt)
  }
}
