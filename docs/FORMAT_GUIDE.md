# Format Guide - Hash & Address Identification

## Quick Reference Table

| Format | Example | Length | Type | Chain |
|--------|---------|--------|------|-------|
| **HASH160** | `a1c...3a2b` | 40 hex | Hash | Bitcoin |
| **SHA256** | `5a0c...1234` | 64 hex | Hash | Any |
| **Hash160** | `1A1z7agoat...` | 26-35 B58 | Address | BTC |
| **P2PKH** | `1...` | Base58Check | Address | BTC |
| **P2SH** | `3...` | Base58Check | Address | BTC |
| **Bech32** | `bc1qw508d...` | 39-59 chars | Address | BTC SegWit |
| **zpub** | `zpub1234...` | 111+ chars | Key | BTC SegWit |
| **xpub** | `xpub1234...` | 111+ chars | Key | BTC Legacy |
| **WIF** | `5J4nSLqBRz...` | 51 B58 | Private Key | BTC |
| **BCH Address** | `bitcoincash:q...` | - | Address | BCH |
| **BSV Address** | `q...` or `p...` | - | Address | BSV |
| **TX Hash** | `0000000...` | 64 hex | Transaction | Any |
| **Block Hash** | `0000000...` | 64 hex | Block | Any |

## Bitcoin Address Formats

### P2PKH (Pay to Public Key Hash)
- **Format**: Base58Check with version byte `0x00`
- **Prefix**: `1` (always starts with 1)
- **Length**: 26-35 characters
- **Example**: `1A1z7agoat2YMCj1K7c5gzYY2Pg4BXXJv`
- **Age**: Original Bitcoin address format (2009)
- **Fees**: Standard (not optimized)
- **Privacy**: Each address can be linked to one payment

**How it works**:
```
Private Key → Public Key → SHA256 → RIPEMD160 → Base58Check → Address
```

### P2SH (Pay to Script Hash)
- **Format**: Base58Check with version byte `0x05`
- **Prefix**: `3` (always starts with 3)
- **Length**: 26-35 characters (same as P2PKH)
- **Example**: `3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy`
- **Age**: Introduced 2012 (BIP 16)
- **Use Case**: Multisignature, escrow, complex conditions
- **Privacy**: Hides script details until spent

**How it works**:
```
RedeemScript → SHA256 → RIPEMD160 → Base58Check (version 0x05) → Address
```

### P2WPKH (Pay to Witness Public Key Hash) - SegWit v0
- **Format**: Bech32 encoding
- **Prefix**: `bc1q` (on mainnet)
- **Length**: 42 characters
- **Example**: `bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4`
- **Age**: Introduced 2017 (BIP 141 - SegWit)
- **Fees**: ~40% lower than P2PKH
- **Blockchain**: Smaller transactions
- **Privacy**: No better or worse than P2PKH

**How it works**:
```
Public Key → SHA256 → RIPEMD160 → Bech32 → Address
```

### P2WSH (Pay to Witness Script Hash) - SegWit v0
- **Format**: Bech32 encoding
- **Prefix**: `bc1q` (on mainnet)
- **Length**: 62 characters
- **Example**: `bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3`
- **Use Case**: Multisig, complex scripts with SegWit
- **Fees**: Lower than P2SH

### P2TR (Pay to Taproot) - SegWit v1
- **Format**: Bech32m encoding
- **Prefix**: `bc1p` (on mainnet)
- **Length**: 62 characters
- **Example**: `bc1pgellvvxjcrhypzx8ggvvx2h9kxvxy8dd0yewt3yy7ytsyuga3hqsxf3q8c`
- **Age**: Introduced 2021 (BIP 340/341/342)
- **Upgrade**: Privacy enhanced, script hidden
- **Fees**: Lowest of all formats
- **Privacy**: Best for on-chain privacy

**How it works**:
```
Taproot Output Key → Bech32m → Address
```

## Hash Identification

### HASH160 (160-bit / 20 bytes)
- **Hex Length**: 40 characters
- **Encoding**: Hexadecimal
- **Full Name**: RIPEMD160(SHA256(data))
- **Uses**:
  - Bitcoin address generation (P2PKH, P2SH)
  - Script hashing
  - Legacy opcodes
- **Example**: `76a9147f9b1a7fb68d6534bb2525650c2f6ba410d19b5288ac`
- **Collision Resistance**: Strong (but SHA1-like weakness)

**Detecting HASH160**:
- Always 40 hex characters
- No version prefix (unlike addresses which are Base58Check)
- Common in blockchain scripts

