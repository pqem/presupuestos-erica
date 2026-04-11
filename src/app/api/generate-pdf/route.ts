import { NextRequest, NextResponse } from "next/server";
import { BudgetFormData, isObraBudget, isGasBudget, ObraBudgetData, GasBudgetData } from "@/lib/types";
import { generateObraHtml } from "@/lib/pdf/html-templates/obraTemplate";
import { generateGasHtml } from "@/lib/pdf/html-templates/gasTemplate";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { formData } = (await request.json()) as { formData: BudgetFormData };

    let html: string;
    if (isGasBudget(formData)) {
      html = generateGasHtml(formData as GasBudgetData);
    } else if (isObraBudget(formData)) {
      html = generateObraHtml(formData as ObraBudgetData);
    } else {
      return NextResponse.json({ error: "Tipo de presupuesto no soportado" }, { status: 400 });
    }

    // Dynamic import to avoid bundling chromium in client
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chromium = await import("@sparticuz/chromium" as any);
    const puppeteer = await import("puppeteer-core");

    const browser = await puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: chromium.default.defaultViewport,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Presupuesto_${formData.clientName}_${formData.date}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Error generando PDF" },
      { status: 500 }
    );
  }
}
