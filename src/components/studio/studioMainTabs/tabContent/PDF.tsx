import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFViewer, // optional: for quick preview in browser
} from "@react-pdf/renderer";

const logoUrl = "https://dzinly.in/img/logo.png";

// --- FALLBACK IMAGE URL ---
const fallbackMaterialImageUrl =
  "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg";

// Dummy data to demonstrate the fallback
const materialData = [
  {
    name: "1. Vintagebrick Alexandria Buff",
    price: "$1500 / box",
    coverage: "10 sq.m / box",
    labor: "$100 sq.m",
    imageUrl:
      "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg",
  },
  {
    name: "2. Canyonbrick Shale Brown",
    price: "$1500 / box",
    coverage: "10 sq.m / box",
    labor: "$100 sq.m",
    imageUrl: null, // This will now show the fallback image
  },
];

// --- WALL SUB-SEGMENTS: 5-way split of the Wall segment ---
const wallSegmentMaterials = [
  {
    id: "Wall-1 (Paint)",
    type: "Paint",
    name: "Sherwin-Williams Duration — Alabaster (Satin)",
    imageUrl:
      "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__470-479_Medium_Range_Smooth_MTIwMDkz.jpg",
    areaSqft: 600,
    coats: 2,
    coverage: "350 sqft/gal",
    qty: "4 gal",
    materialCost: "$16,800.00",
    laborCost: "$18,000.00",
    subtotal: "$34,800.00",
  },
  {
    id: "Wall-2 (Siding)",
    type: "Siding",
    name: "James Hardie Lap Siding — Aged Pewter",
    imageUrl: null, // fallback will be used
    areaSqft: 450,
    coats: null,
    coverage: "—",
    qty: "450 sqft",
    materialCost: "$22,500.00",
    laborCost: "$10,800.00",
    subtotal: "$33,300.00",
  },
  {
    id: "Wall-3 (Stone Veneer)",
    type: "Stone",
    name: "Eldorado Stone — RidgeCut (Ashland)",
    imageUrl: null, // fallback
    areaSqft: 300,
    coats: null,
    coverage: "—",
    qty: "300 sqft",
    materialCost: "$27,000.00",
    laborCost: "$12,000.00",
    subtotal: "$39,000.00",
  },
  {
    id: "Wall-4 (Brick Veneer)",
    type: "Brick",
    name: "Belden — Alexandria Buff",
    imageUrl: null, // fallback
    areaSqft: 500,
    coats: null,
    coverage: "—",
    qty: "500 sqft",
    materialCost: "$25,000.00",
    laborCost: "$14,000.00",
    subtotal: "$39,000.00",
  },
  {
    id: "Wall-5 (Paint - Accent)",
    type: "Paint",
    name: "Asian Paints Apex Ultima — Deep Teal (Semi-Gloss)",
    imageUrl: null, // fallback
    areaSqft: 200,
    coats: 2,
    coverage: "350 sqft/gal",
    qty: "2 gal",
    materialCost: "$8,400.00",
    laborCost: "$5,600.00",
    subtotal: "$14,000.00",
  },
];

// Define your interfaces here...
interface Segment {
  short_title: string;
  title: string;
  seg_area_sqmt: number;
}
interface SegmentGroup {
  groupName: string;
  segments: Segment[];
}
interface MasterArrayItem {
  name: string;
  allSegments: SegmentGroup[];
}
interface JobData {
  projectName: string;
  date: string;
  address: string;
}

interface Props {
  imageUrl: string; // The URL for the main project image
  jobData: JobData;
  activeTab: string;
  selectedUnit: string;
  masterArray: MasterArrayItem[];
  convertArea: (area: number) => string;
}

