/*
 * @Description: v1.0 chart effect
 */


import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import * as ChartActions from '../actions/chart.action';
import { ChartService } from '../services/chart.service';

@Injectable()
export class ChartEffect {

  @Effect()
  getChart$: Observable<Action> = this._actions$.pipe(
    ofType(ChartActions.GET_CHART),
    switchMap((data: ChartActions.GetChartAction) => this._service.getChart(data.payload)
      .map(res => new ChartActions.GetChartSuccessAction(res)))
  );

  constructor(private _service: ChartService, private _actions$: Actions) { }
}
