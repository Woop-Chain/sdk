/**
 * @packageDocumentation
 * @module woop-account
 * @ignore
 */

import fetch from 'jest-fetch-mock';
import { Account } from '../src/account';
import { HttpProvider, Messenger } from '@woop-js/network';
import { ChainType, ChainID } from '@woop-js/utils';

const provider = new HttpProvider('http://localhost:9500');
const messenger = new Messenger(provider, ChainType.Woop, ChainID.WikiLocal);

describe('test account', () => {
  it('test Account.getBalance returns object that implements Balance interface', () => {
    fetch.mockResponses(
      [
        JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "0x166c690f33421e"}),
        { status: 200 }
      ],
      [
        JSON.stringify({"jsonrpc": "2.0", "id": 1, "result": "0x106"}),
        { status: 200 }
      ]
    );
    const acc = Account.new();
    acc.setMessenger(messenger);
    acc.getBalance().then((res) => {
      expect(res).not.toBeNull();
      expect(res.balance).not.toBeNull();
      expect(res.nonce).not.toBeNull();
      expect(res.shardID).not.toBeNull();
    });
  });
});
