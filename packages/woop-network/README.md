# @woop-js/network

This package provides a collection of apis to create messengers (HTTP, WebSocket) to connect to blockchain networks.

## Installation

```
npm install @woop-js/network
```

## Usage

```javascript
const { Messenger, HttpProvider, WSProvider } = require('@woop-js/network');
const { ChainID, ChainType } = require('@woop-js/utils');
const testnetHTTP = 'https://rpc.woop.ai';
const testnetWS = 'wss://ws.woop.ai';
const localHTTP = 'http://localhost:9500/';
const localWS = 'http://localhost:9800/';
const http = new HttpProvider(testnetHTTP); // for local use localHTTP
const ws = new WSProvider(testnetWS); // for local use testnetWS
const customHTTPMessenger = new Messenger(http, ChainType.Woop, ChainID.WikiTestnet); // for local ChainID.WikiLocal
const customWSMessenger = new Messenger(ws, ChainType.Woop, ChainID.WikiTestnet); // for local ChainID.WikiLocal
```