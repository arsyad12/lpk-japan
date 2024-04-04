import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { Google } from "@/pages/auth";
import { ProtectedRoute, GuestRoute } from "@/configs";

//create router brwoser untuk membuat root setiap page
//router provider untuk mengirim data dari provider ke semua page
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//import store redux dari store js {store seperti gudang}
//import persistor untuk nymimpan data store ke localstorage
import { store, persistor } from "./store";
//PersistGate untuk menunda rendering UI aplikasi
//sampe integrasi data API selesai dan disimpan ke redux.
import { PersistGate } from "redux-persist/integration/react";
//import provider  dari react redux sebagai penyedia data
import { Provider } from "react-redux";

function App() {

  return (
    <> {/* jadi provider menyediakan data dari store */}
      <Provider store={store}>
        {/* kemudian persist gate bakal integrasi data store ke localstorage */}
        <PersistGate loading={null} persistor={persistor}>
          {/* dan akhirnya semua data di distribusi ke semua page */}
          <Routes>
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <Dashboard />
                {/* <Dashboard>
                <Route path="/mytryout/2" element={<Paket />} />
                <Route path="/mytryout/1" element={<Paket />} />
            </Dashboard> */}
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard/mytryout" replace />} />
            <Route path="/auth/*" element={
              <GuestRoute>
                <Auth />
              </GuestRoute>
            } />
            <Route path="/api/auth/google/callback/*" element={<GuestRoute><Google /></GuestRoute>} />
          </Routes>
        </PersistGate>
      </Provider>
    </>
  )
}

export default App;
