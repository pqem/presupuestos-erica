import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import "@/lib/pdf-fonts";
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
    paddingHorizontal: 71,
    paddingTop: 50,
    paddingBottom: 70,
    fontFamily: "OpenSans",
    fontWeight: 400,
    fontSize: 10,
    lineHeight: 1.3,
    color: COLORS.black,
    backgroundColor: COLORS.white,
    position: "relative",
  },
  // Date top-right, no underline
  dateContainer: {
    position: "absolute",
    top: 25,
    right: 71,
    width: 180,
    textAlign: "right",
  },
  dateText: {
    fontFamily: "OpenSans",
    fontWeight: 400,
    fontSize: 8,
    color: COLORS.black,
  },
  // Title: Montserrat Black, brown
  titleSection: {
    marginTop: 8,
  },
  title: {
    fontFamily: "Montserrat",
    fontWeight: 700,
    fontSize: 26,
    color: COLORS.primary,
    marginBottom: 0,
    letterSpacing: 2,
  },
  // Subtitle: Montserrat Bold, brown
  subtitle: {
    fontFamily: "Montserrat",
    fontWeight: 700,
    fontSize: 14,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  // PT Sans Bold, black
  ptBold: {
    fontFamily: "OpenSans",
    fontWeight: 700,
  },
  // Client: PT Sans Bold, black
  clientName: {
    fontFamily: "OpenSans",
    fontWeight: 700,
    fontSize: 10,
    color: COLORS.black,
    marginBottom: 2,
  },
  // Body paragraph: PT Sans Regular, black
  paragraph: {
    fontFamily: "OpenSans",
    fontWeight: 400,
    fontSize: 10,
    lineHeight: 1.3,
    marginBottom: 4,
    textAlign: "justify",
    color: COLORS.black,
  },
  // Section headers: PT Sans Bold, black
  sectionHeader: {
    fontFamily: "OpenSans",
    fontWeight: 700,
    fontSize: 10,
    color: COLORS.black,
    marginBottom: 4,
    marginTop: 12,
  },
  // Bullet list
  bulletList: {
    marginLeft: 36,
    marginBottom: 4,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 1,
  },
  bullet: {
    width: 10,
    fontSize: 10,
    fontFamily: "OpenSans",
    fontWeight: 400,
  },
  // Bullet text: PT Sans Regular, black
  bulletText: {
    flex: 1,
    fontFamily: "OpenSans",
    fontWeight: 400,
    fontSize: 9,
    color: COLORS.black,
    lineHeight: 1.3,
  },
  // Calculation paragraph: PT Sans Regular
  calculationParagraph: {
    fontFamily: "OpenSans",
    fontWeight: 400,
    fontSize: 10,
    lineHeight: 1.3,
    marginTop: 4,
    marginBottom: 2,
    textAlign: "justify",
    color: COLORS.black,
  },
  // Payment stage: PT Sans Regular + Bold for amounts
  paymentStageText: {
    fontFamily: "OpenSans",
    fontWeight: 400,
    fontSize: 10,
    lineHeight: 1.3,
    marginBottom: 1,
    color: COLORS.black,
  },
  // Validity: PT Sans Regular
  validityText: {
    fontFamily: "OpenSans",
    fontWeight: 400,
    fontSize: 10,
    color: COLORS.black,
    marginTop: 4,
    marginBottom: 2,
  },
  // Atte: PT Sans Regular
  attestation: {
    fontFamily: "OpenSans",
    fontWeight: 400,
    fontSize: 10,
    color: COLORS.black,
    marginTop: 4,
    marginBottom: 2,
  },
  // Signature: PT Sans Bold, black
  signatureBlock: {
    marginTop: 3,
    textAlign: "left",
  },
  signatureName: {
    fontFamily: "OpenSans",
    fontWeight: 700,
    fontSize: 10,
    color: COLORS.black,
    marginBottom: 1,
  },
  signatureTitle: {
    fontFamily: "OpenSans",
    fontWeight: 700,
    fontSize: 9,
    color: COLORS.black,
    marginBottom: 1,
  },
  signatureLicense: {
    fontFamily: "OpenSans",
    fontWeight: 700,
    fontSize: 8,
    color: COLORS.black,
  },
  // Footer: PT Sans Regular, navy #1E3A5F, 8pt
  footer: {
    position: "absolute",
    bottom: 12,
    left: 71,
    right: 71,
    textAlign: "right",
    fontSize: 8,
    lineHeight: 1.4,
  },
  footerDivider: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    marginBottom: 6,
  },
  footerLine: {
    fontFamily: "OpenSans",
    fontWeight: 400,
    color: COLORS.primary,
    marginBottom: 1,
  },
  footerWebsite: {
    fontFamily: "OpenSans",
    fontWeight: 400,
    color: COLORS.primary,
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
    <Document
      title={`Presupuesto ${clientName} - ${budgetTypeInfo.label}`}
      author="Erica Avalos"
    >
      <Page size="A4" style={styles.page}>
        {/* Date top-right with underline */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {location}, {formatDate(date)}
          </Text>
        </View>

        {/* Title: Montserrat Black, brown */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>PRESUPUESTO</Text>
          <Text style={styles.subtitle}>{budgetTypeInfo.label}</Text>
        </View>

        {/* Client: PT Sans Bold */}
        <Text style={styles.clientName}>Sr. {clientName.toUpperCase()}</Text>

        {/* Intro: PT Sans Regular, bold highlights in PT Sans Bold */}
        <Text style={styles.paragraph}>
          Se presupuesta por elaboración, trámites y visado definitivo de planos para{" "}
          <Text style={styles.ptBold}>{budgetTypeInfo.shortLabel}</Text> el valor de:{" "}
          <Text style={styles.ptBold}>{formatCurrency(pricePerM2)} por m2</Text>.
        </Text>

        {/* Includes: header PT Sans Bold, items PT Sans Regular */}
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

        {/* Calculation: PT Sans Regular, bold for numbers */}
        <Text style={styles.calculationParagraph}>
          Estimando una superficie cubierta de{" "}
          <Text style={styles.ptBold}>{formatNumber(surfaceM2)} m2</Text> el total es de{" "}
          <Text style={styles.ptBold}>{formatCurrency(total)}</Text> (IVA incluido) en concepto de honorarios. El pago de los mismos se realizará en {stagesWord} etapas conforme avanza la elaboración y tramitación de los planos, a saber:
        </Text>

        {/* Payment stages: bold for % and amount, regular for description */}
        {paymentStages.map((stage, idx) => {
          const stageAmount = (total * stage.percent) / 100;
          return (
            <Text key={idx} style={styles.paymentStageText}>
              <Text style={styles.ptBold}>{stage.percent}% ({formatCurrency(stageAmount)})</Text> {stage.description}.
            </Text>
          );
        })}

        {/* Validity: PT Sans Regular */}
        <Text style={styles.validityText}>
          Se extiende el presente presupuesto por un plazo de {validityDays} días hábiles.
        </Text>

        {/* Atte: PT Sans Regular */}
        <Text style={styles.attestation}>Atte.-</Text>

        {/* Signature: PT Sans Bold, black */}
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureName}>{ERICA_INFO.name}</Text>
          <Text style={styles.signatureTitle}>{ERICA_INFO.title}</Text>
          <Text style={styles.signatureLicense}>{ERICA_INFO.license}</Text>
        </View>

        {/* Footer: brown line + PT Sans Regular brown 8pt centered */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerLine}>{ERICA_INFO.displayName} • {ERICA_INFO.title}</Text>
          <Text style={styles.footerLine}>{ERICA_INFO.email} / Tel {ERICA_INFO.phone}</Text>
          <Text style={styles.footerLine}>{ERICA_INFO.address}</Text>
          <Text style={styles.footerWebsite}>{ERICA_INFO.website}</Text>
        </View>
      </Page>
    </Document>
  );
};
