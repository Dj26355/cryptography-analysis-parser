/**
 * JSON Exporter
 */

class JSONExporter {
  static export(data, includeRawAPI = false) {
    const output = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      data: data
    };

    if (!includeRawAPI && data.apiResponses) {
      delete output.data.apiResponses;
    }

    return JSON.stringify(output, null, 2);
  }

  static download(data, filename = 'analysis.json') {
    const json = this.export(data);
    const blob = new Blob([json], { type: 'application/json' });
    this._triggerDownload(blob, Sanitizer.sanitizeFilename(filename));
  }

  static _triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
