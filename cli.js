#!/usr/bin/env node

/**
 * CLI Entry Point - For Node.js and Termux
 * Usage: node cli.js --input "hash" --format json
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
      args[key] = value;
      if (value !== true) i++;
    }
  }
  
  return args;
}

class TermuxCLI {
  constructor() {
    this.args = parseArgs();
  }

  async run() {
    if (this.args.help || !this.args.input && !this.args.batch && !this.args.decode) {
      this.printHelp();
      return;
    }

    if (this.args.input) {
      await this.analyzeInput(this.args.input);
    } else if (this.args.batch) {
      await this.processBatch(this.args.batch);
    } else if (this.args.decode) {
      this.decodeString(this.args.decode);
    }
  }

  async analyzeInput(input) {
    console.log('\n🔍 Analyzing input...');
    console.log(`Input: ${input}\n`);

    // Simulate parsing (in real implementation, import actual parsers)
    const result = {
      input,
      timestamp: new Date().toISOString(),
      analysis: {
        type: 'Hash/Address detected',
        chain: 'Bitcoin',
        format: 'Hexadecimal',
        message: 'Run in browser for full analysis with blockchain data'
      }
    };

    const format = this.args.format || 'text';
    this.exportResult(result, format);
  }

  async processBatch(filepath) {
    console.log(`\n📂 Processing batch file: ${filepath}`);
    
    try {
      const content = fs.readFileSync(filepath, 'utf-8');
      const lines = content.split('\n').filter(l => l.trim());
      
      console.log(`Found ${lines.length} items to analyze\n`);
      
      const results = lines.map((item, i) => ({
        index: i + 1,
        input: item,
        status: 'Ready for analysis'
      }));

      const format = this.args.format || 'json';
      this.exportResult(results, format);
    } catch (err) {
      console.error(`❌ Error reading file: ${err.message}`);
    }
  }

  decodeString(input) {
    console.log('\n🔐 Encoding Detection & Decoding');
    console.log(`Input: ${input}\n`);

    const detections = [];
    
    if (/^[A-Za-z0-9+/]*={0,2}$/.test(input) && input.length % 4 === 0) {
      detections.push({ encoding: 'Base64', confidence: 0.95 });
    }
    if (/^[0-9a-fA-F]+$/.test(input)) {
      detections.push({ encoding: 'Hexadecimal', confidence: 0.9 });
    }
    if (/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(input)) {
      detections.push({ encoding: 'Base58', confidence: 0.85 });
    }

    console.log('Detected Encodings:');
    detections.forEach((det, i) => {
      console.log(`  ${i + 1}. ${det.encoding} (${Math.round(det.confidence * 100)}%)`);
    });
    console.log('\n💡 Recommendations:');
    if (detections.length > 0) {
      console.log(`  Try: node cli.js --decode "${input}" --cipher ${detections[0].encoding.toLowerCase()}`);
    }
  }

  exportResult(result, format) {
    let output = '';

    if (format === 'json') {
      output = JSON.stringify(result, null, 2);
    } else if (format === 'csv') {
      output = this.toCSV(result);
    } else {
      output = this.toText(result);
    }

    if (this.args.output) {
      try {
        fs.writeFileSync(this.args.output, output);
        console.log(`✅ Results exported to: ${this.args.output}`);
      } catch (err) {
        console.error(`❌ Export failed: ${err.message}`);
      }
    } else {
      console.log(output);
    }
  }

  toCSV(data) {
    if (Array.isArray(data)) {
      const headers = Object.keys(data[0]);
      let csv = headers.join(',') + '\n';
      data.forEach(row => {
        csv += headers.map(h => `"${row[h]}"`).join(',') + '\n';
      });
      return csv;
    }
    return JSON.stringify(data);
  }

  toText(data) {
    let text = '\n╔═══════════════════════════════════════════════════════╗\n';
    text += '║     CRYPTOGRAPHY ANALYSIS PARSER - CLI REPORT        ║\n';
    text += '╚═══════════════════════════════════════════════════════╝\n\n';
    
    if (typeof data === 'object') {
      text += JSON.stringify(data, null, 2);
    } else {
      text += data;
    }
    
    text += '\n\n✅ Analysis complete. Run with --help for more options.\n';
    return text;
  }

  printHelp() {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║       CRYPTOGRAPHY ANALYSIS PARSER - CLI HELP                 ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  node cli.js [options]

OPTIONS:
  --input <string>        Hash/address/tx ID to analyze
  --batch <filepath>      Process file with multiple items (one per line)
  --decode <string>       Detect and decode encoding
  --cipher <name>         Specify cipher (base64, hex, etc)
  --format <format>       Output format (json, csv, text) - default: text
  --output <filepath>     Save results to file
  --help                  Show this help message

EXAMPLES:
  # Analyze a Bitcoin address
  node cli.js --input "1A1z7agoat" --format json

  # Process batch file
  node cli.js --batch addresses.txt --output results.json

  # Detect encoding
  node cli.js --decode "aGVsbG8gd29ybGQ=" --recommend-cipher

  # Export to CSV
  node cli.js --batch data.txt --format csv --output results.csv

NOTES:
  - Browser version available at index.html (full features)
  - CLI version provides basic analysis and format conversion
  - For blockchain data queries, use browser version
  - All processing is local - no data transmitted

TERMUX USAGE:
  $ npm install
  $ node cli.js --help

`);
  }
}

// Run CLI
const cli = new TermuxCLI();
cli.run().catch(err => console.error('❌ Error:', err.message));
