import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice"
import jobSlice from "./jobSlice"
import companySlice from "./companySlice"
import applicationSlice from "./applicationSlice"
import {
    persistStore,
    persistReducer,
    FLUSH,
    PAUSE,
    REHYDRATE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import { getDefaultConfig } from "tailwind-merge";

const persistConfig = {
    key : "root",
    version : 1,
    storage
}

const rootReducer = combineReducers({
    auth : authSlice,
    job : jobSlice,
    company : companySlice,
    application : applicationSlice
})
const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer : persistedReducer,
    middleware : (getDefaultMiddlware) => getDefaultMiddlware({
        serializableCheck : {
            ignoreActions : [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
})

export default store;