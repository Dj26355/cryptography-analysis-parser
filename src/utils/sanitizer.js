/**
 * Input Sanitization & Security Module
 * Prevents injection attacks and malicious input processing
 */

class Sanitizer {
  /**
   * Remove potentially dangerous characters from input
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>"'`;\\]/g, '') // Remove dangerous chars
      .slice(0, 10000); // Limit length
  }

  /**
   * Safe string for display (HTML escape)
   */
  static escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Detect suspicious encoding patterns (potential malware vectors)
   */
  static detectSuspiciousPatterns(input) {
    const suspicious = [];

    // Check for common malware patterns
    if (/exec|eval|system|shell|cmd|powershell/i.test(input)) {
      suspicious.push('⚠️ Contains code execution keywords');
    }

    // Check for suspicious base64 patterns (embedded executables)
    if (/^[A-Za-z0-9+/]{20,}={0,2}$/.test(input) && input.length > 500) {
      suspicious.push('⚠️ Large base64 blob detected (possible executable)');
    }

    // Check for multiple encoding layers (obfuscation technique)
    const layers = (input.match(/^[A-Za-z0-9+/=]+$/) ? 1 : 0)
                 + (input.match(/^[0-9a-f]+$/) ? 1 : 0)
                 + (input.match(/^[01]+$/) ? 1 : 0);
    if (layers > 1) {
      suspicious.push('⚠️ Multi-layer encoding detected (obfuscation)');
    }

    // Check for null bytes
    if (input.includes('\0')) {
      suspicious.push('🚨 Null bytes detected (critical risk)');
    }

    // Check for extremely long strings
    if (input.length > 100000) {
      suspicious.push('⚠️ Extremely large payload (>100KB)');
    }

    // Check for mixed encoding indicators
    if (/(%[0-9A-F]{2})+.*[A-Za-z0-9+/=]/i.test(input)) {
      suspicious.push('⚠️ URL encoding mixed with other formats');
    }

    return suspicious;
  }

  /**
   * Check if data should be quarantined
   * Returns true if data presents a security risk
   */
  static shouldQuarantine(input, riskLevel = 'high') {
    const patterns = this.detectSuspiciousPatterns(input);
    
    if (riskLevel === 'strict') return patterns.length > 0;
    if (riskLevel === 'high') return patterns.some(p => p.includes('🚨'));
    return false;
  }

  /**
   * Sanitize for safe file operations
   */
  static sanitizeFilename(filename) {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 255);
  }

  /**
   * Remove all sensitive data from results before export
   */
  static stripSensitiveData(data, keepRiskOnly = false) {
    if (typeof data !== 'object') return data;

    const result = JSON.parse(JSON.stringify(data));

    // Remove API keys, private data
    if (result.apiResponses) {
      Object.keys(result.apiResponses).forEach(key => {
        if (result.apiResponses[key].apiKey) {
          delete result.apiResponses[key].apiKey;
        }
      });
    }

    // If keepRiskOnly, remove all non-risky data
    if (keepRiskOnly && result.riskAnalysis) {
      if (!result.riskAnalysis.risks || result.riskAnalysis.risks.length === 0) {
        return { note: 'No risk factors detected' };
      }
      result.clean = false;
    }

    return result;
  }

  /**
   * Validate JSON before parsing
   */
  static safeJSONParse(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      // Validate structure to prevent malformed data
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  }

  /**
   * Create a quarantine record for suspicious data
   */
  static quarantineData(input, reason) {
    return {
      timestamp: new Date().toISOString(),
      status: 'QUARANTINED',
      reason,
      message: '🚨 This data has been quarantined due to security concerns.',
      originalLength: input.length,
      hash: this._quickHash(input),
      actionRequired: 'Manual review recommended',
      nextSteps: [
        'Verify source of data',
        'Scan with dedicated malware tools',
        'Check blockchain explorers directly',
        'Do not execute or process further'
      ]
    };
  }

  /**
   * Quick hash for quarantine record
   */
  static _quickHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}
