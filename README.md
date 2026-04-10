# Presupuestos Erica Avalos

Generador de presupuestos profesionales en PDF para Erica Avalos, Maestro Mayor de Obras / Gasista Matriculada.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **React-PDF** (@react-pdf/renderer) para generacion de PDF
- **Tailwind CSS v4** para estilos (dark mode)
- **Vercel** para deploy

## Tipos de presupuesto

| Tipo | Estado |
|---|---|
| Planos de Obra Nueva | Implementado |
| Planos Conforme a Obra | Implementado |
| Instalacion de Gas (Camuzzi) | Pendiente |

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## Deploy

El proyecto esta conectado a Vercel. Cada push a `master` despliega automaticamente.

```bash
# Deploy manual
vercel --prod
```

## Estructura

```
src/
  app/
    page.tsx              Pagina principal (formulario + preview PDF)
    layout.tsx            Layout root con metadata
    globals.css           Dark mode, Tailwind v4
  components/
    BudgetForm.tsx        Formulario de presupuesto
    BudgetHistory.tsx     Historial local (localStorage)
    PdfPreview.tsx        Vista previa y descarga de PDF
    pdf/
      BudgetDocument.tsx  Template PDF (Montserrat + PT Sans)
  lib/
    constants.ts          Datos de Erica, tipos de presupuesto, colores
    utils.ts              Formateo moneda argentina, calculos, localStorage
public/
  fonts/                  Montserrat (Black, Bold) + PT Sans (Regular, Bold)
```

## Tipografia del PDF

- **Montserrat Black** — titulo "PRESUPUESTO"
- **Montserrat Bold** — subtitulo del tipo de obra
- **PT Sans Bold** — cliente, headers, firma, numeros resaltados
- **PT Sans Regular** — cuerpo del texto, bullets, etapas de pago
