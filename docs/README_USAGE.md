# Cryptography Analysis Parser - Documentation

## Overview

**Cryptography Analysis Parser** is a multi-chain blockchain intelligence suite with advanced cryptography analysis, encoding/decoding, and risk assessment capabilities.

## Features

### 🔍 Core Analysis
- **Auto-Detection**: Automatically identifies hash types (Hash160, SHA256, MD5, SHA512, BLAKE2, etc.)
- **Multi-Chain Support**: Bitcoin (BTC), Bitcoin Cash (BCH), Bitcoin SV (BSV)
- **Address Parsing**: P2PKH, P2SH, P2WPKH, Bech32, zpub, xpub, and more
- **Format Recognition**: Base58, Base32, Bech32, WIF, hex encoding

### 🔐 Cryptography Toolkit
- **50+ Algorithms**:
  - Encoding: Base64, Base58, Base32, Hex, UTF-8, Bech32, URL
  - Classical: Caesar, ROT13, Vigenère, Playfair, Atbash
  - Block Ciphers: AES, DES, 3DES, Blowfish, Twofish
  - Stream: RC4, Salsa20, ChaCha20
  - Hash: MD5, SHA-1, SHA-256, SHA-512, BLAKE2, Argon2

### 📊 Analysis & Risk Assessment
- **Address Clustering**: Detects related addresses in transactions
- **Metadata Extraction**: OP_RETURN data, embedded payloads
- **Risk Scoring**: Address reuse, large balances, suspicious patterns
- **Malware Detection**: Identifies code execution keywords, injections, obfuscation
- **Transaction Analysis**: Input/output tracking, fee analysis

### 📤 Export Formats
- **JSON**: Full structured data export
- **CSV**: Tabular format for spreadsheets
- **PDF**: Professional reports with optional charts
- **TXT**: Human-readable text reports

### ⚙️ Advanced Features
- **Batch Processing**: Process multiple addresses/hashes in one go
- **Auto-Run Toggle**: Automate analysis workflows
- **Encoding Detection**: Automatically detect and recommend decoders
- **Visual Layouts**: ASCII tree and flow diagrams
- **Malware Quarantine**: Blocks suspicious payloads with warnings
- **Zero Data Persistence**: All processing stays local

## Installation

### Browser
```bash
git clone https://github.com/Dj26355/cryptography-analysis-parser.git
cd cryptography-analysis-parser
# Open index.html in your browser
```

### Node.js / Termux
```bash
git clone https://github.com/Dj26355/cryptography-analysis-parser.git
cd cryptography-analysis-parser
npm install  # If package.json has dependencies
node cli.js --help
```

## Usage

### Browser Interface

1. **Analyzer Tab**: Paste hash/address, click "Auto-Detect & Analyze"
2. **Decoder Tab**: Paste encoded data, auto-detect encoding, select cipher
3. **Batch Tab**: Upload file or paste multiple items, toggle auto-run
4. **Settings Tab**: Configure analysis preferences and export options

### CLI Usage

```bash
# Analyze single input
node cli.js --input "1A1z7agoat2YMCj1K7c5gzYY2Pg4BXXJv" --format json

# Batch processing
node cli.js --batch addresses.txt --format csv --output results.csv

# Encoding detection
node cli.js --decode "aGVsbG8gd29ybGQ=" --recommend-cipher

# Export to file
node cli.js --input "abc123" --format json --output analysis.json
```

### Termux Mobile
```bash
pkg install nodejs
cd cryptography-analysis-parser
node cli.js --input "hash" --format text
```

## Supported Hash/Address Formats

### Bitcoin (BTC)
- **P2PKH**: `1...` (26-35 chars)
- **P2SH**: `3...` (26-35 chars)
- **Bech32**: `bc1...` (39-59 chars, lowercase)
- **Extended Keys**: `xpub`, `ypub`, `zpub` (111+ chars)

### Bitcoin Cash (BCH)
- **CashAddr**: `bitcoincash:...` or `q.../p...`
- **Legacy**: `1.../3...` (compatible with BTC)

### Bitcoin SV (BSV)
- **CashAddr**: `q.../p...`
- **Legacy**: `1.../3...`

### Hash Types
- **HASH160** (160-bit): 40 hex chars - RIPEMD160(SHA256(pubkey))
- **SHA256** (256-bit): 64 hex chars - Bitcoin tx/block hashes
- **MD5** (128-bit): 32 hex chars - Legacy hash (broken)
- **SHA-1** (160-bit): 40 hex chars - Deprecated
- **SHA-512** (512-bit): 128 hex chars
- **BLAKE2**: 64 or 128 hex chars
- **RIPEMD160** (160-bit): 40 hex chars - Bitcoin address hashing

## Encoding Types

| Type | Example | Notes |
|------|---------|-------|
| Base64 | `aGVs...` | Standard encoding |
| Base58 | `1A1z7...` | Bitcoin addresses |
| Base32 | `JBSWY...` | RFC 4648 encoding |
| Hex | `68656c6c...` | Hexadecimal |
| Bech32 | `bc1qw508d...` | SegWit addresses |
| URL | `hello%20world` | Percent encoding |
| UTF-8 | Plain text | Raw characters |

## Risk Analysis

The tool flags these risk factors:

