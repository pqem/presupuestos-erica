// Format currency in Argentine style ($ with dots for thousands, comma for decimals)
// Omits decimals when they are .00
export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formatted = formatter.format(amount);

  // If amount has no decimal part, remove the ,00
  if (Math.round(amount) === amount) {
    return formatted.replace(/,00$/, "");
  }

  return formatted;
}

// Format amount without currency symbol in Argentine style
export function formatNumber(amount: number): string {
  const parts = amount.toFixed(2).split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Format integer with dots for thousands
  const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${formatted},${decimalPart}`;
}

// Format date in Spanish format ("6 marzo de 2026")
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("es-AR", options);
}

// Calculate total: surface × price per m2
export function calculateTotal(surfaceM2: number, pricePerM2: number): number {
  return surfaceM2 * pricePerM2;
}

// Convert number to Spanish words (1-5)
export function numberToWords(n: number): string {
  const words: Record<number, string> = {
    1: "una",
    2: "dos",
    3: "tres",
    4: "cuatro",
    5: "cinco",
  };
  return words[n] || n.toString();
}

// Calculate payment amounts based on stages
export interface PaymentAmount {
  percent: number;
  description: string;
  amount: number;
}

export function calculatePayments(
  total: number,
  stages: { percent: number; description: string }[]
): PaymentAmount[] {
  return stages.map((stage) => ({
    ...stage,
    amount: (total * stage.percent) / 100,
  }));
}

// Budget numbering
const COUNTER_KEY = "presupuestos_counter";

interface BudgetCounter {
  year: number;
  count: number;
}

export function getNextBudgetNumber(): string {
  const currentYear = new Date().getFullYear();
  const stored = localStorage.getItem(COUNTER_KEY);
  let counter: BudgetCounter = stored ? JSON.parse(stored) : { year: currentYear, count: 0 };

  // Reset counter if year changed
  if (counter.year !== currentYear) {
    counter = { year: currentYear, count: 0 };
  }

  counter.count += 1;
  localStorage.setItem(COUNTER_KEY, JSON.stringify(counter));

  const padded = counter.count.toString().padStart(3, "0");
  return `P-${currentYear}-${padded}`;
}

// localStorage helpers
export interface HistoryBudget {
  id: string;
  budgetNumber?: string;
  clientName: string;
  date: string;
  budgetType: string;
  surfaceM2?: number;
  pricePerM2?: number;
  total: number;
  data: Record<string, unknown>;
}

const HISTORY_KEY = "presupuestos_history";

export function saveToHistory(budget: Omit<HistoryBudget, "id">): string {
  const id = Date.now().toString();
  const history = getHistory();
  const newBudget: HistoryBudget = { ...budget, id };
  history.push(newBudget);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return id;
}

export function getHistory(): HistoryBudget[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteFromHistory(id: string): void {
  const history = getHistory();
  const filtered = history.filter((b) => b.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}

export function getFromHistory(id: string): HistoryBudget | null {
  const history = getHistory();
  return history.find((b) => b.id === id) || null;
}
