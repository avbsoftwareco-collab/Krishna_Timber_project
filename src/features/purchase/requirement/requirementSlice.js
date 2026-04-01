
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const requirementApi = createApi({
  reducerPath: "requirementApi",
  baseQuery: fetchBaseQuery({
    baseUrl,

  }),

  tagTypes: ["DropdownData","PurchaseRequests"],

  endpoints: (builder) => ({

    // 1. GET Dropdown data (material names, types, vendors, auto-fill, etc)
    getDropdownData: builder.query({
      query: ({ materialName = "", materialType = "" } = {}) => {
        const params = new URLSearchParams();
        if (materialName) params.set("materialName", materialName);
        if (materialType) params.set("materialType", materialType);
        return `/api/purchase/requirement/dropdown?${params.toString()}`;
      },
      providesTags: ["DropdownData"],
    }),

    // 2. POST Create new purchase / material requirement
    createPurchaseRequest: builder.mutation({
      query: (formData) => ({
        url: "/api/purchase/requirement",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["PurchaseRequests"],
      // Optional: you can also invalidate DropdownData if needed
      // invalidatesTags: ["PurchaseRequests", "DropdownData"],
    }),

  }),
});

// Export auto-generated hooks
export const {
  useGetDropdownDataQuery,
  useCreatePurchaseRequestMutation,
} = requirementApi;