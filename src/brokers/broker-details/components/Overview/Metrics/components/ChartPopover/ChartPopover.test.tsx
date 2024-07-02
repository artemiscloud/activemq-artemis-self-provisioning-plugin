import { render, screen, waitForI18n } from '../../../../../../../test-utils';
import { ChartPopover } from '../ChartPopover/ChartPopover';

describe('ChartPopover', () => {
  it('should renders ChartPopover component correctly', async () => {
    const comp = render(
      <ChartPopover title="Memory Usage" description="memory usage" />,
    );
    await waitForI18n(comp);
    expect(
      screen.getByLabelText('chart_popover_icon_screenreader_text'),
    ).toBeInTheDocument();
  });
});