### High Risk
- 🔴 Null byte injection
- 🔴 PE/ELF executable headers
- 🔴 Code execution keywords
- 🔴 SQL/script injection patterns

### Medium Risk
- 🟡 Multi-layer obfuscation
- 🟡 Large encoded payloads (>500KB)
- 🟡 Mixed encoding chains
- 🟡 Large address balances

### Low Risk
- 🟢 Address reuse
- 🟢 Simple cipher detection
- 🟢 Dust/spam outputs

## Settings

### Analysis Preferences
- **Show Risk Only**: Display only risky factors (hide clean data)
- **Enable Malware Check**: Scan for malicious patterns
- **Quarantine Suspicious**: Block risky encodings
- **Show Advanced Options**: Access expert features

### Export Preferences
- **Include Raw API**: Keep raw blockchain data in exports
- **Include PDF Charts**: Add visualizations to PDF reports
- **PDF Theme**: Light or dark mode

### API & Data
- **Blockchain.com API**: Enable/disable
- **BlockCypher API**: Enable/disable
- **API Rate Limit**: Requests per second (0.1 - 10)

## Security & Privacy

✅ **Zero Data Transmission**: All processing happens locally in your browser/device
✅ **No Server Backend**: Standalone application
✅ **Input Sanitization**: All inputs validated and escaped
✅ **Malware Detection**: Quarantine suspicious payloads
✅ **Memory Safety**: Clears session data on exit
✅ **No Cookies/Tracking**: Privacy-first design

## Malware Detection

The tool automatically detects and can quarantine:
- Code execution attempts (exec, eval, system, bash, powershell)
- Script injection (XSS, JavaScript events)
- SQL injection patterns
- Null byte attacks
- Embedded executables (PE, ELF headers)
- Multi-layer obfuscation chains
- Extremely large payloads (>100KB)

## Script Analysis

Breaks down Bitcoin scripts with plain-language explanations:
- OP code identification
- Pattern detection (P2PKH, P2SH, P2WPKH, Multisig, Taproot)
- OP_RETURN data extraction
- Risk flagging for complex scripts

## Blockchain Integration

### Supported Explorers
- **Bitcoin**: Blockchain.com, BlockCypher
- **Bitcoin Cash**: Blockdozer, BlockExplorer
- **Bitcoin SV**: WhatsOnChain, Blockscan

### Data Retrieved
- Address balance (confirmed + unconfirmed)
- Transaction history
- Input/output addresses
- Fees and confirmations
- Block height and timestamps

## Examples

### Example 1: Analyze Bitcoin Address
```
1. Paste: 1A1z7agoat2YMCj1K7c5gzYY2Pg4BXXJv
2. Click "Auto-Detect & Analyze"
3. View results:
   - Detected as: Bitcoin P2PKH Address
   - Balance: Fetches from blockchain
   - Transactions: Lists all historical activity
   - Risk: Flags address reuse patterns
4. Export: JSON, CSV, PDF, or TXT
```

### Example 2: Decode Base64
```
1. Go to "Decoder" tab
2. Paste: aGVsbG8gd29ybGQ=
3. Click "Detect Encoding"
4. Select "Base64" from suggestions
5. Click "Decode"
6. Result: hello world
```

### Example 3: Batch Analysis
```
1. Go to "Batch Processing" tab
2. Paste multiple addresses/hashes (one per line)
3. Enable "Auto-Run on Load"
4. Click "Start Batch Analysis"
5. Export results as CSV for spreadsheet analysis
```

## Troubleshooting

### "No data to export"
- Run an analysis first before exporting
- Use "Auto-Detect & Analyze" or "Decode" features

### "API Error"
- Check internet connection
- Verify blockchain explorer is online
- Wait a moment and retry (rate limiting)

### "Invalid address format"
- Ensure address is complete and not truncated
- Check you're using the correct blockchain (BTC vs BCH vs BSV)
- Try removing whitespace

### Encoding Not Detected
- Try manual selection from cipher list
- Check input format is pure (no mixed encodings)
- Use "Recommend Cipher" feature

## Performance Tips

1. **Batch Size**: Process max 100-200 items at once to avoid memory issues
2. **Rate Limiting**: Default 2 req/sec respects API limits
3. **Caching**: Enable session cache for repeated queries
4. **Browser**: Use modern browser (Chrome, Firefox, Safari) for best performance

## Development

Project structure:
```
src/
  ├── parsers/        # Hash/address detection
  ├── decoders/       # Encoding & cipher algorithms
  ├── blockchain/     # API adapters
  ├── analysis/       # Risk & cluster analysis
  ├── export/         # Export formatters
  ├── ui/            # Browser components
  └── utils/         # Sanitization, validation, helpers
```

## Contributing

To add support for new ciphers or blockchains:
1. Add decoder to `src/decoders/cryptoCodec.js`
2. Add adapter to `src/blockchain/` (e.g., `ltc.js` for Litecoin)
3. Register in respective factory classes
4. Add unit tests
5. Update documentation

## License

MIT - Open source and free to use

## Support

For issues or questions:
1. Check this documentation
2. Review examples
3. Open GitHub issue with details
4. Include input/output and steps to reproduce

---

**Made with ❤️ for blockchain analysis and cryptography enthusiasts**
