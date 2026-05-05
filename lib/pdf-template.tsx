import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111' },
  section: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  tableHeader: { flexDirection: 'row', borderBottom: '1px solid #000', paddingBottom: 8, marginBottom: 8 },
  tableRow: { flexDirection: 'row', marginBottom: 6 },
})

interface InvoiceData {
  number: string
  client: string
  items: { description: string; quantity: number; price: number }[]
}

export const generatePDF = async (data: InvoiceData) => {
  const total = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  const MyDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>FACTURE</Text>
            <Text>{data.number}</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Freelance Facture Pro</Text>
            <Text>Paris, France</Text>
            <Text>contact@freelance-facture.pro</Text>
          </View>
        </View>

        {/* Client */}
        <View style={styles.section}>
          <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>Client :</Text>
          <Text>{data.client}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.tableHeader}>
          <Text style={{ flex: 3 }}>Description</Text>
          <Text style={{ flex: 1, textAlign: 'center' }}>Qté</Text>
          <Text style={{ flex: 1, textAlign: 'right' }}>Prix</Text>
          <Text style={{ flex: 1, textAlign: 'right' }}>Total</Text>
        </View>

        {data.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={{ flex: 3 }}>{item.description}</Text>
            <Text style={{ flex: 1, textAlign: 'center' }}>{item.quantity}</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>{item.price.toFixed(2)} €</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>{(item.quantity * item.price).toFixed(2)} €</Text>
          </View>
        ))}

        {/* Total */}
        <View style={{ marginTop: 30, borderTop: '2px solid #000', paddingTop: 12 }}>
          <View style={styles.row}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>TOTAL</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{total.toFixed(2)} €</Text>
          </View>
        </View>

        <Text style={{ position: 'absolute', bottom: 40, left: 40, fontSize: 9, color: '#666' }}>
          Facture générée le {new Date().toLocaleDateString('fr-FR')}
        </Text>
      </Page>
    </Document>
  )

  const blob = await pdf(MyDocument).toBlob()
  return blob
}