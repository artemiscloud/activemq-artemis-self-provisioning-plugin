import { composeStories } from '@storybook/testing-react';
import { render } from '@testing-library/react';
import * as stories from './BrokersPage.stories';

const { BrokersPageStory } = composeStories(stories);

describe('BorkersPage', () => {
  it('should render brokers page', () => {
    const comp = render(<BrokersPageStory />);
    expect(comp.getByText('Brokers')).toBeInTheDocument();
  });
});
