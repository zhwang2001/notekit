import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    alert: []
}

const alertsSlice = createSlice({
    name: "alerts",
    initialState,
    reducers: {
        //action to set the alert, payload is array containing [title, message, severity]
        setAlert: (state, action) => {
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

export const { setAlert } = alertsSlice.actions
export default alertsSlice.reducer

//global state for managing pushed alerts
//store in an array
//push new alerts to array

//setAlert([title, message, severity ])