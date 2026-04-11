import { BudgetType, GasTramiteType, PaymentStage, OtroCosto as OtroCostoType } from "./constants";

export type OtroCosto = OtroCostoType;

// Common fields shared by all budget types
interface BaseBudgetData {
  date: string;
  location: string;
  clientName: string;
  budgetType: BudgetType;
  paymentStages: PaymentStage[];
  validityDays: number;
}

// Obra Nueva and Conforme a Obras
export interface ObraBudgetData extends BaseBudgetData {
  budgetType: "obra-nueva" | "conforme-a-obras";
  pricePerM2: number;
  surfaceM2: number;
  includeItems: string[];
  excludeItems: string[];
}

// Gas Camuzzi
export interface GasBudgetData extends BaseBudgetData {
  budgetType: "gas";
  tramiteType: GasTramiteType;
  direccionObra: string;
  montoTramite: number;
  montoManoObra: number;
  otrosCostos: OtroCostoType[];
  workStages: string[];
  infoNotes: string[];
  includeItems: string[];
}

// Discriminated union
export type BudgetFormData = ObraBudgetData | GasBudgetData;

// Type guards
export function isObraBudget(data: BudgetFormData): data is ObraBudgetData {
  return data.budgetType === "obra-nueva" || data.budgetType === "conforme-a-obras";
}

export function isGasBudget(data: BudgetFormData): data is GasBudgetData {
  return data.budgetType === "gas";
}

// Calculate total based on budget type
export function calculateBudgetTotal(data: BudgetFormData): number {
  if (isObraBudget(data)) {
    return data.surfaceM2 * data.pricePerM2;
  }
  const otrosTotal = data.otrosCostos.reduce((sum, c) => sum + c.monto, 0);
  return data.montoTramite + data.montoManoObra + otrosTotal;
}

// Validation
export interface ValidationErrors {
  clientName?: string;
  // Obra
  pricePerM2?: string;
  surfaceM2?: string;
  // Gas
  montoTramite?: string;
  montoManoObra?: string;
  direccionObra?: string;
}

export function validateBudget(data: BudgetFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.clientName.trim()) {
    errors.clientName = "El nombre del cliente es obligatorio";
  }

  if (isObraBudget(data)) {
    if (data.pricePerM2 <= 0) {
      errors.pricePerM2 = "El precio por m2 debe ser mayor a 0";
    }
    if (data.surfaceM2 <= 0) {
      errors.surfaceM2 = "La superficie debe ser mayor a 0";
    }
  }

  if (isGasBudget(data)) {
    if (!data.direccionObra.trim()) {
      errors.direccionObra = "La dirección de obra es obligatoria";
    }
    if (data.montoTramite <= 0 && data.montoManoObra <= 0) {
      errors.montoTramite = "Al menos un monto debe ser mayor a 0";
      errors.montoManoObra = "Al menos un monto debe ser mayor a 0";
    }
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
