/**
 * Cluster Analysis - Detects related addresses
 */

class ClusterAnalyzer {
  static analyze(addressData) {
    const clusters = [];

    // Input clustering
    if (addressData.inputAddresses && addressData.inputAddresses.length > 1) {
      clusters.push({
        type: 'Input Cluster',
        addresses: addressData.inputAddresses,
        size: addressData.inputAddresses.length,
        implication: 'Likely controlled by same entity (CoinJoin assumption)'
      });
    }

    // Output clustering
    if (addressData.outputAddresses && addressData.outputAddresses.length > 1) {
      clusters.push({
        type: 'Output Cluster',
        addresses: addressData.outputAddresses,
        size: addressData.outputAddresses.length,
        implication: 'Possible payments to multiple recipients or change addresses'
      });
    }

    return {
      clusters,
      totalAddressesInvolved: this._countUnique(addressData),
      summary: this._summarizeClusters(clusters)
    };
  }

  static _countUnique(addressData) {
    const set = new Set();
    if (addressData.inputAddresses) addressData.inputAddresses.forEach(a => set.add(a));
    if (addressData.outputAddresses) addressData.outputAddresses.forEach(a => set.add(a));
    return set.size;
  }

  static _summarizeClusters(clusters) {
    return `${clusters.length} cluster(s) detected`;
  }
}
