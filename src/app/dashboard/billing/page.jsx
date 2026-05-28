

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus,
  Trash2,
  Printer,
  Search,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Download,
  Eye,
  X,
  EyeOff,
  ChevronDown,
} from "lucide-react";

const SHOP_INFO = {
  name: "Krishna Timber & Plywoods",
  address: "Shop No. 2, Plot No. 158, M.P. Nagar, Zone-II, Bhopal (M.P.)",
  phone: "9826700196",
  phone2: "9826275577",
  gstin: "23ADCPC2098K1ZQ",
};

const GST_OPTIONS = [
  { value: 0, label: "No GST" },
  { value: 5, label: "GST 5%" },
  { value: 12, label: "GST 12%" },
  { value: 18, label: "GST 18%" },
];

const WOOD_UNIT_OPTIONS = ["CFT", "RFT", "SQFT", "Per Piece"];
const HARDWARE_UNIT_OPTIONS = [
  "Pcs",
  "Pkt",
  "Set",
  "Dozen",
  "Box",
  "Kg",
  "Meter",
];
const CUSTOM_UNIT_OPTIONS = [
  "Pcs",
  "CFT",
  "RFT",
  "SQFT",
  "Per Piece",
  "Kg",
  "Meter",
  "Box",
  "Set",
  "Pkt",
  "Dozen",
];
const SHEET_UNIT_OPTIONS = ["SQFT", "Per Piece", "Pcs"];
const CHARGE_UNIT_OPTIONS = ["CFT", "RFT", "SQFT", "Per Piece", "Lump Sum"];
const TIMBER_UNIT_OPTIONS = ["CFT", "RFT", "SQFT", "Per Piece"];
const WOODEN_CLADDING_UNIT_OPTIONS = ["Per Piece", "RFT", "SQFT"];
const SOLID_SURFACE_UNIT_OPTIONS = ["SQFT"];
const CEILING_PLANK_UNIT_OPTIONS = ["SQFT", "RFT", "Per Piece"];
const WOODEN_BALUSTER_UNIT_OPTIONS = ["Per Piece", "CFT"];

const KITCHEN_UNIT_OPTIONS = ["Per Piece", "Set"];
const LOUVER_UNIT_OPTIONS = ["Per Piece"];
const LAMINATE_UNIT_OPTIONS = ["Per Piece"];
const DOOR_FRAME_UNIT_OPTIONS = ["CFT", "Per Piece"];

const CHARGE_TYPES = [
  { value: "labour", label: "Labour Charges", icon: "👷" },
  { value: "installation", label: "Installation Charges", icon: "🔧" },
  { value: "planing", label: "Planing Charges", icon: "🪚" },
  { value: "transport", label: "Transport Charges", icon: "🚛" },
  { value: "custom", label: "Custom Charge", icon: "📋" },
];

const LIGHT = {
  maroon: "#7B1E1E",
  maroonDark: "#5a1515",
  maroonLight: "#9a2828",
  cream: "#FBF6F0",
  creamLight: "#FFFBF5",
  creamDark: "#F0E6DA",
  accent: "#FDF8F2",
  textDark: "#2a1010",
  textMuted: "#6b5454",
  borderSoft: "#E8DCC8",
  cardBg: "#ffffff",
  pageBg: "#FBF6F0",
  inputBg: "#ffffff",
  hoverBg: "#F0E6DA",
  modalBg: "#ffffff",
  overlayBg: "rgba(42,16,16,0.5)",
  shadow: "rgba(123,30,30,0.05)",
  shadowStrong: "rgba(123,30,30,0.18)",
  tableEven: "#FDF8F2",
  tableHover: "#FFFBF5",
  successBg: "#dcfce7",
  successColor: "#166534",
  successBorder: "#bbf7d0",
  infoBg: "#dbeafe",
  infoColor: "#1e40af",
  infoBorder: "#bfdbfe",
  errorBg: "#fef2f2",
  errorBorder: "#fecaca",
  errorColor: "#dc2626",
  purpleBg: "#f3e8ff",
  purpleColor: "#6b21a8",
  purpleBorder: "#e9d5ff",
  amberBg: "#fef3c7",
  amberColor: "#92400e",
  amberBorder: "#fde68a",
};

const DARK = {
  maroon: "#e8a0a0",
  maroonDark: "#c47070",
  maroonLight: "#f0b8b8",
  cream: "#1a1a2e",
  creamLight: "#222240",
  creamDark: "#2a2a45",
  accent: "#1e1e35",
  textDark: "#f0e8e8",
  textMuted: "#a89999",
  borderSoft: "#3a3a55",
  cardBg: "#1e1e35",
  pageBg: "#0f0f1e",
  inputBg: "#222240",
  hoverBg: "#2a2a45",
  modalBg: "#1e1e35",
  overlayBg: "rgba(0,0,0,0.65)",
  shadow: "rgba(0,0,0,0.3)",
  shadowStrong: "rgba(0,0,0,0.5)",
  tableEven: "#1a1a2e",
  tableHover: "#222240",
  successBg: "#052e16",
  successColor: "#4ade80",
  successBorder: "#166534",
  infoBg: "#172554",
  infoColor: "#93c5fd",
  infoBorder: "#1e40af",
  errorBg: "#450a0a",
  errorBorder: "#7f1d1d",
  errorColor: "#fca5a5",
  purpleBg: "#2e1065",
  purpleColor: "#c4b5fd",
  purpleBorder: "#6b21a8",
  amberBg: "#451a03",
  amberColor: "#fbbf24",
  amberBorder: "#92400e",
};

function uid() {
  return Date.now() + "-" + Math.random().toString(36).slice(2, 7);
}

function parseSheetDimensions(name) {
  if (!name) return null;
  let thickness = null;
  const mmMatch = name.match(/(\d+(?:\.\d+)?)\s*mm/i);
  if (mmMatch) thickness = parseFloat(mmMatch[1]);
  let cleanName = name.replace(/\d+(?:\.\d+)?\s*mm/gi, "").trim();
  const match = cleanName.match(
    /(\d+(?:\.\d+)?)\s*['"]?\s*[x×X]\s*['"]?\s*(\d+(?:\.\d+)?)/i,
  );
  if (!match) return null;
  let w = parseFloat(match[1]);
  let h = parseFloat(match[2]);
  if (isNaN(w) || isNaN(h) || w === 0 || h === 0) return null;
  let wFeet, hFeet;
  let isInches = false;
  if (w > 12 || h > 12) {
    isInches = true;
    wFeet = w / 12;
    hFeet = h / 12;
  } else {
    wFeet = w;
    hFeet = h;
  }
  const areaSqft = wFeet * hFeet;
  return {
    widthFeet: Math.round(wFeet * 10000) / 10000,
    heightFeet: Math.round(hFeet * 10000) / 10000,
    areaPerPiece: Math.round(areaSqft * 1000) / 1000,
    thickness,
    isInches,
    widthOrig: w,
    heightOrig: h,
  };
}

function isSheetMaterial(name) {
  return /mdf|hdhdr|hdmr|door|wpc|ply|block|flush|laminate|board|sunmica|formica|veneer/i.test(
    name || "",
  );
}

function isTimberWood(item) {
  const text =
    `${item?.materialType || ""} ${item?.product || ""} ${item?.category || ""}`.toLowerCase();
  return (
    /timber|teak|sagwan|hardwood/i.test(text) &&
    !isWoodenCladding(item) &&
    !isWoodenBaluster(item)
  );
}

function isWoodenCladding(item) {
  const text =
    `${item?.materialType || ""} ${item?.product || ""} ${item?.category || ""}`.toLowerCase();
  return /cladding/i.test(text);
}

function isSolidSurface(item) {
  const text =
    `${item?.materialType || ""} ${item?.product || ""} ${item?.category || ""}`.toLowerCase();
  return /solid\s*surface/i.test(text);
}

function isCeilingPlank(item) {
  const text =
    `${item?.materialType || ""} ${item?.product || ""} ${item?.category || ""}`.toLowerCase();
  return /ceiling\s*plank/i.test(text);
}

function isWoodenBaluster(item) {
  const text =
    `${item?.materialType || ""} ${item?.product || ""} ${item?.category || ""}`.toLowerCase();
  return /baluster/i.test(text);
}

function isDoorFrame(item) {
  const text = `${item?.materialType || ''} ${item?.category || ''}`.toLowerCase();
  return /door\s*frame/i.test(text);
}

function parseDoorFrameDimensions(name) {
  if (!name) return null;
  const sectionMatch = name.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*feet/i);
  const heightMatch = name.match(/(\d+)'(\d+)"/);
  const widthMatches = [...name.matchAll(/(\d+)'(\d+)"/g)];
  if (!sectionMatch) return null;
  return {
    sectionWidth: parseFloat(sectionMatch[1]),
    sectionThickness: parseFloat(sectionMatch[2]),
    heightFt: heightMatch ? parseFloat(heightMatch[1]) : '',
    heightIn: heightMatch ? parseFloat(heightMatch[2]) : '',
    widthFt: widthMatches[1] ? parseFloat(widthMatches[1][1]) : '',
    widthIn: widthMatches[1] ? parseFloat(widthMatches[1][2]) : '',
  };
}

function parseWoodDimensions(name) {
  if (!name) return null;
  const match = name.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:½|¼|¾|\.\d+)?)/i);
  if (!match) return null;
  let width = parseFloat(match[1]);
  let thickness = match[2];
  if (thickness.includes("½"))
    thickness = parseFloat(thickness.replace("½", "")) + 0.5 || 0.5;
  else if (thickness.includes("¼"))
    thickness = parseFloat(thickness.replace("¼", "")) + 0.25 || 0.25;
  else if (thickness.includes("¾"))
    thickness = parseFloat(thickness.replace("¾", "")) + 0.75 || 0.75;
  else thickness = parseFloat(thickness);
  return { width, thickness };
}

