import { customElement } from './components/register-element';
import { LitElement, html, css, PropertyValues, TemplateResult } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';
import { property, state } from 'lit/decorators.js';
import { WiserScheduleCardConfig } from './types';
import { fetchHubs } from './data/websockets';
import { loadHaControls } from './components/ha-controls';
import { localize } from './localize/localize';
import { CARD_VERSION } from './const';

@customElement('wiser-schedule-card-editor')
export class WiserScheduleCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: WiserScheduleCardConfig;
  @state() private _hubs: string[] = [];
  @state() private _error = '';
  private _requestId = 0;

  public setConfig(config: WiserScheduleCardConfig): void {
    this._config = { ...config };
  }

  protected updated(changed: PropertyValues): void {
    const oldConfig = changed.get('_config') as WiserScheduleCardConfig | undefined;
    if (
      (changed.has('hass') && !changed.get('hass')) ||
      (changed.has('_config') && (!oldConfig || oldConfig.hub !== this._config?.hub))
    ) {
      void this.loadData();
    }
  }

  private async loadData(): Promise<void> {
    if (!this.hass || !this._config) return;
    const requestId = ++this._requestId;
    this._error = '';
    try {
      await loadHaControls();
      const hubs = await fetchHubs(this.hass);
      if (requestId !== this._requestId) return;
      this._hubs = hubs;
    } catch (error: unknown) {
      if (requestId === this._requestId) this._error = (error as Error)?.message || 'Unable to load schedules.';
    }
  }

  private change(key: string, value: string | boolean): void {
    if (!this._config) return;
    const config = { ...this._config };
    if (value === '') delete config[key];
    else config[key] = value;
    if (key === 'home_screen') delete config.selected_schedule;
    if (key === 'hub') delete config.selected_schedule;
    this._config = config;
    fireEvent(this, 'config-changed', { config });
  }

  private toggle(key: string, label: string, disabled = false): TemplateResult {
    return html`<label class="toggle">
      <span>${label}</span>
      <input
        type="checkbox"
        .checked=${Boolean(this._config?.[key])}
        ?disabled=${disabled}
        @change=${(event: Event) => this.change(key, (event.target as HTMLInputElement).checked)}
      />
    </label>`;
  }

  protected render(): TemplateResult {
    if (!this._config) return html``;
    const config = this._config;
    return html`
      <div class="fields">
        <div class="home-screen">
          <span>${localize('wiser.home.screen')}</span>
          <ha-selector
            .hass=${this.hass}
            .selector=${{
              button_toggle: {
                options: [
                  { value: 'devices', label: localize('wiser.home.devices_mode') },
                  { value: 'schedules', label: localize('wiser.rooms.schedules') },
                ],
              },
            }}
            .value=${config.home_screen || 'schedules'}
            @value-changed=${(event: CustomEvent) => {
              event.stopPropagation();
              if (['devices', 'schedules'].includes(event.detail.value)) this.change('home_screen', event.detail.value);
            }}
          ></ha-selector>
        </div>
        ${
          this._hubs.length > 1
            ? html`<label
                >Wiser hub<select
                  .value=${config.hub || this._hubs[0]}
                  @change=${(e: Event) => this.change('hub', (e.target as HTMLSelectElement).value)}
                >
                  ${this._hubs.map((hub) => html`<option .value=${hub} ?selected=${hub === (config.hub || this._hubs[0])}>${hub}</option>`)}
                </select></label
              >`
            : ''
        }
      </div>
      ${this._error ? html`<div role="alert">${this._error} <button @click=${() => this.loadData()}>Try again</button></div>` : ''}
      <fieldset>
        <legend>Permissions</legend>
        ${this.toggle('display_only', localize('wiser.editor.display_only'))}
        <p class="field-help">${localize('wiser.editor.display_only_help')}</p>
        ${this.toggle('admin_only', 'Only admins can manage schedules', config.display_only)}
      </fieldset>
      <fieldset>
        <legend>Appearance</legend>
        ${this.toggle('theme_colors', 'Use theme colours')} ${this.toggle('hide_card_borders', 'Hide card borders')}
        ${this.toggle('hide_card_background', localize('wiser.editor.hide_card_background'))}
      </fieldset>
      <div class="version">Wiser Schedule Card · ${CARD_VERSION}</div>
    `;
  }

  static styles = css`
    .field-help {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin: 0 0 12px;
    }
    :host {
      display: block;
      color: var(--primary-text-color);
    }
    .home-screen {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .home-screen ha-selector {
      width: max-content;
      margin-inline-start: auto;
      display: flex;
      justify-content: flex-end;
      max-width: 100%;
    }
    .fields {
      display: grid;
      gap: 16px;
    }
    label {
      display: grid;
      gap: 8px;
      font-size: calc(14px + 1pt);
    }
    input[type='text'],
    select {
      box-sizing: border-box;
      width: 100%;
      min-height: 44px;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      padding: 10px 12px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      font: inherit;
    }
    fieldset {
      border: 0;
      border-top: 1px solid var(--divider-color, #ddd);
      padding: 16px 0 0;
      margin: 24px 0 0;
      min-width: 0;
    }
    legend {
      padding-right: 12px;
      color: var(--secondary-text-color);
      font-size: calc(13px + 1pt);
    }
    .toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      min-height: 44px;
    }
    input[type='checkbox'] {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      accent-color: var(--primary-color);
    }
    input:focus-visible,
    select:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .version {
      margin-top: 24px;
      color: var(--secondary-text-color);
      font-size: calc(12px + 1pt);
    }
  `;
}
