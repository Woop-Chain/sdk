/**
 * @packageDocumentation
 * @module woop-account
 * @hidden
 */

import { HttpProvider, Messenger } from '@woop-js/network';
import { ChainType, ChainID } from '@woop-js/utils';

export const defaultMessenger = new Messenger(
  new HttpProvider('http://localhost:9500'),
  ChainType.Woop,
  ChainID.WikiLocal,
);
