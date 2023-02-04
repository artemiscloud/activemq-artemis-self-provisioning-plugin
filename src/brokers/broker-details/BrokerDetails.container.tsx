import { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import { ConfigurationContainer } from './components/Configuration';

export type BrokerDetailsProps = RouteComponentProps<{
  ns?: string;
  name?: string;
}>;

const BrokerDetailsPage: FC<BrokerDetailsProps> = ({ match }) => {
  const namespace = match.params.ns;
  const { name } = match.params;

  return (
    <Tabs defaultActiveKey={0}>
      <Tab eventKey={0} title={<TabTitleText>Overview</TabTitleText>}>
        Overview
      </Tab>
      <Tab eventKey={1} title={<TabTitleText>Configuration</TabTitleText>}>
        <ConfigurationContainer name={name} namespace={namespace} />
      </Tab>
      <Tab eventKey={2} title={<TabTitleText>Clients</TabTitleText>}>
        Clients
      </Tab>
      <Tab eventKey={3} title={<TabTitleText>Queues</TabTitleText>}>
        Queues
      </Tab>
      <Tab eventKey={4} title={<TabTitleText>Topics</TabTitleText>}>
        Topics
      </Tab>
    </Tabs>);
};

export default BrokerDetailsPage;
