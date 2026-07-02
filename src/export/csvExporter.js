/**
 * CSV Exporter
 */

class CSVExporter {
  static export(data) {
    const rows = [];
    
    // Header
    rows.push(['Field', 'Value']);
    
    // Flatten data
    this._flattenObject(data, rows);
    
    return rows.map(row => this._escapeCSV(row)).join('\n');
  }

  static download(data, filename = 'analysis.csv') {
    const csv = this.export(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    JSONExporter._triggerDownload(blob, Sanitizer.sanitizeFilename(filename));
  }

  static _flattenObject(obj, rows, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        this._flattenObject(value, rows, fullKey);
      } else {
        rows.push([fullKey, String(value)]);
      }
    }
  }

  static _escapeCSV(row) {
    return row.map(cell => {
      const str = String(cell);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',');
  }
}
