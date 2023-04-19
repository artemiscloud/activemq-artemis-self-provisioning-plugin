import { FC } from 'react';
import * as _ from 'lodash';
import { Metrics } from '../../../metrics';
import { Page } from '@patternfly/react-core';

export type OverviewContainerProps = {
  namespace: string;
  name: string;
};

export const OverviewContainer: FC<OverviewContainerProps> = ({
  namespace,
  name,
}) => {
  return (
    <Page>
      <Metrics name={name} namespace={namespace} />
    </Page>
  );
};
