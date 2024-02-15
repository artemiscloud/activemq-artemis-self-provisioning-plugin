import { render, waitForI18n } from '../../../test-utils';
import { MetricsLayout } from '../MetricsLayout/MetricsLayout';
import { MetricsType } from '../../utils';

describe('MetricsLayout', () => {
  const mockMetricsMemoryUsage = <div>Mock Memory Usage</div>;
  const mockMetricsCPUUsage = <div>Mock CPU Usage</div>;
  const mockMetricsActions = <div>Mock Metrics Actions</div>;

  it('should renders MetricsMemoryUsage,MetricsCPUUsage when metricsType is AllMetrics', async () => {
    const comp = render(
      <MetricsLayout
        metricsMemoryUsage={mockMetricsMemoryUsage}
        metricsCPUUsage={mockMetricsCPUUsage}
        metricsActions={mockMetricsActions}
        metricsType={MetricsType.AllMetrics}
      />,
    );
    await waitForI18n(comp);
    expect(comp.getByText('Mock Memory Usage')).toBeInTheDocument();
    expect(comp.getByText('Mock CPU Usage')).toBeInTheDocument();
  });

  it('should renders MetricsMemoryUsage when metricsType is MemoryUsage', async () => {
    const comp = render(
      <MetricsLayout
        metricsMemoryUsage={mockMetricsMemoryUsage}
        metricsCPUUsage={mockMetricsCPUUsage}
        metricsActions={mockMetricsActions}
        metricsType={MetricsType.MemoryUsage}
      />,
    );
    await waitForI18n(comp);
    expect(comp.getByText('Mock Memory Usage')).toBeInTheDocument();
  });

  it('should renders MetricsCPUUsage when metricsType is CPUUsage', async () => {
    const comp = render(
      <MetricsLayout
        metricsMemoryUsage={mockMetricsMemoryUsage}
        metricsCPUUsage={mockMetricsCPUUsage}
        metricsActions={mockMetricsActions}
        metricsType={MetricsType.CPUUsage}
      />,
    );
    await waitForI18n(comp);
    expect(comp.getByText('Mock CPU Usage')).toBeInTheDocument();
  });

  it('should not renders MetricsMemoryUsage and MetricsCPUUsage when metricsType is Empty', async () => {
    const comp = render(
      <MetricsLayout
        metricsMemoryUsage={mockMetricsMemoryUsage}
        metricsCPUUsage={mockMetricsCPUUsage}
        metricsActions={mockMetricsActions}
        metricsType={null}
      />,
    );
    await waitForI18n(comp);
    expect(comp.queryByText('Mock Memory Usage')).toBeNull();
    expect(comp.queryByText('Mock CPU Usage')).toBeNull();
  });
});
