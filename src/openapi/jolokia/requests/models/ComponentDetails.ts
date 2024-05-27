/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Attr } from './Attr';
import type { Signatures } from './Signatures';

export type ComponentDetails = {
  op: Record<string, Signatures>;
  attr: Record<string, Attr>;
  class: string;
  desc: string;
};
