/**
 # @woop-js/utils

This package provides a collection of utility apis for unit conversions like `fromWei`, `toWei`, `hexToNumber`, `numberToHex`, `isAddress`, etc.

## Installation

```
npm install @woop-js/utils
```

## Usage

Available units
```
const { Units } = require('@woop-js/utils');

[Units.wei, '1'], // 1 wei
[Units.Kwei, '1000'], // 1e3 wei
[Units.Mwei, '1000000'], // 1e6 wei
[Units.Gwei, '1000000000'], // 1e9 wei
[Units.szabo, '1000000000000'], // 1e12 wei
[Units.finney, '1000000000000000'], // 1e15 wei
[Units.ether, '1000000000000000000'], // 1e18 wei
[Units.woo, '1000000000000000000'], // 1e18 wei
[Units.Kether, '1000000000000000000000'], // 1e21 wei
[Units.Mether, '1000000000000000000000000'], // 1e24 wei
[Units.Gether, '1000000000000000000000000000'], // 1e27 wei
[Units.Tether, '1000000000000000000000000000000'], // 1e30 wei
```

Converting between different units
```javascript
const { Units, Unit, numberToString, add0xToString, fromWei, toWei, numToStr} = require('@woop-js/utils');
const { BN } = require('@woop-js/crypto');

const woo = new Unit('1').asWoo();
const wooToGwei = woo.toGwei();
console.log(wooToGwei);

// numberToString
const num = 123;
const str = numberToString(num)
console.log(str);

// add0xToString
const str = '12345';
const expected = add0xToString(str)
console.log(expected);

// fromWei
const Wei = new BN('1000000000000000000');
const expected = fromWei(Wei, Units.woo);
console.log(expected);

// toWei
const woo = new BN('1');
const expected = toWei(woo, wiki.utils.Units.woo);
const num = numToStr(expected);
console.log(num);
```
 *
 * @packageDocumentation
 * @module woop-utils
 */

export enum ChainType {
  Woop = 'wiki',
  Ethereum = 'eth',
}

export enum ChainID {
  Default = 0,
  EthMainnet = 1,
  Morden = 2,
  Ropsten = 3,
  Rinkeby = 4,
  RootstockMainnet = 30,
  RootstockTestnet = 31,
  Kovan = 42,
  EtcMainnet = 61,
  EtcTestnet = 62,
  Geth = 1337,
  Ganache = 0,
  WikiMainnet = 1,
  WikiTestnet = 2,
  WikiLocal = 2,
  WikiPangaea = 3,
}

/** @hidden */
export const defaultConfig = {
  Default: {
    Chain_ID: ChainID.WikiLocal,
    Chain_Type: ChainType.Woop,
    Chain_URL: 'http://localhost:9500',
    Network_ID: 'Local',
  },
  DefaultWS: {
    Chain_ID: ChainID.WikiLocal,
    Chain_Type: ChainType.Woop,
    Chain_URL: 'ws://localhost:9800',
    Network_ID: 'LocalWS',
  },
};

/** @hidden */
export abstract class WoopCore {
  chainType: ChainType;
  chainId: ChainID;
  constructor(chainType: ChainType, chainId: ChainID = defaultConfig.Default.Chain_ID) {
    this.chainType = chainType;
    this.chainId = chainId;
  }
  get chainPrefix(): string {
    switch (this.chainType) {
      case ChainType.Ethereum: {
        return 'eth';
      }
      case ChainType.Woop: {
        return 'wiki';
      }
      default: {
        return 'wiki';
      }
    }
  }
  get getChainId(): ChainID {
    return this.chainId;
  }
  public setChainId(chainId: ChainID) {
    this.chainId = chainId;
  }
  public setChainType(chainType: ChainType) {
    this.chainType = chainType;
  }
}

/** @hidden */
export const HDPath = `m/44'/1023'/0'/0/`;

/** @hidden */
export const AddressSuffix = '-';
