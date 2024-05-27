/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OperationResult = {
  request: {
    mbean: string;
    arguments: Array<string>;
    type: string;
    operation: string;
  };
  value: string;
  timestamp: number;
  status: number;
};
