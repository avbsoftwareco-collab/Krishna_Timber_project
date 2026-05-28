import { configureStore } from "@reduxjs/toolkit";
import { dropdownApi } from "./api/dropdownApi";

export const store = configureStore({
  reducer: {
    [dropdownApi.reducerPath]: dropdownApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dropdownApi.middleware),
});