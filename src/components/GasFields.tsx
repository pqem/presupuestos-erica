import React from "react";
import { GasBudgetData, ValidationErrors } from "@/lib/types";
import { GAS_TRAMITE_TYPES, GasTramiteType } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

interface GasFieldsProps {
  data: GasBudgetData;
  onChange: (data: GasBudgetData) => void;
  validationErrors?: ValidationErrors;
}

const inputClass =
  "w-full bg-surface-hover border border-border rounded px-3 py-2 text-sm text-fg placeholder-placeholder focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";
const inputSmClass =
  "w-full bg-surface-hover border border-border rounded px-3 py-2 text-xs text-fg placeholder-placeholder focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";
const labelClass = "block text-sm font-semibold text-brand-light mb-1";

export const GasFields: React.FC<GasFieldsProps> = ({ data, onChange, validationErrors = {} }) => {
  const handleTramiteTypeChange = (value: string) => {
    onChange({
      ...data,
      tramiteType: value as GasTramiteType,
    });
  };

  const handleDireccionChange = (value: string) => {
    onChange({
      ...data,
      direccionObra: value,
    });
  };

  const handleMontoTramiteChange = (value: string) => {
    onChange({
      ...data,
      montoTramite: parseFloat(value) || 0,
    });
  };

  const handleMontoManoObraChange = (value: string) => {
    onChange({
      ...data,
      montoManoObra: parseFloat(value) || 0,
    });
  };

  const handleWorkStageChange = (index: 0 | 1, value: string) => {
    const newStages = [...data.workStages];
    newStages[index] = value;
    onChange({ ...data, workStages: newStages });
  };

  const handleIncludeItemChange = (index: number, value: string) => {
    const newItems = [...data.includeItems];
    newItems[index] = value;
    onChange({ ...data, includeItems: newItems });
  };

  const handleInfoNoteChange = (index: number, value: string) => {
    const newNotes = [...data.infoNotes];
    newNotes[index] = value;
    onChange({ ...data, infoNotes: newNotes });
  };

  const handleOtroCostoConceptoChange = (index: number, value: string) => {
    const newCostos = [...data.otrosCostos];
    newCostos[index] = { ...newCostos[index], concepto: value };
    onChange({ ...data, otrosCostos: newCostos });
  };

  const handleOtroCostoMontoChange = (index: number, value: string) => {
    const newCostos = [...data.otrosCostos];
    newCostos[index] = { ...newCostos[index], monto: parseFloat(value) || 0 };
    onChange({ ...data, otrosCostos: newCostos });
  };

  const handleAddOtroCosto = () => {
    onChange({
      ...data,
      otrosCostos: [...data.otrosCostos, { concepto: "", monto: 0 }],
    });
  };

  const handleRemoveOtroCosto = (index: number) => {
    onChange({
      ...data,
      otrosCostos: data.otrosCostos.filter((_, i) => i !== index),
    });
  };

  const total = data.montoTramite + data.montoManoObra + data.otrosCostos.reduce((sum, c) => sum + c.monto, 0);

  return (
    <>
      {/* Tipo de trámite */}
      <div className="mb-4">
        <label className={labelClass}>Tipo de trámite</label>
        <select
          value={data.tramiteType}
          onChange={(e) => handleTramiteTypeChange(e.target.value)}
          className={inputClass}
        >
          {Object.entries(GAS_TRAMITE_TYPES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Dirección de obra */}
      <div className="mb-4">
        <label className={labelClass}>Dirección de obra</label>
        <input
          type="text"
          value={data.direccionObra}
          onChange={(e) => handleDireccionChange(e.target.value)}
          className={`${inputClass} ${validationErrors?.direccionObra ? "border-danger ring-1 ring-danger" : ""}`}
          placeholder="Calle, número, localidad"
        />
        {validationErrors?.direccionObra && (
          <p className="text-xs text-danger mt-1">{validationErrors.direccionObra}</p>
        )}
      </div>

      {/* EL SERVICIO INCLUYE */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-brand-light mb-2">EL SERVICIO INCLUYE:</h3>
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

      {/* ETAPAS DEL TRABAJO */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-brand-light mb-2">ETAPAS DEL TRABAJO:</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={data.workStages[0] || ""}
            onChange={(e) => handleWorkStageChange(0, e.target.value)}
            className={inputSmClass}
            placeholder="ETAPA 1"
          />
          <input
            type="text"
            value={data.workStages[1] || ""}
            onChange={(e) => handleWorkStageChange(1, e.target.value)}
            className={inputSmClass}
            placeholder="ETAPA 2"
          />
        </div>
      </div>

      {/* DETALLE DE COSTOS */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-brand-light mb-2">DETALLE DE COSTOS:</h3>

        {/* Monto Trámite */}
        <div className="mb-3">
          <label className="text-xs text-muted mb-1 block">Trámite ante Camuzzi</label>
          <input
            type="number"
            value={data.montoTramite}
            onChange={(e) => handleMontoTramiteChange(e.target.value)}
            className={`${inputSmClass} ${validationErrors?.montoTramite ? "border-danger ring-1 ring-danger" : ""}`}
            placeholder="0"
          />
          {validationErrors?.montoTramite && (
            <p className="text-xs text-danger mt-1">{validationErrors.montoTramite}</p>
          )}
        </div>

        {/* Monto Mano de Obra */}
        <div className="mb-3">
          <label className="text-xs text-muted mb-1 block">Mano de obra</label>
          <input
            type="number"
            value={data.montoManoObra}
            onChange={(e) => handleMontoManoObraChange(e.target.value)}
            className={`${inputSmClass} ${validationErrors?.montoManoObra ? "border-danger ring-1 ring-danger" : ""}`}
            placeholder="0"
          />
          {validationErrors?.montoManoObra && (
            <p className="text-xs text-danger mt-1">{validationErrors.montoManoObra}</p>
          )}
        </div>

        {/* Otros Costos */}
        <div className="mb-3">
          <label className="text-xs text-muted mb-1 block">Otros costos</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {data.otrosCostos.map((costo, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <input
                  type="text"
                  value={costo.concepto}
                  onChange={(e) => handleOtroCostoConceptoChange(idx, e.target.value)}
                  className="flex-1 bg-surface-hover border border-border rounded px-2 py-1 text-xs text-fg focus:border-brand focus:outline-none"
                  placeholder="Concepto"
                />
                <input
                  type="number"
                  value={costo.monto}
                  onChange={(e) => handleOtroCostoMontoChange(idx, e.target.value)}
                  className="w-24 bg-surface-hover border border-border rounded px-2 py-1 text-xs text-fg focus:border-brand focus:outline-none"
                  placeholder="Monto"
                />
                {data.otrosCostos.length > 0 && (
                  <button
                    onClick={() => handleRemoveOtroCosto(idx)}
                    className="text-danger text-xs font-bold hover:text-red-400 mt-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleAddOtroCosto}
            className="mt-2 text-xs bg-surface-hover text-brand-light border border-border px-3 py-1 rounded hover:bg-border transition"
          >
            + Agregar costo
          </button>
        </div>

        {/* Total */}
        <div className="p-3 bg-surface-hover rounded border border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted">TOTAL COSTOS:</span>
            <span className="text-sm font-bold text-brand-light">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* INFORMACIÓN ADICIONAL */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-brand-light mb-2">INFORMACIÓN ADICIONAL:</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {data.infoNotes.map((note, idx) => (
            <input
              key={idx}
              type="text"
              value={note}
              onChange={(e) => handleInfoNoteChange(idx, e.target.value)}
              className={inputSmClass}
            />
          ))}
        </div>
      </div>
    </>
  );
};
