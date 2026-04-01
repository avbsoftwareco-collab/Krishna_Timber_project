// app/dashboard/purchase/layout.jsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const steps = [
  { name: 'Requirement', path: '/dashboard/purchase/requirement' },
  { name: 'PO',      path: '/dashboard/purchase/PO' },
  { name: 'Material',    path: '/dashboard/purchase/material' },
  
];

export default function PurchaseLayout({ children }) {
  const pathname = usePathname();

  const currentIndex = steps.findIndex(step => pathname.startsWith(step.path));

  return (
    <div className="space-y-8">
      {/* Purchase Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Purchase Order</h1>
          <p className="text-gray-500 mt-1">Complete the purchase process step by step</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm">
        {steps.map((step, index) => {
          const isActive = pathname.startsWith(step.path);
          const isCompleted = currentIndex > index;

          return (
            <Link
              key={step.path}
              href={step.path}
              className={`flex-1 min-w-[140px] px-5 py-4 rounded-xl text-sm font-medium transition-all flex items-center gap-3
                ${isActive 
                  ? 'bg-amber-600 text-white shadow-md' 
                  : isCompleted 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${isActive ? 'bg-white text-amber-600' : isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                {index + 1}
              </div>
              <span>{step.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Actual Page Content (Requirement / Indent etc.) */}
      <div className="bg-white rounded-3xl shadow-sm p-8 min-h-[calc(100vh-280px)]">
        {children}
      </div>
    </div>
  );
}