// "use client";

// import { useState, useMemo } from "react";
// import Swal from "sweetalert2";
// import {
//   useGetIndentDataQuery,
//   useCreateIndentMutation,
// } from "../../../../features/purchase/Indent/indentSlice";

// export default function IndentPage() {
//   const { data, isLoading, refetch } = useGetIndentDataQuery();
//   const [createIndent, { isLoading: creating }] = useCreateIndentMutation();

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [selectedReqNo, setSelectedReqNo] = useState("");
//   const [status, setStatus] = useState("APPROVED");
//   const [remark, setRemark] = useState("");

//   // Get unique REQ_NOs from data
//   const uniqueReqNos = useMemo(() => {
//     if (!data?.data) return [];
//     const reqNos = data.data
//       .map((item) => item["Req No"])
//       .filter((val, idx, arr) => val && arr.indexOf(val) === idx);
//     return reqNos;
//   }, [data]);

//   // Filter items by selected REQ_NO
//   const filteredItems = useMemo(() => {
//     if (!selectedReqNo || !data?.data) return [];
//     return data.data.filter((item) => item["Req No"] === selectedReqNo);
//   }, [selectedReqNo, data]);

//   // Auto-selected UIDs from filtered items
//   const autoSelectedUIDs = useMemo(() => {
//     return filteredItems.map((item) => item["UID"]).filter(Boolean);
//   }, [filteredItems]);

//   const openModal = () => {
//     setSelectedReqNo("");
//     setStatus("APPROVED");
//     setRemark("");
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedReqNo("");
//     setStatus("APPROVED");
//     setRemark("");
//   };

//   const handleSubmit = async () => {
//     if (autoSelectedUIDs.length === 0) {
//       Swal.fire({
//         icon: "warning",
//         title: "No Items",
//         text: "No items found for selected REQ NO",
//         confirmButtonColor: "#E67E22",
//       });
//       return;
//     }

//     try {
//       const result = await createIndent({
//         UIDs: autoSelectedUIDs,
//         STATUS_3: status,
//         REMARK_3: remark,
//       }).unwrap();

//       closeModal();
//       refetch();

//       Swal.fire({
//         icon: "success",
//         title: "PO Created Successfully!",
//         html: `
//           <div style="text-align: left; padding: 8px 0;">
//             <p style="margin: 6px 0; font-size: 14px;"><strong>Indent Number:</strong> ${result.indentNumber || "N/A"}</p>
//             ${result.pdfUrl ? `<p style="margin: 6px 0; font-size: 14px;"><strong>PDF:</strong> <a href="${result.pdfUrl}" target="_blank" style="color: #E67E22; text-decoration: underline;">Download PDF</a></p>` : ""}
//           </div>
//         `,
//         confirmButtonColor: "#E67E22",
//         confirmButtonText: "Done",
//       });
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Failed to Create Indent",
//         text: error?.data?.error || error?.message || "Something went wrong. Please try again.",
//         confirmButtonColor: "#E67E22",
//         confirmButtonText: "Try Again",
//       });
//     }
//   };

//   // All columns — exact API keys
//   const columns = [
//     { key: "Req No", label: "Req No" },
//     { key: "UID", label: "UID" },
//     { key: "Suplier Name ", label: "Supplier Name" },
//     { key: "suplier Firm ", label: "Supplier Firm" },
//     { key: " Address", label: "Address" },
//     { key: "Contact Number ", label: "Contact No" },
//     { key: "Brand name ", label: "Brand Name" },
//     { key: "Material Category ", label: "Material Category" },
//     { key: "Material Name ", label: "Material Name" },
//     { key: "Material Type / Grade", label: "Type / Grade" },
//     { key: "SKU Code", label: "SKU Code" },
//     { key: "Quantity", label: "Quantity" },
//     { key: "Unit Name", label: "Unit" },
//     { key: "GST Number ", label: "GST Number" },
//     { key: "Is Transport Required ", label: "Transport Req." },
//     { key: "Expected Transport charge ", label: "Exp. Transport" },
//     { key: "Frighet Charge ", label: "Freight Charge" },
//     { key: "Expected Frighet Charge ", label: "Exp. Freight" },
//     { key: "Require Days", label: "Require Days" },
//     { key: "Remark", label: "Remark" },
//   ];

