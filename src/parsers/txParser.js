/**
 * Transaction Hash Parser
 */

class TxParser {
  static parse(input) {
    const cleaned = input.trim();
    const results = [];

    // Transaction hash (256-bit = 64 hex chars)
    if (/^[0-9a-fA-F]{64}$/.test(cleaned)) {
      results.push({
        type: 'Transaction Hash (TXID)',
        bitLength: 256,
        byteLength: 32,
        format: 'Hexadecimal',
        chains: ['BTC', 'BCH', 'BSV'],
        notes: 'Double SHA256 hash of transaction data'
      });
    }

    // Block hash (same format as tx hash)
    if (/^[0-9a-fA-F]{64}$/.test(cleaned)) {
      results.push({
        type: 'Block Hash',
        bitLength: 256,
        byteLength: 32,
        format: 'Hexadecimal',
        chains: ['BTC', 'BCH', 'BSV'],
        notes: 'Double SHA256 hash of block header'
      });
    }

    return {
      input: cleaned,
      detections: results,
      count: results.length
    };
  }
}
