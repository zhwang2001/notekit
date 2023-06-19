import { createSlice } from "@reduxjs/toolkit";
import store from "../store";

const initialState = {
    alert: []
}

const alertsSlice = createSlice({
    name: "alerts",
    initialState,
    reducers: {
        //action to set the alert, payload is array containing [title, message, severity]
        setAlert: (state, action): void => {
            state.alert = action.payload
        }
    },
    /*
    extraReducers(builder) {
        builder.addCase(fetchProfile.fulfilled, (state, action) => {
            return action.payload
        })
    },
    */
})

export type RootState = ReturnType<typeof store.getState>
export const { setAlert } = alertsSlice.actions
export default alertsSlice.reducer