// --- STYLES (UNCHANGED) ---
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  headerLogo: {
    width: 100,
    height: 40,
    objectFit: "contain",
  },
  headerTextContainer: {
    alignItems: "flex-end",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2a2a2a",
  },
  headerDate: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
  },
  mainImage: {
    width: "100%",
    height: 250,
    objectFit: "cover",
    marginBottom: 20,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    paddingBottom: 5,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
  },

  projectSummary:{
   display:"flex",
   justifyContent:"space-between",
   alignItems:"center",
  },


  infoBlock: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eeeeee",
  },
  infoBlocks:{
  
  },

  infoTitle:{
    fontSize: 11,
    color: "#555",
    fontWeight:"600",
  },
  infoText: {
    marginBottom: 8,
    fontSize: 11,
    color: "#555",
  },
  materialBlock: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eeeeee",
  },
  materialSwatch: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  materialTextContainer: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  materialDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  materialDetailText: {
    fontSize: 10,
    color: "#555",
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#ffffff",
  },
  tableRowAlt: {
    backgroundColor: "#f7f7f7",
  },
  tableColHeader: {
    width: "25%",
    padding: 8,
    backgroundColor: "#e8e8e8",
    fontWeight: "bold",
    fontSize: 10,
    color: "#333",
  },
  tableCol: {
    width: "25%",
    padding: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#e0e0e0",
    fontWeight: "bold",
    fontSize: 12,
    color: "#333",
  },

  infoBlockss: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eeeeee",
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12, // Added more space between rows
  },
  summaryItem: {
    width: '48%', // Each item takes almost half the space
  },
  summaryLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#333',
    marginBottom: 3, // Space between label and value
  },
  summaryValue: {
    fontSize: 10,
    color: '#666',
  },
});

