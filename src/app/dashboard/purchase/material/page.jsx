// 'use client';

// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { FaPencilAlt, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
// import {
//   useGetMaterialDataQuery,
//   useLazyGetMaterialDataQuery,
//   useSaveMaterialReceiptMutation,
// } from '../../../../features/purchase/Material/materialSlice';

// const MaterialPage = () => {
//   // RTK Query Hooks
//   // First fetch all data without filters to get dropdown options
//   const { data: allMaterialData, isLoading: isLoadingAll } = useGetMaterialDataQuery({});
  
//   console.log(allMaterialData)
//   // Lazy query for filtered search
//   const [fetchFilteredMaterials, { data: filteredData, isLoading: isLoadingFiltered, error: fetchError }] = useLazyGetMaterialDataQuery();
  
//   // Save mutation
//   const [saveMaterialReceipt, { isLoading: isSaving, isSuccess: isSaveSuccess, error: saveError, reset: resetSave }] = useSaveMaterialReceiptMutation();

//   // Filter States
//   const [selectedSupplierName, setSelectedSupplierName] = useState('');
//   const [selectedSupplierFirm, setSelectedSupplierFirm] = useState('');

//   // Data State
//   const [requests, setRequests] = useState([]);
//   const [error, setError] = useState(null);
//   const [isFiltered, setIsFiltered] = useState(false);

//   // Modal States
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [receivedQuantity, setReceivedQuantity] = useState('');
//   const [materialStatus, setMaterialStatus] = useState('');
//   const [qualityCheck, setQualityCheck] = useState('');
//   const [challanNo, setChallanNo] = useState('');
//   const [truckDelivery, setTruckDelivery] = useState('');
//   const [googleFormCompleted, setGoogleFormCompleted] = useState('');
//   const [photoData, setPhotoData] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [isCameraReady, setIsCameraReady] = useState(false);

//   // Refs
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);

//   // Extract unique supplier names from all data for dropdown
//   const supplierNames = useMemo(() => {
//     if (!allMaterialData?.data) return [];
//     const names = new Set();
//     allMaterialData.data.forEach(item => {
//       if (item.supplierName) {
//         names.add(item.supplierName);
//       }
//     });
//     return Array.from(names).sort();
//   }, [allMaterialData]);

//   // Extract unique supplier firms based on selected supplier name
//   const supplierFirms = useMemo(() => {
//     if (!allMaterialData?.data) return [];
//     const firms = new Set();
//     allMaterialData.data.forEach(item => {
//       // If supplier name is selected, show only firms for that supplier
//       if (selectedSupplierName) {
//         if (item.supplierName === selectedSupplierName && item.supplierFirm) {
//           firms.add(item.supplierFirm);
//         }
//       } else {
//         // Show all firms if no supplier selected
//         if (item.supplierFirm) {
//           firms.add(item.supplierFirm);
//         }
//       }
//     });
//     return Array.from(firms).sort();
//   }, [allMaterialData, selectedSupplierName]);

//   // Reset supplier firm when supplier name changes
//   useEffect(() => {
//     setSelectedSupplierFirm('');
//   }, [selectedSupplierName]);

//   // Update requests when filtered data changes
//   useEffect(() => {
//     if (isFiltered && filteredData?.data) {
//       setRequests(filteredData.data);
//     }
//   }, [filteredData, isFiltered]);

//   // Handle save success
//   useEffect(() => {
//     if (isSaveSuccess) {
//       setShowSuccess(true);
//       // Refresh filtered data
//       if (isFiltered) {
//         fetchFilteredMaterials({ 
//           supplierName: selectedSupplierName, 
//           supplierFirm: selectedSupplierFirm 
//         });
//       }
//       // Close modal after delay
//       setTimeout(() => {
//         closeModal();
//       }, 1500);
//     }
//   }, [isSaveSuccess]);

//   // Handle errors
//   useEffect(() => {
//     if (fetchError) {
//       setError(fetchError?.data?.error || 'Failed to fetch data');
//     }
//     if (saveError) {
//       setError(saveError?.data?.error || 'Failed to save receipt');
//     }
//   }, [fetchError, saveError]);