//   // Modal preview columns
//   const modalColumns = [
//     { key: "UID", label: "UID" },
//     { key: "Material Name ", label: "Material" },
//     { key: "Suplier Name ", label: "Supplier" },
//     { key: "Quantity", label: "Qty" },
//     { key: "Unit Name", label: "Unit" },
//     { key: "SKU Code", label: "SKU" },
//   ];

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center">
//           <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-500 text-sm">Loading PO data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               PO Management
//             </h1>
//             <p className="text-gray-500 text-sm mt-1">
//               View items and create PO by REQ NO
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={refetch}
//               className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               Refresh
//             </button>
//             <button
//               onClick={openModal}
//               className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition shadow-sm"
//               style={{ backgroundColor: "#E67E22" }}
//               onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D35400")}
//               onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E67E22")}
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Create PO
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full whitespace-nowrap">
//             <thead>
//               <tr className="border-b border-gray-200 bg-gray-50/80">
//                 {columns.map((col) => (
//                   <th
//                     key={col.key}
//                     className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
//                   >
//                     {col.label}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {data?.data?.length > 0 ? (
//                 data.data.map((item, index) => (
//                   <tr key={index} className="hover:bg-orange-50/30 transition-colors">
//                     {columns.map((col) => {
//                       const value = item[col.key];
//                       return (
//                         <td
//                           key={col.key}
//                           className={`px-4 py-3.5 text-sm ${
//                             col.key === "Req No"
//                               ? "font-semibold text-orange-600"
//                               : col.key === "UID"
//                               ? "font-medium text-gray-900"
//                               : "text-gray-600"
//                           }`}
//                         >
//                           {value || "—"}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={columns.length} className="px-4 py-16 text-center text-gray-400 text-sm">
//                     No data found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ===== MODAL ===== */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

//           <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden flex flex-col border border-gray-200">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#FEF3E2" }}>
//               <div className="flex items-center gap-3">
//                 <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E67E22" }}>
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-bold text-gray-900">Create PO</h2>
//                   <p className="text-xs text-gray-500">Select REQ NO to auto-pick items</p>
//                 </div>
//               </div>
//               <button
//                 onClick={closeModal}
//                 className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-100 transition text-gray-400 hover:text-gray-600"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="px-6 py-5 overflow-y-auto flex-1">
//               {/* REQ NO Dropdown */}
//               <div className="mb-5">
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   REQ NO <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={selectedReqNo}
//                   onChange={(e) => setSelectedReqNo(e.target.value)}
//                   className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
//                 >
//                   <option value="">-- Select REQ NO --</option>
//                   {uniqueReqNos.map((reqNo) => (
//                     <option key={reqNo} value={reqNo}>
//                       {reqNo}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {selectedReqNo && (
//                 <>
//                   {/* Auto-selected items */}
//                   <div className="mb-5 rounded-lg border border-orange-200 overflow-hidden">
//                     <div className="px-4 py-2.5 flex items-center justify-between" style={{ backgroundColor: "#FEF3E2" }}>
//                       <span className="text-sm font-semibold text-orange-800">Selected Items</span>
//                       <span
//                         className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
//                         style={{ backgroundColor: "#E67E22" }}
//                       >
//                         {autoSelectedUIDs.length}
//                       </span>
//                     </div>
//                     <div className="max-h-48 overflow-y-auto">
//                       <table className="w-full text-sm">
//                         <thead>
//                           <tr className="bg-gray-50 border-b border-gray-100">
//                             {modalColumns.map((col) => (
//                               <th
//                                 key={col.key}
//                                 className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider"
//                               >
//                                 {col.label}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-50">
//                           {filteredItems.map((item, idx) => (
//                             <tr key={idx} className="hover:bg-orange-50/40">
//                               {modalColumns.map((col) => (
//                                 <td
//                                   key={col.key}
//                                   className={`px-3 py-2 text-sm ${
//                                     col.key === "UID"
//                                       ? "font-medium text-gray-900"
//                                       : "text-gray-600"
//                                   }`}
//                                 >
//                                   {item[col.key] || "—"}
//                                 </td>
//                               ))}
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>

//                   {/* Status & Remark */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                         Status <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={status}
//                         onChange={(e) => setStatus(e.target.value)}
//                         className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
//                       >
//                         <option value="APPROVED">APPROVED</option>
//                         <option value="PENDING">PENDING</option>
//                         <option value="REJECTED">REJECTED</option>
//                         <option value="IN_PROGRESS">IN PROGRESS</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                         Remark <span className="text-gray-400 font-normal">(Optional)</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={remark}
//                         onChange={(e) => setRemark(e.target.value)}
//                         className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
//                         placeholder="Enter remark..."
//                       />
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={creating || !selectedReqNo || autoSelectedUIDs.length === 0}
//                 className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
//                 style={{ backgroundColor: "#E67E22" }}
//                 onMouseEnter={(e) => {
//                   if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#D35400";
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#E67E22";
//                 }}
//               >
//                 {creating ? (
//                   <span className="flex items-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Creating...
//                   </span>
//                 ) : (
//                   `Submit Indent (${autoSelectedUIDs.length} items)`
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






"use client";

