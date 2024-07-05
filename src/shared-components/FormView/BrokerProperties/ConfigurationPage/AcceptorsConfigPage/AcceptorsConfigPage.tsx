import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  listConfigs,
} from '../../../../../reducers/7.12/reducer';
import { FC, useContext } from 'react';
import { ConfigType, ConfigTypeContext } from '../ConfigurationPage';
import {
  ActionGroup,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Form,
  Title,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { AcceptorConfigSection } from './AcceptorConfigSection/AcceptorConfigSection';

type AcceptorsConfigProps = {
  brokerId: number;
};

export const AcceptorsConfigPage: FC<AcceptorsConfigProps> = ({ brokerId }) => {
  const { cr } = useContext(BrokerCreationFormState);
  const configType = useContext(ConfigTypeContext);
  const configs = listConfigs(configType, cr) as {
    name: string;
  }[];
  const dispatch = useContext(BrokerCreationFormDispatch);

  const addNewConfig = () => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.addAcceptor,
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.addConnector,
      });
    }
  };

  const name = configType === ConfigType.acceptors ? 'acceptor' : 'connector';
  const pronoun = configType === ConfigType.acceptors ? 'an' : 'a';
  if (configs.length === 0) {
    return (
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h4" size="lg">
          No {name} configured
        </Title>
        <EmptyStateBody>
          There's no {name} in your configuration, to add one click on the
          button below.{' '}
        </EmptyStateBody>
        <Button variant="primary" onClick={addNewConfig}>
          Add {pronoun} {name}
        </Button>
      </EmptyState>
    );
  }

  return (
    <Form isHorizontal isWidthLimited>
      {configs.map((config, index) => {
        return (
          <AcceptorConfigSection
            key={config.name + brokerId + index}
            configType={configType}
            configName={config.name}
          />
        );
      })}
      <ActionGroup>
        <Button variant="primary" onClick={addNewConfig}>
          Add {pronoun} {name}
        </Button>
      </ActionGroup>
    </Form>
  );
};