### SHA256 (256-bit / 32 bytes)
- **Hex Length**: 64 characters
- **Encoding**: Hexadecimal or Double SHA256 for Bitcoin
- **Uses**:
  - Bitcoin transaction hashing (TXID)
  - Block header hashing
  - Merkle tree hashing
  - General-purpose cryptography
- **Example (TXID)**: `5a0c1b5d4e3f2a1b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6`
- **Collision Resistance**: Cryptographically secure (no known attacks)

**Detecting SHA256**:
- Exactly 64 hex characters
- Used for TXIDs in blockchain explorers
- Block hashes are also SHA256

### MD5 (128-bit / 16 bytes)
- **Hex Length**: 32 characters
- **Encoding**: Hexadecimal
- **Uses**: Legacy checksums, deprecated cryptography
- **Example**: `098f6bcd4621d373cade4e832627b4f6`
- **⚠️ WARNING**: Cryptographically broken, do NOT use for security

**Detecting MD5**:
- Exactly 32 hex characters
- Only length distinguishes from SHA1/RIPEMD160 (40 chars)

### SHA-1 (160-bit / 20 bytes)
- **Hex Length**: 40 characters
- **Encoding**: Hexadecimal
- **Uses**: Legacy systems, Git commits, SSL certificates
- **Example**: `356a192b7913b04c54574d18c28d46e6395428ab`
- **⚠️ WARNING**: Collision attacks demonstrated (SHAttered)

**Detecting SHA-1**:
- Exactly 40 hex characters (ambiguous with HASH160, Ripemd160)
- Cannot be distinguished from other 160-bit hashes by format alone

### RIPEMD160 (160-bit / 20 bytes)
- **Hex Length**: 40 characters
- **Encoding**: Hexadecimal
- **Uses**: Bitcoin address generation with SHA256
- **Format**: RIPEMD160(SHA256(pubkey))
- **Example**: `76a91476a04053bda5c88f2db1002ad94e8042f606f06688ac`

**Detecting RIPEMD160**:
- Exactly 40 hex characters
- Context: Found in P2PKH and P2SH script operations
- Often prefixed with OP codes (76a914 in scripts)

### SHA-512 (512-bit / 64 bytes)
- **Hex Length**: 128 characters
- **Encoding**: Hexadecimal
- **Uses**: HMAC, key derivation, Bitcoin seed hashing
- **Example**: `8b1a9953c4611296aeed9510b96b9242f4d2c7f... (128 chars)`
- **Collision Resistance**: Extremely strong

**Detecting SHA-512**:
- Exactly 128 hex characters
- Uniquely identifiable by length

### BLAKE2 (256-bit or 512-bit)
- **Hex Length**: 64 (BLAKE2-256) or 128 (BLAKE2-512) characters
- **Encoding**: Hexadecimal
- **Uses**: Fast modern hashing, Zcash, alternative to SHA-3
- **Speed**: Faster than MD5, more secure than SHA-2

**Detecting BLAKE2**:
- Either 64 or 128 hex characters
- Context: Zcash uses BLAKE2b-512

## Extended Keys (BIP 32 Hierarchical Deterministic)

### xpub (Bitcoin Legacy HD Public Key)
- **Format**: Base58Check with version `0x0488B21E`
- **Length**: 111-112 characters
- **Prefix**: `xpub` (always)
- **Depth**: Can derive multiple levels of child keys
- **Example**: `xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8`

### ypub (Nested SegWit HD Public Key)
- **Format**: Similar to xpub but for P2SH-P2WPKH
- **Prefix**: `ypub`
- **Use Case**: Nested SegWit addresses (bc1 wrapped in 3...)

### zpub (Native SegWit HD Public Key)
- **Format**: Similar to xpub but for P2WPKH
- **Prefix**: `zpub`
- **Use Case**: Native SegWit addresses (bc1q...)

### tpub (Bitcoin Testnet HD Public Key)
- **Format**: Same as xpub but for testnet
- **Prefix**: `tpub`
- **Use Case**: Testing HD wallets on testnet

**Deriving Addresses from xpub/zpub/ypub**:
```
1. Import extended public key
2. Apply BIP44/BIP49/BIP84 derivation path
3. Generate child public keys
4. Hash to get addresses
```

## WIF (Wallet Import Format)

### Uncompressed Private Key
- **Format**: Base58Check with version `0x80` + 32 bytes private key
- **Length**: 51 characters
- **Prefix**: `5` (always)
- **Example**: `5J4nSLqBRz5SMj3nZkP73SCSxtCQrDJW5TWvWjgqHkYt3LP8jx6`
- **Imports**: Full uncompressed public key representation

