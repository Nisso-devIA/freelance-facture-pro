import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 50, fontSize: 11, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, alignItems: 'center' },
  logo: { fontSize: 28, fontWeight: 'bold', color: '#111' },
  title: { fontSize: 22, fontWeight: 'bold' },
  section: { marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#111', padding: 10, color: '#fff', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', padding: 10, borderBottom: '1px solid #eee' },
  total: { marginTop: 30, flexDirection: 'row', justifyContent: 'flex-end', fontSize: 16, fontWeight: 'bold' }
})

export const generatePDF = async ({ number, client, items }: { 
  number: string; 
  client: string; 
  items: Array<{ description: string; quantity: number; price: number }> 
}) => {
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  const MyDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>FP</Text>
          <Text style={styles.title}>Facture {number}</Text>
        </View>

        <Text style={{ marginBottom: 20 }}>Client : {client}</Text>

        <View style={styles.tableHeader}>
          <Text style={{ width: '50%' }}>Description</Text>
          <Text style={{ width: '15%', textAlign: 'center' }}>Qté</Text>
          <Text style={{ width: '15%', textAlign: 'right' }}>Prix unitaire</Text>
          <Text style={{ width: '20%', textAlign: 'right' }}>Total</Text>
        </View>

        {items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={{ width: '50%' }}>{item.description}</Text>
            <Text style={{ width: '15%', textAlign: 'center' }}>{item.quantity}</Text>
            <Text style={{ width: '15%', textAlign: 'right' }}>{item.price.toFixed(2)} €</Text>
            <Text style={{ width: '20%', textAlign: 'right' }}>{(item.quantity * item.price).toFixed(2)} €</Text>
          </View>
        ))}

        <View style={styles.total}>
          <Text>Total : {total.toFixed(2)} €</Text>
        </View>
      </Page>
    </Document>
  )

  return await pdf(MyDocument).toBlob()
}