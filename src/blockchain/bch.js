/**
 * Bitcoin Cash Blockchain Adapter
 */

class BitcoinCashAdapter extends BlockchainAdapter {
  constructor(apiKey = null) {
    super(apiKey, 2);
    this.blockchairUrl = null; // User said NO to Blockchair
    this.explorersUrl = [
      'https://bch.blockdozer.com/api',
      'https://bitcoincash.blockexplorer.com/api'
    ];
  }

  async getAddress(address) {
    for (const baseUrl of this.explorersUrl) {
      try {
        const response = await this._fetch(`${baseUrl}/addr/${address}`);
        if (!response.error) {
          return {
            chain: 'Bitcoin Cash',
            address,
            balance: response.balance,
            unconfirmed: response.unconfirmedBalance,
            txCount: response.totalReceived,
            source: baseUrl,
            timestamp: new Date().toISOString()
          };
        }
      } catch (err) {
        continue; // Try next explorer
      }
    }
    return { error: 'Unable to fetch BCH address data from available explorers' };
  }

  async getTransaction(txHash) {
    for (const baseUrl of this.explorersUrl) {
      try {
        const response = await this._fetch(`${baseUrl}/tx/${txHash}`);
        if (!response.error) {
          return {
            chain: 'Bitcoin Cash',
            txid: response.txid,
            inputs: response.vin ? response.vin.length : 0,
            outputs: response.vout ? response.vout.length : 0,
            value: response.valueOut,
            confirmations: response.confirmations,
            timestamp: response.time,
            blockHeight: response.blockheight,
            source: baseUrl
          };
        }
      } catch (err) {
        continue;
      }
    }
    return { error: 'Unable to fetch BCH transaction data' };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BitcoinCashAdapter;
}
