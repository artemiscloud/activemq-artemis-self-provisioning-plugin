import { render, waitForI18n } from '../../../test-utils';
import { ChartSkeletonLoader } from '../ChartSkeletonLoader/ChartSkeletonLoader';

jest.mock('../../../i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'skeleton_loader_screenreader_text') {
        return 'Metrics data is loading';
      }
      return key;
    },
  }),
}));

describe('ChartSkeletonLoader', () => {
  it('should renders ChartSkeletonLoader correctly', async () => {
    const comp = render(<ChartSkeletonLoader />);
    await waitForI18n(comp);
    expect(comp.getByText('Metrics data is loading')).toBeInTheDocument();
  });
});
