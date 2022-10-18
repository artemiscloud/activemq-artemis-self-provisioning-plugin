import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Spinner } from '@patternfly/react-core';
import { PartialStoryFn, StoryContext } from '@storybook/csf';
import { Args, ReactFramework } from '@storybook/react/types-6-0';

export const withLayout = (
  Story: PartialStoryFn<ReactFramework, Args>,
  { globals }: StoryContext<ReactFramework, Args>,
) => {
  useEffect(() => {
    document.body.classList.toggle('show-ouia', JSON.parse(globals.ouia));
  }, [globals.ouia]);

  return (
    <Router>
      <React.Suspense fallback={<Spinner />}>
        <Story />
      </React.Suspense>
    </Router>
  );
};
