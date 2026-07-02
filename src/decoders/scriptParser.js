/**
 * Script Parser & OP Code Analyzer
 * Breaks down and explains Bitcoin scripts in plain language
 */

class ScriptParser {
  /**
   * Parse Bitcoin script hex and explain it
   */
  static parse(scriptHex) {
    const ops = this.parseOPs(scriptHex);
    const explained = this.explainScript(ops);
    
    return {
      hex: scriptHex,
      opcodes: ops,
      explanation: explained,
      scriptType: this.detectScriptType(ops),
      riskFactors: this.analyzeRisks(ops)
    };
  }

  /**
   * Parse individual OPs
   */
  static parseOPs(hex) {
    const ops = [];
    let i = 0;

    while (i < hex.length) {
      const byte = hex.substr(i, 2).toUpperCase();
      const opInfo = this.getOPInfo(byte);
      
      ops.push({
        position: i / 2,
        hex: byte,
        name: opInfo.name,
        description: opInfo.description
      });

      i += 2;
    }

    return ops;
  }

  /**
   * Get OP code information
   */
  static getOPInfo(byte) {
    const opcodes = {
      '00': { name: 'OP_0', description: 'Push empty value' },
      '51': { name: 'OP_1', description: 'Push 1' },
      '52': { name: 'OP_2', description: 'Push 2' },
      '53': { name: 'OP_3', description: 'Push 3' },
      '54': { name: 'OP_4', description: 'Push 4' },
      '55': { name: 'OP_5', description: 'Push 5' },
      '76': { name: 'OP_DUP', description: 'Duplicate top stack item' },
      '88': { name: 'OP_EQUAL', description: 'Check if two items are equal' },
      '87': { name: 'OP_EQUALVERIFY', description: 'Check equality, fail if not equal' },
      'a9': { name: 'OP_HASH160', description: 'Hash with RIPEMD160(SHA256())' },
      'aa': { name: 'OP_HASH256', description: 'Hash with SHA256(SHA256())' },
      'ac': { name: 'OP_CHECKSIG', description: 'Check signature with public key' },
      'ae': { name: 'OP_CHECKMULTISIG', description: 'Check multiple signatures' },
      '6a': { name: 'OP_RETURN', description: 'Mark output as unspendable, can embed data' },
      '63': { name: 'OP_IF', description: 'Conditional execution' },
      '64': { name: 'OP_NOTIF', description: 'Conditional execution (inverted)' },
      '68': { name: 'OP_ELSE', description: 'Else branch of conditional' },
      '69': { name: 'OP_ENDIF', description: 'End of conditional' },
    };

    return opcodes[byte] || { name: 'PUSH', description: `Push ${parseInt(byte, 16)} bytes` };
  }

  /**
   * Explain script in plain language
   */
  static explainScript(ops) {
    const explanations = [];

    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      const nextOp = ops[i + 1];

      // Detect common patterns
      if (op.name === 'OP_DUP' && nextOp && nextOp.name === 'OP_HASH160') {
        explanations.push('🔍 P2PKH Pattern Detected: Duplicate and hash');
      }

      if (op.name === 'OP_RETURN') {
        explanations.push('💾 OP_RETURN Detected: Data embedded in blockchain');
      }

      if (op.name === 'OP_CHECKMULTISIG') {
        explanations.push('🔐 Multisig Check: Multiple signatures required');
      }

      explanations.push(`${i}. ${op.name}: ${op.description}`);
    }

    return explanations;
  }

  /**
   * Detect script type (P2PKH, P2SH, P2WPKH, etc.)
   */
  static detectScriptType(ops) {
    const hexStr = ops.map(o => o.hex).join('');

    if (hexStr.includes('6a')) return 'OP_RETURN (Data)';
    if (hexStr.startsWith('76a914') && hexStr.endsWith('88ac')) return 'P2PKH (Pay to Public Key Hash)';
    if (hexStr.startsWith('a914') && hexStr.endsWith('87')) return 'P2SH (Pay to Script Hash)';
    if (hexStr.startsWith('0014')) return 'P2WPKH (SegWit v0 keyhash)';
    if (hexStr.startsWith('0020')) return 'P2WSH (SegWit v0 scripthash)';
    if (hexStr.startsWith('51')) return 'P2TR (Taproot)';
    if (hexStr.includes('ae')) return 'Multisig';

    return 'Unknown/Non-Standard';
  }

  /**
   * Analyze risks in script
   */
  static analyzeRisks(ops) {
    const risks = [];

    const opNames = ops.map(o => o.name);

    if (opNames.includes('OP_RETURN')) {
      risks.push('⚠️ Contains OP_RETURN: Unspendable output, data embedded');
    }

    if (opNames.includes('OP_CHECKMULTISIG')) {
      risks.push('⚠️ Multisig script: Multiple keys required for spending');
    }

    if (ops.length > 20) {
      risks.push('⚠️ Complex script: More than 20 operations');
    }

    return risks;
  }
}
