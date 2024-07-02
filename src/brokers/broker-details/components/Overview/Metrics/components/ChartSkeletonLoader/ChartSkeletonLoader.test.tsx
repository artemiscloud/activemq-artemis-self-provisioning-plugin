import { render, waitForI18n } from '../../../../../../../test-utils';
import { ChartSkeletonLoader } from '../ChartSkeletonLoader/ChartSkeletonLoader';

describe('ChartSkeletonLoader', () => {
  it('should renders ChartSkeletonLoader correctly', async () => {
    const comp = render(<ChartSkeletonLoader />);
    await waitForI18n(comp);
    expect(
      comp.getByText('skeleton_loader_screenreader_text'),
    ).toBeInTheDocument();
  });
});
