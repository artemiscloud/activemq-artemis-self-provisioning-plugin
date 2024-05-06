/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BrokersResponse } from '../models/BrokersResponse';
import type { OperationRef } from '../models/OperationRef';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class JolokiaService {
  /**
   * retrieve the broker mbean
   * **Get the broker mbean**
   * The return value is a one-element array that contains
   * the broker's mbean object name.
   * **Example:**
   *
   * **Request url:** https://localhost:9443/api/v1/brokers
   * **Response:**
   * ```json
   * [
   * "org.apache.activemq.artemis:broker=\"amq-broker\""
   * ]
   * ```
   *
   * @param jolokiaSessionId
   * @returns BrokersResponse Success
   * @throws ApiError
   */
  public static getBrokers(
    jolokiaSessionId: string,
  ): CancelablePromise<BrokersResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/brokers',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
    });
  }

  /**
   * broker details
   * **Get the broker details**
   * The return value is a json object that contains
   * description of all the operations and attributes of the broker's mbean.
   * It is defined in [ActiveMQServerControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/ActiveMQServerControl.java)
   * **Example:**
   *
   * **Request url:** https://localhost:9443/api/v1/brokerDetails
   * **Response:**
   * ```json
   * {
   * "op": {
   * "removeAddressSettings": {
   * "args": [
   * {
   * "name": "addressMatch",
   * "type": "java.lang.String",
   * "desc": "an address match"
   * }
   * ],
   * "ret": "void",
   * "desc": "Remove address settings"
   * },
   * ...(more)
   * },
   * "attr": {
   * "AddressMemoryUsage": {
   * "rw": false,
   * "type": "long",
   * "desc": "Memory used by all the addresses on broker for in-memory messages"
   * },
   * ...(more)
   * },
   * "class": "org.apache.activemq.artemis.core.management.impl.ActiveMQServerControlImpl",
   * "desc": "Information on the management interface of the MBean"
   * }
   * ```
   *
   * @param jolokiaSessionId
   * @returns BrokersResponse Success
   * @throws ApiError
   */
  public static getBrokerDetails(
    jolokiaSessionId: string,
  ): CancelablePromise<BrokersResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/brokerDetails',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
    });
  }

  /**
   * read broker attributes
   * **Read values of broker attributes**
   * The return value is a json array that contains
   * values of requested attributes of the broker's mbean.
   *
   * **Example:**
   *
   * **Request url:** https://localhost:9443/api/v1/readBrokerAttributes?names=Clustered
   * (To read the `Clustered` attribute of the broker)
   *
   * **Response:**
   * ```json
   * [
   * {
   * "request": {
   * "mbean": "org.apache.activemq.artemis:broker=\"amq-broker\"",
   * "attribute": "Clustered",
   * "type": "read"
   * },
   * "value": true,
   * "timestamp": 1713712378,
   * "status": 200
   * }
   * ]
   * ```
   * **Note**: to read multiple attributes, set it to **names** parameter
   * separated by commas, e.g. `Version,Status`.
   *
   * @param jolokiaSessionId
   * @param names attribute names separated by commas. If not speified read all attributes.
   * @returns BrokersResponse Success
   * @throws ApiError
   */
  public static readBrokerAttributes(
    jolokiaSessionId: string,
    names?: Array<string>,
  ): CancelablePromise<BrokersResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/readBrokerAttributes',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      query: {
        names: names,
      },
    });
  }

  /**
   * execute a broker operation
   * **Invoke an operation of the broker mbean**
   *
   * It receives a POST request where the body
   * should have the operation signature and its args.
   * The return value is a one element json array that contains
   * return values of invoked operation along with the request info.
   *
   * **Example:**
   *
   * To invoke `listAddresses` operation on the broker:
   * **Request:**
   * ```
   * POST https://localhost:9443/api/v1/execBrokerOperation
   * with body:
   * {
   * signature: 'listAddresses(java.lang.String)',
   * params: [','],
   * }
   * ```
   * **Response:**
   * ```json
   * [
   * {
   * "request": {
   * "mbean": "org.apache.activemq.artemis:broker=\"amq-broker\"",
   * "arguments": [
   * ","
   * ],
   * "type": "exec",
   * "operation": "listAddresses(java.lang.String)"
   * },
   * "value": "$.artemis.internal.sf.my-cluster.caceaae5-ff8c-11ee-a198-0a580ad90011,activemq.notifications,DLQ,ExpiryQueue",
   * "timestamp": 1713714174,
   * "status": 200
   * }
   * ]
   * ```
   *
   * @param jolokiaSessionId
   * @param requestBody
   * @returns BrokersResponse Success
   * @throws ApiError
   */
  public static execBrokerOperation(
    jolokiaSessionId: string,
    requestBody: OperationRef,
  ): CancelablePromise<BrokersResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/execBrokerOperation',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * list all mbeans
   * **List all broker components**
   *
   * It retrieves and returns a list of all mbeans
   * registered directly under the broker managment domain.
   *
   * **Example:**
   *
   * **Request url:** https://localhost:9443/api/v1/execBrokerOperation
   * **Response:**
   * ```json
   * [
   * "org.apache.activemq.artemis:address=\"ExpiryQueue\",broker=\"amq-broker\",component=addresses,queue=\"ExpiryQueue\",routing-type=\"anycast\",subcomponent=queues",
   * "org.apache.activemq.artemis:broker=\"amq-broker\",component=cluster-connections,name=\"my-cluster\"",
   * "org.apache.activemq.artemis:address=\"activemq.notifications\",broker=\"amq-broker\",component=addresses",
   * "org.apache.activemq.artemis:broker=\"amq-broker\",component=broadcast-groups,name=\"my-broadcast-group\"",
   * "org.apache.activemq.artemis:broker=\"amq-broker\",component=acceptors,name=\"scaleDown\"",
   * "org.apache.activemq.artemis:broker=\"amq-broker\"",
   * "org.apache.activemq.artemis:address=\"DLQ\",broker=\"amq-broker\",component=addresses",
   * "org.apache.activemq.artemis:address=\"DLQ\",broker=\"amq-broker\",component=addresses,queue=\"DLQ\",routing-type=\"anycast\",subcomponent=queues",
   * "org.apache.activemq.artemis:address=\"ExpiryQueue\",broker=\"amq-broker\",component=addresses"
   * ]
   * ```
   *
   * @param jolokiaSessionId
   * @returns BrokersResponse Success
   * @throws ApiError
   */
  public static getBrokerComponents(
    jolokiaSessionId: string,
  ): CancelablePromise<BrokersResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/brokerComponents',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
    });
  }

  /**
   * retrieve all addresses on broker
   * **Get all addresses in a broker**
   *
   * It retrieves and returns a list of all address mbeans
   *
   * **Example:**
   *
   * **Request url:** https://localhost:9443/api/v1/addresses
   * **Response:**
   * ```json
   * [
   * "org.apache.activemq.artemis:address=\"activemq.notifications\",broker=\"amq-broker\",component=addresses",
   * "org.apache.activemq.artemis:address=\"DLQ\",broker=\"amq-broker\",component=addresses",
   * "org.apache.activemq.artemis:address=\"ExpiryQueue\",broker=\"amq-broker\",component=addresses"
   * ]
   * ```
   *
   * @param jolokiaSessionId
   * @returns BrokersResponse Success
   * @throws ApiError
   */
  public static getAddresses(
    jolokiaSessionId: string,
  ): CancelablePromise<BrokersResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/addresses',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
    });
  }

  /**
   * list queues
   * **Get all queues in a broker**
   *
   * It retrieves and returns a list of all queue mbeans
   *
   * **Example:**
   *
   * **Request url:** https://localhost:9443/api/v1/queues
   * **Response:**
   * ```json
   * [
   * "org.apache.activemq.artemis:address=\"ExpiryQueue\",broker=\"amq-broker\",component=addresses,queue=\"ExpiryQueue\",routing-type=\"anycast\",subcomponent=queues",
   * "org.apache.activemq.artemis:address=\"DLQ\",broker=\"amq-broker\",component=addresses,queue=\"DLQ\",routing-type=\"anycast\",subcomponent=queues"
   * ]
   * ```
   *
   * @param jolokiaSessionId
   * @param address
   * @returns BrokersResponse Success
   * @throws ApiError
   */
  public static getQueues(
    jolokiaSessionId: string,
    address?: string,
  ): CancelablePromise<BrokersResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/queues',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      query: {
        address: address,
      },
    });
  }

  /**
   * retrieve queue details
   * **Get details of a queue**
   * The return value is a json object that contains
   * description of all the operations and attributes of the `queue` mbean.
   *
   * It is defined in [QueueControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/QueueControl.java)
   * **Example:**
   *
   * **Request url:** https://localhost:9443/api/v1/queueDetails?name=DLQ&addressName=DLQ&routingType=anycast
   * (To get details of queue `DLQ` on address `DLQ` with routingType `anycast`)
   * **Response:**
   * ```json
   * {
   * "op": {
   * "listMessages": {
   * "args": [
   * {
   * "name": "filter",
   * "type": "java.lang.String",
   * "desc": "A message filter (can be empty)"
   * }
   * ],
   * "ret": "[Ljava.util.Map;",
   * "desc": "List all the messages in the queue matching the given filter"
   * },
   * ...(more)
   * },
   * "attr": {
   * "ConfigurationManaged": {
   * "rw": false,
   * "type": "boolean",
   * "desc": "is this queue managed by configuration (broker.xml)"
   * },
   * ...(more)
   * },
   * "class": "org.apache.activemq.artemis.core.management.impl.QueueControlImpl",
   * "desc": "Information on the management interface of the MBean"
   * }
   * ```
   *
   * @param jolokiaSessionId
   * @param name
   * @param routingType
   * @param addressName
   * @returns BrokersResponse Success
   * @throws ApiError
   */
  public static getQueueDetails(
    jolokiaSessionId: string,
    name: string,
    routingType: string,
    addressName?: string,
  ): CancelablePromise<BrokersResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/queueDetails',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      query: {
        addressName: addressName,
        name: name,
        routingType: routingType,
      },
    });
  }

  /**
   * retrieve address details
   * **Get details of an address**
   * The return value is a json object that contains
   * description of all the operations and attributes of the address mbean.
   *
   * It is defined in [AddressControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/AddressControl.java)
   * **Example:**
   *
   * **Request url:**
   * **Response:**
   * ```json
   * {
   * "op": {
   * "resume": {
   * "args": [],
   * "ret": "void",
   * "desc": "Resumes the queues bound to this address"
   * },
   * ...(more)
   * },
   * "attr": {
   * "RoutingTypesAsJSON": {
   * "rw": false,
   * "type": "java.lang.String",
   * "desc": "Get the routing types enabled on this address as JSON"
   * },
   * ...(more)
   * },
   * "class": "org.apache.activemq.artemis.core.management.impl.AddressControlImpl",
   * "desc": "Information on the management interface of the MBean"
   * }
   * ```
   *
   * @param jolokiaSessionId
   * @param name
   * @returns BrokersResponse Success
   * @throws ApiError
   */
  public static getAddressDetails(
    jolokiaSessionId: string,
    name: string,
  ): CancelablePromise<BrokersResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/addressDetails',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      query: {
        name: name,
      },
    });
  }

  /**
   * list acceptors
   * **Get all acceptors in a broker**
   *
   * It retrieves and returns a list of all acceptor mbeans
   *
   * **Example:**
   *
   * **Request url:** https://localhost:9443/api/v1/acceptors
   * **Response:**
   * ```json
   * [
   * "org.apache.activemq.artemis:broker=\"amq-broker\",component=acceptors,name=\"scaleDown\""
   * ]
   * ```
   *
   * @param jolokiaSessionId
   * @returns BrokersResponse Success
   * @throws ApiError
   */
  public static getAcceptors(
    jolokiaSessionId: string,
  ): CancelablePromise<BrokersResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/acceptors',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
    });
  }

  /**
   * retrieve acceptor details
   * **Get details of an acceptor**
   * The return value is a json object that contains
   * description of all the operations and attributes of an `acceptor` mbean.
   *
   * It is defined in [AcceptorControl.java](https://github.com/apache/activemq-artemis/blob/2.33.0/artemis-core-client/src/main/java/org/apache/activemq/artemis/api/core/management/AcceptorControl.java)
   * **Example:**
   *
   * **Request url:** https://localhost:9443/api/v1/acceptorDetails?name=scaleDown
   * (To get the details of an acceptor named `scaleDown`)
   * **Response:**
   * ```json
   * {
   * "op": {
   * "reload": {
   * "args": [],
   * "ret": "void",
   * "desc": "Re-create the acceptor with the existing configuration values. Useful, for example, for reloading key/trust stores on acceptors which support SSL."
   * },
   * ...(more)
   * },
   * "attr": {
   * "FactoryClassName": {
   * "rw": false,
   * "type": "java.lang.String",
   * "desc": "class name of the AcceptorFactory implementation used by this acceptor"
   * },
   * ...(more)
   * },
   * "class": "org.apache.activemq.artemis.core.management.impl.AcceptorControlImpl",
   * "desc": "Information on the management interface of the MBean"
   * }
   * ```
   *
   * @param jolokiaSessionId
   * @param name
   * @returns BrokersResponse Success
   * @throws ApiError
   */
  public static getAcceptorDetails(
    jolokiaSessionId: string,
    name: string,
  ): CancelablePromise<BrokersResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/acceptorDetails',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      query: {
        name: name,
      },
    });
  }
}
