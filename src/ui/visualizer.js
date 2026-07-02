/**
 * Visualizer - Creates ASCII and diagram visualizations
 */

class Visualizer {
  static createAddressTree(addressData) {
    let tree = '\n📊 Address Relationship Tree\n';
    tree += '═'.repeat(40) + '\n\n';

    if (addressData.address) {
      tree += `┌─ 🎯 Main Address\n`;
      tree += `│  └─ ${Helpers.truncate(addressData.address, 30)}\n`;
      tree += `│     ├─ Balance: ${Helpers.formatNumber(addressData.balance || 0)} sat\n`;
      tree += `│     └─ Transactions: ${addressData.txCount || 0}\n\n`;
    }

    if (addressData.inputAddresses && addressData.inputAddresses.length > 0) {
      tree += `├─ 📥 Input Addresses (${addressData.inputAddresses.length})\n`;
      addressData.inputAddresses.slice(0, 5).forEach((addr, i) => {
        const isLast = i === Math.min(4, addressData.inputAddresses.length - 1);
        tree += `│  ${isLast ? '└' : '├'}─ ${Helpers.truncate(addr, 25)}\n`;
      });
      if (addressData.inputAddresses.length > 5) {
        tree += `│  └─ ... and ${addressData.inputAddresses.length - 5} more\n`;
      }
      tree += '\n';
    }

    if (addressData.outputAddresses && addressData.outputAddresses.length > 0) {
      tree += `└─ 📤 Output Addresses (${addressData.outputAddresses.length})\n`;
      addressData.outputAddresses.slice(0, 5).forEach((addr, i) => {
        tree += `   ${i === Math.min(4, addressData.outputAddresses.length - 1) ? '└' : '├'}─ ${Helpers.truncate(addr, 25)}\n`;
      });
      if (addressData.outputAddresses.length > 5) {
        tree += `   └─ ... and ${addressData.outputAddresses.length - 5} more\n`;
      }
    }

    return tree;
  }

  static createTransactionFlow(txData) {
    let flow = '\n💰 Transaction Flow\n';
    flow += '═'.repeat(40) + '\n\n';

    if (txData.inputAddresses) {
      flow += `INPUTS (${txData.inputAddresses.length}):\n`;
      txData.inputAddresses.slice(0, 3).forEach((addr, i) => {
        flow += `  │\n  ├─ ${Helpers.truncate(addr, 30)}\n`;
      });
      if (txData.inputAddresses.length > 3) {
        flow += `  └─ ... ${txData.inputAddresses.length - 3} more\n`;
      }
    }

    flow += `\n  │\n  └─────────► TRANSACTION\n  │
  │  TXID: ${Helpers.truncate(txData.txid || 'unknown', 30)}\n  │  Value: ${Helpers.formatNumber(txData.value || 0)} sat\n  │  Fee: ${Helpers.formatNumber(txData.fees || 0)} sat\n  │\n`;

    if (txData.outputAddresses) {
      flow += `OUTPUTS (${txData.outputAddresses.length}):\n`;
      txData.outputAddresses.slice(0, 3).forEach((addr, i) => {
        flow += `  ├─ ${Helpers.truncate(addr, 30)}\n`;
      });
      if (txData.outputAddresses.length > 3) {
        flow += `  └─ ... ${txData.outputAddresses.length - 3} more\n`;
      }
    }

    return flow;
  }

  static createRiskHeatmap(riskData) {
    let heatmap = '\n🎯 Risk Analysis Heatmap\n';
    heatmap += '═'.repeat(40) + '\n\n';

    const risks = riskData.risks || [];
    
    if (risks.length === 0) {
      heatmap += '✅ No significant risks detected\n';
    } else {
      const highRisk = risks.filter(r => r.severity === 'high').length;
      const mediumRisk = risks.filter(r => r.severity === 'medium').length;
      const lowRisk = risks.filter(r => r.severity === 'low').length;

      if (highRisk > 0) {
        heatmap += `🔴 HIGH RISK (${highRisk}): `;
        risks.filter(r => r.severity === 'high').forEach(r => {
          heatmap += `${r.type.substring(0, 15)} `;
        });
        heatmap += '\n';
      }

      if (mediumRisk > 0) {
        heatmap += `🟡 MEDIUM RISK (${mediumRisk}): `;
        risks.filter(r => r.severity === 'medium').forEach(r => {
          heatmap += `${r.type.substring(0, 12)} `;
        });
        heatmap += '\n';
      }

      if (lowRisk > 0) {
        heatmap += `🟢 LOW RISK (${lowRisk}): `;
        risks.filter(r => r.severity === 'low').forEach(r => {
          heatmap += `${r.type.substring(0, 12)} `;
        });
        heatmap += '\n';
      }
    }

    return heatmap;
  }
}
