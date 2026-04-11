"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { BudgetForm } from "@/components/BudgetForm";
import { BudgetHistory } from "@/components/BudgetHistory";
import { ERICA_INFO, DEFAULT_PAYMENT_STAGES, DEFAULT_VALIDITY_DAYS, BUDGET_TYPES } from "@/lib/constants";
import { BudgetFormData, ObraBudgetData } from "@/lib/types";

const PdfPreview = dynamic(() =>
  import("@/components/PdfPreview").then((mod) => mod.PdfPreview),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-muted">Cargando PDF...</div>,
  }
);

const defaultFormData: BudgetFormData = {
  date: new Date().toISOString().split("T")[0],
  location: "Plottier",
  clientName: "",
  budgetType: "obra-nueva",
  pricePerM2: 0,
  surfaceM2: 0,
  includeItems: [...BUDGET_TYPES["obra-nueva"].includeItems],
  excludeItems: [...BUDGET_TYPES["obra-nueva"].excludeItems],
  paymentStages: [...DEFAULT_PAYMENT_STAGES],
  validityDays: DEFAULT_VALIDITY_DAYS,
} as ObraBudgetData;

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
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-brand-light">{ERICA_INFO.name}</h1>
          <p className="text-brand-dim">{ERICA_INFO.title}</p>
          <p className="text-xs text-placeholder mt-1">{ERICA_INFO.license}</p>
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
            <div className="hidden lg:flex flex-col bg-surface rounded-lg border border-border overflow-hidden h-full">
              <PdfPreview formData={formData} />
            </div>
          )}
        </div>

        {/* Mobile PDF Section */}
        <div className="lg:hidden mt-8">
          <h2 className="text-xl font-bold mb-4 text-brand-light">
            Vista previa PDF
          </h2>
          <div className="bg-surface rounded-lg border border-border overflow-hidden" style={{ height: "600px" }}>
            {isMounted && <PdfPreview formData={formData} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted">
          <p>{ERICA_INFO.email}</p>
          <p>Tel {ERICA_INFO.phone}</p>
          <p>{ERICA_INFO.address}</p>
          <p className="mt-2 text-xs text-brand-dim">{ERICA_INFO.website}</p>
        </div>
      </footer>
    </div>
  );
}
