// Professional data for Erica Avalos
export const ERICA_INFO = {
  name: "ERICA AVALOS",
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
  includeItems: string[];
  excludeItems: string[];
  enabled: boolean;
}

export const BUDGET_TYPES: Record<BudgetType, BudgetTypeDefinition> = {
  "obra-nueva": {
    label: "PLANOS DE OBRA NUEVA",
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
    label: "CONFORME A OBRAS",
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
  { percent: 50, description: "Anticipo" },
  { percent: 50, description: "A la entrega de planos" },
];

// Color scheme
export const COLORS = {
  brown: "#5C3D2E",
  lightBrown: "#8B6F47",
  gold: "#D4AF37",
  darkGray: "#333333",
  lightGray: "#F5F5F5",
  white: "#FFFFFF",
};

// Default validity period in days
export const DEFAULT_VALIDITY_DAYS = 10;
