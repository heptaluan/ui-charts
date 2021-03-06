import { ActionReducer, Action } from '@ngrx/store'

export type UndoActions = { type: 'UNDO_STATE' } | { type: 'REDO_STATE' }
export const undoRedo =
  (config?: Config) =>
  <T>(reducer: ActionReducer<T>) =>
    undoReducer(reducer, config)
export const undoReducer = <T>(reducer: ActionReducer<T>, config: Config = {}): ActionReducer<T> => {
  const allowedActions = config.allowedActions,
    maxBufferSize = config.maxBufferSize || 10,
    undoActionType = config.undoActionType,
    redoActionType = config.redoActionType

  let undoState: UndoState<T> = {
    past: [],
    present: reducer(undefined, {} as Action),
    future: [],
    changes: 0,
  }

  return (state, action) => {
    let nextState: T
    switch (action.type) {
      case undoActionType: {
        nextState = undoState.past[0]
        if (!nextState) {
          return state
        }
        undoState = {
          past: [...undoState.past.slice(1)],
          present: undoState.past[0],
          future: [undoState.present, ...undoState.future],
          changes: undoState.changes,
        }
        return nextState
      }
      case redoActionType: {
        nextState = undoState.future[0]
        if (!nextState) {
          return state
        }
        undoState = {
          past: [undoState.present, ...undoState.past],
          present: nextState,
          future: [...undoState.future.slice(1)],
          changes: undoState.changes,
        }
        return nextState
      }
    }

    nextState = reducer(state, action)
    if (!config.allowedActions || (allowedActions && allowedActions.some((a) => a.type === action.type))) {
      const nextChanged = undoState.changes + 1
      undoState = {
        past: [undoState.present, ...undoState.past.slice(0, maxBufferSize - 1)],
        present: nextState,
        future: [...undoState.future.slice(0, maxBufferSize - 1)],
        changes: nextChanged,
      }
    }
    return nextState
  }
}

export interface UndoState<T> {
  past: T[]
  present: T
  future: T[]
  changes: number
}

export interface Config {
  maxBufferSize?: number
  allowedActions?: Action[]
  undoActionType?: string
  redoActionType?: string
}
