import { FC } from 'react';
import { CardTitle } from '@patternfly/react-core';
import { ChartPopover } from '../ChartPopover/ChartPopover';

export type ChartTitleProps = {
  title: string;
  helperText: string;
};

export const ChartTitle: FC<ChartTitleProps> = ({ title, helperText }) => {
  return (
    <CardTitle component="h3">
      {title} <ChartPopover title={title} description={helperText} />
    </CardTitle>
  );
};
