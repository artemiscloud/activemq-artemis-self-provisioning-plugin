import { render, waitForI18n } from '@app/test-utils';
import { EmptyStateNoMetricsData } from '../EmptyStateNoMetricsData/EmptyStateNoMetricsData';

describe('EmptyStateNoMetricsData', () => {
  it('should renders EmptyStateNoMetricsData correctly', async () => {
    const comp = render(<EmptyStateNoMetricsData />);
    await waitForI18n(comp);
    expect(comp.getByText('metric_not_available')).toBeInTheDocument();
  });
});
