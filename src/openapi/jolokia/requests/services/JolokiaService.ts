/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Acceptor } from '../models/Acceptor';
import type { Address } from '../models/Address';
import type { Broker } from '../models/Broker';
import type { ComponentAttribute } from '../models/ComponentAttribute';
import type { ComponentDetails } from '../models/ComponentDetails';
import type { DummyResponse } from '../models/DummyResponse';
import type { ExecResult } from '../models/ExecResult';
import type { OperationRef } from '../models/OperationRef';
import type { Queue } from '../models/Queue';

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
   * {
   * name: 'amq-broker'
   * }
   * ]
   * ```
   *
   * @param jolokiaSessionId
   * @returns Broker Success
   * @throws ApiError
   */
  public static getBrokers(
    jolokiaSessionId: string,
  ): CancelablePromise<Array<Broker>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/brokers',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
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
   * @returns ComponentDetails Success
   * @throws ApiError
   */
  public static getBrokerDetails(
    jolokiaSessionId: string,
  ): CancelablePromise<ComponentDetails> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/brokerDetails',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
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
   * @returns ComponentAttribute Success
   * @throws ApiError
   */
  public static readBrokerAttributes(
    jolokiaSessionId: string,
    names?: Array<string>,
  ): CancelablePromise<Array<ComponentAttribute>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/readBrokerAttributes',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      query: {
        names: names,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * read address attributes
   * **Read values of address attributes**
   * The return value is a json array that contains
   * values of requested attributes of the addresses's mbean.
   *
   * **Example:**
   *
   * **Request url:** https://localhost:9443/api/v1/readAddressAttributes?name=DLQ,attrs=RoutingTypes
   * (To read the `RoutingTypes` attribute of the address DLQ)
   *
   * **Response:**
   * ```json
   * [
   * {
   * "request": {
   * "mbean": "org.apache.activemq.artemis:address=\"DLQ\",broker=\"amq-broker\",component=addresses",
   * "attribute": "RoutingTypes",
   * "type": "read"
   * },
   * "value": [
   * "ANYCAST"
   * ],
   * "timestamp": 1715864988,
   * "status": 200
   * }
   * ]
   * ```
   * **Note**: to read multiple attributes, set it to **attrs** parameter
   * separated by commas, e.g. `RoutingTypes,Address`.
   *
   * @param jolokiaSessionId
   * @param name the address name
   * @param attrs attribute names separated by commas. If not speified read all attributes.
   * @returns ComponentAttribute Success
   * @throws ApiError
   */
  public static readAddressAttributes(
    jolokiaSessionId: string,
    name: string,
    attrs?: Array<string>,
  ): CancelablePromise<Array<ComponentAttribute>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/readAddressAttributes',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      query: {
        name: name,
        attrs: attrs,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * read queue attributes
   * **Read values of queue attributes**
   * The return value is a json array that contains
   * values of requested attributes of the queue's mbean.
   *
   * **Note**: to read multiple attributes, set it to **attrs** parameter
   * separated by commas, e.g. `RoutingTypes,Address`.
   *
   * @param jolokiaSessionId
   * @param name the queue name
   * @param address the address name
   * @param routingType the routing type
   * @param attrs attribute names separated by commas. If not speified read all attributes.
   * @returns ComponentAttribute Success
   * @throws ApiError
   */
  public static readQueueAttributes(
    jolokiaSessionId: string,
    name: string,
    address: string,
    routingType: string,
    attrs?: Array<string>,
  ): CancelablePromise<Array<ComponentAttribute>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/readQueueAttributes',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      query: {
        name: name,
        address: address,
        'routing-type': routingType,
        attrs: attrs,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * read acceptor attributes
   * **Read values of acceptor attributes**
   * The return value is a json array that contains
   * values of requested attributes of the acceptor's mbean.
   *
   * **Note**: to read multiple attributes, set it to **attrs** parameter
   * separated by commas, e.g. `RoutingTypes,Address`.
   *
   * @param jolokiaSessionId
   * @param name the queue name
   * @param attrs attribute names separated by commas. If not speified read all attributes.
   * @returns ComponentAttribute Success
   * @throws ApiError
   */
  public static readAcceptorAttributes(
    jolokiaSessionId: string,
    name: string,
    attrs?: Array<string>,
  ): CancelablePromise<Array<ComponentAttribute>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/readAcceptorAttributes',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      query: {
        name: name,
        attrs: attrs,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * Check the validity of the credentials
   * @param jolokiaSessionId
   * @returns DummyResponse Success
   * @throws ApiError
   */
  public static checkCredentials(
    jolokiaSessionId: string,
  ): CancelablePromise<DummyResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/checkCredentials',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
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
   * @returns ExecResult Success
   * @throws ApiError
   */
  public static execBrokerOperation(
    jolokiaSessionId: string,
    requestBody: OperationRef,
  ): CancelablePromise<Array<ExecResult>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/execBrokerOperation',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
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
   * @returns string Success
   * @throws ApiError
   */
  public static getBrokerComponents(
    jolokiaSessionId: string,
  ): CancelablePromise<Array<string>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/brokerComponents',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
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
   * {
   * name: 'activemq.notifications',
   * broker: {
   * name: 'amq-broker',
   * },
   * },
   * {
   * name: 'DLQ',
   * broker: {
   * name: 'amq-broker',
   * },
   * },
   * {
   * name: 'ExpiryQueue',
   * broker: {
   * name: 'amq-broker',
   * },
   * },
   * ]
   * ```
   *
   * @param jolokiaSessionId
   * @returns Address Success
   * @throws ApiError
   */
  public static getAddresses(
    jolokiaSessionId: string,
  ): CancelablePromise<Array<Address>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/addresses',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
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
   * {
   * name: 'ExpiryQueue',
   * 'routing-type': 'anycast',
   * address: {
   * name: 'ExpiryQueue',
   * },
   * broker: {
   * name: 'amq-broker',
   * },
   * },
   * {
   * name: 'DLQ',
   * 'routing-type': 'anycast',
   * address: {
   * name: 'DLQ',
   * },
   * broker: {
   * name: 'amq-broker',
   * },
   * },
   * ]
   * ```
   *
   * @param jolokiaSessionId
   * @param address
   * @returns Queue Success
   * @throws ApiError
   */
  public static getQueues(
    jolokiaSessionId: string,
    address?: string,
  ): CancelablePromise<Array<Queue>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/queues',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      query: {
        address: address,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
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
   * @returns ComponentDetails Success
   * @throws ApiError
   */
  public static getQueueDetails(
    jolokiaSessionId: string,
    name: string,
    routingType: string,
    addressName?: string,
  ): CancelablePromise<ComponentDetails> {
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
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
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
   * @returns ComponentDetails Success
   * @throws ApiError
   */
  public static getAddressDetails(
    jolokiaSessionId: string,
    name: string,
  ): CancelablePromise<ComponentDetails> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/addressDetails',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      query: {
        name: name,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
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
   * {
   * name: 'scaleDown',
   * broker: {
   * name: 'amq-broker',
   * },
   * },
   * ]
   * ```
   *
   * @param jolokiaSessionId
   * @returns Acceptor Success
   * @throws ApiError
   */
  public static getAcceptors(
    jolokiaSessionId: string,
  ): CancelablePromise<Array<Acceptor>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/acceptors',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
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
   * @returns ComponentDetails Success
   * @throws ApiError
   */
  public static getAcceptorDetails(
    jolokiaSessionId: string,
    name: string,
  ): CancelablePromise<ComponentDetails> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/acceptorDetails',
      headers: {
        'jolokia-session-id': jolokiaSessionId,
      },
      query: {
        name: name,
      },
      errors: {
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }
}
