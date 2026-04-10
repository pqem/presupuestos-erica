// Professional data for Erica Avalos
export const ERICA_INFO = {
  name: "ERICA AVALOS",
  displayName: "Erica Avalos",
  title: "MAESTRO MAYOR DE OBRAS",
  license: "MTR. TECA00241",
  email: "info@eriaavalos.com.ar",
  phone: "299 594 3751",
  address: "Alicurá 665, Plottier - Neuquén",
  website: "www.eriaavalos.com.ar",
};

// Budget type definitions
export type BudgetType = "obra-nueva" | "conforme-a-obras" | "gas";

export interface BudgetTypeDefinition {
  label: string;
  shortLabel: string;
  includeItems: string[];
  excludeItems: string[];
  enabled: boolean;
}

export const BUDGET_TYPES: Record<BudgetType, BudgetTypeDefinition> = {
  "obra-nueva": {
    label: "PLANOS DE OBRA NUEVA",
    shortLabel: "OBRA NUEVA",
    includeItems: [
      "Anteproyecto y maquetación 3D.",
      "Planos de Arquitectura y silueta de superficies.",
      "Planos de Estructuras y memoria de cálculo.",
      "Planos de Instalaciones; agua, gas, electricidad y sanitarias.",
      "Trámites de documentación para visado definitivo.",
      "Impresión de planos y documentación necesaria.",
    ],
    excludeItems: [
      "Pagos de impuestos y sellados ante las entidades correspondientes (esto corresponde al propietario de la obra).",
      "CDA, el cual debe ser elaborado por un agrimensor.",
    ],
    enabled: true,
  },
  "conforme-a-obras": {
    label: "PLANOS CONFORME A OBRAS",
    shortLabel: "CONFORME A OBRAS",
    includeItems: [
      "Anteproyecto y maquetación 3D.",
      "Planos de Arquitectura y silueta de superficies.",
    ],
    excludeItems: [
      "Pagos de impuestos y sellados ante las entidades correspondientes (esto corresponde al propietario de la obra).",
      "CDA, el cual debe ser elaborado por un agrimensor.",
    ],
    enabled: true,
  },
  gas: {
    label: "GAS",
    shortLabel: "GAS",
    includeItems: [],
    excludeItems: [],
    enabled: false,
  },
};

// Default payment stages
export interface PaymentStage {
  percent: number;
  description: string;
}

export const DEFAULT_PAYMENT_STAGES: PaymentStage[] = [
  { percent: 50, description: "Al iniciar el trabajo" },
  { percent: 50, description: "Al finalizar el trabajo con el sellado y visado de planos definitivo" },
];

// Brand colors — single source of truth for PDF rendering
// UI uses CSS variables from globals.css (same values)
export const BRAND_COLORS = {
  brown: "#8B6F3E",
  brownLight: "#B8874A",
  brownDim: "#6B5530",
};

// PDF-specific colors (used only by BudgetDocument.tsx)
export const COLORS = {
  brown: BRAND_COLORS.brown,
  black: "#000000",
  darkGray: "#333333",
  white: "#FFFFFF",
};

// Default validity period in days
export const DEFAULT_VALIDITY_DAYS = 10;
