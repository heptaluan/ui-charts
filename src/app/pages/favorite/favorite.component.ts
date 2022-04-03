/*
 * @Description: 我的喜欢页面
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromRoot from '../../states/reducers';
import * as CaseActions from '../../states/actions/favorite-case.action';
import * as CaseModels from '../../states/models/case.model';
import { FavoriteService } from './favorite.service';

@Component({
  selector: 'lx-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit, OnDestroy {

  selectedType = 'infographic';
  currentPageNum$: Observable<Number>;
  mysubscription = new Subscription();

  constructor(private _store: Store<fromRoot.State>, private favoriteService: FavoriteService) {
    // this._store.dispatch(new CaseActions.GetFavoriteCaseListAction({
    //   type: this.selectedType,
    //   step: 10,
    //   pagenum: 1
    // }));

    favoriteService.setType(this.selectedType);

    // this.currentPageNum$ = this._store.select(fromRoot.getFavoriteCaseCurrentPageNum);
  }

  ngOnInit() {
    // this.mysubscription = this.currentPageNum$.subscribe(data => {
    //   this._store.dispatch(new CaseActions.GetFavoriteCaseListAction({
    //     type: this.selectedType,
    //     step: 10,
    //     pagenum: data
    //   }));
    // });
  }

  selectType(e) {
    this.selectedType = e.target.getAttribute('name');
    this.favoriteService.setType(this.selectedType);

    this._store.dispatch(new CaseActions.GetFavoriteCaseListAction({
      type: this.selectedType,
      step: 10,
      pagenum: 1
    }));
  }

  ngOnDestroy() {
    this.mysubscription.unsubscribe();
  }

  childChange(e) {
  }
}
