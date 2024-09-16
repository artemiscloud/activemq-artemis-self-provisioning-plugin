import { FC, useReducer } from 'react';
import {
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  artemisCrReducer,
  newArtemisCRState,
} from '../../reducers/7.12/reducer';
import { fireEvent, render, screen } from '../../test-utils';
import { AddBroker } from './AddBroker.component';
import { useAccessReview } from '@openshift-console/dynamic-plugin-sdk';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  useAccessReview: jest.fn(() => []),
}));

const mockUseAccessReview = useAccessReview as jest.Mock;

const SimplifiedCreaterBrokerPage: FC = () => {
  const onSubmit = () => {
    return 0;
  };
  const onCancel = () => {
    return 0;
  };
  const initialValues = newArtemisCRState('default');
  const [brokerModel, dispatch] = useReducer(artemisCrReducer, initialValues);
  return (
    <BrokerCreationFormState.Provider value={brokerModel}>
      <BrokerCreationFormDispatch.Provider value={dispatch}>
        <AddBroker onSubmit={onSubmit} onCancel={onCancel} />
      </BrokerCreationFormDispatch.Provider>
    </BrokerCreationFormState.Provider>
  );
};

const SimplifiedUpdateBrokerPage: FC = () => {
  const onSubmit = () => {
    return 0;
  };
  const onCancel = () => {
    return 0;
  };
  const reloadExisting = () => {
    return 0;
  };
  const initialValues = newArtemisCRState('default');
  const [brokerModel, dispatch] = useReducer(artemisCrReducer, initialValues);
  return (
    <BrokerCreationFormState.Provider value={brokerModel}>
      <BrokerCreationFormDispatch.Provider value={dispatch}>
        <AddBroker
          onSubmit={onSubmit}
          onCancel={onCancel}
          isUpdatingExisting
          reloadExisting={reloadExisting}
        />
      </BrokerCreationFormDispatch.Provider>
    </BrokerCreationFormState.Provider>
  );
};

describe('create broker', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAccessReview.mockReturnValue([true, false]);
  });
  it('clicking on cancel after making some changes displays a warning', async () => {
    render(<SimplifiedCreaterBrokerPage />);
    fireEvent.click(screen.getByRole('button', { name: /plus/i }));
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(
      screen.getByText(
        'You are about to quit the editor, the broker wont get created',
      ),
    ).toBeInTheDocument();
  });
  it("clicking on cancel immediately after opening the editor shouldn't display a warning", async () => {
    render(<SimplifiedCreaterBrokerPage />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(
      screen.queryByText(
        "You are about to quit the editor, the broker won't get created",
      ),
    ).not.toBeInTheDocument();
  });
});

describe('update broker', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAccessReview.mockReturnValue([true, false]);
  });
  it('clicking on cancel after making some changes displays a warning', async () => {
    render(<SimplifiedUpdateBrokerPage />);
    fireEvent.click(screen.getByRole('button', { name: /plus/i }));
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(
      screen.queryByText(
        'You are about to quit the editor, configuration that is not applied will be lost',
      ),
    ).toBeInTheDocument();
  });
  it("clicking on cancel immediately after opening the editor shouldn't display a warning", async () => {
    render(<SimplifiedUpdateBrokerPage />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(
      screen.queryByText(
        'You are about to quit the editor, configuration that is not applied will be lost',
      ),
    ).not.toBeInTheDocument();
  });
  it('clicking on reload after making some changes displays a warning', async () => {
    render(<SimplifiedUpdateBrokerPage />);
    fireEvent.click(screen.getByRole('button', { name: /plus/i }));
    fireEvent.click(screen.getByRole('button', { name: /Reload/i }));
    expect(
      screen.queryByText('Upon reloading, these modifications will be lost.'),
    ).toBeInTheDocument();
  });
  it("clicking on reload immediately after opening the editor shouldn't display a warning", async () => {
    render(<SimplifiedUpdateBrokerPage />);
    fireEvent.click(screen.getByRole('button', { name: /Reload/i }));
    expect(
      screen.queryByText('Upon reloading, these modifications will be lost.'),
    ).not.toBeInTheDocument();
  });
});
