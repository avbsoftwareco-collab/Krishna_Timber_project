
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Send, User, Truck, Package, ChevronDown, Loader2 
} from 'lucide-react';
import Swal from "sweetalert2";
import {
  useGetDropdownDataQuery,
  useCreatePurchaseRequestMutation,
} from "../../../../features/purchase/requirement/requirementSlice";

// ─── Searchable Select ─────────────────────────────────────────────────────
const SearchableSelect = ({ label, required, value, onChange, options = [], placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter(opt => 
    opt?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (opt) => {
    onChange(opt);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          value={isOpen ? search : value || ""}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          onFocus={() => { setIsOpen(true); setSearch(""); }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
        />
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {isOpen && !disabled && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl max-h-60 overflow-y-auto shadow-lg py-1">
          {filteredOptions.length > 0 ? filteredOptions.map((opt, i) => (
            <li
              key={i}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }}
              className="px-4 py-3 hover:bg-orange-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-none"
            >
              {opt}
            </li>
          )) : (
            <li className="px-4 py-3 text-gray-400 text-sm">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

// ─── GST Dropdown ─────────────────────────────────────────────────────────
const GSTSelect = ({ value, onChange }) => {
  const gstOptions = [
    { value: '', label: 'Select GST %' },
    { value: '5', label: '5%' },
    { value: '12', label: '12%' },
    { value: '18', label: '18%' },
    { value: '28', label: '28%' },
    { value: 'custom', label: 'Custom GST' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        GST Rate <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-orange-500 appearance-none"
        >
          {gstOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

// ─── Input Field ───────────────────────────────────────────────────────────
const InputField = ({ label, value, onChange, type = "text", required, readOnly = false, placeholder, name }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all 
        ${readOnly ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' : 'focus:ring-1 focus:ring-orange-500'}`}
    />
  </div>
);

function parseDropdown(apiResponse) {
  let fullData = [];
  let suppliers = [];
  if (apiResponse?.data?.fullData) fullData = apiResponse.data.fullData;
  if (apiResponse?.data?.suppliers) suppliers = apiResponse.data.suppliers;

  const materialCategories = [...new Set(fullData.map(item => item?.materialCategory || "").filter(Boolean))].sort();
  return { materialCategories, fullData, suppliers };
}

export default function PurchaseRequirement() {
  const EMPTY_ITEM = {
    id: Date.now(),
    materialCategory: "", materialName: "", size: "", skuCode: "", unitName: "", materialGrade: "",
    quantity: "", rate: "",
    gstType: "cgst_sgst",
    gstPercent: "",
    cgstPercent: 0, sgstPercent: 0, igstPercent: 0,
    cgstAmount: 0, sgstAmount: 0, igstAmount: 0,
    finalRate: 0,
    totalValue: 0,
    remark: ""
  };

  const [items, setItems] = useState([EMPTY_ITEM]);

  const [commonData, setCommonData] = useState({
    supplierName: "", supplierFirm: "", address: "", contactNumber: "",
    brandName: "", gstNumber: "", isTransportRequired: "No",
    expectedTransportCharge: "", freightCharge: "", expectedFreightCharge: "", requiredDays: ""
  });

  const { data: rawDropdown, isLoading, isError, refetch } = useGetDropdownDataQuery({});
  const { materialCategories, fullData, suppliers } = parseDropdown(rawDropdown);

  const [createPurchaseRequest, { isLoading: submitting }] = useCreatePurchaseRequestMutation();

  // Supplier Auto-fill
  useEffect(() => {
    if (!commonData.supplierFirm) return;
    const selected = suppliers.find(s => s.supplierFirm === commonData.supplierFirm);
    if (selected) {
      setCommonData(prev => ({
        ...prev,
        supplierName: selected.supplierName || "",
        address: selected.address || "",
        contactNumber: selected.contactNumber || "",
        gstNumber: selected.gstNumber || "",
        brandName: selected.brandName || "",
      }));
    }
  }, [commonData.supplierFirm, suppliers]);

  // GST Calculation
  useEffect(() => {
    setItems(prevItems => prevItems.map(item => {
      const rate = parseFloat(item.rate) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      const gstPercent = parseFloat(item.gstPercent) || 0;

      let cgstPercent = 0, sgstPercent = 0, igstPercent = 0;
      let cgstAmount = 0, sgstAmount = 0, igstAmount = 0;

      if (item.gstType === 'cgst_sgst') {
        cgstPercent = sgstPercent = gstPercent / 2;
        cgstAmount = (rate * cgstPercent) / 100;
        sgstAmount = (rate * sgstPercent) / 100;
      } else {
        igstPercent = gstPercent;
        igstAmount = (rate * igstPercent) / 100;
      }

      const finalRate = rate + cgstAmount + sgstAmount + igstAmount;
      const totalValue = quantity * finalRate;

      return {
        ...item,
        cgstPercent: Number(cgstPercent.toFixed(2)),
        sgstPercent: Number(sgstPercent.toFixed(2)),
        igstPercent: Number(igstPercent.toFixed(2)),
        cgstAmount: Number(cgstAmount.toFixed(2)),
        sgstAmount: Number(sgstAmount.toFixed(2)),
        igstAmount: Number(igstAmount.toFixed(2)),
        finalRate: Number(finalRate.toFixed(2)),
        totalValue: Number(totalValue.toFixed(2)),
      };
    }));
  }, [items.map(i => `${i.rate}-${i.quantity}-${i.gstType}-${i.gstPercent}`).join(',')]);

  const supplierFirms = suppliers.map(s => s.supplierFirm).filter(Boolean).sort();

  const getMaterialNames = (category) => [...new Set(fullData.filter(i => i.materialCategory?.toLowerCase() === category?.toLowerCase()).map(i => i.materialName).filter(Boolean))];
  const getSizes = (materialName) => [...new Set(fullData.filter(i => i.materialName?.toLowerCase() === materialName?.toLowerCase()).map(i => i.size).filter(Boolean))];

  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      let updated = { ...item, [field]: value };

      if (field === "materialCategory") {
        updated.materialName = updated.size = updated.skuCode = updated.unitName = updated.materialGrade = "";
      }
      if (field === "materialName") {
        updated.size = updated.skuCode = updated.unitName = updated.materialGrade = "";
      }
      if (field === "size" && value) {
        const match = fullData.find(m => 
          m.materialCategory?.toLowerCase() === updated.materialCategory?.toLowerCase() &&
          m.materialName?.toLowerCase() === updated.materialName?.toLowerCase() &&
          m.size?.toLowerCase() === value.toLowerCase()
        );
        if (match) {
          updated.skuCode = match.skuCode || "";
          updated.unitName = match.unit || "";
          updated.materialGrade = match.materialGrade || "";
        }
      }
      return updated;
    }));
  };

  const addItem = () => setItems(prev => [...prev, { ...EMPTY_ITEM, id: Date.now() }]);
  const removeItem = (id) => items.length > 1 && setItems(prev => prev.filter(i => i.id !== id));

  const grandTotal = items.reduce((sum, item) => sum + (item.totalValue || 0), 0);

  const resetForm = () => {
    setCommonData({
      supplierName: "", supplierFirm: "", address: "", contactNumber: "",
      brandName: "", gstNumber: "", isTransportRequired: "No",
      expectedTransportCharge: "", freightCharge: "", expectedFreightCharge: "", requiredDays: ""
    });
    setItems([{ ...EMPTY_ITEM, id: Date.now() }]);
  };

  const handleSubmit = async () => {
    if (!commonData.supplierFirm) {
      return Swal.fire({ icon: "warning", title: "Supplier Firm Required", confirmButtonColor: "#f97316" });
    }
    if (items.some(i => !i.materialCategory || !i.materialName || !i.quantity || !i.rate || !i.gstPercent)) {
      return Swal.fire({ icon: "warning", title: "Please fill all required fields", confirmButtonColor: "#f97316" });
    }

    const payload = { ...commonData, items: items.map(({ id, ...rest }) => rest) };

    try {
      const result = await createPurchaseRequest(payload).unwrap();

      Swal.fire({
        icon: "success",
        title: "Requirement Submitted Successfully!",
        text: `REQ NO: ${result.data?.reqNo || "Generated"}`,
        confirmButtonColor: "#f97316"
      });

      resetForm();
    } catch (err) {
      Swal.fire({ 
        icon: "error", 
        title: "Submission Failed", 
        text: err?.data?.message || "Please try again", 
        confirmButtonColor: "#f97316" 
      });
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-500">Loading data from Google Sheet...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">Failed to load data. <button onClick={refetch} className="underline">Retry</button></div>;

  const transportRequired = commonData.isTransportRequired === "Yes";

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-2">
        
        </div>

        {/* Step Progress */}
      

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Create Purchase Requirement</h2>
              <p className="text-gray-500">Add multiple items with GST calculations</p>
            </div>
          </div>

          <div className="p-8 space-y-12">

            {/* Supplier Details */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-semibold text-gray-800">Supplier Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SearchableSelect 
                  label="Supplier Firm" required 
                  value={commonData.supplierFirm} 
                  onChange={(v) => setCommonData(p => ({...p, supplierFirm: v}))} 
                  options={supplierFirms} 
                  placeholder="Search supplier firm..." 
                />
                <InputField label="Supplier Name" value={commonData.supplierName} readOnly />
                <InputField label="Brand Name" value={commonData.brandName} readOnly />
                <InputField label="Address" value={commonData.address} readOnly className="lg:col-span-2" />
                <InputField label="Contact Number" value={commonData.contactNumber} readOnly />
                <InputField label="GST Number" value={commonData.gstNumber} readOnly />
              </div>
            </div>

            {/* Material Items - Add Button Below Each Item */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-800">Material Items ({items.length})</h3>
              </div>

              {items.map((item, idx) => {
                const nameOptions = getMaterialNames(item.materialCategory);
                const sizeOptions = getSizes(item.materialName);

                return (
                  <div key={item.id} className="border border-gray-200 rounded-2xl p-7 mb-8 bg-white relative">
                    <div className="flex justify-between mb-6">
                      <span className="text-lg font-medium text-gray-700">Item {idx + 1}</span>
                      {items.length > 1 && (
                        <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 size={22} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <SearchableSelect label="Material Category" required value={item.materialCategory} onChange={(v) => handleItemChange(item.id, "materialCategory", v)} options={materialCategories} />
                      <SearchableSelect label="Material Name" required value={item.materialName} onChange={(v) => handleItemChange(item.id, "materialName", v)} options={nameOptions} disabled={!item.materialCategory} />
                      <SearchableSelect label="Size" required value={item.size} onChange={(v) => handleItemChange(item.id, "size", v)} options={sizeOptions} disabled={!item.materialName} />
                      <InputField label="SKU Code" value={item.skuCode} readOnly />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                      <InputField label="Quantity *" type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)} />
                      <InputField label="Unit" value={item.unitName} readOnly />
                      <InputField label="Rate (₹) *" type="number" step="0.01" value={item.rate} onChange={(e) => handleItemChange(item.id, "rate", e.target.value)} />
                      <GSTSelect value={item.gstPercent} onChange={(val) => handleItemChange(item.id, "gstPercent", val)} />
                    </div>

                    <div className="mt-6 flex gap-4">
                      {['cgst_sgst', 'igst'].map(type => (
                        <button key={type} onClick={() => handleItemChange(item.id, 'gstType', type)}
                          className={`flex-1 py-3 rounded-xl font-medium transition-all ${item.gstType === type ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {type === 'cgst_sgst' ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}
                        </button>
                      ))}
                    </div>

                    {item.gstPercent && (
                      <div className="mt-6 p-5 bg-gray-50 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {item.gstType === 'cgst_sgst' ? (
                          <>
                            <div>CGST: {item.cgstPercent}% → ₹{item.cgstAmount}</div>
                            <div>SGST: {item.sgstPercent}% → ₹{item.sgstAmount}</div>
                          </>
                        ) : (
                          <div>IGST: {item.igstPercent}% → ₹{item.igstAmount}</div>
                        )}
                        <div className="font-semibold">Final Rate: ₹{item.finalRate}</div>
                        <div className="font-semibold text-emerald-600">Total Value: ₹{item.totalValue}</div>
                      </div>
                    )}

                    <InputField label="Remark (Optional)" value={item.remark} onChange={(e) => handleItemChange(item.id, "remark", e.target.value)} placeholder="Any notes..." />

                    {/* Add Item Button - Now Below Each Item */}
                    {idx === items.length - 1 && (
                      <div className="mt-8 flex justify-center">
                        <button 
                          onClick={addItem}
                          className="flex items-center gap-2 bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 rounded-2xl font-medium transition-all shadow-sm"
                        >
                          <Plus className="w-5 h-5" /> Add Another Item
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Transport & Delivery */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-semibold text-gray-800">Transport & Delivery</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transport Required</label>
                  <div className="flex gap-3">
                    {['Yes', 'No'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setCommonData(prev => ({ ...prev, isTransportRequired: opt }))}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          commonData.isTransportRequired === opt 
                            ? 'bg-orange-500 text-white shadow-sm' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <InputField 
                  label="Exp. Transport Charge (₹)" 
                  type="number" 
                  name="expectedTransportCharge" 
                  value={commonData.expectedTransportCharge} 
                  onChange={handleCommonChange}
                  placeholder="0.00"
                  readOnly={!transportRequired}
                />

                <InputField 
                  label="Freight Charge (₹)" 
                  type="number" 
                  name="freightCharge" 
                  value={commonData.freightCharge} 
                  onChange={handleCommonChange}
                  placeholder="0.00"
                  readOnly={!transportRequired}
                />

                <InputField 
                  label="Exp. Freight Charge (₹)" 
                  type="number" 
                  name="expectedFreightCharge" 
                  value={commonData.expectedFreightCharge} 
                  onChange={handleCommonChange}
                  placeholder="0.00"
                  readOnly={!transportRequired}
                />

                <InputField 
                  label="Required Days" 
                  type="number" 
                  name="requiredDays" 
                  value={commonData.requiredDays} 
                  onChange={handleCommonChange}
                  placeholder="e.g. 7"
                />
              </div>
            </div>

            {/* Submit Area */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200">
              <div className="text-2xl font-semibold text-gray-800">
                Grand Total: <span className="text-emerald-600">₹{grandTotal.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 px-10 py-4 rounded-2xl font-semibold text-white text-lg shadow-sm transition-all"
              >
                {submitting ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-6 h-6" />}
                {submitting ? "Submitting..." : "Submit Requirement"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}