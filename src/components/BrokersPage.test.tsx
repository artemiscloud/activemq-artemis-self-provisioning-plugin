import { composeStories } from '@storybook/testing-react';
import { render } from '../test-utils';
import * as stories from './BrokersPage.stories';

const { BrokersPageStory } = composeStories(stories);

describe('BorkersPage', () => {
  it('should render brokers page', () => {
    const comp = render(<BrokersPageStory />);
    expect(comp.getByText('Brokers')).toBeInTheDocument();
  });
});
