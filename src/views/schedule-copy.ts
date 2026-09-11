import '../components/card-header';
import { notifyViewReady } from '../components/view-ready';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import type { WiserScheduleCardConfig, ScheduleListItem, Schedule } from '../types';
import { copySchedule, fetchScheduleById, fetchSchedules } from '../data/websockets';
import { EViews } from '../const';

import '../components/dialog-delete-confirm';
import { commonStyle } from '../styles';
import { localize } from '../localize/localize';

@customElement('wiser-schedule-copy-card')
export class ScheduleCopyCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: WiserScheduleCardConfig;
  @property({ attribute: false }) public schedule_id?: number = 0;
  @property({ attribute: false }) public schedule_type?: string;

  @state() schedule?: Schedule;
  @state() component_loaded = false;
  @state() _copy_in_progress = 0;
  @state() private _schedule_list: ScheduleListItem[] = [];

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
    this.schedule = await fetchScheduleById(this.hass!, this.config!.hub, this.schedule_type!, this.schedule_id!);
    this._schedule_list = await fetchSchedules(this.hass!, this.config!.hub, this.schedule_type);
  }

  render(): TemplateResult {
    if (!this.hass || !this.config) return html``;
    if (this._loadError)
      return html`<div role="alert">${this._loadError}</hui-warning
        ><button type="button" @click=${this.cancelClick}>${this.hass.localize('ui.common.back')}</button>`;
    if (!this.component_loaded || !this.schedule) return html`<div role="status">${localize('common.loading')}</div>`;
    return html`
      <wiser-card-header .config=${this.config}>
        <div class="header-actions" role="toolbar">
          <button type="button" appearance="plain" @click=${this.cancelClick}>
            ${this.hass.localize('ui.common.cancel')}
          </button>
        </div>
      </wiser-card-header>
      <div>
        <div>${localize('wiser.headings.copy_schedule')}</div>
        <div class="schedule-info">
          <span class="sub-heading">${localize('wiser.headings.schedule_type')}:</span> ${this.schedule.Type}
        </div>
        <div class="schedule-info">
          <span class="sub-heading">${localize('wiser.headings.schedule_id')}:</span> ${this.schedule.Id}
        </div>
        <div class="schedule-info">
          <span class="sub-heading">${localize('wiser.headings.schedule_name')}:</span> ${this.schedule.Name}
        </div>
        <div class="wrapper" style="margin: 20px 0 0 0;">${localize('wiser.helpers.select_copy_schedule')}</div>
        <div class="assignment-wrapper">
          ${this._schedule_list
            .filter((schedule) => schedule.Id != this.schedule?.Id)
            .map((schedule) => this.renderScheduleButtons(schedule))}
        </div>
      </div>
    `;
  }

  renderScheduleButtons(schedule: ScheduleListItem): TemplateResult {
    return html`
      <button
        type="button"
        class="schedule-button"
        id=${schedule.Id}
        size="small"
        @click=${this._copySchedule}
        .value=${schedule.Name}
      >
        ${
          this._copy_in_progress == schedule.Id
            ? html`<span class="waiting"><progress aria-label="Working"></progress></span>`
            : null
        }
        ${schedule.Name}
      </button>
    `;
  }

  cancelClick(): void {
    const myEvent = new CustomEvent('backClick', { detail: EViews.ScheduleEdit });
    this.dispatchEvent(myEvent);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async _copySchedule(ev): Promise<void> {
    const target = ev.currentTarget;
    if (target.id) {
      this._copy_in_progress = parseInt(target.id);
      await copySchedule(this.hass!, this.config!.hub, this.schedule_type!, this.schedule_id!, parseInt(target.id));
      this._copy_in_progress = 0;
      const myEvent = new CustomEvent('scheduleCopied');
      this.dispatchEvent(myEvent);
    }
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
      div.card-actions {
        border-top: 1px solid var(--divider-color, #e8e8e8);
        padding: 5px 0px;
        min-height: 40px;
      }
      div.wrapper {
        color: var(--primary-text-color);
        padding: 5px 0;
      }
      .schedule-type-select {
        margin: 20px 0 0 0;
      }
      .schedule-name {
        margin: 20px 0 0 0;
        width: 100%;
      }
      .sub-heading {
        padding-bottom: 10px;
        font-weight: 500;
      }
      .schedule-button {
        padding: 5px;
      }
      span.waiting {
        position: absolute;
        height: 28px;
        width: 100%;
        margin: 4px;
      }
      div.schedule-info {
        margin: 3px 0;
      }
    `;
  }
}
