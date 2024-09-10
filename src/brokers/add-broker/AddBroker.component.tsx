import { FC, useContext, useState } from 'react';
import {
  ActionGroup,
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Divider,
  Form,
  FormFieldGroup,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  EditorType,
} from '../../reducers/7.12/reducer';
import { FormView } from '../../shared-components/FormView/FormView';
import { EditorToggle } from './components/EditorToggle/EditorToggle';
import { Loading } from '../../shared-components/Loading/Loading';
import { useAccessReview } from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel } from '../../k8s/models';
import { useTranslation } from '../../i18n/i18n';
import { YamlEditorView } from '../../shared-components/YamlEditorView/YamlEditorView';

type AddBrokerPropTypes = {
  onSubmit: () => void;
  onCancel: () => void;
  isUpdatingExisting?: boolean;
  reloadExisting?: () => void;
};

export const AddBroker: FC<AddBrokerPropTypes> = ({
  onSubmit,
  onCancel: doQuit,
  isUpdatingExisting,
  reloadExisting,
}) => {
  const formValues = useContext(BrokerCreationFormState);
  const dispatch = useContext(BrokerCreationFormDispatch);

  const { editorType } = formValues;

  const [userWantsToQuit, setUserWantsToQuit] = useState<boolean>(false);
  const [userWantsToReload, setUserWantsToReload] = useState<boolean>(false);

  const [pendingActionQuittingYAMLView, setPendingActionQuittingYAMLView] =
    useState<'switch' | 'submit'>('switch');
  const [wantsToQuitYamlView, setWantsToQuitYamlView] = useState(false);
  const onSelectEditorType = (editorType: EditorType) => {
    if (formValues.editorType === EditorType.YAML) {
      if (editorType === EditorType.BROKER) {
        setWantsToQuitYamlView(true);
      }
      setPendingActionQuittingYAMLView('switch');
    } else {
      dispatch({
        operation: ArtemisReducerOperations.setEditorType,
        payload: EditorType.YAML,
      });
    }
  };
  const [triggerDelayedSubmit, setTriggerDelayedSubmit] = useState(false);
  const [prevTriggerDelayedSubmit, setPrevTriggerDelayedSubmit] =
    useState(triggerDelayedSubmit);
  const onQuittingYamlView = () => {
    if (pendingActionQuittingYAMLView === 'switch') {
      setWantsToQuitYamlView(false);
      dispatch({
        operation: ArtemisReducerOperations.setEditorType,
        payload: EditorType.BROKER,
      });
    }
    if (pendingActionQuittingYAMLView === 'submit') {
      setWantsToQuitYamlView(false);
      setTriggerDelayedSubmit(true);
    }
  };
  if (triggerDelayedSubmit !== prevTriggerDelayedSubmit) {
    if (triggerDelayedSubmit) {
      setTriggerDelayedSubmit(false);
      onSubmit();
    }
    setPrevTriggerDelayedSubmit(triggerDelayedSubmit);
  }

  const { t } = useTranslation();
  const namespace = formValues.cr.metadata.namespace;
  const [canCreateBroker, loadingAccessReview] = useAccessReview({
    group: AMQBrokerModel.apiGroup,
    resource: AMQBrokerModel.plural,
    namespace,
    verb: 'create',
  });
  if (loadingAccessReview) return <Loading />;
  if (!canCreateBroker) {
    return (
      <Alert
        variant={AlertVariant.custom}
        title={t('broker_can_not_be_created')}
        isInline
      >
        {t('you_do_not_have_write_access')}
      </Alert>
    );
  }
  return (
    <>
      <Modal
        variant={ModalVariant.small}
        title="Unsaved changes"
        isOpen={userWantsToQuit}
        onClose={() => setUserWantsToQuit(false)}
        actions={[
          <Button key="confirm" variant="primary" onClick={doQuit}>
            Confirm
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => setUserWantsToQuit(false)}
          >
            Cancel
          </Button>,
        ]}
      >
        You are about to quit the editor,{' '}
        {isUpdatingExisting
          ? 'configuration that is not applied will be lost'
          : "the broker won't get created"}
      </Modal>
      <Modal
        variant={ModalVariant.small}
        title="Unsaved changes"
        isOpen={userWantsToReload}
        onClose={() => setUserWantsToReload(false)}
        actions={[
          <Button key="confirm" variant="primary" onClick={reloadExisting}>
            Confirm
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => setUserWantsToReload(false)}
          >
            Cancel
          </Button>,
        ]}
      >
        Upon reloading, these modifications will be lost.
      </Modal>
      <Divider />
      <EditorToggle value={editorType} onChange={onSelectEditorType} />
      <Divider />
      {editorType === EditorType.BROKER && <FormView />}
      {editorType === EditorType.YAML && (
        <YamlEditorView
          isAskingPermissionToClose={wantsToQuitYamlView}
          permissionGranted={onQuittingYamlView}
          permissionDenied={() => setWantsToQuitYamlView(false)}
        />
      )}
      <Form>
        <FormFieldGroup>
          <ActionGroup>
            <Button
              variant={ButtonVariant.primary}
              onClick={() => {
                if (formValues.editorType === EditorType.YAML) {
                  setWantsToQuitYamlView(true);
                  setPendingActionQuittingYAMLView('submit');
                } else {
                  onSubmit();
                }
              }}
            >
              {isUpdatingExisting ? 'Apply' : 'Create'}
            </Button>
            {isUpdatingExisting && (
              <Button
                variant={ButtonVariant.secondary}
                onClick={() => {
                  if (formValues.hasChanges) {
                    setUserWantsToReload(true);
                  } else {
                    reloadExisting();
                  }
                }}
              >
                Reload
              </Button>
            )}
            <Button
              variant={ButtonVariant.link}
              onClick={() => {
                if (formValues.hasChanges) {
                  setUserWantsToQuit(true);
                } else {
                  doQuit();
                }
              }}
            >
              Cancel
            </Button>
          </ActionGroup>
        </FormFieldGroup>
      </Form>
    </>
  );
};
