import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SessionState } from './session.reducers';


export const selectSessionFeature = createFeatureSelector<SessionState>('session');

/* export const listOfAllUsers = createSelector(
  (state: SessionState) => state.listOfAllUsers,
  (listOfAllUsers: Array<User> | null) => listOfAllUsers
); */
export const listOfAllUsers = createSelector(
  selectSessionFeature,
  (session) => session.listOfAllUsers
);


/* export const getBornes = createSelector(
  (state: SessionState) => state.bornes,
  (bornes: Array<Date> | null) => bornes
); */
export const getBornes = createSelector(
  selectSessionFeature,
  (session) => session.bornes
)
