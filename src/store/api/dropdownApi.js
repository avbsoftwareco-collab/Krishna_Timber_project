import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dropdownApi = createApi({
  reducerPath: "dropdownApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  keepUnusedDataFor: 600, // 10 min cache
  refetchOnFocus: false,
  refetchOnReconnect: false,
  refetchOnMountOrArgChange: false,
  tagTypes: ["Dropdown"],

  endpoints: (builder) => ({
    getDropdownData: builder.query({
      query: () => "/dropdown-data",
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