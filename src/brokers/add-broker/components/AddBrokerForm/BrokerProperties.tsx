import { GetConfigurationPage } from '../../../../configuration/broker-models';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Divider,
  SimpleList,
  SimpleListItem,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';
import { FC, useState } from 'react';

export type BrokerIDProp = {
  brokerId: number;
  perBrokerProperties: boolean;
  crName: string;
  targetNs: string;
};

export type BrokerReplicasProp = {
  replicas: number;
  crName: string;
  targetNs: string;
};

export const BrokerPropertiesList: FC<BrokerReplicasProp> = ({
  replicas,
  crName,
  targetNs,
}) => {
  const [expanded, setExpanded] = useState(['ex2-toggle4']);

  const toggle = (id: string) => {
    const index = expanded.indexOf(id);
    const newExpanded: string[] =
      index >= 0
        ? [
            ...expanded.slice(0, index),
            ...expanded.slice(index + 1, expanded.length),
          ]
        : [...expanded, id];
    setExpanded(newExpanded);
  };

  const entries = [];
  for (let i = 0; i < replicas; i++) {
    const itemId = 'broker_' + +i;
    entries.push(
      <AccordionItem key={itemId}>
        <AccordionToggle
          onClick={() => toggle(itemId)}
          isExpanded={expanded.includes(itemId)}
          id={itemId}
          key={itemId}
          component={'text'}
        >
          {itemId}
          <br />
        </AccordionToggle>
        <AccordionContent
          id={itemId}
          key={itemId}
          isHidden={!expanded.includes(itemId)}
        >
          <BrokerProperties
            brokerId={i}
            perBrokerProperties={true}
            crName={crName}
            targetNs={targetNs}
          />
        </AccordionContent>
      </AccordionItem>,
    );
  }

  return <Accordion asDefinitionList={false}>{entries}</Accordion>;
};

export const BrokerProperties: FC<BrokerIDProp> = ({
  brokerId,
  perBrokerProperties,
  crName,
  targetNs,
}) => {
  console.log('configuring broker ', crName, 'in namespace', targetNs);

  const [currentConfigItem, setCurrentConfigItem] = useState('');

  const onSelectBrokerConfigItem = (
    selectedItem: any,
    selectedItemProps: any,
  ) => {
    console.log('new selection selected', selectedItem);
    setCurrentConfigItem(selectedItemProps.itemId);
  };

  const brokerConfigItems = [
    <SimpleListItem key={'acceptors' + brokerId} itemId="acceptors">
      <Title headingLevel="h4" key="title.acceptors">
        Acceptors
      </Title>
    </SimpleListItem>,
    <SimpleListItem key={'connectors' + brokerId} itemId="connectors">
      <Title headingLevel="h4" key="title.connectors">
        Connectors
      </Title>
    </SimpleListItem>,
    <SimpleListItem key={'console' + brokerId} itemId="console">
      <Title headingLevel="h4" key="title.console">
        Console
      </Title>
    </SimpleListItem>,
  ];

  return (
    <Split hasGutter key={'split.config.broker' + brokerId}>
      <SplitItem key={'splititem.config.broker' + brokerId}>
        <SimpleList
          onSelect={onSelectBrokerConfigItem}
          aria-label="Broker Config List"
          key={'config.broker.container.' + brokerId}
        >
          {brokerConfigItems}
        </SimpleList>
      </SplitItem>
      <Divider
        orientation={{
          default: 'vertical',
        }}
        inset={{
          default: 'insetMd',
          md: 'insetNone',
          lg: 'insetSm',
          xl: 'insetXs',
        }}
      />
      <SplitItem isFilled key={'splititem.config.broker.details' + brokerId}>
        <GetConfigurationPage
          key={'getconfigurationpage.config.broker' + brokerId}
          target={currentConfigItem}
          isPerBrokerConfig={perBrokerProperties}
        />
      </SplitItem>
    </Split>
  );
};
