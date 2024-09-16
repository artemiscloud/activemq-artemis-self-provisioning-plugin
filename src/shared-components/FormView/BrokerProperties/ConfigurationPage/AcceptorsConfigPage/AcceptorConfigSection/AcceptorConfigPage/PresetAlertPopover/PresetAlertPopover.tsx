import { FC, useContext } from 'react';
import { ConfigType } from '../../../../ConfigurationPage';
import {
  BrokerCreationFormState,
  getAcceptor,
  getCertManagerResourceTemplateFromAcceptor,
} from '@app/reducers/7.12/reducer';
import { useTranslation } from '@app/i18n/i18n';
import { Alert, Icon, Popover } from '@patternfly/react-core';
import { BellIcon, WarningTriangleIcon } from '@patternfly/react-icons';

type PresetCautionProps = {
  configType: ConfigType;
  configName: string;
  kind: 'caution' | 'warning';
};

export const PresetAlertPopover: FC<PresetCautionProps> = ({
  configType,
  configName,
  kind,
}) => {
  const { cr } = useContext(BrokerCreationFormState);
  const { t } = useTranslation();
  const hasCertManagerPreset =
    configType === ConfigType.acceptors
      ? getCertManagerResourceTemplateFromAcceptor(
          cr,
          getAcceptor(cr, configName),
        ) !== undefined
      : false;

  if (!hasCertManagerPreset) {
    return <></>;
  }

  return (
    <Popover
      headerContent={
        <>
          {kind === 'caution' ? (
            <Alert
              variant="custom"
              title={t(
                'This setting is linked to a preset, proceed with caution',
              )}
              isPlain
              isInline
            />
          ) : (
            <Alert
              variant="warning"
              title={t(
                'This setting is linked to a preset, updating the value will result in the preset to be removed',
              )}
              isPlain
              isInline
            />
          )}
        </>
      }
      bodyContent=""
    >
      <button
        type="button"
        aria-label="More info for name field"
        onClick={(e) => e.preventDefault()}
        aria-describedby="simple-form-name-01"
        className="pf-c-form__group-label-help"
      >
        <>
          <Icon isInline>
            {kind === 'caution' ? <BellIcon /> : <WarningTriangleIcon />}
          </Icon>
        </>
      </button>
    </Popover>
  );
};
