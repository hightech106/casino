# luckverse777-backend
 
node version 16.18.1

## Environment Variables

### Solana Deposit Configuration

The following environment variables are required for Solana deposit functionality:

- `SOLANA_DEPOSIT_MNEMONIC` (required): BIP39 mnemonic phrase (12 or 24 words) used for HD wallet derivation. This is used to generate per-user deposit addresses. **Keep this secure and never commit it to version control.**
- `SOLANA_CLUSTER` (optional): Solana cluster name (`mainnet-beta`, `devnet`, `testnet`). Defaults to `mainnet-beta`. Falls back to `NETWORK_URL` if not set.
- `SOLANA_RPC_URL` (optional): Full RPC URL for Solana network. If set, overrides `SOLANA_CLUSTER`. Example: `https://api.mainnet-beta.solana.com`
- `SOLANA_TREASURY_ADDRESS` (required for sweeps): Solana address where swept funds are sent. Used by admin sweep endpoints.
- `SOLANA_USDC_MINT` (optional): USDC mint address. Defaults to mainnet USDC mint (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`) if not set. Can also be fetched from currencies collection.
- `SOLANA_USDT_MINT` (optional): USDT mint address. Defaults to mainnet USDT mint (`Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`) if not set. Can also be fetched from currencies collection.

**Note:** The master mnemonic is never logged or stored in the database. Only derived addresses and derivation indices are stored.