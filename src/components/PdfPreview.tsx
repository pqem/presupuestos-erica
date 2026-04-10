"use client";

import React from "react";
import { PDFViewer, BlobProvider } from "@react-pdf/renderer";
import { BudgetDocument } from "./pdf/BudgetDocument";
import { BudgetFormData } from "./BudgetForm";

interface PdfPreviewProps {
  formData: BudgetFormData;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ formData }) => {
  const date = new Date(formData.date);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <PDFViewer style={{ width: "100%", height: "100%" }}>
          <BudgetDocument
            date={date}
            location={formData.location}
            clientName={formData.clientName}
            budgetType={formData.budgetType}
            pricePerM2={formData.pricePerM2}
            surfaceM2={formData.surfaceM2}
            includeItems={formData.includeItems}
            excludeItems={formData.excludeItems}
            paymentStages={formData.paymentStages}
            validityDays={formData.validityDays}
          />
        </PDFViewer>
      </div>

      {/* Download Button */}
      <div className="p-4 bg-white border-t">
        <BlobProvider
          document={
            <BudgetDocument
              date={date}
              location={formData.location}
              clientName={formData.clientName}
              budgetType={formData.budgetType}
              pricePerM2={formData.pricePerM2}
              surfaceM2={formData.surfaceM2}
              includeItems={formData.includeItems}
              excludeItems={formData.excludeItems}
              paymentStages={formData.paymentStages}
              validityDays={formData.validityDays}
            />
          }
        >
          {({ blob, url, loading, error }) => (
            <button
              onClick={() => {
                if (blob) {
                  const link = document.createElement("a");
                  link.href = url || "";
                  link.download = `Presupuesto_${formData.clientName}_${formData.date}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              disabled={loading}
              className="w-full bg-amber-900 text-white font-semibold py-3 rounded hover:bg-amber-950 transition disabled:opacity-50"
            >
              {loading ? "Generando PDF..." : "Descargar PDF"}
            </button>
          )}
        </BlobProvider>
      </div>
    </div>
  );
};
