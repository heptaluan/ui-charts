/*
 * @Description: Modify Here
 */

import * as UserModels from '../models/user.model';
import * as UserActions from '../actions/user.action';

export interface SubState {
  info: UserModels.UserInfo | undefined;
  bill: UserModels.UserBill | undefined;
}

export const initialState: SubState = {
  info: undefined,
  bill: undefined,
};

export function reducer(state = initialState, action: UserActions.Actions): SubState {
  switch (action.type) {
    case UserActions.GET_USER_INFO_SUCCESS: {
      return Object.assign({}, state, {
        info: action.payload
      });
    }
    case UserActions.SET_USER_INFO_SUCCESS: {
      return Object.assign({}, state, {
        info: action.payload
      });
    }
    case UserActions.GET_USER_BILL_SUCCESS: {
      return Object.assign({}, state, {
        bill: action.payload
      });
    }
    default:
      return state;
  }
}

export const getUserInfo = (state: SubState) => state.info;
export const getUserBill = (state: SubState) => state.bill;

