"use client";

import React, { useMemo, useState } from "react";
import { BudgetFormData, isObraBudget, isGasBudget, ObraBudgetData, GasBudgetData } from "@/lib/types";
import { generateObraHtml } from "@/lib/pdf/html-templates/obraTemplate";
import { generateGasHtml } from "@/lib/pdf/html-templates/gasTemplate";

interface PdfPreviewProps {
  formData: BudgetFormData;
  isValid?: boolean;
}

const PreviewIframe: React.FC<{ formData: BudgetFormData }> = ({ formData }) => {
  const html = useMemo(() => {
    if (isGasBudget(formData)) {
      return generateGasHtml(formData as GasBudgetData);
    }
    if (isObraBudget(formData)) {
      return generateObraHtml(formData as ObraBudgetData);
    }
    return "<p>Tipo no soportado</p>";
  }, [formData]);

  return (
    <iframe
      srcDoc={html}
      style={{ width: "100%", height: "100%", border: "none", background: "white" }}
      title="Vista previa del presupuesto"
    />
  );
};

export const PdfPreview: React.FC<PdfPreviewProps> = ({ formData, isValid }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) {
        throw new Error("Error generando PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `Presupuesto_${formData.clientName}_${formData.date}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Error al descargar el PDF. Intentá nuevamente.");
    } finally {
      setIsDownloading(false);
    }
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
        <PreviewIframe formData={formData} />
      </div>
      <div className="p-4 bg-surface border-t border-border">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full bg-brand text-white font-semibold py-3 rounded hover:bg-brand-hover transition disabled:opacity-50"
        >
          {isDownloading ? "Generando PDF..." : "Descargar PDF"}
        </button>
      </div>
    </div>
  );
};
