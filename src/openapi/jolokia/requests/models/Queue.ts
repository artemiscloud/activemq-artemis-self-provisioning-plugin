/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';
import type { Broker } from './Broker';

export type Queue = {
  name: string;
  'routing-type': string;
  address?: Address;
  broker: Broker;
};
