import { configureStore } from "@reduxjs/toolkit";
import alertsReducer from '../reducers/alertsSlice.tsx'

const store = configureStore({
    reducer: {
        alerts: alertsReducer,
    }
})
export default store