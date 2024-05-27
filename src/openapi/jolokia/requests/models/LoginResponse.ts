/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type LoginResponse = {
  message: string;
  status: string;
  /**
   * The jwt token
   */
  'jolokia-session-id': string;
};
