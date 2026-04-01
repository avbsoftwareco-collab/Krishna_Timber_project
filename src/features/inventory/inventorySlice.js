import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const inventoryApi = createApi({
  reducerPath: "inventoryApi", // RTK mein isko API bolte hain standard practice ke liye
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),

  // Caching ke liye tags
  tagTypes: ["InventoryData", "InventoryList"],

  endpoints: (builder) => ({

    // 1. GET - Fetch all Inventory data from Google Sheets
    getInventoryData: builder.query({
      query: () => "/api/inventory", // Apna API route path yahan confirm kar lena
      providesTags: ["InventoryList"],
      transformResponse: (response) => {
        // Aapki Next.js API { success, data, count } return kar rahi hai
        if (response.success) {
          return {
            data: response.data || [],
            count: response.count || 0,
          };
        }
        // Agar success false hai ya data nahi mila
        return {
          data: [],
          count: 0,
          message: response.message || "No data found",
        };
      },
    }),

    // Agar future mein aapko POST/Add Inventory ka route banana ho toh uske liye structure:
    // 2. POST - Add new inventory item (Optional for now)
    addInventoryItem: builder.mutation({
      query: (newItemData) => ({
        url: "/api/inventory",
        method: "POST",
        body: newItemData,
      }),
      // Naya item add hone ke baad list ko refresh karne ke liye
      invalidatesTags: ["InventoryList"],
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            message: response.message,
          };
        }
        return {
          success: false,
          error: response.error,
        };
      },
    }),

  }),
});

// Export auto-generated hooks for components
export const {
  useGetInventoryDataQuery,
  useAddInventoryItemMutation, // Optional
} = inventoryApi;