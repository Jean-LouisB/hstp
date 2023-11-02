import { createSelector } from '@ngrx/store';
import { SessionState } from './session.reducers';
import { User } from 'src/app/models/userModel';

export const listOfAllUsers = createSelector(
  (state: SessionState) => state.listOfAllUsers,
  (listOfAllUsers: Array<User> | null) => listOfAllUsers
);

