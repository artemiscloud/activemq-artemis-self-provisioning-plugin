import { SelectOptionObject } from '@patternfly/react-core/deprecated';
import {
  ArtemisReducerOperations,
  EditorType,
  ExposeMode,
  artemisCrReducer,
  newArtemisCRState,
} from './reducer';

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
    // default size is 1 decrementing should result of a size of 0
    expect(newState.cr.spec.deploymentPlan.size).toBe(0);
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

  it('tests that the deployment replicas value cannot be decremented below 0', () => {
    const initialState = newArtemisCRState('namespace');
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.decrementReplicas,
    });
    // default size is 1 decrementing should result of a size of 0
    expect(newState.cr.spec.deploymentPlan.size).toBe(0);
    // Set the number of replicas to -1 and verify that the deployment replicas value cannot be decremented below 0.
    // The number should be set to 0.
    const newState2 = artemisCrReducer(
      artemisCrReducer(newState, {
        operation: ArtemisReducerOperations.setReplicasNumber,
        payload: -1,
      }),
      {
        operation: ArtemisReducerOperations.decrementReplicas,
      },
    );
    expect(newState2.cr.spec.deploymentPlan.size).toBe(0);
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

  it('should assigns unique ports to each new acceptor added', () => {
    const initialState = newArtemisCRState('namespace');

    // Add the first acceptor
    let newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    expect(newState.cr.spec.acceptors[0].port).toBe(5555);

    // Add a second acceptor
    newState = artemisCrReducer(newState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    expect(newState.cr.spec.acceptors[1].port).toBe(5556);

    // Add a third acceptor
    newState = artemisCrReducer(newState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    expect(newState.cr.spec.acceptors[2].port).toBe(5557);
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

  it('should increments next acceptor port based on manually set port value', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    let newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorPort,
      payload: {
        name: 'acceptors0',
        port: 6666,
      },
    });
    expect(newState2.cr.spec.acceptors[0].port).toBe(6666);

    newState2 = artemisCrReducer(newState2, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    expect(newState2.cr.spec.acceptors[1].port).toBe(6667);
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

  it('should assigns unique ports to each new connector added', () => {
    const initialState = newArtemisCRState('namespace');

    // Add the first connector
    let newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    expect(newState.cr.spec.connectors[0].port).toBe(5555);

    // Add a second connector
    newState = artemisCrReducer(newState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    expect(newState.cr.spec.connectors[1].port).toBe(5556);

    // Add a third connector
    newState = artemisCrReducer(newState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    expect(newState.cr.spec.connectors[2].port).toBe(5557);
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

  it('should increments next connector port based on manually set port value', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Connector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    let newState2 = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.setConnectorPort,
      payload: {
        name: 'connectors0',
        port: 6666,
      },
    });
    expect(newState2.cr.spec.connectors[0].port).toBe(6666);

    newState2 = artemisCrReducer(newState2, {
      operation: ArtemisReducerOperations.addConnector,
    });
    expect(newState2.cr.spec.connectors[1].port).toBe(6667);
  });

  it('test unique port allocation by combining both new added acceptors/connectors and verify correct port incrementation after manual port modification', () => {
    const initialState = newArtemisCRState('namespace');
    //Add first acceptor
    let newStateWithAcceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    expect(newStateWithAcceptor.cr.spec.acceptors[0].port).toBe(5555);

    //Add second acceptor
    newStateWithAcceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    expect(newStateWithAcceptor.cr.spec.acceptors[1].port).toBe(5556);

    // Manually change the port of the second acceptor to 5557
    newStateWithAcceptor = artemisCrReducer(newStateWithAcceptor, {
      operation: ArtemisReducerOperations.setAcceptorPort,
      payload: {
        name: 'acceptors1',
        port: 5557,
      },
    });
    expect(newStateWithAcceptor.cr.spec.acceptors[1].port).toBe(5557);

    //Add third acceptor
    newStateWithAcceptor = artemisCrReducer(newStateWithAcceptor, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    expect(newStateWithAcceptor.cr.spec.acceptors[2].port).toBe(5558);

    //Add first connector
    let newStateWithConnector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    expect(newStateWithConnector.cr.spec.connectors[0].port).toBe(5555);

    //Add second connector
    newStateWithConnector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    expect(newStateWithConnector.cr.spec.connectors[1].port).toBe(5556);

    // Manually change the port of the second connector to 5557
    newStateWithConnector = artemisCrReducer(newStateWithConnector, {
      operation: ArtemisReducerOperations.setConnectorPort,
      payload: {
        name: 'connectors1',
        port: 5557,
      },
    });
    expect(newStateWithConnector.cr.spec.connectors[1].port).toBe(5557);

    //Add third connector
    newStateWithConnector = artemisCrReducer(newStateWithConnector, {
      operation: ArtemisReducerOperations.addConnector,
    });
    expect(newStateWithConnector.cr.spec.connectors[2].port).toBe(5558);
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
    const stateWithIngressDomain = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setIngressDomain,
      payload: 'apps-crc.testing',
    });
    const stateWithPEM = artemisCrReducer(stateWithIngressDomain, {
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

  it('test changing number of replicas while in the PEM preset gives the correct number of hosts', () => {
    const initialState = newArtemisCRState('namespace');
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const stateWithIngressDomain = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setIngressDomain,
      payload: 'apps-crc.testing',
    });
    const stateWithPEM = artemisCrReducer(stateWithIngressDomain, {
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
    const stateWith2Replicas = artemisCrReducer(stateWithPEM, {
      operation: ArtemisReducerOperations.incrementReplicas,
    });
    expect(
      stateWith2Replicas.cr.spec.resourceTemplates[0].patch.spec.tls[0]
        .hosts[0],
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
    expect(
      stateWith2Replicas.cr.spec.resourceTemplates[0].patch.spec.tls[0]
        .hosts[1],
    ).toBe(
      'ing.' +
        'acceptors0' +
        '.' +
        'ex-aao' +
        '-1.' +
        'namespace' +
        '.' +
        'apps-crc.testing',
    );
    expect(
      stateWith2Replicas.cr.spec.resourceTemplates[0].patch.spec.tls[0].hosts,
    ).toHaveLength(2);

    const newNumber = 10;
    const stateWith10Replicas = artemisCrReducer(stateWith2Replicas, {
      operation: ArtemisReducerOperations.setReplicasNumber,
      payload: newNumber,
    });
    expect(
      stateWith10Replicas.cr.spec.resourceTemplates[0].patch.spec.tls[0].hosts,
    ).toHaveLength(newNumber);
    for (let i = 0; i < newNumber; i++) {
      expect(
        stateWith10Replicas.cr.spec.resourceTemplates[0].patch.spec.tls[0]
          .hosts[i],
      ).toBe(
        'ing.' +
          'acceptors0' +
          '.' +
          'ex-aao' +
          '-' +
          i +
          '.' +
          'namespace' +
          '.' +
          'apps-crc.testing',
      );
    }
    const stateWith9Replicas = artemisCrReducer(stateWith10Replicas, {
      operation: ArtemisReducerOperations.decrementReplicas,
    });
    expect(
      stateWith9Replicas.cr.spec.resourceTemplates[0].patch.spec.tls[0].hosts,
    ).toHaveLength(9);
    for (let i = 0; i < 9; i++) {
      expect(
        stateWith10Replicas.cr.spec.resourceTemplates[0].patch.spec.tls[0]
          .hosts[i],
      ).toBe(
        'ing.' +
          'acceptors0' +
          '.' +
          'ex-aao' +
          '-' +
          i +
          '.' +
          'namespace' +
          '.' +
          'apps-crc.testing',
      );
    }
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
  it('test setYamlHasUnsavedChanges,', () => {
    const initialState = newArtemisCRState('namespace');
    const updatedState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setYamlHasUnsavedChanges,
    });
    expect(updatedState.yamlHasUnsavedChanges).toBe(true);
    expect(updatedState.hasChanges).toBe(false);
  });
  it('test machine controlled model update resets the changed flags,', () => {
    const initialState = newArtemisCRState('namespace');
    const updatedState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setModel,
      payload: {
        model: initialState.cr,
        isSetByUser: false,
      },
    });
    expect(updatedState.yamlHasUnsavedChanges).toBe(false);
    expect(updatedState.hasChanges).toBe(false);
  });
  it('test user controlled model update updates the flags correctly', () => {
    const initialState = newArtemisCRState('namespace');
    let updatedState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setYamlHasUnsavedChanges,
    });
    expect(updatedState.hasChanges).toBe(false);
    updatedState = artemisCrReducer(updatedState, {
      operation: ArtemisReducerOperations.setModel,
      payload: {
        model: initialState.cr,
        isSetByUser: true,
      },
    });
    expect(updatedState.yamlHasUnsavedChanges).toBe(false);
    expect(updatedState.hasChanges).toBe(true);
  });
});
