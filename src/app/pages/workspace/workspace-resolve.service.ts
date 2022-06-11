import { Injectable } from '@angular/core'
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router'
import { Observable } from 'rxjs'
import { ProjectInfo } from '../../states/models/project.model'
import { GetProjectInfoAction } from '../../states/actions/project.action'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../states/reducers'
import { take, filter, tap } from 'rxjs/operators'

@Injectable()
export class WorkspaceResolveService implements Resolve<ProjectInfo> {
  constructor(private router: Router, private store: Store<fromRoot.State>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProjectInfo> {
    this.store.dispatch(new GetProjectInfoAction(route.queryParams.project, route.queryParams.type))
    return this.store.select(fromRoot.getCurrentProjectFull).pipe(
      filter((data) => !!data),
      take(1)
    )
  }
}
