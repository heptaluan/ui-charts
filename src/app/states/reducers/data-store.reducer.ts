/*
 * @Description: data store reducer
 */

import * as DataStoreActions from '../actions/data-store.action';
import * as _ from 'lodash';

export interface State {
  dataStoreList: any
}

export const initialState: State = {
  dataStoreList: []
};

export function reducer(state = initialState, action: DataStoreActions.Actions): State {
  switch (action.type) {
    case DataStoreActions.GET_DATA_STORE_LIST_SUCCESS: {
      const newDataStoreList = action.payload;
      return Object.assign({}, state, {
        dataStoreList: newDataStoreList
      });
    }
    default:
      return state;
  }
}

export const getDataStoreList = (state: State) => state.dataStoreList;



