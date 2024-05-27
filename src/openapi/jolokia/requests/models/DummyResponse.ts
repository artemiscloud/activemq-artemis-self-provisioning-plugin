/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DummyResponse = {
  message: DummyResponse.message;
  status: DummyResponse.status;
};

export namespace DummyResponse {
  export enum message {
    OK = 'ok',
  }

  export enum status {
    SUCCESSFUL = 'successful',
  }
}
