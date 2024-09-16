import { Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { FC } from 'react';
import { useTranslation } from '@app/i18n/i18n';

type ChartPopoverProps = {
  title: string;
  description: string;
};

export const ChartPopover: FC<ChartPopoverProps> = ({ title, description }) => {
  const { t } = useTranslation();

  return (
    <Popover
      aria-label={title}
      headerContent={<div>{title}</div>}
      bodyContent={<div>{description}</div>}
    >
      <OutlinedQuestionCircleIcon
        aria-label={t('Information about {{title}}', {
          title,
        })}
      />
    </Popover>
  );
};
