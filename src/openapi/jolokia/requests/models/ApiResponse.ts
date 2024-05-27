/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ApiResponse = {
  message?: {
    info?: {
      name?: string;
      description?: string;
      version?: string;
    };
    paths?: {
      post?: Array<string>;
      get?: Array<string>;
    };
  };
  status?: ApiResponse.status;
  /**
   * The jwt token
   */
  'jolokia-session-id'?: string;
};

export namespace ApiResponse {
  export enum status {
    SUCCESSFUL = 'successful',
  }
}
