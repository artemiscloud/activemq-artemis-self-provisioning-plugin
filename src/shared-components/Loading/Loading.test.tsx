import { render, waitForI18n } from '../../test-utils';
import { Loading } from './Loading';

describe('Loading', () => {
  it('should render loading button without crash', async () => {
    const comp = render(<Loading />);
    await waitForI18n(comp);

    expect(await comp.findByLabelText('Contents')).toBeInTheDocument();
  });
});
