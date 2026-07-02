/**
 * Metadata Extractor - Pulls data from transactions and scripts
 */

class MetadataExtractor {
  static extract(txData) {
    const metadata = {};

    // Transaction metadata
    metadata.transaction = {
      hash: txData.txid,
      inputs: txData.inputs,
      outputs: txData.outputs,
      value: txData.value,
      fees: txData.fees,
      confirmations: txData.confirmations,
      timestamp: txData.timestamp
    };

    // Embedded data (OP_RETURN)
    metadata.embeddedData = this._extractEmbeddedData(txData);

    // Payment details
    metadata.payments = this._extractPayments(txData);

    // Temporal analysis
    metadata.temporal = this._analyzeTimestamps(txData);

    return metadata;
  }

  static _extractEmbeddedData(txData) {
    if (!txData.script || !txData.script.includes('OP_RETURN')) return null;

    return {
      type: 'OP_RETURN',
      detected: true,
      dataSize: txData.scriptLength || 0,
      notes: 'Data is immutably stored in blockchain'
    };
  }

  static _extractPayments(txData) {
    const payments = [];
    
    if (txData.outputAddresses) {
      txData.outputAddresses.forEach((addr, idx) => {
        payments.push({
          index: idx,
          address: addr,
          amount: txData.outputValues ? txData.outputValues[idx] : 0
        });
      });
    }

    return payments;
  }

  static _analyzeTimestamps(txData) {
    return {
      transactionTime: Helpers.formatTimestamp(txData.timestamp),
      age: Helpers.timeAgo(txData.timestamp),
      confirmations: txData.confirmations
    };
  }
}
