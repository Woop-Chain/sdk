import fetch from 'jest-fetch-mock';
import { woop, checkCalledMethod } from './woop';
import txnJsons from '../fixtures/transactions.json';
import { RPCMethod } from '@woop-js/network';

const messenger = woop.messenger;

interface TransactionInfo {
  blockHash: string;
  index: string;
  blockNumber: string;
}

describe('e2e test transactions by RPC Method', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  const txnHashesFixtures: any = [];
  const transactionInfoList: any = [];
  const { transactions, hashes, blockHashes } = txnJsons;
  // net_*
  it('should test wiki_sendRawTransaction', async () => {
    for(let index = 0; index < transactions.length; index++) {
      fetch.mockResponseOnce(
        JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": hashes[index]}),
      );
      const sent = await messenger.send('wiki_sendRawTransaction', transactions[index].rawTransaction);
      expect(woop.utils.isHash(sent.result)).toEqual(true);
      txnHashesFixtures.push(sent.result);
      expect(checkCalledMethod(index, 'wiki_sendRawTransaction')).toEqual(true);
    }
  });
  it('should test wiki_getTransactionByHash', async () => {
    for(let index: number = 0; index < txnHashesFixtures.length; index++) {
      const txnHash = txnHashesFixtures[index];
      fetch.mockResponseOnce(
        JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "result": {
            "hash": hashes[index],
            "blockHash": blockHashes[index],
            "blockNumber": woop.utils.numberToHex(index),
            "transactionIndex": woop.utils.numberToHex(index),
            "from": transactions[index].senderAddress,
            "gas": transactions[index].gasLimit,
            "gasPrice": transactions[index].gasPrice,
            "input": "0x",
            "nonce": transactions[index].nonce,
            "to": transactions[index].receiverAddressBech32,
            "value": transactions[index].value,
            "v": woop.utils.numberToHex(index),
            "r": woop.utils.numberToHex(index),
            "s": woop.utils.numberToHex(index),
          }
        })
      );
      const txnDetail = await woop.blockchain.getTransactionByHash({
        txnHash
      });
      expect(checkCalledMethod(index, RPCMethod.GetTransactionByHash)).toEqual(true);
      if (txnDetail.result !== null) {
        expect(checkTransactionDetail(txnDetail.result)).toEqual(true);
        expect(txnDetail.result.hash).toEqual(txnHash);

        const transactionInfo = {
          blockHash: txnDetail.result.blockHash,
          blockNumber: txnDetail.result.blockNumber,
          index: txnDetail.result.transactionIndex,
        };
        transactionInfoList.push(transactionInfo);
      } else {
        fail(`txnDetail for ${txnHash} is null`);
      }
    }
  });
  it('should test wiki_getTransactionByBlockHashAndIndex', async () => {
    for (let index: number = 0; index < transactionInfoList.length; index++) {
      fetch.mockResponseOnce((req) => {
        if (!(Buffer.isBuffer(req.body))) {
          fail("POST request body not a buffer");
        }
        const body: any = JSON.parse(req.body.toString());
        // validate that the block hash is as expected
        if (body.params[0] !== blockHashes[index]) {
          fail(`Expected block hash ${blockHashes[index]} but got ${body.params[0]}`);
        }
        // validate that the transaction index is as expected
        let expectedTransactionIndex: string = woop.utils.numberToHex(index);
        if (expectedTransactionIndex !== body.params[1]) {
          fail(`Expected transactionIndex ${expectedTransactionIndex} but got ${body.params[1]}`);
        }
        return Promise.resolve(JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "result": {
            "hash": hashes[index],
            "blockHash": blockHashes[index],
            "blockNumber": woop.utils.numberToHex(index),
            "transactionIndex": woop.utils.numberToHex(index),
            "from": transactions[index].senderAddress,
            "gas": transactions[index].gasLimit,
            "gasPrice": transactions[index].gasPrice,
            "input": "0x",
            "nonce": transactions[index].nonce,
            "to": transactions[index].receiverAddressBech32,
            "value": transactions[index].value,
            "v": woop.utils.numberToHex(index),
            "r": woop.utils.numberToHex(index),
            "s": woop.utils.numberToHex(index),
          }
        }));
      });
      const transactionInfo: TransactionInfo = transactionInfoList[index];
      const txnDetail: any = await woop.blockchain.getTransactionByBlockHashAndIndex({
        blockHash: transactionInfo.blockHash,
        index: transactionInfo.index,
      });
      expect(checkCalledMethod(index, RPCMethod.GetTransactionByBlockHashAndIndex)).toEqual(true);
      if (txnDetail.result !== null) {
        expect(checkTransactionDetail(txnDetail.result)).toEqual(true);
        expect(txnDetail.result.blockHash).toEqual(transactionInfo.blockHash);
        expect(txnDetail.result.transactionIndex).toEqual(transactionInfo.index);
      } else {
        fail(`txnDetail for ${transactionInfo.blockHash}_${transactionInfo.index} is null`);
      }
    }
  });
  it('should test wiki_getTransactionByBlockNumberAndIndex', async () => {
    for (let index: number = 0; index < transactionInfoList.length; index++) {
      fetch.mockResponseOnce((req) => {
        if (!(Buffer.isBuffer(req.body))) {
          fail("POST request body not a buffer");
        }
        const body: any = JSON.parse(req.body.toString());
        // validate that the block number is as expected
        let expectedBlockNumber: string = woop.utils.numberToHex(index);
        if (body.params[0] !== expectedBlockNumber) {
          fail(`Expected block number ${index} but got ${body.params[0]}`);
        }
        // validate that the transaction index is as expected
        let expectedTransactionIndex: string = woop.utils.numberToHex(index);
        if (expectedTransactionIndex !== body.params[1]) {
          fail(`Expected transactionIndex ${expectedTransactionIndex} but got ${body.params[1]}`);
        }
        return Promise.resolve(JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "result": {
            "hash": hashes[index],
            "blockHash": blockHashes[index],
            "blockNumber": woop.utils.numberToHex(index),
            "transactionIndex": woop.utils.numberToHex(index),
            "from": transactions[index].senderAddress,
            "gas": transactions[index].gasLimit,
            "gasPrice": transactions[index].gasPrice,
            "input": "0x",
            "nonce": transactions[index].nonce,
            "to": transactions[index].receiverAddressBech32,
            "value": transactions[index].value,
            "v": woop.utils.numberToHex(index),
            "r": woop.utils.numberToHex(index),
            "s": woop.utils.numberToHex(index),
          }
        }));
      });
      const transactionInfo: TransactionInfo = transactionInfoList[index];
      const txnDetail: any = await woop.blockchain.getTransactionByBlockNumberAndIndex({
        blockNumber: transactionInfo.blockNumber,
        index: transactionInfo.index,
      });
      expect(checkCalledMethod(index, RPCMethod.GetTransactionByBlockNumberAndIndex)).toEqual(true);
      if (txnDetail.result !== null) {
        expect(checkTransactionDetail(txnDetail.result)).toEqual(true);
        expect(txnDetail.result.blockNumber).toEqual(transactionInfo.blockNumber);
        expect(txnDetail.result.transactionIndex).toEqual(transactionInfo.index);
      } else {
        fail(`txnDetail for ${transactionInfo.blockNumber}_${transactionInfo.index} is null`);
      }
    }
  });
  it('should test wiki_getTransactionCountByHash', async () => {
    for (const some of transactionInfoList) {
      fetch.mockResponseOnce(
        JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "0x1"}),
      );
      const transactionInfo: TransactionInfo = some;
      const txnCount: any = await woop.blockchain.getBlockTransactionCountByHash({
        blockHash: transactionInfo.blockHash,
      });
      expect(checkCalledMethod(0, RPCMethod.GetBlockTransactionCountByHash)).toEqual(true);
      expect(woop.utils.isHex(txnCount.result)).toEqual(true);
    }
  });
  it('should test wiki_getTransactionCountByNumber', async () => {
    for (const some of transactionInfoList) {
      fetch.mockResponseOnce(
        JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "0x1"}),
      );
      const transactionInfo: TransactionInfo = some;
      const txnCount: any = await woop.blockchain.getBlockTransactionCountByNumber({
        blockNumber: transactionInfo.blockNumber,
      });
      expect(checkCalledMethod(0, RPCMethod.GetBlockTransactionCountByNumber)).toEqual(true);
      expect(woop.utils.isHex(txnCount.result)).toEqual(true);
    }
  });
  it('should test wiki_getTransactionReceipt', async () => {
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < txnHashesFixtures.length; index += 1) {
      const txnHash = txnHashesFixtures[index];
      fetch.mockResponseOnce(
        JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "result": {
            "contractAddress": null,
            "blockNumber": woop.utils.numberToHex(index),
            "from": transactions[index].senderAddress,
            "gasUsed": woop.utils.numberToHex(index),
            "cumulativeGasUsed": woop.utils.numberToHex(index),
            "logs": [],
            "logsBloom": woop.utils.numberToHex(index),
            "shardID": 0,
            "to": transactions[index].receiverAddress,
            "transactionHash": hashes[index],
            "transactionIndex": woop.utils.numberToHex(index),
            "blockHash": blockHashes[index]
          }
        })
      );
      const receipt: any = await woop.blockchain.getTransactionReceipt({
        txnHash,
      });
      expect(checkCalledMethod(index, RPCMethod.GetTransactionReceipt)).toEqual(true);

      if (receipt.result !== null) {
        expect(checkTransactionReceipt(receipt.result)).toEqual(true);
        expect(woop.crypto.getAddress(receipt.result.from).checksum).toEqual(
          transactions[index].senderAddress,
        );
        expect(woop.crypto.getAddress(receipt.result.to).checksum).toEqual(
          transactions[index].receiverAddress,
        );
        expect(receipt.result.blockHash).toEqual(transactionInfoList[index].blockHash);
        expect(receipt.result.blockNumber).toEqual(transactionInfoList[index].blockNumber);
        expect(receipt.result.transactionIndex).toEqual(transactionInfoList[index].index);
      } else {
        fail(`receipt for ${txnHash} is null`);
      }
    }
  });
  it('should test wiki_getTransactionCount', async () => {
    for (let i = 0; i < transactionInfoList; i += 1) {
      fetch.mockResponseOnce(
        JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "0x1"}),
      );
      const transactionInfo: TransactionInfo = transactionInfoList[i];
      const nonce: any = await woop.blockchain.getTransactionCount({
        address: transactions[i].senderAddressBech32,
        blockNumber: transactionInfo.blockNumber,
      });
      expect(nonce.result).toEqual(transactions[i].nonce);
    }
  });
});

