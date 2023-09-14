import { createReducer, on } from "@ngrx/store";
import { toggleConnected, setUser} from "./session.actions";
import { User } from "src/app/models/userModel";


export interface SessionState {
    isConnected: boolean;
    userState: { user: User | null };
}

export const initialState: SessionState = {
    isConnected: false,
    userState: null,
}

export const sessionReducer = createReducer(
    initialState,
    on(toggleConnected, (state) => ({
        ...state,
        isConnected: !state.isConnected
    })),
    on(setUser, (state, { user }) => ({
        ...state,
        userState: {user : user},
    }))
);