export const MeasurementReportPDF: React.FC<Props> = ({
  imageUrl,
  jobData,
  activeTab,
  selectedUnit,
  masterArray,
  convertArea,
}) => {
  const activeTabData = masterArray.find((item) => item.name === activeTab);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.headerLogo} src={logoUrl} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>DZINLY DESIGN REPORT</Text>
            <Text style={styles.headerDate}>{jobData.date}</Text>
          </View>
        </View>

        {/* Hero Image */}
        <Image
          style={styles.mainImage}
          src=
          
            "https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/styled_output_52f90df66fb8433e91a6c746f98c9d67_(1)_1755614109956_db4zhk.png"
          
        />

        {/* Project Summary */}
        <Text style={styles.sectionTitle}>Project Summary</Text>
     <View style={styles.infoBlockss}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Project:</Text>
              <Text style={styles.summaryValue}>{jobData.projectName}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Client:</Text>
              <Text style={styles.summaryValue}>Nisha</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Address:</Text>
              <Text style={styles.summaryValue}>{jobData.address}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Prepared Date:</Text>
              <Text style={styles.summaryValue}>{jobData.date}</Text>
            </View>
          </View>
        </View>

        {/* Materials Summary (top-level) */}
        <Text style={styles.sectionTitle}>Material Summary</Text>
        {materialData.map((material, index) => (
          <View key={index} style={styles.materialBlock}>
            <Image
              style={styles.materialSwatch}
              src={material.imageUrl || fallbackMaterialImageUrl}
            />
            <View style={styles.materialTextContainer}>
              <Text style={styles.materialTitle}>{material.name}</Text>
              <View style={styles.materialDetailRow}>
                <Text style={styles.materialDetailText}>
                  Price: {material.price}
                </Text>
                <Text style={styles.materialDetailText}>
                  Coverage: {material.coverage}
                </Text>
                <Text style={styles.materialDetailText}>
                  Labor Cost: {material.labor}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* WALL SUB-SEGMENTS & MATERIALS (5) */}
        <Text style={styles.sectionTitle}>
          Wall — Sub-Segments &amp; Materials (5)
        </Text>
        {wallSegmentMaterials.map((m, i) => (
          <View key={`wall-sub-${i}`} style={styles.materialBlock}>
            <Image
              style={styles.materialSwatch}
              src={m.imageUrl || fallbackMaterialImageUrl}
            />
            <View style={styles.materialTextContainer}>
              <Text style={styles.materialTitle}>
                {m.id}: {m.name}
              </Text>

              {/* Row 1 */}
              <View style={styles.materialDetailRow}>
                <Text style={styles.materialDetailText}>Type: {m.type}</Text>
                <Text style={styles.materialDetailText}>
                  Coverage: {m.coverage}
                </Text>
                <Text style={styles.materialDetailText}>
                  Coats: {m.coats ?? "—"}
                </Text>
              </View>

              {/* Row 2 */}
              <View style={styles.materialDetailRow}>
                <Text style={styles.materialDetailText}>
                  Area: {m.areaSqft} sqft
                </Text>
                <Text style={styles.materialDetailText}>Qty: {m.qty}</Text>
                <Text style={styles.materialDetailText}>
                  Material: {m.materialCost} | Labor: {m.laborCost}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* --- CHANGE: WRAPPED THIS SECTION IN A VIEW WITH A 'break' PROP (kept as in your code) --- */}
        <View break>
          <Text style={styles.sectionTitle}>Project Cost Summary</Text>
          <View style={styles.table}>
            <View style={styles.tableRow} wrap={false}>
              <Text style={styles.tableColHeader}>Group</Text>
              <Text style={styles.tableColHeader}>Segment ID</Text>
              <Text style={styles.tableColHeader}>Title</Text>
              <Text style={styles.tableColHeader}>
                Area ({selectedUnit})
              </Text>
            </View>
            {activeTabData?.allSegments.map((group) =>
              group.segments.map((segment, idx) => (
                <View
                  key={idx}
                  style={
                    idx % 2 !== 0
                      ? [styles.tableRow, styles.tableRowAlt]
                      : styles.tableRow
                  }
                  wrap={false}
                >
                  <Text style={styles.tableCol}>{group.groupName}</Text>
                  <Text style={styles.tableCol}>{segment.short_title}</Text>
                  <Text style={styles.tableCol}>
                    {segment.title || "Untitled"}
                  </Text>
                  <Text style={styles.tableCol}>
                    {convertArea(segment.seg_area_sqmt || 0)}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* MINI TABLE: WALL SUB-SEGMENTS BREAKDOWN */}
          <Text style={styles.sectionTitle}>Wall Sub-Segments Breakdown</Text>
          <View style={styles.table}>
            <View style={styles.tableRow} wrap={false}>
              <Text style={styles.tableColHeader}>Sub-Segment</Text>
              <Text style={styles.tableColHeader}>Specs</Text>
              <Text style={styles.tableColHeader}>Qty &amp; Costs</Text>
              <Text style={styles.tableColHeader}>Subtotal</Text>
            </View>

            {wallSegmentMaterials.map((m, i) => (
              <View
                key={`wall-row-${i}`}
                style={
                  i % 2 !== 0
                    ? [styles.tableRow, styles.tableRowAlt]
                    : styles.tableRow
                }
                wrap={false}
              >
                <Text style={styles.tableCol}>{m.id}</Text>
                <Text style={styles.tableCol}>
                  {m.type} {m.coats ? `• ${m.coats} coats` : ""}{"\n"}
                  Area: {m.areaSqft} sqft{"\n"}
                  Coverage: {m.coverage}
                </Text>
                <Text style={styles.tableCol}>
                  Qty: {m.qty}{"\n"}
                  Material: {m.materialCost}{"\n"}
                  Labor: {m.laborCost}
                </Text>
                <Text style={styles.tableCol}>{m.subtotal}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer Summary */}
        <View style={styles.footer}>
          <Text>Total Cost: $134,369.33</Text>
          <Text>Increase Home Value: $111,903</Text>
        </View>
      </Page>
    </Document>
  );
};

/* -------------------------------------------------------------------------- */
/*                         QUICK SAMPLE USAGE (OPTIONAL)                      */
/*  Wrap in your app to preview. Remove if you only need the component above. */
/* -------------------------------------------------------------------------- */

export const SampleMeasurementReportPDF: React.FC = () => {
  const jobData: JobData = {
    projectName: "Lodha Greenwood Elevation Refresh",
    date: "2025-08-25",
    address: "C-142, Sector 31, Gurugram, Haryana 122003",
  };

  const masterArray: MasterArrayItem[] = [
    {
      name: "Walls",
      allSegments: [
        {
          groupName: "Front Elevation",
          segments: [
            { short_title: "W-1", title: "Left Bay", seg_area_sqmt: 18.5 },
            { short_title: "W-2", title: "Center Field", seg_area_sqmt: 26.9 },
          ],
        },
        {
          groupName: "Right Elevation",
          segments: [
            { short_title: "W-3", title: "Right Field", seg_area_sqmt: 22.1 },
          ],
        },
        {
          groupName: "Rear Elevation",
          segments: [
            { short_title: "W-4", title: "Patio Wall", seg_area_sqmt: 15.8 },
            { short_title: "W-5", title: "Garden Wall", seg_area_sqmt: 12.2 },
          ],
        },
      ],
    },
  ];

  const convertArea = (sqmt: number) => {
    const sqft = sqmt * 10.7639;
    return `${sqft.toFixed(1)} sqft`;
  };

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <MeasurementReportPDF
        imageUrl="https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/styled_output_52f90df66fb8433e91a6c746f98c9d67_(1)_1755614109956_db4zhk.png"
        jobData={jobData}
        activeTab="Walls"
        selectedUnit="sqft"
        masterArray={masterArray}
        convertArea={convertArea}
      />
    </PDFViewer>
  );
};
