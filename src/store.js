import { configureStore } from "@reduxjs/toolkit";
import { AuthApi } from "./features/auth/AuthSlice";
import { requirementApi } from "./features/purchase/requirement/requirementSlice";
import {indentApi} from "./features/purchase/Indent/indentSlice"
import {materialApi} from "./features/purchase/Material/materialSlice"
import {inventoryApi} from "./features/inventory/inventorySlice"



export const store = configureStore({
  reducer: {
    [AuthApi.reducerPath]: AuthApi.reducer,
    [requirementApi.reducerPath]: requirementApi.reducer,
    [indentApi.reducerPath]: indentApi.reducer,
    [materialApi.reducerPath]: materialApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,


  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(AuthApi.middleware)
  .concat(requirementApi.middleware)
  .concat(indentApi.middleware)
  .concat(materialApi.middleware)
  .concat(inventoryApi.middleware)

});