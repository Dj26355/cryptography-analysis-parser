/**
 * Helper Utilities
 * Common functions for conversion, formatting, and operations
 */

class Helpers {
  /**
   * Convert hex to ASCII
   */
  static hexToASCII(hex) {
    if (!hex || typeof hex !== 'string') return '';
    
    let ascii = '';
    for (let i = 0; i < hex.length; i += 2) {
      const charCode = parseInt(hex.substr(i, 2), 16);
      if (charCode >= 32 && charCode <= 126) {
        ascii += String.fromCharCode(charCode);
      } else {
        ascii += '.';
      }
    }
    return ascii;
  }

  /**
   * Convert ASCII to hex
   */
  static asciiToHex(ascii) {
    if (!ascii || typeof ascii !== 'string') return '';
    
    let hex = '';
    for (let i = 0; i < ascii.length; i++) {
      hex += ascii.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
  }

  /**
   * Convert hex to binary
   */
  static hexToBinary(hex) {
    if (!hex || typeof hex !== 'string') return '';
    
    return hex.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
  }

  /**
   * Convert binary to hex
   */
  static binaryToHex(bin) {
    if (!bin || typeof bin !== 'string') return '';
    
    return (parseInt(bin, 2).toString(16));
  }

  /**
   * Double SHA256 hash (Bitcoin standard)
   * NOTE: In real implementation, use proper crypto library
   */
  static doubleSHA256(data) {
    // This is a placeholder - actual implementation needs crypto library
    return 'NEEDS_CRYPTO_LIB';
  }

  /**
   * Check if two hashes are mathematically equivalent
   * (same value in different encodings)
   */
  static areHashesEqual(hash1, hash2) {
    if (!hash1 || !hash2) return false;
    
    // Normalize to lowercase hex
    const h1 = hash1.toLowerCase().replace(/[^0-9a-f]/g, '');
    const h2 = hash2.toLowerCase().replace(/[^0-9a-f]/g, '');
    
    return h1 === h2;
  }

  /**
   * Find all equivalent representations of a hash
   */
  static findEquivalentHashes(input) {
    const equivalents = [];
    const cleaned = input.toLowerCase().replace(/[^0-9a-f]/g, '');
    
    if (cleaned.length === 40) { // HASH160
      equivalents.push({
        format: 'Hex (lowercase)',
        value: cleaned
      });
      equivalents.push({
        format: 'Hex (uppercase)',
        value: cleaned.toUpperCase()
      });
      // Could add Base58, Bech32, etc.
    }
    
    return equivalents;
  }

  /**
   * Format large numbers with commas
   */
  static formatNumber(num) {
    if (typeof num !== 'number') return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Convert satoshis to BTC
   */
  static satoshisToBTC(satoshis) {
    if (typeof satoshis !== 'number') return 0;
    return satoshis / 100000000;
  }

  /**
   * Convert BTC to satoshis
   */
  static btcToSatoshis(btc) {
    if (typeof btc !== 'number') return 0;
    return Math.round(btc * 100000000);
  }

  /**
   * Format timestamp to readable date
   */
  static formatTimestamp(ts) {
    if (!ts) return 'N/A';
    const num = typeof ts === 'string' ? parseInt(ts) : ts;
    const date = new Date(num * 1000);
    return date.toLocaleString();
  }

  /**
   * Calculate time ago from timestamp
   */
  static timeAgo(timestamp) {
    const num = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    const seconds = Math.floor((Date.now() / 1000) - num);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 2592000)}mo ago`;
  }

  /**
   * Deep clone object
   */
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Merge objects recursively
   */
  static mergeObjects(target, source) {
    const result = this.deepClone(target);
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = this.mergeObjects(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  /**
   * Truncate string with ellipsis
   */
  static truncate(str, length = 50) {
    if (!str || typeof str !== 'string') return '';
    return str.length > length ? str.slice(0, length) + '...' : str;
  }

  /**
   * Sleep/delay function
   */
  static async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Rate limiter
   */
  static async rateLimit(fn, delay = 1000) {
    await this.sleep(delay);
    return fn();
  }

  /**
   * Retry function with exponential backoff
   */
  static async retry(fn, maxAttempts = 3, backoff = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        return await fn();
      } catch (err) {
        if (i === maxAttempts - 1) throw err;
        await this.sleep(backoff * Math.pow(2, i));
      }
    }
  }

  /**
   * Generate unique ID
   */
  static generateID() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Check if running in Node.js
   */
  static isNode() {
    return typeof module !== 'undefined' && module.exports;
  }

  /**
   * Check if running in browser
   */
  static isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }
}
