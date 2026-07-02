/**
 * Main Application - Browser Entry Point
 * Cryptography Analysis Parser
 */

class App {
  constructor() {
    this.currentInput = '';
    this.currentData = {};
    this.settings = this.loadSettings();
    this.init();
  }

  init() {
    this.setupEventListeners();
    UIComponents.initTabs();
    UIComponents.initResultTabs();
    console.log('🚀 Cryptography Analysis Parser Initialized');
  }

  setupEventListeners() {
    // Analyzer Tab
    document.getElementById('autoDetect')?.addEventListener('click', () => this.handleAutoDetect());
    document.getElementById('inputString')?.addEventListener('input', (e) => {
      this.currentInput = e.target.value;
    });

    // Decoder Tab
    document.getElementById('autoDetectEncoding')?.addEventListener('click', () => this.handleEncodingDetection());
    document.getElementById('decodeBtn')?.addEventListener('click', () => this.handleDecode());
    document.getElementById('copyDecoded')?.addEventListener('click', () => this.copyToClipboard());

    // Batch Processing
    document.getElementById('startBatch')?.addEventListener('click', () => this.handleBatchProcessing());
    document.getElementById('batchFile')?.addEventListener('change', (e) => this.handleFileUpload(e));

    // Export Buttons
    document.getElementById('exportJSON')?.addEventListener('click', () => this.exportResult('json'));
    document.getElementById('exportPDF')?.addEventListener('click', () => this.exportResult('pdf'));
    document.getElementById('exportCSV')?.addEventListener('click', () => this.exportResult('csv'));
    document.getElementById('exportTXT')?.addEventListener('click', () => this.exportResult('txt'));

    // Settings
    document.getElementById('saveSettings')?.addEventListener('click', () => this.saveSettings());
    document.getElementById('clearCache')?.addEventListener('click', () => this.clearCache());
  }

  async handleAutoDetect() {
    const input = this.currentInput.trim();
    if (!input) {
      alert('Please enter a hash, address, or transaction ID');
      return;
    }

    // Sanitize input
    const sanitized = Sanitizer.sanitizeInput(input);

    // Check for malware
    const malwareAnalysis = MalwareDetector.analyze(sanitized);
    if (malwareAnalysis.shouldQuarantine && this.settings.quarantineSuspicious) {
      UIComponents.showWarning(
        'Security Alert',
        'Suspicious patterns detected in input',
        malwareAnalysis.threats.map(t => `${t.type}: ${t.description}`)
      );
      return;
    }

    // Parse input
    const hashResult = HashParser.parse(sanitized);
    const addressResult = AddressParser.parse(sanitized);
    const txResult = TxParser.parse(sanitized);

    // Combine results
    const detection = this.combineDetections(hashResult, addressResult, txResult);
    this.currentData.detection = detection;

    // If address detected, fetch blockchain data
    if (addressResult.count > 0) {
      await this.fetchAddressData(sanitized, addressResult.primary.chain);
    }

    // Display results
    this.displayDetectionResults(detection);
    UIComponents.showResults();
  }

  combineDetections(hash, address, tx) {
    const allDetections = [
      ...hash.detections,
      ...address.detections,
      ...tx.detections
    ];

    return {
      input: hash.input,
      totalDetections: allDetections.length,
      detections: allDetections,
      primary: allDetections.length > 0 ? allDetections[0] : null,
      timestamp: new Date().toISOString()
    };
  }

  async fetchAddressData(address, chain) {
    let adapter;
    if (chain === 'BTC') adapter = new BitcoinAdapter();
    else if (chain === 'BCH') adapter = new BitcoinCashAdapter();
    else if (chain === 'BSV') adapter = new BitcoinSVAdapter();

    if (adapter) {
      try {
        const data = await adapter.getAddress(address);
        this.currentData.addressData = data;
        this.displayAddressAnalysis(data);
      } catch (err) {
        console.error('Blockchain fetch error:', err);
      }
    }
  }

