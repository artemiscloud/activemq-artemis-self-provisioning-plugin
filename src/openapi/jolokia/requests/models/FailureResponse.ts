/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type FailureResponse = {
  status: FailureResponse.status;
  message: string;
};

export namespace FailureResponse {
  export enum status {
    FAILED = 'failed',
    ERROR = 'error',
  }
}
