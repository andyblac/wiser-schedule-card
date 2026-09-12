import { customElement } from '../components/register-element';
import '../components/card-header';
import { notifyViewReady } from '../components/view-ready';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import type { WiserScheduleCardConfig, Schedule } from '../types';
import { fetchScheduleById, renameSchedule } from '../data/websockets';
import '../components/dialog-delete-confirm';
import { EViews } from '../const';
import { commonStyle } from '../styles';
import { localize } from '../localize/localize';

@customElement('wiser-schedule-rename-card')
export class ScheduleRenameCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: WiserScheduleCardConfig;
  @property({ attribute: false }) public component_loaded = false;
  @property({ attribute: false }) public schedule_type?: string;
  @property({ attribute: false }) public schedule_id?: number;

  @state() private _newScheduleName = '';
  @state() private _schedule?: Schedule;
  @state() private _rename_in_progress = false;

  @state() private _loadError = '';

  protected firstUpdated(): void {
    void this.loadData()
      .then(() => {
        this.component_loaded = true;
      })
      .catch((error: unknown) => {
        this._loadError = (error as { message?: string })?.message || localize('common.load_failed');
      })
      .then(() => notifyViewReady(this));
  }

  private async loadData() {
    this._schedule = await fetchScheduleById(this.hass!, this.config!.hub, this.schedule_type!, this.schedule_id!);
    this._newScheduleName = this._schedule.Name;
  }

  render(): TemplateResult {
    if (!this.hass || !this.config) return html``;
    if (this._loadError)
      return html`<div role="alert">${this._loadError}</hui-warning
        ><button type="button" @click=${this.cancelClick}>${this.hass.localize('ui.common.back')}</button>`;
    if (!this.component_loaded) return html`<div role="status">${localize('common.loading')}</div>`;
    return html`
      <wiser-card-header .config=${this.config}>
        <div class="header-actions" role="toolbar">
          <button
            type="button"
            appearance="plain"
            .disabled=${!this._newScheduleName.trim() || this._newScheduleName === this._schedule?.Name || this._rename_in_progress}
            @click=${this.confirmClick}
          >
            ${
              this._rename_in_progress
                ? html`<span class="waiting"><progress aria-label="Working"></progress></span>`
                : this.hass!.localize('ui.common.save')
            }
          </button>
          <button type="button" appearance="plain" @click=${this.cancelClick}>
            ${this.hass!.localize('ui.common.cancel')}
          </button>
        </div>
      </wiser-card-header>
      <div>
        <div>${localize('wiser.headings.rename_schedule')}</div>
        <div class="wrapper">${localize('wiser.helpers.enter_new_name')}</div>
        <label class="schedule-name">
          <span>${localize('wiser.headings.schedule_name')}</span>
          <input
            type="text"
            required
            .value=${this._newScheduleName}
            ?disabled=${this._rename_in_progress}
            @input=${(event: Event) => {
              this._newScheduleName = (event.target as HTMLInputElement).value;
            }}
          />
        </label>
      </div>
    `;
  }

  async confirmClick(): Promise<void> {
    await this.renameSchedule();
  }

  async renameSchedule(): Promise<void> {
    this._rename_in_progress = true;
    await renameSchedule(this.hass!, this.config!.hub, this.schedule_type!, this.schedule_id!, this._newScheduleName);
    const myEvent = new CustomEvent('scheduleRenamed');
    this.dispatchEvent(myEvent);
    this._rename_in_progress = false;
  }

  cancelClick(): void {
    const myEvent = new CustomEvent('backClick', { detail: EViews.ScheduleEdit });
    this.dispatchEvent(myEvent);
  }

  static get styles(): CSSResultGroup {
    return css`
      ${commonStyle}
      .header-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 6px;
      }
      div.wrapper {
        white-space: nowrap;
        transition:
          width 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67),
          margin 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        overflow: auto;
      }
      div.wrapper {
        color: var(--primary-text-color);
        padding: 5px 0;
      }
      .card-actions {
        padding-top: 8px;
      }
      .schedule-type-select {
        margin: 20px 0 0 0;
      }
      .schedule-name {
        max-width: 420px;
        margin: 20px 0 0 0;
        width: 100%;
      }
      ha-icon-button {
        --mdc-icon-button-size: 36px;
        margin-top: -6px;
        margin-left: -6px;
      }
      .card-header ha-icon-button {
        position: absolute;
        right: 6px;
        top: 6px;
      }
      mwc-button.active {
        background: var(--primary-color);
        --mdc-theme-primary: var(--text-primary-color);
        border-radius: 4px;
      }
    `;
  }
}