function parseBalusterDimensions(name) {
  if (!name) return null;
  const sizeMatch = name.match(
    /(\d+(?:\.\d+)?)\s*["']?\s*[x×X]\s*(\d+(?:\.\d+)?)\s*["']?/i,
  );
  if (!sizeMatch) return null;
  const width = parseFloat(sizeMatch[1]);
  const thickness = parseFloat(sizeMatch[2]);
  const lengthMatch = name.match(/[-–]\s*(\d+(?:\.\d+)?)\s*(feet|ft|foot)/i);
  const lengthFeet = lengthMatch ? parseFloat(lengthMatch[1]) : 0;
  return { width, thickness, lengthFeet };
}

function parseSolidSurfaceDimensions(name) {
  if (!name) return null;
  let thickness = null;
  const mmMatch = name.match(/(\d+(?:\.\d+)?)\s*mm/i);
  if (mmMatch) thickness = parseFloat(mmMatch[1]);
  let cleanName = name.replace(/\d+(?:\.\d+)?\s*mm/gi, "").trim();
  const match = cleanName.match(
    /(\d+(?:\.\d+)?)\s*["']?\s*[x×X]\s*(\d+(?:\.\d+)?)/i,
  );
  if (!match) return null;
  let w = parseFloat(match[1]);
  let h = parseFloat(match[2]);
  if (isNaN(w) || isNaN(h) || w === 0 || h === 0) return null;
  let wFeet, hFeet;
  if (w > 50 || h > 50) {
    wFeet = w / 12;
    hFeet = h / 12;
  } else {
    wFeet = w;
    hFeet = h;
  }
  const areaSqft = wFeet * hFeet;
  return {
    widthFeet: Math.round(wFeet * 10000) / 10000,
    heightFeet: Math.round(hFeet * 10000) / 10000,
    areaPerPiece: Math.round(areaSqft * 1000) / 1000,
    thickness,
    widthOrig: w,
    heightOrig: h,
  };
}

function calculateDoorFrameCFT(item) {
  const w = parseFloat(item.dfSectionWidth || 0);
  const t = parseFloat(item.dfSectionThickness || 0);
  const heightFt = parseFloat(item.dfHeightFt || 0) + parseFloat(item.dfHeightIn || 0) / 12;
  const widthFt = parseFloat(item.dfWidthFt || 0) + parseFloat(item.dfWidthIn || 0) / 12;
  const frames = parseFloat(item.quantity || 1);
  const verticalQty = parseFloat(item.dfVerticalQty || 2);
  const horizontalQty = parseFloat(item.dfHorizontalQty || 1);
  if (!w || !t || !heightFt || !widthFt) return 0;
  const vertical = (w * t * heightFt * verticalQty) / 144;
  const horizontal = (w * t * widthFt * horizontalQty) / 144;
  const totalCFT = (vertical + horizontal) * frames;
  return Math.round(totalCFT * 1000) / 1000;
}

function calculateByUnit(item) {
  const qty = parseFloat(item.quantity || 0);
  const rate = parseFloat(item.rate || 0);
  if (isSolidSurface(item)) {
    const customL = parseFloat(item.customLength || 0);
    const customW = parseFloat(item.customWidth || 0);
    let areaPerPc = item.areaPerPiece || 0;
    if (customL > 0 && customW > 0) areaPerPc = customL * customW;
    const totalSqft = areaPerPc * qty;
    return {
      calculatedQty: Math.round(totalSqft * 1000) / 1000,
      amount: Math.round(totalSqft * rate * 100) / 100,
    };
  }

  if (isDoorFrame(item)) {
  // Per Piece mode
  if (item.unit === "Per Piece") {
    return {
      calculatedQty: qty,
      amount: Math.round(qty * rate * 100) / 100,
    };
  }
  // CFT mode (default)
  const totalCFT = calculateDoorFrameCFT(item);
  return {
    calculatedQty: totalCFT,
    amount: Math.round(totalCFT * rate * 100) / 100,
  };
}

  if (isCeilingPlank(item)) {
    const customL = parseFloat(item.customLength || 0);
    const customW = parseFloat(item.customWidth || 0);
    let areaPerPc = item.areaPerPiece || 0;
    if (customL > 0 && customW > 0) areaPerPc = customL * customW;
    let calculatedQty = qty;
    if (item.unit === "SQFT") calculatedQty = areaPerPc * qty;
    else if (item.unit === "RFT")
      calculatedQty = (customL || item.width || 0) * qty;
    else calculatedQty = qty;
    return {
      calculatedQty: Math.round(calculatedQty * 1000) / 1000,
      amount: Math.round(calculatedQty * rate * 100) / 100,
    };
  }
  if (isWoodenBaluster(item)) {
    const width = parseFloat(item.width || 0);
    const thickness = parseFloat(item.thickness || 0);
    const lengthFeet =
      parseFloat(item.lengthFeet || 0) +
      parseFloat(item.lengthInches || 0) / 12;
    let calculatedQty = qty;
    if (item.unit === "CFT")
      calculatedQty = (width * thickness * lengthFeet * qty) / 144;
    else calculatedQty = qty;
    return {
      calculatedQty: Math.round(calculatedQty * 1000) / 1000,
      amount: Math.round(calculatedQty * rate * 100) / 100,
    };
  }
  if (isWoodenCladding(item)) {
    const width = parseFloat(item.width || 0);
    const lengthFeet =
      parseFloat(item.lengthFeet || 0) +
      parseFloat(item.lengthInches || 0) / 12;
    let calculatedQty = qty;
    if (item.unit === "SQFT") calculatedQty = (width * lengthFeet * qty) / 12;
    else if (item.unit === "RFT") calculatedQty = lengthFeet * qty;
    else calculatedQty = qty;
    return {
      calculatedQty: Math.round(calculatedQty * 1000) / 1000,
      amount: Math.round(calculatedQty * rate * 100) / 100,
    };
  }
  if (isTimberWood(item) || (item.isWood && !item.isSheet)) {
    const width = parseFloat(item.width || 0);
    const thickness = parseFloat(item.thickness || 0);
    const lengthFeet =
      parseFloat(item.lengthFeet || 0) +
      parseFloat(item.lengthInches || 0) / 12;
    let calculatedQty = qty;
    switch (item.unit) {
      case "CFT":
        calculatedQty = (width * thickness * lengthFeet * qty) / 144;
        break;
      case "RFT":
        calculatedQty = lengthFeet * qty;
        break;
      case "SQFT":
        calculatedQty = (width * lengthFeet * qty) / 12;
        break;
      case "Per Piece":
      default:
        calculatedQty = qty;
    }
    return {
      calculatedQty: Math.round(calculatedQty * 1000) / 1000,
      amount: Math.round(calculatedQty * rate * 100) / 100,
    };
  }
  if (item.isSheet && item.unit === "SQFT") {
    const customL = parseFloat(item.customLength || 0);
    const customW = parseFloat(item.customWidth || 0);
    let areaPerPc = item.areaPerPiece || 0;
    if (customL > 0 && customW > 0) areaPerPc = customL * customW;
    const totalSqft = areaPerPc * qty;
    return {
      calculatedQty: Math.round(totalSqft * 1000) / 1000,
      amount: Math.round(totalSqft * rate * 100) / 100,
    };
  }
  if (item.isSheet && (item.unit === "Per Piece" || item.unit === "Pcs")) {
    return { calculatedQty: qty, amount: Math.round(qty * rate * 100) / 100 };
  }
  return { calculatedQty: qty, amount: Math.round(qty * rate * 100) / 100 };
}

function calculateChargeAmount(charge) {
  const qty = parseFloat(charge.quantity || 0);
  const rate = parseFloat(charge.rate || 0);
  if (charge.unit === "Lump Sum") return Math.round(rate * 100) / 100;
  return Math.round(qty * rate * 100) / 100;
}

function numberToWords(num) {
  if (num === 0 || isNaN(num) || num === undefined || num === null)
    return "Zero Rupees Only";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  function convert(n) {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + convert(n % 100) : "")
      );
    if (n < 100000)
      return (
        convert(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + convert(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        convert(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + convert(n % 100000) : "")
      );
    return (
      convert(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + convert(n % 10000000) : "")
    );
  }
  const i = Math.floor(num);
  const d = Math.round((num - i) * 100);
  const rupeesPart = convert(i);
  const paisePart = d > 0 ? " and " + convert(d) + " Paise" : "";
  return (
    (rupeesPart ? rupeesPart + " Rupees" : "Zero Rupees") + paisePart + " Only"
  );
}

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  allowCustom = false,
  T,
  displayValue = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapRef = useRef(null);
  const isInternalChange = useRef(false);
  const getVal = (o) => (typeof o === "string" ? o : (o.value ?? o.label ?? o));
  const getDisp = (o) =>
    typeof o === "string" ? o : (o.label ?? o.value ?? o);
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (
      displayValue !== undefined &&
      displayValue !== null &&
      displayValue !== ""
    ) {
      setInputValue(displayValue);
      return;
    }
    if (!value) {
      setInputValue("");
      return;
    }
    const match = options.find((o) => getVal(o) === value);
    if (match) {
      setInputValue(getDisp(match));
    } else if (allowCustom) {
      setInputValue(value);
    } else {
      setInputValue("");
    }
  }, [value, displayValue, options, allowCustom]);
  const commit = (val, disp) => {
    isInternalChange.current = true;
    setInputValue(disp);
    setIsOpen(false);
    onChange(val);
  };
  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);
  const filtered = options.filter((o) =>
    getDisp(o)
      .toLowerCase()
      .includes((inputValue || "").toLowerCase()),
  );
  const exactMatch = options.find(
    (o) => getDisp(o).toLowerCase() === (inputValue || "").trim().toLowerCase(),
  );
  return (
    <div ref={wrapRef} className="searchable-select">
      <div className="ss-input-wrap">
        <input
          type="text"
          className="ss-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
              setIsOpen(true);
              e.preventDefault();
            }
            if (e.key === "Escape") setIsOpen(false);
          }}
          disabled={disabled}
          style={{
            background: T?.inputBg,
            color: T?.textDark,
            borderColor: T?.borderSoft,
          }}
        />
        <div className="ss-icons">
          {inputValue && !disabled && (
            <button
              type="button"
              className="ss-clear"
              onClick={() => commit("", "")}
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown
            className={`ss-arrow ${isOpen ? "open" : ""}`}
            style={{ color: T?.textMuted }}
          />
        </div>
      </div>
      {isOpen && !disabled && (
        <div
          className="ss-dropdown"
          style={{ background: T?.cardBg, borderColor: T?.borderSoft }}
        >
          {filtered.length > 0 &&
            filtered.map((o, idx) => (
              <div
                key={`ss-opt-${getVal(o)}-${idx}`}
                className={`ss-option ${getVal(o) === value ? "selected" : ""}`}
                onClick={() => commit(getVal(o), getDisp(o))}
                style={{ color: T?.textDark }}
              >
                {getDisp(o)}
              </div>
            ))}
          {allowCustom && inputValue.trim() && !exactMatch && (
            <div
              key="ss-custom-entry"
              className="ss-option"
              onClick={() => commit(inputValue.trim(), inputValue.trim())}
              style={{
                color: T?.maroon,
                fontWeight: 600,
                borderTop: `1px dashed ${T?.borderSoft}`,
              }}
            >
              ✏️ Use: &quot;{inputValue.trim()}&quot;
            </div>
          )}
          {filtered.length === 0 && !(allowCustom && inputValue.trim()) && (
            <div
              key="ss-no-results"
              className="ss-no-results"
              style={{
                padding: "10px",
                color: T?.textMuted,
                textAlign: "center",
              }}
            >
              No results
            </div>
          )}
        </div>
      )}
    </div>
  );
}