//   // Handle filter button click
//   const handleFilter = () => {
//     setError(null);
//     setIsFiltered(true);
//     fetchFilteredMaterials({
//       supplierName: selectedSupplierName,
//       supplierFirm: selectedSupplierFirm,
//     });
//   };

//   // Clear filters
//   const handleClearFilters = () => {
//     setSelectedSupplierName('');
//     setSelectedSupplierFirm('');
//     setRequests([]);
//     setIsFiltered(false);
//     setError(null);
//   };

//   // Open modal
//   const openModal = (request) => {
//     setSelectedRequest(request);
//     setReceivedQuantity('');
//     setMaterialStatus('');
//     setQualityCheck('');
//     setChallanNo('');
//     setTruckDelivery('');
//     setGoogleFormCompleted('');
//     setPhotoData(null);
//     setSelectedFile(null);
//     setIsModalOpen(true);
//     setShowSuccess(false);
//     setError(null);
//     setIsCameraReady(false);
//     resetSave();
//   };

//   // Close modal and stop camera
//   const closeModal = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//       streamRef.current = null;
//     }
//     setIsModalOpen(false);
//     setSelectedRequest(null);
//     setShowSuccess(false);
//     setError(null);
//     resetSave();
//   };

//   // Start camera
//   const startCamera = async (facingMode) => {
//     try {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop());
//       }
      
//       let stream;
//       try {
//         stream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode: { exact: facingMode } }
//         });
//       } catch {
//         // Fallback without exact
//         stream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode: facingMode }
//         });
//       }
      
