import { toolbarColors } from './toolbar-colors';
import type { HomeAssistant } from 'custom-card-helpers';
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { customElement } from './register-element';
import { localizeForHass } from '../localize/localize';

@customElement('wiser-home-navigation')
export class HomeNavigation extends LitElement {
  private localize(key: string, search = '', replace = ''): string {
    return localizeForHass(this.hass, key, search, replace);
  }
  @property({ attribute: false }) hass?: HomeAssistant;
  @property() active = 'schedules';
  @property({ type: Boolean }) canAdd = false;
  render() {
    return html`${['schedules', 'overview'].map(
        (view) =>
          html`<button
            class="tool"
            type="button"
            title=${this.localize('wiser.home.' + view)}
            aria-label=${this.localize('wiser.home.' + view)}
            aria-pressed=${this.active === view}
            @click=${() => this.dispatchEvent(new CustomEvent('home-view-changed', { detail: view, bubbles: true, composed: true }))}
          >
            <ha-icon .icon=${view === 'schedules' ? 'mdi:calendar-clock' : 'mdi:view-dashboard-outline'}></ha-icon>
          </button>`,
      )}<button
        class="tool"
        type="button"
        title=${this.localize('wiser.actions.add_schedule')}
        aria-label=${this.localize('wiser.actions.add_schedule')}
        ?disabled=${!this.canAdd || this.active !== 'schedules'}
        @click=${() => {
          if (this.canAdd && this.active === 'schedules')
            this.dispatchEvent(new CustomEvent('addScheduleClick', { bubbles: true, composed: true }));
        }}
      >
        <ha-icon .icon=${'mdi:plus'}></ha-icon>
      </button>`;
  }
  static styles = css`
    :host {
      display: inline-flex;
      gap: 6px;
    }
    button {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 1px solid transparent;
      border-radius: 10px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    button[aria-pressed='true'] {
      color: var(--primary-color);
      background: var(--secondary-background-color);
      border-color: var(--secondary-text-color);
    }
    button:disabled {
      color: var(--disabled-text-color);
      opacity: 1;
      cursor: default;
    }
    button:not(:disabled):hover {
      background: var(--secondary-background-color);
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    ${toolbarColors}
  `;
}
