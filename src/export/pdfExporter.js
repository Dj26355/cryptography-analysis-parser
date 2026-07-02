/**
 * PDF Exporter (simplified - uses jsPDF if available)
 */

class PDFExporter {
  static async export(data, includeCharts = true) {
    // Check if jsPDF is available
    if (typeof jsPDF === 'undefined') {
      return this._fallbackPDF(data);
    }

    const pdf = new jsPDF();
    let yPosition = 10;
    const pageHeight = pdf.internal.pageSize.height;

    // Title
    pdf.setFontSize(16);
    pdf.text('Cryptography Analysis Report', 10, yPosition);
    yPosition += 15;

    // Metadata
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 10, yPosition);
    yPosition += 10;

    // Detection Results
    if (data.detection) {
      pdf.setFontSize(12);
      pdf.text('Detection Results', 10, yPosition);
      yPosition += 7;
      
      pdf.setFontSize(10);
      pdf.text(`Type: ${data.detection.type || 'Unknown'}`, 15, yPosition);
      yPosition += 5;
      pdf.text(`Chain: ${data.detection.chain || 'N/A'}`, 15, yPosition);
      yPosition += 10;
    }

    // Risk Analysis
    if (data.riskAnalysis && data.riskAnalysis.risks) {
      pdf.setFontSize(12);
      pdf.text('Risk Factors', 10, yPosition);
      yPosition += 7;
      
      pdf.setFontSize(9);
      data.riskAnalysis.risks.slice(0, 5).forEach(risk => {
        if (yPosition > pageHeight - 10) {
          pdf.addPage();
          yPosition = 10;
        }
        pdf.text(`• ${risk.type}: ${risk.severity}`, 15, yPosition);
        yPosition += 5;
      });
    }

    return pdf.output('datauristring');
  }

  static async download(data, filename = 'analysis.pdf', includeCharts = true) {
    const pdfData = await this.export(data, includeCharts);
    
    if (pdfData.startsWith('data:application/pdf')) {
      const link = document.createElement('a');
      link.href = pdfData;
      link.download = Sanitizer.sanitizeFilename(filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('PDF generation failed');
    }
  }

  static _fallbackPDF(data) {
    // Fallback to TXT if jsPDF not available
    return 'PDF library not available. Use TXT export instead.';
  }
}
