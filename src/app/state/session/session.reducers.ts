import { createReducer, on } from "@ngrx/store";
import { dataUserConnected } from "./session.actions";
import { User } from "src/app/models/userModel";
import { AppState } from "..";

const intiUser = new User();
const initialState: AppState = {
    session: {
        userConnected: intiUser 
    }
}

export const sessionReducer = createReducer(
    initialState,
    on(dataUserConnected, (state, {user}) => ({
        ...state,
        session: {
            ...state.session,
            userConnected: user
        }
    }))
);
