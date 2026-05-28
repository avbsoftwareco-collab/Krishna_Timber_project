// store/dropdownApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dropdownApi = createApi({
  reducerPath: "dropdownApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    // ✅ Har request mein cache disable headers
    prepareHeaders: (headers) => {
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      headers.set('Pragma', 'no-cache');
      return headers;
    },
  }),

  // ✅ Cache disable
  keepUnusedDataFor: 0,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,

  tagTypes: ["Dropdown"],

  endpoints: (builder) => ({
    getDropdownData: builder.query({
      query: () => ({
        url: "/dropdown-data",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Dropdown"],
    }),

    addDropdownProduct: builder.mutation({
      query: (body) => ({
        url: "/dropdown-data",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dropdown"],
    }),
  }),
});

export const {
  useGetDropdownDataQuery,
  useAddDropdownProductMutation,
} = dropdownApi;