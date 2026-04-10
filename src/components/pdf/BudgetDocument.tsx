import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  ERICA_INFO,
  COLORS,
  BUDGET_TYPES,
  BudgetType,
} from "@/lib/constants";
import { formatCurrency, formatDate, formatNumber, numberToWords } from "@/lib/utils";

interface PaymentStage {
  percent: number;
  description: string;
}

interface BudgetDocumentProps {
  date: Date;
  location: string;
  clientName: string;
  budgetType: BudgetType;
  pricePerM2: number;
  surfaceM2: number;
  includeItems: string[];
  excludeItems: string[];
  paymentStages: PaymentStage[];
  validityDays: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingRight: 50,
    paddingLeft: 50,
    paddingTop: 40,
    paddingBottom: 80,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
    backgroundColor: COLORS.white,
    position: "relative",
  },
  // Date in top right
  dateContainer: {
    position: "absolute",
    top: 30,
    right: 50,
    width: 200,
    textAlign: "right",
  },
  date: {
    fontSize: 10,
    color: COLORS.darkGray,
  },
  // Title section (no border underneath)
  titleSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
    marginBottom: 8,
    letterSpacing: 3.5,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: COLORS.lightBrown,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  // Body sections
  section: {
    marginBottom: 15,
  },
  // Client name
  clientName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGray,
    marginBottom: 15,
  },
  // Intro paragraph with inline bold
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 15,
    textAlign: "justify",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  // Section headers (INCLUYE, NO INCLUYE) - bold black, not brown
  sectionHeader: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGray,
    marginBottom: 10,
    marginTop: 15,
  },
  // Bullet list
  bulletList: {
    marginLeft: 15,
    marginBottom: 15,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bullet: {
    width: 12,
    fontSize: 11,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.darkGray,
  },
  // Calculation paragraph (flowing text, not a box)
  calculationParagraph: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 15,
    textAlign: "justify",
  },
  // Payment stages text (inline, not a table)
  paymentStageText: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 6,
    marginLeft: 15,
  },
  // Validity text
  validityText: {
    fontSize: 10,
    color: COLORS.darkGray,
    marginTop: 15,
    marginBottom: 15,
    lineHeight: 1.6,
  },
  // "Atte.-" before signature
  attestation: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGray,
    marginTop: 25,
    marginBottom: 10,
  },
  // Signature block (LEFT aligned, not centered)
  signatureBlock: {
    marginTop: 15,
    textAlign: "left",
  },
  signatureName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
    marginBottom: 3,
  },
  signatureTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
    marginBottom: 2,
  },
  signatureLicense: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
  },
  // Footer (RIGHT aligned at bottom)
  footer: {
    position: "absolute",
    bottom: 20,
    right: 50,
    width: 300,
    textAlign: "right",
    fontSize: 8,
    lineHeight: 1.4,
  },
  footerLine: {
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  footerWebsite: {
    color: COLORS.brown,
    fontFamily: "Helvetica-Bold",
  },
});

export const BudgetDocument: React.FC<BudgetDocumentProps> = ({
  date,
  location,
  clientName,
  budgetType,
  pricePerM2,
  surfaceM2,
  includeItems,
  excludeItems,
  paymentStages,
  validityDays,
}) => {
  const budgetTypeInfo = BUDGET_TYPES[budgetType];
  const total = surfaceM2 * pricePerM2;
  const numStages = paymentStages.length;
  const stagesWord = numberToWords(numStages);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Date in top right */}
        <View style={styles.dateContainer}>
          <Text style={styles.date}>
            {location}, {formatDate(date)}
          </Text>
        </View>

        {/* Title section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>PRESUPUESTO</Text>
          <Text style={styles.subtitle}>{budgetTypeInfo.label}</Text>
        </View>

        {/* Client */}
        <View style={styles.section}>
          <Text style={styles.clientName}>Sr. {clientName.toUpperCase()}</Text>
        </View>

        {/* Intro paragraph — same text as original, variables are dynamic */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Se presupuesta por elaboración, trámites y visado definitivo de
            planos para <Text style={styles.bold}>{budgetTypeInfo.shortLabel}</Text> el valor de:{" "}
            <Text style={styles.bold}>{formatCurrency(pricePerM2)} por m2</Text>.
          </Text>
        </View>

        {/* Includes */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>INCLUYE:</Text>
          <View style={styles.bulletList}>
            {includeItems.map((item, idx) => (
              <View key={idx} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Excludes */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>NO INCLUYE:</Text>
          <View style={styles.bulletList}>
            {excludeItems.map((item, idx) => (
              <View key={idx} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Calculation paragraph (flowing text, not a box) */}
        <View style={styles.section}>
          <Text style={styles.calculationParagraph}>
            Estimando una superficie cubierta de{" "}
            <Text style={styles.bold}>{formatNumber(surfaceM2)} m2</Text> el total es de{" "}
            <Text style={styles.bold}>{formatCurrency(total)}</Text> (IVA
            incluido) en concepto de honorarios. El pago de los mismos se
            realizará en {stagesWord} etapas conforme avanza la elaboración y
            tramitación de los planos, a saber:
          </Text>
        </View>

        {/* Payment stages (inline text, not a table) */}
        <View style={styles.section}>
          {paymentStages.map((stage, idx) => {
            const stageAmount = (total * stage.percent) / 100;
            return (
              <Text key={idx} style={styles.paymentStageText}>
                {stage.percent}% ({formatCurrency(stageAmount)}) {stage.description}.
              </Text>
            );
          })}
        </View>

        {/* Validity */}
        <Text style={styles.validityText}>
          Se extiende el presente presupuesto por una plazo de {validityDays}{" "}
          días hábiles.
        </Text>

        {/* Attestation and Signature Block */}
        <Text style={styles.attestation}>Atte.-</Text>

        <View style={styles.signatureBlock}>
          <Text style={styles.signatureName}>{ERICA_INFO.name}</Text>
          <Text style={styles.signatureTitle}>{ERICA_INFO.title}</Text>
          <Text style={styles.signatureLicense}>{ERICA_INFO.license}</Text>
        </View>

        {/* Footer (RIGHT aligned at bottom) */}
        <View style={styles.footer}>
          <Text style={styles.footerLine}>{ERICA_INFO.displayName} • {ERICA_INFO.title}</Text>
          <Text style={styles.footerLine}>{ERICA_INFO.email} / Tel {ERICA_INFO.phone}</Text>
          <Text style={styles.footerLine}>{ERICA_INFO.address}</Text>
          <Text style={styles.footerWebsite}>{ERICA_INFO.website}</Text>
        </View>
      </Page>
    </Document>
  );
};
