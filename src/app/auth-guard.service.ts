import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild, CanLoad
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError, map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromRoot from './states/reducers';
import { API } from './states/api.service';
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private _router: Router, 
    private _store: Store<fromRoot.State>, 
    private _api: API
    ) {
  }

  canActivate(): Observable<boolean> | boolean {
    return this._store.select(fromRoot.getUserInfo).
      map(user => {
        if (user) {
          return true;
        } else {
          location.href = `${this._api.getOldUrl()}/vis/auth/logout`;
          return false;
        }
      });
  }

  canActivateChild(): Observable<boolean> | boolean {
    return this._store.select(fromRoot.getUserInfo).
      map(user => {
        if (user) {
          return true;
        } else {
          location.href = `${this._api.getOldUrl()}/vis/auth/logout`;
          return false;
        }
      });
  }

  canLoad(): Observable<boolean> | boolean {
    return this._store.select(fromRoot.getUserInfo).pipe(
      map(user => {
        if (user) {
          return true;
        } else {
          location.href = `${this._api.getOldUrl()}/vis/auth/logout`;
          return false;
        }
      }), take(1));
  }
}
