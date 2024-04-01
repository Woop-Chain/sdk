# Woop JavaScript SDK

[![npm version](https://img.shields.io/npm/v/@woop-js/core.svg?style=flat-square)](https://www.npmjs.com/package/@woop-js/core)
[![Build Status](https://travis-ci.com/FireStack-Lab/Woop-sdk-core.svg?branch=master)](https://travis-ci.com/FireStack-Lab/Woop-sdk-core)

This is the Woop Javascript SDK which provides an easier way to interact with Woop blockchain.

Please read the [documentation](https://jsdoc.woop.ai/) for full API doc.

The SDK includes following packages with package-level documentation and examples inside each package.

1. [@woop-js/core](https://github.com/woop-chain/sdk/tree/main/packages/woop-core)
2. [@woop-js/account](https://github.com/woop-chain/sdk/tree/main/packages/woop-account)
3. [@woop-js/crypto](https://github.com/woop-chain/sdk/tree/main/packages/woop-crypto)
4. [@woop-js/network](https://github.com/woop-chain/sdk/tree/main/packages/woop-network)
5. [@woop-js/utils](https://github.com/woop-chain/sdk/tree/main/packages/woop-utils)
6. [@woop-js/transaction](https://github.com/woop-chain/sdk/tree/main/packages/woop-transaction)
7. [@woop-js/contract](https://github.com/woop-chain/sdk/tree/main/packages/woop-contract)
8. [@woop-js/staking](https://github.com/woop-chain/sdk/tree/main/packages/woop-staking)


# Installation

This library works on both nodejs and browser. Please use it according to your use case.

## Enviorment requirement

* Nodejs: 10.0+
* Browser: Latest Chrome and Firefox

## Install from npm/yarn

**Note: we added a @next tag to npm package, please use the following command to install with npm/yarn**

```bash

# npm
npm install @woop-js/core@next 

# yarn
yarn add @woop-js/core@next

# tslib is required, we'd better install it as well
npm install tslib
yarn add tslib

```

# Building from source files

## Install `lerna` and `typescript` globally

```bash
yarn global add lerna && yarn global add typescript
```
## Bootstrap and build

```bash
yarn bootstrap
```

## Bundle

Build `umd` and `esm` version javascript for each sub-packages, which can be accessed by `import` or `require`

```bash 
yarn dist
```
All files are exported in `packages/dist` folder, use `**.esm.js` or `**.umd.js` format


# Running Tests
## Unit tests
```bash
yarn test:src
```
## e2e tests

1. Remove the `'cross-fetch': 'jest-fetch-mock'` line from `scripts/jest/jest.e2e.config.js`
1. Run woop node locally, follow the instructions: https://github.com/woop-chain/woop  
1. Wait for 1-2 mins, and run this:
```bash
yarn build && yarn test:e2e
```




