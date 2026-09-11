// Load HA's selector through a built-in card editor, which imports ha-form.
// This avoids depending on the user having opened an editor earlier in the session.
let loading: Promise<void> | undefined;
export function loadHaControls(): Promise<void> {
  if (customElements.get('ha-selector')) return Promise.resolve();
  if (!loading) {
    loading = (async () => {
      const host = window as Window & {
        loadCardHelpers?: () => Promise<{ createCardElement(config: unknown): HTMLElement }>;
      };
      if (!host.loadCardHelpers) throw new Error('Home Assistant controls are not available yet. Please retry.');
      const helpers = await host.loadCardHelpers();
      const card = helpers.createCardElement({ type: 'entities', entities: [] });
      const cardClass = card.constructor as typeof HTMLElement & { getConfigElement?: () => Promise<HTMLElement> };
      await cardClass.getConfigElement?.();
      if (!customElements.get('ha-selector'))
        throw new Error('Home Assistant controls could not be loaded. Please retry.');
    })().catch((error) => {
      loading = undefined;
      throw error;
    });
  }
  return loading;
}
