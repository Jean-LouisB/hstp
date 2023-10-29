import { createReducer, on } from "@ngrx/store";
import { toggleConnected, setUser, setListOfAllUsers, changeOneUser} from "./session.actions";
import { User } from "src/app/models/userModel";



export interface SessionState {
    isConnected: boolean;
    userState: { user: User | null };
    listOfAllUsers : Array<User> | null;
}

export const initialState: SessionState = {
    isConnected: false,
    userState: null,
    listOfAllUsers: []
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
    })),
    on(setListOfAllUsers,(state, {listOfAllUsers})=>({
        ...state,
        listOfAllUsers: listOfAllUsers
    })),
    on(changeOneUser,(state,{user})=>({
        ...state,
        listOfAllUsers:[...state.listOfAllUsers].map((u)=>{
            if(u.id === user.id){
                return user
            }
            return u
        })

    }))
);

