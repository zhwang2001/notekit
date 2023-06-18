import { configureStore } from "@reduxjs/toolkit";
import alertsReducer from '../reducers/alertsSlice.tsx'

export default configureStore({
    reducer: {
        alerts: alertsReducer,
    }
})