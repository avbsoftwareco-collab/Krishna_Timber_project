

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const materialApi = createApi({
  reducerPath: "materialApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),

  tagTypes: ["MaterialData", "MaterialReceipts"],

  endpoints: (builder) => ({

    // 1. GET Material data with filters (supplierName, supplierFirm)
    getMaterialData: builder.query({
      query: ({ supplierName = "", supplierFirm = "" } = {}) => {
        const params = new URLSearchParams();
        if (supplierName) params.set("supplierName", supplierName);
        if (supplierFirm) params.set("supplierFirm", supplierFirm);
        const queryString = params.toString();
        return queryString
          ? `/api/purchase/Material?${queryString}`
          : `/api/purchase/Material`;
      },
      providesTags: ["MaterialData"],
    }),

    // 2. POST Save material receipt with challan photo
    saveMaterialReceipt: builder.mutation({
      query: (receiptData) => ({
        url: "/api/purchase/Material",
        method: "POST",
        body: receiptData,
      }),
      invalidatesTags: ["MaterialData", "MaterialReceipts"],
    }),

  }),
});

// Export auto-generated hooks
export const {
  useGetMaterialDataQuery,
  useLazyGetMaterialDataQuery,
  useSaveMaterialReceiptMutation,
} = materialApi;