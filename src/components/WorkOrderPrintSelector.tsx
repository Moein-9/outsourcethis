import React from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { Invoice } from '@/store/invoiceStore';
import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
  Image,
  PDFViewer,
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { logoBase64 } from '@/components/ui/logo';

interface WorkOrderPrintSelectorProps {
  invoice: Invoice;
}

// Register font
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/vfs_fonts.js' },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 50,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 20,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  itemLabel: {
    width: 120,
    fontWeight: 'bold',
  },
  itemValue: {
    flexGrow: 1,
  },
  footer: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  logo: {
    width: 80,
    height: 40,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  companyInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  contactInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCellHeader: {
    margin: 4,
    fontSize: 10,
    fontWeight: 'bold'
  },
  tableCell: {
    margin: 5,
    fontSize: 9
  }
});

const WorkOrderPrintSelector: React.FC<WorkOrderPrintSelectorProps> = ({ invoice }) => {
  const { t } = useLanguageStore();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.companyInfo}>
              <Image style={styles.logo} src={logoBase64} />
              <Text>Your Company Name</Text>
              <Text>123 Main Street</Text>
              <Text>City, State, ZIP</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text>Email: info@example.com</Text>
              <Text>Phone: (123) 456-7890</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>{t('workOrderDetails')}</Text>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.subtitle}>{t('patientInformation')}</Text>
                <View style={styles.item}>
                  <Text style={styles.itemLabel}>{t('patientName')}:</Text>
                  <Text style={styles.itemValue}>{invoice.patientName}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemLabel}>{t('phoneNumber')}:</Text>
                  <Text style={styles.itemValue}>{invoice.patientPhone}</Text>
                </View>
              </View>
              <View style={styles.column}>
                <Text style={styles.subtitle}>{t('orderNumber')}</Text>
                <View style={styles.item}>
                  <Text style={styles.itemLabel}>{t('invoiceNumber')}:</Text>
                  <Text style={styles.itemValue}>{invoice.invoiceId}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemLabel}>{t('date')}:</Text>
                  <Text style={styles.itemValue}>{formatDate(invoice.createdAt)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>{t('frameDetails')}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>{t('brand')}</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>{t('model')}</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>{t('color')}</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>{t('price')}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{invoice.frameBrand}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{invoice.frameModel}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{invoice.frameColor}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{invoice.framePrice}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>{t('lensDetails')}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>{t('lensType')}</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>{t('coating')}</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>{t('lensPrice')}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{invoice.lensType}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{invoice.coating}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{invoice.lensPrice}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>{t('paymentSection')}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>{t('paymentMethod')}</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>{t('amount')}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{invoice.paymentMethod}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{invoice.total}</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.footer}>
            {t('thankYou')}
          </Text>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default WorkOrderPrintSelector;
