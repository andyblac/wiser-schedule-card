import { customElement } from './register-element';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, css, CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { nothing } from 'lit';
import { localizeForHass } from '../localize/localize';

@customElement('wiser-dialog-delete-confirm')
export class DialogDeleteConfirm extends LitElement {
  private localize(key: string, search = '', replace = ''): string {
    return localizeForHass(this.hass, key, search, replace);
  }
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _params?: any;

  public async showDialog(params: any): Promise<void> {
    this._params = params;
    await this.updateComplete;
  }

  public async closeDialog() {
    const params = this._params;
    this._params = undefined;
    params?.cancel();
  }

  render() {
    if (!this._params) return html``;
    return html`
      <ha-dialog
        open
        header-title=${this.localize('wiser.headings.delete_schedule')}
        .heading=${this.localize('wiser.headings.delete_schedule')}
        @closed=${this.closeDialog}
        @close-dialog=${this.closeDialog}
      >
        <div class="wrapper">
          ${this.localize('wiser.helpers.delete_schedule_confirm') + ' ' + this._params.name + '?'}
        </div>
        <div
          class="actions"
          slot=${'headerTitle' in (customElements.get('ha-dialog')?.prototype || {}) ? 'footer' : nothing}
        >
          <ha-button appearance="plain" @click=${this.cancelClick}>${this.hass.localize('ui.common.cancel')}</ha-button>
          <ha-button variant="danger" @click=${this.confirmClick}>${this.hass.localize('ui.common.delete')}</ha-button>
        </div>
      </ha-dialog>
    `;
  }

  confirmClick() {
    const params = this._params;
    this._params = undefined;
    params?.confirm();
  }

  cancelClick() {
    void this.closeDialog();
  }

  static get styles(): CSSResultGroup {
    return css`
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 16px;
      }
      div.wrapper {
        color: var(--primary-text-color);
      }
    `;
  }
}
