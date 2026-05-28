"use client";

import { Provider } from "react-redux";
import { useEffect } from "react";
import { store } from "../store/store";
import { dropdownApi } from "../store/api/dropdownApi";

function PrefetchDropdown() {
  useEffect(() => {
    store.dispatch(dropdownApi.endpoints.getDropdownData.initiate());
  }, []);

  return null;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <PrefetchDropdown />
      {children}
    </Provider>
  );
}