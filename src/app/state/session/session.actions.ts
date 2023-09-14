import { createAction, props } from "@ngrx/store";
import { User } from "src/app/models/userModel";


export const toggleConnected = createAction('[App Component] toggleIsConnected');
export const setUser = createAction('[Accueil] setUser', props<{user: User}>());


