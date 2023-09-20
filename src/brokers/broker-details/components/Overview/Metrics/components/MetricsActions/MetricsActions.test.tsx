import { fireEvent, render, screen } from '../../../../../../../test-utils';
import { MetricsActions } from './MetricsActions';

describe('MetricsActions', () => {
  const pollingTime = '5m';
  const span = '30m';
  const onSelectOptionPolling = jest.fn();
  const onSelectOptionSpan = jest.fn();
  const onSelectOptionChart = jest.fn();

  it('should render span dropdown items correctly', () => {
    render(
      <MetricsActions
        pollingTime={pollingTime}
        span={span}
        metricsType="MemoryUsage"
        onSelectOptionPolling={onSelectOptionPolling}
        onSelectOptionSpan={onSelectOptionSpan}
        onSelectOptionChart={onSelectOptionChart}
      />,
    );
    expect(screen.getByText(/last_30_minutes/i)).toBeInTheDocument();

    const last30MinutesItem = screen.getAllByText(/last_30_minutes/i)[0];
    const spanDropdownItemsClickable = fireEvent.click(last30MinutesItem);
    expect(spanDropdownItemsClickable).toBe(true);
  });

  it('should render polling dropdown items correctly', () => {
    render(
      <MetricsActions
        pollingTime={pollingTime}
        span={span}
        metricsType="MemoryUsage"
        onSelectOptionPolling={onSelectOptionPolling}
        onSelectOptionSpan={onSelectOptionSpan}
        onSelectOptionChart={onSelectOptionChart}
      />,
    );
    expect(screen.getByText(/5_minutes/i)).toBeInTheDocument();

    const fiveMinutesItem = screen.getAllByText(/5_minutes/i)[0];
    const pollingDropdownItemsClickable = fireEvent.click(fiveMinutesItem);
    expect(pollingDropdownItemsClickable).toBe(true);
  });
});
