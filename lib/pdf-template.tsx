import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { 
    padding: 50, 
    fontSize: 11, 
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 40,
    borderBottom: '3px solid #8b5cf6',
    paddingBottom: 20 
  },
  logoContainer: { 
    width: 100, 
    height: 100 
  },
  logo: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'contain' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#8b5cf6' 
  },
  invoiceInfo: { 
    textAlign: 'right' 
  },
  section: { 
    marginBottom: 25 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1px solid #e5e5e5'
  },
  total: { 
    borderTop: '3px solid #8b5cf6', 
    paddingTop: 15, 
    marginTop: 25 
  },
})

export const generatePDF = async (data: any) => {
  const MyDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER AVEC LOGO */}
        <View style={styles.header}>
          {/* Logo à gauche */}
          <View style={styles.logoContainer}>
            {data.emitter.logoUrl ? (
              <Image src={data.emitter.logoUrl} style={styles.logo} />
            ) : (
              <View style={{
                width: 90, 
                height: 90, 
                backgroundColor: '#8b5cf6', 
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ color: 'white', fontSize: 36, fontWeight: 'bold' }}>FP</Text>
              </View>
            )}
          </View>

          {/* Info Facture */}
          <View style={styles.invoiceInfo}>
            <Text style={styles.title}>FACTURE</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8 }}>{data.number}</Text>
            <Text style={{ marginTop: 4 }}>{new Date().toLocaleDateString('fr-FR')}</Text>
          </View>
        </View>

        {/* Émetteur & Client */}
        <View style={{ flexDirection: 'row', gap: 50, marginBottom: 35 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10, color: '#8b5cf6', fontSize: 14 }}>ÉMETTEUR</Text>
            <Text style={{ fontSize: 12 }}>{data.emitter.name}</Text>
            <Text style={{ fontSize: 12 }}>{data.emitter.address}</Text>
            <Text style={{ fontSize: 12 }}>SIRET : {data.emitter.siret}</Text>
            <Text style={{ fontSize: 12 }}>TVA : {data.emitter.tva}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10, color: '#8b5cf6', fontSize: 14 }}>CLIENT</Text>
            <Text style={{ fontSize: 12 }}>{data.client.name}</Text>
            <Text style={{ fontSize: 12 }}>{data.client.address}</Text>
            {data.client.siret && <Text style={{ fontSize: 12 }}>SIRET : {data.client.siret}</Text>}
          </View>
        </View>

        {/* Prestations */}
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 14, color: '#8b5cf6' }}>PRESTATIONS</Text>
          {data.items.map((item: any, i: number) => (
            <View key={i} style={styles.row}>
              <Text style={{ flex: 2 }}>{item.description}</Text>
              <Text style={{ textAlign: 'center', width: 80 }}>{item.quantity} × {item.price.toFixed(2)} €</Text>
              <Text style={{ textAlign: 'right', width: 90 }}>{(item.quantity * item.price).toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* TOTAL */}
        <View style={styles.total}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total TTC</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#8b5cf6' }}>
              {data.amount.toFixed(2)} €
            </Text>
          </View>
        </View>

        <Text style={{ marginTop: 60, textAlign: 'center', fontSize: 10, color: '#666' }}>
          Merci pour votre confiance • Paiement sécurisé via Stripe disponible
        </Text>
      </Page>
    </Document>
  )

  const { pdf } = await import('@react-pdf/renderer')
  return pdf(MyDocument).toBlob()
}