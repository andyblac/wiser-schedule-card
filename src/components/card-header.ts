import { customElement } from './register-element';
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import type { WiserScheduleCardConfig } from '../types';

@customElement('wiser-card-header')
export class WiserCardHeader extends LitElement {
  @property({ attribute: false }) config?: WiserScheduleCardConfig;

  render() {
    const name = this.config?.name;
    const title = name && !['Wiser Schedule', 'Wiser Schedules'].includes(name) ? name : undefined;
    return html`<header>
      ${title ? html`<h2>${title}</h2>` : ''}
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
    .actions {
      margin-inline-start: auto;
      min-width: 0;
      max-width: 100%;
    }
  `;
}
