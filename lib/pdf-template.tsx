import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold' },
  section: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#666', width: 120 },
})

interface InvoiceData {
  number: string
  emitter: {
    name: string
    address: string
    siret: string
    tva: string
  }
  client: {
    name: string
    email: string
    address: string
    siret?: string
    tva?: string
    type: 'particulier' | 'pro'
  }
  items: Array<{ description: string; quantity: number; price: number }>
  amount: number
}

export const generatePDF = async (data: InvoiceData) => {
  const { number, emitter, client, items, amount } = data

  const MyDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Facture Pro</Text>
            <Text>Freelance Edition</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{number}</Text>
            <Text>{new Date().toLocaleDateString('fr-FR')}</Text>
          </View>
        </View>

        {/* Émetteur */}
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Émetteur :</Text>
          <Text>{emitter.name}</Text>
          <Text>{emitter.address}</Text>
          <Text>SIRET : {emitter.siret}</Text>
          <Text>TVA : {emitter.tva}</Text>
        </View>

        {/* Client */}
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Facturer à :</Text>
          <Text>{client.name}</Text>
          <Text>{client.email}</Text>
          <Text>{client.address}</Text>
          {client.type === 'pro' && client.siret && <Text>SIRET : {client.siret}</Text>}
          {client.type === 'pro' && client.tva && <Text>TVA : {client.tva}</Text>}
        </View>

        {/* Articles */}
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Prestations</Text>
          {items.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text>{item.description}</Text>
              <Text>{item.quantity} × {item.price.toFixed(2)} €</Text>
              <Text>{(item.quantity * item.price).toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={{ borderTop: '1px solid #000', paddingTop: 15, marginTop: 20 }}>
          <View style={styles.row}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total TTC</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{amount.toFixed(2)} €</Text>
          </View>
        </View>

        <Text style={{ marginTop: 50, textAlign: 'center', fontSize: 10, color: '#666' }}>
          Merci pour votre confiance • Facture Pro
        </Text>
      </Page>
    </Document>
  )

  const blob = await import('@react-pdf/renderer').then(({ pdf }) => pdf(MyDocument).toBlob())
  return blob
}