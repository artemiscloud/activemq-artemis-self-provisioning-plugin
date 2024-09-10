import { render, waitForI18n } from '@app/test-utils';
import { ChartTitle } from '../ChartTitle/ChartTitle';

describe('ChartTitle', () => {
  it('should renders title and helperText correctly', async () => {
    const title = 'CPU Usage';
    const helperText = 'CPU Usage';

    const comp = render(<ChartTitle title={title} helperText={helperText} />);
    await waitForI18n(comp);
    expect(comp.getByText(title)).toBeInTheDocument();
    expect(comp.getByText(helperText)).toBeInTheDocument();
  });
});