function checkTransactionDetail(data: any) {
  return woop.utils.validateArgs(
    data,
    {
      blockHash: [woop.utils.isHash],
      blockNumber: [woop.utils.isHex],
      // tslint:disable-next-line: no-shadowed-variable
      from: [woop.utils.isValidAddress],
      gas: [woop.utils.isHex],
      gasPrice: [woop.utils.isHex],
      hash: [woop.utils.isHash],
      // tslint:disable-next-line: no-shadowed-variable
      input: [(data: any) => data === '0x' || woop.utils.isHex(data)],
      nonce: [woop.utils.isHex],
      // tslint:disable-next-line: no-shadowed-variable
      to: [(data: any) => data === '0x' || woop.utils.isValidAddress(data)],
      transactionIndex: [woop.utils.isHex],
      value: [woop.utils.isHex],
      v: [woop.utils.isHex],
      r: [woop.utils.isHex],
      s: [woop.utils.isHex],
    },
    {},
  );
}

function checkTransactionReceipt(data: any) {
  return woop.utils.validateArgs(
    data,
    {
      blockNumber: [woop.utils.isHex],
      contractAddress: [
        // tslint:disable-next-line: no-shadowed-variable
        (data: any) => data === null || woop.utils.isValidAddress,
      ],
      cumulativeGasUsed: [woop.utils.isHex],
      from: [woop.utils.isValidAddress],
      gasUsed: [woop.utils.isHex],
      logs: [woop.utils.isArray],
      logsBloom: [woop.utils.isHex],

      shardID: [woop.utils.isNumber],
      // tslint:disable-next-line: no-shadowed-variable
      to: [(data: any) => data === '0x' || woop.utils.isValidAddress],
      transactionHash: [woop.utils.isHash],
      transactionIndex: [woop.utils.isHex],
    },
    { blockHash: [woop.utils.isHash], root: [woop.utils.isHash] },
  );
}
