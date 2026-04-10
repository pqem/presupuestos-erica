"use client";

import React, { useState } from "react";
import {
  BUDGET_TYPES,
  BudgetType,
  DEFAULT_PAYMENT_STAGES,
  DEFAULT_VALIDITY_DAYS,
} from "@/lib/constants";
import { formatCurrency, calculateTotal, saveToHistory } from "@/lib/utils";

interface PaymentStage {
  percent: number;
  description: string;
}

export interface BudgetFormData {
  date: string;
  location: string;
  clientName: string;
  budgetType: BudgetType;
  pricePerM2: number;
  surfaceM2: number;
  includeItems: string[];
  excludeItems: string[];
  paymentStages: PaymentStage[];
  validityDays: number;
}

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
    return {
      date: today,
      location: "Plottier",
      clientName: "",
      budgetType: "obra-nueva",
      pricePerM2: 0,
      surfaceM2: 0,
      includeItems: [...BUDGET_TYPES["obra-nueva"].includeItems],
      excludeItems: [...BUDGET_TYPES["obra-nueva"].excludeItems],
      paymentStages: [...DEFAULT_PAYMENT_STAGES],
      validityDays: DEFAULT_VALIDITY_DAYS,
    };
  };

  const [formData, setFormData] = useState<BudgetFormData>(getInitialData());

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let newData: BudgetFormData;

    if (name === "budgetType") {
      const type = value as BudgetType;
      const budgetTypeInfo = BUDGET_TYPES[type];
      newData = {
        ...formData,
        [name]: type,
        includeItems: [...budgetTypeInfo.includeItems],
        excludeItems: [...budgetTypeInfo.excludeItems],
      };
    } else if (name === "pricePerM2" || name === "surfaceM2") {
      newData = {
        ...formData,
        [name]: parseFloat(value) || 0,
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

  const handleIncludeItemChange = (index: number, value: string) => {
    const newItems = [...formData.includeItems];
    newItems[index] = value;
    const newData = { ...formData, includeItems: newItems };
    setFormData(newData);
    onFormChange(newData);
  };

  const handleExcludeItemChange = (index: number, value: string) => {
    const newItems = [...formData.excludeItems];
    newItems[index] = value;
    const newData = { ...formData, excludeItems: newItems };
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

  const total = calculateTotal(formData.surfaceM2, formData.pricePerM2);

  const handleSaveToHistory = () => {
    saveToHistory({
      clientName: formData.clientName,
      date: formData.date,
      budgetType: formData.budgetType,
      surfaceM2: formData.surfaceM2,
      pricePerM2: formData.pricePerM2,
      total: total,
      data: formData as unknown as Record<string, unknown>,
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

      {/* Price and Surface */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Precio por m2</label>
          <input
            type="number"
            name="pricePerM2"
            value={formData.pricePerM2}
            onChange={handleInputChange}
            className={inputClass}
            placeholder="0"
          />
        </div>
        <div>
          <label className={labelClass}>Superficie (m2)</label>
          <input
            type="number"
            name="surfaceM2"
            value={formData.surfaceM2}
            onChange={handleInputChange}
            className={inputClass}
            placeholder="0"
          />
        </div>
      </div>

      {/* Total */}
      <div className="mb-6 p-4 bg-surface-hover rounded-lg border border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-muted">TOTAL:</span>
          <span className="text-lg font-bold text-brand-light">
            {formatCurrency(total)}
          </span>
        </div>
        <p className="text-xs text-placeholder mt-2">(IVA incluido)</p>
      </div>

      {/* Include Items */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-brand-light mb-2">INCLUYE:</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {formData.includeItems.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleIncludeItemChange(idx, e.target.value)}
              className={inputSmClass}
            />
          ))}
        </div>
      </div>

      {/* Exclude Items */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-brand-light mb-2">
          NO INCLUYE:
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {formData.excludeItems.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleExcludeItemChange(idx, e.target.value)}
              className={inputSmClass}
            />
          ))}
        </div>
      </div>

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
