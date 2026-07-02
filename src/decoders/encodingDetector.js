/**
 * Encoding Detector - Identifies encoding types and recommends decoders
 */

class EncodingDetector {
  static detect(input) {
    if (!input || typeof input !== 'string') return { error: 'Invalid input' };

    const results = [];
    const cleaned = input.trim();

    // Base64
    if (this._isBase64(cleaned)) {
      results.push({
        encoding: 'Base64',
        confidence: 0.95,
        decoders: ['base64_decode'],
        notes: 'Standard Base64 encoding',
        tryFirst: true
      });
    }

    // Hex
    if (this._isHex(cleaned)) {
      results.push({
        encoding: 'Hexadecimal',
        confidence: 0.9,
        decoders: ['hex_decode'],
        notes: 'Base16 encoding, common in crypto'
      });
    }

    // Base58
    if (this._isBase58(cleaned)) {
      results.push({
        encoding: 'Base58',
        confidence: 0.85,
        decoders: ['base58_decode'],
        notes: 'Used in Bitcoin addresses and WIF'
      });
    }

    // Base32
    if (this._isBase32(cleaned)) {
      results.push({
        encoding: 'Base32',
        confidence: 0.85,
        decoders: ['base32_decode'],
        notes: 'RFC 4648 encoding'
      });
    }

    // Bech32
    if (this._isBech32(cleaned)) {
      results.push({
        encoding: 'Bech32',
        confidence: 0.9,
        decoders: ['bech32_decode'],
        notes: 'Used in Bitcoin SegWit addresses'
      });
    }

    // URL Encoding
    if (this._isURLEncoded(cleaned)) {
      results.push({
        encoding: 'URL Encoding (Percent-encoding)',
        confidence: 0.8,
        decoders: ['urldecode'],
        notes: '%XX format for special characters'
      });
    }

    // ROT13
    if (this._isROT13(cleaned)) {
      results.push({
        encoding: 'ROT13 Cipher',
        confidence: 0.7,
        decoders: ['rot13_decode'],
        notes: 'Simple character rotation'
      });
    }

    // Caesar Cipher (try common shifts)
    const caesarResults = this._detectCaesar(cleaned);
    if (caesarResults.length > 0) {
      results.push({
        encoding: 'Caesar Cipher',
        confidence: 0.6,
        shifts: caesarResults,
        decoders: ['caesar_decode'],
        notes: 'Try different shift values'
      });
    }

    // Vigenère
    if (this._couldBeVigenere(cleaned)) {
      results.push({
        encoding: 'Vigenère Cipher',
        confidence: 0.5,
        decoders: ['vigenere_decode'],
        notes: 'Requires a key',
        requiresKey: true
      });
    }

    // AES (usually base64 wrapped)
    if (this._couldBeAES(cleaned)) {
      results.push({
        encoding: 'AES Encrypted',
        confidence: 0.7,
        variants: ['AES-128', 'AES-192', 'AES-256'],
        decoders: ['aes_decrypt'],
        notes: 'Requires decryption key and IV',
        requiresKey: true
      });
    }

    return {
      input: cleaned,
      detections: results.sort((a, b) => b.confidence - a.confidence),
      primaryGuess: results.length > 0 ? results[0] : null,
      recommendations: this._getRecommendations(results, cleaned)
    };
  }

  static _isBase64(str) {
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) return false;
    if (str.length % 4 !== 0) return false;
    try {
      return btoa(atob(str)) === str;
    } catch (e) {
      return false;
    }
  }

  static _isHex(str) {
    return /^[0-9a-fA-F]*$/.test(str) && str.length >= 4 && str.length % 2 === 0;
  }

  static _isBase58(str) {
    return /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(str);
  }

  static _isBase32(str) {
    return /^[A-Z2-7]+=*$/.test(str);
  }

  static _isBech32(str) {
    return /^[a-z0-9]{2,}1[ac-hj-np-z02-9]{39,59}$/.test(str.toLowerCase());
  }

  static _isURLEncoded(str) {
    return /%[0-9A-Fa-f]{2}/.test(str);
  }

  static _isROT13(str) {
    if (!/^[A-Za-z\s]+$/.test(str)) return false;
    const rotated = str.replace(/[a-zA-Z]/g, c => String.fromCharCode((c.charCodeAt(0) - 65 + 13) % 26 + 65));
    return this._isEnglishText(rotated);
  }

  static _detectCaesar(str) {
    const results = [];
    for (let shift = 1; shift < 26; shift++) {
      const rotated = str.replace(/[a-zA-Z]/g, c => {
        const start = c.charCodeAt(0) - (c === c.toUpperCase() ? 65 : 97);
        return String.fromCharCode(((start + shift) % 26) + (c === c.toUpperCase() ? 65 : 97));
      });
      if (this._isEnglishText(rotated)) {
        results.push({ shift, result: rotated });
      }
    }
    return results;
  }

  static _couldBeVigenere(str) {
    return /^[A-Za-z]+$/.test(str) && str.length > 10;
  }

  static _couldBeAES(str) {
    // Usually base64 encoded, with certain length patterns
    if (!this._isBase64(str)) return false;
    const len = atob(str).length;
    return len >= 16 && len % 16 === 0; // AES block size is 16 bytes
  }

  static _isEnglishText(str) {
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all'];
    const words = str.toLowerCase().split(/\s+/);
    const matches = words.filter(w => commonWords.includes(w)).length;
    return matches / words.length > 0.1;
  }

  static _getRecommendations(results, input) {
    const recs = [];
    
    if (results.length === 0) {
      recs.push('⚠️ No encoding detected. This might be plaintext or an unknown cipher.');
      recs.push('💡 Try: Manual cipher selection or frequency analysis');
      return recs;
    }

    const top = results[0];
    recs.push(`🎯 Most likely: ${top.encoding} (${Math.round(top.confidence * 100)}% confidence)`);

    if (top.requiresKey) {
      recs.push('🔑 This encoding requires a decryption key to proceed');
    }

    if (results.length > 1) {
      recs.push(`⚠️ Also consider: ${results[1].encoding}`);
    }

    return recs;
  }
}
