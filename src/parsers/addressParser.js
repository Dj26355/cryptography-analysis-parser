/**
 * Address Parser & Format Detector
 */

class AddressParser {
  static parse(input) {
    const cleaned = input.trim();
    const results = [];

    // Bitcoin checks
    if (/^1[1-9A-HJ-NP-Z]{25,34}$/.test(cleaned)) {
      results.push({ type: 'Bitcoin P2PKH', chain: 'BTC', format: 'Base58Check', version: '0x00' });
    }
    if (/^3[1-9A-HJ-NP-Z]{25,34}$/.test(cleaned)) {
      results.push({ type: 'Bitcoin P2SH', chain: 'BTC', format: 'Base58Check', version: '0x05' });
    }
    if (/^bc1[ac-hj-np-z02-9]{39,59}$/.test(cleaned)) {
      results.push({ type: 'Bitcoin Bech32 (P2WPKH/P2WSH)', chain: 'BTC', format: 'Bech32', hrp: 'bc' });
    }

    // BCH checks
    if (/^bitcoincash:[0-9a-z]{42,62}$/.test(cleaned)) {
      results.push({ type: 'Bitcoin Cash CashAddr', chain: 'BCH', format: 'CashAddr', prefix: 'bitcoincash:' });
    }
    if (/^[qp][0-9a-z]{41,61}$/.test(cleaned)) {
      results.push({ type: 'Bitcoin Cash Address', chain: 'BCH', format: 'CashAddr', noBitcoinprefix: true });
    }

    // BSV checks
    if (/^[13][1-9A-HJ-NP-Z]{25,34}$/.test(cleaned)) {
      results.push({ type: 'Bitcoin SV Address', chain: 'BSV', format: 'Base58Check' });
    }

    // Extended keys
    if (/^(xpub|ypub|zpub)[1-9A-HJ-NP-Z]{107,111}$/.test(cleaned)) {
      const keyType = cleaned.slice(0, 4);
      results.push({ type: 'Extended Public Key', keyType, chain: 'BTC', format: 'Base58Check' });
    }

    return {
      input: cleaned,
      detections: results,
      count: results.length,
      primary: results.length > 0 ? results[0] : null
    };
  }
}
