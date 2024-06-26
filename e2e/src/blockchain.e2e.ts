import fetch from 'jest-fetch-mock';
import { woop, checkCalledMethod } from './woop';

import demoAccounts from '../fixtures/testAccount.json';
import { RPCMethod } from '@woop-js/network';

const bc = woop.blockchain;

const testAccount = demoAccounts.Accounts[1];

describe('e2e test blockchain', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  // net_*
  it('should test net_peerCount', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "0x0"}),
    );
    const peerCount = await bc.net_peerCount();
    expect(checkCalledMethod(0, RPCMethod.PeerCount)).toEqual(true);
    expect(woop.utils.isHex(peerCount.result)).toEqual(true);
  });

  it('should test net_version', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "5"}),
    );
    const netVersion = await bc.net_version();
    const versionNumber = parseInt(netVersion.result as string, 10);
    expect(netVersion.result).toEqual(`${versionNumber}`);
    expect(checkCalledMethod(0, RPCMethod.NetVersion)).toEqual(true);
  });
  it('should test wiki_protocolVersion', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "0x10"}),
    );
    const protocolVersion = await bc.getProtocolVersion();
    expect(woop.utils.isHex(protocolVersion.result)).toEqual(true);
    expect(checkCalledMethod(0, RPCMethod.ProtocolVersion)).toEqual(true);
  });

  // block chain info
  it('should test wiki_blockNumber', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "0x10"}),
    );
    const res = await bc.getBlockNumber();
    expect(res.responseType).toEqual('raw');
    expect(woop.utils.isHex(res.result)).toEqual(true);
    expect(checkCalledMethod(0, RPCMethod.BlockNumber)).toEqual(true);
  });

  it('should test wiki_getBlockByNumber', async () => {
    fetch.mockResponse(
      JSON.stringify({
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
          "size": "0x1",
          "difficulty": 5,
          "extraData": "0x",
          "gasLimit": "0x80",
          "gasUsed": "0x40",
          "hash": "0x8a3390ab500Fbca6514eB326d2fcD9B3BFCFbA7DA392593cB4885b8e3399a2D8",
          "logsBloom": "0x0",
          "miner": "woc155jp2y76nazx8uw5sa94fr0m4s5aj8e5xm6fu3",
          "mixHash": "0x3A7c1Ae14AfecFf55Da298F66b75F4FfB771c3EaBDeAa267FF33A77d4d0be220",
          "nonce": 1,
          "number": "0x1",
          "parentHash": "0x7CebC07e456F0bCD09dbc9A6f271074d93E27B40A4C67Dcc402e6513e12B9aF9",
          "receiptsRoot": "0x02B82e11eDC07775Dc6fCF706be2cdAF9165750Ea7bC1B3Eb48ea16Bb3072F4D",
          "stateRoot": "0xAaDc89C8bA4e3fCfC140cFcc8D3efD3BE7a49ab31534A5a3F0E1DEA09aae0f4a",
          "timestamp": "0x62c44c0a",
          "transactionsRoot": "0xc4bfa888fDCC8ca70E2b0CcdCEcc2fF545acCC2D655Ba33DaF4aBc31cFDBd9Ac",
          "uncles": []
        }
      }),
    );
    const res = await bc.getBlockByNumber({ blockNumber: 'latest' });
    const size = res.result.size;
    expect(res.responseType).toEqual('raw');
    expect(woop.utils.isHex(size)).toEqual(true);
    expect(checkBlockData(res.result)).toEqual(true);
    const res2 = await bc.getBlockByNumber({ blockNumber: res.result.number });
    expect(res2.responseType).toEqual('raw');
    expect(woop.utils.isHex(res2.result.size)).toEqual(true);
    expect(checkBlockData(res2.result)).toEqual(true);
    const res3 = await bc.getBlockByNumber({ returnObject: true });
    expect(res3.responseType).toEqual('raw');
    expect(checkBlockData(res3.result)).toEqual(true);
    for(let i = 0; i < 3; i++) {
      expect(checkCalledMethod(i, RPCMethod.GetBlockByNumber)).toEqual(true);
    }
  });

  it('should test wiki_getBlockByHash', async () => {
    fetch.mockResponse(
      JSON.stringify({
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
          "size": "0x1",
          "difficulty": 5,
          "extraData": "0x",
          "gasLimit": "0x80",
          "gasUsed": "0x40",
          "hash": "0x8a3390ab500Fbca6514eB326d2fcD9B3BFCFbA7DA392593cB4885b8e3399a2D8",
          "logsBloom": "0x0",
          "miner": "woc155jp2y76nazx8uw5sa94fr0m4s5aj8e5xm6fu3",
          "mixHash": "0x3A7c1Ae14AfecFf55Da298F66b75F4FfB771c3EaBDeAa267FF33A77d4d0be220",
          "nonce": 1,
          "number": "0x1",
          "parentHash": "0x7CebC07e456F0bCD09dbc9A6f271074d93E27B40A4C67Dcc402e6513e12B9aF9",
          "receiptsRoot": "0x02B82e11eDC07775Dc6fCF706be2cdAF9165750Ea7bC1B3Eb48ea16Bb3072F4D",
          "stateRoot": "0xAaDc89C8bA4e3fCfC140cFcc8D3efD3BE7a49ab31534A5a3F0E1DEA09aae0f4a",
          "timestamp": "0x62c44c0a",
          "transactionsRoot": "0xc4bfa888fDCC8ca70E2b0CcdCEcc2fF545acCC2D655Ba33DaF4aBc31cFDBd9Ac",
          "uncles": []
        }
      }),
    );
    const latestBlock = await bc.getBlockByNumber({ blockNumber: 'latest' });
    const res = await bc.getBlockByHash({ blockHash: latestBlock.result.hash });
    expect(res.responseType).toEqual('raw');
    expect(latestBlock.result.hash).toEqual(res.result.hash);
    expect(woop.utils.isHex(res.result.size)).toEqual(true);
    expect(checkBlockData(res.result)).toEqual(true);
    expect(checkCalledMethod(0, RPCMethod.GetBlockByNumber)).toEqual(true);
    expect(checkCalledMethod(1, RPCMethod.GetBlockByHash)).toEqual(true);
  });

  // account related
  it('should test wiki_getBalance', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "0x10"}),
    );
    const balance = await bc.getBalance({ address: testAccount.Address });
    expect(woop.utils.isHex(balance.result)).toEqual(true);
    expect(checkCalledMethod(0, RPCMethod.GetBalance)).toEqual(true);
  });
});

function checkBlockData(data: any) {
  return woop.utils.validateArgs(
    data,
    {
      difficulty: [woop.utils.isNumber],
      // tslint:disable-next-line: no-shadowed-variable
      extraData: [(data: any) => data === '0x' || woop.utils.isHex(data)],
      gasLimit: [woop.utils.isHex],
      gasUsed: [woop.utils.isHex],
      hash: [woop.utils.isHash],
      logsBloom: [woop.utils.isHex],
      miner: [woop.utils.isBech32Address],
      mixHash: [woop.utils.isHash],
      nonce: [woop.utils.isNumber],
      number: [woop.utils.isHex],
      parentHash: [woop.utils.isHash],
      receiptsRoot: [woop.utils.isHash],
      size: [woop.utils.isHex],
      stateRoot: [woop.utils.isHash],
      timestamp: [woop.utils.isHex],
      transactionsRoot: [woop.utils.isHash],
      uncles: [woop.utils.isArray],
    },
    { transactions: [woop.utils.isArray] },
  );
}