//       streamRef.current = stream;
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.addEventListener('loadeddata', () => {
//           setIsCameraReady(true);
//         }, { once: true });
//         await videoRef.current.play();
//       }
//     } catch (error) {
//       console.error('Error starting camera:', error);
//       setError('Failed to access camera. Please allow permissions.');
//       setIsCameraReady(false);
//     }
//   };

//   // Capture photo
//   const capturePhoto = () => {
//     if (videoRef.current && canvasRef.current && streamRef.current && isCameraReady) {
//       const context = canvasRef.current.getContext('2d');
//       if (context && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
//         canvasRef.current.width = videoRef.current.videoWidth;
//         canvasRef.current.height = videoRef.current.videoHeight;
//         context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
//         const dataUrl = canvasRef.current.toDataURL('image/jpeg');
//         setPhotoData(dataUrl);
//         setSelectedFile(null);

//         streamRef.current.getTracks().forEach(track => track.stop());
//         streamRef.current = null;
//         videoRef.current.srcObject = null;
//         setIsCameraReady(false);
//       } else {
//         setError('Video frame not ready.');
//       }
//     } else {
//       setError('Camera not ready.');
//     }
//   };

//   // Validate form
//   const validate = () => {
//     if (!receivedQuantity || !materialStatus || !qualityCheck || !challanNo || !truckDelivery || !photoData) {
//       return false;
//     }
//     if (truckDelivery === 'Yes' && !googleFormCompleted) {
//       return false;
//     }
//     return true;
//   };

//   // Save receipt
//   const handleSave = async () => {
//     if (!validate()) {
//       setError('Please fill all required fields.');
//       return;
//     }

//     const payload = {
//       uid: selectedRequest.uid,
//       reqNo: selectedRequest.reqNo,
//       supplierName: selectedRequest.supplierName,
//       supplierFirm: selectedRequest.supplierFirm || '',
//       materialType: selectedRequest.materialType,
//       materialName: selectedRequest.materialName,
//       skuCode: selectedRequest.skuCode,
//       unitName: selectedRequest.unitName,
//       receivedQty: parseFloat(receivedQuantity),
//       status: materialStatus,
//       challanNo,
//       qualityApproved: qualityCheck,
//       truckDelivery,
//       googleFormCompleted,
//       photo: photoData,
//     };

//     await saveMaterialReceipt(payload);
//   };

//   // Loading state
//   const isLoading = isLoadingAll || isLoadingFiltered;

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">Material Received</h2>
//         <p className="text-gray-600 text-sm">Filter and record material received data.</p>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 flex flex-col sm:flex-row gap-4">
//         {/* Supplier Name Dropdown */}
//         <div className="flex-1">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier Name</label>
//           <select
//             value={selectedSupplierName}
//             onChange={(e) => setSelectedSupplierName(e.target.value)}
//             className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
//             disabled={isLoadingAll}
//           >
//             <option value="">Select Supplier Name</option>
//             {supplierNames.map((supplier, index) => (
//               <option key={index} value={supplier}>{supplier}</option>
//             ))}
//           </select>
//         </div>

//         {/* Supplier Firm Dropdown */}
//         <div className="flex-1">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier Firm</label>
//           <select
//             value={selectedSupplierFirm}
//             onChange={(e) => setSelectedSupplierFirm(e.target.value)}
//             className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
//             disabled={isLoadingAll || supplierFirms.length === 0}
//           >
//             <option value="">Select Supplier Firm</option>
//             {supplierFirms.map((firm, index) => (
//               <option key={index} value={firm}>{firm}</option>
//             ))}
//           </select>
//         </div>

//         {/* Filter & Clear Buttons */}
//         <div className="flex items-end gap-2">
//           <button
//             onClick={handleFilter}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
//             disabled={isLoading}
//           >
//             {isLoadingFiltered ? (
//               <>
//                 <FaSpinner className="animate-spin mr-2" />
//                 Filtering...
//               </>
//             ) : (
//               'Filter'
//             )}
//           </button>
          
//           {isFiltered && (
//             <button
//               onClick={handleClearFilters}
//               className="px-4 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 font-medium"
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Loading Dropdown Data Indicator */}
//       {isLoadingAll && (
//         <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center">
//           <FaSpinner className="animate-spin mr-2" />
//           Loading dropdown data...
//         </div>
//       )}

//       {/* Table */}
//       <div className="bg-white border border-gray-300 rounded shadow-sm">
//         {isLoadingFiltered ? (
//           <div className="p-4 text-center text-gray-500">
//             <FaSpinner className="animate-spin inline mr-2" />
//             Loading...
//           </div>
//         ) : error && !isModalOpen ? (
//           <div className="p-4 text-center text-red-500">{error}</div>
//         ) : !isFiltered ? (
//           <div className="p-4 text-center text-gray-500">Please select filters and click Filter button.</div>
//         ) : requests.length === 0 ? (
//           <div className="p-4 text-center text-gray-500">No data found for selected filters.</div>
//         ) : (
//           <div className="overflow-x-auto max-h-[60vh]">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-100 sticky top-0 z-10">
//                 <tr>
//                   <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">UID</th>
//                   <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">Req No</th>
//                   <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">Supplier Name</th>
//                   <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">Supplier Firm</th>
//                   <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">Vendor Name</th>
//                   <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">Material Type</th>
//                   <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">SKU Code</th>
//                   <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">Material Name</th>
//                   <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">Unit Name</th>
//                   <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">Order Qty</th>
//                   <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">Received Qty</th>
//                   <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {requests.map((request, index) => (
//                   <tr key={request.uid || index} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
//                     <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200">{request.uid}</td>
//                     <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200">{request.reqNo}</td>
//                     <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200">{request.supplierName}</td>
//                     <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200">{request.supplierFirm}</td>
//                     <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200">{request.vendorName}</td>
//                     <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200">{request.materialType}</td>
//                     <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200">{request.skuCode}</td>
//                     <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200">{request.materialName}</td>
//                     <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200">{request.unitName}</td>
//                     <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200 text-right">{request.totalReceivedQuantity}</td>
//                     <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200 text-right">{request.receivedQty}</td>
//                     <td className="px-3 py-2 text-center">
//                       <button
//                         onClick={() => openModal(request)}
//                         className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-all duration-200"
//                         title="Record Receipt"
//                       >
//                         <FaPencilAlt size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Records Count */}
//       {isFiltered && requests.length > 0 && (
//         <div className="mt-4 text-sm text-gray-600">
//           Total Records: <strong>{requests.length}</strong>
//         </div>
//       )}

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all duration-300 scale-100">
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl sticky top-0 z-10">
//               <div className="flex items-center justify-between">
//                 <h4 className="text-xl font-bold text-white flex items-center">
//                   <FaPencilAlt className="mr-2" />
//                   Record Material Receipt
//                 </h4>
//                 <button
//                   onClick={closeModal}
//                   className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
//                   disabled={isSaving}
//                 >
//                   <FaTimes size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* Modal Body */}
//             <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
//               {/* Success Message */}
//               {showSuccess && (
//                 <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
//                   <FaCheck className="text-green-600 mr-3 flex-shrink-0" />
//                   <div>
//                     <p className="text-green-800 font-medium">Success!</p>
//                     <p className="text-green-700 text-sm">Receipt saved successfully.</p>
//                   </div>
//                 </div>
//               )}

//               {/* Error Message */}
//               {error && (
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
//                   <FaTimes className="text-red-600 mr-3 flex-shrink-0" />
//                   <div>
//                     <p className="text-red-800 font-medium">Error!</p>
//                     <p className="text-red-700 text-sm">{error}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Selected Item Info */}
//               <div className="p-3 bg-blue-50 rounded-lg">
//                 <p className="text-sm text-blue-800">
//                   <strong>Material:</strong> {selectedRequest?.materialName} | 
//                   <strong> SKU:</strong> {selectedRequest?.skuCode} | 
//                   <strong> Unit:</strong> {selectedRequest?.unitName}
//                 </p>
//               </div>

//               {/* Received Quantity */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Received Quantity *</label>
//                 <input
//                   type="number"
//                   value={receivedQuantity}
//                   onChange={(e) => setReceivedQuantity(e.target.value)}
//                   className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
//                   placeholder="Enter received quantity"
//                   disabled={isSaving}
//                 />
//               </div>

//               {/* Material Status */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Material Status *</label>
//                 <select
//                   value={materialStatus}
//                   onChange={(e) => setMaterialStatus(e.target.value)}
//                   className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
//                   disabled={isSaving}
//                 >
//                   <option value="">-- Select Status --</option>
//                   <option value="Partition">Partition</option>
//                   <option value="Full Material">Full Material</option>
//                 </select>
//               </div>

//               {/* Quality Check */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Quality Check *</label>
//                 <select
//                   value={qualityCheck}
//                   onChange={(e) => setQualityCheck(e.target.value)}
//                   className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
//                   disabled={isSaving}
//                 >
//                   <option value="">-- Select Quality Check --</option>
//                   <option value="Approved">Approved</option>
//                   <option value="Reject">Reject</option>
//                 </select>
//               </div>

//               {/* Challan No */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Challan No *</label>
//                 <input
//                   type="text"
//                   value={challanNo}
//                   onChange={(e) => setChallanNo(e.target.value)}
//                   className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
//                   placeholder="Enter Challan No"
//                   disabled={isSaving}
//                 />
//               </div>

//               {/* Truck Delivery */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">If the Truck Delivery *</label>
//                 <select
//                   value={truckDelivery}
//                   onChange={(e) => setTruckDelivery(e.target.value)}
//                   className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
//                   disabled={isSaving}
//                 >
//                   <option value="">-- Select Truck Delivery --</option>
//                   <option value="Yes">Yes</option>
//                   <option value="No">No</option>
//                 </select>
//               </div>

//               {/* Google Form Completed */}
//               {truckDelivery === 'Yes' && (
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Google Form Completed? *</label>
//                   <select
//                     value={googleFormCompleted}
//                     onChange={(e) => setGoogleFormCompleted(e.target.value)}
//                     className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
//                     disabled={isSaving}
//                   >
//                     <option value="">-- Select --</option>
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                   </select>
//                 </div>
//               )}

//               {/* Challan Photo */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Challan Photo *</label>
                
//                 {/* Camera Buttons */}
//                 <div className="flex space-x-2 mb-4">
//                   <button
//                     type="button"
//                     onClick={() => startCamera('environment')}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
//                     disabled={isSaving || photoData || selectedFile}
//                   >
//                     📷 Back Camera
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => startCamera('user')}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
//                     disabled={isSaving || photoData || selectedFile}
//                   >
//                     🤳 Front Camera
//                   </button>
//                 </div>

