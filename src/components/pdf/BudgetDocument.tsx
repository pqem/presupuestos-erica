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

// Horizontal rule helper
const HRule = ({ color = COLORS.brown, thickness = 2, marginVertical = 8 }) => (
  <View
    style={{
      borderBottomWidth: thickness,
      borderBottomColor: color,
      marginTop: marginVertical,
      marginBottom: marginVertical,
    }}
  />
);

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 50,
    paddingTop: 30,
    paddingBottom: 65,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.3,
    backgroundColor: COLORS.white,
    position: "relative",
  },
  // Date top-right with underline
  dateContainer: {
    position: "absolute",
    top: 25,
    right: 50,
    width: 180,
    textAlign: "right",
  },
  dateText: {
    fontSize: 8,
    color: COLORS.darkGray,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.darkGray,
  },
  // Title block
  titleSection: {
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: COLORS.brown,
    marginBottom: 0,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Helvetica-BoldOblique",
    color: COLORS.lightBrown,
    letterSpacing: 1,
  },
  // Body text
  clientName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.darkGray,
    marginBottom: 2,
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
    marginBottom: 2,
    marginTop: 4,
  },
  bulletList: {
    marginLeft: 12,
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
  },
  validityText: {
    fontSize: 10,
    color: COLORS.darkGray,
    marginTop: 4,
    marginBottom: 2,
  },
  attestation: {
    fontSize: 10,
    color: COLORS.darkGray,
    marginTop: 4,
    marginBottom: 2,
  },
  // Signature (left-aligned, bold brown)
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
  // Footer (centered, below brown line)
  footer: {
    position: "absolute",
    bottom: 12,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 7,
    lineHeight: 1.4,
  },
  footerDivider: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.brown,
    marginBottom: 6,
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
        {/* Date top-right with underline */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {location}, {formatDate(date)}
          </Text>
        </View>

        {/* Title + subtitle */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>PRESUPUESTO</Text>
          <Text style={styles.subtitle}>{budgetTypeInfo.label}</Text>
        </View>

        {/* Brown separator line below title */}
        <HRule thickness={2} marginVertical={8} />

        {/* Client */}
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

        {/* Validity + Atte */}
        <Text style={styles.validityText}>
          Se extiende el presente presupuesto por una plazo de {validityDays} días hábiles.
        </Text>
        <Text style={styles.attestation}>Atte.-</Text>

        {/* Signature */}
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureName}>{ERICA_INFO.name}</Text>
          <Text style={styles.signatureTitle}>{ERICA_INFO.title}</Text>
          <Text style={styles.signatureLicense}>{ERICA_INFO.license}</Text>
        </View>

        {/* Footer: brown line + centered contact */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerLine}>{ERICA_INFO.displayName}• {ERICA_INFO.title}</Text>
          <Text style={styles.footerLine}>{ERICA_INFO.email} / Tel {ERICA_INFO.phone}</Text>
          <Text style={styles.footerLine}>{ERICA_INFO.address}</Text>
          <Text style={styles.footerWebsite}>{ERICA_INFO.website}</Text>
        </View>
      </Page>
    </Document>
  );
};
