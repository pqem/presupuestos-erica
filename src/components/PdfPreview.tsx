"use client";

import React from "react";
import { PDFViewer, BlobProvider } from "@react-pdf/renderer";
import { BudgetDocument } from "./pdf/BudgetDocument";
import { GasBudgetDocument } from "./pdf/GasBudgetDocument";
import { BudgetFormData, isObraBudget, isGasBudget } from "@/lib/types";

interface PdfPreviewProps {
  formData: BudgetFormData;
  isValid?: boolean;
}

const buildDocument = (formData: BudgetFormData, date: Date) => {
  if (isGasBudget(formData)) {
    return (
      <GasBudgetDocument
        date={date}
        location={formData.location}
        clientName={formData.clientName}
        tramiteType={formData.tramiteType}
        direccionObra={formData.direccionObra}
        montoTramite={formData.montoTramite}
        montoManoObra={formData.montoManoObra}
        otrosCostos={formData.otrosCostos}
        includeItems={formData.includeItems}
        workStages={formData.workStages}
        infoNotes={formData.infoNotes}
        paymentStages={formData.paymentStages}
        validityDays={formData.validityDays}
      />
    );
  }

  if (isObraBudget(formData)) {
    return (
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
    );
  }

  return null;
};

export const PdfPreview: React.FC<PdfPreviewProps> = ({ formData, isValid }) => {
  const date = new Date(formData.date);
  const pdfDocument = buildDocument(formData, date);

  if (isValid === false) {
    return (
      <div className="flex items-center justify-center h-full text-muted text-sm p-8 text-center">
        Completá los campos obligatorios para ver la vista previa del PDF
      </div>
    );
  }

  if (!pdfDocument) {
    return <div className="flex items-center justify-center h-full text-danger">Tipo de presupuesto no soportado</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <PDFViewer style={{ width: "100%", height: "100%" }}>
          {pdfDocument}
        </PDFViewer>
      </div>

      {/* Download Button */}
      <div className="p-4 bg-surface border-t border-border">
        <BlobProvider key={JSON.stringify(formData)} document={pdfDocument}>
          {({ blob, url, loading, error }) => (
            <button
              onClick={() => {
                if (blob) {
                  const link = window.document.createElement("a");
                  link.href = url || "";
                  link.download = `Presupuesto_${formData.clientName}_${formData.date}.pdf`;
                  window.document.body.appendChild(link);
                  link.click();
                  window.document.body.removeChild(link);
                }
              }}
              disabled={loading}
              className="w-full bg-brand text-white font-semibold py-3 rounded hover:bg-brand-hover transition disabled:opacity-50"
            >
              {loading ? "Generando PDF..." : "Descargar PDF"}
            </button>
          )}
        </BlobProvider>
      </div>
    </div>
  );
};
