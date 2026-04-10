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
    paddingHorizontal: 50,
    paddingTop: 35,
    paddingBottom: 65,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.4,
    backgroundColor: COLORS.white,
    position: "relative",
  },
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
  titleSection: {
    marginTop: 5,
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
    marginBottom: 4,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.lightBrown,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 6,
  },
  clientName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 6,
    textAlign: "justify",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGray,
    marginBottom: 4,
    marginTop: 6,
  },
  bulletList: {
    marginLeft: 15,
    marginBottom: 4,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 3,
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
  calculationParagraph: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 4,
    textAlign: "justify",
  },
  paymentStageText: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 2,
    marginLeft: 15,
  },
  validityText: {
    fontSize: 10,
    color: COLORS.darkGray,
    marginTop: 8,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  attestation: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGray,
    marginTop: 12,
    marginBottom: 4,
  },
  signatureBlock: {
    marginTop: 5,
    textAlign: "left",
  },
  signatureName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
    marginBottom: 2,
  },
  signatureTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
    marginBottom: 1,
  },
  signatureLicense: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
  },
  footer: {
    position: "absolute",
    bottom: 15,
    right: 50,
    width: 300,
    textAlign: "right",
    fontSize: 8,
    lineHeight: 1.3,
  },
  footerLine: {
    color: COLORS.darkGray,
    marginBottom: 1,
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
