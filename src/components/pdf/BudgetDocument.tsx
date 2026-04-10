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
    paddingTop: 30,
    paddingBottom: 55,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.3,
    backgroundColor: COLORS.white,
    position: "relative",
  },
  dateContainer: {
    position: "absolute",
    top: 25,
    right: 50,
    width: 200,
    textAlign: "right",
  },
  date: {
    fontSize: 9,
    color: COLORS.darkGray,
  },
  titleSection: {
    marginTop: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
    marginBottom: 2,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: COLORS.lightBrown,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  clientName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGray,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.3,
    marginBottom: 4,
    textAlign: "justify",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  sectionHeader: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGray,
    marginBottom: 3,
    marginTop: 4,
  },
  bulletList: {
    marginLeft: 15,
    marginBottom: 2,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 1,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: COLORS.darkGray,
    lineHeight: 1.3,
  },
  calculationParagraph: {
    fontSize: 10,
    lineHeight: 1.3,
    marginTop: 4,
    marginBottom: 2,
    textAlign: "justify",
  },
  paymentStageText: {
    fontSize: 10,
    lineHeight: 1.3,
    marginBottom: 1,
    marginLeft: 15,
  },
  validityText: {
    fontSize: 9,
    color: COLORS.darkGray,
    marginTop: 6,
    marginBottom: 4,
  },
  attestation: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGray,
    marginTop: 8,
    marginBottom: 2,
  },
  signatureBlock: {
    marginTop: 3,
    textAlign: "left",
  },
  signatureName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
    marginBottom: 1,
  },
  signatureTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
    marginBottom: 1,
  },
  signatureLicense: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
  },
  footer: {
    position: "absolute",
    bottom: 12,
    right: 50,
    width: 300,
    textAlign: "right",
    fontSize: 7,
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
        {/* Date top right */}
        <View style={styles.dateContainer}>
          <Text style={styles.date}>
            {location}, {formatDate(date)}
          </Text>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>PRESUPUESTO</Text>
          <Text style={styles.subtitle}>{budgetTypeInfo.label}</Text>
        </View>

        {/* Client + intro as continuous block */}
        <Text style={styles.clientName}>Sr. {clientName.toUpperCase()}</Text>
        <Text style={styles.paragraph}>
          Se presupuesta por elaboración, trámites y visado definitivo de planos para{" "}
          <Text style={styles.bold}>{budgetTypeInfo.shortLabel}</Text> el valor de:{" "}
          <Text style={styles.bold}>{formatCurrency(pricePerM2)} por m2</Text>.
        </Text>

        {/* Includes */}
        <Text style={styles.sectionHeader}>INCLUYE:</Text>
        <View style={styles.bulletList}>
          {includeItems.map((item, idx) => (
            <View key={idx} style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Excludes */}
        <Text style={styles.sectionHeader}>NO INCLUYE:</Text>
        <View style={styles.bulletList}>
          {excludeItems.map((item, idx) => (
            <View key={idx} style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Calculation paragraph */}
        <Text style={styles.calculationParagraph}>
          Estimando una superficie cubierta de{" "}
          <Text style={styles.bold}>{formatNumber(surfaceM2)} m2</Text> el total es de{" "}
          <Text style={styles.bold}>{formatCurrency(total)}</Text> (IVA incluido) en concepto de honorarios. El pago de los mismos se realizará en {stagesWord} etapas conforme avanza la elaboración y tramitación de los planos, a saber:
        </Text>

        {/* Payment stages */}
        {paymentStages.map((stage, idx) => {
          const stageAmount = (total * stage.percent) / 100;
          return (
            <Text key={idx} style={styles.paymentStageText}>
              {stage.percent}% ({formatCurrency(stageAmount)}) {stage.description}.
            </Text>
          );
        })}

        {/* Validity */}
        <Text style={styles.validityText}>
          Se extiende el presente presupuesto por una plazo de {validityDays} días hábiles.
        </Text>

        {/* Signature */}
        <Text style={styles.attestation}>Atte.-</Text>
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureName}>{ERICA_INFO.name}</Text>
          <Text style={styles.signatureTitle}>{ERICA_INFO.title}</Text>
          <Text style={styles.signatureLicense}>{ERICA_INFO.license}</Text>
        </View>

        {/* Footer */}
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
