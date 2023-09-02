import { createAction, props } from "@ngrx/store";
import { User } from "src/app/models/userModel";

export const dataUserConnected = createAction('[Login] dataUser',
    props<{user: User }>()
    );

