import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const indentApi = createApi({
  reducerPath: "indentApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),

  tagTypes: ["IndentData", "IndentList"],

  endpoints: (builder) => ({

    // 1. GET - Fetch all Purchase_FMS data (indent list)
    getIndentData: builder.query({
      query: () => "/api/purchase/PO",
      providesTags: ["IndentList"],
      transformResponse: (response) => {
        if (response.success) {
          return {
            data: response.data || [],
            headers: response.headers || [],
            totalRecords: response.totalRecords || 0,
            message: response.message,
          };
        }
        return {
          data: [],
          headers: [],
          totalRecords: 0,
          message: response.message || "No data found",
        };
      },
    }),

    // 2. POST - Create indent (Update status + Generate PDF + Upload to Drive)
    createIndent: builder.mutation({
      query: (indentData) => ({
        url: "/api/purchase/PO",
        method: "POST",
        body: indentData,
      }),
      invalidatesTags: ["IndentList"],
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            pdfUrl: response.pdfUrl,
            indentNumber: response.indentNumber,
            message: response.message,
          };
        }
        return {
          success: false,
          error: response.error,
          details: response.details,
        };
      },
    }),

  }),
});

// Export auto-generated hooks
export const {
  useGetIndentDataQuery,
  useCreateIndentMutation,
} = indentApi;