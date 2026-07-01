/**
 * Hash Format Parser & Detector
 * Identifies hash types and their formats
 */

class HashParser {
  /**
   * Main detection function
   */
  static parse(input) {
    if (!input || typeof input !== 'string') {
      return { error: 'Invalid input' };
    }

    const cleaned = input.trim();
    const results = [];

    // Check each hash type
    const checks = [
      { fn: this.isHash160.bind(this), type: 'HASH160' },
      { fn: this.isSHA256.bind(this), type: 'SHA256 / TX Hash / Block Hash' },
      { fn: this.isDoubleSHA256.bind(this), type: 'Double SHA256' },
      { fn: this.isMD5.bind(this), type: 'MD5' },
      { fn: this.isSHA1.bind(this), type: 'SHA-1' },
      { fn: this.isSHA512.bind(this), type: 'SHA-512' },
      { fn: this.isBLAKE2.bind(this), type: 'BLAKE2' },
      { fn: this.isRIPEMD160.bind(this), type: 'RIPEMD160' },
      { fn: this.isSHA3.bind(this), type: 'SHA-3' },
    ];

    for (const check of checks) {
      const match = check.fn(cleaned);
      if (match) {
        results.push({
          detected: check.type,
          format: match.format,
          length: cleaned.length,
          encoding: match.encoding,
          bitLength: match.bitLength,
          byteLength: match.byteLength,
          confidence: match.confidence || 0.9
        });
      }
    }

    return {
      input: cleaned,
      detections: results,
      primary: results.length > 0 ? results[0] : null,
      count: results.length
    };
  }

  /**
   * HASH160: 160-bit hash (20 bytes = 40 hex)
   * Used for Bitcoin address generation
   */
  static isHash160(input) {
    if (!/^[0-9a-fA-F]{40}$/.test(input)) return null;

    return {
      format: 'Hexadecimal',
      encoding: 'Base16 (Hex)',
      bitLength: 160,
      byteLength: 20,
      confidence: 0.95,
      notes: 'Typically RIPEMD160(SHA256(pubkey)) used in Bitcoin addresses'
    };
  }

  /**
   * SHA256: 256-bit hash (32 bytes = 64 hex)
   * Bitcoin transaction hashes and block hashes
   */
  static isSHA256(input) {
    if (!/^[0-9a-fA-F]{64}$/.test(input)) return null;

    return {
      format: 'Hexadecimal',
      encoding: 'Base16 (Hex)',
      bitLength: 256,
      byteLength: 32,
      confidence: 0.85,
      notes: 'Could be transaction hash, block hash, or raw SHA256 hash',
      possibleUses: ['Transaction ID (TXID)', 'Block Hash', 'Merkle Root']
    };
  }

  /**
   * Double SHA256: Applies SHA256 twice
   * Used in Bitcoin for transaction and block hashing
   */
  static isDoubleSHA256(input) {
    if (!/^[0-9a-fA-F]{64}$/.test(input)) return null;

    // Note: Cannot determine if input IS double SHA256 without original data
    // But format is same as SHA256
    return {
      format: 'Hexadecimal',
      encoding: 'Base16 (Hex)',
      bitLength: 256,
      byteLength: 32,
      confidence: 0.5,
      notes: 'Format matches SHA256; likely is double SHA256 in Bitcoin context',
      context: 'Most likely a Bitcoin transaction or block hash'
    };
  }

  /**
   * MD5: 128-bit hash (16 bytes = 32 hex)
   */
  static isMD5(input) {
    if (!/^[0-9a-fA-F]{32}$/.test(input)) return null;

    return {
      format: 'Hexadecimal',
      encoding: 'Base16 (Hex)',
      bitLength: 128,
      byteLength: 16,
      confidence: 0.9,
      notes: 'MD5 is cryptographically broken; should not be used for security'
    };
  }

  /**
   * SHA-1: 160-bit hash (20 bytes = 40 hex)
   */
  static isSHA1(input) {
    // Same length as HASH160, so confidence is lower
    if (!/^[0-9a-fA-F]{40}$/.test(input)) return null;

    return {
      format: 'Hexadecimal',
      encoding: 'Base16 (Hex)',
      bitLength: 160,
      byteLength: 20,
      confidence: 0.6,
      notes: 'SHA-1 is deprecated due to collision vulnerabilities',
      ambiguity: 'Could also be HASH160 or RIPEMD160'
    };
  }

  /**
   * SHA-512: 512-bit hash (64 bytes = 128 hex)
   */
  static isSHA512(input) {
    if (!/^[0-9a-fA-F]{128}$/.test(input)) return null;

    return {
      format: 'Hexadecimal',
      encoding: 'Base16 (Hex)',
      bitLength: 512,
      byteLength: 64,
      confidence: 0.95,
      notes: 'Larger hash output, commonly used in modern systems'
    };
  }

  /**
   * BLAKE2: 256-bit or 512-bit hash
   */
  static isBLAKE2(input) {
    let match;
    if (/^[0-9a-fA-F]{64}$/.test(input)) {
      match = { bits: 256, bytes: 32 };
    } else if (/^[0-9a-fA-F]{128}$/.test(input)) {
      match = { bits: 512, bytes: 64 };
    } else {
      return null;
    }

    return {
      format: 'Hexadecimal',
      encoding: 'Base16 (Hex)',
      bitLength: match.bits,
      byteLength: match.bytes,
      confidence: 0.75,
      notes: 'BLAKE2 is faster than MD5 and more secure than SHA256'
    };
  }

  /**
   * RIPEMD160: 160-bit hash (20 bytes = 40 hex)
   */
  static isRIPEMD160(input) {
    if (!/^[0-9a-fA-F]{40}$/.test(input)) return null;

    return {
      format: 'Hexadecimal',
      encoding: 'Base16 (Hex)',
      bitLength: 160,
      byteLength: 20,
      confidence: 0.65,
      notes: 'Used in Bitcoin for address generation',
      ambiguity: 'Same length as SHA-1 and HASH160'
    };
  }

  /**
   * SHA-3: 224, 256, 384, or 512 bit
   */
  static isSHA3(input) {
    const patterns = [
      { len: 56, bits: 224 },
      { len: 64, bits: 256 },
      { len: 96, bits: 384 },
      { len: 128, bits: 512 }
    ];

    if (!/^[0-9a-fA-F]+$/.test(input)) return null;

    for (const p of patterns) {
      if (input.length === p.len) {
        return {
          format: 'Hexadecimal',
          encoding: 'Base16 (Hex)',
          bitLength: p.bits,
          byteLength: p.len / 2,
          confidence: 0.75,
          notes: 'SHA-3 (Keccak) is the latest member of the Secure Hash Algorithm family'
        };
      }
    }

    return null;
  }

  /**
   * Get recommendations for equivalent hash representations
   */
  static getEquivalents(input, hashType = 'SHA256') {
    const equivalents = [];
    const cleaned = input.toLowerCase().replace(/[^0-9a-f]/g, '');

    // Hex
    equivalents.push({
      format: 'Hexadecimal (lowercase)',
      value: cleaned
    });

    equivalents.push({
      format: 'Hexadecimal (uppercase)',
      value: cleaned.toUpperCase()
    });

    // Base64 representation
    if (cleaned.length % 2 === 0) {
      try {
        const bytes = cleaned.match(/.{1,2}/g).map(b => String.fromCharCode(parseInt(b, 16))).join('');
        const base64 = btoa(bytes);
        equivalents.push({
          format: 'Base64',
          value: base64
        });
      } catch (e) {
        // Conversion failed
      }
    }

    return equivalents;
  }
}
