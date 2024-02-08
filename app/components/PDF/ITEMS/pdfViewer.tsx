import { PDFViewer } from "@react-pdf/renderer";
import SpecDocument from "./ViewSpecs";

const PdfViewerComponent = () => {
  return (
    <div style={styles.pdfViewerContainer}>
      <PDFViewer style={styles.pdfViewer}>
        <SpecDocument />
      </PDFViewer>
    </div>
  );
};

// Styles
const styles = {
  pdfViewerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // This assumes you want the PDF viewer to be centered vertically in the viewport
    width: "100%", // This assumes you want the container to take the full width of the viewport
  },
  pdfViewer: {
    width: "60%", // Adjust the width as necessary
    height: "80vh", // Adjust the height as necessary
    border: "1px solid black", // Optional: adds a border around the PDF viewer
  },
};

export default PdfViewerComponent;
