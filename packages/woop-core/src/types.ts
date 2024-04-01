/**
 * @packageDocumentation
 * @module woop-core
 * @hidden
 */

import { HttpProvider, Messenger } from '@woop-js/network';
import { TransactionFactory, Transaction } from '@woop-js/transaction';
import { Wallet, Account } from '@woop-js/account';
import { ChainType, ChainID } from '@woop-js/utils';
import { Blockchain } from './blockchain';

export interface WoopModule {
  HttpProvider: HttpProvider;
  Messenger: Messenger;
  Blockchain: Blockchain;
  TransactionFactory: TransactionFactory;
  Wallet: Wallet;
  Transaction: Transaction;
  Account: Account;
}

export enum UrlType {
  http,
  ws,
}

export interface WoopSetting<T extends ChainType, I extends ChainID> {
  type: T;
  id: I;
}
