import { configureStore } from "@reduxjs/toolkit";
import alertsReducer from '../reducers/alertsSlice.tsx'

const store = configureStore({
    reducer: {
        alerts: alertsReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export default store