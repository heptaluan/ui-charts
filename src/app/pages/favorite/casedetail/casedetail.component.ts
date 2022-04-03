import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { CaseDetail } from '../../../states/models/case.model';
import * as fromRoot from '../../../states/reducers';
// import { GetFavoriteCaseDetailAction, PostLikeCaseAction } from '../../../states/actions/favorite-case.action';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lx-casedetail',
  templateUrl: './casedetail.component.html',
  styleUrls: ['./casedetail.component.scss']
})
export class CasedetailComponent implements OnInit, OnDestroy {

  caseDetail: CaseDetail;
  caseDetail$: Observable<CaseDetail>;
  mysubscription = new Subscription();

  constructor( private _store: Store<fromRoot.State>, private route: ActivatedRoute ) {
    // this.caseDetail$ = this._store.select(fromRoot.getFavoriteCaseDetail);
  }

  ngOnInit() {
    this.mysubscription = this.caseDetail$.subscribe(data => {
      if (data) {
        this.caseDetail = data;
      }
    });
    // this._store.dispatch(new GetFavoriteCaseDetailAction({
    //   type: this.route.snapshot.queryParams.type,
    //   caseid: this.route.snapshot.queryParams.id
    // }));
  }

  ilike(e, islike: number) {
    // this._store.dispatch(new PostLikeCaseAction({
    //   type: this.route.snapshot.queryParams.type,
    //   caseid: this.route.snapshot.queryParams.id,
    //   islike: islike
    // }));
  }

  ngOnDestroy() {
    this.mysubscription.unsubscribe();
  }
}
