"use client";

import React, { useMemo, useRef } from "react";
import { BudgetFormData, isObraBudget, isGasBudget, ObraBudgetData, GasBudgetData } from "@/lib/types";
import { generateObraHtml } from "@/lib/pdf/html-templates/obraTemplate";
import { generateGasHtml } from "@/lib/pdf/html-templates/gasTemplate";

interface PdfPreviewProps {
  formData: BudgetFormData;
  isValid?: boolean;
}

function buildHtml(formData: BudgetFormData): string {
  if (isGasBudget(formData)) {
    return generateGasHtml(formData as GasBudgetData);
  }
  if (isObraBudget(formData)) {
    return generateObraHtml(formData as ObraBudgetData);
  }
  return "<p>Tipo no soportado</p>";
}

const PreviewIframe: React.FC<{ formData: BudgetFormData; iframeRef: React.RefObject<HTMLIFrameElement | null> }> = ({ formData, iframeRef }) => {
  const html = useMemo(() => buildHtml(formData), [formData]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      style={{ width: "100%", height: "100%", border: "none", background: "white" }}
      title="Vista previa del presupuesto"
    />
  );
};

export const PdfPreview: React.FC<PdfPreviewProps> = ({ formData, isValid }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleDownload = () => {
    // Open a new window with the HTML and trigger print (Save as PDF)
    const html = buildHtml(formData);
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Habilitá las ventanas emergentes para descargar el PDF.");
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    // Wait for fonts to load before printing
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  if (isValid === false) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted text-sm p-8 text-center">
        Completá los campos obligatorios para ver la vista previa del PDF
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <PreviewIframe formData={formData} iframeRef={iframeRef} />
      </div>
      <div className="p-4 bg-surface border-t border-border">
        <button
          onClick={handleDownload}
          className="w-full bg-brand text-white font-semibold py-3 rounded hover:bg-brand-hover transition"
        >
          Descargar PDF
        </button>
      </div>
    </div>
  );
};
