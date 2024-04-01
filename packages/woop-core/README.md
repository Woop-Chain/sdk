# @woop-js/core

This package provides a collection of apis to interact with Woop blockchain.

## Installation

```
npm install @woop-js/core
```

## Usage

Create a Woop instance connecting to testnet

```javascript
const { Woop } = require('@woop-js/core');
const {
  ChainID,
  ChainType,
  hexToNumber,
  numberToHex,
  fromWei,
  Units,
  Unit,
} = require('@woop-js/utils');

const wiki = new Woop(
    'https://rpc.woop.ai/',
    {
        chainType: ChainType.Woop,
        chainId: ChainID.WikiTestnet,
    },
);
```

Getting balance of account `woop103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7`
```javascript
wiki.blockchain
  .getBalance({ address: 'woop103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7' })
  .then((response) => {
    console.log('balance in WOOPs: ' + fromWei(hexToNumber(response.result), Units.woop));
  });
```

Getting the latest block number
```javascript
wiki.blockchain.getBlockNumber().then((response) => {
  console.log('current block number: ' + hexToNumber(response.result));
});
```

Getting the block using block hash
```javascript
wiki.blockchain
  .getBlockByHash({
    blockHash: '0x08c46ae7249362a7d1f602d44c5a81f33ebdab6a7dcb6068f99610b57911aafd',
  })
  .then((response) => {
    console.log(response.result);
  });
```

Getting the block using block number
```javascript
wiki.blockchain
  .getBlockByNumber({
    blockNumber: numberToHex(422635),
  })
  .then((response) => {
    console.log(response.result);
  });
```

Getting the transaction using hash
```javascript
wiki.blockchain
  .getTransactionByHash({
    txnHash: '0x56c73eb993b18dc04baacec5c2e9d1292a090f6a978a4a1c461db5255fcbc831',
  })
  .then((response) => {
    console.log(response.result);
  });
```

Getting the transaction receipt
```javascript
wiki.blockchain
  .getTransactionReceipt({
    txnHash: '0x56c73eb993b18dc04baacec5c2e9d1292a090f6a978a4a1c461db5255fcbc831',
  })
  .then((response) => {
    console.log(response.result);
  });
```

Getting the cross-shard transaction receipt
```javascript
wiki.blockchain
  .getCxReceiptByHash({
    txnHash: '0xcd36a90ff5d5373285c2896ba7bbcd3f5324263c0cb8ecfb7cad2f5fc2fbdbda',
    shardID: 1,
  })
  .then((value) => {
    console.log(value.result);
  });
```

Getting the deployed smart contract code
```javascript
wiki.blockchain
  .getCode({
    address: '0x08AE1abFE01aEA60a47663bCe0794eCCD5763c19',
    blockNumber: 'latest',
  })
  .then((response) => {
    console.log(response.result);
  });
```

Getting the transaction count of an account
```javascript
wiki.blockchain
  .getTransactionCount({
    address: 'woop1pdv9lrdwl0rg5vglh4xtyrv3wjk3wsqket7zxy',
  })
  .then((response) => {
    console.log(hexToNumber(response.result));
  });
```

Getting the shard structure and details
```javascript
wiki.blockchain.getShardingStructure().then((response) => {
  console.log(response.result);
});
```

Transferring funds using `sendTransaction`
```javascript
// key corresponds to woop103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7, only has testnet balance
wiki.wallet.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e');

async function transfer() {
  const txn = wiki.transactions.newTx({
    to: 'woop166axnkjmghkf3df7xfvd0hn4dft8kemrza4cd2',
    value: new Unit(1).asWoop().toWei(),
    // gas limit, you can use string
    gasLimit: '21000',
    // send token from shardID
    shardID: 0,
    // send token to toShardID
    toShardID: 0,
    // gas Price, you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
    gasPrice: new wiki.utils.Unit('1').asGwei().toWei(),
  });

  // sign the transaction use wallet;
  const signedTxn = await wiki.wallet.signTransaction(txn);
  const txnHash = await wiki.blockchain.sendTransaction(signedTxn);
  console.log(txnHash.result);
}

transfer();
```