  displayDetectionResults(detection) {
    let html = '<pre class="code-block">';
    html += `\n🔍 Detection Results\n`;
    html += `${'='.repeat(50)}\n\n`;
    html += `Input: ${Sanitizer.escapeHTML(detection.input)}\n`;
    html += `Total Matches: ${detection.totalDetections}\n\n`;

    if (detection.primary) {
      html += `📌 PRIMARY MATCH\n`;
      html += `${'─'.repeat(50)}\n`;
      html += `Type: ${detection.primary.type || detection.primary.detected}\n`;
      html += `Chain: ${detection.primary.chain || 'N/A'}\n`;
      html += `Format: ${detection.primary.format || 'N/A'}\n`;
      html += `Confidence: ${Math.round((detection.primary.confidence || 0.9) * 100)}%\n\n`;
    }

    if (detection.detections.length > 1) {
      html += `📋 ALL MATCHES\n`;
      html += `${'─'.repeat(50)}\n`;
      detection.detections.forEach((det, i) => {
        html += `${i + 1}. ${det.type || det.detected || 'Unknown'}\n`;
        html += `   Chain: ${det.chain || 'N/A'}\n`;
        html += `   Confidence: ${Math.round((det.confidence || 0.8) * 100)}%\n\n`;
      });
    }

    html += `</pre>`;
    UIComponents.displayResult('detectionResult', html);
  }

  displayAddressAnalysis(data) {
    let html = '<pre class="code-block">';
    html += `\n💰 Address Analysis\n`;
    html += `${'='.repeat(50)}\n\n`;
    html += `Chain: ${data.chain}\n`;
    html += `Address: ${Sanitizer.escapeHTML(data.address)}\n`;
    html += `Balance: ${Helpers.formatNumber(data.balance || 0)} satoshis\n`;
    html += `  = ${Helpers.satoshisToBTC(data.balance || 0)} BTC\n\n`;
    html += `Transaction Count: ${data.txCount || 0}\n`;
    html += `Last Seen: ${data.lastSeen || 'Unknown'}\n`;
    html += `Source: ${data.source || 'Multiple'}\n`;
    html += `</pre>`;
    
    // Risk analysis
    const riskAnalysis = RiskAnalyzer.analyze(data);
    this.currentData.riskAnalysis = riskAnalysis;
    
    this.displayRiskAnalysis(riskAnalysis);
    
    // Visualizations
    const treeViz = Visualizer.createAddressTree(data);
    document.getElementById('visualization').innerHTML = `<pre>${Sanitizer.escapeHTML(treeViz)}</pre>`;
    
    UIComponents.displayResult('addressAnalysis', html);
  }

  displayRiskAnalysis(riskAnalysis) {
    let html = '<pre class="code-block">';
    html += `\n🎯 Risk Assessment\n`;
    html += `${'='.repeat(50)}\n\n`;
    html += `Overall Score: ${riskAnalysis.score}% (${RiskAnalyzer._generateSummary(riskAnalysis.risks)})\n\n`;

    if (riskAnalysis.risks.length > 0) {
      html += `Detected Risks:\n`;
      riskAnalysis.risks.forEach((risk, i) => {
        html += `${i + 1}. ${risk.type}\n`;
        html += `   Severity: ${risk.severity.toUpperCase()}\n`;
        html += `   ${risk.description}\n\n`;
      });
    } else {
      html += `✅ No significant risk factors detected\n`;
    }

    html += `</pre>`;
    UIComponents.displayResult('riskAnalysis', html);
  }

  async handleEncodingDetection() {
    const input = document.getElementById('decodeInput').value.trim();
    if (!input) {
      alert('Please enter encoded data');
      return;
    }

    const detection = EncodingDetector.detect(input);
    const optionsHtml = detection.detections.map((det, i) => `
      <div class="option">
        <strong>${det.encoding}</strong> - ${Math.round(det.confidence * 100)}% confidence
        <p>${det.notes}</p>
        <button onclick="app.attemptDecode('${det.encoding}')">Try This</button>
      </div>
    `).join('');

    document.getElementById('encodingOptions').innerHTML = optionsHtml;
    document.getElementById('detectionOptions').style.display = 'block';
  }

  handleDecode() {
    const input = document.getElementById('decodeInput').value.trim();
    const cipher = document.getElementById('cipherSelect').value;
    const key = document.getElementById('decodeKey').value;

    if (!input || !cipher) {
      alert('Please select both input and cipher');
      return;
    }

    const result = CryptoCodec.decode(input, cipher, key);
    this.displayDecodeResult(result);
  }

