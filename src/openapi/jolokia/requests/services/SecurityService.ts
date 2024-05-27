/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginResponse } from '../models/LoginResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SecurityService {
  /**
   * The login api
   * This api is used to login to a jolokia endpoint. It tries to get the broker mbean via the joloia url using the parameters passed in.
   *
   * If it succeeds, it generates a [jwt token](https://jwt.io/introduction) and returns
   * it back to the client. If it fails it returns a error.
   *
   * Once authenticated, the client can access the
   * apis defined in this file. With each request the client must include a valid jwt token in a http header named `jolokia-session-id`. The api-server will validate the token before processing a request is and rejects the request if the token is not valid.
   *
   * @param requestBody
   * @returns LoginResponse Success
   * @throws ApiError
   */
  public static login(requestBody: {
    /**
     * identity of the broker instance, must in form of {cr-name}-{pod-ordinal}:{namespace}. For example ex-aao-0:test1
     */
    brokerName: string;
    /**
     * The user name
     */
    userName: string;
    /**
     * The password
     */
    password: string;
    /**
     * The host name of the broker
     */
    jolokiaHost: string;
    /**
     * either *http* or *https*
     */
    scheme: string;
    /**
     * port number of jolokia endpoint
     */
    port: string;
  }): CancelablePromise<LoginResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/jolokia/login',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }
}
