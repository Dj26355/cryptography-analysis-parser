/**
 * Risk Analyzer - Scoring and flagging analysis
 */

class RiskAnalyzer {
  static analyze(data) {
    const risks = [];
    const metadata = {};

    // Address reuse
    if (data.txCount && data.txCount > 5) {
      risks.push({
        type: 'Address Reuse',
        severity: 'low',
        description: `Address used in ${data.txCount} transactions`,
        implication: 'Privacy leakage - transactions can be linked'
      });
    }

    // High transaction volume
    if (data.balance && data.balance > 10000000000) {
      risks.push({
        type: 'Large Balance',
        severity: 'medium',
        description: `Address holds significant value (${Helpers.satoshisToBTC(data.balance)} BTC)`,
        implication: 'High value target for attacks'
      });
    }

    // Clustering indicators
    if (data.inputAddresses && data.outputAddresses) {
      const overlap = data.inputAddresses.filter(a => data.outputAddresses.includes(a)).length;
      if (overlap > 0) {
        risks.push({
          type: 'Address Clustering',
          severity: 'low',
          description: `${overlap} addresses appear in both inputs and outputs`,
          implication: 'Possible wallet clustering or change detection'
        });
      }
    }

    // OP_RETURN data
    if (data.hasOpReturn) {
      risks.push({
        type: 'Embedded Data',
        severity: 'info',
        description: 'Transaction contains OP_RETURN data',
        implication: 'Data embedded in blockchain (immutable)'
      });
    }

    return {
      risks,
      score: this._calculateScore(risks),
      summary: this._generateSummary(risks)
    };
  }

  static _calculateScore(risks) {
    let score = 0;
    risks.forEach(risk => {
      if (risk.severity === 'high') score += 30;
      if (risk.severity === 'medium') score += 15;
      if (risk.severity === 'low') score += 5;
    });
    return Math.min(score, 100);
  }

  static _generateSummary(risks) {
    if (risks.length === 0) return 'No significant risk factors detected';
    const high = risks.filter(r => r.severity === 'high').length;
    const medium = risks.filter(r => r.severity === 'medium').length;
    return `${high} high, ${medium} medium risk factors`;
  }
}
