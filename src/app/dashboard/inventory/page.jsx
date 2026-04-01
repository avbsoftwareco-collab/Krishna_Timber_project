// 'use client';

// import { useState } from 'react';
// import { Package, Plus, Search } from 'lucide-react';

// export default function InventoryPage() {
//   const [items, setItems] = useState([
//     { id: 1, name: 'Teak Wood', category: 'Hardwood', quantity: 150, unit: 'CFT', price: 2500 },
//     { id: 2, name: 'Sal Wood', category: 'Hardwood', quantity: 200, unit: 'CFT', price: 1800 },
//     { id: 3, name: 'Pine Wood', category: 'Softwood', quantity: 300, unit: 'CFT', price: 1200 },
//     { id: 4, name: 'Plywood', category: 'Board', quantity: 500, unit: 'Sheet', price: 800 },
//   ]);

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
//           <p className="text-gray-500 mt-1">Manage your stock and materials</p>
//         </div>
//         <button className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
//           <Plus className="w-5 h-5" />
//           Add Item
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           { label: 'Total Items', value: '24', icon: Package, color: 'amber' },
//           { label: 'Low Stock', value: '3', icon: Package, color: 'red' },
//           { label: 'Categories', value: '6', icon: Package, color: 'blue' },
//           { label: 'Total Value', value: '₹4.5L', icon: Package, color: 'green' },
//         ].map((stat, i) => (
//           <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
//             <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center mb-3`}>
//               <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
//             </div>
//             <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
//             <p className="text-sm text-gray-500">{stat.label}</p>
//           </div>
//         ))}
//       </div>

//       {/* Search */}
//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search inventory..."
//           className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
//         />
//       </div>

//       {/* Inventory Grid */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {items.map((item) => (
//           <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//             <div className="flex items-start justify-between mb-3">
//               <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
//                 <Package className="w-6 h-6 text-amber-600" />
//               </div>
//               <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg">
//                 {item.category}
//               </span>
//             </div>
//             <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
//             <p className="text-sm text-gray-500 mb-3">₹{item.price.toLocaleString()} per {item.unit}</p>
//             <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//               <span className="text-sm text-gray-500">In Stock</span>
//               <span className="font-semibold text-gray-800">{item.quantity} {item.unit}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in { animation: fade-in 0.3s ease-out; }
//       `}</style>
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import { Package, Plus, Search, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
// Apna RTK Query hook ka sahi path daalein
import { useGetInventoryDataQuery } from '../../../features/inventory/inventorySlice'; 

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Data from API
  const { data: apiResponse, isLoading, isError, error } = useGetInventoryDataQuery();
  const inventoryItems = apiResponse?.data || [];

  // Search Logic
  const filteredItems = inventoryItems.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.materialName.toLowerCase().includes(searchLower) ||
      item.materialType.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in p-2 sm:p-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Stock</h1>
          <p className="text-gray-500 mt-1">Manage and track your materials</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" />
          Add Material
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md bg-white rounded-xl shadow-sm border border-gray-200">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by material name or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Fetching stock data...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-semibold mb-2">Failed to load inventory</p>
          <p className="text-red-500 text-sm">{error?.data?.message || 'Check your internet connection or API setup.'}</p>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !isError && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wide">
                  <th className="px-6 py-4 font-semibold">Material Name</th>
                  <th className="px-6 py-4 font-semibold">Type/Category</th>
                  <th className="px-6 py-4 font-semibold text-center">Received Qty</th>
                  <th className="px-6 py-4 font-semibold text-center">Sold Qty</th>
                  <th className="px-6 py-4 font-semibold text-center">Current Stock</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => {
                    // Check if stock is low (Suppose less than 10)
                    const isLowStock = Number(item.currentStock) < 10;

                    return (
                      <tr key={index} className="hover:bg-amber-50/30 transition-colors">
                        
                        {/* Material Name & Unit */}
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800 text-base">{item.materialName}</p>
                          <p className="text-xs text-gray-500 mt-1">Unit: {item.unit}</p>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200">
                            {item.materialType}
                          </span>
                        </td>

                        {/* Received */}
                        <td className="px-6 py-4 text-center font-medium text-gray-600">
                          {item.totalReceivedQty}
                        </td>

                        {/* Sold */}
                        <td className="px-6 py-4 text-center font-medium text-gray-600">
                          {item.totalSoldQty}
                        </td>

                        {/* Current Stock (Highlighted) */}
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
                            isLowStock 
                              ? 'bg-red-50 text-red-600 border-red-200' 
                              : 'bg-green-50 text-green-700 border-green-200'
                          }`}>
                            {item.currentStock} {item.unit}
                          </span>
                        </td>

                        {/* Status Label */}
                        <td className="px-6 py-4">
                          {isLowStock ? (
                            <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold">
                              <AlertCircle className="w-4 h-4" />
                              Low Stock
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4" />
                              In Stock
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-lg font-medium text-gray-600">No materials found</p>
                      <p className="text-sm mt-1">Try adjusting your search query.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}