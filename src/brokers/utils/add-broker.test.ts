import { SelectOptionObject } from '@patternfly/react-core';
import {
  ArtemisReducerOperations,
  EditorType,
  ExposeMode,
  artemisCrReducer,
  newArtemisCRState,
} from './add-broker';

describe('test the creation broker reducer', () => {
  const newOptionObject = (value: string): SelectOptionObject => {
    return {
      toString() {
        return value;
      },
    };
  };
  it('test addAcceptor', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    expect(newState.cr.spec.acceptors).toHaveLength(1);
    expect(newState.cr.spec.acceptors[0].name).toBe('acceptors0');
    expect(newState.cr.spec.acceptors[0].port).toBe(5555);
    expect(newState.cr.spec.acceptors[0].protocols).toBe('ALL');
    expect(newState.cr.spec.brokerProperties).toHaveLength(1);
    expect(newState.cr.spec.brokerProperties).toContain(
      'acceptorConfigurations.acceptors0.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
    );
  });

  it('test addConnector', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    expect(newState.cr.spec.connectors).toHaveLength(1);
    expect(newState.cr.spec.connectors[0].name).toBe('connectors0');
    expect(newState.cr.spec.connectors[0].port).toBe(5555);
    expect(newState.cr.spec.connectors[0].host === 'localhost');
    expect(newState.cr.spec.brokerProperties).toHaveLength(1);
    expect(newState.cr.spec.brokerProperties).toContain(
      'connectorConfigurations.connectors0.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
    );
  });

  it('test replicas decrementReplicas', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.decrementReplicas,
    });
    // default size is 1 decrementing should result of a size of 1
    expect(newState.cr.spec.deploymentPlan.size).toBe(1);
    // set the number of replicas to 10 before decrementing so that the total
    // number should be 9
    const newState2 = artemisCrReducer(
      artemisCrReducer(newState, {
        operation: ArtemisReducerOperations.setReplicasNumber,
        payload: 10,
      }),
      {
        operation: ArtemisReducerOperations.decrementReplicas,
      },
    );
    expect(newState2.cr.spec.deploymentPlan.size).toBe(9);
  });

  it('test deleteAcceptor', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.deleteAcceptor,
      payload: 'acceptors0',
    });
    expect(newState2.cr.spec.acceptors).toHaveLength(0);
    expect(newState2.cr.spec.brokerProperties).not.toContain(
      'acceptorConfigurations.acceptors0.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
    );
  });

  it('test deleteConnector', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Connector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    const newState2 = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.deleteConnector,
      payload: 'connectors0',
    });
    expect(newState2.cr.spec.connectors).toHaveLength(0);
    expect(newState2.cr.spec.brokerProperties).not.toContain(
      'connectorConfigurations.connectors0.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
    );
  });

  it('test incrementReplicas', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.incrementReplicas,
    });
    // default size is 1 decrementing should result of a size of 1
    expect(newState.cr.spec.deploymentPlan.size).toBe(2);
  });

  it('test incrementReplicas', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.incrementReplicas,
    });
    // default size is 1 decrementing should result of a size of 1
    expect(newState.cr.spec.deploymentPlan.size).toBe(2);
  });

  it('test setAcceptorBindToAllInterfaces', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    expect(stateWith1Acceptor.cr.spec.acceptors[0].bindToAllInterfaces).toBe(
      undefined,
    );
    const newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorBindToAllInterfaces,
      payload: {
        name: 'acceptors0',
        bindToAllInterfaces: true,
      },
    });
    expect(newState2.cr.spec.acceptors[0].bindToAllInterfaces).toBe(true);
    const newState3 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorBindToAllInterfaces,
      payload: {
        name: 'acceptors0',
        bindToAllInterfaces: false,
      },
    });
    expect(newState3.cr.spec.acceptors[0].bindToAllInterfaces).toBe(false);
  });

  it('test setAcceptorName', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorName,
      payload: {
        oldName: 'acceptors0',
        newName: 'superName',
      },
    });
    expect(newState2.cr.spec.acceptors[0].name).toBe('superName');
    expect(newState2.cr.spec.brokerProperties).toContain(
      'acceptorConfigurations.superName.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
    );
  });

  it('test renaming an acceptor to an existing name to have no effect', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const stateWith2Acceptor = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const newState3 = artemisCrReducer(stateWith2Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorName,
      payload: {
        oldName: 'acceptors1',
        newName: 'acceptors0',
      },
    });
    expect(newState3.cr.spec.acceptors[0].name).toBe('acceptors0');
    expect(newState3.cr.spec.acceptors[1].name).toBe('acceptors1');
  });

  it('test setAcceptorOtherParams', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorOtherParams,
      payload: {
        name: 'acceptors0',
        otherParams: new Map<string, string>([
          ['aKey', 'aValue'],
          ['bKey', 'bValue'],
        ]),
      },
    });
    expect(newState2.cr.spec.brokerProperties).toContain(
      'acceptorConfigurations.acceptors0.params.aKey=aValue',
    );
    expect(newState2.cr.spec.brokerProperties).toContain(
      'acceptorConfigurations.acceptors0.params.bKey=bValue',
    );
    const newState3 = artemisCrReducer(newState2, {
      operation: ArtemisReducerOperations.setAcceptorOtherParams,
      payload: {
        name: 'acceptors0',
        otherParams: new Map<string, string>([['aKey', 'aValue']]),
      },
    });
    expect(newState3.cr.spec.brokerProperties).toContain(
      'acceptorConfigurations.acceptors0.params.aKey=aValue',
    );
    expect(newState3.cr.spec.brokerProperties).not.toContain(
      'acceptorConfigurations.acceptors0.params.bKey=bValue',
    );
  });

  it('test setAcceptorPort', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorPort,
      payload: {
        name: 'acceptors0',
        port: 6666,
      },
    });
    expect(newState2.cr.spec.acceptors[0].port).toBe(6666);
  });

  it('test setAcceptorProtocols', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorProtocols,
      payload: {
        configName: 'acceptors0',
        protocols: 'ALL,SOMETHING',
      },
    });
    expect(newState2.cr.spec.acceptors[0].protocols).toBe('ALL,SOMETHING');
  });

  it('test setAcceptorSSLEnabled', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorSSLEnabled,
      payload: {
        name: 'acceptors0',
        sslEnabled: true,
      },
    });
    expect(newState2.cr.spec.acceptors[0].sslEnabled).toBe(true);
  });

  it('test setAcceptorSecret', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorSecret,
      payload: {
        name: 'acceptors0',
        isCa: false,
        secret: newOptionObject('toto'),
      },
    });
    expect(newState2.cr.spec.acceptors[0].sslSecret).toBe('toto');
    const newState3 = artemisCrReducer(newState2, {
      operation: ArtemisReducerOperations.setAcceptorSecret,
      payload: {
        name: 'acceptors0',
        isCa: true,
        secret: newOptionObject('toto'),
      },
    });
    expect(newState3.cr.spec.acceptors[0].trustSecret).toBe('toto');
  });

  it('test setBrokerName', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setBrokerName,
      payload: 'newName',
    });
    expect(newState.cr.metadata.name).toBe('newName');
  });

  // enchaine avec le lwoercase
  it('test setConnectorBindToAllInterfaces', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Connector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    expect(stateWith1Connector.cr.spec.connectors[0].bindToAllInterfaces).toBe(
      undefined,
    );
    const newState2 = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.setConnectorBindToAllInterfaces,
      payload: {
        name: 'connectors0',
        bindToAllInterfaces: true,
      },
    });
    expect(newState2.cr.spec.connectors[0].bindToAllInterfaces).toBe(true);
    const newState3 = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.setConnectorBindToAllInterfaces,
      payload: {
        name: 'connectors0',
        bindToAllInterfaces: false,
      },
    });
    expect(newState3.cr.spec.connectors[0].bindToAllInterfaces).toBe(false);
  });

  it('test setConnectorHost', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Connector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    const newState2 = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.setConnectorHost,
      payload: {
        connectorName: 'connectors0',
        host: 'superHost',
      },
    });
    expect(newState2.cr.spec.connectors[0].host).toBe('superHost');
  });

  it('test setConnectorName', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Connector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    const newState2 = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.setConnectorName,
      payload: {
        oldName: 'connectors0',
        newName: 'superName',
      },
    });
    expect(newState2.cr.spec.connectors[0].name).toBe('superName');
    expect(newState2.cr.spec.brokerProperties).toContain(
      'connectorConfigurations.superName.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
    );
  });

  it('test renaming an connector to an existing name to have no effect', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Connector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    const stateWith2Connector = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.addConnector,
    });
    const newState3 = artemisCrReducer(stateWith2Connector, {
      operation: ArtemisReducerOperations.setConnectorName,
      payload: {
        oldName: 'connectors1',
        newName: 'connectors0',
      },
    });
    expect(newState3.cr.spec.connectors[0].name).toBe('connectors0');
    expect(newState3.cr.spec.connectors[1].name).toBe('connectors1');
  });

  it('test setConnectorOtherParams', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Connector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    const newState2 = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.setConnectorOtherParams,
      payload: {
        name: 'connectors0',
        otherParams: new Map<string, string>([
          ['aKey', 'aValue'],
          ['bKey', 'bValue'],
        ]),
      },
    });
    expect(newState2.cr.spec.brokerProperties).toContain(
      'connectorConfigurations.connectors0.params.aKey=aValue',
    );
    expect(newState2.cr.spec.brokerProperties).toContain(
      'connectorConfigurations.connectors0.params.bKey=bValue',
    );
    const newState3 = artemisCrReducer(newState2, {
      operation: ArtemisReducerOperations.setConnectorOtherParams,
      payload: {
        name: 'connectors0',
        otherParams: new Map<string, string>([['aKey', 'aValue']]),
      },
    });
    expect(newState3.cr.spec.brokerProperties).toContain(
      'connectorConfigurations.connectors0.params.aKey=aValue',
    );
    expect(newState3.cr.spec.brokerProperties).not.toContain(
      'connectorConfigurations.connectors0.params.bKey=bValue',
    );
  });

  it('test setConnectorPort', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Connector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    const newState2 = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.setConnectorPort,
      payload: {
        name: 'connectors0',
        port: 6666,
      },
    });
    expect(newState2.cr.spec.connectors[0].port).toBe(6666);
  });

  it('test setConnectorProtocols', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Connector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    const newState2 = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.setConnectorProtocols,
      payload: {
        configName: 'connectors0',
        protocols: 'ALL,SOMETHING',
      },
    });
    expect(newState2.cr.spec.connectors[0].protocols).toBe('ALL,SOMETHING');
  });

  it('test setConnectorSSLEnabled', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Connector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    const newState2 = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.setConnectorSSLEnabled,
      payload: {
        name: 'connectors0',
        sslEnabled: true,
      },
    });
    expect(newState2.cr.spec.connectors[0].sslEnabled).toBe(true);
  });

  it('test setConnectorSecret', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Connector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    const newState2 = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.setConnectorSecret,
      payload: {
        name: 'connectors0',
        isCa: false,
        secret: newOptionObject('toto'),
      },
    });
    expect(newState2.cr.spec.connectors[0].sslSecret).toBe('toto');
    const newState3 = artemisCrReducer(newState2, {
      operation: ArtemisReducerOperations.setConnectorSecret,
      payload: {
        name: 'connectors0',
        isCa: true,
        secret: newOptionObject('toto'),
      },
    });
    expect(newState3.cr.spec.connectors[0].trustSecret).toBe('toto');
  });

  it('test setConsoleCredentials', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setConsoleCredentials,
      payload: {
        adminUser: 'some',
        adminPassword: 'thing',
      },
    });
    expect(newState.cr.spec.console.adminUser).toBe('some');
    expect(newState.cr.spec.console.adminPassword).toBe('thing');
  });

  it('test setConsoleExpose', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setConsoleExpose,
      payload: true,
    });
    expect(newState.cr.spec.console.expose).toBe(true);
  });

  it('test setConsoleExposeMode', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setConsoleExposeMode,
      payload: ExposeMode.ingress,
    });
    expect(newState.cr.spec.console.exposeMode).toBe(ExposeMode.ingress);
  });

  it('test setConsoleSSLEnabled', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setConsoleSSLEnabled,
      payload: true,
    });
    expect(newState.cr.spec.console.sslEnabled).toBe(true);
  });

  it('test setConsoleSecret', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setConsoleSecret,
      payload: {
        name: 'console',
        isCa: true,
        secret: newOptionObject('toto'),
      },
    });
    expect(newState.cr.spec.console.trustSecret).toBe('toto');
  });

  it('test setEditorType', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setEditorType,
      payload: EditorType.BROKER,
    });
    expect(newState.editorType).toBe(EditorType.BROKER);
  });

  it('test setNamespace', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setNamespace,
      payload: 'newNamespace',
    });
    expect(newState.cr.metadata.namespace).toBe('newNamespace');
  });

  it('test replicas setReplicasNumber', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setReplicasNumber,
      payload: 10,
    });
    expect(newState.cr.spec.deploymentPlan.size).toBe(10);
  });

  it('test updateAcceptorFactoryClass', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.updateAcceptorFactoryClass,
      payload: {
        name: 'acceptors0',
        class: 'invm',
      },
    });
    expect(newState2.cr.spec.brokerProperties).toContain(
      'acceptorConfigurations.acceptors0.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.invm.InVMAcceptorFactory',
    );
    const newState3 = artemisCrReducer(newState2, {
      operation: ArtemisReducerOperations.updateAcceptorFactoryClass,
      payload: {
        name: 'acceptors0',
        class: 'netty',
      },
    });
    expect(newState3.cr.spec.brokerProperties).toContain(
      'acceptorConfigurations.acceptors0.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
    );
  });

  it('test updateConnectorFactoryClass', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    const newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.updateConnectorFactoryClass,
      payload: {
        name: 'connectors0',
        class: 'invm',
      },
    });
    expect(newState2.cr.spec.brokerProperties).toContain(
      'connectorConfigurations.connectors0.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.invm.InVMAcceptorFactory',
    );
    const newState3 = artemisCrReducer(newState2, {
      operation: ArtemisReducerOperations.updateConnectorFactoryClass,
      payload: {
        name: 'connectors0',
        class: 'netty',
      },
    });
    expect(newState3.cr.spec.brokerProperties).toContain(
      'connectorConfigurations.connectors0.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
    );
  });

  it('test activatePEMGenerationForAcceptor', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const stateWithPEM = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.activatePEMGenerationForAcceptor,
      payload: {
        acceptor: 'acceptors0',
        issuer: 'someIssuer',
      },
    });
    expect(stateWithPEM.cr.spec.acceptors[0].sslEnabled).toBe(true);
    expect(stateWithPEM.cr.spec.acceptors[0].exposeMode).toBe(
      ExposeMode.ingress,
    );
    expect(stateWithPEM.cr.spec.acceptors[0].ingressHost).toBe(
      'ing.$(ITEM_NAME).$(CR_NAME)-$(BROKER_ORDINAL).$(CR_NAMESPACE).$(INGRESS_DOMAIN)',
    );
    expect(stateWithPEM.cr.spec.acceptors[0].sslSecret).toBe(
      'ex-aao-acceptors0-0-svc-ing-ptls',
    );
    expect(stateWithPEM.cr.spec.resourceTemplates).toHaveLength(1);
    expect(stateWithPEM.cr.spec.resourceTemplates[0].selector.name).toBe(
      'ex-aao' + '-' + 'acceptors0' + '-0-svc-ing',
    );
    expect(stateWithPEM.cr.spec.resourceTemplates[0].selector.name).toBe(
      'ex-aao' + '-' + 'acceptors0' + '-0-svc-ing',
    );
    expect(
      stateWithPEM.cr.spec.resourceTemplates[0].patch.spec.tls[0].hosts[0],
    ).toBe(
      'ing.' +
        'acceptors0' +
        '.' +
        'ex-aao' +
        '-0.' +
        'namespace' +
        '.' +
        'apps-crc.testing',
    );
    // update broker name
    const updatedBrokerName = artemisCrReducer(stateWithPEM, {
      operation: ArtemisReducerOperations.setBrokerName,
      payload: 'bro',
    });
    expect(updatedBrokerName.cr.spec.acceptors[0].sslSecret).toBe(
      'bro-acceptors0-0-svc-ing-ptls',
    );
    expect(updatedBrokerName.cr.spec.resourceTemplates).toHaveLength(1);
    expect(updatedBrokerName.cr.spec.resourceTemplates[0].selector.name).toBe(
      'bro' + '-' + 'acceptors0' + '-0-svc-ing',
    );
    expect(updatedBrokerName.cr.spec.resourceTemplates[0].selector.name).toBe(
      'bro' + '-' + 'acceptors0' + '-0-svc-ing',
    );
    expect(
      updatedBrokerName.cr.spec.resourceTemplates[0].patch.spec.tls[0].hosts[0],
    ).toBe(
      'ing.' +
        'acceptors0' +
        '.' +
        'bro' +
        '-0.' +
        'namespace' +
        '.' +
        'apps-crc.testing',
    );
    // update broker name
    const updatedNamespace = artemisCrReducer(updatedBrokerName, {
      operation: ArtemisReducerOperations.setNamespace,
      payload: 'space',
    });
    expect(updatedNamespace.cr.spec.resourceTemplates).toHaveLength(1);
    expect(
      updatedNamespace.cr.spec.resourceTemplates[0].patch.spec.tls[0].hosts[0],
    ).toBe(
      'ing.' +
        'acceptors0' +
        '.' +
        'bro' +
        '-0.' +
        'space' +
        '.' +
        'apps-crc.testing',
    );
    // update broker name
    const updatedDomain = artemisCrReducer(updatedNamespace, {
      operation: ArtemisReducerOperations.setIngressDomain,
      payload: 'tttt.com',
    });
    expect(updatedDomain.cr.spec.resourceTemplates).toHaveLength(1);
    expect(
      updatedDomain.cr.spec.resourceTemplates[0].patch.spec.tls[0].hosts[0],
    ).toBe(
      'ing.' + 'acceptors0' + '.' + 'bro' + '-0.' + 'space' + '.' + 'tttt.com',
    );
    // update Acceptor name
    const updatedAcceptorName = artemisCrReducer(updatedDomain, {
      operation: ArtemisReducerOperations.setAcceptorName,
      payload: {
        oldName: 'acceptors0',
        newName: 'bob',
      },
    });
    expect(updatedAcceptorName.cr.spec.acceptors[0].sslEnabled).toBe(true);
    expect(updatedAcceptorName.cr.spec.acceptors[0].exposeMode).toBe(
      ExposeMode.ingress,
    );
    expect(updatedAcceptorName.cr.spec.acceptors[0].ingressHost).toBe(
      'ing.$(ITEM_NAME).$(CR_NAME)-$(BROKER_ORDINAL).$(CR_NAMESPACE).$(INGRESS_DOMAIN)',
    );
    expect(updatedAcceptorName.cr.spec.acceptors[0].sslSecret).toBe(
      'bro-bob-0-svc-ing-ptls',
    );
    expect(updatedAcceptorName.cr.spec.resourceTemplates).toHaveLength(1);
    expect(updatedAcceptorName.cr.spec.resourceTemplates[0].selector.name).toBe(
      'bro' + '-' + 'bob' + '-0-svc-ing',
    );
    expect(updatedAcceptorName.cr.spec.resourceTemplates[0].selector.name).toBe(
      'bro' + '-' + 'bob' + '-0-svc-ing',
    );
    expect(
      updatedAcceptorName.cr.spec.resourceTemplates[0].patch.spec.tls[0]
        .hosts[0],
    ).toBe('ing.' + 'bob' + '.' + 'bro' + '-0.' + 'space' + '.' + 'tttt.com');
  });

  it('test deletePEMGenerationForAcceptor', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const stateWithPEM = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.activatePEMGenerationForAcceptor,
      payload: {
        acceptor: 'acceptors0',
        issuer: 'someIssuer',
      },
    });
    const stateWithDeletedPEM = artemisCrReducer(stateWithPEM, {
      operation: ArtemisReducerOperations.deletePEMGenerationForAcceptor,
      payload: 'acceptors0',
    });
    expect(stateWithDeletedPEM.cr.spec.acceptors[0].sslEnabled).toBe(undefined);
    expect(stateWithDeletedPEM.cr.spec.acceptors[0].sslSecret).toBe(undefined);
    expect(stateWithDeletedPEM.cr.spec.resourceTemplates).toBe(undefined);
  });

  it('test setAcceptorExposeMode,', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const stateExposeModeIngress = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorExposeMode,
      payload: {
        name: 'acceptors0',
        exposeMode: ExposeMode.ingress,
      },
    });
    expect(stateExposeModeIngress.cr.spec.acceptors[0].exposeMode).toBe(
      ExposeMode.ingress,
    );
  });

  it('test setAcceptorIngressHost,', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const stateExposeModeIngress = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorIngressHost,
      payload: {
        name: 'acceptors0',
        ingressHost: 'tuytutu',
      },
    });
    expect(stateExposeModeIngress.cr.spec.acceptors[0].ingressHost).toBe(
      'tuytutu',
    );
  });

  it('test setIsAcceptorExposed,', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const stateExposeModeIngress = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setIsAcceptorExposed,
      payload: {
        name: 'acceptors0',
        isExposed: true,
      },
    });
    expect(stateExposeModeIngress.cr.spec.acceptors[0].expose).toBe(true);
  });
});
