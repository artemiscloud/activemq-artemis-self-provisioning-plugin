/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OperationArgument } from './OperationArgument';

export type OperationRef = {
  /**
   * The method signature
   */
  signature: {
    name: string;
    args: Array<OperationArgument>;
  };
};
