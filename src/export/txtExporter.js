/**
 * Text Exporter
 */

class TXTExporter {
  static export(data) {
    let output = '';
    
    output += '╔════════════════════════════════════════════════════════════╗\n';
    output += '║  CRYPTOGRAPHY ANALYSIS PARSER - DETAILED REPORT           ║\n';
    output += '╚════════════════════════════════════════════════════════════╝\n\n';
    
    output += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    // Detection results
    if (data.detection) {
      output += '═══ DETECTION RESULTS ═══\n';
      output += `Type: ${data.detection.type || 'Unknown'}\n`;
      output += `Chain: ${data.detection.chain || 'N/A'}\n`;
      output += `Format: ${data.detection.format || 'N/A'}\n\n`;
    }
    
    // Address Analysis
    if (data.addressAnalysis) {
      output += '═══ ADDRESS ANALYSIS ═══\n';
      output += `Balance: ${Helpers.formatNumber(data.addressAnalysis.balance || 0)} satoshis\n`;
      output += `Transaction Count: ${data.addressAnalysis.txCount || 0}\n`;
      output += `Last Activity: ${data.addressAnalysis.lastSeen || 'N/A'}\n\n`;
    }
    
    // Risk Analysis
    if (data.riskAnalysis && data.riskAnalysis.risks) {
      output += '═══ RISK FACTORS ═══\n';
      data.riskAnalysis.risks.forEach(risk => {
        output += `\n• ${risk.type}\n`;
        output += `  Severity: ${risk.severity.toUpperCase()}\n`;
        output += `  ${risk.description}\n`;
      });
      output += '\n';
    }
    
    // Warnings
    if (data.warnings && data.warnings.length > 0) {
      output += '═══ SECURITY WARNINGS ═══\n';
      data.warnings.forEach(warning => {
        output += `⚠️  ${warning}\n`;
      });
      output += '\n';
    }
    
    output += '\n═══ END OF REPORT ═══\n';
    output += 'All processing was performed locally. No data was transmitted.\n';
    
    return output;
  }

  static download(data, filename = 'analysis.txt') {
    const txt = this.export(data);
    const blob = new Blob([txt], { type: 'text/plain' });
    JSONExporter._triggerDownload(blob, Sanitizer.sanitizeFilename(filename));
  }
}
