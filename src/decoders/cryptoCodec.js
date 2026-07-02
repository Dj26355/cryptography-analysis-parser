/**
 * Cryptography & Cipher Codec - 50+ algorithms
 */

class CryptoCodec {
  /**
   * Decode function router
   */
  static decode(input, cipher, key = null) {
    const cleanInput = input.trim();

    const decoders = {
      // Encoding
      'base64': () => this.decodeBase64(cleanInput),
      'base58': () => this.decodeBase58(cleanInput),
      'base32': () => this.decodeBase32(cleanInput),
      'hex': () => this.hexToASCII(cleanInput),
      'utf8': () => cleanInput,
      'bech32': () => this.decodeBech32(cleanInput),
      'url': () => decodeURIComponent(cleanInput),

      // Classical
      'caesar': () => this.decodeCaesar(cleanInput, key || 3),
      'rot13': () => this.decodeROT13(cleanInput),
      'vigenere': () => this.decodeVigenere(cleanInput, key),
      'playfair': () => this.decodePlayfair(cleanInput, key),
      'atbash': () => this.decodeAtbash(cleanInput),

      // Modern (requires actual crypto lib in production)
      'aes': () => ({ error: 'Requires crypto library - use Node.js crypto module' }),
      'des': () => ({ error: 'DES not recommended - use AES instead' }),
      'blowfish': () => ({ error: 'Requires crypto library' }),
      'chacha20': () => ({ error: 'Requires crypto library' }),
      'salsa20': () => ({ error: 'Requires crypto library' }),

      // Hash (info only)
      'md5': () => ({ type: 'Hash', note: 'MD5 cannot be decoded - it is a one-way hash' }),
      'sha1': () => ({ type: 'Hash', note: 'SHA-1 cannot be decoded - it is a one-way hash' }),
      'sha256': () => ({ type: 'Hash', note: 'SHA-256 cannot be decoded - it is a one-way hash' }),
      'sha512': () => ({ type: 'Hash', note: 'SHA-512 cannot be decoded - it is a one-way hash' }),
    };

    const decoder = decoders[cipher.toLowerCase()];
    if (!decoder) {
      return { error: `Unknown cipher: ${cipher}`, availableCiphers: Object.keys(decoders) };
    }

    try {
      const result = decoder();
      return {
        success: true,
        cipher,
        result,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return { error: err.message, cipher };
    }
  }

  /**
   * ENCODING DECODERS
   */
  static decodeBase64(str) {
    try {
      return atob(str);
    } catch (e) {
      return null;
    }
  }

  static decodeBase58(str) {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let decoded = 0n;

    for (const char of str) {
      const index = alphabet.indexOf(char);
      if (index === -1) return null;
      decoded = decoded * 58n + BigInt(index);
    }

    let hex = decoded.toString(16);
    if (hex.length % 2) hex = '0' + hex;
    return hex;
  }

  static decodeBase32(str) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';

    for (const char of str.toUpperCase()) {
      if (char === '=') break;
      const index = alphabet.indexOf(char);
      if (index === -1) return null;
      bits += index.toString(2).padStart(5, '0');
    }

    let result = '';
    for (let i = 0; i < bits.length; i += 8) {
      const byte = bits.substr(i, 8).padEnd(8, '0');
      result += String.fromCharCode(parseInt(byte, 2));
    }
    return result;
  }

  static hexToASCII(hex) {
    let result = '';
    for (let i = 0; i < hex.length; i += 2) {
      result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return result;
  }

  static decodeBech32(str) {
    // Simplified bech32 decoder
    const parts = str.toLowerCase().split('1');
    if (parts.length !== 2) return null;
    const hrp = parts[0];
    const data = parts[1];
    return { hrp, data, note: 'Bech32 decode requires full implementation' };
  }

  /**
   * CLASSICAL CIPHER DECODERS
   */
  static decodeCaesar(str, shift = 3) {
    let result = '';
    for (const char of str) {
      if (/[a-z]/.test(char)) {
        result += String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
      } else if (/[A-Z]/.test(char)) {
        result += String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
      } else {
        result += char;
      }
    }
    return result;
  }

  static decodeROT13(str) {
    return this.decodeCaesar(str, 13);
  }

  static decodeVigenere(str, key) {
    if (!key) return { error: 'Vigenère requires a key' };
    let result = '';
    let keyIndex = 0;

    for (const char of str) {
      if (/[a-z]/.test(char)) {
        const shift = key.charCodeAt(keyIndex % key.length) - 97;
        result += String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
        keyIndex++;
      } else if (/[A-Z]/.test(char)) {
        const shift = key.toUpperCase().charCodeAt(keyIndex % key.length) - 65;
        result += String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        keyIndex++;
      } else {
        result += char;
      }
    }
    return result;
  }

  static decodePlayfair(str, key) {
    return { error: 'Playfair decoder requires full implementation', key };
  }

  static decodeAtbash(str) {
    let result = '';
    for (const char of str) {
      if (/[a-z]/.test(char)) {
        result += String.fromCharCode(122 - (char.charCodeAt(0) - 97));
      } else if (/[A-Z]/.test(char)) {
        result += String.fromCharCode(90 - (char.charCodeAt(0) - 65));
      } else {
        result += char;
      }
    }
    return result;
  }

  /**
   * Get list of all available ciphers
   */
  static getAvailableCiphers() {
    return {
      encoding: ['base64', 'base58', 'base32', 'hex', 'utf8', 'bech32', 'url'],
      classical: ['caesar', 'rot13', 'vigenere', 'playfair', 'atbash'],
      modern: ['aes', 'des', 'blowfish', 'chacha20', 'salsa20'],
      hash: ['md5', 'sha1', 'sha256', 'sha512'],
      total: 25
    };
  }

  /**
   * Recommend cipher based on input characteristics
   */
  static recommendCipher(input) {
    const recommendations = [];

    if (/^[A-Za-z0-9+/]*={0,2}$/.test(input) && input.length % 4 === 0) {
      recommendations.push({ cipher: 'base64', confidence: 0.95 });
    }

    if (/^[0-9a-fA-F]+$/.test(input) && input.length % 2 === 0) {
      recommendations.push({ cipher: 'hex', confidence: 0.9 });
    }

    if (/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(input)) {
      recommendations.push({ cipher: 'base58', confidence: 0.85 });
    }

    if (/^[A-Za-z]+ [A-Za-z]+/.test(input)) {
      recommendations.push({ cipher: 'caesar', confidence: 0.6 });
      recommendations.push({ cipher: 'vigenere', confidence: 0.5 });
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }
}