  displayDecodeResult(result) {
    let html = '<pre class="code-block">';
    if (result.success) {
      html += `✅ Decoding Successful\n`;
      html += `Cipher: ${result.cipher}\n`;
      html += `Result:\n${Sanitizer.escapeHTML(String(result.result))}\n`;
    } else {
      html += `❌ Decoding Failed\n`;
      html += `Error: ${result.error}\n`;
    }
    html += `</pre>`;

    document.getElementById('decodedContent').innerHTML = html;
    document.getElementById('decodeResult').style.display = 'block';
  }

  copyToClipboard() {
    const content = document.getElementById('decodedContent').textContent;
    navigator.clipboard.writeText(content).then(() => {
      alert('Copied to clipboard!');
    });
  }

  async handleBatchProcessing() {
    const input = document.getElementById('batchInput').value;
    const lines = input.split('\n').filter(l => l.trim());

    if (lines.length === 0) {
      alert('Please enter addresses/hashes (one per line)');
      return;
    }

    document.getElementById('batchProgress').style.display = 'block';
    const results = [];

    for (let i = 0; i < lines.length; i++) {
      const item = lines[i].trim();
      const detection = HashParser.parse(item);
      results.push({ item, detection });
      UIComponents.updateProgress(i + 1, lines.length);
      await Helpers.sleep(100); // Rate limiting
    }

    this.displayBatchResults(results);
  }

  displayBatchResults(results) {
    let html = '<table border="1" cellpadding="5">';
    html += '<tr><th>Input</th><th>Type</th><th>Confidence</th></tr>';

    results.forEach(r => {
      const det = r.detection.primary;
      html += `<tr>`;
      html += `<td>${Sanitizer.escapeHTML(r.item)}</td>`;
      html += `<td>${det ? det.type || det.detected : 'Unknown'}</td>`;
      html += `<td>${det ? Math.round((det.confidence || 0.8) * 100) : 0}%</td>`;
      html += `</tr>`;
    });
    html += '</table>';

    document.getElementById('batchResultsList').innerHTML = html;
    document.getElementById('batchResults').style.display = 'block';
    this.currentData.batchResults = results;
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('batchInput').value = e.target.result;
      };
      reader.readAsText(file);
    }
  }

  exportResult(format) {
    if (Object.keys(this.currentData).length === 0) {
      alert('No data to export. Run an analysis first.');
      return;
    }

    const data = Sanitizer.stripSensitiveData(this.currentData, this.settings.showRiskOnly);

    switch (format) {
      case 'json':
        JSONExporter.download(data, `analysis-${Date.now()}.json`);
        break;
      case 'csv':
        CSVExporter.download(data, `analysis-${Date.now()}.csv`);
        break;
      case 'txt':
        TXTExporter.download(data, `analysis-${Date.now()}.txt`);
        break;
      case 'pdf':
        PDFExporter.download(data, `analysis-${Date.now()}.pdf`, this.settings.includePDFCharts);
        break;
    }
  }

  loadSettings() {
    const saved = localStorage.getItem('capSettings');
    return saved ? JSON.parse(saved) : this.getDefaultSettings();
  }

  getDefaultSettings() {
    return {
      showRiskOnly: true,
      enableMalwareCheck: true,
      quarantineSuspicious: true,
      includeRawAPI: false,
      includePDFCharts: true,
      useBlockchain: true,
      useBlockCypher: true,
      rateLimit: 2,
      enableCache: true
    };
  }

  saveSettings() {
    const settings = {
      showRiskOnly: document.getElementById('showRiskOnly').checked,
      enableMalwareCheck: document.getElementById('enableMalwareCheck').checked,
      quarantineSuspicious: document.getElementById('quarantineSuspicious').checked,
      includeRawAPI: document.getElementById('includeRawAPI').checked,
      includePDFCharts: document.getElementById('includePDFCharts').checked,
      useBlockchain: document.getElementById('useBlockchain').checked,
      useBlockCypher: document.getElementById('useBlockCypher').checked,
      rateLimit: parseFloat(document.getElementById('rateLimit').value),
      enableCache: document.getElementById('enableCache').checked
    };

    localStorage.setItem('capSettings', JSON.stringify(settings));
    this.settings = settings;
    alert('✅ Settings saved!');
  }

  clearCache() {
    localStorage.clear();
    alert('✅ Cache cleared!');
  }
}

// Initialize app when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
  });
}
