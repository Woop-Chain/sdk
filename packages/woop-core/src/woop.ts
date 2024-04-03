/**
 * @packageDocumentation
 * @module woop-core
 */

import * as crypto from '@woop-js/crypto';
import * as utils from '@woop-js/utils';

import { Provider, HttpProvider, Messenger, WSProvider, ShardingItem } from '@woop-js/network';
import { TransactionFactory, Transaction } from '@woop-js/transaction';
import { StakingTransaction, StakingFactory } from '@woop-js/staking';
import { ContractFactory, Contract } from '@woop-js/contract';
import { Wallet, Account } from '@woop-js/account';
import { Blockchain } from './blockchain';
import { WoopConfig } from './util';

export class Woop extends utils.WoopCore {
  /**@ignore*/
  Modules = {
    HttpProvider,
    WSProvider,
    Messenger,
    Blockchain,
    TransactionFactory,
    StakingFactory,
    Wallet,
    Transaction,
    StakingTransaction,
    Account,
    Contract,
  };
  /**@ignore*/
  messenger: Messenger;
  /**@ignore*/
  transactions: TransactionFactory;
  /**@ignore*/
  stakings: StakingFactory;
  /**@ignore*/
  wallet: Wallet;
  /**@ignore*/
  blockchain: Blockchain;
  /**@ignore*/
  contracts: ContractFactory;
  /**@ignore*/
  crypto: any;
  /**@ignore*/
  utils: any;
  /**@ignore*/
  defaultShardID?: number;
  /**@ignore*/
  private provider: HttpProvider | WSProvider;

  /**
   * Create a woop instance
   *
   * @param url The end-points of the wiki blockchain
   * @param config set up `ChainID` and `ChainType`, typically we can use the default values
   *
   * @example
   * ```
   * // import or require Woop class
   * const { Woop } = require('@woop-js/core');
   *
   * // import or require settings
   * const { ChainID, ChainType } = require('@woop-js/utils');
   *
   * // Initialize the Woop instance
   * const wiki = new Woop(
   *   // rpc url:
   *   // local: http://localhost:9500
   *   // testnet: https://trpc.woopchain.com/
   *   // mainnet: https:// rpc.woopchain.com/
   *   'http://localhost:9500',
   *   {
   *     // chainType set to Woop
   *     chainType: ChainType.Woop,
   *     // chainType set to WikiLocal
   *     chainId: ChainID.WikiLocal,
   *   },
   * );
   * ```
   */
  constructor(
    url: string,
    config: WoopConfig = {
      chainId: utils.defaultConfig.Default.Chain_ID,
      chainType: utils.defaultConfig.Default.Chain_Type,
    },
  ) {
    super(config.chainType, config.chainId);

    const providerUrl = config.chainUrl || url || utils.defaultConfig.Default.Chain_URL;

    this.provider = new Provider(providerUrl).provider;
    this.messenger = new Messenger(this.provider, this.chainType, this.chainId);
    this.blockchain = new Blockchain(this.messenger);
    this.transactions = new TransactionFactory(this.messenger);
    this.stakings = new StakingFactory(this.messenger);
    this.wallet = new Wallet(this.messenger);
    this.contracts = new ContractFactory(this.wallet);
    this.crypto = crypto;
    this.utils = utils;
    this.defaultShardID = config.shardID;
    if (this.defaultShardID !== undefined) {
      this.setShardID(this.defaultShardID);
    }
  }

  /**
   * Will change the provider for its module.
   *
   * @param provider a valid provider, you can replace it with your own working node
   *
   * @example
   * ```javascript
   * const tmp = wiki.setProvider('http://localhost:9500');
   * ```
   */
  public setProvider(provider: string | HttpProvider | WSProvider): void {
    this.provider = new Provider(provider).provider;
    this.messenger.setProvider(this.provider);
    this.setMessenger(this.messenger);
  }

  /**
   * set the chainID
   * 
   * @hint
   * ```
   * Default = 0,
   * EthMainnet = 1,
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
    WikiPangaea = 3
   * ```
   * @param chainId 
   * 
   * @example
   * ```
   * wiki.setChainId(2);
   * ```
   */
  public setChainId(chainId: utils.ChainID) {
    this.chainId = chainId;
    this.messenger.setChainId(this.chainId);
    this.setMessenger(this.messenger);
  }

  /**
   * Change the Shard ID
   *
   * @example
   * ```
   * wiki.setShardID(2);
   * ```
   */
  public setShardID(shardID: number) {
    this.defaultShardID = shardID;
    this.messenger.setDefaultShardID(this.defaultShardID);
    this.setMessenger(this.messenger);
  }

  /**
   * set the chainType
   *
   * @param chainType `wiki` or `eth`
   *
   * @example
   * ```
   * // set chainType to wiki
   * wiki.setChainType('wiki');
   * // set chainType to eth
   * wiki.setChainType('eth');
   * ```
   */
  public setChainType(chainType: utils.ChainType) {
    this.chainType = chainType;
    this.messenger.setChainType(this.chainType);
    this.setMessenger(this.messenger);
  }

  /**
   * Set the sharding Structure
   *
   * @param shardingStructures The array of information of sharding structures
   *
   * @example
   * ```javascript
   * wiki.shardingStructures([
   *   {"current":true,"http":"http://127.0.0.1:9500",
   *    "shardID":0,"ws":"ws://127.0.0.1:9800"},
   *   {"current":false,"http":"http://127.0.0.1:9501",
   *    "shardID":1,"ws":"ws://127.0.0.1:9801"}
   * ]);
   * ```
   */
  public shardingStructures(shardingStructures: ShardingItem[]) {
    for (const shard of shardingStructures) {
      const shardID =
        typeof shard.shardID === 'string' ? Number.parseInt(shard.shardID, 10) : shard.shardID;
      this.messenger.shardProviders.set(shardID, {
        current: shard.current !== undefined ? shard.current : false,
        shardID,
        http: shard.http,
        ws: shard.ws,
      });
    }
    this.setMessenger(this.messenger);
  }

  /**@ignore*/
  private setMessenger(messenger: Messenger) {
    this.blockchain.setMessenger(messenger);
    this.wallet.setMessenger(messenger);
    this.transactions.setMessenger(messenger);
    this.stakings.setMessenger(messenger);
  }
}
