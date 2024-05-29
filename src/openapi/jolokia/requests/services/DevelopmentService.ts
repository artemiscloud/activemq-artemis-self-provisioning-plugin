/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse } from '../models/ApiResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DevelopmentService {
  /**
   * the api info
   * **Show all exposed paths on the api server**
   *
   * The return value is a json object that contains
   * description of all api paths defined in the api server.
   *
   * @returns ApiResponse Success
   * @throws ApiError
   */
  public static apiInfo(): CancelablePromise<ApiResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api-info',
    });
  }
}
