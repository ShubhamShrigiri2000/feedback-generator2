import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (candidateName) => {
  let tempContainer = null;
  
  try {
    let previewElement = document.getElementById("preview");
    
    if (!previewElement) {
      throw new Error("Preview element not found. Please preview first or ensure the form is properly filled.");
    }

    // Check if element has content
    if (!previewElement.innerHTML || previewElement.innerHTML.trim() === '') {
      throw new Error("Preview element is empty. Please ensure all form fields are filled.");
    }

    // If element is off-screen (positioned at -9999px), clone it and render temporarily
    const parentElement = previewElement.parentElement;
    const isOffScreen = parentElement && (
      parentElement.style.left === '-9999px' || 
      parentElement.style.left.includes('-9999') ||
      window.getComputedStyle(parentElement).left.includes('-9999')
    );

    if (isOffScreen) {
      // Clone the element and render it temporarily
      const clone = previewElement.cloneNode(true);
      clone.id = 'preview-temp';
      clone.style.position = 'absolute';
      clone.style.left = '0';
      clone.style.top = '0';
      clone.style.visibility = 'visible';
      clone.style.display = 'block';
      clone.style.width = '800px';
      clone.style.zIndex = '-1';
      
      tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.appendChild(clone);
      document.body.appendChild(tempContainer);
      
      previewElement = clone;
      
      // Wait for clone to render
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      // Wait a bit to ensure the DOM is fully rendered
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

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
    
    // Clean up temporary container if created
    if (tempContainer && tempContainer.parentNode) {
      tempContainer.parentNode.removeChild(tempContainer);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
