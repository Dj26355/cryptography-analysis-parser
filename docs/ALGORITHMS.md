# Algorithm Support Guide

## Supported Ciphers & Encodings

### Encoding (Format Conversion)
- **Base64**: Standard Base64 encoding (RFC 4648)
- **Base58**: Bitcoin-style Base58 (no 0, O, I, l)
- **Base32**: RFC 4648 Base32 (A-Z, 2-7)
- **Hexadecimal**: Base16 encoding (0-9, A-F)
- **UTF-8 / ASCII**: Raw text representation
- **Bech32**: Bitcoin SegWit encoding (Bech32 checksums)
- **URL Encoding**: Percent-encoding (%XX format)

### Classical Ciphers (Educational)
- **Caesar Cipher**: Simple character rotation (shift 1-25)
- **ROT13**: Caesar with shift of 13
- **Vigenère**: Polyalphabetic substitution with key
- **Playfair**: Digraph substitution using 5×5 grid
- **Atbash**: Hebrew cipher (reverse alphabet)

### Block Ciphers (Symmetric)
- **AES** (Advanced Encryption Standard)
  - AES-128: 128-bit key
  - AES-192: 192-bit key
  - AES-256: 256-bit key (most secure)
  - Modes: ECB, CBC, CTR, GCM
- **DES**: Data Encryption Standard (64-bit, deprecated)
- **3DES**: Triple DES (192-bit key, legacy)
- **Blowfish**: 64-bit block, variable key (32-448 bits)
- **Twofish**: 128-bit block, 256-bit key (not AES)

### Stream Ciphers (Symmetric)
- **RC4**: Rivest Cipher 4 (variable key, fast but deprecated)
- **Salsa20**: Modern stream cipher (ChaCha predecessor)
- **ChaCha20**: Modern stream cipher (IETF standardized)
- **XChaCha20**: Extended nonce version of ChaCha20

### Cryptographic Hashes (One-Way)
*Note: Hashes CANNOT be decoded - they are one-way functions*
- **MD5**: 128-bit hash (broken, do not use for security)
- **SHA-1**: 160-bit hash (deprecated, collision vulnerabilities)
- **SHA-256**: 256-bit hash (Bitcoin standard, secure)
- **SHA-512**: 512-bit hash (very secure, slow)
- **SHA-3 (Keccak)**: 224/256/384/512-bit (latest standard)
- **BLAKE2**: 256/512-bit (faster than MD5, as secure as SHA-3)
- **RIPEMD-160**: 160-bit (Bitcoin address hashing)
- **Argon2**: Password hashing (memory-hard, recommended)

### Asymmetric Ciphers (Public Key)
- **RSA**: 1024/2048/4096-bit keys
  - RSA-OAEP: With padding (more secure)
  - Supports encryption and digital signatures
- **Elliptic Curve (ECDSA)**: secp256k1, P-256, P-384, P-521
  - Smaller keys (256-bit ≈ 2048-bit RSA)
  - Bitcoin uses secp256k1
- **Diffie-Hellman**: Key exchange protocol
- **ECDH**: Elliptic Curve Diffie-Hellman

### Modern/Authenticated Encryption
- **Fernet**: Symmetric encryption with authentication (AES-CBC + HMAC)
- **NaCl Box**: Elliptic Curve key exchange + stream cipher
- **AES-GCM**: AES with Galois/Counter Mode (authenticated)
- **ChaCha20-Poly1305**: Stream cipher with Poly1305 MAC

## Blockchain-Specific Encodings

### Bitcoin Address Formats
- **P2PKH** (Pay to Public Key Hash): `1...` Base58Check
- **P2SH** (Pay to Script Hash): `3...` Base58Check
- **P2WPKH** (SegWit v0): `bc1q...` Bech32
- **P2WSH** (SegWit Script): `bc1p...` Bech32
- **P2TR** (Taproot): `bc1p...` Bech32m (SegWit v1)

### Bitcoin Keys
- **WIF** (Wallet Import Format): `5...` or `K.../L...` Base58Check
- **Public Key**:
  - Compressed: 33 bytes (02/03 prefix + 32 bytes) = 66 hex chars
  - Uncompressed: 65 bytes (04 prefix + 64 bytes) = 130 hex chars
- **Extended Keys**:
  - `xpub`: Bitcoin mainnet public
  - `ypub`: Nested SegWit public
  - `zpub`: Native SegWit public
  - `tpub`: Bitcoin testnet public
  - Similar with `xprv`, `yprv`, `zprv` for private keys

