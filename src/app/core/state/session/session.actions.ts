import { createAction, props } from "@ngrx/store";
import { User } from "src/app/core/models/userModel";


export const toggleConnected = createAction('[App Component] toggleIsConnected');
export const setUser = createAction('[Accueil] setUser', props<{user: User}>());
export const setListOfAllUsers = createAction('[Login] setListOfAllUsers', props<{listOfAllUsers: Array<User>}>());
export const changeOneUser = createAction('[Card-user] change user', props<{user: User}>());
export const togglePresence = createAction('[Card-user] toggle presence', props<{id: string, presence : boolean}>())
export const setBornes = createAction('[Changement de semaine] setBornes',props<{bornes: Date[]}>())