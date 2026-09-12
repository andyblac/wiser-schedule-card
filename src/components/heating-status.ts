import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';
import { customElement } from './register-element';
import { localizeForHass } from '../localize/localize';

@customElement('wiser-heating-status')
export class HeatingStatus extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property() entityId?: string;
  @property({ type: Boolean }) editable = false;
  @property({ type: Boolean }) assigned = false;
  @state() private busy = false;
  @state() private error = '';
  private text(key: string) {
    return localizeForHass(this.hass, 'wiser.heating.' + key);
  }

  private get entity() {
    return this.entityId ? this.hass?.states[this.entityId] : undefined;
  }
  private get available() {
    return this.entity && !['unknown', 'unavailable'].includes(this.entity.state);
  }
  private get canResume() {
    const a = this.entity?.attributes;
    return (
      this.assigned &&
      this.entity?.state === 'auto' &&
      (a?.is_boosted || a?.is_override) &&
      a?.preset_modes?.includes('Cancel Overrides')
    );
  }
  private async change(mode: string) {
    if (!this.hass || !this.entityId || !this.editable || this.busy || !this.available) return;
    if (
      !['auto', 'heat', 'off'].includes(mode) ||
      !this.entity!.attributes.hvac_modes?.includes(mode) ||
      (mode === 'auto' && !this.assigned)
    )
      return;
    const entityId = this.entityId;
    this.busy = true;
    this.error = '';
    try {
      if (this.entity!.state !== mode)
        await this.hass.callService('climate', 'set_hvac_mode', { entity_id: entityId, hvac_mode: mode });
      if (
        mode === 'auto' &&
        this.entity?.attributes.preset_modes?.includes('Cancel Overrides') &&
        (this.entity.attributes.is_override || this.entity.attributes.is_boosted)
      )
        await this.hass.callService('climate', 'set_preset_mode', {
          entity_id: entityId,
          preset_mode: 'Cancel Overrides',
        });
    } catch (error) {
      this.error = (error as Error).message || this.text('failed');
    } finally {
      this.busy = false;
    }
  }
  render() {
    const entity = this.entity;
    if (!this.hass) return html``;
    const a = entity?.attributes;
    const origin = a?.target_temperature_origin;
    const status = !this.available
      ? 'unavailable'
      : !this.assigned
        ? 'unassigned'
        : entity!.state === 'off'
          ? 'off'
          : entity!.state === 'heat'
            ? 'manual'
            : a?.is_passive
              ? 'passive'
              : a?.is_boosted
                ? 'boost'
                : a?.is_override
                  ? 'override'
                  : (
                      {
                        FromSchedule: 'following',
                        FromAwayMode: 'away',
                        FromComfortMode: 'comfort',
                        FromEcoIQ: 'eco',
                        FromManualOverrideDuringAway: 'away',
                        FromBoostDuringAway: 'away',
                      } as Record<string, string>
                    )[origin] || 'unknown';
    const modes = (entity?.attributes.hvac_modes || []).filter(
      (mode: string) => ['auto', 'heat', 'off'].includes(mode) && (mode !== 'auto' || this.assigned),
    );
    return html`<div class="status" role="status">${this.text('status')}: <strong>${this.text(status)}</strong></div>
      ${this.available ? html`<p>${this.text('activity')}: ${a?.is_heating === true || a?.hvac_action === 'heating' ? this.text('heating') : a?.is_heating === false || a?.hvac_action === 'idle' ? this.text('idle') : this.text('unknown')}</p>` : ''}
      ${
        this.editable && entity
          ? html`<ha-selector
                .hass=${this.hass}
                .label=${this.text('mode')}
                .selector=${{ select: { mode: 'dropdown', options: modes.map((value: string) => ({ value, label: this.text(value === 'heat' ? 'manual' : value) })) } }}
                .value=${entity.state}
                .required=${true}
                .disabled=${!this.available || this.busy}
                @value-changed=${(event: CustomEvent) => {
                  event.stopPropagation();
                  void this.change(event.detail.value);
                }}
              ></ha-selector>
              ${this.canResume ? html`<ha-button .disabled=${this.busy} @click=${() => this.change('auto')}>${this.text('resume')}</ha-button>` : ''}`
          : ''
      }
      ${this.error ? html`<p role="alert">${this.error}</p>` : ''}`;
  }
  static styles = css`
    :host {
      display: block;
      border-top: 1px solid var(--divider-color);
      margin-top: 12px;
      padding-top: 12px;
    }
    .status,
    p {
      font-size: inherit;
      line-height: 1.5;
    }
    p {
      margin: 8px 0;
      color: var(--secondary-text-color);
    }
    ha-selector {
      display: block;
      margin-top: 12px;
      max-width: 300px;
    }
  `;
}
