import * as formSession from './session/session.reducers';
import { User } from '../models/userModel';

export interface AppState{
    session: {
        userConnected: User;
    };
}

export const reducers = {
    session: formSession.sessionReducer
  }