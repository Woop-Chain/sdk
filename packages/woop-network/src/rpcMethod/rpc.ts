/**
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
const testnetHTTP = 'https://trpc.woopchain.com';
const testnetWS = 'wss://tws.woopchain.com';
const localHTTP = 'http://localhost:9500/';
const localWS = 'http://localhost:9800/';
const http = new HttpProvider(testnetHTTP); // for local use localHTTP
const ws = new WSProvider(testnetWS); // for local use testnetWS
const customHTTPMessenger = new Messenger(http, ChainType.Woop, ChainID.WikiTestnet); // for local ChainID.WikiLocal
const customWSMessenger = new Messenger(ws, ChainType.Woop, ChainID.WikiTestnet); // for local ChainID.WikiLocal
```
 *
 * @packageDocumentation
 * @module woop-network
 */

/**@ignore */
export enum RPCMethod {
  // 1. wiki_getBlockByHash
  GetBlockByHash = 'wiki_getBlockByHash',
  // 2. wiki_getBlockByNumber
  GetBlockByNumber = 'wiki_getBlockByNumber',
  // 3. wiki_getBlockTransactionCountByHash
  GetBlockTransactionCountByHash = 'wiki_getBlockTransactionCountByHash',
  // 4. wiki_getBlockTransactionCountByNumber
  GetBlockTransactionCountByNumber = 'wiki_getBlockTransactionCountByNumber',
  // 5. wiki_getCode
  GetCode = 'wiki_getCode',
  // 6. wiki_getTransactionByBlockHashAndIndex
  GetTransactionByBlockHashAndIndex = 'wiki_getTransactionByBlockHashAndIndex',
  // 7. wiki_getTransactionByBlockNumberAndIndex
  GetTransactionByBlockNumberAndIndex = 'wiki_getTransactionByBlockNumberAndIndex',
  // 8. wiki_getTransactionByHash
  GetTransactionByHash = 'wiki_getTransactionByHash',

  GetTransactionReceipt = 'wiki_getTransactionReceipt',

  GetCXReceiptByHash = 'wiki_getCXReceiptByHash',
  // 9. wiki_syncing
  Syncing = 'wiki_syncing',
  // 10. net_peerCount
  PeerCount = 'net_peerCount',

  // 11. wiki_getBalance
  GetBalance = 'wiki_getBalance',
  // 12. wiki_getStorageAt
  GetStorageAt = 'wiki_getStorageAt',
  // 13. wiki_getTransactionCount
  GetTransactionCount = 'wiki_getTransactionCount',
  // 14. wiki_sendTransaction
  SendTransaction = 'wiki_sendTransaction',
  // 15. wiki_sendRawTransaction
  SendRawTransaction = 'wiki_sendRawTransaction',
  // 16. wiki_subscribe
  Subscribe = 'wiki_subscribe',
  // 17. wiki_getlogs
  GetPastLogs = 'wiki_getLogs',
  // 18. wiki_getWork
  GetWork = 'wiki_getWork',
  // 19. wiki_submitWork
  // SubmitWork = 'wiki_submitWork',
  // 20. wiki_getProof
  GetProof = 'wiki_getProof',
  // 21, wiki_getFilterChanges
  GetFilterChanges = 'wiki_getFilterChanges',
  // 22. wiki_newPendingTransactionFilter
  NewPendingTransactionFilter = 'wiki_newPendingTransactionFilter',
  // 23. wiki_newBlockFilter
  NewBlockFilter = 'wiki_newBlockFilter',
  // 24. wiki_newFilter
  NewFilter = 'wiki_newFilter',
  // 25. wiki_call
  Call = 'wiki_call',
  // 26. wiki_estimateGas
  EstimateGas = 'wiki_estimateGas',
  // 27. wiki_gasPrice
  GasPrice = 'wiki_gasPrice',
  // 28. wiki_blockNumber
  BlockNumber = 'wiki_blockNumber',
  // 29. wiki_unsubscribe
  UnSubscribe = 'wiki_unsubscribe',
  // 30. net_version
  NetVersion = 'net_version',
  // 31. wiki_protocolVersion
  ProtocolVersion = 'wiki_protocolVersion',
  // 32. wiki_getShardingStructure
  GetShardingStructure = 'wiki_getShardingStructure',
  // 33. wiki_sendRawStakingTransaction
  SendRawStakingTransaction = 'wiki_sendRawStakingTransaction',
  // 34. wiki_getAccountNonce
  GetAccountNonce = 'wiki_getAccountNonce',
  // 35. wiki_getBlocks
  GetBlocks = 'wiki_getBlocks',
}

/**@ignore */
export enum RPCErrorCode {
  // Standard JSON-RPC 2.0 errors
  // RPC_INVALID_REQUEST is internally mapped to HTTP_BAD_REQUEST (400).
  // It should not be used for application-layer errors.
  RPC_INVALID_REQUEST = -32600,
  // RPC_METHOD_NOT_FOUND is internally mapped to HTTP_NOT_FOUND (404).
  // It should not be used for application-layer errors.
  RPC_METHOD_NOT_FOUND = -32601,
  RPC_INVALID_PARAMS = -32602,
  // RPC_INTERNAL_ERROR should only be used for genuine errors in bitcoind
  // (for example datadir corruption).
  RPC_INTERNAL_ERROR = -32603,
  RPC_PARSE_ERROR = -32700,

  // General application defined errors
  RPC_MISC_ERROR = -1, // std::exception thrown in command handling
  RPC_TYPE_ERROR = -3, // Unexpected type was passed as parameter
  RPC_INVALID_ADDRESS_OR_KEY = -5, // Invalid address or key
  RPC_INVALID_PARAMETER = -8, // Invalid, missing or duplicate parameter
  RPC_DATABASE_ERROR = -20, // Database error
  RPC_DESERIALIZATION_ERROR = -22, // Error parsing or validating structure in raw format
  RPC_VERIFY_ERROR = -25, // General error during transaction or block submission
  RPC_VERIFY_REJECTED = -26, // Transaction or block was rejected by network rules
  RPC_IN_WARMUP = -28, // Client still warming up
  RPC_METHOD_DEPRECATED = -32, // RPC method is deprecated
}
