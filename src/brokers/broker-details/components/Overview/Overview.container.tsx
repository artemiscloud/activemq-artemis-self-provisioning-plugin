import { FC } from 'react';
import * as _ from 'lodash-es';
import { Page } from '@patternfly/react-core';
import { Metrics } from '../../../metrics';
import { Loading } from '../../../../shared-components';

export type OverviewContainerProps = {
  namespace: string;
  name: string;
  size: number;
  loading: boolean;
};

export const OverviewContainer: FC<OverviewContainerProps> = ({
  namespace,
  name,
  size,
  loading,
}) => {
  if (loading) return <Loading />;

  return (
    <Page>
      <Metrics name={name} namespace={namespace} size={size} />
    </Page>
  );
};
