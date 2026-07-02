/**
 * Bitcoin SV Blockchain Adapter
 */

class BitcoinSVAdapter extends BlockchainAdapter {
  constructor(apiKey = null) {
    super(apiKey, 2);
    this.explorersUrl = [
      'https://api.whatsonchain.com/v1/bsv/main',
      'https://bsv.blockscan.com/api'
    ];
  }

  async getAddress(address) {
    for (const baseUrl of this.explorersUrl) {
      try {
        const endpoint = baseUrl.includes('whatsonchain') 
          ? `${baseUrl}/address/${address}/balance`
          : `${baseUrl}/address/${address}`;
        
        const response = await this._fetch(endpoint);
        if (!response.error) {
          return {
            chain: 'Bitcoin SV',
            address,
            balance: response.balance || response.confirmed,
            unconfirmed: response.unconfirmed || 0,
            txCount: response.tx_count || response.transactions,
            source: baseUrl,
            timestamp: new Date().toISOString()
          };
        }
      } catch (err) {
        continue;
      }
    }
    return { error: 'Unable to fetch BSV address data from available explorers' };
  }

  async getTransaction(txHash) {
    for (const baseUrl of this.explorersUrl) {
      try {
        const endpoint = baseUrl.includes('whatsonchain')
          ? `${baseUrl}/tx/${txHash}`
          : `${baseUrl}/tx/${txHash}`;
        
        const response = await this._fetch(endpoint);
        if (!response.error) {
          return {
            chain: 'Bitcoin SV',
            txid: response.txid,
            inputs: response.vin ? response.vin.length : 0,
            outputs: response.vout ? response.vout.length : 0,
            value: response.valueOut || response.value,
            confirmations: response.confirmations,
            timestamp: response.time || response.timestamp,
            blockHeight: response.blockheight || response.block_height,
            source: baseUrl
          };
        }
      } catch (err) {
        continue;
      }
    }
    return { error: 'Unable to fetch BSV transaction data' };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BitcoinSVAdapter;
}
