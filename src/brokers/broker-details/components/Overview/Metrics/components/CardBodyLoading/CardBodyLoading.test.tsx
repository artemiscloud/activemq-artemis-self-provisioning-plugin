import { render, waitForI18n } from '../../../../../../../test-utils';
import { CardBodyLoading } from '../CardBodyLoading/CardBodyLoading';

describe('CardBodyLoading', () => {
  it('should renders Spinner component', async () => {
    const comp = render(<CardBodyLoading />);
    await waitForI18n(comp);
    expect(comp.getByTestId('spinner')).toBeInTheDocument();
  });
});
