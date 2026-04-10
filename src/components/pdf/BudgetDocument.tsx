import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import {
  ERICA_INFO,
  COLORS,
  BUDGET_TYPES,
  BudgetType,
} from "@/lib/constants";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

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
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
    backgroundColor: COLORS.white,
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.brown,
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    textAlign: "right",
  },
  date: {
    fontSize: 10,
    color: COLORS.darkGray,
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.brown,
    marginBottom: 5,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.lightBrown,
    letterSpacing: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.brown,
    marginBottom: 10,
    marginTop: 15,
    textTransform: "uppercase",
  },
  label: {
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  clientName: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 15,
  },
  bulletList: {
    marginLeft: 15,
    marginBottom: 15,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bullet: {
    width: 15,
    fontSize: 11,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.darkGray,
  },
  calculationBox: {
    backgroundColor: COLORS.lightGray,
    padding: 15,
    marginBottom: 20,
    borderRadius: 4,
  },
  calculationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 11,
  },
  calculationLabel: {
    flex: 1,
  },
  calculationValue: {
    fontWeight: "bold",
    minWidth: 120,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.brown,
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 12,
    color: COLORS.brown,
  },
  totalValue: {
    fontWeight: "bold",
    fontSize: 12,
    color: COLORS.brown,
    minWidth: 120,
    textAlign: "right",
  },
  paymentStagesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.brown,
    marginBottom: 10,
    marginTop: 15,
    textTransform: "uppercase",
  },
  paymentStageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 10,
  },
  paymentStageDescription: {
    flex: 1,
  },
  paymentStageAmount: {
    minWidth: 120,
    textAlign: "right",
  },
  validityText: {
    fontSize: 10,
    color: COLORS.darkGray,
    marginTop: 15,
    marginBottom: 15,
    lineHeight: 1.6,
  },
  signatureBlock: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.brown,
    paddingTop: 20,
    textAlign: "center",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGray,
    marginBottom: 8,
    height: 50,
  },
  signatureName: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.brown,
    marginBottom: 4,
  },
  signatureTitle: {
    fontSize: 10,
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  signatureLicense: {
    fontSize: 9,
    color: COLORS.darkGray,
  },
  footer: {
    fontSize: 9,
    color: COLORS.darkGray,
    textAlign: "center",
    marginTop: 40,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    lineHeight: 1.5,
  },
  footerDivider: {
    color: COLORS.brown,
    marginVertical: 2,
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.date}>
                {location}, {formatDate(date)}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>PRESUPUESTO</Text>
          <Text style={styles.subtitle}>{budgetTypeInfo.label}</Text>
        </View>

        {/* Client */}
        <View style={styles.section}>
          <Text style={styles.clientName}>Sr. {clientName.toUpperCase()}</Text>
        </View>

        {/* Price per m2 */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Precio por m²: {formatCurrency(pricePerM2)}
          </Text>
        </View>

        {/* Includes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INCLUYE:</Text>
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
          <Text style={styles.sectionTitle}>NO INCLUYE:</Text>
          <View style={styles.bulletList}>
            {excludeItems.map((item, idx) => (
              <View key={idx} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Calculation */}
        <View style={styles.calculationBox}>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Superficie:</Text>
            <Text style={styles.calculationValue}>
              {formatNumber(surfaceM2)} m²
            </Text>
          </View>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Precio por m²:</Text>
            <Text style={styles.calculationValue}>
              {formatCurrency(pricePerM2)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
          <Text style={{ fontSize: 9, marginTop: 8, color: COLORS.darkGray }}>
            (IVA incluido)
          </Text>
        </View>

        {/* Payment Stages */}
        <View style={styles.section}>
          <Text style={styles.paymentStagesTitle}>FORMA DE PAGO:</Text>
          {paymentStages.map((stage, idx) => (
            <View key={idx} style={styles.paymentStageRow}>
              <Text style={styles.paymentStageDescription}>
                {stage.description} ({stage.percent}%):
              </Text>
              <Text style={styles.paymentStageAmount}>
                {formatCurrency((total * stage.percent) / 100)}
              </Text>
            </View>
          ))}
        </View>

        {/* Validity */}
        <Text style={styles.validityText}>
          Presupuesto válido por {validityDays} días desde la fecha.
        </Text>

        {/* Signature Block */}
        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureName}>{ERICA_INFO.name}</Text>
          <Text style={styles.signatureTitle}>{ERICA_INFO.title}</Text>
          <Text style={styles.signatureLicense}>{ERICA_INFO.license}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{ERICA_INFO.email}</Text>
          <Text style={styles.footerDivider}>●</Text>
          <Text>Tel {ERICA_INFO.phone}</Text>
          <Text style={styles.footerDivider}>●</Text>
          <Text>{ERICA_INFO.address}</Text>
          <Text style={styles.footerDivider}>●</Text>
          <Text>{ERICA_INFO.website}</Text>
        </View>
      </Page>
    </Document>
  );
};
