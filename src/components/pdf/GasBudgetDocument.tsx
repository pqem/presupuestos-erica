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
  GASISTA_INFO,
  COLORS,
  OtroCosto,
} from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

interface GasBudgetDocumentProps {
  date: Date;
  location: string;
  clientName: string;
  tramiteType: string;
  direccionObra: string;
  montoTramite: number;
  montoManoObra: number;
  otrosCostos: OtroCosto[];
  includeItems: string[];
  workStages: string[];
  infoNotes: string[];
  paymentStages: { percent: number; description: string }[];
  validityDays: number;
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 71,
    paddingTop: 50,
    paddingBottom: 70,
    fontFamily: "PTSans",
    fontWeight: 400,
    fontSize: 9,
    lineHeight: 1.3,
    color: COLORS.black,
    backgroundColor: COLORS.white,
    position: "relative",
  },
  dateContainer: {
    position: "absolute",
    top: 25,
    right: 71,
    width: 180,
    textAlign: "right",
  },
  dateText: {
    fontFamily: "PTSans",
    fontWeight: 400,
    fontSize: 8,
    color: COLORS.black,
  },
  titleSection: {
    marginTop: 8,
  },
  title: {
    fontFamily: "Montserrat",
    fontWeight: 900,
    fontSize: 26,
    color: COLORS.primary,
    marginBottom: 0,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: "Montserrat",
    fontWeight: 700,
    fontSize: 14,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  ptBold: {
    fontFamily: "PTSans",
    fontWeight: 700,
  },
  clientName: {
    fontFamily: "PTSans",
    fontWeight: 700,
    fontSize: 10,
    color: COLORS.black,
    marginBottom: 4,
  },
  paragraph: {
    fontFamily: "PTSans",
    fontWeight: 400,
    fontSize: 9,
    lineHeight: 1.3,
    marginBottom: 4,
    textAlign: "justify",
    color: COLORS.black,
  },
  sectionHeader: {
    fontFamily: "PTSans",
    fontWeight: 700,
    fontSize: 9,
    color: COLORS.black,
    marginBottom: 4,
    marginTop: 12,
  },
  bulletList: {
    marginLeft: 36,
    marginBottom: 4,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 1,
  },
  bullet: {
    width: 8,
    fontSize: 9,
    fontFamily: "PTSans",
    fontWeight: 400,
  },
  bulletText: {
    flex: 1,
    fontFamily: "PTSans",
    fontWeight: 400,
    fontSize: 8,
    color: COLORS.black,
    lineHeight: 1.3,
  },
  stageText: {
    fontFamily: "PTSans",
    fontWeight: 400,
    fontSize: 9,
    lineHeight: 1.3,
    marginBottom: 2,
    color: COLORS.black,
  },
  tableContainer: {
    marginBottom: 3,
    borderWidth: 0.5,
    borderColor: COLORS.darkGray,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.darkGray,
  },
  tableRowHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkGray,
    backgroundColor: "#F5F5F5",
  },
  tableCell: {
    padding: 4,
    fontSize: 8,
    fontFamily: "PTSans",
    fontWeight: 400,
  },
  tableCellHeader: {
    padding: 4,
    fontSize: 8,
    fontFamily: "PTSans",
    fontWeight: 700,
  },
  tableCellLeft: {
    flex: 3,
    paddingLeft: 4,
    paddingRight: 2,
  },
  tableCellRight: {
    flex: 1,
    textAlign: "right",
    paddingLeft: 2,
    paddingRight: 4,
  },
  tableRowTotal: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGray,
  },
  tableCellTotal: {
    padding: 4,
    fontSize: 9,
    fontFamily: "PTSans",
    fontWeight: 700,
  },
  paymentStageText: {
    fontFamily: "PTSans",
    fontWeight: 400,
    fontSize: 9,
    lineHeight: 1.3,
    marginBottom: 1,
    color: COLORS.black,
  },
  validityText: {
    fontFamily: "PTSans",
    fontWeight: 400,
    fontSize: 9,
    color: COLORS.black,
    marginTop: 3,
    marginBottom: 2,
  },
  attestation: {
    fontFamily: "PTSans",
    fontWeight: 400,
    fontSize: 9,
    color: COLORS.black,
    marginTop: 3,
    marginBottom: 2,
  },
  signatureBlock: {
    marginTop: 2,
    textAlign: "left",
  },
  signatureName: {
    fontFamily: "PTSans",
    fontWeight: 700,
    fontSize: 9,
    color: COLORS.black,
    marginBottom: 0.5,
  },
  signatureTitle: {
    fontFamily: "PTSans",
    fontWeight: 700,
    fontSize: 8,
    color: COLORS.black,
    marginBottom: 0.5,
  },
  signatureLicense: {
    fontFamily: "PTSans",
    fontWeight: 700,
    fontSize: 7,
    color: COLORS.black,
  },
  footer: {
    position: "absolute",
    bottom: 12,
    left: 71,
    right: 71,
    textAlign: "right",
    fontSize: 7,
    lineHeight: 1.4,
  },
  footerDivider: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    marginBottom: 4,
  },
  footerLine: {
    fontFamily: "PTSans",
    fontWeight: 400,
    color: COLORS.primary,
    marginBottom: 0.5,
  },
  footerWebsite: {
    fontFamily: "PTSans",
    fontWeight: 400,
    color: COLORS.primary,
  },
});

