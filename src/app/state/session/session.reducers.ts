import { createReducer, on } from "@ngrx/store";
import { toggleConnected } from "./session.actions";


export const initialState = {
    isConnected: false,
}

export const sessionReducer = createReducer(
    initialState,
    on(toggleConnected, (state) => ({
        ...state,
        isConnected: !state.isConnected
    })),
);

