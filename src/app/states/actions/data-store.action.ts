/*
 * @Description: data store actions
 */

import { Action } from '@ngrx/store';

export const GET_DATA_STORE_LIST = '[DataStore] Get Data Store List';
export const GET_DATA_STORE_LIST_SUCCESS = '[DataStore] Get Data Store List Success';

export class GetDataStoreListAction implements Action {
  readonly type = GET_DATA_STORE_LIST;
  constructor(public payload) { }
}

export class GetDataStoreListSuccessAction implements Action {
  readonly type = GET_DATA_STORE_LIST_SUCCESS;
  constructor(public payload) { }
}

export type Actions
  = GetDataStoreListAction
  | GetDataStoreListSuccessAction;
