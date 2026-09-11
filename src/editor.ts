import { LitElement, html, css, PropertyValues, TemplateResult } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';
import { customElement, property, state } from 'lit/decorators.js';
import { WiserScheduleCardConfig, ScheduleListItem } from './types';
import { fetchHubs, fetchSchedules } from './data/websockets';
import { CARD_VERSION } from './const';

@customElement('wiser-schedule-card-editor')
export class WiserScheduleCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: WiserScheduleCardConfig;
  @state() private _hubs: string[] = [];
  @state() private _schedules: ScheduleListItem[] = [];
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
    this._schedules = [];
    try {
      const hubs = await fetchHubs(this.hass);
      const schedules = await fetchSchedules(this.hass, this._config.hub || hubs[0]);
      if (requestId !== this._requestId) return;
      this._hubs = hubs;
      this._schedules = schedules;
    } catch (error: unknown) {
      if (requestId === this._requestId) this._error = (error as Error)?.message || 'Unable to load schedules.';
    }
  }

  private change(key: string, value: string | boolean): void {
    if (!this._config) return;
    const config = { ...this._config };
    if (value === '') delete config[key];
    else config[key] = value;
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
    const listView = config.view_type === 'list';
    return html`
      <div class="fields">
        <label
          >Title<input
            type="text"
            .value=${config.name ?? ''}
            placeholder="Wiser Schedule"
            @input=${(e: Event) => this.change('name', (e.target as HTMLInputElement).value)}
        /></label>
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
        <label
          >Schedule<select
            @change=${(e: Event) => this.change('selected_schedule', (e.target as HTMLSelectElement).value)}
          >
            <option value="" ?selected=${!config.selected_schedule}>All schedules</option>
            ${this._schedules.map((s) => html`<option .value=${s.Type + '|' + s.Id} ?selected=${config.selected_schedule === s.Type + '|' + s.Id}>${s.Name}</option>`)}
          </select></label
        >
        <label
          >Layout<select @change=${(e: Event) => this.change('view_type', (e.target as HTMLSelectElement).value)}>
            <option value="default" ?selected=${!listView}>Tiles</option>
            <option value="list" ?selected=${listView}>List</option>
          </select></label
        >
      </div>
      ${this._error ? html`<div role="alert">${this._error} <button @click=${() => this.loadData()}>Try again</button></div>` : ''}
      <fieldset>
        <legend>Permissions</legend>
        ${this.toggle('display_only', 'Display schedules only')}
        ${this.toggle('admin_only', 'Only admins can manage schedules', config.display_only)}
      </fieldset>
      <fieldset>
        <legend>Appearance</legend>
        ${this.toggle('theme_colors', 'Use theme colours')} ${this.toggle('hide_card_borders', 'Hide card borders')}
      </fieldset>
      <div class="version">Wiser Schedule Card · ${CARD_VERSION}</div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color);
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
