import { FC, useReducer, useState } from 'react';
import { AlertVariant, Divider } from '@patternfly/react-core';
import { YamlEditorView, EditorToggle, FormView } from './components';
import { K8sResourceCommon as ArtemisCR } from '../../utils';

type AddTlsBrokerProps = {
  namespace: string;
  isEditWorkFlow?: boolean;
  notification: { title: string; variant: AlertVariant };
  createBroker: (data?: ArtemisCR) => void;
};

export enum ArtemisReducerFields {
  ALL,
  brokerName,
  acceptorName,
  acceptorPort,
  ingressDomain,
  issuer,
}

export type ArtemisReducerAction = {
  field: ArtemisReducerFields;
  value: string | number | ArtemisCR;
};

const artemisCrReducer: React.Reducer<ArtemisCR, ArtemisReducerAction> = (
  prevCr,
  action,
) => {
  const cr = { ...prevCr };
  const createSpec = (cr: ArtemisCR) => {
    if (!cr.spec) {
      cr.spec = {};
    }
  };
  const createAcceptor = (cr: ArtemisCR) => {
    createSpec(cr);
    if (!cr.spec.acceptors) {
      cr.spec.acceptors = [
        {
          sslEnabled: true,
          expose: true,
          exposeMode: 'ingress',
          ingressHost:
            'ing.$(ITEM_NAME).$(CR_NAME)-$(BROKER_ORDINAL).$(CR_NAMESPACE).$(INGRESS_DOMAIN)',
        },
      ];
    }
  };
  const createResourceTemplate = (cr: ArtemisCR) => {
    createSpec(cr);
    if (!cr.spec.resourceTemplates) {
      cr.spec.resourceTemplates = [{}];
    }
    if (!cr.spec.resourceTemplates[0].annotations) {
      cr.spec.resourceTemplates[0].annotations = {};
    }
  };
  const createResourceTemplatePatch = (cr: ArtemisCR) => {
    createResourceTemplate(cr);
    if (!cr.spec.resourceTemplates[0].patch) {
      cr.spec.resourceTemplates[0].patch = {
        kind: 'Ingress',
      };
    }
    if (!cr.spec.resourceTemplates[0].patch.spec) {
      cr.spec.resourceTemplates[0].patch.spec = {};
    }
    if (!cr.spec.resourceTemplates[0].patch.spec.tls) {
      cr.spec.resourceTemplates[0].patch.spec.tls = [{}];
    }
  };
  const createResourceTemplateSelector = (cr: ArtemisCR) => {
    createResourceTemplate(cr);
    if (!cr.spec.resourceTemplates[0].selector) {
      cr.spec.resourceTemplates[0].selector = {
        kind: 'Ingress',
      };
    }
  };

  // set the individual fields
  switch (action.field) {
    case ArtemisReducerFields.ALL: // escape hatch to set the entire CR
      if (
        typeof action.value === 'string' ||
        typeof action.value === 'number'
      ) {
        throw Error('action: ' + action.field + ' needs arg of type ArtemisCR');
      }
      return action.value;
    case ArtemisReducerFields.brokerName:
      if (typeof action.value !== 'string') {
        throw Error('action: ' + action.field + ' needs arg of type string');
      }
      cr.metadata.name = action.value;
      break;
    case ArtemisReducerFields.acceptorName:
      if (typeof action.value !== 'string') {
        throw Error('action: ' + action.field + ' needs arg of type string');
      }
      createAcceptor(cr);
      cr.spec.acceptors[0].name = action.value;
      break;
    case ArtemisReducerFields.acceptorPort:
      if (typeof action.value !== 'number') {
        throw Error('action: ' + action.field + ' needs arg of type number');
      }
      createAcceptor(cr);
      cr.spec.acceptors[0].port = action.value;
      break;
    case ArtemisReducerFields.ingressDomain:
      if (typeof action.value !== 'string') {
        throw Error('action: ' + action.field + ' needs arg of type string');
      }
      createSpec(cr);
      cr.spec.ingressDomain = action.value;
      break;
    case ArtemisReducerFields.issuer:
      if (typeof action.value !== 'string') {
        throw Error('action: ' + action.field + ' needs arg of type string');
      }
      createResourceTemplate(cr);
      cr.spec.resourceTemplates[0].annotations['cert-manager.io/issuer'] =
        action.value;
      break;
    default:
      throw Error('Unknown action: ' + action);
  }

  // update the composed fields
  if (cr.spec?.acceptors && cr.spec.acceptors[0].name) {
    const secretName =
      cr.metadata.name + '-' + cr.spec.acceptors[0].name + '-0-svc-ing-ptls';
    cr.spec.acceptors[0].sslSecret = secretName;

    createResourceTemplatePatch(cr);
    cr.spec.resourceTemplates[0].patch.spec.tls[0].secretName = secretName;
    if (cr.spec.ingressDomain) {
      cr.spec.resourceTemplates[0].patch.spec.tls[0].hosts = [
        'ing.' +
          cr.spec.acceptors[0].name +
          '.' +
          cr.metadata.name +
          '-0.' +
          cr.metadata.namespace +
          '.' +
          cr.spec.ingressDomain,
      ];
    }

    createResourceTemplateSelector(cr);
    cr.spec.resourceTemplates[0].selector.name =
      cr.metadata.name + '-' + cr.spec.acceptors[0].name + '-0-' + 'svc-ing';
  }
  return cr;
};

const AddTlsBroker: FC<AddTlsBrokerProps> = ({
  namespace,
  createBroker,
  notification,
}) => {
  const [isFormEditor, setIsFormEditor] = useState<boolean>(true);
  const [cr, dispatch] = useReducer(artemisCrReducer, {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      name: 'default',
      namespace,
    },
    spec: {
      ingressDomain: 'apps-crc.testing',
      deploymentPlan: {
        image: 'placeholder',
        requireLogin: false,
        size: 1,
      },
    },
  });

  return (
    <>
      <EditorToggle
        isFormEditor={isFormEditor}
        switchFunction={() => setIsFormEditor(!isFormEditor)}
      />
      <Divider />
      {isFormEditor && (
        <FormView
          namespace={namespace}
          formValues={cr}
          dispatch={dispatch}
          onCreateBroker={createBroker}
          serverNotification={notification}
        />
      )}
      {!isFormEditor && (
        <YamlEditorView
          namespace={namespace}
          cr={cr}
          dispatch={dispatch}
          serverNotification={notification}
        />
      )}
    </>
  );
};

export default AddTlsBroker;
