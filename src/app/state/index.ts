import * as formSession from './session/session.reducers';


export interface AppState{
    session : boolean;
}

export const reducers = {
    session: formSession.sessionReducer
  }