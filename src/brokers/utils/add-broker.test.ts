import {
  ArtemisReducerOperations,
  artemisCrReducer,
  newArtemisCRState,
} from './add-broker';

describe('test the creation broker reducer', () => {
  const initialState = newArtemisCRState('namespace');

  it('test addAcceptor', () => {
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    expect(newState.cr.spec.acceptors);
    expect(newState.cr.spec.acceptors[0].name === 'acceptors0');
    expect(newState.cr.spec.acceptors[0].port === 5555);
    expect(newState.cr.spec.acceptors[0].protocols === 'ALL');
    expect(newState.cr.spec.brokerProperties);
    expect(
      newState.cr.spec.brokerProperties.includes(
        'acceptorConfigurations.acceptors0.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
      ),
    );
  });

  it('test addConnector', () => {
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    expect(newState.cr.spec.connectors);
    expect(newState.cr.spec.connectors[0].name === 'connectors0');
    expect(newState.cr.spec.connectors[0].port === 5555);
    expect(newState.cr.spec.connectors[0].host === 'localhost');
    expect(newState.cr.spec.brokerProperties);
    expect(
      newState.cr.spec.brokerProperties.includes(
        'connectorConfigurations.connectors0.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
      ),
    );
  });

  it('test replicas decrementReplicas', () => {
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.decrementReplicas,
    });
    // default size is 1 decrementing should result of a size of 1
    expect(newState.cr.spec.deploymentPlan.size === 1);
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
    expect(newState2.cr.spec.deploymentPlan.size === 9);
  });

  it('test deleteAcceptor', () => {
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    const newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.deleteAcceptor,
      payload: 'acceptors0',
    });
    expect(newState2.cr.spec.acceptors.length === 0);
    expect(
      !newState2.cr.spec.brokerProperties.includes(
        'acceptorConfigurations.acceptors0.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
      ),
    );
  });

  it('test deleteConnector', () => {
    const stateWith1Connector = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addConnector,
    });
    const newState2 = artemisCrReducer(stateWith1Connector, {
      operation: ArtemisReducerOperations.deleteConnector,
      payload: 'connectors0',
    });
    expect(newState2.cr.spec.connectors.length === 0);
    expect(
      !newState2.cr.spec.brokerProperties.includes(
        'connectorConfigurations.connectors0.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
      ),
    );
  });

  it('test incrementReplicas', () => {
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.incrementReplicas,
    });
    // default size is 1 decrementing should result of a size of 1
    expect(newState.cr.spec.deploymentPlan.size === 2);
  });

  it('test incrementReplicas', () => {
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.incrementReplicas,
    });
    // default size is 1 decrementing should result of a size of 1
    expect(newState.cr.spec.deploymentPlan.size === 2);
  });

  it('test setAcceptorBindToAllInterfaces', () => {
    const stateWith1Acceptor = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.addAcceptor,
    });
    expect(
      stateWith1Acceptor.cr.spec.acceptors[0].bindToAllInterfaces === undefined,
    );
    const newState2 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorBindToAllInterfaces,
      payload: {
        name: 'acceptors0',
        bindToAllInterfaces: true,
      },
    });
    expect(newState2.cr.spec.acceptors[0].bindToAllInterfaces);
    const newState3 = artemisCrReducer(stateWith1Acceptor, {
      operation: ArtemisReducerOperations.setAcceptorBindToAllInterfaces,
      payload: {
        name: 'acceptors0',
        bindToAllInterfaces: true,
      },
    });
    expect(!newState3.cr.spec.acceptors[0].bindToAllInterfaces);
  });

  it('test setAcceptorName', () => {
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
    expect(newState2.cr.spec.acceptors[0].name === 'superName');
    expect(
      newState2.cr.spec.brokerProperties.includes(
        'acceptorConfigurations.superName.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
      ),
    );
  });

  it('test setNamespace', () => {
    const newState = artemisCrReducer(initialState, {
      operation: ArtemisReducerOperations.setNamespace,
      payload: 'newNamespace',
    });
    expect(newState.cr.metadata.namespace === 'newNamespace');
  });
});