### Compressed Private Key
- **Format**: Base58Check with version `0x80` + 32 bytes private key + `0x01` suffix
- **Length**: 52 characters
- **Prefix**: `K` or `L` (always)
- **Example**: `Kwr371tjA9u9aZLt4Uok6f6sCLiBycp4J1DFeJAks8rzt9vzcWz1` (K/L)
- **Imports**: Compressed public key representation (33 bytes)

**Why Two Formats?**:
- **Compressed (K/L)**: Saves ~50% blockchain space
- **Uncompressed (5)**: Full public key info (legacy)
- **Modern Best Practice**: Always use compressed

⚠️ **SECURITY WARNING**: Never share WIF keys! They are private keys.

## Bitcoin Cash Addresses

### CashAddr Format
- **Format**: Native: `q...` or `p...` (42 chars) | With prefix: `bitcoincash:q...`
- **Encoding**: Base32 with checksum
- **Mainnet**: `bitcoincash:` prefix
- **Testnet**: `bchtest:` prefix
- **Example**: `bitcoincash:qpm2qsznhks23z7629mms6s4fsru2hs3ye6wpel46`
- **Advantage**: Clear chain identification, better error detection

### Legacy Bitcoin Format (for BCH)
- **Same as Bitcoin P2PKH/P2SH**: `1...` or `3...`
- **Issue**: Can't distinguish from BTC visually
- **Modern**: BCH community uses CashAddr exclusively

## Bitcoin SV Addresses

### WhatsOnChain Format
- **Format**: Similar to Bitcoin Cash CashAddr
- **Prefixes**: `bitcoinsv:` (mainnet) or similar
- **Compatibility**: Attempts Bitcoin compatibility

## Detection Strategy

1. **Check Length First** (fastest filtering)
2. **Check Prefix** (P2PKH=1, P2SH=3, Bech32=bc1, etc.)
3. **Validate Checksum** (Base58Check or Bech32)
4. **Determine Context** (hash vs address vs key)
5. **Identify Chain** (BTC vs BCH vs BSV)

## Encoding Recognition

### Base58Check (Bitcoin addresses & keys)
- **Alphabet**: `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz` (58 chars)
- **Checksum**: 4-byte double SHA256 at end
- **Format**: `[version][data][checksum]`
- **Validation**: Recompute checksum and compare

### Bech32 (SegWit addresses)
- **Alphabet**: `qpzry9x8gf2tvdw0s3jn54khce6mua7l` (32 chars)
- **Checksum**: BCH error-correcting code
- **Separator**: Last occurrence of `1`
- **Format**: `[hrp]1[data with checksum]`
- **hrp values**: `bc` (Bitcoin), `tb` (testnet), etc.

### Bech32m (Taproot addresses)
- **Difference**: Different checksum constant than Bech32
- **Used for**: SegWit v1+ (Taproot)
- **Validation**: Requires Bech32m, not Bech32

## Tool Recommendations

Use **this tool** to:
- ✅ Identify any hash or address format
- ✅ Find mathematical equivalents
- ✅ Get chain identification
- ✅ Validate format correctness
- ✅ Extract metadata

Use **blockchain explorers** for:
- Current balance/transactions (blockchain.info, blockchair.com)
- Real-time network data
- History and confirmations

Use **wallet software** for:
- Private key import/export
- Address generation and management
- Transaction signing

## Common Mistakes

❌ **Confusing HASH160 with SHA256**
- HASH160: 40 hex chars, specific Bitcoin use
- SHA256: 64 hex chars, general use

❌ **Mixing BTC and BCH addresses**
- BTC: P2PKH (1...), P2SH (3...), Bech32 (bc1...)
- BCH: CashAddr (bitcoincash:q.../p...)
- Both can use 1.../3... but should verify first

❌ **Assuming all 40-char hashes are SHA-1**
- Could be HASH160, SHA-1, or RIPEMD160
- Need context to distinguish

❌ **Sending to wrong chain**
- Always verify address format matches intended chain
- Tool will warn about mismatches

❌ **Sharing WIF keys**
- Private keys (5... or K.../L...) should NEVER be shared
- Only share public addresses (1..., 3..., bc1...)

## References

- [Bitcoin Addresses - Bitcoin Wiki](https://en.bitcoin.it/wiki/Address)
- [BIP 32 - Hierarchical Deterministic Wallets](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
- [BIP 44 - Multi-Account Hierarchy](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
- [BIP 141 - Segregated Witness](https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki)
- [Bitcoin Cash Address Format](https://bitcoincashorg.github.io/bitcoincash.org/spec/cashaddr/)
