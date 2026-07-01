/**
 * Format Validation Module
 * Validates blockchain addresses, hashes, and keys
 */

class Validators {
  /**
   * Validate Bitcoin address format
   */
  static isValidBTCAddress(addr) {
    if (!addr || typeof addr !== 'string') return false;
    
    // P2PKH (1...)
    if (/^1[1-9A-HJ-NP-Z]{25,34}$/.test(addr)) return true;
    
    // P2SH (3...)
    if (/^3[1-9A-HJ-NP-Z]{25,34}$/.test(addr)) return true;
    
    // P2WPKH-P2SH (3... but with different encoding)
    if (/^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(addr)) return true;
    
    // Bech32 (bc1...)
    if (/^bc1[ac-hj-np-z02-9]{39,59}$/.test(addr)) return true;
    
    return false;
  }

  /**
   * Validate Bitcoin Cash address
   */
  static isValidBCHAddress(addr) {
    if (!addr || typeof addr !== 'string') return false;
    
    // BCH mainnet (bitcoincash:...)
    if (/^bitcoincash:[0-9a-z]{42,62}$/.test(addr)) return true;
    
    // Legacy format (1... or 3...)
    if (/^[13][1-9A-HJ-NP-Z]{25,34}$/.test(addr)) return true;
    
    // CashAddr format (q... or p...)
    if (/^[qp][0-9a-z]{41,61}$/.test(addr)) return true;
    
    return false;
  }

  /**
   * Validate Bitcoin SV address
   */
  static isValidBSVAddress(addr) {
    if (!addr || typeof addr !== 'string') return false;
    
    // Legacy format (1... or 3...)
    if (/^[13][1-9A-HJ-NP-Z]{25,34}$/.test(addr)) return true;
    
    // CashAddr-like
    if (/^[qp][0-9a-z]{41,61}$/.test(addr)) return true;
    
    return false;
  }

  /**
   * Validate any blockchain address
   */
  static isValidAddress(addr) {
    return this.isValidBTCAddress(addr) ||
           this.isValidBCHAddress(addr) ||
           this.isValidBSVAddress(addr);
  }

  /**
   * Validate transaction hash (256-bit hex)
   */
  static isValidTxHash(hash) {
    if (!hash || typeof hash !== 'string') return false;
    
    // 64 hex characters
    if (!/^[0-9a-fA-F]{64}$/.test(hash)) return false;
    
    return true;
  }

  /**
   * Validate block hash
   */
  static isValidBlockHash(hash) {
    return this.isValidTxHash(hash); // Same format
  }

  /**
   * Validate HASH160 (20 bytes = 40 hex chars)
   */
  static isValidHash160(hash) {
    if (!hash || typeof hash !== 'string') return false;
    
    // 40 hex characters
    if (!/^[0-9a-fA-F]{40}$/.test(hash)) return false;
    
    return true;
  }

  /**
   * Validate public key (compressed or uncompressed)
   */
  static isValidPublicKey(key) {
    if (!key || typeof key !== 'string') return false;
    
    // Compressed: 33 bytes = 66 hex chars, starts with 02 or 03
    if (/^(02|03)[0-9a-fA-F]{64}$/.test(key)) return true;
    
    // Uncompressed: 65 bytes = 130 hex chars, starts with 04
    if (/^04[0-9a-fA-F]{128}$/.test(key)) return true;
    
    return false;
  }

  /**
   * Validate WIF (Wallet Import Format)
   */
  static isValidWIF(wif) {
    if (!wif || typeof wif !== 'string') return false;
    
    // Base58Check format, starts with 5 (uncompressed) or K/L (compressed)
    if (!/^[5KL][1-9A-HJ-NP-Z]{50,51}$/.test(wif)) return false;
    
    return true;
  }

  /**
   * Validate zpub/xpub (extended public key)
   */
  static isValidExtendedKey(key) {
    if (!key || typeof key !== 'string') return false;
    
    // xpub, ypub, zpub, tpub (mainnet and testnet versions)
    if (/^(xpub|ypub|zpub|tpub|upub|vub)[1-9A-HJ-NP-Z]{107,111}$/.test(key)) return true;
    
    return false;
  }

  /**
   * Validate Bech32 format
   */
  static isValidBech32(str) {
    if (!str || typeof str !== 'string') return false;
    
    // bc1 (Bitcoin), bitcoincash (BCH), etc
    if (!/^[a-z0-9]{2,}1[ac-hj-np-z02-9]{39,59}$/.test(str.toLowerCase())) return false;
    
    return true;
  }

  /**
   * Validate Base58 format
   */
  static isValidBase58(str) {
    if (!str || typeof str !== 'string') return false;
    
    // Only Base58 alphabet (no 0, O, I, l)
    if (!/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(str)) return false;
    
    return true;
  }

  /**
   * Validate Hex string
   */
  static isValidHex(str) {
    if (!str || typeof str !== 'string') return false;
    
    if (!/^[0-9a-fA-F]*$/.test(str)) return false;
    
    return true;
  }

  /**
   * Validate Base64 string
   */
  static isValidBase64(str) {
    if (!str || typeof str !== 'string') return false;
    
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) return false;
    if (str.length % 4 !== 0) return false;
    
    return true;
  }

  /**
   * Validate OP_RETURN output
   */
  static isValidOpReturn(data) {
    if (!data || typeof data !== 'string') return false;
    
    // Should start with OP_RETURN opcode (6a)
    if (!data.toLowerCase().startsWith('6a')) return false;
    
    return true;
  }

  /**
   * Get validation result for unknown input
   */
  static validateUnknown(input) {
    const results = [];

    if (this.isValidBTCAddress(input)) results.push({ type: 'Bitcoin Address', chain: 'BTC', valid: true });
    if (this.isValidBCHAddress(input)) results.push({ type: 'Bitcoin Cash Address', chain: 'BCH', valid: true });
    if (this.isValidBSVAddress(input)) results.push({ type: 'Bitcoin SV Address', chain: 'BSV', valid: true });
    if (this.isValidTxHash(input)) results.push({ type: 'Transaction Hash', valid: true });
    if (this.isValidBlockHash(input)) results.push({ type: 'Block Hash', valid: true });
    if (this.isValidHash160(input)) results.push({ type: 'HASH160', valid: true });
    if (this.isValidPublicKey(input)) results.push({ type: 'Public Key', compressed: input.length === 66, valid: true });
    if (this.isValidWIF(input)) results.push({ type: 'WIF (Private Key)', valid: true, warning: 'PRIVATE KEY - DO NOT SHARE' });
    if (this.isValidExtendedKey(input)) results.push({ type: 'Extended Public Key', keyType: input.slice(0, 4), valid: true });
    if (this.isValidBech32(input)) results.push({ type: 'Bech32', valid: true });
    if (this.isValidBase58(input)) results.push({ type: 'Base58', valid: true });
    if (this.isValidHex(input)) results.push({ type: 'Hexadecimal', valid: true });
    if (this.isValidBase64(input)) results.push({ type: 'Base64', valid: true });
    if (this.isValidOpReturn(input)) results.push({ type: 'OP_RETURN Data', valid: true });

    return results.length > 0 ? results : [{ type: 'Unknown', valid: false }];
  }
}
