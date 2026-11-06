import { customElement } from './register-element';
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import type { WiserScheduleCardConfig } from '../types';

@customElement('wiser-card-header')
export class WiserCardHeader extends LitElement {
  @property({ attribute: false }) config?: WiserScheduleCardConfig;

  render() {
    const name = this.config?.name;
    const title =
      !this.config?.panel_mode && name && !['Wiser Schedule', 'Wiser Schedules'].includes(name) ? name : undefined;
    return html`<header class=${this.config?.panel_mode ? 'panel' : ''}>
      ${title ? html`<h2>${title}</h2>` : ''}
      <div class="heading">
        <slot name="heading"></slot>
        <slot name="subtitle"></slot>
      </div>
      <div class="actions"><slot></slot></div>
    </header>`;
  }

  static styles = css`
    :host {
      display: block;
      margin-bottom: 20px;
    }
    header {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      min-height: 44px;
    }
    h2 {
      margin: 0;
      min-width: 0;
      color: var(--primary-text-color);
      font-size: calc(15px + 1pt);
      font-weight: 500;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }
    .heading {
      min-width: 0;
    }
    ::slotted([slot='heading']) {
      margin: 0;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    ::slotted([slot='subtitle']) {
      margin: 0;
      color: var(--secondary-text-color);
      font-family: inherit;
      font-size: 14px;
      font-weight: 400;
      line-height: normal;
    }
    header.panel {
      align-items: flex-start;
    }
    header.panel ::slotted([slot='heading']) {
      margin: 0 0 6px;
      font-family: inherit;
      font-size: 28px;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: 0;
    }
    .actions {
      margin-inline-start: auto;
      min-width: 0;
      max-width: 100%;
    }
    @media (max-width: 600px) {
      header.panel ::slotted([slot='heading']) {
        font-size: 24px;
      }
      .actions {
        width: 100%;
        margin-inline-start: 0;
      }
    }
  `;
}