import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import {
  useGetIndentDataQuery,
  useCreateIndentMutation,
} from "../../../../features/purchase/Indent/indentSlice";

export default function IndentPage() {
  const { data, isLoading, refetch } = useGetIndentDataQuery();
  const [createIndent, { isLoading: creating }] = useCreateIndentMutation();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedReqNo, setSelectedReqNo] = useState("");
  const [status, setStatus] = useState("APPROVED");
  const [remark, setRemark] = useState("");

  // Get unique REQ_NOs from data
  const uniqueReqNos = useMemo(() => {
    if (!data?.data) return [];
    const reqNos = data.data
      .map((item) => item["Req No"])
      .filter((val, idx, arr) => val && arr.indexOf(val) === idx);
    return reqNos;
  }, [data]);

  // Filter items by selected REQ_NO
  const filteredItems = useMemo(() => {
    if (!selectedReqNo || !data?.data) return [];
    return data.data.filter((item) => item["Req No"] === selectedReqNo);
  }, [selectedReqNo, data]);

  // Auto-selected UIDs from filtered items
  const autoSelectedUIDs = useMemo(() => {
    return filteredItems.map((item) => item["UID"]).filter(Boolean);
  }, [filteredItems]);

  const openModal = () => {
    setSelectedReqNo("");
    setStatus("APPROVED");
    setRemark("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReqNo("");
    setStatus("APPROVED");
    setRemark("");
  };

  const handleSubmit = async () => {
    if (autoSelectedUIDs.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Items",
        text: "No items found for selected REQ NO",
        confirmButtonColor: "#E67E22",
      });
      return;
    }

    try {
      const result = await createIndent({
        UIDs: autoSelectedUIDs,
        STATUS_3: status,
        REMARK_3: remark,
      }).unwrap();

      closeModal();
      refetch();

      Swal.fire({
        icon: "success",
        title: "PO Created Successfully!",
        html: `
          <div style="text-align: left; padding: 8px 0;">
            <p style="margin: 6px 0; font-size: 14px;"><strong>Indent Number:</strong> ${result.indentNumber || "N/A"}</p>
            ${result.pdfUrl ? `<p style="margin: 6px 0; font-size: 14px;"><strong>PDF:</strong> <a href="${result.pdfUrl}" target="_blank" style="color: #E67E22; text-decoration: underline;">Download PDF</a></p>` : ""}
          </div>
        `,
        confirmButtonColor: "#E67E22",
        confirmButtonText: "Done",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Create Indent",
        text: error?.data?.error || error?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#E67E22",
        confirmButtonText: "Try Again",
      });
    }
  };

  // All columns — EXACT API keys (matching your Google Sheet headers)
  const columns = [
    { key: "Req No", label: "Req No" },
    { key: "UID", label: "UID" },
    { key: "Suplier Name", label: "Supplier Name" },
    { key: "suplier Firm", label: "Supplier Firm" },
    { key: "Address", label: "Address" },
    { key: "Contact Number", label: "Contact No" },
    { key: "Brand name", label: "Brand Name" },
    { key: "Material Name", label: "Material Name" },
    { key: "SKU Code", label: "SKU Code" },
    { key: "Quantity", label: "Quantity" },
    { key: "Unit Name", label: "Unit" },
    { key: "Rate 5", label: "Rate" },
    { key: "CGST 5", label: "CGST" },
    { key: "SGST 5", label: "SGST" },
    { key: "IGST 5", label: "IGST" },
    { key: "FINAL RATE 5", label: "Final Rate" },
    { key: "TOTAL VALUE 5", label: "Total Value" },
    { key: "GST Number", label: "GST Number" },
    { key: "Is Transport Required", label: "Transport Req." },
    { key: "Expected Transport charge", label: "Exp. Transport" },
    { key: "Frighet Charge", label: "Freight Charge" },
    { key: "Expected Frighet Charge", label: "Exp. Freight" },
    { key: "Require Days", label: "Require Days" },
    { key: "Remark", label: "Remark" },
  ];

  // Modal preview columns
  const modalColumns = [
    { key: "UID", label: "UID" },
    { key: "Material Name", label: "Material" },
    { key: "Suplier Name", label: "Supplier" },
    { key: "Quantity", label: "Qty" },
    { key: "Unit Name", label: "Unit" },
    { key: "SKU Code", label: "SKU" },
    { key: "Rate 5", label: "Rate" },
    { key: "TOTAL VALUE 5", label: "Total" },
  ];

  // Helper to get value (handles potential spacing issues in keys)
  const getValue = (item, key) => {
    if (!item) return "—";
    
    // Direct match
    if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
      return item[key];
    }
    
    // Try with trimmed key variations
    const trimmedKey = key.trim();
    if (item[trimmedKey] !== undefined && item[trimmedKey] !== null && item[trimmedKey] !== "") {
      return item[trimmedKey];
    }
    
    // Try finding key with extra spaces
    const keys = Object.keys(item);
    const matchedKey = keys.find(k => k.trim() === trimmedKey);
    if (matchedKey && item[matchedKey] !== undefined && item[matchedKey] !== null && item[matchedKey] !== "") {
      return item[matchedKey];
    }
    
    return "—";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading PO data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              PO Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              View items and create PO by REQ NO • Total Records: {data?.totalRecords || 0}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition shadow-sm"
              style={{ backgroundColor: "#E67E22" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D35400")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E67E22")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create PO
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50/80">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data?.length > 0 ? (
                data.data.map((item, index) => (
                  <tr key={item.UID || index} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-4 py-3.5 text-sm text-gray-400 font-medium sticky left-0 bg-white">
                      {index + 1}
                    </td>
                    {columns.map((col) => {
                      const value = getValue(item, col.key);
                      return (
                        <td
                          key={col.key}
                          className={`px-4 py-3.5 text-sm ${
                            col.key === "Req No"
                              ? "font-semibold text-orange-600"
                              : col.key === "UID"
                              ? "font-medium text-gray-900"
                              : col.key === "TOTAL VALUE 5" || col.key === "Rate 5" || col.key === "FINAL RATE 5"
                              ? "font-medium text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {col.key === "TOTAL VALUE 5" || col.key === "Rate 5" || col.key === "FINAL RATE 5"
                            ? value !== "—" ? `₹${value}` : value
                            : value}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-16 text-center text-gray-400 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No data found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer with count */}
        {data?.data?.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
            Showing {data.data.length} records
          </div>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#FEF3E2" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E67E22" }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Create Purchase Order</h2>
                  <p className="text-xs text-gray-500">Select REQ NO to auto-pick items</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-100 transition text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 overflow-y-auto flex-1">
              {/* REQ NO Dropdown */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  REQ NO <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedReqNo}
                  onChange={(e) => setSelectedReqNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                >
                  <option value="">-- Select REQ NO --</option>
                  {uniqueReqNos.map((reqNo) => (
                    <option key={reqNo} value={reqNo}>
                      {reqNo}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {uniqueReqNos.length} unique REQ numbers available
                </p>
              </div>

              {selectedReqNo && (
                <>
                  {/* Auto-selected items */}
                  <div className="mb-5 rounded-lg border border-orange-200 overflow-hidden">
                    <div className="px-4 py-2.5 flex items-center justify-between" style={{ backgroundColor: "#FEF3E2" }}>
                      <span className="text-sm font-semibold text-orange-800">Selected Items for {selectedReqNo}</span>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                        style={{ backgroundColor: "#E67E22" }}
                      >
                        {autoSelectedUIDs.length} items
                      </span>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 sticky top-0">
                            {modalColumns.map((col) => (
                              <th
                                key={col.key}
                                className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider"
                              >
                                {col.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredItems.map((item, idx) => (
                            <tr key={getValue(item, "UID") || idx} className="hover:bg-orange-50/40">
                              {modalColumns.map((col) => (
                                <td
                                  key={col.key}
                                  className={`px-3 py-2.5 text-sm ${
                                    col.key === "UID"
                                      ? "font-medium text-gray-900"
                                      : col.key === "TOTAL VALUE 5" || col.key === "Rate 5"
                                      ? "font-medium text-green-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {col.key === "TOTAL VALUE 5" || col.key === "Rate 5"
                                    ? `₹${getValue(item, col.key)}`
                                    : getValue(item, col.key)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Total Summary */}
                    <div className="px-4 py-2.5 bg-blue-50 border-t border-blue-100 flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800">Total Value:</span>
                      <span className="text-sm font-bold text-blue-900">
                        ₹{filteredItems.reduce((sum, item) => {
                          const val = parseFloat(getValue(item, "TOTAL VALUE 5")) || 0;
                          return sum + val;
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Status & Remark */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                      >
                        <option value="APPROVED">APPROVED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Remark <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                        placeholder="Enter remark..."
                      />
                    </div>
                  </div>
                </>
              )}

              {!selectedReqNo && (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-16 h-16 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm">Select a REQ NO to view items</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="text-sm text-gray-500">
                {selectedReqNo && autoSelectedUIDs.length > 0 && (
                  <span>UIDs: {autoSelectedUIDs.join(", ")}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={creating || !selectedReqNo || autoSelectedUIDs.length === 0}
                  className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm flex items-center gap-2"
                  style={{ backgroundColor: creating ? "#D35400" : "#E67E22" }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#D35400";
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#E67E22";
                  }}
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating PO...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Create PO ({autoSelectedUIDs.length} items)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}