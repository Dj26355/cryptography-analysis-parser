/**
 * Blockchain API Adapters
 * Generic interface for multiple blockchain explorers
 */

class BlockchainAdapter {
  constructor(apiKey = null, rateLimit = 2) {
    this.apiKey = apiKey;
    this.rateLimit = rateLimit; // requests per second
    this.lastRequest = 0;
  }

  /**
   * Rate limit enforcement
   */
  async _rateLimit() {
    const now = Date.now();
    const elapsed = now - this.lastRequest;
    const minDelay = 1000 / this.rateLimit;
    
    if (elapsed < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
    }
    
    this.lastRequest = Date.now();
  }

  /**
   * Fetch with error handling
   */
  async _fetch(url, options = {}) {
    await this._rateLimit();
    
    try {
      const response = await fetch(url, {
        timeout: 10000,
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err) {
      return { error: err.message, url };
    }
  }

  /**
   * Get address info (stub - implement in subclasses)
   */
  async getAddress(address) {
    throw new Error('Not implemented in base class');
  }

  /**
   * Get transaction info
   */
  async getTransaction(txHash) {
    throw new Error('Not implemented in base class');
  }

  /**
   * Get block info
   */
  async getBlock(blockHash) {
    throw new Error('Not implemented in base class');
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlockchainAdapter;
}