export const GasBudgetDocument: React.FC<GasBudgetDocumentProps> = ({
  date,
  location,
  clientName,
  tramiteType,
  direccionObra,
  montoTramite,
  montoManoObra,
  otrosCostos,
  includeItems,
  workStages,
  infoNotes,
  paymentStages,
  validityDays,
}) => {
  const total = montoTramite + montoManoObra + otrosCostos.reduce((sum, c) => sum + c.monto, 0);

  return (
    <Document
      title={`Presupuesto ${clientName} - Instalación de Gas`}
      author="Erica Avalos"
    >
      <Page size="A4" style={styles.page}>
        {/* Date top-right with underline */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {location}, {formatDate(date)}
          </Text>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>PRESUPUESTO</Text>
          <Text style={styles.subtitle}>INSTALACIÓN DE GAS</Text>
        </View>

        {/* Client */}
        <Text style={styles.clientName}>Sr. {clientName.toUpperCase()}</Text>

        {/* Intro */}
        <Text style={styles.paragraph}>
          Se presupuesta el servicio de{" "}
          <Text style={styles.ptBold}>INSTALACIÓN DE GAS</Text> ante Camuzzi Gas del Sur en la
          dirección <Text style={styles.ptBold}>{direccionObra}</Text>.
        </Text>

        {/* EL SERVICIO INCLUYE */}
        <Text style={styles.sectionHeader}>EL SERVICIO INCLUYE:</Text>
        <View style={styles.bulletList}>
          {includeItems.map((item, idx) => (
            <View key={idx} style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* ETAPAS DEL TRABAJO */}
        <Text style={styles.sectionHeader}>ETAPAS DEL TRABAJO:</Text>
        <Text style={styles.stageText}>
          <Text style={styles.ptBold}>ETAPA 1:</Text> {workStages[0]}
        </Text>
        <Text style={styles.stageText}>
          <Text style={styles.ptBold}>ETAPA 2:</Text> {workStages[1]}
        </Text>

        {/* DETALLE DE COSTOS - Table */}
        <Text style={styles.sectionHeader}>DETALLE DE COSTOS:</Text>
        <View style={styles.tableContainer}>
          {/* Header */}
          <View style={styles.tableRowHeader}>
            <Text
              style={{
                ...styles.tableCellHeader,
                ...styles.tableCellLeft,
              }}
            >
              Concepto
            </Text>
            <Text
              style={{
                ...styles.tableCellHeader,
                ...styles.tableCellRight,
              }}
            >
              Importe
            </Text>
          </View>

          {/* Trámite */}
          <View style={styles.tableRow}>
            <Text style={{ ...styles.tableCell, ...styles.tableCellLeft }}>
              Trámite (Inicio, planos, inspecciones)
            </Text>
            <Text style={{ ...styles.tableCell, ...styles.tableCellRight }}>
              {formatCurrency(montoTramite)}
            </Text>
          </View>

          {/* Mano de Obra */}
          <View style={styles.tableRow}>
            <Text style={{ ...styles.tableCell, ...styles.tableCellLeft }}>
              Mano de obra (Dirección y ejecución)
            </Text>
            <Text style={{ ...styles.tableCell, ...styles.tableCellRight }}>
              {formatCurrency(montoManoObra)}
            </Text>
          </View>

          {/* Otros Costos */}
          {otrosCostos.map((costo, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={{ ...styles.tableCell, ...styles.tableCellLeft }}>
                {costo.concepto}
              </Text>
              <Text style={{ ...styles.tableCell, ...styles.tableCellRight }}>
                {formatCurrency(costo.monto)}
              </Text>
            </View>
          ))}

          {/* Total */}
          <View style={styles.tableRowTotal}>
            <Text
              style={{
                ...styles.tableCellTotal,
                ...styles.tableCellLeft,
              }}
            >
              TOTAL
            </Text>
            <Text
              style={{
                ...styles.tableCellTotal,
                ...styles.tableCellRight,
              }}
            >
              {formatCurrency(total)}
            </Text>
          </View>
        </View>

        {/* CONDICIONES */}
        <Text style={styles.sectionHeader}>CONDICIONES:</Text>
        {paymentStages.map((stage, idx) => {
          const stageAmount = (total * stage.percent) / 100;
          return (
            <Text key={idx} style={styles.paymentStageText}>
              <Text style={styles.ptBold}>{stage.percent}% ({formatCurrency(stageAmount)})</Text>{" "}
              {stage.description}.
            </Text>
          );
        })}

        {/* INFORMACIÓN ADICIONAL */}
        <Text style={styles.sectionHeader}>INFORMACIÓN ADICIONAL:</Text>
        <View style={styles.bulletList}>
          {infoNotes.map((note, idx) => (
            <View key={idx} style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{note}</Text>
            </View>
          ))}
        </View>

        {/* Validity */}
        <Text style={styles.validityText}>
          Validez: {validityDays} días desde la fecha de emisión.
        </Text>

        {/* Atte */}
        <Text style={styles.attestation}>Atte.-</Text>

        {/* Signature */}
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureName}>{GASISTA_INFO.name}</Text>
          <Text style={styles.signatureTitle}>{GASISTA_INFO.title}</Text>
          <Text style={styles.signatureLicense}>{GASISTA_INFO.license}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerLine}>
            {GASISTA_INFO.displayName} • {GASISTA_INFO.title}
          </Text>
          <Text style={styles.footerLine}>
            {GASISTA_INFO.email} / Tel {GASISTA_INFO.phone}
          </Text>
          <Text style={styles.footerLine}>{GASISTA_INFO.address}</Text>
          <Text style={styles.footerWebsite}>{GASISTA_INFO.website}</Text>
        </View>
      </Page>
    </Document>
  );
};
