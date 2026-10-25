import { customElement } from './components/register-element';
import { LitElement, html, css, PropertyValues, TemplateResult } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';
import { property, state } from 'lit/decorators.js';
import { ScheduleColorKey, WiserScheduleCardConfig } from './types';
import { fetchHubs } from './data/websockets';
import { loadHaControls } from './components/ha-controls';
import { localizeForHass } from './localize/localize';
import { CARD_VERSION, DEFAULT_SCHEDULE_COLORS } from './const';
import { isHex } from './helpers';

@customElement('wiser-schedule-card-editor')
export class WiserScheduleCardEditor extends LitElement implements LovelaceCardEditor {
  private localize(key: string, search = '', replace = ''): string {
    return localizeForHass(this.hass, key, search, replace);
  }
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public hideHubSelector = false;
  @property({ attribute: false }) public hideCardAppearance = false;
  @state() private _config?: WiserScheduleCardConfig;
  @state() private _hubs: string[] = [];
  @state() private _error = '';
  private _requestId = 0;

  public connectedCallback(): void {
    super.connectedCallback();
    this.ownerDocument.addEventListener('pointerdown', this._dismissColorPicker, true);
  }

  public disconnectedCallback(): void {
    this.ownerDocument.removeEventListener('pointerdown', this._dismissColorPicker, true);
    super.disconnectedCallback();
  }

