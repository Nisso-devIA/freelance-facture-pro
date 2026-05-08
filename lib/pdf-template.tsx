import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 50, fontSize: 11, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, borderBottom: '2px solid #8b5cf6', paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#8b5cf6' },
  section: { marginBottom: 25 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  total: { borderTop: '2px solid #8b5cf6', paddingTop: 15, marginTop: 20 },
})

export const generatePDF = async (data: any) => {
  const MyDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>FACTURE PRO</Text>
            <Text>Freelance Edition</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{data.number}</Text>
            <Text>{new Date().toLocaleDateString('fr-FR')}</Text>
          </View>
        </View>

        {/* Émetteur & Client */}
        <View style={{ flexDirection: 'row', gap: 40, marginBottom: 30 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Émetteur</Text>
            <Text>{data.emitter.name}</Text>
            <Text>{data.emitter.address}</Text>
            <Text>SIRET : {data.emitter.siret}</Text>
            <Text>TVA : {data.emitter.tva}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Client</Text>
            <Text>{data.client.name}</Text>
            <Text>{data.client.address}</Text>
            {data.client.type === 'pro' && <Text>SIRET : {data.client.siret}</Text>}
          </View>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 14 }}>Prestations</Text>
          {data.items.map((item: any, i: number) => (
            <View key={i} style={styles.row}>
              <Text>{item.description}</Text>
              <Text>{item.quantity} × {item.price.toFixed(2)} €</Text>
              <Text>{(item.quantity * item.price).toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.total}>
          <View style={styles.row}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total TTC</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#8b5cf6' }}>{data.amount.toFixed(2)} €</Text>
          </View>
        </View>

        <Text style={{ marginTop: 50, textAlign: 'center', fontSize: 10, color: '#666' }}>
          Merci pour votre confiance • Paiement sécurisé via Stripe disponible
        </Text>
      </Page>
    </Document>
  )

  const { pdf } = await import('@react-pdf/renderer')
  return pdf(MyDocument).toBlob()
}