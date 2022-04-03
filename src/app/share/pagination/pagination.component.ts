import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../states/reducers';
// import { ChangeCurrentPageNumAction } from '../../states/actions/favorite-case.action';

@Component({
  selector: 'lx-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() totalItems: number;
  @Input() currentPage: number;
  itemsPerPage: number = 10;

  constructor(private _store: Store<fromRoot.State>) {

  }

  ngOnInit() {
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    // this._store.dispatch(new ChangeCurrentPageNumAction(this.currentPage));
  }
}
