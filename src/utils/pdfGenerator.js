import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (candidateName) => {
  try {
    const previewElement = document.getElementById("preview");
    
    if (!previewElement) {
      throw new Error("Preview element not found");
    }

    // Wait a bit to ensure the DOM is fully rendered
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Configure html2canvas options for better quality
    const canvas = await html2canvas(previewElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: previewElement.scrollWidth,
      windowHeight: previewElement.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const imgWidth = pdfWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Calculate how many pages we need
    const pageHeight = pdfHeight - margin * 2;
    const totalPages = Math.ceil(imgHeight / pageHeight);

    // Add image to PDF, splitting across pages if needed
    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      const yPosition = margin - (i * pageHeight);
      pdf.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight);
    }

    // Save PDF
    const fileName = candidateName
      ? `${candidateName.replace(/\s+/g, "_")}_Feedback.pdf`
      : "Candidate_Feedback.pdf";
    
    pdf.save(fileName);
    
    return { success: true };
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
