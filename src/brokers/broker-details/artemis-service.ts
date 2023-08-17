import { consoleFetchJSON } from '@openshift-console/dynamic-plugin-sdk';
import { SortByDirection } from '@patternfly/react-table';
import _ from 'lodash-es';
import { useGetApiBasePath, APiBasePathProps } from '../../hooks';
import { encode } from 'base-64';

// const BROKER_SEARCH_PATTERN = "org.apache.activemq.artemis:broker=*";
// const LIST_NETWORK_TOPOLOGY_SIG = "listNetworkTopology";
// const SEND_MESSAGE_SIG = "sendMessage(java.util.Map, int, java.lang.String, boolean, java.lang.String, java.lang.String, boolean)";
// const DELETE_ADDRESS_SIG = "deleteAddress(java.lang.String)";
// const CREATE_QUEUE_SIG = "createQueue(java.lang.String, boolean)"
// const CREATE_ADDRESS_SIG = "createAddress(java.lang.String, java.lang.String)"
// const COUNT_MESSAGES_SIG = "countMessages()";
// const COUNT_MESSAGES_SIG2 = "countMessages(java.lang.String)";
// const BROWSE_SIG = "browse(int, int, java.lang.String)";
// const LIST_PRODUCERS_SIG = "listProducers(java.lang.String, int, int)";
// const LIST_CONNECTIONS_SIG = "listConnections(java.lang.String, int, int)";
// const LIST_SESSIONS_SIG = "listSessions(java.lang.String, int, int)";
// const LIST_CONSUMERS_SIG = "listConsumers(java.lang.String, int, int)";
// const LIST_ADDRESSES_SIG = "listAddresses(java.lang.String, int, int)";
const LIST_QUEUES_SIG = 'listQueues(java.lang.String, int, int)';
// const DESTROY_QUEUE_SIG = "destroyQueue(java.lang.String)";
// const REMOVE_ALL_MESSAGES_SIG = "removeAllMessages()";
// const CLOSE_CONNECTION_SIG = "closeConnectionWithID(java.lang.String)";
// const CLOSE_SESSION_SIG = "closeSessionWithID(java.lang.String,java.lang.String)";

export type ActiveSort = {
  id: string;
  order: SortByDirection;
};

export type Filter = {
  column: string;
  operation: string;
  input: string;
};

export const useGetQueues = () => {
  return async (
    page: number,
    perPage: number,
    activeSort: ActiveSort,
    filter: Filter,
  ) => {
    const basePathOptions: APiBasePathProps = {
      protocol: 'http',
      hostName:
        'test-1-ss-0.test-1-hdls-svc.activemq-artemis-self-provisioning-plugin.svc.cluster.local',
      port: '8161',
      jolokiaEndPoint: 'console/jolokia',
    };

    const basePath = useGetApiBasePath(basePathOptions);
    const { column, operation, input } = filter;
    const { id, order } = activeSort;

    const filterQuery = JSON.stringify({
      field: input !== '' ? column : '',
      operation: input !== '' ? operation : '',
      value: input,
      sortOrder: order,
      sortColumn: id,
    });

    // currently the broker name is always 0.0.0.0 as of 08/11/23
    // however this should be fixed
    const defaultBrokerName = '0.0.0.0';

    //const url = `http://localhost:8161/console/jolokia/exec/org.apache.activemq.artemis:broker="0.0.0.0"/${LIST_QUEUES_SIG}/${filterQuery}/${page}/${perPage}`;
    //const url = `http://test-1-ss-0.test-1-hdls-svc.activemq-artemis-self-provisioning-plugin.svc.cluster.local:8161/console/jolokia/exec/org.apache.activemq.artemis:broker="${defaultBrokerName}"/${LIST_QUEUES_SIG}/${filterQuery}/${page}/${perPage}`;
    const url = `${basePath}/exec/org.apache.activemq.artemis:broker="${defaultBrokerName}"/${LIST_QUEUES_SIG}/${filterQuery}/${page}/${perPage}`;

    const username = '';
    const password = '';
    const allOptions: Record<string, any> = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + encode(username + ':' + password),
      },
    };

    return await consoleFetchJSON(url, 'POST', allOptions);
  };
};
