/**
 * Bitcoin Blockchain Adapter
 * Uses Blockchain.com and BlockCypher APIs
 */

class BitcoinAdapter extends BlockchainAdapter {
  constructor(apiKey = null, useBlockchain = true, useBlockCypher = true) {
    super(apiKey, 2);
    this.useBlockchain = useBlockchain;
    this.useBlockCypher = useBlockCypher;
    this.blockchainUrl = 'https://blockchain.info/q';
    this.blockCypherUrl = 'https://api.blockcypher.com/v1/btc/main';
  }

  /**
   * Get address information
   */
  async getAddress(address) {
    const results = {};

    if (this.useBlockchain) {
      results.blockchain = await this._fetchBlockchain(address);
    }

    if (this.useBlockCypher) {
      results.blockCypher = await this._fetchBlockCypher(address);
    }

    return this._mergeResults(results, address);
  }

  /**
   * Blockchain.com API
   */
  async _fetchBlockchain(address) {
    try {
      const response = await this._fetch(
        `${this.blockchainUrl}/addressbalance?address=${address}&confirmations=0`
      );
      return {
        source: 'Blockchain.com',
        balance: response,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return { error: err.message, source: 'Blockchain.com' };
    }
  }

  /**
   * BlockCypher API
   */
  async _fetchBlockCypher(address) {
    try {
      const response = await this._fetch(
        `${this.blockCypherUrl}/addrs/${address}/balance`
      );
      return {
        source: 'BlockCypher',
        balance: response.balance,
        unconfirmed: response.unconfirmed_balance,
        txCount: response.total_received,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return { error: err.message, source: 'BlockCypher' };
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(txHash) {
    try {
      const url = `https://blockchain.info/rawtx/${txHash}?format=json`;
      const response = await this._fetch(url);
      
      return {
        source: 'Blockchain.com',
        txid: response.hash,
        inputs: response.inputs ? response.inputs.length : 0,
        outputs: response.out ? response.out.length : 0,
        value: response.total,
        fees: response.fee,
        confirmations: response.confirmations,
        timestamp: response.time,
        blockHeight: response.block_height,
        inputAddresses: response.inputs ? response.inputs.map(i => i.prev_out?.addr).filter(Boolean) : [],
        outputAddresses: response.out ? response.out.map(o => o.addr).filter(Boolean) : []
      };
    } catch (err) {
      return { error: err.message };
    }
  }

  /**
   * Merge results from multiple APIs
   */
  _mergeResults(results, address) {
    return {
      chain: 'Bitcoin',
      address,
      sources: results,
      merged: {
        balance: this._extractBalance(results),
        txCount: this._extractTxCount(results),
        lastSeen: this._extractLastSeen(results)
      }
    };
  }

  _extractBalance(results) {
    if (results.blockchain && results.blockchain.balance) return results.blockchain.balance;
    if (results.blockCypher && results.blockCypher.balance) return results.blockCypher.balance;
    return null;
  }

  _extractTxCount(results) {
    if (results.blockCypher && results.blockCypher.txCount) return results.blockCypher.txCount;
    return null;
  }

  _extractLastSeen(results) {
    return results.timestamp || new Date().toISOString();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BitcoinAdapter;
}
