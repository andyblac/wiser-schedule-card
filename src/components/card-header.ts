import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { WiserScheduleCardConfig } from '../types';

@customElement('wiser-card-header')
export class WiserCardHeader extends LitElement {
  @property({ attribute: false }) config?: WiserScheduleCardConfig;

  render() {
    const name = this.config?.name;
    return html`<header>
      ${name ? html`<h2><span class="brand">Wiser</span>${name !== 'Wiser Schedule' ? html`<span class="title">${name}</span>` : ''}</h2>` : ''}
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
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 0;
      min-width: 0;
      line-height: 1.2;
    }
    .brand {
      color: var(--wiser-brand-color, #279f43);
      font-family: 'Arial Rounded MT Bold', 'Trebuchet MS', sans-serif;
      font-size: calc(32px + 1pt);
      font-weight: 700;
      letter-spacing: -1.5px;
    }
    .title {
      padding-inline-start: 14px;
      border-inline-start: 1px solid var(--divider-color, #ddd);
      color: var(--primary-text-color);
      font-size: calc(15px + 1pt);
      font-weight: 500;
      overflow-wrap: anywhere;
    }
    .actions {
      margin-inline-start: auto;
      min-width: 0;
      max-width: 100%;
    }
  `;
}
