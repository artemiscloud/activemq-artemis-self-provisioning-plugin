/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SimpleResponse = {
  message: string;
  status: string;
  /**
   * The jwt token
   */
  'jolokia-session-id': string;
};
