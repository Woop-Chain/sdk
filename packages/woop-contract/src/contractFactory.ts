/**
 * @packageDocumentation
 * @module woop-contract
 */

import { Wallet } from '@woop-js/account';
import { Contract } from './contract';
import { ContractOptions } from './utils/options';

export class ContractFactory {
  wallet: Wallet | any;

  constructor(wallet: Wallet | any) {
    this.wallet = wallet;
  }
  createContract(abi: any[], address?: string, options?: ContractOptions) {
    return new Contract(abi, address, options, this.wallet);
  }
}
