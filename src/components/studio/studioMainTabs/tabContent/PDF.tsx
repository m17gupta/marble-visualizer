// // components/pdf/MeasurementReportPDF.tsx
// import React from "react";
// import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// interface Segment {
//   short_title: string;
//   title: string;
//   seg_area_sqmt: number;
// }

// interface SegmentGroup {
//   groupName: string;
//   segments: Segment[];
// }

// interface MasterArrayItem {
//   name: string;
//   allSegments: SegmentGroup[];
// }

// interface JobData {
//   projectName: string;
//   date: string;
//   address: string;
// }

// interface Props {
//   jobData: JobData;
//   activeTab: string;
//   selectedUnit: string;
//   masterArray: MasterArrayItem[];
//   convertArea: (area: number) => string;
// }

// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 10,
//     fontFamily: "Helvetica",
//   },
//   header: {
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   sectionTitle: {
//     fontSize: 14,
//     marginVertical: 10,
//     fontWeight: "bold",
//   },
//   infoBlock: {
//     marginBottom: 15,
//     padding: 10,
//     backgroundColor: "#f0f0f0",
//   },
//   table: {
//     display: "table",
//     width: "auto",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderRightWidth: 0,
//     borderBottomWidth: 0,
//   },
//   tableRow: {
//     flexDirection: "row",
//   },
//   tableColHeader: {
//     width: "25%",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//     backgroundColor: "#f0f0f0",
//     padding: 5,
//     fontWeight: "bold",
//   },
//   tableCol: {
//     width: "25%",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//     padding: 5,
//   },
// });

// export const MeasurementReportPDF: React.FC<Props> = ({
//   jobData,
//   activeTab,
//   selectedUnit,
//   masterArray,
//   convertArea,
// }) => {
//   const activeTabData = masterArray.find((item) => item.name === activeTab);

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={{ fontSize: 18, fontWeight: "bold" }}>
//             🏢 DZINLY DESIGN REPORT
//           </Text>
//           <Text>{jobData.date}</Text>
//         </View>

//         {/* Project Info */}
//         <Text style={styles.sectionTitle}>Project Summary</Text>
//         <View style={styles.infoBlock}>
//           <Text>Project: {jobData.projectName}</Text>
//           <Text>Address: {jobData.address}</Text>
//           <Text>Active Section: {activeTab}</Text>
//           <Text>
//             Total Area:{" "}
//             {convertArea(
//               activeTabData?.allSegments.reduce(
//                 (total, g) =>
//                   total +
//                   g.segments.reduce(
//                     (sum, s) => sum + (s.seg_area_sqmt || 0),
//                     0
//                   ),
//                 0
//               ) || 0
//             )}{" "}
//             {selectedUnit}
//           </Text>
//         </View>

//         {/* Table */}
//         <Text style={styles.sectionTitle}>{activeTab} Segments</Text>
//         <View style={styles.table}>
//           {/* Table Header */}
//           <View style={styles.tableRow}>
//             <Text style={styles.tableColHeader}>Group</Text>
//             <Text style={styles.tableColHeader}>Segment ID</Text>
//             <Text style={styles.tableColHeader}>Title</Text>
//             <Text style={styles.tableColHeader}>Area ({selectedUnit})</Text>
//           </View>
//           {/* Table Rows */}
//           {activeTabData?.allSegments.map((group) =>
//             group.segments.map((segment, idx) => (
//               <View key={idx} style={styles.tableRow}>
//                 <Text style={styles.tableCol}>{group.groupName}</Text>
//                 <Text style={styles.tableCol}>{segment.short_title}</Text>
//                 <Text style={styles.tableCol}>
//                   {segment.title || "Untitled"}
//                 </Text>
//                 <Text style={styles.tableCol}>
//                   {convertArea(segment.seg_area_sqmt || 0)}
//                 </Text>
//               </View>
//             ))
//           )}
//         </View>
//       </Page>
//     </Document>
//   );
// };

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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
  jobData: JobData;
  activeTab: string;
  selectedUnit: string;
  masterArray: MasterArrayItem[];
  convertArea: (area: number) => string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#f9f9f9", // Light gray background for modern feel
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottom: "2px solid #ddd", // Adding a border below the header
    paddingBottom: 10,
  },
  headerImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#cccccc", // Placeholder color for the image
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginVertical: 15,
    fontWeight: "bold",
    color: "#333",
  },
  infoBlock: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#fff", // White background for readability
    borderRadius: 8,
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", // Shadow for depth
  },
  infoText: {
    marginBottom: 8,
    fontSize: 12,
    color: "#555",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    borderTopWidth: 0,
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
  },
  tableColHeader: {
    width: "25%",
    padding: 8,
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    color: "#333",
  },
  tableCol: {
    width: "25%",
    padding: 8,
    color: "#555",
    borderRight: "1px solid #ddd",
  },
  tableFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
    fontWeight: "bold",
  },
});