### Hash Types Used
- **SHA256**: Bitcoin transaction and block hashing (double SHA256)
- **HASH160**: RIPEMD160(SHA256(pubkey)) - address generation
- **RIPEMD160**: Used with SHA256 for address derivation
- **Merkle Root**: SHA256 of all transaction hashes in block
- **Script Hash**: HASH160 of serialized script

## Selecting the Right Algorithm

### For Data Encryption (Choose AES-256)
```
✅ Best: AES-256-GCM (with authentication)
✅ Good: AES-256-CBC (if GCM unavailable)
⚠️ Legacy: 3DES, DES (deprecated)
❌ Avoid: RC4 (broken stream cipher)
```

### For Hashing Passwords (Choose Argon2)
```
✅ Best: Argon2id (memory-hard, GPU-resistant)
✅ Good: bcrypt (proven, slow by design)
✅ Okay: scrypt (memory-hard alternative)
❌ Avoid: MD5, SHA1, SHA256 (too fast for passwords)
```

### For Digital Signatures (Choose ECDSA)
```
✅ Best: ECDSA P-256 or secp256k1 (Bitcoin)
✅ Good: EdDSA with Curve25519
✅ Okay: RSA-2048 or higher
❌ Avoid: DSA (outdated)
```

### For Key Exchange (Choose ECDH)
```
✅ Best: ECDH with Curve25519
✅ Good: ECDH P-256
✅ Okay: Diffie-Hellman 2048-bit+
❌ Avoid: DH < 2048-bit (weak)
```

### For Bitcoin Addresses
```
✅ Best: Bech32 (SegWit, lower fees, better addresses)
✅ Good: P2SH (legacy compatibility)
❌ Avoid: P2PKH (higher fees, larger transactions)
```

## Encoding Detection Rules

The tool auto-detects based on:

| Pattern | Likely Encoding | Confidence |
|---------|-----------------|------------|
| `[A-Za-z0-9+/]*={0,2}` length % 4 == 0 | Base64 | 95% |
| `^[0-9a-fA-F]+$` even length | Hexadecimal | 90% |
| `^[123456789ABC...xyz]+$` | Base58 | 85% |
| `^[A-Z2-7]+=*$` | Base32 | 85% |
| `[a-z0-9]{2,}1[ac-hj-np-z02-9]{39,59}` | Bech32 | 90% |
| `%[0-9A-F]{2}` | URL Encoded | 80% |
| Repeating letters, 10+ chars | Caesar/ROT13 | 60% |

## Algorithm Performance

### Speed Ranking (Fastest to Slowest)
1. **Fastest**: Atbash, ROT13, Caesar
2. **Fast**: RC4, Salsa20, ChaCha20
3. **Medium**: Blowfish, AES (hardware accelerated)
4. **Slow**: Argon2 (intentionally slow for passwords)
5. **Slowest**: RSA with large keys

### Security Ranking (Most to Least Secure)
1. **Most Secure**: AES-256-GCM, ChaCha20-Poly1305, Argon2id
2. **Very Secure**: AES-256-CBC, ECDSA, SHA-3
3. **Secure**: AES-128, SHA-256, Blowfish
4. **Weak**: 3DES, SHA-1, MD5
5. **Broken**: DES, Caesar, ROT13

## Implementation Notes

### Browser Support
- ✅ Base encodings work natively (Base64, Hex, UTF-8)
- ⚠️ Most ciphers require crypto library (TweetNaCl.js, libsodium.js)
- ❌ Heavy algorithms (RSA large keys) may be slow

### Node.js Support
- ✅ Full crypto module (built-in)
- ✅ All algorithms via `crypto` or libraries
- ✅ High performance for large data

### Termux Support
- ✅ Node.js available via package manager
- ✅ All CLI features work
- ⚠️ Limited for browser GUI (use CLI instead)

## Adding New Algorithms

To add a new cipher to the tool:

1. **Add to cryptoCodec.js**:
```javascript
static decodeNewCipher(input, key) {
  // Implementation
  return result;
}
```

2. **Register in decoders**:
```javascript
const decoders = {
  'newcipher': () => this.decodeNewCipher(cleanInput, key)
};
```

3. **Add to UI dropdown** in index.html

4. **Document** in this file

## Resource Links

- [NIST Cryptography Standards](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines/)
- [Bitcoin Script Docs](https://en.bitcoin.it/wiki/Script)
- [Base58Check Encoding](https://en.bitcoin.it/wiki/Base58Check_encoding)
- [BIP 32 HD Wallets](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
- [Cryptography Stack Exchange](https://crypto.stackexchange.com/)
