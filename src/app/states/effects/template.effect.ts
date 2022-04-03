/*
 * @Description: 模板effect
 */

import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

import * as TemplateActions from '../actions/template.action';
import { TemplateService } from '../services/template.service';

@Injectable()
export class TemplateEffect {

  @Effect()
  getProjectTemplateList$: Observable<Action> = this._actions$.pipe(
    ofType(TemplateActions.GET_PROJECT_TEMPLATE_LIST),
    switchMap((data: TemplateActions.GetProjectTemplateListAction) => this._service.getProjectTemplateList(data.payload).pipe(
      map(res => new TemplateActions.GetProjectTemplateListSuccessAction(data.payload.type, res.templates)),
      catchError(err => {
        return of({ type: TemplateActions.GET_PROJECT_TEMPLATE_LIST_FAIL });
      })
    )
    )
  );

  @Effect()
  getChartTemplateList$: Observable<Action> = this._actions$.pipe(
    ofType(TemplateActions.GET_CHART_TEMPLATE_LIST),
    switchMap(() => this._service.getChartTemplateList()
      .map(res => new TemplateActions.GetChartTemplateListSuccessAction(res)))
  )

  constructor(private _service: TemplateService, private _actions$: Actions) { }
}
