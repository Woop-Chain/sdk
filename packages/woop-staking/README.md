# @woop-js/staking

This package provides a collection of apis to create, sign/send staking transaction, and receive confirm/receipt.

## Installation

```
npm install @woop-js/staking
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
    'https://trpc.woopchain.com/',
    {
        chainType: ChainType.Woop,
        chainId: ChainID.WikiTestnet,
    },
);
```
Below, examples show how to send delegate, undelegate, and collect rewards staking transactions. First, set the chainId, gasLimit, gasPrice for all subsequent staking transactions
```javascript
wiki.stakings.setTxParams({
  gasLimit: 25000,
  gasPrice: numberToHex(new wiki.utils.Unit('1').asGwei().toWei()),
  chainId: 2
});
```
<span style="color:red">Note: create and edit validator transactions are not fully supported in the sdk</span>

Create delegate staking transaction
```javascript
const delegate = wiki.stakings.delegate({
  delegatorAddress: 'woc103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7',
  validatorAddress: 'woc1vfqqagdzz352mtvdl69v0hw953hm993n6v26yl',
  amount: numberToHex(new Unit(1000).asWoc().toWei())
});
const delegateStakingTx = delegate.build();
```

Sign and send the delegate transaction and receive confirmation
```javascript
// key corresponds to woc103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7, only has testnet balance
wiki.wallet.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e');

wiki.wallet.signStaking(delegateStakingTx).then(signedTxn => {
  signedTxn.sendTransaction().then(([tx, hash]) => {
    console.log(hash);
    signedTxn.confirm(hash).then(response => {
      console.log(response.receipt);
    });
  });
});
```

Similarily, undelegate and collect reward transactions can be composed, signed and sent
Create undelegate staking transaction
```javascript
const undelegate = wiki.stakings.undelegate({
  delegatorAddress: 'woc103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7',
  validatorAddress: 'woc1vfqqagdzz352mtvdl69v0hw953hm993n6v26yl',
  amount: numberToHex(new Unit(1000).asWoc().toWei())
});
const undelegateStakingTx = undelegate.build();
```

Create collect rewards staking transaction
```javascript
const collectRewards = wiki.stakings.collectRewards({
  delegatorAddress: 'woc103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'
});
const collectRewardsStakingTx = collectRewards.build();
```

Also, similar to normal transaction, signing and sending can be performed asynchronously.