/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ComponentAttribute = {
  request: {
    mbean: string;
    attribute?: string;
    type: string;
  };
  value?: any;
  error_type?: string;
  error?: string;
  timestamp?: number;
  status: number;
};
