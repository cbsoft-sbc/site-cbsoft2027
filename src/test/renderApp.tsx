import { render, waitFor } from '@testing-library/react';
import { App } from '@/App';

/** Renders the whole app and waits for the current route's page, which is
 *  loaded on demand (see App.tsx), so queries see the real page instead of
 *  the loading placeholder. */
export async function renderApp() {
  const view = render(<App />);
  await waitFor(() => {
    if (view.container.querySelector('.route-loading')) throw new Error('route still loading');
  });
  return view;
}