  private _dismissColorPicker = (event: PointerEvent): void => {
    const activePicker = this.renderRoot.querySelector<HTMLInputElement>('input[type="color"]:focus');
    if (activePicker && !event.composedPath().includes(activePicker)) activePicker.blur();
  };

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
      <ha-switch
        aria-label=${label}
        .checked=${Boolean(this._config?.[key])}
        .disabled=${disabled}
        @change=${(event: Event) => this.change(key, (event.target as HTMLElement & { checked: boolean }).checked)}
      ></ha-switch>
    </label>`;
  }

  private color(key: ScheduleColorKey, label: string, group: string): TemplateResult {
    const fallback = DEFAULT_SCHEDULE_COLORS[key.replace('_color', '') as keyof typeof DEFAULT_SCHEDULE_COLORS];
    const value = this._config?.[key];
    return html`<div class="color-field">
      <span>${label}</span>
      <span class="color-actions">
        <input
          type="color"
          aria-label=${`${group}: ${label}`}
          .value=${isHex(value || '') ? value! : fallback}
          .disabled=${Boolean(this._config?.theme_colors)}
          @input=${(event: Event) => this.change(key, (event.currentTarget as HTMLInputElement).value)}
        />
        <button
          class="color-reset"
          type="button"
          aria-label=${`${group}: ${label}: ${this.localize('wiser.editor.reset_color')}`}
          title=${this.localize('wiser.editor.reset_color')}
          ?disabled=${value === undefined || Boolean(this._config?.theme_colors)}
          @click=${() => this.change(key, '')}
        >
          <ha-icon icon="mdi:restore"></ha-icon>
        </button>
      </span>
    </div>`;
  }

  protected render(): TemplateResult {
    if (!this._config) return html``;
    const config = this._config;
    return html`
      <div class="fields">
        ${
          this.hideHubSelector
            ? ''
            : html`<ha-selector
                class="hub-picker"
                .hass=${this.hass}
                .label=${this.localize('wiser.editor.hub')}
                .selector=${{ select: { mode: 'dropdown', options: this._hubs.map((hub) => ({ value: hub, label: hub })) } }}
                .value=${config.hub || this._hubs[0]}
                .required=${true}
                .disabled=${this._hubs.length < 2}
                @value-changed=${(event: CustomEvent<{ value?: string }>) => {
                  event.stopPropagation();
                  if (event.detail.value && this._hubs.includes(event.detail.value))
                    this.change('hub', event.detail.value);
                }}
              ></ha-selector>`
        }
        <div class="home-screen">
          <span>${this.localize('wiser.home.screen')}</span>
          <ha-selector
            .hass=${this.hass}
            .selector=${{
              button_toggle: {
                options: [
                  { value: 'schedules', label: this.localize('wiser.rooms.schedules') },
                  { value: 'overview', label: this.localize('wiser.home.overview') },
                ],
              },
            }}
            .value=${(config.home_screen as string) === 'devices' ? 'overview' : config.home_screen || 'schedules'}
            @value-changed=${(event: CustomEvent) => {
              event.stopPropagation();
              if (['schedules', 'overview'].includes(event.detail.value))
                this.change('home_screen', event.detail.value);
            }}
          ></ha-selector>
        </div>
        ${
          (config.home_screen as string) === 'overview' || (config.home_screen as string) === 'devices'
            ? html`
                <div class="home-screen">
                  <span>${this.localize('wiser.home.overview_details')}</span>
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{
                      button_toggle: {
                        options: [
                          { value: 'show', label: this.localize('wiser.home.show') },
                          { value: 'hide', label: this.localize('wiser.home.hide') },
                        ],
                      },
                    }}
                    .value=${config.overview_details === false ? 'hide' : 'show'}
                    @value-changed=${(event: CustomEvent) => {
                      event.stopPropagation();
                      if (['show', 'hide'].includes(event.detail.value))
                        this.change('overview_details', event.detail.value === 'show');
                    }}
                  ></ha-selector>
                </div>
              `
            : ''
        }
      </div>
      ${this._error ? html`<div role="alert">${this._error} <button @click=${() => this.loadData()}>${this.localize('common.retry')}</button></div>` : ''}
      <fieldset>
        <legend>${this.localize('wiser.editor.permissions')}</legend>
        ${this.toggle('display_only', this.localize('wiser.editor.display_only'))}
        <p class="field-help">${this.localize('wiser.editor.display_only_help')}</p>
        ${this.toggle('admin_only', this.localize('wiser.editor.admin_only'), config.display_only)}
      </fieldset>
      <fieldset>
        <legend>${this.localize('wiser.editor.appearance')}</legend>
        ${this.toggle('theme_colors', this.localize('wiser.editor.theme_colors'))}
        <div class="color-fields">
          <section class="color-group">
            <h4>${this.localize('wiser.editor.temperature_colors')}</h4>
            ${this.color(
              'low_color',
              this.localize('wiser.editor.low_color'),
              this.localize('wiser.editor.temperature_colors'),
            )}
            ${this.color(
              'high_color',
              this.localize('wiser.editor.high_color'),
              this.localize('wiser.editor.temperature_colors'),
            )}
          </section>
          <section class="color-group">
            <h4>${this.localize('wiser.editor.control_colors')}</h4>
            ${this.color(
              'off_color',
              this.localize('wiser.editor.off_color'),
              this.localize('wiser.editor.control_colors'),
            )}
            ${this.color(
              'on_color',
              this.localize('wiser.editor.on_color'),
              this.localize('wiser.editor.control_colors'),
            )}
          </section>
          <section class="color-group">
            <h4>${this.localize('wiser.editor.hot_water_colors')}</h4>
            ${this.color(
              'hot_water_off_color',
              this.localize('wiser.editor.off_color'),
              this.localize('wiser.editor.hot_water_colors'),
            )}
            ${this.color(
              'hot_water_on_color',
              this.localize('wiser.editor.on_color'),
              this.localize('wiser.editor.hot_water_colors'),
            )}
          </section>
          <section class="color-group">
            <h4>${this.localize('wiser.editor.lighting_colors')}</h4>
            ${this.color(
              'lighting_off_color',
              this.localize('wiser.editor.off_color'),
              this.localize('wiser.editor.lighting_colors'),
            )}
            ${this.color(
              'lighting_on_color',
              this.localize('wiser.editor.on_color'),
              this.localize('wiser.editor.lighting_colors'),
            )}
          </section>
          <section class="color-group">
            <h4>${this.localize('wiser.editor.shutter_colors')}</h4>
            ${this.color(
              'shutter_closed_color',
              this.localize('wiser.editor.closed_color'),
              this.localize('wiser.editor.shutter_colors'),
            )}
            ${this.color(
              'shutter_open_color',
              this.localize('wiser.editor.open_color'),
              this.localize('wiser.editor.shutter_colors'),
            )}
          </section>
        </div>
        ${
          this.hideCardAppearance
            ? ''
            : html`
                ${this.toggle('hide_card_borders', this.localize('wiser.editor.hide_card_borders'))}
                ${this.toggle('hide_card_background', this.localize('wiser.editor.hide_card_background'))}
              `
        }
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
    .hub-picker {
      width: 420px;
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
    .color-fields {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-top: 8px;
    }
    .color-group {
      display: grid;
      align-content: start;
      gap: 4px;
      min-width: 0;
    }
    .color-group h4 {
      margin: 0 0 4px;
      color: var(--secondary-text-color);
      font-size: calc(13px + 1pt);
      font-weight: 500;
    }
    .color-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 44px;
    }
    .color-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }
    input[type='color'] {
      box-sizing: border-box;
      width: 52px;
      height: 36px;
      padding: 2px;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 8px;
      background: var(--card-background-color, white);
      cursor: pointer;
    }
    input[type='color']:disabled {
      cursor: default;
      opacity: 0.45;
    }
    .color-reset {
      display: grid;
      place-items: center;
      box-sizing: border-box;
      width: 36px;
      height: 36px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .color-reset:hover:not(:disabled) {
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .color-reset:disabled {
      opacity: 0.3;
      cursor: default;
    }
    @media (max-width: 720px) {
      .color-fields {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
    ha-switch {
      flex-shrink: 0;
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
      text-align: right;
    }
  `;
}
