import React from "react";
import { ObraBudgetData, ValidationErrors } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ObraFieldsProps {
  data: ObraBudgetData;
  onChange: (data: ObraBudgetData) => void;
  validationErrors?: ValidationErrors;
}

const inputClass =
  "w-full bg-surface-hover border border-border rounded px-3 py-2 text-sm text-fg placeholder-placeholder focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";
const inputSmClass =
  "w-full bg-surface-hover border border-border rounded px-3 py-2 text-xs text-fg placeholder-placeholder focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";
const labelClass = "block text-sm font-semibold text-brand-light mb-1";

export const ObraFields: React.FC<ObraFieldsProps> = ({ data, onChange, validationErrors = {} }) => {
  const handlePriceChange = (value: string) => {
    onChange({
      ...data,
      pricePerM2: parseFloat(value) || 0,
    });
  };

  const handleSurfaceChange = (value: string) => {
    onChange({
      ...data,
      surfaceM2: parseFloat(value) || 0,
    });
  };

  const handleIncludeItemChange = (index: number, value: string) => {
    const newItems = [...data.includeItems];
    newItems[index] = value;
    onChange({ ...data, includeItems: newItems });
  };

  const handleExcludeItemChange = (index: number, value: string) => {
    const newItems = [...data.excludeItems];
    newItems[index] = value;
    onChange({ ...data, excludeItems: newItems });
  };

  const total = data.surfaceM2 * data.pricePerM2;

  return (
    <>
      {/* Price and Surface */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Precio por m2</label>
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={data.pricePerM2 || ""}
            onChange={(e) => handlePriceChange(e.target.value)}
            className={`${inputClass} ${validationErrors?.pricePerM2 ? "border-danger ring-1 ring-danger" : ""}`}
            placeholder="0"
          />
          {validationErrors?.pricePerM2 && (
            <p className="text-xs text-danger mt-1">{validationErrors.pricePerM2}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Superficie (m2)</label>
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={data.surfaceM2 || ""}
            onChange={(e) => handleSurfaceChange(e.target.value)}
            className={`${inputClass} ${validationErrors?.surfaceM2 ? "border-danger ring-1 ring-danger" : ""}`}
            placeholder="0"
          />
          {validationErrors?.surfaceM2 && (
            <p className="text-xs text-danger mt-1">{validationErrors.surfaceM2}</p>
          )}
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
          {data.includeItems.map((item, idx) => (
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
          {data.excludeItems.map((item, idx) => (
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
    </>
  );
};
