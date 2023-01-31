import { FC, useState } from 'react';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import ConfigurationPageContainer from '../broker-configuration/BrokerConfigurationPage.container';
import { RouteComponentProps } from 'react-router-dom'

export type BrokerDetailsProps = RouteComponentProps<{
  broker?: string;
  ns?: string
}>;;

const BrokerDetails: FC<BrokerDetailsProps> = ({ match }) => {
  const { broker } = match.params;
  const namespace = match.params.ns;
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number,
  ) => {
    setActiveTabKey(tabIndex);
  };
  return (
    <div style={{ padding: "3%" }}>
      <Tabs
        activeKey={activeTabKey}
        onSelect={handleTabClick}
        aria-label="Broker detail tabs"
        role="tab"
        isFilled
      >
        <Tab
          eventKey={0}
          title={<TabTitleText>Overview</TabTitleText>}
          aria-label="Default content - overview of brokers"
        >
          Add overview page
        </Tab>
        <Tab eventKey={1} title={
          <TabTitleText>Configuration</TabTitleText>}>
          <ConfigurationPageContainer name={broker} namespace={namespace} />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Clients</TabTitleText>}>
          Add clients page
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>Queues</TabTitleText>}>
          Add queues page
        </Tab>
        <Tab eventKey={4} title={<TabTitleText>Topics</TabTitleText>}>
          Add topics page
        </Tab>
      </Tabs>
    </div>
  );
};

export default BrokerDetails;
