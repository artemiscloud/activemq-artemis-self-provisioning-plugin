import { CardBody, Bullseye, Spinner } from '@patternfly/react-core';
import type { FunctionComponent } from 'react';

export const CardBodyLoading: FunctionComponent = () => (
  <CardBody>
    <Bullseye>
      <Spinner data-chromatic="ignore" data-testid="spinner" />
    </Bullseye>
  </CardBody>
);
