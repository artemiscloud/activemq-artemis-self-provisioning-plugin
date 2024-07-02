import { FC, useContext } from 'react';
import { ConfigType } from '../../../../ConfigurationPage';
import {
  BrokerCreationFormState,
  getAcceptor,
  getCertManagerResourceTemplateFromAcceptor,
} from '../../../../../../../../reducers/7.12/reducer';
import { useTranslation } from '../../../../../../../../i18n';
import { Alert, Popover } from '@patternfly/react-core';
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
              variant="default"
              title={t('preset_caution')}
              isPlain
              isInline
            />
          ) : (
            <Alert
              variant="warning"
              title={t('preset_warning')}
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
          {kind === 'caution' ? (
            <BellIcon noVerticalAlign />
          ) : (
            <WarningTriangleIcon noVerticalAlign />
          )}
        </>
      </button>
    </Popover>
  );
};
