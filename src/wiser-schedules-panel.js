import { localizeForHass } from './localize/localize';

/** Sidebar host for the existing Wiser schedule card. */
class WiserSchedulesPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: flex; flex-direction: column; height: 100%; min-width: 0; overflow: auto;
          color: var(--primary-text-color); background: var(--primary-background-color); }
        header { display: flex; flex-shrink: 0; align-items: center; gap: 16px; height: 64px;
          padding: 0 16px; background: var(--app-header-background-color);
          color: var(--app-header-text-color); }
        h1 { flex: 0 0 auto; font-size: 20px; font-weight: 400; margin: 0; }
        #menu, #settings { flex-shrink: 0; }
        #menu, #settings { color: inherit; }
        #menu ha-icon, #settings ha-icon {
          color: var(--app-header-text-color, var(--primary-text-color));
        }
        #settings[disabled] ha-icon { color: var(--disabled-text-color); }
        ha-dialog { --ha-dialog-width-md: 600px;
          --ha-dialog-surface-background: var(--primary-background-color, var(--ha-color-surface-default, #fff)); }
        .dialog-description { margin: 0 0 20px; color: var(--secondary-text-color); font-size: 14px; line-height: 20px; }
        .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }
        #editors h3 { font-size: 16px; font-weight: 500; margin: 0 0 16px; }
        #editor-error:empty { display: none; }
        #editor-error { color: var(--error-color, #db4437); }
        main { display: flex; flex-direction: column; flex: 1 0 auto;
          box-sizing: border-box; width: 100%; min-width: 0; padding: 16px; }
        #hub-tabs { display: flex; flex: 1; min-width: 0; margin-inline-start: 24px; align-self: stretch; overflow-x: auto; }
        :host([nested]) header { flex-basis:56px; height:56px; }
        :host([nested]) #menu, :host([nested]) h1 { display:none; }
        :host([nested]) #hub-tabs { margin-inline-start:0; }
        :host([nested]) #settings { display:none; }
        :host([nested][single-hub]) header { display:none; }
        #hub-tabs[hidden], wiser-schedule-card[hidden] { display: none; }
        .hub-tab { flex: 0 0 auto; min-height: 48px; padding: 0 24px;
          border: 0; border-bottom: 2px solid transparent; background: transparent;
          color: var(--secondary-text-color); font: inherit; cursor: pointer; }
        .hub-tab[aria-selected="true"] { color: var(--app-header-text-color, var(--primary-text-color));
          border-bottom-color: currentColor; }
        .hub-tab:focus-visible { outline: 2px solid currentColor; outline-offset: -4px; }
        @media (max-width: 600px) {
          header { gap: 8px; padding: 0 8px; }
          #hub-tabs { margin-inline-start: 0; }
          h1 { flex: 0 1 auto; min-width: 0; max-width: 30%; font-size: 16px; }
          .hub-tab { padding: 0 12px; }
        }
        wiser-schedule-card { display: flex; flex-direction: column; flex: 1; min-width: 0; }
      </style>
      <header><ha-button id="menu" appearance="plain" aria-label="Toggle sidebar"><ha-icon icon="mdi:menu"></ha-icon></ha-button>
        <h1 id="panel-title">Wiser Schedules</h1>
        <nav id="hub-tabs" role="tablist" aria-label="Wiser hubs" hidden></nav>
        <ha-button id="settings" appearance="plain" aria-label="Edit schedule card settings" title="Edit schedule card settings" disabled>
          <ha-icon icon="mdi:cog"></ha-icon>
        </ha-button></header>
      <ha-dialog id="editor-dialog" header-title="Panel settings" width="medium">
        <p id="editor-description" class="dialog-description">Customize this panel. Dashboard cards keep their own settings.</p>
        <div id="editors"></div><p id="editor-error" role="alert"></p>
        <div class="dialog-actions" id="editor-actions" slot="footer">
          <ha-button id="cancel" appearance="plain">Cancel</ha-button>
          <ha-button id="save">Save</ha-button>
        </div>
      </ha-dialog>
      <main><p id="loading" role="status">Loading Wiser schedules…</p></main>`;
    this.shadowRoot.getElementById('menu').addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('hass-toggle-menu', {
          bubbles: true,
          composed: true,
        }),
      );
    });
    this.shadowRoot.getElementById('settings').addEventListener('click', () => this._openEditor());
    this.shadowRoot.getElementById('cancel').addEventListener('click', () => this._closeEditor());
    this.shadowRoot.getElementById('save').addEventListener('click', () => this._saveEditor());
    this.shadowRoot.getElementById('editor-dialog').addEventListener('closed', () => this._closeEditor());
    this.shadowRoot.getElementById('editor-dialog').addEventListener('close-dialog', () => this._closeEditor());
    this._editors = [];
    this._cards = [];
    this._generation = 0;
  }

  _t(key) {
    return localizeForHass(this._hass, key);
  }

  _localizeControls() {
    const root = this.shadowRoot;
    root.getElementById('panel-title').textContent = this._t('wiser.panel.title');
    root.getElementById('hub-tabs').setAttribute('aria-label', this._t('wiser.panel.hubs'));
    for (const [id, key] of [
      ['menu', 'wiser.panel.menu'],
      ['settings', 'wiser.panel.edit_settings'],
    ]) {
      const element = root.getElementById(id);
      element.setAttribute('aria-label', this._t(key));
      element.title = this._t(key);
    }
    root.getElementById('editor-description').textContent = this._t('wiser.panel.description');
    const loading = root.getElementById('loading');
    if (loading) loading.textContent = this._t('wiser.panel.loading');
    root.getElementById('cancel').textContent = this._t('wiser.panel.cancel');
    root.getElementById('save').textContent = this._t('wiser.panel.save');
    const dialog = root.getElementById('editor-dialog');
    dialog.setAttribute('header-title', this._t('wiser.panel.settings'));
    dialog.heading = this._t('wiser.panel.settings');
  }

  set hass(hass) {
    this._hass = hass;
    this._localizeControls();
    for (const card of this._cards) card.hass = hass;
    for (const editor of this._editors) editor.hass = hass;
    this.shadowRoot.getElementById('settings').hidden = !hass?.user?.is_admin;
  }

  set panel(panel) {
    const config = panel.config;
    if (JSON.stringify(config) === JSON.stringify(this._config)) return;
    this._config = config;
    this._loadCards();
  }

  _cardConfig(hub) {
    return {
      ...this._storedCardConfig(hub),
      panel_mode: true,
    };
  }

  _storedCardConfig(hub) {
    const { name: _name, panel_mode: _panelMode, ...savedConfig } = this._config.card_configs?.[hub] || {};
    return {
      ...savedConfig,
      type: 'custom:wiser-schedule-card',
      hub,
    };
  }

  _activeHubStorageKey() {
    return `wiser-schedules-panel:${this._config.panel_id}:active-hub`;
  }

  _rememberActiveHub(hub) {
    try {
      window.sessionStorage?.setItem(this._activeHubStorageKey(), hub);
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  }

  _restoredActiveHub() {
    if (this._activeHub) return this._activeHub;
    try {
      return window.sessionStorage?.getItem(this._activeHubStorageKey());
    } catch {
      return undefined;
    }
  }

  _selectHub(hub) {
    this._activeHub = hub;
    this._rememberActiveHub(hub);
    this._cards.forEach((card, index) => {
      const selected = this._config.hubs[index] === hub;
      card.hidden = !selected;
      this._tabs[index].setAttribute('aria-selected', String(selected));
      this._tabs[index].tabIndex = selected ? 0 : -1;
    });
  }

  _renderHubTabs() {
    const hubs = this._config.hubs;
    const container = this.shadowRoot.getElementById('hub-tabs');
    if (hubs.length <= 1) this.setAttribute('single-hub', '');
    else this.removeAttribute('single-hub');
    container.hidden = hubs.length <= 1;
    this._tabs = hubs.map((hub, index) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'hub-tab';
      tab.textContent = hub;
      tab.id = `hub-tab-${index}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', `hub-panel-${index}`);
      tab.addEventListener('click', () => this._selectHub(hub));
      tab.addEventListener('keydown', (event) => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % hubs.length;
        else if (event.key === 'ArrowLeft') next = (index + hubs.length - 1) % hubs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = hubs.length - 1;
        else return;
        event.preventDefault();
        this._selectHub(hubs[next]);
        this._tabs[next].focus();
      });
      const card = this._cards[index];
      card.id = `hub-panel-${index}`;
      card.setAttribute('role', 'tabpanel');
      card.setAttribute('aria-labelledby', tab.id);
      return tab;
    });
    container.replaceChildren(...this._tabs);
    const activeHub = this._restoredActiveHub();
    this._selectHub(hubs.includes(activeHub) ? activeHub : hubs[0]);
  }

  _closeEditor() {
    this.shadowRoot.getElementById('editor-dialog').open = false;
    this._editors = [];
  }

  async _openEditor() {
    const dialog = this.shadowRoot.getElementById('editor-dialog');
    if (dialog.open || !this._cards.length || !this._hass?.user?.is_admin) return;
    const container = this.shadowRoot.getElementById('editors');
    const error = this.shadowRoot.getElementById('editor-error');
    const save = this.shadowRoot.getElementById('save');
    this._drafts = Object.fromEntries(this._config.hubs.map((hub) => [hub, this._storedCardConfig(hub)]));
    this._editors = [];
    error.textContent = '';
    container.replaceChildren();
    save.disabled = true;
    dialog.heading = this._t('wiser.panel.settings');
    if (!('headerTitle' in (customElements.get('ha-dialog')?.prototype || {}))) {
      this.shadowRoot.getElementById('editor-actions').removeAttribute('slot');
    }
    dialog.open = true;
    try {
      // The bundled editor needs HA's helpers, which may not be loaded when
      // this dedicated panel is opened before any Lovelace dashboard.
      if (!window.loadCardHelpers) {
        const resolver = document.createElement('partial-panel-resolver');
        const routes = resolver._getRoutes?.({
          lovelace: { component_name: 'lovelace', url_path: 'lovelace' },
        });
        await routes?.routes?.lovelace?.load?.();
      }
      const Card = customElements.get('wiser-schedule-card');
      const hub = this._config.hubs.includes(this._activeHub) ? this._activeHub : this._config.hubs[0];
      const editor = await Card.getConfigElement();
      if (!dialog.open) return;
      const config = this._drafts[hub];
      editor.hass = this._hass;
      editor.hideHubSelector = true;
      editor.hideCardAppearance = true;
      editor.setConfig({ ...config });
      editor.addEventListener('config-changed', (event) => {
        event.stopPropagation();
        const { name: _name, panel_mode: _panelMode, ...config } = event.detail.config;
        this._drafts[hub] = {
          ...config,
          type: 'custom:wiser-schedule-card',
          hub,
        };
      });
      const section = document.createElement('section');
      const title = document.createElement('h3');
      title.textContent = hub;
      section.replaceChildren(...(this._config.hubs.length > 1 ? [title, editor] : [editor]));
      container.append(section);
      this._editors.push(editor);
      save.disabled = false;
    } catch (err) {
      error.textContent = this._t('wiser.panel.editor_error');
      console.error('Unable to open Wiser editor', err);
    }
  }

  async _saveEditor() {
    const save = this.shadowRoot.getElementById('save');
    save.disabled = true;
    try {
      await this._hass.callWS({
        type: 'wiser/panel/configure',
        panel_id: this._config.panel_id,
        configs: this._drafts,
      });
      this._config = {
        ...this._config,
        card_configs: {
          ...this._config.card_configs,
          ...this._drafts,
        },
      };
      this._closeEditor();
      this._editors = [];
      this._loadCards();
    } catch (error) {
      this.shadowRoot.getElementById('editor-error').textContent = this._t('wiser.panel.save_error');
      console.error('Unable to save Wiser panel settings', error);
    } finally {
      save.disabled = false;
    }
  }

  async _loadCards() {
    const generation = ++this._generation;
    const config = this._config;
    const main = this.shadowRoot.querySelector('main');
    try {
      const Card = customElements.get('wiser-schedule-card');
      if (Card?.panelApiVersion !== 1) {
        throw new Error(this._t('wiser.panel.version_error'));
      }
      if (generation !== this._generation) return;
      const cards = config.hubs.map((hub) => {
        const card = document.createElement('wiser-schedule-card');
        card.setConfig(this._cardConfig(hub));
        card.hass = this._hass;
        return card;
      });
      this._cards = cards;
      main.replaceChildren(...cards);
      this._renderHubTabs();
      this.shadowRoot.getElementById('settings').disabled = false;
    } catch (error) {
      if (generation !== this._generation) return;
      this._cards = [];
      this.shadowRoot.getElementById('hub-tabs').hidden = true;
      this.shadowRoot.getElementById('settings').disabled = true;
      const message = document.createElement('p');
      message.setAttribute('role', 'alert');
      message.textContent = error.message || this._t('wiser.panel.load_error');
      const retry = document.createElement('ha-button');
      retry.textContent = this._t('wiser.panel.retry');
      retry.addEventListener('click', () => this._loadCards());
      main.replaceChildren(message, retry);
      console.error('Unable to load Wiser schedules', error);
    }
  }
}

if (!customElements.get('wiser-schedules-panel')) {
  customElements.define('wiser-schedules-panel', WiserSchedulesPanel);
}
