"use client";

import React, { useState } from "react";
import {
  BUDGET_TYPES,
  BudgetType,
  DEFAULT_PAYMENT_STAGES,
  DEFAULT_VALIDITY_DAYS,
  DEFAULT_GAS_WORK_STAGES,
  DEFAULT_GAS_INFO_NOTES,
} from "@/lib/constants";
import {
  BudgetFormData,
  ObraBudgetData,
  GasBudgetData,
  isObraBudget,
  isGasBudget,
  calculateBudgetTotal,
} from "@/lib/types";
import { formatCurrency, saveToHistory } from "@/lib/utils";
import { ObraFields } from "./ObraFields";
import { GasFields } from "./GasFields";

// Re-export for backwards compatibility
export type { BudgetFormData } from "@/lib/types";

interface BudgetFormProps {
  onFormChange: (data: BudgetFormData) => void;
  initialData?: BudgetFormData | null;
}

const inputClass =
  "w-full bg-surface-hover border border-border rounded px-3 py-2 text-sm text-fg placeholder-placeholder focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";
const inputSmClass =
  "w-full bg-surface-hover border border-border rounded px-3 py-2 text-xs text-fg placeholder-placeholder focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";
const labelClass = "block text-sm font-semibold text-brand-light mb-1";

export const BudgetForm: React.FC<BudgetFormProps> = ({
  onFormChange,
  initialData,
}) => {
  const getInitialData = (): BudgetFormData => {
    if (initialData) {
      return initialData;
    }
    const today = new Date().toISOString().split("T")[0];
    const obraDefaults = BUDGET_TYPES["obra-nueva"];
    const defaultObraData: ObraBudgetData = {
      date: today,
      location: "Plottier",
      clientName: "",
      budgetType: "obra-nueva",
      pricePerM2: 0,
      surfaceM2: 0,
      includeItems: [...obraDefaults.includeItems],
      excludeItems: [...obraDefaults.excludeItems],
      paymentStages: [...DEFAULT_PAYMENT_STAGES],
      validityDays: DEFAULT_VALIDITY_DAYS,
    };
    return defaultObraData;
  };

  const [formData, setFormData] = useState<BudgetFormData>(getInitialData());

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let newData: BudgetFormData;

    if (name === "budgetType") {
      const type = value as BudgetType;
      const commonFields = {
        date: formData.date,
        location: formData.location,
        clientName: formData.clientName,
        paymentStages: formData.paymentStages,
        validityDays: formData.validityDays,
      };

      if (type === "gas") {
        // Switch to gas
        newData = {
          ...commonFields,
          budgetType: type,
          tramiteType: "instalacion-nueva",
          direccionObra: "",
          montoTramite: 0,
          montoManoObra: 0,
          otrosCostos: [],
          workStages: [...DEFAULT_GAS_WORK_STAGES],
          infoNotes: [...DEFAULT_GAS_INFO_NOTES],
          includeItems: [...BUDGET_TYPES["gas"].includeItems],
        };
      } else {
        // Switch to obra
        newData = {
          ...commonFields,
          budgetType: type,
          pricePerM2: 0,
          surfaceM2: 0,
          includeItems: [...BUDGET_TYPES[type].includeItems],
          excludeItems: [...BUDGET_TYPES[type].excludeItems],
        };
      }
    } else if (name === "validityDays") {
      newData = {
        ...formData,
        [name]: parseInt(value) || 0,
      };
    } else {
      newData = {
        ...formData,
        [name]: value,
      };
    }

    setFormData(newData);
    onFormChange(newData);
  };


  const handlePaymentStageChange = (
    index: number,
    field: "percent" | "description",
    value: string | number
  ) => {
    const newStages = [...formData.paymentStages];
    if (field === "percent") {
      newStages[index].percent = parseFloat(value as string) || 0;
    } else {
      newStages[index].description = value as string;
    }
    const newData = { ...formData, paymentStages: newStages };
    setFormData(newData);
    onFormChange(newData);
  };

  const handleAddPaymentStage = () => {
    const newStages = [
      ...formData.paymentStages,
      { percent: 0, description: "Etapa" },
    ];
    const newData = { ...formData, paymentStages: newStages };
    setFormData(newData);
    onFormChange(newData);
  };

  const handleRemovePaymentStage = (index: number) => {
    const newStages = formData.paymentStages.filter((_, i) => i !== index);
    const newData = { ...formData, paymentStages: newStages };
    setFormData(newData);
    onFormChange(newData);
  };

  const total = calculateBudgetTotal(formData);

  const handleSaveToHistory = () => {
    saveToHistory({
      clientName: formData.clientName,
      date: formData.date,
      budgetType: formData.budgetType,
      total: total,
      data: formData as unknown as Record<string, unknown>,
      ...(isObraBudget(formData) && {
        surfaceM2: formData.surfaceM2,
        pricePerM2: formData.pricePerM2,
      }),
    });
    alert("Presupuesto guardado en el historial");
  };

  return (
    <div className="w-full bg-surface rounded-lg border border-border p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-brand-light">
        Nuevo Presupuesto
      </h2>

      {/* Date and Location */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Fecha</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Localidad</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Client Name */}
      <div className="mb-4">
        <label className={labelClass}>Nombre del cliente</label>
        <input
          type="text"
          name="clientName"
          value={formData.clientName}
          onChange={handleInputChange}
          className={inputClass}
          placeholder="Sr. Nombre Apellido"
        />
      </div>

      {/* Budget Type */}
      <div className="mb-4">
        <label className={labelClass}>Tipo de presupuesto</label>
        <select
          name="budgetType"
          value={formData.budgetType}
          onChange={handleInputChange}
          className={inputClass}
        >
          {Object.entries(BUDGET_TYPES).map(([key, value]) => (
            <option key={key} value={key} disabled={!value.enabled}>
              {value.label}
            </option>
          ))}
        </select>
      </div>

      {/* Type-specific fields */}
      {isObraBudget(formData) && (
        <ObraFields data={formData} onChange={(data) => {
          setFormData(data);
          onFormChange(data);
        }} />
      )}

      {isGasBudget(formData) && (
        <GasFields data={formData} onChange={(data) => {
          setFormData(data);
          onFormChange(data);
        }} />
      )}

      {/* Payment Stages */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-brand-light mb-2">
          FORMA DE PAGO:
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {formData.paymentStages.map((stage, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                value={stage.description}
                onChange={(e) =>
                  handlePaymentStageChange(idx, "description", e.target.value)
                }
                className="flex-1 bg-surface-hover border border-border rounded px-2 py-1 text-xs text-fg focus:border-brand focus:outline-none"
                placeholder="Descripcion"
              />
              <input
                type="number"
                value={stage.percent}
                onChange={(e) =>
                  handlePaymentStageChange(idx, "percent", e.target.value)
                }
                className="w-16 bg-surface-hover border border-border rounded px-2 py-1 text-xs text-fg focus:border-brand focus:outline-none"
                placeholder="%"
              />
              {formData.paymentStages.length > 1 && (
                <button
                  onClick={() => handleRemovePaymentStage(idx)}
                  className="text-danger text-xs font-bold hover:text-red-400"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleAddPaymentStage}
          className="mt-2 text-xs bg-surface-hover text-brand-light border border-border px-3 py-1 rounded hover:bg-border transition"
        >
          + Agregar etapa
        </button>
      </div>

      {/* Validity Days */}
      <div className="mb-6">
        <label className={labelClass}>Validez (dias)</label>
        <input
          type="number"
          name="validityDays"
          value={formData.validityDays}
          onChange={handleInputChange}
          className={inputClass}
        />
      </div>

      {/* Save to History Button */}
      <button
        onClick={handleSaveToHistory}
        className="w-full bg-brand text-fg font-semibold py-2 rounded hover:bg-brand-hover transition text-sm"
      >
        Guardar en historial
      </button>
    </div>
  );
};