export const MeasurementReportPDF: React.FC<Props> = ({
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
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#2a2a2a" }}>
            🏢 DZINLY DESIGN REPORT
          </Text>
          <Text>{jobData.date}</Text>
        </View>
        {/* Placeholder for Image */}
        <View style={styles.headerImage}></View> {/* Placeholder block */}
        {/* You can replace this with an <Image> tag when the image URL is available */}
        {/* Project Summary Section */}
        <Text style={styles.sectionTitle}>Project Summary</Text>
        <View style={styles.infoBlock}>
          <Text style={styles.infoText}>Project: {jobData.projectName}</Text>
          <Text style={styles.infoText}>Address: {jobData.address}</Text>
          <Text style={styles.infoText}>Active Section: {activeTab}</Text>
          <Text style={styles.infoText}>
            Total Area:{" "}
            {convertArea(
              activeTabData?.allSegments.reduce(
                (total, g) =>
                  total +
                  g.segments.reduce(
                    (sum, s) => sum + (s.seg_area_sqmt || 0),
                    0
                  ),
                0
              ) || 0
            )}{" "}
            {selectedUnit}
          </Text>
        </View>
        {/* Material Summary Section */}
        <Text style={styles.sectionTitle}>Material Summary</Text>
        <View style={styles.infoBlock}>
          <Text style={styles.infoText}>
            1. **Vintagebrick Alexandria Buff**
          </Text>
          <Text style={styles.infoText}>Price: $1500 / box</Text>
          <Text style={styles.infoText}>Coverage: 10 sq.m / box</Text>
          <Text style={styles.infoText}>Labor Cost: $100 sq.m</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoText}>2. **Canyonbrick Shale Brown**</Text>
          <Text style={styles.infoText}>Price: $1500 / box</Text>
          <Text style={styles.infoText}>Coverage: 10 sq.m / box</Text>
          <Text style={styles.infoText}>Labor Cost: $100 sq.m</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoText}>3. **Tuffblack Bamboo**</Text>
          <Text style={styles.infoText}>Price: $1500 / box</Text>
          <Text style={styles.infoText}>Coverage: 10 sq.m / box</Text>
          <Text style={styles.infoText}>Labor Cost: $100 sq.m</Text>
        </View>
        {/* Cost Summary Section */}
        <Text style={styles.sectionTitle}>Project Cost Summary</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Group</Text>
            <Text style={styles.tableColHeader}>Segment ID</Text>
            <Text style={styles.tableColHeader}>Title</Text>
            <Text style={styles.tableColHeader}>Area ({selectedUnit})</Text>
          </View>
          {/* Table Rows */}
          {activeTabData?.allSegments.map((group) =>
            group.segments.map((segment, idx) => (
              <View key={idx} style={styles.tableRow}>
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
        {/* Footer */}
        <View style={styles.tableFooter}>
          <Text>Total Cost: $134,369.33</Text>
          <Text>Increase Home Value: $111,903</Text>
        </View>
      </Page>
    </Document>
  );
};
