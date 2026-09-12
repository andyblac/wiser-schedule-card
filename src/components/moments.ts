import { customElement } from './register-element';
import { LitElement, html, css, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';
import { fireEvent } from 'custom-card-helpers';
import { fetchHubs } from '../data/websockets';
import { localizeForHass } from '../localize/localize';

interface RegistryEntity {
  entity_id: string;
  platform: string;
  device_id: string | null;
  unique_id: string;
  translation_key?: string;
  original_name?: string | null;
  disabled_by?: string | null;
  hidden_by?: string | null;
}
interface RegistryDevice {
  id: string;
  identifiers: [string, string][];
}

@customElement('wiser-moments')
export class WiserMoments extends LitElement {
  private localize(key: string, search = '', replace = ''): string {
    return localizeForHass(this.hass, key, search, replace);
  }
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) hub = '';
  @state() private entities: RegistryEntity[] = [];
  @state() private loading = true;
  @state() private failed = false;
  private request = 0;

  protected updated(changed: PropertyValues): void {
    if (changed.has('hub') || (changed.has('hass') && !changed.get('hass'))) void this.load();
  }

  private async load(): Promise<void> {
    if (!this.hass) return;
    const request = ++this.request;
    this.loading = true;
    this.failed = false;
    try {
      const [entities, devices, hubs] = await Promise.all([
        this.hass.callWS<RegistryEntity[]>({ type: 'config/entity_registry/list' }),
        this.hass.callWS<RegistryDevice[]>({ type: 'config/device_registry/list' }),
        this.hub ? Promise.resolve([this.hub]) : fetchHubs(this.hass),
      ]);
      if (request !== this.request) return;
      const hub = this.hub || hubs[0];
      const deviceIds = new Set(
        devices
          .filter((device) => device.identifiers.some(([domain, id]) => domain === 'wiser' && id === hub))
          .map((device) => device.id),
      );
      this.entities = entities.filter(
        (entity) =>
          entity.platform === 'wiser' &&
          entity.entity_id.startsWith('button.') &&
          !entity.disabled_by &&
          !entity.hidden_by &&
          entity.device_id &&
          deviceIds.has(entity.device_id) &&
          (entity.translation_key === 'moment' ||
            entity.original_name?.startsWith('Moments ') ||
            entity.unique_id.includes('-button-Moments ')),
      );
    } catch {
      if (request === this.request) {
        this.entities = [];
        this.failed = true;
      }
    } finally {
      if (request === this.request) this.loading = false;
    }
  }

  private renderMoment(entity: RegistryEntity) {
    const state = this.hass!.states[entity.entity_id];
    return html`<button
      class="moment"
      @click=${() => fireEvent(this, 'hass-more-info', { entityId: entity.entity_id })}
    >
      <ha-icon .icon=${'mdi:play-circle-outline'} aria-hidden="true"></ha-icon>
      <span
        ><strong>${state.attributes.friendly_name || entity.original_name || entity.entity_id}</strong>
        <small
          >${this.localize(state.state === 'unavailable' ? 'wiser.moments.unavailable' : 'wiser.moments.open')}</small
        ></span
      >
      <span aria-hidden="true">›</span>
    </button>`;
  }

  protected render() {
    const entities = this.entities.filter((entity) => this.hass?.states[entity.entity_id]);
    if (!this.loading && !this.failed && !entities.length) return html``;
    let content;
    if (this.loading) content = html`<p role="status">${this.localize('wiser.moments.loading')}</p>`;
    else if (this.failed)
      content = html`<p role="status">${this.localize('wiser.moments.failed')}</p>
        <button @click=${this.load}>${this.localize('common.retry')}</button>`;
    else content = html`<div class="moments">${entities.map((entity) => this.renderMoment(entity))}</div>`;
    return html`<section>
      <h3>${this.localize('wiser.moments.title')}</h3>
      <p>${this.localize('wiser.moments.description')}</p>
      ${content}
    </section>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    section {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--divider-color, #ddd);
    }
    h3 {
      font-size: calc(15px + 1pt);
      font-weight: 600;
      margin: 0 0 8px;
      color: var(--primary-text-color);
    }
    p {
      font-size: calc(14px + 1pt);
      line-height: 1.5;
      margin: 0 0 14px;
      color: var(--secondary-text-color);
    }
    .moments {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 210px), 1fr));
      gap: 10px;
    }
    button {
      font: inherit;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 12px;
      background: var(--card-background-color, white);
      padding: 14px;
      min-height: 44px;
      cursor: pointer;
    }
    .moment {
      display: flex;
      align-items: center;
      gap: 12px;
      text-align: start;
    }
    .moment span:nth-child(2) {
      flex: 1;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    strong {
      display: block;
      font-size: calc(14px + 1pt);
      font-weight: 500;
    }
    small {
      display: block;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
    ha-icon {
      color: var(--primary-color);
      flex-shrink: 0;
    }
    button:hover {
      border-color: var(--primary-color);
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }
  `;
}