//                 {/* Video Preview */}
//                 <video
//                   ref={videoRef}
//                   className="w-full mb-4 rounded-lg border-2 border-gray-200"
//                   style={{ display: (photoData || selectedFile) ? 'none' : 'block' }}
//                   autoPlay
//                   playsInline
//                   muted
//                 />
//                 <canvas ref={canvasRef} style={{ display: 'none' }} />

//                 {/* Captured Photo Preview */}
//                 {(photoData || selectedFile) && (
//                   <div className="mt-4">
//                     <img
//                       src={photoData || (selectedFile && URL.createObjectURL(selectedFile))}
//                       alt="Challan"
//                       className="w-full mb-4 rounded-lg border-2 border-green-300"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setPhotoData(null);
//                         setSelectedFile(null);
//                       }}
//                       className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
//                       disabled={isSaving}
//                     >
//                       🔄 Retake/Remove
//                     </button>
//                   </div>
//                 )}

//                 {/* Capture Button */}
//                 {!photoData && !selectedFile && (
//                   <div className="mt-4">
//                     <button
//                       type="button"
//                       onClick={capturePhoto}
//                       className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 w-full font-medium"
//                       disabled={isSaving || !isCameraReady}
//                     >
//                       {isCameraReady ? '📸 Capture Photo' : '⏳ Waiting for camera...'}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={closeModal}
//                   className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
//                   disabled={isSaving}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center min-w-[140px] justify-center"
//                   disabled={isSaving}
//                 >
//                   {isSaving ? (
//                     <>
//                       <FaSpinner className="animate-spin mr-2" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <FaCheck className="mr-2" />
//                       Save Receipt
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MaterialPage;






