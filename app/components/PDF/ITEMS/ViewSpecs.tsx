import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const mockData = {
  project: "L1464-01-30 ADF Mud Ext & Winter Lounge Modif FFE",
  area: "A3AB000104 - courtyard",
  issueDate: "20-Dec-2021",
  items: [
    {
      title: "Lamp shade - standard temporary",
      quantity: "2 EA",
      orderNumber: "85653",
      manufacturer:
        "Samarkand Design, Higher Queen Dart, Rackenford, Tiverton, Devon, EX16 8EA, Great Britain.",
      email: "carrie@samarkanddesign.com",
      telephone: "0044 07973 922493",
      partNumber:
        '50CM/20" EMPIRE - ACID YELLOW & GREY ACORN COTTON LAMPSHADE & CARRIER',
      dimensions: "330mm H x 500mm diameter at base x 330mm diameter at top",
      composition: "Cotton 100 %",
      notes: [
        "DESCRIPTION: Pleated fabric shade.",
        "FINISH: Gathered at base.",
        "FRAME SIZE: 50cm pleat.",
        'FRAME FITTING: Duplex with 7" carrier.',
        "FABRIC FINISH: Pleated.",
        "ADDITIONAL INFORMATION: Fitted with BC reducer.",
      ],
    },
    // ... other items
  ],
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000000",
    borderStyle: "solid",
  },
  leftColumn: {
    flex: 1,
    paddingRight: 2,
    borderRightColor: "#D3D3D3",
    borderRightWidth: 1,
    borderRightStyle: "solid",
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 2,
  },
  itemHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemContent: {
    fontSize: 12,
    marginBottom: 3,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 3,
  },
  section: {
    fontSize: 12,
    marginBottom: 3,
  },
});

const SpecDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>FF&E Specification</Text>
      {mockData.items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <View style={styles.leftColumn}>
            <Text style={styles.itemHeader}>{item.title}</Text>
            {item.notes.map((note, noteIndex) => (
              <Text key={noteIndex} style={styles.section}>
                {note.split(":")[1]}
              </Text>
            ))}
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.itemContent}>Qty: {item.quantity}</Text>
            <Text style={styles.itemContent}>
              Order Number: {item.orderNumber}
            </Text>
            <Text style={styles.itemContent}>
              Manufacturer: {item.manufacturer}
            </Text>
            <Text style={styles.itemContent}>Email: {item.email}</Text>
            <Text style={styles.itemContent}>Tel: {item.telephone}</Text>
            <Text style={styles.itemContent}>
              Part Number: {item.partNumber}
            </Text>
            <Text style={styles.itemContent}>
              Dimensions: {item.dimensions}
            </Text>
            <Text style={styles.itemContent}>
              Composition: {item.composition}
            </Text>
            {item.notes.map((note, noteIndex) => (
              <Text key={noteIndex} style={styles.sectionHeader}>
                {note.split(":")[0]}:
              </Text>
            ))}
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default SpecDocument;