const PRINT_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:15px;color:#000;background:#f5f5f5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page-wrapper{width:210mm;min-height:297mm;margin:10px auto;background:#fff;box-shadow:0 0 10px rgba(0,0,0,0.1);display:flex;flex-direction:column;}
.page-content{padding:0;flex:1;display:flex;flex-direction:column;}
.action-bar{display:flex;gap:12px;justify-content:center;padding:14px 20px;background:linear-gradient(135deg,#FBF6F0,#F0E6DA);border-bottom:2px solid #E8DCC8;}
.action-btn{padding:10px 28px;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all 0.2s;letter-spacing:0.3px;}
.btn-print{background:linear-gradient(135deg,#5a1515,#7B1E1E);color:#fff;box-shadow:0 2px 8px rgba(123,30,30,0.3)}
.btn-print:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(123,30,30,0.4)}
.btn-save{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;box-shadow:0 2px 8px rgba(59,130,246,0.3)}
.btn-save:hover{transform:translateY(-1px)}
.btn-close{background:#fff;color:#333;border:1px solid #ddd;box-shadow:0 1px 4px rgba(0,0,0,0.1)}
.ktp-header{background:linear-gradient(135deg,#5a1515,#7B1E1E,#9a2828);color:#fff;padding:22px 30px 20px;display:flex;align-items:center;gap:24px;}
.ktp-logo-circle{width:100px;height:100px;border-radius:50%;border:4px solid rgba(255,255,255,0.95);background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;box-shadow:0 3px 12px rgba(0,0,0,0.3);}
.ktp-logo-circle img{width:100%;height:100%;object-fit:cover}
.ktp-header-center{flex:1;text-align:center}
.ktp-brand-name{font-size:54px;font-style:italic;font-weight:bold;font-family:Georgia,'Times New Roman',serif;line-height:1;text-shadow:2px 2px 3px rgba(0,0,0,0.25);letter-spacing:1px}
.ktp-brand-sub{font-size:26px;font-family:Georgia,'Times New Roman',serif;font-style:italic;letter-spacing:4px;opacity:0.98;margin-top:4px}
.ktp-brand-addr{font-size:12.5px;margin-top:8px;opacity:1;letter-spacing:0.2px;font-weight:600;white-space:nowrap;}
.ktp-header-right-space{width:100px;flex-shrink:0}
.ktp-meta{display:flex;justify-content:space-between;align-items:flex-start;border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:1.5px solid #7B1E1E;padding:7px 18px;background:#FBF6F0;}
.ktp-meta-left{display:flex;flex-direction:column;gap:2px}
.ktp-since{font-size:11.5px;font-style:italic;color:#5a4040;font-weight:500}
.ktp-gstin{font-size:13.5px;font-weight:bold;color:#7B1E1E;letter-spacing:0.5px}
.ktp-cust-gst{font-size:12px;font-weight:600;color:#000;margin-top:2px;}
.ktp-cust-gst-value{border-bottom:1px solid #555;display:inline-block;min-width:160px;padding-bottom:1px;font-weight:700;}
.ktp-dc-box{text-align:right}
.ktp-dc-title{font-size:20px;font-weight:bold;color:#7B1E1E;text-transform:uppercase;letter-spacing:2px;padding:2px 12px;display:inline-block;}
.ktp-dc-details{font-size:13px;margin-top:3px;color:#222;font-weight:500}
.ktp-info{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-bottom:1.5px solid #7B1E1E;padding:8px 14px 10px;background:#fff;}
.ktp-info-title-box{font-size:13px;font-weight:bold;color:#7B1E1E;letter-spacing:0.3px;display:inline-block;border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;padding:2px 10px;white-space:nowrap;}
.ktp-compact-row{display:flex;align-items:baseline;gap:18px;margin-bottom:7px;}
.ktp-compact-row:last-child{margin-bottom:0;}
.ktp-compact-field{display:flex;align-items:baseline;gap:6px;flex:1;min-width:0;}
.ktp-compact-field.flex-name{flex:2;}
.ktp-compact-label{font-size:12.5px;font-weight:600;color:#555;white-space:nowrap;}
.ktp-compact-value{font-size:13.5px;font-weight:700;color:#000;border-bottom:1px solid #777;flex:1;padding-bottom:1px;min-width:60px;line-height:1.3;min-height:16px;word-break:break-word;padding-left:3px;}
.ktp-table-wrap{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;flex:1;}
table.items{width:100%;border-collapse:collapse}
table.items thead tr{background:linear-gradient(135deg,#5a1515,#7B1E1E)}
table.items th{padding:8px 10px;font-size:13px;font-weight:bold;color:#fff;text-align:center;border-right:1px solid rgba(255,255,255,0.2);text-transform:uppercase;letter-spacing:0.5px;}
table.items th:last-child{border-right:none}
table.items th.tl{text-align:left}
table.items tbody tr{border-bottom:1px solid #ddd}
table.items tbody tr:nth-child(even){background:#FAFAFA}
table.items tbody tr:nth-child(odd){background:#fff}
table.items td{padding:6px 10px;font-size:14px;border-right:1px solid #d8d8d8;vertical-align:top;line-height:1.4;color:#000;font-weight:500}
table.items td:last-child{border-right:none}
table.items td.r{text-align:right;font-variant-numeric:tabular-nums}
table.items td.c{text-align:center}
table.items .item-detail{font-size:11.5px;color:#444;font-style:italic;font-weight:400;display:inline !important;}
table.items .erow td{height:18px;border-right:1px solid #e0e0e0}
table.items .erow td:last-child{border-right:none}
.ktp-words{border-left:2px solid #7B1E1E;border-right:2px solid #7B1E1E;border-top:2px solid #7B1E1E;padding:6px 18px;background:#FDF8F2;}
.ktp-words-label{font-size:10.5px;font-weight:bold;color:#7B1E1E;text-transform:uppercase;letter-spacing:1px}
.ktp-words-text{font-size:13px;font-weight:700;color:#222;margin-top:1px}
.ktp-footer{border:2px solid #7B1E1E;border-top:2px solid #7B1E1E;display:flex;background:#fff;page-break-inside:avoid;}
.ktp-footer-left{flex:1;padding:6px 14px;border-right:2px solid #7B1E1E;display:flex;flex-direction:column;justify-content:space-between;}
.ktp-footer-cert{font-size:10px;color:#7B1E1E;line-height:1.3;font-weight:700;margin-bottom:2px;}
.ktp-footer-for{font-size:12px;font-weight:bold;color:#7B1E1E;margin-top:4px}
.ktp-footer-terms{display:none;}
.ktp-terms-section{}
.ktp-terms-list{list-style:none;padding:0;margin:4px 0 0 0;}
.ktp-terms-list li{font-size:9px;color:#222;line-height:1.2;padding-left:12px;position:relative;font-weight:600;letter-spacing:0.2px;margin-bottom:2px;}
.ktp-terms-list li:last-child{margin-bottom:0;}
.ktp-terms-list li:before{content:"•";color:#7B1E1E;font-weight:bold;font-size:13px;position:absolute;left:2px;top:-1px;}
.ktp-sig-area{display:flex;justify-content:space-between;align-items:flex-end;margin-top:6px;gap:10px;padding-bottom:20px;}
.ktp-sig-box{text-align:center;flex:1;}
.ktp-sig-line{width:100%;max-width:120px;border-top:1.5px solid #000;margin:0 auto 2px;}
.ktp-sig-label{font-size:9px;color:#222;font-weight:700;}
.ktp-footer-for-inline{font-size:12px;font-weight:bold;color:#7B1E1E;margin-bottom:30px;text-align:center;}
.ktp-footer-right{width:240px;display:flex;flex-direction:column;justify-content:space-between;}
.ktp-charge-section{border-bottom:1.5px solid #7B1E1E}
.ktp-charge-header{padding:3px 12px;font-size:10px;font-weight:bold;color:#7B1E1E;text-transform:uppercase;letter-spacing:0.5px;background:#FDF8F2;border-bottom:1px solid #E8DCC8;}
.ktp-charge-row{display:flex;justify-content:space-between;padding:3px 12px;font-size:11px;color:#222;border-bottom:1px solid #f0e6da;font-weight:500}
.ktp-charge-row:last-child{border-bottom:none}
.ktp-charge-name{max-width:150px;overflow:hidden;text-overflow:ellipsis}
.ktp-charge-amt{font-weight:700;font-variant-numeric:tabular-nums}
.ktp-total-row{display:flex;justify-content:space-between;padding:4px 12px;font-size:12px;border-bottom:1px solid #E8DCC8;color:#222;}
.ktp-total-row .ktp-total-label{font-weight:600}
.ktp-total-row .ktp-total-val{font-weight:700;font-variant-numeric:tabular-nums}
.ktp-total-row.grand{background:linear-gradient(135deg,#5a1515,#7B1E1E);color:#fff;font-size:14px;font-weight:bold;border-bottom:none;padding:6px 12px;}
.ktp-total-row.grand .ktp-total-val{letter-spacing:0.5px}
.ktp-sig-right{display:none;}
.ktp-eoe-line{padding:2px 12px;font-size:9px;color:#666;text-align:right;border-top:1px solid #E8DCC8;letter-spacing:0.5px;font-weight:500}
.ktp-no-price-box{padding:22px 14px;text-align:center;color:#7B1E1E;font-weight:bold;font-size:14px;flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:5px;}
@media print{
html{margin:0!important;padding:0!important}
body{margin:0!important;padding:0!important;background:#fff!important;font-size:15px!important}
.action-bar{display:none!important}
.page-wrapper{width:100%!important;min-height:100%!important;margin:0!important;padding:0!important;box-shadow:none!important}
.page-content{min-height:100%!important}
.ktp-header{background:#7B1E1E!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
table.items thead tr{background:#7B1E1E!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
table.items th{color:#fff!important}
.ktp-total-row.grand{background:#7B1E1E!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ktp-charge-header{background:#FDF8F2!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ktp-table-wrap{flex:1!important}
}
@page{size:A4;margin:0}
`;



// function getChallanPrintHTML(
//   order,
//   challan,
//   hidePrice = false,
//   chargesList = [],
//   gstRate = 0,
//   gstAmount = 0,
// ) {
//   const regularItems = (challan.items || []).filter((it) => !it.isCharge);
//   const itemsTotal = regularItems.reduce(
//     (s, it) => s + parseFloat(it.amount || 0),
//     0,
//   );
//   const chargesTotal = chargesList.reduce((s, ch) => s + ch.amount, 0);
//   const subTotalWithCharges = itemsTotal + chargesTotal;
//   const calculatedGST =
//     gstRate > 0 ? (subTotalWithCharges * gstRate) / 100 : gstAmount || 0;
//   const finalGrandTotal = subTotalWithCharges + calculatedGST;
//   const challanTotal = hidePrice ? 0 : finalGrandTotal;

//   let sno = 0;
//   const formatQty = (val) => {
//     const num = parseFloat(val || 0);
//     if (isNaN(num)) return val || "0";
//     return num % 1 === 0 ? num.toString() : parseFloat(num.toFixed(3)).toString();
//   };
//   const itemRows = regularItems.map((it) => {
//     sno++;
//     let qtyVal = formatQty(it.calculatedQty || it.sentQty);
//     let qtyWithUnit = it.unit ? `${qtyVal} ${it.unit}` : qtyVal;
//     if (
//       it.isSheet &&
//       it.unit === "SQFT" &&
//       parseFloat(it.sentQty || it.quantity || 0) > 0
//     ) {
//       const pcs = formatQty(it.sentQty || it.quantity || 0);
//       qtyWithUnit = `${qtyVal} ${it.unit} <span class="item-detail">(${pcs} pcs)</span>`;
//     }
//     let descText = `<strong>${it.product}</strong>`;
//     let details = [];
//     if (it.size) details.push(it.size);
//     if (it.specification?.trim()) details.push(`(${it.specification})`);
//     const ld = it.lengthDisplay || "";
//     if (ld && ld !== "0'-0\"" && ld !== "'-\"" && ld !== "-") details.push(ld);
//     if (details.length)
//       descText += ` <span class="item-detail" style="display:inline;">${details.join(" · ")}</span>`;
//     return `<tr>
//       <td class="c">${sno}</td>
//       <td class="tl">${descText}</td>
//       ${
//         !hidePrice
//           ? `
//         <td class="r">${qtyWithUnit}</td>
//         <td class="r">₹${parseFloat(it.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
//         <td class="r"><strong>₹${parseFloat(it.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></td>
//       `
//           : `<td class="r">${qtyWithUnit}</td>`
//       }
//     </tr>`;
//   });

//   const minRows = 15;

//   const emptyCount = Math.max(0, minRows - itemRows.length);
//   const colCount = hidePrice ? 3 : 5;
//   let emptyRows = "";
//   for (let i = 0; i < emptyCount; i++) {
//     let cells = "";
//     for (let j = 0; j < colCount; j++) cells += `<td>&nbsp;</td>`;
//     emptyRows += `<tr class="erow">${cells}</tr>`;
//   }

//   let chargesHtml = "";
//   if (chargesList.length > 0 && !hidePrice) {
//     chargesHtml = `<div class="ktp-charge-section"><div class="ktp-charge-header">ADDITIONAL CHARGES</div>${chargesList.map((ch) => `<div class="ktp-charge-row"><span class="ktp-charge-name">${ch.name}</span><span class="ktp-charge-amt">₹${ch.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>`).join("")}</div>`;
//   }

//   let footerRightContent = "";
//   if (!hidePrice) {
//     footerRightContent = `
//       ${chargesHtml}
//       <div class="ktp-total-row">
//         <span class="ktp-total-label">Items Total</span>
//         <span class="ktp-total-val">₹${itemsTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
//       </div>
//       ${
//         chargesTotal > 0
//           ? `
//         <div class="ktp-total-row">
//           <span class="ktp-total-label">Charges Total</span>
//           <span class="ktp-total-val">₹${chargesTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
//         </div>
//       `
//           : ""
//       }
//       ${
//         gstRate > 0
//           ? `
//         <div class="ktp-total-row">
//           <span class="ktp-total-label">Sub Total</span>
//           <span class="ktp-total-val">₹${subTotalWithCharges.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
//         </div>
//         <div class="ktp-total-row">
//           <span class="ktp-total-label">GST (${gstRate}%)</span>
//           <span class="ktp-total-val">₹${calculatedGST.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
//         </div>
//       `
//           : ""
//       }
//       <div class="ktp-total-row grand">
//         <span class="ktp-total-label">GRAND TOTAL</span>
//         <span class="ktp-total-val">₹${challanTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
//       </div>
//       <div class="ktp-eoe-line">E. &amp; O.E.</div>
//     `;
//   } else {
//     footerRightContent = `<div class="ktp-no-price-box"><div style="font-size:22px;">📋</div><div>DELIVERY CHALLAN</div><div style="font-size:9px;font-weight:normal;color:#999;">For Goods Reference Only</div></div><div class="ktp-eoe-line">E. &amp; O.E.</div>`;
//   }

//   const consigneeInfoHTML = `
//     <div class="ktp-compact-row">
//       <span class="ktp-info-title-box">CONSIGNOR (DETAILS OF RECEIVER)</span>
//       <div class="ktp-compact-field">
//         <span class="ktp-compact-label">Phone No.:</span>
//         <span class="ktp-compact-value">${order.customerPhone || ""}</span>
//       </div>
//       <div class="ktp-compact-field">
//         <span class="ktp-compact-label">Vehicle No.:</span>
//         <span class="ktp-compact-value">${order.vehicleNo || ""}</span>
//       </div>
//     </div>
//     <div class="ktp-compact-row">
//       <div class="ktp-compact-field flex-name">
//         <span class="ktp-compact-label">Name:</span>
//         <span class="ktp-compact-value">${order.customerName || ""}</span>
//       </div>
//       <div class="ktp-compact-field">
//         <span class="ktp-compact-label">PO No.:</span>
//         <span class="ktp-compact-value">${order.poNumber || ""}</span>
//       </div>
//     </div>
//     <div class="ktp-compact-row">
//       <div class="ktp-compact-field" style="flex:1;">
//         <span class="ktp-compact-label">Address:</span>
//         <span class="ktp-compact-value">${order.customerAddress || ""}</span>
//       </div>
//     </div>
//   `;

//   return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Challan ${challan.challanNo}</title><style>${PRINT_CSS}</style></head><body><div class="action-bar"><button class="action-btn btn-print" onclick="window.print()">🖨️ Print Challan</button><button class="action-btn btn-save" onclick="savePDF()">💾 Save as PDF</button><button class="action-btn btn-close" onclick="window.close()">✕ Close</button></div><div class="page-wrapper"><div class="page-content"><div class="ktp-header"><div class="ktp-logo-circle"><img src="/logo.jpeg" alt="KTP" /></div><div class="ktp-header-center"><div class="ktp-brand-name">Krishna</div><div class="ktp-brand-sub">Timber &amp; Plywoods</div><div class="ktp-brand-addr">${SHOP_INFO.address} &nbsp;|&nbsp; Ph.: ${SHOP_INFO.phone}, ${SHOP_INFO.phone2}</div></div><div class="ktp-header-right-space"></div></div><div class="ktp-meta"><div class="ktp-meta-left"><div class="ktp-since">Chhabra's Since 1979</div><div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div><div class="ktp-cust-gst">Cust. GST No.: <span class="ktp-cust-gst-value">${order.gstCustomerName || ""}</span></div></div><div class="ktp-dc-box"><div class="ktp-dc-title">DELIVERY CHALLAN</div><div class="ktp-dc-details">No.: <strong>${challan.challanNo}</strong> &nbsp;&nbsp;&nbsp; Date: <strong>${new Date(challan.challanDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</strong></div></div></div><div class="ktp-info">${consigneeInfoHTML}</div><div class="ktp-table-wrap"><table class="items"><thead><tr><th style="width:35px">S.No.</th><th class="tl">Description of Goods</th>${!hidePrice ? `<th style="width:95px">Quantity</th><th style="width:80px">Rate</th><th style="width:95px">Amount</th>` : `<th style="width:100px">Quantity</th>`}</tr></thead><tbody>${itemRows.join("")}${emptyRows}</tbody></table></div><div class="ktp-footer"><div class="ktp-footer-left"><div class="ktp-terms-section"><div class="ktp-footer-cert">Certified that the particulars given above are true and correct.</div><ul class="ktp-terms-list"><li>Goods once sold will not be taken back or exchanged.</li><li>All disputes are subject to Bhopal jurisdiction only.</li><li>Interest @2% per month will be charged on overdue payments.</li></ul></div><div class="ktp-sig-area"><div class="ktp-sig-box"><div class="ktp-sig-line"></div><div class="ktp-sig-label">Customer Signature</div></div><div class="ktp-sig-box"><div class="ktp-footer-for-inline">For : Krishna Timber &amp; Plywoods</div><div class="ktp-sig-line"></div><div class="ktp-sig-label">Authorised Signatory</div></div></div></div><div class="ktp-footer-right">${footerRightContent}</div></div></div></div><script>function savePDF(){var ab=document.querySelector('.action-bar');if(ab)ab.style.display='none';window.print();setTimeout(function(){if(ab)ab.style.display='flex';},1200);}</script></body></html>`;
// }


function getChallanPrintHTML(
  order,
  challan,
  hidePrice = false,
  chargesList = [],
  gstRate = 0,
  gstAmount = 0,
) {
  const regularItems = (challan.items || []).filter((it) => !it.isCharge);
  const itemsTotal = regularItems.reduce(
    (s, it) => s + parseFloat(it.amount || 0),
    0,
  );
  const chargesTotal = chargesList.reduce((s, ch) => s + ch.amount, 0);
  const subTotalWithCharges = itemsTotal + chargesTotal;
  const calculatedGST =
    gstRate > 0 ? (subTotalWithCharges * gstRate) / 100 : gstAmount || 0;
  const finalGrandTotal = subTotalWithCharges + calculatedGST;
  const challanTotal = hidePrice ? 0 : finalGrandTotal;

  let sno = 0;
  const formatQty = (val) => {
    const num = parseFloat(val || 0);
    if (isNaN(num)) return val || "0";
    return num % 1 === 0 ? num.toString() : parseFloat(num.toFixed(3)).toString();
  };
  const itemRows = regularItems.map((it) => {
    sno++;
    // let qtyVal = formatQty(it.calculatedQty || it.sentQty);
    // let qtyWithUnit = it.unit ? `${qtyVal} ${it.unit}` : qtyVal;
    // if (
    //   it.isSheet &&
    //   it.unit === "SQFT" &&
    //   parseFloat(it.sentQty || it.quantity || 0) > 0
    // ) {
    //   const pcs = formatQty(it.sentQty || it.quantity || 0);
    //   qtyWithUnit = `${qtyVal} ${it.unit} <span class="item-detail">(${pcs} pcs)</span>`;
    // }

    let qtyVal = formatQty(it.calculatedQty || it.sentQty);
let qtyWithUnit = it.unit ? `${qtyVal} ${it.unit}` : qtyVal;

// ✅ FIX: Column D (quantity) se pieces dikhao - CFT, RFT, SQFT sab mein
const pieces = parseFloat(it.quantity || 0);
const showPiecesUnits = ["CFT", "RFT", "SQFT"];

if (
  showPiecesUnits.includes(it.unit) &&
  pieces > 0
) {
  const pcs = formatQty(pieces);
  qtyWithUnit = `${qtyVal} ${it.unit} <span class="item-detail">(${pcs} pcs)</span>`;
}
    let descText = `<strong>${it.product}</strong>`;
    let details = [];

    // ✅ FIX: Size sirf tab add karo jab product name mein already nahi hai
    if (it.size) {
      const sizeWithoutSpaces = it.size.replace(/\s/g, '').toLowerCase();
      const productLower = (it.product || '').replace(/\s/g, '').toLowerCase();

      // Different size formats check karo (5.5x1.5, 5.5×1.5, etc.)
      const sizeVariations = [
        sizeWithoutSpaces,
        sizeWithoutSpaces.replace(/×/g, 'x'),
        sizeWithoutSpaces.replace(/x/g, '×'),
        sizeWithoutSpaces.replace(/"/g, ''),
        sizeWithoutSpaces.replace(/×/g, 'x').replace(/"/g, ''),
        sizeWithoutSpaces.replace(/x/g, '×').replace(/"/g, ''),
      ];

      const sizeAlreadyInName = sizeVariations.some(v => v && productLower.includes(v));

      if (!sizeAlreadyInName) {
        details.push(it.size);
      }
    }

    if (it.specification?.trim()) details.push(`(${it.specification})`);
    const ld = it.lengthDisplay || "";
    if (ld && ld !== "0'-0\"" && ld !== "'-\"" && ld !== "-") details.push(ld);
    if (details.length)
      descText += ` <span class="item-detail" style="display:inline;">${details.join(" · ")}</span>`;
    return `<tr>
      <td class="c">${sno}</td>
      <td class="tl">${descText}</td>
      ${
        !hidePrice
          ? `
        <td class="r">${qtyWithUnit}</td>
        <td class="r">₹${parseFloat(it.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
        <td class="r"><strong>₹${parseFloat(it.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></td>
      `
          : `<td class="r">${qtyWithUnit}</td>`
      }
    </tr>`;
  });

  const minRows = 15;

  const emptyCount = Math.max(0, minRows - itemRows.length);
  const colCount = hidePrice ? 3 : 5;
  let emptyRows = "";
  for (let i = 0; i < emptyCount; i++) {
    let cells = "";
    for (let j = 0; j < colCount; j++) cells += `<td>&nbsp;</td>`;
    emptyRows += `<tr class="erow">${cells}</tr>`;
  }

  let chargesHtml = "";
  if (chargesList.length > 0 && !hidePrice) {
    chargesHtml = `<div class="ktp-charge-section"><div class="ktp-charge-header">ADDITIONAL CHARGES</div>${chargesList.map((ch) => `<div class="ktp-charge-row"><span class="ktp-charge-name">${ch.name}</span><span class="ktp-charge-amt">₹${ch.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>`).join("")}</div>`;
  }

  let footerRightContent = "";
  if (!hidePrice) {
    footerRightContent = `
      ${chargesHtml}
      <div class="ktp-total-row">
        <span class="ktp-total-label">Items Total</span>
        <span class="ktp-total-val">₹${itemsTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
      </div>
      ${
        chargesTotal > 0
          ? `
        <div class="ktp-total-row">
          <span class="ktp-total-label">Charges Total</span>
          <span class="ktp-total-val">₹${chargesTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
      `
          : ""
      }
      ${
        gstRate > 0
          ? `
        <div class="ktp-total-row">
          <span class="ktp-total-label">Sub Total</span>
          <span class="ktp-total-val">₹${subTotalWithCharges.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="ktp-total-row">
          <span class="ktp-total-label">GST (${gstRate}%)</span>
          <span class="ktp-total-val">₹${calculatedGST.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
      `
          : ""
      }
      <div class="ktp-total-row grand">
        <span class="ktp-total-label">GRAND TOTAL</span>
        <span class="ktp-total-val">₹${challanTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
      </div>
      <div class="ktp-eoe-line">E. &amp; O.E.</div>
    `;
  } else {
    footerRightContent = `<div class="ktp-no-price-box"><div style="font-size:22px;">📋</div><div>DELIVERY CHALLAN</div><div style="font-size:9px;font-weight:normal;color:#999;">For Goods Reference Only</div></div><div class="ktp-eoe-line">E. &amp; O.E.</div>`;
  }

  const consigneeInfoHTML = `
    <div class="ktp-compact-row">
      <span class="ktp-info-title-box">CONSIGNOR (DETAILS OF RECEIVER)</span>
      <div class="ktp-compact-field">
        <span class="ktp-compact-label">Phone No.:</span>
        <span class="ktp-compact-value">${order.customerPhone || ""}</span>
      </div>
      <div class="ktp-compact-field">
        <span class="ktp-compact-label">Vehicle No.:</span>
        <span class="ktp-compact-value">${order.vehicleNo || ""}</span>
      </div>
    </div>
    <div class="ktp-compact-row">
      <div class="ktp-compact-field flex-name">
        <span class="ktp-compact-label">Name:</span>
        <span class="ktp-compact-value">${order.customerName || ""}</span>
      </div>
      <div class="ktp-compact-field">
        <span class="ktp-compact-label">PO No.:</span>
        <span class="ktp-compact-value">${order.poNumber || ""}</span>
      </div>
    </div>
    <div class="ktp-compact-row">
      <div class="ktp-compact-field" style="flex:1;">
        <span class="ktp-compact-label">Address:</span>
        <span class="ktp-compact-value">${order.customerAddress || ""}</span>
      </div>
    </div>
  `;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Challan ${challan.challanNo}</title><style>${PRINT_CSS}</style></head><body><div class="action-bar"><button class="action-btn btn-print" onclick="window.print()">🖨️ Print Challan</button><button class="action-btn btn-save" onclick="savePDF()">💾 Save as PDF</button><button class="action-btn btn-close" onclick="window.close()">✕ Close</button></div><div class="page-wrapper"><div class="page-content"><div class="ktp-header"><div class="ktp-logo-circle"><img src="/logo.jpeg" alt="KTP" /></div><div class="ktp-header-center"><div class="ktp-brand-name">Krishna</div><div class="ktp-brand-sub">Timber &amp; Plywoods</div><div class="ktp-brand-addr">${SHOP_INFO.address} &nbsp;|&nbsp; Ph.: ${SHOP_INFO.phone}, ${SHOP_INFO.phone2}</div></div><div class="ktp-header-right-space"></div></div><div class="ktp-meta"><div class="ktp-meta-left"><div class="ktp-since">Chhabra's Since 1979</div><div class="ktp-gstin">GSTIN : ${SHOP_INFO.gstin}</div><div class="ktp-cust-gst">Cust. GST No.: <span class="ktp-cust-gst-value">${order.gstCustomerName || ""}</span></div></div><div class="ktp-dc-box"><div class="ktp-dc-title">DELIVERY CHALLAN</div><div class="ktp-dc-details">No.: <strong>${challan.challanNo}</strong> &nbsp;&nbsp;&nbsp; Date: <strong>${new Date(challan.challanDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</strong></div></div></div><div class="ktp-info">${consigneeInfoHTML}</div><div class="ktp-table-wrap"><table class="items"><thead><tr><th style="width:35px">S.No.</th><th class="tl">Description of Goods</th>${!hidePrice ? `<th style="width:95px">Quantity</th><th style="width:80px">Rate</th><th style="width:95px">Amount</th>` : `<th style="width:100px">Quantity</th>`}</tr></thead><tbody>${itemRows.join("")}${emptyRows}</tbody></table></div><div class="ktp-footer"><div class="ktp-footer-left"><div class="ktp-terms-section"><div class="ktp-footer-cert">Certified that the particulars given above are true and correct.</div><ul class="ktp-terms-list"><li>Goods once sold will not be taken back or exchanged.</li><li>All disputes are subject to Bhopal jurisdiction only.</li><li>Interest @2% per month will be charged on overdue payments.</li></ul></div><div class="ktp-sig-area"><div class="ktp-sig-box"><div class="ktp-sig-line"></div><div class="ktp-sig-label">Customer Signature</div></div><div class="ktp-sig-box"><div class="ktp-footer-for-inline">For : Krishna Timber &amp; Plywoods</div><div class="ktp-sig-line"></div><div class="ktp-sig-label">Authorised Signatory</div></div></div></div><div class="ktp-footer-right">${footerRightContent}</div></div></div></div><script>function savePDF(){var ab=document.querySelector('.action-bar');if(ab)ab.style.display='none';window.print();setTimeout(function(){if(ab)ab.style.display='flex';},1200);}</script></body></html>`;
}


const apiGet = async (url) => {
  try {
    const r = await fetch(url);
    if (!r.ok) return { success: false, data: [] };
    return r.json();
  } catch {
    return { success: false, data: [] };
  }
};

const apiPost = async (url, body) => {
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await r.json();
  } catch (e) {
    return { success: false, error: e.message };
  }
};


const apiPut = async (url, body) => {
  try {
    const r = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await r.json();
  } catch (e) {
    return { success: false, error: e.message };
  }
};



const apiDelete = async (url, body) => {
  try {
    const r = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return r.json();
  } catch (e) {
    return { success: false, error: e.message };
  }
};

export default function ChallanOnlyBilling() {
  const [challans, setChallans] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showChallanForm, setShowChallanForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastChallanHTML, setLastChallanHTML] = useState("");
  const [lastChallanNo, setLastChallanNo] = useState("");
const [editingChallan, setEditingChallan] = useState(null);
const [savingToSheet, setSavingToSheet] = useState(null)


  // Challan form state
  const [challanForm, setChallanForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    vehicleNo: "",
    challanDate: new Date().toISOString().split("T")[0],
    gstRate: 0,
    notes: "",
    poNumber: "",
    gstCustomerName: "",
    hidePrice: false,
  });

  const [itemGroups, setItemGroups] = useState([createEmptyGroup()]);
  const [charges, setCharges] = useState([]);

  const T = darkMode ? DARK : LIGHT;

  function createEmptyItem(ov = {}) {
    return {
      uid: uid(),
      product: "",
      unit: "",
      lengthFeet: "",
      lengthInches: "",
      quantity: "",
      rate: "",
      amount: 0,
      calculatedQty: 0,
      skuCode: "",
      isWood: false,
      isSheet: false,
      width: 0,
      thickness: 0,
      size: "",
      materialType: "",
      category: "",
      subCategory: "",
      specification: "",
      areaPerPiece: null,
      customLength: "",
      customWidth: "",
      dfSectionWidth: "",
      dfSectionThickness: "",
      dfHeightFt: "",
      dfHeightIn: "",
      dfWidthFt: "",
      dfWidthIn: "",
      dfVerticalQty: '',
      dfHorizontalQty: '',
      ...ov,
    };
  }

  function createEmptyGroup() {
    return {
      groupId: uid(),
      filterMaterialType: "",
      filterCategory: "",
      filterSubCategory: "",
      items: [createEmptyItem()],
    };
  }

  function createEmptyCharge() {
    return {
      uid: uid(),
      chargeType: "",
      chargeName: "",
      chargeDescription: "",
      unit: "Per Piece",
      quantity: "",
      rate: "",
      amount: 0,
    };
  }

  const getAllItems = () =>
    itemGroups.flatMap((g) =>
      g.items.map((i) => ({
        ...i,
        filterMaterialType: g.filterMaterialType,
        filterCategory: g.filterCategory,
        filterSubCategory: g.filterSubCategory,
      })),
    );
  const itemsSubtotal = getAllItems().reduce((s, i) => s + (i.amount || 0), 0);
  const chargesSubtotal = charges.reduce((s, c) => s + (c.amount || 0), 0);
  const gstAmount = challanForm.gstRate > 0 ? (itemsSubtotal + chargesSubtotal) * (challanForm.gstRate / 100) : 0;
  const challanTotal = itemsSubtotal + chargesSubtotal + gstAmount;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cR, pR] = await Promise.all([
        apiGet("/api/billing-backend/challans"),
        apiGet("/api/dropdown-data"),
      ]);
      setChallans(cR.success ? cR.data : []);
      setProducts(pR.success && pR.data ? pR.data : []);
    } catch {
      setError("Data load problem");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const stored = localStorage.getItem("ktp-dark-mode");
    if (stored === "true") setDarkMode(true);
    const handleStorage = (e) => {
      if (e.key === "ktp-dark-mode") setDarkMode(e.newValue === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [fetchData]);

  const genChallanNo = () => {
    const y = new Date().getFullYear();
    const prefix = `CHL-${y}-`;
    const max = challans
      .filter((c) => c.challanNo?.startsWith(prefix))
      .reduce((m, c) => Math.max(m, parseInt(c.challanNo.replace(prefix, "")) || 0), 0);
    return `${prefix}${String(max + 1).padStart(4, "0")}`;
  };

  const resetForm = () => {
    setChallanForm({
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      vehicleNo: "",
      challanDate: new Date().toISOString().split("T")[0],
      gstRate: 0,
      notes: "",
      poNumber: "",
      gstCustomerName: "",
      hidePrice: false,
    });
    setItemGroups([createEmptyGroup()]);
    setCharges([]);
  };

  // Group & item handlers
  const updateGroupFilter = (gid, field, val) =>
    setItemGroups((prev) =>
      prev.map((g) => (g.groupId === gid ? { ...g, [field]: val } : g)),
    );
  const addItemToGroup = (gid) =>
    setItemGroups((prev) =>
      prev.map((g) =>
        g.groupId === gid ? { ...g, items: [...g.items, createEmptyItem()] } : g,
      ),
    );
  const removeItemFromGroup = (gid, iuid) =>
    setItemGroups((prev) =>
      prev.map((g) =>
        g.groupId === gid && g.items.length > 1
          ? { ...g, items: g.items.filter((i) => i.uid !== iuid) }
          : g,
      ),
    );
  const removeGroup = (gid) => {
    if (itemGroups.length > 1) setItemGroups((prev) => prev.filter((g) => g.groupId !== gid));
  };
  const addNewGroup = () => setItemGroups((prev) => [...prev, createEmptyGroup()]);



  const updateGroupItem = (gid, iuid, field, val) => {
  setItemGroups((prev) =>
    prev.map((g) => {
      if (g.groupId !== gid) return g;
      return {
        ...g,
        items: g.items.map((item) => {
          if (item.uid !== iuid) return item;
          let u = { ...item, [field]: val };

          if (field === "skuCode") {
            const found = products.find((p) => p.skuCode === val);
            if (found) {
              const isSheet = isSheetMaterial(found.materialName);
              const isWood = isTimberWood(found) && !isSheet;
              u = {
                ...u,
                product: found.materialName,
                skuCode: found.skuCode,
                materialType: found.materialType,
                category: found.category,
                subCategory: found.subCategory,
                isWood,
                isSheet,
              };
              if (isSolidSurface(u)) {
                u.unit = "SQFT";
                const dims = parseSolidSurfaceDimensions(found.materialName);
                if (dims) {
                  u.areaPerPiece = dims.areaPerPiece;
                  u.width = dims.widthFeet;
                  u.thickness = dims.thickness;
                  u.size = `${dims.widthOrig}"×${dims.heightOrig}"`;
                  u.customLength = dims.widthFeet;
                  u.customWidth = dims.heightFeet;
                }
              } else if (isCeilingPlank(u)) {
                u.unit = "SQFT";
                const dims = parseSheetDimensions(found.materialName);
                if (dims) {
                  u.areaPerPiece = dims.areaPerPiece;
                  u.width = dims.widthFeet;
                  u.thickness = dims.thickness;
                  u.size = `${dims.widthFeet}'×${dims.heightFeet}'`;
                  u.customLength = dims.widthFeet;
                  u.customWidth = dims.heightFeet;
                }
              } else if (isWoodenBaluster(u)) {
                u.unit = "Per Piece";
                const dims = parseBalusterDimensions(found.materialName);
                if (dims) {
                  u.width = dims.width;
                  u.thickness = dims.thickness;
                  u.lengthFeet = dims.lengthFeet;
                  u.lengthInches = "";
                  u.size = `${dims.width}"×${dims.thickness}" - ${dims.lengthFeet} ft`;
                }
              } else if (isWoodenCladding(u)) {
                u.unit = "Per Piece";
                const dims = parseWoodDimensions(found.materialName);
                if (dims) {
                  u.width = dims.width;
                  u.thickness = dims.thickness;
                  u.size = `${dims.width}×${dims.thickness}"`;
                }
              } else if (isDoorFrame(u)) {
                u.unit = "CFT";
                const dims = parseDoorFrameDimensions(found.materialName);
                if (dims) {
                  u.dfSectionWidth = dims.sectionWidth;
                  u.dfSectionThickness = dims.sectionThickness;
                  u.dfHeightFt = dims.heightFt;
                  u.dfHeightIn = dims.heightIn;
                  u.dfWidthFt = dims.widthFt;
                  u.dfWidthIn = dims.widthIn;
                }
              } else if (isSheet) {
                u.unit = "SQFT";
                const dims = parseSheetDimensions(found.materialName);
                if (dims) {
                  u.areaPerPiece = dims.areaPerPiece;
                  u.width = dims.widthFeet;
                  u.thickness = dims.thickness;
                  u.size = dims.isInches
                    ? `${dims.widthOrig}"×${dims.heightOrig}"`
                    : `${dims.widthFeet}'×${dims.heightFeet}'`;
                  u.customLength = dims.widthFeet;
                  u.customWidth = dims.heightFeet;
                }
                u.lengthFeet = "";
                u.lengthInches = "";
              } else if (isWood) {
                u.unit = /railing/i.test(found.materialName) ? "RFT" : "CFT";
                const dims = parseWoodDimensions(found.materialName);
                if (dims) {
                  u.width = dims.width;
                  u.thickness = dims.thickness;
                  u.size = `${dims.width}×${dims.thickness}"`;
                }
              } else {
                u.unit = found.unit || "Pcs";
                u.width = 0;
                u.thickness = 0;
                u.size = "";
                u.areaPerPiece = null;
              }
            } else if (!val) {
              u.product = "";
              u.skuCode = "";
            }
          }

          // if (field === "customProductName" && val?.trim()) {
          //   // ✅ FIX: tempItem mein materialType, category, subCategory bhi include karo
          //   const tempItem = {
          //     product: val,
          //     materialType: g.filterMaterialType || "",
          //     category: g.filterCategory || "",
          //     subCategory: g.filterSubCategory || "",
          //   };
            
          //   const isSheet = isSheetMaterial(val);
          //   const isWood = isTimberWood(tempItem) && !isSheet;
            
          //   u.product = val;
          //   u.skuCode = "";
          //   u.materialType = g.filterMaterialType || "Custom";
          //   u.category = g.filterCategory || "Custom";
          //   u.subCategory = g.filterSubCategory || "";
          //   u.isWood = isWood;
          //   u.isSheet = isSheet;

          //   // ✅ FIX: Saari check functions mein tempItem use karo (u ki jagah)
          //   if (isSolidSurface(tempItem)) {
          //     u.unit = "SQFT";
          //     const dims = parseSolidSurfaceDimensions(val);
          //     if (dims) {
          //       u.areaPerPiece = dims.areaPerPiece;
          //       u.width = dims.widthFeet;
          //       u.thickness = dims.thickness;
          //       u.size = `${dims.widthOrig}"×${dims.heightOrig}"`;
          //       u.customLength = dims.widthFeet;
          //       u.customWidth = dims.heightFeet;
          //     }
          //   } else if (isCeilingPlank(tempItem)) {
          //     u.unit = "SQFT";
          //     const dims = parseSheetDimensions(val);
          //     if (dims) {
          //       u.areaPerPiece = dims.areaPerPiece;
          //       u.width = dims.widthFeet;
          //       u.thickness = dims.thickness;
          //       u.size = `${dims.widthFeet}'×${dims.heightFeet}'`;
          //       u.customLength = dims.widthFeet;
          //       u.customWidth = dims.heightFeet;
          //     }
          //   } else if (isWoodenBaluster(tempItem)) {
          //     u.unit = "Per Piece";
          //     const dims = parseBalusterDimensions(val);
          //     if (dims) {
          //       u.width = dims.width;
          //       u.thickness = dims.thickness;
          //       u.lengthFeet = dims.lengthFeet;
          //       u.lengthInches = "";
          //       u.size = `${dims.width}"×${dims.thickness}" - ${dims.lengthFeet} ft`;
          //     }
          //   } else if (isWoodenCladding(tempItem)) {
          //     u.unit = "Per Piece";
          //     const dims = parseWoodDimensions(val);
          //     if (dims) {
          //       u.width = dims.width;
          //       u.thickness = dims.thickness;
          //       u.size = `${dims.width}×${dims.thickness}"`;
          //     }
          //   } else if (isDoorFrame(tempItem)) {
          //     u.unit = "CFT";
          //     const dims = parseDoorFrameDimensions(val);
          //     if (dims) {
          //       u.dfSectionWidth = dims.sectionWidth;
          //       u.dfSectionThickness = dims.sectionThickness;
          //       u.dfHeightFt = dims.heightFt;
          //       u.dfHeightIn = dims.heightIn;
          //       u.dfWidthFt = dims.widthFt;
          //       u.dfWidthIn = dims.widthIn;
          //     }
          //   } else if (isSheet) {
          //     u.unit = "SQFT";
          //     const dims = parseSheetDimensions(val);
          //     if (dims) {
          //       u.areaPerPiece = dims.areaPerPiece;
          //       u.width = dims.widthFeet;
          //       u.thickness = dims.thickness;
          //       u.size = dims.isInches
          //         ? `${dims.widthOrig}"×${dims.heightOrig}"`
          //         : `${dims.widthFeet}'×${dims.heightFeet}'`;
          //       u.customLength = dims.widthFeet;
          //       u.customWidth = dims.heightFeet;
          //     }
          //   } else if (isWood) {
          //     u.unit = /railing/i.test(val) ? "RFT" : "CFT";
          //     const dims = parseWoodDimensions(val);
          //     if (dims) {
          //       u.width = dims.width;
          //       u.thickness = dims.thickness;
          //       u.size = `${dims.width}×${dims.thickness}"`;
          //     }
          //   } else {
          //     if (!u.unit) u.unit = "Pcs";
          //   }
          // }


          if (field === "customProductName" && val?.trim()) {
  // ✅ FIX: tempItem mein materialType, category, subCategory bhi include karo
  const tempItem = {
    product: val,
    materialType: g.filterMaterialType || "",
    category: g.filterCategory || "",
    subCategory: g.filterSubCategory || "",
  };
  
  const isSheet = isSheetMaterial(val);
  const isWood = isTimberWood(tempItem) && !isSheet;
  
  u.product = val;
  u.skuCode = "";
  u.materialType = g.filterMaterialType || "Custom";
  u.category = g.filterCategory || "Custom";
  u.subCategory = g.filterSubCategory || "";
  u.isWood = isWood;
  u.isSheet = isSheet;

  // ✅ FIX: Saari check functions mein tempItem use karo (u ki jagah)
  if (isSolidSurface(tempItem)) {
    u.unit = "SQFT";
    const dims = parseSolidSurfaceDimensions(val);
    if (dims) {
      u.areaPerPiece = dims.areaPerPiece;
      u.width = dims.widthFeet;
      u.thickness = dims.thickness;
      u.size = `${dims.widthOrig}"×${dims.heightOrig}"`;
      u.customLength = dims.widthFeet;
      u.customWidth = dims.heightFeet;
    }
  } else if (isCeilingPlank(tempItem)) {
    u.unit = "SQFT";
    const dims = parseSheetDimensions(val);
    if (dims) {
      u.areaPerPiece = dims.areaPerPiece;
      u.width = dims.widthFeet;
      u.thickness = dims.thickness;
      u.size = `${dims.widthFeet}'×${dims.heightFeet}'`;
      u.customLength = dims.widthFeet;
      u.customWidth = dims.heightFeet;
    }
  } else if (isWoodenBaluster(tempItem)) {
    u.unit = "Per Piece";
    const dims = parseBalusterDimensions(val);
    if (dims) {
      u.width = dims.width;
      u.thickness = dims.thickness;
      u.lengthFeet = dims.lengthFeet;
      u.lengthInches = "";
      u.size = `${dims.width}"×${dims.thickness}" - ${dims.lengthFeet} ft`;
    }
  } else if (isWoodenCladding(tempItem)) {
    u.unit = "Per Piece";
    const dims = parseWoodDimensions(val);
    if (dims) {
      u.width = dims.width;
      u.thickness = dims.thickness;
      u.size = `${dims.width}×${dims.thickness}"`;
    }
  } else if (isDoorFrame(tempItem)) {
    u.unit = "CFT";
    const dims = parseDoorFrameDimensions(val);
    if (dims) {
      u.dfSectionWidth = dims.sectionWidth;
      u.dfSectionThickness = dims.sectionThickness;
      u.dfHeightFt = dims.heightFt;
      u.dfHeightIn = dims.heightIn;
      u.dfWidthFt = dims.widthFt;
      u.dfWidthIn = dims.widthIn;
    }
  } else if (isSheet) {
    u.unit = "SQFT";
    const dims = parseSheetDimensions(val);
    if (dims) {
      u.areaPerPiece = dims.areaPerPiece;
      u.width = dims.widthFeet;
      u.thickness = dims.thickness;
      u.size = dims.isInches
        ? `${dims.widthOrig}"×${dims.heightOrig}"`
        : `${dims.widthFeet}'×${dims.heightFeet}'`;
      u.customLength = dims.widthFeet;
      u.customWidth = dims.heightFeet;
    }
  } else if (isWood) {
    u.unit = /railing/i.test(val) ? "RFT" : "CFT";
    const dims = parseWoodDimensions(val);
    if (dims) {
      u.width = dims.width;
      u.thickness = dims.thickness;
      u.size = `${dims.width}×${dims.thickness}"`;
    }
  } else {
    if (!u.unit) u.unit = "Pcs";
  }
}


          if (field === "unit") u.unit = val;
          if (field === "quantity") u.quantity = val;
          if (field === "rate") u.rate = val;
          if (field === "lengthFeet") u.lengthFeet = val;
          if (field === "lengthInches") u.lengthInches = val;
          if (field === "specification") u.specification = val;
          if (field === "customLength") u.customLength = val;
          if (field === "customWidth") u.customWidth = val;
          if (['dfSectionWidth','dfSectionThickness','dfHeightFt','dfHeightIn','dfWidthFt','dfWidthIn','dfVerticalQty','dfHorizontalQty'].includes(field)) {
            u[field] = val;
          }

          const calc = calculateByUnit(u);
          u.calculatedQty = calc.calculatedQty;
          u.amount = calc.amount;
          return u;
        }),
      };
    }),
  );
};



  const addCharge = () => setCharges((prev) => [...prev, createEmptyCharge()]);
  const removeCharge = (cuid) => setCharges((prev) => prev.filter((c) => c.uid !== cuid));
  const updateCharge = (cuid, field, val) => {
    setCharges((prev) =>
      prev.map((c) => {
        if (c.uid !== cuid) return c;
        let u = { ...c, [field]: val };
        if (field === "chargeType") {
          const ct = CHARGE_TYPES.find((t) => t.value === val);
          if (ct) u.chargeName = ct.label;
        }
        if (field === "unit" && val === "Lump Sum") u.quantity = "";
        u.amount = calculateChargeAmount(u);
        return u;
      }),
    );
  };

const handleSubmitChallan = async () => {
  if (!challanForm.customerName || getAllItems().filter((i) => i.product).length === 0) {
    setError("Customer name aur at least ek item chahiye");
    return;
  }
  setSaving(true);
  setError(null);
  try {
    // If editing use same challanNo, else generate new
    const challanNo = editingChallan ? editingChallan.challanNo : genChallanNo();

    const validItems = getAllItems()
      .filter((i) => i.product && (i.quantity || i.calculatedQty))
      .map((it) => ({
        product: it.product,
        unit: it.unit,
        quantity: it.quantity,
        rate: it.rate,
        amount: it.amount,
        calculatedQty: it.calculatedQty,
        size: it.size,
        lengthDisplay: it.isWood ? `${it.lengthFeet || 0}'-${it.lengthInches || 0}"` : "",
        specification: it.specification || "",
        isSheet: it.isSheet,
        areaPerPiece: it.areaPerPiece,
        pieces: parseFloat(it.quantity || 0),
        sentQty: parseFloat(it.quantity || 0),
        orderedQty: it.calculatedQty,
      }));

    const validCharges = charges
      .filter((c) => c.chargeName && c.amount > 0)
      .map((ch) => ({
        name: ch.chargeName,
        type: ch.chargeType || "custom",
        unit: ch.unit || "Per Piece",
        quantity: ch.quantity || "",
        rate: ch.rate || "",
        amount: ch.amount,
      }));

    if (challanForm.gstRate > 0 && gstAmount > 0) {
      validCharges.push({
        name: `GST (${challanForm.gstRate}%)`,
        type: "gst",
        unit: "Percentage",
        quantity: challanForm.gstRate,
        rate: challanForm.gstRate,
        amount: gstAmount,
      });
    }

    const payload = {
      challan: {
        challanNo,
        orderNo: "",
        customerName: challanForm.customerName,
        customerPhone: challanForm.customerPhone,
        customerAddress: challanForm.customerAddress,
        vehicleNo: challanForm.vehicleNo,
        poNumber: challanForm.poNumber,
        gstCustomerName: challanForm.gstCustomerName,
        challanDate: challanForm.challanDate,
        deliveryNote: challanForm.notes,
        challanTotal,
        status: "Delivered",
        hidePrice: challanForm.hidePrice,
        gstRate: challanForm.gstRate,
        gstAmount,
        subtotal: itemsSubtotal,
        chargesTotal: chargesSubtotal,
      },
      items: validItems,
      charges: validCharges,
    };

    // If editing use PUT, else use POST
    let res;
    if (editingChallan) {
      res = await apiPut("/api/billing-backend/challans", payload);
    } else {
      res = await apiPost("/api/billing-backend/challans", payload);
    }

    if (!res.success) throw new Error(res.error);

    const html = getChallanPrintHTML(
      {
        customerName: challanForm.customerName,
        customerPhone: challanForm.customerPhone,
        customerAddress: challanForm.customerAddress,
        vehicleNo: challanForm.vehicleNo,
        poNumber: challanForm.poNumber,
        gstCustomerName: challanForm.gstCustomerName,
      },
      { ...payload.challan, items: validItems },
      challanForm.hidePrice,
      validCharges.filter((c) => c.type !== "gst"),
      challanForm.gstRate,
      gstAmount,
    );

    setLastChallanHTML(html);
    setLastChallanNo(challanNo);
    await fetchData();
    setShowChallanForm(false);
    setEditingChallan(null);
    resetForm();
    setShowSuccess(true);
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
};

  const handleDeleteChallan = async (challanNo) => {
    if (!confirm(`Delete challan ${challanNo}?`)) return;
    try {
      const res = await apiDelete("/api/billing-backend/challans", { challanNo });
      if (res.success) await fetchData();
      else setError(res.error);
    } catch (err) {
      setError(err.message);
    }
  };



const handleSaveToSheet = async (item, group) => {
  if (!item.product || item.skuCode) {
    setError("Yeh product already saved hai ya empty hai");
    return;
  }

  if (!confirm(`"${item.product}" ko Dropdown sheet mein save karna hai?`)) return;

  setSavingToSheet(item.uid); // ✅ Loading start
  
  try {
    const res = await apiPost("/api/dropdown-data", {
      product: {
        materialType: group.filterMaterialType || item.materialType || "Custom",
        category: group.filterCategory || item.category || "Custom",
        subCategory: group.filterSubCategory || item.subCategory || "",
        materialName: item.product,
        unit: item.unit || "Pcs",
      },
    });

    if (res.success) {
      // Refresh products list
      const pR = await apiGet("/api/dropdown-data");
      if (pR.success) setProducts(pR.data);
      
      // Update item with new SKU
      const newProduct = res.data?.[0];
      if (newProduct?.skuCode) {
        updateGroupItem(group.groupId, item.uid, "skuCode", newProduct.skuCode);
      }
      
      alert(`✅ Product saved! SKU: ${newProduct?.skuCode || "Generated"}`);
    } else {
      setError(res.error || "Save failed");
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setSavingToSheet(null); // ✅ Loading stop
  }
};


  const handleEditChallan = (ch) => {
  // Fill form with existing challan data
  setChallanForm({
    customerName: ch.customerName || "",
    customerPhone: ch.customerPhone || "",
    customerAddress: ch.customerAddress || "",
    vehicleNo: ch.vehicleNo || "",
    challanDate: ch.challanDate || new Date().toISOString().split("T")[0],
    gstRate: parseFloat(ch.gstRate) || 0,
    notes: ch.deliveryNote || "",
    poNumber: ch.poNumber || "",
    gstCustomerName: ch.gstCustomerName || "",
    hidePrice: ch.hidePrice || false,
  });

  // Build item groups from saved items
  const savedItems = (ch.items || []).filter(it => !it.isCharge);
  if (savedItems.length > 0) {
    const groupItems = savedItems.map(it => {
      const isSheet = isSheetMaterial(it.product);
      const isWood = isTimberWood(it) && !isSheet;
      const woodDims = isWood ? parseWoodDimensions(it.product) : null;
      const sheetDims = isSheet ? parseSheetDimensions(it.product) : null;

      // Parse length display back to feet and inches
      let lFeet = "";
      let lInches = "";
      if (it.lengthDisplay) {
        const lm = it.lengthDisplay.match(/(\d+(?:\.\d+)?)'-(\d+(?:\.\d+)?)"/);
        if (lm) {
          lFeet = lm[1] || "";
          lInches = lm[2] || "";
        }
      }

      return createEmptyItem({
        product: it.product || "",
        unit: it.unit || "",
        quantity: it.sentQty || it.quantity || "",
        rate: it.rate || "",
        amount: parseFloat(it.amount) || 0,
        calculatedQty: parseFloat(it.calculatedQty) || 0,
        size: it.size || "",
        lengthFeet: lFeet,
        lengthInches: lInches,
        isWood,
        isSheet,
        width: woodDims?.width || sheetDims?.widthFeet || 0,
        thickness: woodDims?.thickness || sheetDims?.thickness || 0,
        areaPerPiece: sheetDims?.areaPerPiece || null,
        customLength: sheetDims?.widthFeet || "",
        customWidth: sheetDims?.heightFeet || "",
        lengthDisplay: it.lengthDisplay || "",
        specification: it.specification || "",
      });
    });

    setItemGroups([{
      groupId: uid(),
      filterMaterialType: "",
      filterCategory: "",
      filterSubCategory: "",
      items: groupItems,
    }]);
  } else {
    setItemGroups([createEmptyGroup()]);
  }

  // Build charges from saved charges (exclude GST)
  const savedCharges = (ch.charges || []).filter(c => c.type !== "gst");
  if (savedCharges.length > 0) {
    const chargeItems = savedCharges.map(c => ({
      uid: uid(),
      chargeType: c.type || "",
      chargeName: c.name || "",
      chargeDescription: "",
      unit: c.unit || "Per Piece",
      quantity: c.quantity || "",
      rate: c.rate || "",
      amount: parseFloat(c.amount) || 0,
    }));
    setCharges(chargeItems);
  } else {
    setCharges([]);
  }

  setEditingChallan(ch);
  setShowChallanForm(true);
};

  const openPDFView = (html) => {
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  };
  const openPDFPrint = (html) => {
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      w.focus();
      w.print();
    }, 600);
  };

  const filteredChallans = challans.filter(
    (ch) =>
      !searchQuery ||
      ch.challanNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.customerName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Helper for product filtering (for searchable selects)
  const getAllMaterialTypes = () => [...new Set(products.map((p) => p.materialType).filter(Boolean))];
  const getCategoriesFor = (mt) => [...new Set(products.filter((p) => !mt || p.materialType === mt).map((p) => p.category).filter(Boolean))];
  const getSubCategoriesFor = (mt, cat) => [...new Set(products.filter((p) => (!mt || p.materialType === mt) && (!cat || p.category === cat)).map((p) => p.subCategory).filter(Boolean))];
  const getFilteredProductsForGroup = (g) => products.filter((p) => (!g.filterMaterialType || p.materialType === g.filterMaterialType) && (!g.filterCategory || p.category === g.filterCategory) && (!g.filterSubCategory || p.subCategory === g.filterSubCategory));

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
          background: T.pageBg,
          minHeight: "100vh",
        }}
      >
        <Loader2 className="animate-spin" style={{ color: T.maroon }} size={32} />
        <span style={{ marginLeft: 12, color: T.textDark, fontSize: 16 }}>Loading...</span>
      </div>
    );

  return (
    <div
      style={{
        background: T.pageBg,
        minHeight: "100vh",
        padding: "20px",
        transition: "background-color 0.3s ease",
      }}
    >
      <style>{`
        *{box-sizing:border-box}
        .kt-input{width:100%;padding:9px 13px;border:1px solid ${T.borderSoft};border-radius:10px;font-size:13px;background:${T.inputBg};color:${T.textDark};outline:none;transition:all 0.15s}
        .kt-input:focus{border-color:${T.maroon};box-shadow:0 0 0 3px ${darkMode ? "rgba(232,160,160,0.15)" : "rgba(123,30,30,0.12)"}}
        .btn-maroon{padding:9px 20px;background:linear-gradient(135deg,${T.maroonDark},${T.maroon});color:${darkMode ? "#1a1a2e" : "#fff"};border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.15s;box-shadow:0 2px 8px ${T.shadowStrong}}
        .btn-maroon:hover{transform:translateY(-1px)}
        .btn-white{padding:9px 18px;background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;color:${T.textDark};display:inline-flex;align-items:center;gap:6px}
        .btn-white:hover{background:${T.hoverBg};border-color:${T.maroon};color:${T.maroon}}
        .btn-blue{padding:7px 14px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px}
        .btn-teal{padding:9px 18px;background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
        .btn-amber{padding:7px 14px;background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff;border:none;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600}
        .icon-btn{width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;color:${T.textMuted}}
        .icon-btn:hover{background:${T.hoverBg};color:${T.maroon}}
        .kt-card{background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:16px;box-shadow:0 1px 5px ${T.shadow}}
        .kt-tab{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:500;border:none;background:transparent;color:${T.textMuted};cursor:pointer;transition:all 0.15s}
        .kt-tab.active{background:linear-gradient(135deg,${darkMode ? T.maroonDark : LIGHT.maroon},${T.maroon});color:${darkMode ? "#1a1a2e" : "#fff"}}
        .status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid transparent}
        .status-dot{width:6px;height:6px;border-radius:50%;display:inline-block}
        .total-box{border-radius:12px;padding:14px 18px;border:1px solid ${T.borderSoft};background:${T.cream}}
        .searchable-select{position:relative;width:100%}
        .ss-input-wrap{position:relative;display:flex;align-items:center}
        .ss-input{width:100%;padding:8px 32px 8px 12px;border:1px solid ${T.borderSoft};border-radius:8px;font-size:13px;background:${T.inputBg};color:${T.textDark}}
        .ss-input:focus{border-color:${T.maroon};outline:none}
        .ss-icons{position:absolute;right:8px;display:flex;align-items:center;gap:4px}
        .ss-clear{width:18px;height:18px;border-radius:50%;background:${T.creamDark};border:none;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .ss-arrow{width:14px;height:14px;transition:transform 0.2s}
        .ss-arrow.open{transform:rotate(180deg)}
        .ss-dropdown{position:absolute;top:100%;left:0;right:0;margin-top:4px;background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:10px;z-index:9999;max-height:250px;overflow:auto;box-shadow:0 4px 16px ${T.shadowStrong}}
        .ss-option{padding:10px 12px;cursor:pointer;border-bottom:1px solid ${T.accent}}
        .ss-option:hover{background:${T.hoverBg}}
        .ss-option.selected{background:${T.cream}}
        .ss-no-results{padding:10px;color:${T.textMuted};text-align:center}
        .unit-badge{display:inline-flex;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600}
        .wood-badge{background:${T.successBg};color:${T.successColor}}
        .custom-badge{background:${T.amberBg};color:${T.amberColor}}
        .length-group{display:flex;gap:4px;align-items:center}
        .length-input{width:60px;text-align:center}
        .material-group{border:2px solid ${T.borderSoft};border-radius:16px;margin-bottom:16px;overflow:visible;background:${T.cardBg}}
        .material-group-header{background:${darkMode ? T.accent : `linear-gradient(135deg, ${LIGHT.cream}, ${LIGHT.creamDark})`};padding:14px 18px;border-bottom:1px solid ${T.borderSoft};display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;border-radius:14px 14px 0 0}
        .material-group-body{padding:18px 20px}
        .material-group-footer{padding:10px 18px;border-top:1px dashed ${T.borderSoft};background:${T.accent};display:flex;justify-content:space-between;align-items:center;border-radius:0 0 14px 14px}
        .item-subrow{background:${T.cardBg};border:1px solid ${T.borderSoft};border-radius:10px;padding:14px;margin-bottom:10px}
        .calc-display{background:${T.cream};border-radius:8px;padding:10px;margin-top:10px;font-size:13px}
      `}</style>

      {error && (
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderRadius: 12,
            padding: 12,
            background: T.errorBg,
            border: `1px solid ${T.errorBorder}`,
            color: T.errorColor,
          }}
        >
          <AlertTriangle size={18} />
          <span style={{ flex: 1 }}>{error}</span>
          <button className="icon-btn" onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: T.maroon,
            margin: 0,
          }}
        >
          Delivery Challans
        </h2>
        <button
  className="btn-maroon"
  onClick={() => {
    setEditingChallan(null);  // ← yeh add karo
    resetForm();
    setShowChallanForm(true);
  }}
>
  <Plus size={16} /> New Challan
</button>
      </div>

      {/* Challan List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: T.textMuted,
            }}
          />
          <input
            className="kt-input"
            style={{ paddingLeft: 36 }}
            placeholder="Search challan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>

        {filteredChallans.map((ch) => {
          const regularCharges = (ch.charges || []).filter((c) => c.type !== "gst");
          const gstEntry = (ch.charges || []).find((c) => c.type === "gst");
          const gstRate = parseFloat(ch.gstRate || gstEntry?.quantity || 0);
          const gstAmount = parseFloat(ch.gstAmount || gstEntry?.amount || 0);
          return (
            <div key={ch.challanNo} className="kt-card" style={{ padding: 16 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        color: T.maroon,
                      }}
                    >
                      {ch.challanNo}
                    </span>
                    <span
                      className="status-pill"
                      style={{
                        background: T.successBg,
                        color: T.successColor,
                      }}
                    >
                      <span
                        className="status-dot"
                        style={{ background: "#22c55e" }}
                      />
                      Delivered
                    </span>
                    {ch.hidePrice && (
                      <span
                        className="status-pill"
                        style={{ background: T.cream, color: T.maroon }}
                      >
                        <EyeOff size={12} /> Hidden
                      </span>
                    )}
                    {gstRate > 0 && (
                      <span
                        className="status-pill"
                        style={{ background: T.infoBg, color: T.infoColor }}
                      >
                        GST {gstRate}%
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontWeight: 600,
                      margin: "4px 0",
                      color: T.textDark,
                    }}
                  >
                    {ch.customerName}
                  </p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                    {new Date(ch.challanDate).toLocaleDateString()} •{" "}
                    {(ch.items || []).length} items
                    {!ch.hidePrice &&
                      ` • ₹${parseFloat(ch.challanTotal || 0).toLocaleString()}`}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
  <button
    className="btn-white"
    style={{ padding: "5px 12px", fontSize: 12 }}
    onClick={() => {
      openPDFView(
        getChallanPrintHTML(
          ch,          // ✅ ab challan object hi bhejo (usme saare customer fields hain)
          ch,
          ch.hidePrice,
          regularCharges,
          gstRate,
          gstAmount,
        ),
      );
    }}
  >
    <Eye size={12} /> View
  </button>
  <button
  className="btn-amber"
  style={{ padding: "5px 12px", fontSize: 12 }}
  onClick={() => handleEditChallan(ch)}
>
  ✏️ Edit
</button>

  <button
    className="btn-maroon"
    style={{ padding: "5px 12px", fontSize: 12 }}
    onClick={() => {
      openPDFPrint(
        getChallanPrintHTML(
          ch,          // ✅ same here
          ch,
          ch.hidePrice,
          regularCharges,
          gstRate,
          gstAmount,
        ),
      );
    }}
  >
    <Printer size={12} /> Print
  </button>
  <button
    className="icon-btn"
    style={{ color: T.errorColor }}
    onClick={() => handleDeleteChallan(ch.challanNo)}
  >
    <Trash2 size={14} />
  </button>
</div>
              </div>
            </div>
          );
        })}
        {filteredChallans.length === 0 && (
          <div className="kt-card" style={{ padding: 56, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: T.textMuted }}>No challans found</p>
          </div>
        )}
      </div>

      {/* Challan Form Modal */}
      {showChallanForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: T.overlayBg,
            zIndex: 50,
            overflow: "auto",
            padding: 16,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: T.modalBg,
              border: `1px solid ${T.borderSoft}`,
              borderRadius: 16,
              maxWidth: 1400,
              width: "100%",
              margin: "32px 0",
              boxShadow: `0 8px 32px ${T.shadowStrong}`,
            }}
          >
            <div
              style={{
                padding: 20,
                borderBottom: `1px solid ${T.borderSoft}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
  style={{
    fontWeight: "bold",
    fontSize: 20,
    margin: 0,
    color: T.textDark,
  }}
>
  {editingChallan ? `Edit Challan - ${editingChallan.challanNo}` : "New Delivery Challan"}
</h3>
                <button
    className="icon-btn"
    onClick={() => {
      setShowChallanForm(false);
      setEditingChallan(null);  // ← yeh add karo
      resetForm();
    }}
  >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: 20, maxHeight: "70vh", overflowY: "auto" }}>
              {/* Customer Details */}
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: T.maroon,
                    marginBottom: 8,
                  }}
                >
                  Customer Details
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 12,
                  }}
                >
                  <input
                    className="kt-input"
                    placeholder="Customer Name *"
                    value={challanForm.customerName}
                    onChange={(e) =>
                      setChallanForm({
                        ...challanForm,
                        customerName: e.target.value,
                      })
                    }
                  />
                  <input
                    className="kt-input"
                    placeholder="Phone"
                    value={challanForm.customerPhone}
                    onChange={(e) =>
                      setChallanForm({
                        ...challanForm,
                        customerPhone: e.target.value,
                      })
                    }
                  />
                  <input
                    className="kt-input"
                    placeholder="Vehicle No."
                    value={challanForm.vehicleNo}
                    onChange={(e) =>
                      setChallanForm({ ...challanForm, vehicleNo: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    className="kt-input"
                    value={challanForm.challanDate}
                    onChange={(e) =>
                      setChallanForm({ ...challanForm, challanDate: e.target.value })
                    }
                  />
                  <select
                    className="kt-input"
                    value={challanForm.gstRate}
                    onChange={(e) =>
                      setChallanForm({
                        ...challanForm,
                        gstRate: parseFloat(e.target.value),
                      })
                    }
                  >
                    {GST_OPTIONS.map((o) => (
                      <option key={`gst-opt-${o.value}`} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <input
                    className="kt-input"
                    placeholder="PO Number"
                    value={challanForm.poNumber}
                    onChange={(e) =>
                      setChallanForm({ ...challanForm, poNumber: e.target.value })
                    }
                  />
                  <input
                    className="kt-input"
                    placeholder="GST Customer Name"
                    value={challanForm.gstCustomerName}
                    onChange={(e) =>
                      setChallanForm({
                        ...challanForm,
                        gstCustomerName: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className="kt-input"
                    rows="2"
                    placeholder="Address"
                    value={challanForm.customerAddress}
                    onChange={(e) =>
                      setChallanForm({
                        ...challanForm,
                        customerAddress: e.target.value,
                      })
                    }
                    style={{ gridColumn: "span 2" }}
                  />
                </div>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  marginBottom: 20,
                  color: T.textDark,
                }}
              >
                <input
                  type="checkbox"
                  checked={challanForm.hidePrice}
                  onChange={(e) =>
                    setChallanForm({ ...challanForm, hidePrice: e.target.checked })
                  }
                />
                <EyeOff size={18} /> Hide Price on Challan
              </label>

              {/* Items Groups */}
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: T.maroon,
                    marginBottom: 8,
                  }}
                >
                  Items
                </p>
                {itemGroups.map((group, gIdx) => {
                  const gp = getFilteredProductsForGroup(group);
                  const gc = getCategoriesFor(group.filterMaterialType);
                  const gsc = getSubCategoriesFor(
                    group.filterMaterialType,
                    group.filterCategory,
                  );
                  return (
                    <div key={`group-${group.groupId}`} className="material-group">
                      <div className="material-group-header">
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              background: T.maroon,
                              fontWeight: "bold",
                              fontSize: 14,
                            }}
                          >
                            {gIdx + 1}
                          </div>
                          <div>
                            <div
                              style={{ fontWeight: "bold", color: T.textDark }}
                            >
                              {group.filterMaterialType || "Select Material"}
                            </div>
                            <div style={{ fontSize: 12, color: T.textMuted }}>
                              {group.items.length} items
                            </div>
                          </div>
                        </div>
                        {itemGroups.length > 1 && (
                          <button
                            className="icon-btn"
                            onClick={() => removeGroup(group.groupId)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div
                        style={{
                          padding: 12,
                          background: T.accent,
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                          borderBottom: `1px solid ${T.borderSoft}`,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 150 }}>
                          <SearchableSelect
                            options={getAllMaterialTypes()}
                            value={group.filterMaterialType}
                            onChange={(v) =>
                              updateGroupFilter(
                                group.groupId,
                                "filterMaterialType",
                                v,
                              )
                            }
                            placeholder="Material Type"
                            allowCustom
                            T={T}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 150 }}>
                          <SearchableSelect
                            options={gc}
                            value={group.filterCategory}
                            onChange={(v) =>
                              updateGroupFilter(
                                group.groupId,
                                "filterCategory",
                                v,
                              )
                            }
                            placeholder="Category"
                            allowCustom
                            T={T}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 150 }}>
                          <SearchableSelect
                            options={gsc}
                            value={group.filterSubCategory}
                            onChange={(v) =>
                              updateGroupFilter(
                                group.groupId,
                                "filterSubCategory",
                                v,
                              )
                            }
                            placeholder="Sub Category"
                            allowCustom
                            T={T}
                          />
                        </div>
                      </div>
                      <div className="material-group-body">
                        {group.items.map((item, idx) => (
                          <div key={`item-${item.uid}`} className="item-subrow">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 8,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 4,
                                    background: T.creamDark,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: T.textDark,
                                  }}
                                >
                                  {idx + 1}
                                </span>
                                {isTimberWood(item) && (
                                  <span className="unit-badge wood-badge">
                                    Timber Wood
                                  </span>
                                )}
                                {isWoodenCladding(item) && (
                                  <span className="unit-badge wood-badge">
                                    Wooden Cladding
                                  </span>
                                )}
                                {isWoodenBaluster(item) && (
                                  <span className="unit-badge wood-badge">
                                    Baluster
                                  </span>
                                )}
                                {isSolidSurface(item) && (
                                  <span className="unit-badge wood-badge">
                                    Solid Surface
                                  </span>
                                )}
                                {isCeilingPlank(item) && (
                                  <span className="unit-badge wood-badge">
                                    Ceiling Plank
                                  </span>
                                )}
                                {item.isWood &&
                                  !item.isSheet &&
                                  !isTimberWood(item) &&
                                  !isWoodenCladding(item) &&
                                  !isWoodenBaluster(item) && (
                                    <span className="unit-badge wood-badge">
                                      Wood
                                    </span>
                                  )}
                                {item.isSheet &&
                                  !isCeilingPlank(item) &&
                                  !isSolidSurface(item) && (
                                    <span className="unit-badge wood-badge">
                                      Sheet/Door
                                    </span>
                                  )}
                                {!item.skuCode && item.product && (
                                  <span className="unit-badge custom-badge">
                                    Custom
                                  </span>
                                )}
                                {(item.isSheet ||
                                  isSolidSurface(item) ||
                                  isCeilingPlank(item)) &&
                                  item.areaPerPiece && (
                                    <span
                                      style={{
                                        fontSize: 10,
                                        color: T.textMuted,
                                        background: T.cream,
                                        padding: "2px 6px",
                                        borderRadius: 6,
                                      }}
                                    >
                                      {item.areaPerPiece.toFixed(2)} sqft/pc
                                    </span>
                                  )}
                              </div>
                              <div style={{ display: "flex", gap: 8 }}>
  {/* Save to Sheet button - sirf custom products ke liye */}
  {item.product && !item.skuCode && (
  <button
    className="icon-btn"
    onClick={() => handleSaveToSheet(item, group)}
    disabled={savingToSheet === item.uid}
    title="Save this product to Dropdown sheet"
    style={{ 
      color: T.successColor, 
      background: T.successBg,
      padding: "4px 10px",
      fontSize: 11,
      fontWeight: 600,
      width: "auto",
      gap: 4,
      opacity: savingToSheet === item.uid ? 0.6 : 1,
      cursor: savingToSheet === item.uid ? "wait" : "pointer"
    }}
  >
    {savingToSheet === item.uid ? (
      <>
        <Loader2 size={12} className="animate-spin" /> Saving...
      </>
    ) : (
      <>💾 Save</>
    )}
  </button>
)}
  <button
    className="icon-btn"
    onClick={() =>
      removeItemFromGroup(group.groupId, item.uid)
    }
  >
    <Trash2 size={14} />
  </button>
</div>
                            </div>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fit, minmax(140px, 1fr))",
                                gap: 10,
                              }}
                            >
                              <div
                                style={{ gridColumn: "span 2", minWidth: 200 }}
                              >
                                <SearchableSelect
                                  options={gp.map((p) => ({
                                    value: p.skuCode,
                                    label: p.materialName,
                                  }))}
                                  value={item.skuCode}
                                  displayValue={item.product || ""}
                                  onChange={(val) => {
                                    const matchedProduct = gp.find(
                                      (p) => p.skuCode === val,
                                    );
                                    if (matchedProduct)
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "skuCode",
                                        val,
                                      );
                                    else if (val)
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "customProductName",
                                        val,
                                      );
                                    else
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "skuCode",
                                        "",
                                      );
                                  }}
                                  placeholder="Search or type product name"
                                  allowCustom
                                  T={T}
                                />
                              </div>

                              <div>
                                {isDoorFrame(item) ? (
                                  <select
                                    className="kt-input"
                                    value={item.unit || "CFT"}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                   {DOOR_FRAME_UNIT_OPTIONS.map((u) => (
  <option key={`df-u-${u}`} value={u}>
    {u}
  </option>
))}
                                  </select>
                                ) : isSolidSurface(item) ? (
                                  <select
                                    className="kt-input"
                                    value={item.unit || "SQFT"}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {SOLID_SURFACE_UNIT_OPTIONS.map((u) => (
                                      <option key={`ss-u-${u}`} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                ) : isCeilingPlank(item) ? (
                                  <select
                                    className="kt-input"
                                    value={item.unit || "SQFT"}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {CEILING_PLANK_UNIT_OPTIONS.map((u) => (
                                      <option key={`cp-u-${u}`} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                ) : isWoodenBaluster(item) ? (
                                  <select
                                    className="kt-input"
                                    value={item.unit || "Per Piece"}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {WOODEN_BALUSTER_UNIT_OPTIONS.map((u) => (
                                      <option key={`wb-u-${u}`} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                ) : isWoodenCladding(item) ? (
                                  <select
                                    className="kt-input"
                                    value={item.unit || "Per Piece"}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {WOODEN_CLADDING_UNIT_OPTIONS.map((u) => (
                                      <option key={`wc-u-${u}`} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                ) : isTimberWood(item) ? (
                                  <select
                                    className="kt-input"
                                    value={item.unit || "CFT"}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {TIMBER_UNIT_OPTIONS.map((u) => (
                                      <option key={`tw-u-${u}`} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                ) : item.isSheet ? (
                                  <select
                                    className="kt-input"
                                    value={item.unit || "SQFT"}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {SHEET_UNIT_OPTIONS.map((u) => (
                                      <option key={`sheet-u-${u}`} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                ) : item.isWood && !item.isSheet ? (
                                  <select
                                    className="kt-input"
                                    value={item.unit}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {WOOD_UNIT_OPTIONS.map((u) => (
                                      <option key={`wood-u-${u}`} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                ) : /kitchen/i.test(
                                    item.materialType ||
                                      item.category ||
                                      group.filterMaterialType ||
                                      group.filterCategory ||
                                      "",
                                  ) ? (
                                  <select
                                    className="kt-input"
                                    value={item.unit || "Per Piece"}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {KITCHEN_UNIT_OPTIONS.map((u) => (
                                      <option key={`kit-u-${u}`} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                ) : /louver/i.test(
                                    item.materialType ||
                                      item.category ||
                                      group.filterMaterialType ||
                                      group.filterCategory ||
                                      "",
                                  ) ? (
                                  <select
                                    className="kt-input"
                                    value={item.unit || "Per Piece"}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {LOUVER_UNIT_OPTIONS.map((u) => (
                                      <option key={`lou-u-${u}`} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                ) : /laminate/i.test(
                                    item.materialType ||
                                      item.category ||
                                      group.filterMaterialType ||
                                      group.filterCategory ||
                                      "",
                                  ) ? (
                                  <select
                                    className="kt-input"
                                    value={item.unit || "Per Piece"}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {LAMINATE_UNIT_OPTIONS.map((u) => (
                                      <option key={`lam-u-${u}`} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                ) : item.skuCode ? (
                                  <select
                                    className="kt-input"
                                    value={item.unit || "Pcs"}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {[
                                      ...new Set(
                                        [
                                          item.unit,
                                          ...HARDWARE_UNIT_OPTIONS,
                                        ].filter(Boolean),
                                      ),
                                    ].map((u) => (
                                      <option key={`hw-u-${u}`} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <select
                                    className="kt-input"
                                    value={item.unit || "Pcs"}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {[
                                      ...new Set(
                                        [
                                          item.unit,
                                          ...CUSTOM_UNIT_OPTIONS,
                                        ].filter(Boolean),
                                      ),
                                    ].map((u) => (
                                      <option key={`cu-u-${u}`} value={u}>
                                        {u}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>

                              {isDoorFrame(item) && (
                                <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '8px 0' }}>
                                  <span style={{ fontSize: 13, color: T.textMuted }}>V.Qty</span>
                                  <input type="number" className="kt-input" placeholder="V.Qty"
                                    value={item.dfVerticalQty}
                                    onChange={e => updateGroupItem(group.groupId, item.uid, 'dfVerticalQty', e.target.value)}
                                    style={{ width: 70 }}
                                  />
                                  <span style={{ fontSize: 13, color: T.textMuted }}>H.Qty</span>
                                  <input type="number" className="kt-input" placeholder="H.Qty"
                                    value={item.dfHorizontalQty}
                                    onChange={e => updateGroupItem(group.groupId, item.uid, 'dfHorizontalQty', e.target.value)}
                                    style={{ width: 70 }}
                                  />
                                  <span style={{ color: T.textMuted, fontSize: 16, fontWeight: 'bold' }}>×</span>
                                  <input type="number" step="0.5" className="kt-input" placeholder='Thick (")'
                                    value={item.dfSectionThickness}
                                    onChange={e => updateGroupItem(group.groupId, item.uid, 'dfSectionThickness', e.target.value)}
                                    style={{ width: 100 }}
                                  />
                                  <span style={{ fontSize: 13, color: T.textMuted, marginLeft: 8 }}>inches</span>
                                  <span style={{ fontSize: 13, color: T.textMuted, whiteSpace: 'nowrap', fontWeight: 600, marginLeft: 16 }}>Height:</span>
                                  <input type="number" className="kt-input" placeholder="Ft"
                                    value={item.dfHeightFt}
                                    onChange={e => updateGroupItem(group.groupId, item.uid, 'dfHeightFt', e.target.value)}
                                    style={{ width: 80 }}
                                  />
                                  <span style={{ fontSize: 13, color: T.textMuted }}>ft</span>
                                  <input type="number" className="kt-input" placeholder="In"
                                    value={item.dfHeightIn}
                                    onChange={e => updateGroupItem(group.groupId, item.uid, 'dfHeightIn', e.target.value)}
                                    style={{ width: 80 }}
                                  />
                                  <span style={{ fontSize: 13, color: T.textMuted }}>in</span>
                                  <span style={{ fontSize: 13, color: T.textMuted, whiteSpace: 'nowrap', fontWeight: 600, marginLeft: 16 }}>Door Width:</span>
                                  <input type="number" className="kt-input" placeholder="Ft"
                                    value={item.dfWidthFt}
                                    onChange={e => updateGroupItem(group.groupId, item.uid, 'dfWidthFt', e.target.value)}
                                    style={{ width: 80 }}
                                  />
                                  <span style={{ fontSize: 13, color: T.textMuted }}>ft</span>
                                  <input type="number" className="kt-input" placeholder="In"
                                    value={item.dfWidthIn}
                                    onChange={e => updateGroupItem(group.groupId, item.uid, 'dfWidthIn', e.target.value)}
                                    style={{ width: 80 }}
                                  />
                                  <span style={{ fontSize: 13, color: T.textMuted }}>in</span>
                                </div>
                              )}

                              {(isTimberWood(item) ||
                                isWoodenCladding(item) ||
                                isWoodenBaluster(item) ||
                                (item.isWood && !item.isSheet)) && (
                                <div className="length-group">
                                  <input
                                    type="number"
                                    className="kt-input length-input"
                                    placeholder="Ft"
                                    value={item.lengthFeet}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "lengthFeet",
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <span
                                    style={{ color: T.textMuted, fontSize: 12 }}
                                  >
                                    ft
                                  </span>
                                  <input
                                    type="number"
                                    className="kt-input length-input"
                                    placeholder="In"
                                    value={item.lengthInches}
                                    onChange={(e) =>
                                      updateGroupItem(
                                        group.groupId,
                                        item.uid,
                                        "lengthInches",
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <span
                                    style={{ color: T.textMuted, fontSize: 12 }}
                                  >
                                    in
                                  </span>
                                </div>
                              )}
                              {(item.isSheet ||
                                isSolidSurface(item) ||
                                isCeilingPlank(item)) &&
                                item.unit === "SQFT" && (
                                  <div
                                    className="length-group"
                                    style={{ gridColumn: "span 2" }}
                                  >
                                    <input
                                      type="number"
                                      step="0.01"
                                      className="kt-input length-input"
                                      placeholder="Length"
                                      value={item.customLength}
                                      onChange={(e) =>
                                        updateGroupItem(
                                          group.groupId,
                                          item.uid,
                                          "customLength",
                                          e.target.value,
                                        )
                                      }
                                      style={{ width: 75 }}
                                    />
                                    <span
                                      style={{
                                        color: T.textMuted,
                                        fontSize: 12,
                                      }}
                                    >
                                      ft ×
                                    </span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      className="kt-input length-input"
                                      placeholder="Width"
                                      value={item.customWidth}
                                      onChange={(e) =>
                                        updateGroupItem(
                                          group.groupId,
                                          item.uid,
                                          "customWidth",
                                          e.target.value,
                                        )
                                      }
                                      style={{ width: 75 }}
                                    />
                                    <span
                                      style={{
                                        color: T.textMuted,
                                        fontSize: 12,
                                      }}
                                    >
                                      ft
                                    </span>
                                    {item.customLength && item.customWidth && (
                                      <span
                                        style={{
                                          marginLeft: 8,
                                          padding: "2px 8px",
                                          background: T.cream,
                                          color: T.maroon,
                                          borderRadius: 6,
                                          fontSize: 11,
                                          fontWeight: 600,
                                        }}
                                      >
                                        ={" "}
                                        {(
                                          parseFloat(item.customLength) *
                                          parseFloat(item.customWidth)
                                        ).toFixed(2)}{" "}
                                        sqft/pc
                                      </span>
                                    )}
                                  </div>
                                )}
                              <div>
                                <input
                                  type="number"
                                  className="kt-input"
                                  placeholder={
                                    (item.isSheet ||
                                      isSolidSurface(item) ||
                                      isCeilingPlank(item)) &&
                                    item.unit === "SQFT"
                                      ? "Pieces"
                                      : "Qty"
                                  }
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateGroupItem(
                                      group.groupId,
                                      item.uid,
                                      "quantity",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <input
                                  type="number"
                                  className="kt-input"
                                  placeholder={
                                    (item.isSheet ||
                                      isSolidSurface(item) ||
                                      isCeilingPlank(item)) &&
                                    item.unit === "SQFT"
                                      ? "Rate/SQFT"
                                      : "Rate"
                                  }
                                  value={item.rate}
                                  onChange={(e) =>
                                    updateGroupItem(
                                      group.groupId,
                                      item.uid,
                                      "rate",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <input
                                  className="kt-input"
                                  placeholder="Specification"
                                  value={item.specification || ""}
                                  onChange={(e) =>
                                    updateGroupItem(
                                      group.groupId,
                                      item.uid,
                                      "specification",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                            {item.product && !challanForm.hidePrice && (
                              <div className="calc-display">
                                {isDoorFrame(item) ? (
                                  <>
                                    <span style={{ fontWeight: 600 }}>
                                      Section: {item.dfSectionWidth || "?"}" ×{" "}
                                      {item.dfSectionThickness || "?"}"
                                      &nbsp;|&nbsp; Height:{" "}
                                      {item.dfHeightFt || 0}'
                                      {item.dfHeightIn || 0}" &nbsp;|&nbsp; Door
                                      Width: {item.dfWidthFt || 0}'
                                      {item.dfWidthIn || 0}" &nbsp;|&nbsp;
                                      {item.quantity || 0} Frames ={" "}
                                      {item.calculatedQty.toFixed(3)} CFT
                                    </span>
                                    {" • "}
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        color: T.maroon,
                                      }}
                                    >
                                      ₹{item.amount.toLocaleString()}
                                    </span>
                                  </>
                                ) : isSolidSurface(item) ? (
                                  <>
                                    {(() => {
                                      const customL = parseFloat(
                                        item.customLength || 0,
                                      );
                                      const customW = parseFloat(
                                        item.customWidth || 0,
                                      );
                                      const effectiveArea =
                                        customL > 0 && customW > 0
                                          ? customL * customW
                                          : item.areaPerPiece || 0;
                                      return (
                                        <span style={{ fontWeight: 600 }}>
                                          {item.quantity || 0} pcs ×{" "}
                                          {effectiveArea.toFixed(2)} sqft ={" "}
                                          {item.calculatedQty.toFixed(2)} SQFT
                                        </span>
                                      );
                                    })()}
                                    {" • "}
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        color: T.maroon,
                                      }}
                                    >
                                      ₹{item.amount.toLocaleString()}
                                    </span>
                                  </>
                                ) : isCeilingPlank(item) ? (
                                  <>
                                    <span style={{ fontWeight: 600 }}>
                                      {item.unit === "SQFT" &&
                                        (() => {
                                          const customL = parseFloat(
                                            item.customLength || 0,
                                          );
                                          const customW = parseFloat(
                                            item.customWidth || 0,
                                          );
                                          const effectiveArea =
                                            customL > 0 && customW > 0
                                              ? customL * customW
                                              : item.areaPerPiece || 0;
                                          return `${item.quantity || 0} pcs × ${effectiveArea.toFixed(2)} sqft = ${item.calculatedQty.toFixed(2)} SQFT`;
                                        })()}
                                      {item.unit === "RFT" &&
                                        `Total RFT: ${item.calculatedQty.toFixed(2)}`}
                                      {item.unit === "Per Piece" &&
                                        `Qty: ${item.calculatedQty} pcs`}
                                    </span>
                                    {" • "}
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        color: T.maroon,
                                      }}
                                    >
                                      ₹{item.amount.toLocaleString()}
                                    </span>
                                  </>
                                ) : isWoodenBaluster(item) ? (
                                  <>
                                    <span style={{ fontWeight: 600 }}>
                                      {item.unit === "CFT" &&
                                        `Total CFT: ${item.calculatedQty.toFixed(3)}`}
                                      {item.unit === "Per Piece" &&
                                        `Qty: ${item.calculatedQty} pcs`}
                                    </span>
                                    {" • "}
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        color: T.maroon,
                                      }}
                                    >
                                      ₹{item.amount.toLocaleString()}
                                    </span>
                                  </>
                                ) : isWoodenCladding(item) ? (
                                  <>
                                    <span style={{ fontWeight: 600 }}>
                                      Total {item.unit}:{" "}
                                      {item.calculatedQty.toFixed(3)}
                                    </span>
                                    {" • "}
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        color: T.maroon,
                                      }}
                                    >
                                      ₹{item.amount.toLocaleString()}
                                    </span>
                                  </>
                                ) : isTimberWood(item) ? (
                                  <>
                                    <span style={{ fontWeight: 600 }}>
                                      Total {item.unit}:{" "}
                                      {item.calculatedQty.toFixed(3)}
                                    </span>
                                    {" • "}
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        color: T.maroon,
                                      }}
                                    >
                                      ₹{item.amount.toLocaleString()}
                                    </span>
                                  </>
                                ) : item.isSheet && item.unit === "SQFT" ? (
                                  <>
                                    {(() => {
                                      const customL = parseFloat(
                                        item.customLength || 0,
                                      );
                                      const customW = parseFloat(
                                        item.customWidth || 0,
                                      );
                                      const effectiveArea =
                                        customL > 0 && customW > 0
                                          ? customL * customW
                                          : item.areaPerPiece || 0;
                                      return (
                                        <span style={{ fontWeight: 600 }}>
                                          {item.quantity || 0} pcs ×{" "}
                                          {effectiveArea.toFixed(2)} sqft ={" "}
                                          {item.calculatedQty.toFixed(2)} SQFT
                                        </span>
                                      );
                                    })()}
                                    {" • "}
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        color: T.maroon,
                                      }}
                                    >
                                      ₹{item.amount.toLocaleString()}
                                    </span>
                                  </>
                                ) : item.isWood && !item.isSheet ? (
                                  <>
                                    <span style={{ fontWeight: 600 }}>
                                      Total {item.unit}:{" "}
                                      {item.calculatedQty.toFixed(3)}
                                    </span>
                                    {" • "}
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        color: T.maroon,
                                      }}
                                    >
                                      ₹{item.amount.toLocaleString()}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span style={{ fontWeight: 600 }}>
                                      Qty: {item.quantity || 0}
                                    </span>
                                    {" • "}
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        color: T.maroon,
                                      }}
                                    >
                                      ₹{item.amount.toLocaleString()}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="material-group-footer">
                        <button
                          className="btn-white"
                          style={{ fontSize: 13 }}
                          onClick={() => addItemToGroup(group.groupId)}
                        >
                          <Plus size={14} /> Add Item
                        </button>
                        {!challanForm.hidePrice && (
                          <div
                            style={{
                              fontWeight: "bold",
                              color: T.maroon,
                              fontSize: 15,
                            }}
                          >
                            ₹
                            {group.items
                              .reduce((s, i) => s + i.amount, 0)
                              .toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <button
                  className="btn-white"
                  style={{
                    width: "100%",
                    padding: 10,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    marginTop: 8,
                    justifyContent: "center",
                  }}
                  onClick={addNewGroup}
                >
                  <Plus size={16} /> Add New Group
                </button>
              </div>

              {/* Additional Charges */}
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: T.maroon,
                      margin: 0,
                    }}
                  >
                    Additional Charges
                  </p>
                  <button
                    className="btn-amber"
                    style={{ padding: "6px 14px", fontSize: 13 }}
                    onClick={addCharge}
                  >
                    <Plus size={14} /> Add Charge
                  </button>
                </div>
                {charges.map((ch, idx) => (
                  <div
                    key={`charge-${ch.uid}`}
                    style={{
                      padding: 12,
                      border: `1px solid ${T.borderSoft}`,
                      borderRadius: 10,
                      marginBottom: 8,
                      background: T.accent,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 12,
                          background: T.amberBg,
                          color: T.amberColor,
                          fontWeight: 600,
                        }}
                      >
                        {CHARGE_TYPES.find((t) => t.value === ch.chargeType)?.icon || "📋"} #{idx + 1}{" "}
                        {ch.chargeName || "New Charge"}
                      </span>
                      <button
                        className="icon-btn"
                        onClick={() => removeCharge(ch.uid)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(140px, 1fr))",
                        gap: 8,
                      }}
                    >
                      <select
                        className="kt-input"
                        value={ch.chargeType}
                        onChange={(e) =>
                          updateCharge(ch.uid, "chargeType", e.target.value)
                        }
                      >
                        <option value="">Select type</option>
                        {CHARGE_TYPES.map((t) => (
                          <option key={`chtype-${t.value}`} value={t.value}>
                            {t.icon} {t.label}
                          </option>
                        ))}
                      </select>
                      <input
                        className="kt-input"
                        placeholder="Charge Name *"
                        value={ch.chargeName}
                        onChange={(e) =>
                          updateCharge(ch.uid, "chargeName", e.target.value)
                        }
                      />
                      <select
                        className="kt-input"
                        value={ch.unit}
                        onChange={(e) =>
                          updateCharge(ch.uid, "unit", e.target.value)
                        }
                      >
                        {CHARGE_UNIT_OPTIONS.map((u) => (
                          <option key={`chunit-${u}`} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                      {ch.unit !== "Lump Sum" && (
                        <input
                          className="kt-input"
                          type="number"
                          placeholder="Quantity"
                          value={ch.quantity}
                          onChange={(e) =>
                            updateCharge(ch.uid, "quantity", e.target.value)
                          }
                        />
                      )}
                      <input
                        className="kt-input"
                        type="number"
                        placeholder={
                          ch.unit === "Lump Sum" ? "Amount" : "Rate"
                        }
                        value={ch.rate}
                        onChange={(e) =>
                          updateCharge(ch.uid, "rate", e.target.value)
                        }
                      />
                    </div>
                    {ch.amount > 0 && (
                      <div
                        style={{
                          textAlign: "right",
                          marginTop: 6,
                          fontWeight: 600,
                          color: T.maroon,
                        }}
                      >
                        Amount: ₹{ch.amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Totals */}
              {!challanForm.hidePrice && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div className="total-box" style={{ width: 320 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                        color: T.textDark,
                      }}
                    >
                      <span>Materials</span>
                      <span>₹{itemsSubtotal.toLocaleString()}</span>
                    </div>
                    {chargesSubtotal > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 6,
                          color: T.textDark,
                        }}
                      >
                        <span>Charges</span>
                        <span>₹{chargesSubtotal.toLocaleString()}</span>
                      </div>
                    )}
                    {challanForm.gstRate > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 6,
                          color: T.textDark,
                        }}
                      >
                        <span>GST ({challanForm.gstRate}%)</span>
                        <span>₹{gstAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        fontSize: 18,
                        borderTop: `2px solid ${T.maroon}`,
                        paddingTop: 8,
                        marginTop: 8,
                        color: T.maroon,
                      }}
                    >
                      <span>Grand Total</span>
                      <span>₹{challanTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                padding: 20,
                borderTop: `1px solid ${T.borderSoft}`,
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            ><button
    className="btn-white"
    onClick={() => {
      setShowChallanForm(false);
      setEditingChallan(null);  // ← yeh add karo
      resetForm();
    }}
  >
    Cancel
  </button>
              <button
                className="btn-maroon"
                disabled={saving}
                onClick={handleSubmitChallan}
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Save Challan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: T.overlayBg,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: T.modalBg,
              borderRadius: 20,
              padding: 32,
              textAlign: "center",
              maxWidth: 420,
              width: "90%",
              boxShadow: `0 8px 40px ${T.shadowStrong}`,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                background: T.successBg,
              }}
            >
              <CheckCircle size={32} style={{ color: T.successColor }} />
            </div>
            <h3
  style={{
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: T.textDark,
  }}
>
  {editingChallan ? "Challan Updated!" : "Challan Generated!"}
</h3>
            <p
              style={{
                fontFamily: "monospace",
                margin: "8px 0 20px",
                color: T.maroon,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {lastChallanNo}
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <button
                className="btn-teal"
                onClick={() => openPDFView(lastChallanHTML)}
              >
                <Eye size={16} /> View
              </button>
              <button
                className="btn-maroon"
                onClick={() => openPDFPrint(lastChallanHTML)}
              >
                <Printer size={16} /> Print
              </button>
              <button
                className="btn-blue"
                onClick={() => {
                  const w = window.open("", "_blank");
                  w.document.write(lastChallanHTML);
                  w.document.close();
                  setTimeout(() => {
                    const ab = w.document.querySelector(".action-bar");
                    if (ab) ab.style.display = "none";
                    w.print();
                    setTimeout(() => {
                      if (ab) ab.style.display = "flex";
                    }, 1200);
                  }, 600);
                }}
              >
                <Download size={16} /> Save PDF
              </button>
            </div>
            <button
              className="btn-white"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => setShowSuccess(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




///////////////////////////



