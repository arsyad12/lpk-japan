//combine reducer untuk memecah reducer
//configure store untuk config default store di local storage
import { combineReducers, configureStore } from "@reduxjs/toolkit";
//import redux persistore untuk nyimpan data ke local storage
//persist reducer untuk nampung configurasi dan data redux
import { persistStore, persistReducer } from "redux-persist";
// koneksi ke defaults to localStorage for web
import storage from "redux-persist/lib/storage";
//import data list state movie dari slice/movie.js ke store
import detailToSlices from "./slices/detailTryout";

//combine reducer untuk memecah reducer
const reducers = combineReducers({
  detailTO: detailToSlices,
});

//persist config untuk ngatur configurasi persistor di localstorage
const persistConfig = {
  key: "root",
  storage,
};

//persist untuk nampung configurasi dan data redux
const persist = persistReducer(persistConfig, reducers);

//export store yang configurasi nya diisi pake data dari persist
export const store = configureStore({
  reducer: persist,
});

//export persistor yang data nya diambil dari store
//dan disimpan ke local storage
export let persistor = persistStore(store);
