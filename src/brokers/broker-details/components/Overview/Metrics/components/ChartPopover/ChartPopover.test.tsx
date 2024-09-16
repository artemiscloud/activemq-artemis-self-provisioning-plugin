import { render, screen, waitForI18n } from '@app/test-utils';
import { ChartPopover } from '../ChartPopover/ChartPopover';

describe('ChartPopover', () => {
  it('should renders ChartPopover component correctly', async () => {
    const comp = render(
      <ChartPopover title="Memory Usage" description="memory usage" />,
    );
    await waitForI18n(comp);
    expect(
      screen.getByLabelText('Information about {{title}}'),
    ).toBeInTheDocument();
  });
});
