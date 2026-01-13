/**
 * Blockchain utility for interacting with EOS blockchain.
 * Fetches public seeds from the EOS blockchain for provably fair game randomness.
 * Uses the last irreversible block hash as a verifiable random source.
 */
import { JsonRpc } from 'eosjs';
import fetch from 'node-fetch';
import { httpProviderApi } from '../config/static';
const rpc = new JsonRpc(httpProviderApi, { fetch });

export const getPublicSeed = async (): Promise<string> => {
  try {
    const info = await rpc.get_info();
    const blockNumber = info.last_irreversible_block_num + 1;
    const block = await rpc.get_block(blockNumber || 1);
    return block.id;
  } catch (error) {
    console.error("Error getPublicSeed => ", error);
    return '';
  }
};
