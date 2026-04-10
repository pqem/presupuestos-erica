"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { BudgetForm, BudgetFormData } from "@/components/BudgetForm";
import { BudgetHistory } from "@/components/BudgetHistory";
import { ERICA_INFO } from "@/lib/constants";

// Dynamically import PdfPreview (no SSR)
const PdfPreview = dynamic(() =>
  import("@/components/PdfPreview").then((mod) => mod.PdfPreview),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-[#888]">Cargando PDF...</div>,
  }
);

const defaultFormData: BudgetFormData = {
  date: new Date().toISOString().split("T")[0],
  location: "Plottier",
  clientName: "",
  budgetType: "obra-nueva",
  pricePerM2: 0,
  surfaceM2: 0,
  includeItems: [],
  excludeItems: [],
  paymentStages: [],
  validityDays: 10,
};

export default function Home() {
  const [formData, setFormData] = useState<BudgetFormData>(defaultFormData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFormChange = (data: BudgetFormData) => {
    setFormData(data);
  };

  const handleSelectBudget = (data: BudgetFormData) => {
    setFormData(data);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-[#c9956b]">{ERICA_INFO.name}</h1>
          <p className="text-[#8b6f47]">{ERICA_INFO.title}</p>
          <p className="text-xs text-[#666] mt-1">{ERICA_INFO.license}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[calc(100vh-200px)]">
          {/* Left Side: Form */}
          <div className="overflow-y-auto">
            <BudgetForm
              onFormChange={handleFormChange}
              initialData={formData}
            />
            <div className="mt-6">
              <BudgetHistory onSelectBudget={handleSelectBudget} />
            </div>
          </div>

          {/* Right Side: PDF Preview */}
          {isMounted && (
            <div className="hidden lg:flex flex-col bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] overflow-hidden h-full">
              <PdfPreview formData={formData} />
            </div>
          )}
        </div>

        {/* Mobile PDF Section */}
        <div className="lg:hidden mt-8">
          <h2 className="text-xl font-bold mb-4 text-[#c9956b]">
            Vista previa PDF
          </h2>
          <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] overflow-hidden" style={{ height: "600px" }}>
            {isMounted && <PdfPreview formData={formData} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-[#2a2a2a] py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[#888]">
          <p>{ERICA_INFO.email}</p>
          <p>Tel {ERICA_INFO.phone}</p>
          <p>{ERICA_INFO.address}</p>
          <p className="mt-2 text-xs text-[#5C3D2E]">{ERICA_INFO.website}</p>
        </div>
      </footer>
    </div>
  );
}
