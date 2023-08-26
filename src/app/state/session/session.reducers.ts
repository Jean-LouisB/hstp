import { createReducer, on } from "@ngrx/store";
import { userConnected } from "./session.actions";

const initialState = false;


export const sessionReducer = createReducer(
    initialState,
    on(userConnected,(state)=> state = true)
    )