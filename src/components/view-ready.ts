import type { LitElement } from 'lit';

// Release the navigation height only once the loaded content (or error state)
// has actually rendered, rather than when its network request finishes.
export async function notifyViewReady(view: LitElement): Promise<void> {
  await view.updateComplete;
  if (view.isConnected) {
    view.dispatchEvent(new CustomEvent('wiser-view-ready', { bubbles: true, composed: true }));
  }
}
