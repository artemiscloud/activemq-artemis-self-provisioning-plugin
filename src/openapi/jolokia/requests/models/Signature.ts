/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Argument } from './Argument';
import type { JavaTypes } from './JavaTypes';

export type Signature = {
  ret?: JavaTypes;
  desc: string;
  args: Array<Argument>;
};
