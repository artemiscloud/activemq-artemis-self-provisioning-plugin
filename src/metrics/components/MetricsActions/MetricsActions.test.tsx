import { render, waitForI18n } from '../../../test-utils';
import { MetricsActions } from './MetricsActions';

describe('MetricsActions', () => {
  const pollingTime = '5m';
  const span = '30m';
  const onSelectOptionPolling = jest.fn();
  const onSelectOptionSpan = jest.fn();
  const onSelectOptionChart = jest.fn();

  it('should renders MetricsActions component correctly', async () => {
    const comp = render(
      <MetricsActions
        pollingTime={pollingTime}
        span={span}
        metricsType="MemoryUsage"
        onSelectOptionPolling={onSelectOptionPolling}
        onSelectOptionSpan={onSelectOptionSpan}
        onSelectOptionChart={onSelectOptionChart}
      />,
    );
    await waitForI18n(comp);
    expect(comp.getByTestId('metrics-card')).toBeInTheDocument();
    expect(comp.getByTestId('metrics-card-actions')).toBeInTheDocument();
  });
});