'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaPencilAlt, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import {
  useGetMaterialDataQuery,
  useLazyGetMaterialDataQuery,
  useSaveMaterialReceiptMutation,
} from '../../../../features/purchase/Material/materialSlice';

const MaterialPage = () => {
  // RTK Query Hooks
  const { data: allMaterialData, isLoading: isLoadingAll } = useGetMaterialDataQuery({});
  
  const [fetchFilteredMaterials, { data: filteredData, isLoading: isLoadingFiltered, error: fetchError }] = useLazyGetMaterialDataQuery();
  
  const [saveMaterialReceipt, { isLoading: isSaving, isSuccess: isSaveSuccess, error: saveError, reset: resetSave }] = useSaveMaterialReceiptMutation();

  // Filter States
  const [selectedSupplierName, setSelectedSupplierName] = useState('');
  const [selectedSupplierFirm, setSelectedSupplierFirm] = useState('');

  // Data State
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [receivedQuantity, setReceivedQuantity] = useState('');
  const [materialStatus, setMaterialStatus] = useState('');
  const [qualityCheck, setQualityCheck] = useState('');
  const [challanNo, setChallanNo] = useState('');
  const [truckDelivery, setTruckDelivery] = useState('');
  const [googleFormCompleted, setGoogleFormCompleted] = useState('');
  const [photoData, setPhotoData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Extract unique supplier names
  const supplierNames = useMemo(() => {
    if (!allMaterialData?.data) return [];
    const names = new Set();
    allMaterialData.data.forEach(item => {
      if (item.supplierName) names.add(item.supplierName);
    });
    return Array.from(names).sort();
  }, [allMaterialData]);

  // Extract unique supplier firms
  const supplierFirms = useMemo(() => {
    if (!allMaterialData?.data) return [];
    const firms = new Set();
    allMaterialData.data.forEach(item => {
      if (selectedSupplierName) {
        if (item.supplierName === selectedSupplierName && item.supplierFirm) {
          firms.add(item.supplierFirm);
        }
      } else {
        if (item.supplierFirm) firms.add(item.supplierFirm);
      }
    });
    return Array.from(firms).sort();
  }, [allMaterialData, selectedSupplierName]);

  // Reset supplier firm when supplier name changes
  useEffect(() => {
    setSelectedSupplierFirm('');
  }, [selectedSupplierName]);

  // Update requests when filtered data changes
  useEffect(() => {
    if (isFiltered && filteredData?.data) {
      setRequests(filteredData.data);
    }
  }, [filteredData, isFiltered]);

  // Handle save success
  useEffect(() => {
    if (isSaveSuccess) {
      setShowSuccess(true);
      if (isFiltered) {
        fetchFilteredMaterials({ 
          supplierName: selectedSupplierName, 
          supplierFirm: selectedSupplierFirm 
        });
      }
      setTimeout(() => {
        closeModal();
      }, 1500);
    }
  }, [isSaveSuccess]);

  // Handle errors
  useEffect(() => {
    if (fetchError) {
      setError(fetchError?.data?.error || 'Failed to fetch data');
    }
    if (saveError) {
      setError(saveError?.data?.error || 'Failed to save receipt');
    }
  }, [fetchError, saveError]);

  // Handle filter
  const handleFilter = () => {
    setError(null);
    setIsFiltered(true);
    fetchFilteredMaterials({
      supplierName: selectedSupplierName,
      supplierFirm: selectedSupplierFirm,
    });
  };

  // Clear filters
  const handleClearFilters = () => {
    setSelectedSupplierName('');
    setSelectedSupplierFirm('');
    setRequests([]);
    setIsFiltered(false);
    setError(null);
  };

  // Open modal
  const openModal = (request) => {
    setSelectedRequest(request);
    setReceivedQuantity('');
    setMaterialStatus('');
    setQualityCheck('');
    setChallanNo('');
    setTruckDelivery('');
    setGoogleFormCompleted('');
    setPhotoData(null);
    setSelectedFile(null);
    setIsModalOpen(true);
    setShowSuccess(false);
    setError(null);
    setIsCameraReady(false);
    resetSave();
  };

  // Close modal
  const closeModal = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsModalOpen(false);
    setSelectedRequest(null);
    setShowSuccess(false);
    setError(null);
    resetSave();
  };

  // Start camera
  const startCamera = async (facingMode) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: facingMode } }
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode }
        });
      }
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', () => {
          setIsCameraReady(true);
        }, { once: true });
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      setError('Failed to access camera. Please allow permissions.');
      setIsCameraReady(false);
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && streamRef.current && isCameraReady) {
      const context = canvasRef.current.getContext('2d');
      if (context && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setPhotoData(dataUrl);
        setSelectedFile(null);

        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        videoRef.current.srcObject = null;
        setIsCameraReady(false);
      } else {
        setError('Video frame not ready.');
      }
    } else {
      setError('Camera not ready.');
    }
  };

  // Validate form
  const validate = () => {
    if (!receivedQuantity || !materialStatus || !qualityCheck || !challanNo || !truckDelivery || !photoData) {
      return false;
    }
    if (truckDelivery === 'Yes' && !googleFormCompleted) {
      return false;
    }
    return true;
  };

  // Save receipt
  const handleSave = async () => {
    if (!validate()) {
      setError('Please fill all required fields.');
      return;
    }

    const payload = {
      uid: selectedRequest.uid,
      reqNo: selectedRequest.reqNo,
      supplierName: selectedRequest.supplierName,
      supplierFirm: selectedRequest.supplierFirm || '',
      materialType: selectedRequest.materialType,
      materialName: selectedRequest.materialName,
      skuCode: selectedRequest.skuCode,
      unitName: selectedRequest.unitName,
      receivedQty: parseFloat(receivedQuantity),
      status: materialStatus,
      challanNo,
      qualityApproved: qualityCheck,
      truckDelivery,
      googleFormCompleted,
      photo: photoData,
    };

    await saveMaterialReceipt(payload);
  };

  const isLoading = isLoadingAll || isLoadingFiltered;

  return (
    <div className="p-6 bg-[#f8f5f0] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#2c2c2c]">Material Received</h2>
        <p className="text-gray-600 mt-1">Filter and record material received data.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e0d8] p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supplier Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier Name</label>
            <select
              value={selectedSupplierName}
              onChange={(e) => setSelectedSupplierName(e.target.value)}
              className="w-full p-4 border border-[#d1c7b8] rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800 text-base"
              disabled={isLoadingAll}
            >
              <option value="">Select Supplier Name</option>
              {supplierNames.map((supplier, index) => (
                <option key={index} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>

          {/* Supplier Firm */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier Firm</label>
            <select
              value={selectedSupplierFirm}
              onChange={(e) => setSelectedSupplierFirm(e.target.value)}
              className="w-full p-4 border border-[#d1c7b8] rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800 text-base"
              disabled={isLoadingAll || supplierFirms.length === 0}
            >
              <option value="">Select Supplier Firm</option>
              {supplierFirms.map((firm, index) => (
                <option key={index} value={firm}>{firm}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleFilter}
            disabled={isLoading}
            className="px-10 py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl transition-all duration-200 flex items-center shadow-sm text-base"
          >
            {isLoadingFiltered ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Filtering...
              </>
            ) : (
              'Filter'
            )}
          </button>

          {isFiltered && (
            <button
              onClick={handleClearFilters}
              className="px-10 py-3.5 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-xl transition-all duration-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e0d8] overflow-hidden">
        {isLoadingFiltered ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl mb-4 text-orange-500" />
            Loading materials...
          </div>
        ) : error && !isModalOpen ? (
          <div className="p-12 text-center text-red-600 bg-red-50 rounded-2xl m-6">{error}</div>
        ) : !isFiltered ? (
          <div className="p-20 text-center text-gray-500 text-lg">
            Please select filters and click <span className="font-semibold text-orange-600">Filter</span> button.
          </div>
        ) : requests.length === 0 ? (
          <div className="p-20 text-center text-gray-500">No data found for selected filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#e5e0d8]">
              <thead className="bg-[#f8f5f0] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">UID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Req No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Supplier Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Supplier Firm</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Vendor Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Material Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">SKU Code</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Material Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Unit</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Order Qty</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Received Qty</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#f0e9d9]">
                {requests.map((request, index) => (
                  <tr key={request.uid || index} className="hover:bg-[#fdfaf5] transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-800">{request.uid}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{request.reqNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{request.supplierName}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{request.supplierFirm}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{request.vendorName}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{request.materialType}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{request.skuCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{request.materialName}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{request.unitName}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 text-right">{request.totalReceivedQuantity || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 text-right">{request.receivedQty || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openModal(request)}
                        className="text-[#f97316] hover:text-orange-700 bg-orange-50 hover:bg-orange-100 p-3 rounded-xl transition-all duration-200"
                        title="Record Receipt"
                      >
                        <FaPencilAlt size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Records Count */}
      {isFiltered && requests.length > 0 && (
        <div className="mt-5 text-sm text-gray-600 pl-2">
          Total Records: <span className="font-semibold text-[#f97316]">{requests.length}</span>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#f97316] to-orange-600 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-bold flex items-center gap-3">
                  <FaPencilAlt /> Record Material Receipt
                </h4>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
                  disabled={isSaving}
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-8 space-y-6 overflow-y-auto max-h-[65vh]">
              {showSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center">
                  <FaCheck className="text-green-600 mr-3" />
                  <div>
                    <p className="text-green-800 font-medium">Success!</p>
                    <p className="text-green-700 text-sm">Receipt saved successfully.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center">
                  <FaTimes className="text-red-600 mr-3" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Material Info */}
              <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
                <p className="text-orange-900">
                  <strong>Material:</strong> {selectedRequest?.materialName} | 
                  <strong> SKU:</strong> {selectedRequest?.skuCode} | 
                  <strong> Unit:</strong> {selectedRequest?.unitName}
                </p>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Received Quantity *</label>
                <input
                  type="number"
                  value={receivedQuantity}
                  onChange={(e) => setReceivedQuantity(e.target.value)}
                  className="w-full p-4 border border-[#d1c7b8] rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  placeholder="Enter received quantity"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Material Status *</label>
                <select
                  value={materialStatus}
                  onChange={(e) => setMaterialStatus(e.target.value)}
                  className="w-full p-4 border border-[#d1c7b8] rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  disabled={isSaving}
                >
                  <option value="">-- Select Status --</option>
                  <option value="Partition">Partition</option>
                  <option value="Full Material">Full Material</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quality Check *</label>
                <select
                  value={qualityCheck}
                  onChange={(e) => setQualityCheck(e.target.value)}
                  className="w-full p-4 border border-[#d1c7b8] rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  disabled={isSaving}
                >
                  <option value="">-- Select Quality Check --</option>
                  <option value="Approved">Approved</option>
                  <option value="Reject">Reject</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Challan No *</label>
                <input
                  type="text"
                  value={challanNo}
                  onChange={(e) => setChallanNo(e.target.value)}
                  className="w-full p-4 border border-[#d1c7b8] rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  placeholder="Enter Challan No"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Truck Delivery *</label>
                <select
                  value={truckDelivery}
                  onChange={(e) => setTruckDelivery(e.target.value)}
                  className="w-full p-4 border border-[#d1c7b8] rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  disabled={isSaving}
                >
                  <option value="">-- Select Truck Delivery --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {truckDelivery === 'Yes' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Google Form Completed? *</label>
                  <select
                    value={googleFormCompleted}
                    onChange={(e) => setGoogleFormCompleted(e.target.value)}
                    className="w-full p-4 border border-[#d1c7b8] rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                    disabled={isSaving}
                  >
                    <option value="">-- Select --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              )}

              {/* Camera Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Challan Photo *</label>
                
                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => startCamera('environment')}
                    disabled={isSaving || photoData || selectedFile}
                    className="flex-1 py-3 bg-[#f97316] hover:bg-orange-600 text-white rounded-2xl font-medium transition disabled:opacity-50"
                  >
                    📷 Back Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => startCamera('user')}
                    disabled={isSaving || photoData || selectedFile}
                    className="flex-1 py-3 bg-[#f97316] hover:bg-orange-600 text-white rounded-2xl font-medium transition disabled:opacity-50"
                  >
                    🤳 Front Camera
                  </button>
                </div>

                <video
                  ref={videoRef}
                  className="w-full rounded-2xl border border-gray-300"
                  style={{ display: (photoData || selectedFile) ? 'none' : 'block' }}
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {(photoData || selectedFile) && (
                  <div className="mt-4">
                    <img
                      src={photoData || (selectedFile && URL.createObjectURL(selectedFile))}
                      alt="Challan Photo"
                      className="w-full rounded-2xl border-2 border-green-300"
                    />
                    <button
                      type="button"
                      onClick={() => { setPhotoData(null); setSelectedFile(null); }}
                      className="mt-3 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                      disabled={isSaving}
                    >
                      Retake Photo
                    </button>
                  </div>
                )}

                {!photoData && !selectedFile && (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={isSaving || !isCameraReady}
                    className="w-full mt-4 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold transition disabled:opacity-70"
                  >
                    {isCameraReady ? '📸 Capture Photo' : 'Waiting for camera...'}
                  </button>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t flex justify-end gap-4">
              <button
                onClick={closeModal}
                disabled={isSaving}
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-2xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-10 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold rounded-2xl transition flex items-center gap-2 shadow"
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <FaCheck /> Save Receipt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialPage;