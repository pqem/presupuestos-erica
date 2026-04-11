import { ObraBudgetData } from "@/lib/types";
import { ERICA_INFO, BUDGET_TYPES, BRAND_COLORS } from "@/lib/constants";

// These functions can't import from utils.ts (which may use browser APIs),
// so redefine the formatting inline for server-side use.
function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const formatted = formatter.format(amount);
  if (Math.round(amount) === amount) return formatted.replace(/,00$/, "");
  return formatted;
}

function formatDate(date: string): string {
  const d = new Date(date + "T12:00:00"); // avoid timezone issues
  return d.toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" });
}

function formatNumber(amount: number): string {
  const parts = amount.toFixed(2).split(".");
  const formatted = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted},${parts[1]}`;
}

function numberToWords(n: number): string {
  const words: Record<number, string> = { 1: "una", 2: "dos", 3: "tres", 4: "cuatro", 5: "cinco" };
  return words[n] || n.toString();
}

export function generateObraHtml(data: ObraBudgetData): string {
  const budgetTypeInfo = BUDGET_TYPES[data.budgetType];
  const total = data.surfaceM2 * data.pricePerM2;
  const stagesWord = numberToWords(data.paymentStages.length);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 25mm;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Open Sans', sans-serif;
      font-size: 10pt;
      line-height: 1.3;
      color: #000;
      width: 210mm;
      min-height: 297mm;
      padding: 25mm;
      position: relative;
    }
    .date {
      text-align: right;
      font-size: 8pt;
      color: #000;
      margin-bottom: 8px;
    }
    .title {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 26pt;
      color: ${BRAND_COLORS.primary};
      margin-bottom: 4px;
    }
    .subtitle {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 14pt;
      color: ${BRAND_COLORS.primary};
      margin-bottom: 20px;
    }
    .client {
      font-weight: 700;
      margin-bottom: 2px;
    }
    .paragraph {
      text-align: justify;
      margin-bottom: 4px;
    }
    .bold { font-weight: 700; }
    .section-header {
      font-weight: 700;
      margin-top: 12px;
      margin-bottom: 4px;
    }
    .bullet-list {
      margin-left: 36px;
      margin-bottom: 4px;
      list-style: none;
      padding: 0;
    }
    .bullet-list li {
      font-size: 9pt;
      margin-bottom: 1px;
    }
    .bullet-list li::before {
      content: "• ";
    }
    .calc-paragraph {
      text-align: justify;
      margin-top: 12px;
      margin-bottom: 4px;
    }
    .payment-stage {
      margin-bottom: 1px;
    }
    .validity {
      margin-top: 4px;
      margin-bottom: 2px;
    }
    .attestation {
      margin-top: 4px;
      margin-bottom: 2px;
    }
    .signature {
      margin-top: 3px;
    }
    .signature p {
      font-weight: 700;
      color: #000;
      margin-bottom: 1px;
    }
    .signature .name { font-size: 10pt; }
    .signature .sig-title { font-size: 9pt; }
    .signature .license { font-size: 8pt; }
    .footer {
      position: fixed;
      bottom: 25mm;
      left: 25mm;
      right: 25mm;
      text-align: right;
      font-size: 8pt;
      color: ${BRAND_COLORS.primary};
      border-top: 2px solid ${BRAND_COLORS.primary};
      padding-top: 6px;
      line-height: 1.4;
    }
    .footer .website {
      color: ${BRAND_COLORS.primary};
    }
  </style>
</head>
<body>
  <div class="date">${data.location}, ${formatDate(data.date)}</div>

  <div class="title">PRESUPUESTO</div>
  <div class="subtitle">${budgetTypeInfo.label}</div>

  <p class="client">Sr. ${data.clientName.toUpperCase()}</p>
  <p class="paragraph">
    Se presupuesta por elaboración, trámites y visado definitivo de planos para
    <span class="bold">${budgetTypeInfo.shortLabel}</span> el valor de:
    <span class="bold">${formatCurrency(data.pricePerM2)} por m2</span>.
  </p>

  <p class="section-header">INCLUYE:</p>
  <ul class="bullet-list">
    ${data.includeItems.map((item) => `<li>${item}</li>`).join("\n    ")}
  </ul>

  <p class="section-header">NO INCLUYE:</p>
  <ul class="bullet-list">
    ${data.excludeItems.map((item) => `<li>${item}</li>`).join("\n    ")}
  </ul>

  <p class="calc-paragraph">
    Estimando una superficie cubierta de
    <span class="bold">${formatNumber(data.surfaceM2)} m2</span> el total es de
    <span class="bold">${formatCurrency(total)}</span> (IVA incluido) en concepto de honorarios.
    El pago de los mismos se realizará en ${stagesWord} etapas conforme avanza la elaboración y
    tramitación de los planos, a saber:
  </p>

  ${data.paymentStages
    .map((stage) => {
      const stageAmount = (total * stage.percent) / 100;
      return `<p class="payment-stage"><span class="bold">${stage.percent}% (${formatCurrency(stageAmount)})</span> ${stage.description}.</p>`;
    })
    .join("\n  ")}

  <p class="validity">Se extiende el presente presupuesto por un plazo de ${data.validityDays} días hábiles.</p>
  <p class="attestation">Atte.-</p>

  <div class="signature">
    <p class="name">${ERICA_INFO.name}</p>
    <p class="sig-title">${ERICA_INFO.title}</p>
    <p class="license">${ERICA_INFO.license}</p>
  </div>

  <div class="footer">
    <div>${ERICA_INFO.displayName} • ${ERICA_INFO.title}</div>
    <div>${ERICA_INFO.email} / Tel ${ERICA_INFO.phone}</div>
    <div>${ERICA_INFO.address}</div>
    <div class="website">${ERICA_INFO.website}</div>
  </div>
</body>
</html>`;
}
