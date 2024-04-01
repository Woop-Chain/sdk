/**
 * @packageDocumentation
 * @module woop-core
 */

import {
  HttpProvider,
  WSProvider,
  Messenger,
  Provider,
  RPCMethod,
  ShardingItem,
} from '@woop-js/network';

import * as crypto from '@woop-js/crypto';
import * as utils from '@woop-js/utils';

import { Transaction, TransactionFactory } from '@woop-js/transaction';
import { Blockchain } from './blockchain';
import { ContractFactory } from '@woop-js/contract';
import { WoopConfig } from './util';

/** @hidden */
export enum ExtensionType {
  MathWallet = 'MathWallet',
  WoopWallet = 'WoopWallet',
}

/** @hidden */
export interface ExtensionAccount {
  address: 'string';
  name: 'string';
}

/** @hidden */
export interface ExtensionNetwork {
  chain_url: string;
  net_version: number;
}

/** @hidden */
export interface ExtensionInterface {
  signTransaction: (
    transaction: Transaction,
    updateNonce: boolean,
    encodeMode: string,
    blockNumber: string,
  ) => Promise<Transaction>;
  getAccount: () => Promise<ExtensionAccount>;
  forgetIdentity: () => Promise<void>;
  messenger?: Messenger;
  version: string;
  isMathWallet?: boolean;
  isWoopWallet?: boolean;
  network: ExtensionNetwork;
}

export class WoopExtension {
  /**@ignore*/
  extensionType: ExtensionType | null;
  /**@ignore*/
  wallet: ExtensionInterface;
  /**@ignore*/
  provider: HttpProvider | WSProvider;
  /**@ignore*/
  messenger: Messenger;
  /**@ignore*/
  blockchain: Blockchain;
  /**@ignore*/
  transactions: TransactionFactory;
  /**@ignore*/
  contracts: ContractFactory;
  /**@ignore*/
  crypto: any;
  /**@ignore*/
  utils: any;
  /**@ignore*/
  defaultShardID?: number;

  /**
   * Create an blockchain instance support wallet injection
   *
   * @param wallet could be MathWallet or WoopWallet instance
   * @param config (optional), using default `Chain_Id` and `Chain_Type`
   *
   * @example
   * ```javascript
   * // Using Mathwallet instance
   * export const initEx = async() => {
   *   wikiEx = new WoopExtension(window.woop);
   * }
   * // Using WoopWallet instance
   * export const initEx = async() => {
   *   wikiEx = new WoopExtension(window.woopwallet);
   * }
   * ```
   */
  constructor(
    wallet: ExtensionInterface,
    config: WoopConfig = {
      chainId: utils.defaultConfig.Default.Chain_ID,
      chainType: utils.defaultConfig.Default.Chain_Type,
    },
  ) {
    this.extensionType = null;
    this.wallet = wallet;
    // check if it is mathwallet or woopwallet
    this.isExtension(this.wallet);

    if (wallet.messenger) {
      this.provider = wallet.messenger.provider;
      this.messenger = wallet.messenger;
    } else {
      this.provider = new Provider(config.chainUrl || wallet.network.chain_url).provider;
      this.messenger = new Messenger(this.provider, config.chainType, config.chainId);
    }
    this.wallet.messenger = this.messenger;
    this.blockchain = new Blockchain(this.messenger);
    this.transactions = new TransactionFactory(this.messenger);
    this.contracts = new ContractFactory(this.wallet);
    this.crypto = crypto;
    this.utils = utils;
  }

  /**
   * Will change the provider for its module.
   *
   * @param provider a valid provider, you can replace it with your own working node
   *
   * @example
   * ```javascript
   * const tmp = wikiEx.setProvider('http://localhost:9500');
   * ```
   */
  public setProvider(provider: string | HttpProvider | WSProvider): void {
    this.provider = new Provider(provider).provider;
    this.messenger.setProvider(this.provider);
    this.setMessenger(this.messenger);
  }

  /**
   * Change the Shard ID
   *
   * @example
   * ```
   * wikiEx.setShardID(2);
   * ```
   */
  public setShardID(shardID: number) {
    this.defaultShardID = shardID;
    this.messenger.setDefaultShardID(this.defaultShardID);
    this.setMessenger(this.messenger);
  }

  public isExtension(wallet: ExtensionInterface) {
    let isExtension = false;
    this.extensionType = null;
    if (wallet.isMathWallet || wallet.isWoopWallet) {
      isExtension = true;
      if (wallet.isMathWallet) this.extensionType = ExtensionType.MathWallet;
      else this.extensionType = ExtensionType.WoopWallet;

      // remake signTransaction of MathWallet or WoopWallet
      const { signTransaction } = this.wallet;
      this.wallet.signTransaction = async (
        transaction: Transaction,
        updateNonce: boolean = true,
        encodeMode: string = 'rlp',
        blockNumber: string = 'latest',
      ) => {
        const extensionAccount = await this.wallet.getAccount();

        if (updateNonce) {
          const nonce = await this.messenger.send(
            RPCMethod.GetAccountNonce,
            [crypto.getAddress(extensionAccount.address).checksum, blockNumber],
            this.messenger.chainPrefix,
            typeof transaction.txParams.shardID === 'string'
              ? Number.parseInt(transaction.txParams.shardID, 10)
              : transaction.txParams.shardID,
          );
          transaction.setParams({
            ...transaction.txParams,
            from: crypto.getAddress(extensionAccount.address).bech32,
            nonce: Number.parseInt(utils.isHex(nonce.result.toString()) ? utils.hexToNumber(nonce.result.toString()) : nonce.result.toString(), 10),
          });
        } else {
          transaction.setParams({
            ...transaction.txParams,
            from: crypto.getAddress(extensionAccount.address).bech32,
          });
        }

        return signTransaction(transaction, false, encodeMode, blockNumber);
      };
    }
    if (!isExtension) {
      throw new Error('Extension is not found');
    }
    return;
  }

  /**
   * Get the wallet account
   *
   * @example
   * ```javascript
   * const account = wikiEx.login();
   * console.log(account);
   * ```
   */
  public async login() {
    const account = await this.wallet.getAccount();
    // Use address
    return account;
  }

  /**
   * Log out the wallet account
   *
   * @example
   * ```javascript
   * wikiEx.logout();
   * ```
   */
  public async logout() {
    await this.wallet.forgetIdentity();
  }

  /**
   * Set the sharding Structure
   *
   * @param shardingStructures The array of information of sharding structures
   *
   * @example
   * ```javascript
   * wikiEx.shardingStructures([
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
    this.wallet.messenger = messenger;
    this.transactions.setMessenger(messenger);
  }
}
