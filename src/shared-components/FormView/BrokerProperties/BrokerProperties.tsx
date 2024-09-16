import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  JumpLinks,
  JumpLinksItem,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { CSSProperties, FC, useState } from 'react';
import {
  ConfigType,
  GetConfigurationPage,
} from './ConfigurationPage/ConfigurationPage';
import { useTranslation } from '@app/i18n/i18n';

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
}) => {
  const { t } = useTranslation();
  const [currentConfigItem, setCurrentConfigItem] = useState<ConfigType>(
    ConfigType.acceptors,
  );

  return (
    <Split hasGutter>
      <SplitItem>
        <JumpLinks isVertical aria-label="Broker Config List">
          <JumpLinksItem
            onClick={() => setCurrentConfigItem(ConfigType.acceptors)}
            isActive={currentConfigItem === ConfigType.acceptors}
            style={
              {
                listStyle: 'none' /* reset to patternfly default value*/,
              } as CSSProperties
            }
          >
            {t('Acceptors')}
          </JumpLinksItem>
          <JumpLinksItem
            onClick={() => setCurrentConfigItem(ConfigType.connectors)}
            isActive={currentConfigItem === ConfigType.connectors}
            style={
              {
                listStyle: 'none' /* reset to patternfly default value*/,
              } as CSSProperties
            }
          >
            {t('Connectors')}
          </JumpLinksItem>
          <JumpLinksItem
            onClick={() => setCurrentConfigItem(ConfigType.console)}
            isActive={currentConfigItem === ConfigType.console}
            style={
              {
                listStyle: 'none' /* reset to patternfly default value*/,
              } as CSSProperties
            }
          >
            {t('Console')}
          </JumpLinksItem>
        </JumpLinks>
      </SplitItem>
      <SplitItem>
        <GetConfigurationPage
          target={currentConfigItem}
          isPerBrokerConfig={perBrokerProperties}
          brokerId={brokerId}
        />
      </SplitItem>
    </Split>
  );
};
