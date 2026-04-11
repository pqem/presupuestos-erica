import { GasBudgetData } from "@/lib/types";
import { GASISTA_INFO, BRAND_COLORS, GAS_TRAMITE_TYPES } from "@/lib/constants";

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

export function generateGasHtml(data: GasBudgetData): string {
  const total = data.montoTramite + data.montoManoObra + data.otrosCostos.reduce((sum, c) => sum + c.monto, 0);
  const tramiteTypeLabel = GAS_TRAMITE_TYPES[data.tramiteType];

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
    .cost-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 9pt;
    }
    .cost-table th, .cost-table td {
      border: 1px solid #333;
      padding: 4px 8px;
    }
    .cost-table th {
      text-align: left;
      font-weight: 700;
      background-color: #f5f5f5;
    }
    .cost-table .amount {
      text-align: right;
      white-space: nowrap;
    }
    .cost-table .total-row {
      font-weight: 700;
    }
    .calc-paragraph {
      text-align: justify;
      margin-top: 12px;
      margin-bottom: 4px;
    }
    .payment-stage {
      margin-bottom: 1px;
    }
    .info-notes {
      margin-top: 8px;
      margin-bottom: 4px;
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
  <div class="subtitle">INSTALACIÓN DE GAS</div>

  <p class="client">Sr. ${data.clientName.toUpperCase()}</p>
  <p class="paragraph">
    Se presupuesta el servicio de <span class="bold">INSTALACIÓN DE GAS</span> ante Camuzzi Gas del Sur
    en la dirección <span class="bold">${data.direccionObra}</span>.
  </p>

  <p class="section-header">EL SERVICIO INCLUYE:</p>
  <ul class="bullet-list">
    ${data.includeItems.map((item) => `<li>${item}</li>`).join("\n    ")}
  </ul>

  <p class="section-header">ETAPAS DEL TRABAJO:</p>
  <ul class="bullet-list">
    ${data.workStages.map((stage) => `<li>${stage}</li>`).join("\n    ")}
  </ul>

  <p class="section-header">DETALLES DE COSTOS:</p>
  <table class="cost-table">
    <thead>
      <tr>
        <th>Concepto</th>
        <th class="amount">Importe</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Trámite</td>
        <td class="amount">${formatCurrency(data.montoTramite)}</td>
      </tr>
      <tr>
        <td>Mano de obra</td>
        <td class="amount">${formatCurrency(data.montoManoObra)}</td>
      </tr>
      ${data.otrosCostos
        .map(
          (costo) =>
            `<tr>
        <td>${costo.concepto}</td>
        <td class="amount">${formatCurrency(costo.monto)}</td>
      </tr>`
        )
        .join("\n      ")}
      <tr class="total-row">
        <td>TOTAL</td>
        <td class="amount">${formatCurrency(total)}</td>
      </tr>
    </tbody>
  </table>

  <p class="section-header">CONDICIONES:</p>
  <p class="calc-paragraph">
    El pago de los servicios se realizará en etapas conforme avanza la tramitación ante Camuzzi, a saber:
  </p>

  ${data.paymentStages
    .map((stage) => {
      const stageAmount = (total * stage.percent) / 100;
      return `<p class="payment-stage"><span class="bold">${stage.percent}% (${formatCurrency(stageAmount)})</span> ${stage.description}.</p>`;
    })
    .join("\n  ")}

  <p class="section-header">INFORMACIÓN ADICIONAL:</p>
  <ul class="bullet-list info-notes">
    ${data.infoNotes.map((note) => `<li>${note}</li>`).join("\n    ")}
  </ul>

  <p class="validity">Se extiende el presente presupuesto por un plazo de ${data.validityDays} días hábiles.</p>
  <p class="attestation">Atte.-</p>

  <div class="signature">
    <p class="name">${GASISTA_INFO.name}</p>
    <p class="sig-title">${GASISTA_INFO.title}</p>
    <p class="license">${GASISTA_INFO.license}</p>
  </div>

  <div class="footer">
    <div>${GASISTA_INFO.displayName} • ${GASISTA_INFO.title}</div>
    <div>${GASISTA_INFO.email} / Tel ${GASISTA_INFO.phone}</div>
    <div>${GASISTA_INFO.address}</div>
    <div class="website">${GASISTA_INFO.website}</div>
  </div>
</body>
</html>`;
}
