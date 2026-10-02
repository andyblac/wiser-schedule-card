import { customElement } from '../components/register-element';
import './schedule-edit';
import { allow_edit } from '../helpers';
import { notifyViewReady } from '../components/view-ready';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import type { WiserScheduleCardConfig, ScheduleListItem, Schedule } from '../types';
import { copySchedule, createSchedule, fetchScheduleById, fetchSchedules, renameSchedule } from '../data/websockets';
import { EViews } from '../const';

import '../components/dialog-delete-confirm';
import { commonStyle } from '../styles';
import { localizeForHass } from '../localize/localize';

@customElement('wiser-schedule-copy-card')
export class ScheduleCopyCard extends LitElement {
  private localize(key: string, search = '', replace = ''): string {
    return localizeForHass(this.hass, key, search, replace);
  }
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: WiserScheduleCardConfig;
  @property({ attribute: false }) public schedule_id?: number = 0;
  @property({ attribute: false }) public schedule_type?: string;

  @state() schedule?: Schedule;
  @state() component_loaded = false;
  @state() _copy_in_progress = 0;
  @state() private _schedule_list: ScheduleListItem[] = [];

  @state() private _loadError = '';
  @state() private _name = '';
  @state() private _copyError = '';
  @state() private _creating = false;
  private _createdId?: number;
  private _createdName = '';

  protected firstUpdated(): void {
    void this.loadData()
      .then(() => {
        this.component_loaded = true;
      })
      .catch((error: unknown) => {
        this._loadError = (error as { message?: string })?.message || this.localize('common.load_failed');
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
    if (!this.component_loaded || !this.schedule)
      return html`<div role="status">${this.localize('common.loading')}</div>`;
    return html`
      <div>
        <div>${this.localize('wiser.headings.copy_schedule')}</div>
        <div class="schedule-info">
          <span class="sub-heading">${this.localize('wiser.headings.schedule_type')}:</span> ${this.schedule.Type}
        </div>
        <div class="schedule-info">
          <span class="sub-heading">${this.localize('wiser.headings.schedule_id')}:</span> ${this.schedule.Id}
        </div>
        <div class="schedule-info">
          <span class="sub-heading">${this.localize('wiser.headings.schedule_name')}:</span> ${this.schedule.Name}
        </div>
        <div class="wrapper" style="margin: 20px 0 0 0;">${this.localize('wiser.helpers.select_copy_schedule')}</div>
        <div class="assignment-wrapper">
          ${this._schedule_list
            .filter((schedule) => schedule.Id != this.schedule?.Id)
            .map((schedule) => this.renderScheduleButtons(schedule))}
        </div>
      </div>
      <label class="new-name"
        >${this.localize('wiser.headings.new_copy_name')}
        <input
          type="text"
          .value=${this._name}
          ?disabled=${this._creating || !!this._copy_in_progress}
          @input=${(event: Event) => {
            this._name = (event.target as HTMLInputElement).value;
          }}
        />
      </label>
      <wiser-schedule-edit-card
        .hass=${this.hass}
        .config=${{ ...this.config, display_only: true }}
        .embedded=${true}
        .schedule_id=${this.schedule_id}
        .schedule_type=${this.schedule_type}
      ></wiser-schedule-edit-card>
      ${this._copyError ? html`<p role="alert">${this._copyError}</p>` : ''}
      <div class="save-actions">
        <ha-button appearance="plain" .disabled=${this._creating || !!this._copy_in_progress} @click=${this.cancelClick}
          >${this.hass.localize('ui.common.cancel')}</ha-button
        >
        <ha-button
          .disabled=${this._creating || !!this._copy_in_progress || !this._name.trim() || !allow_edit(this.hass, this.config)}
          @click=${this.duplicateNew}
          >${this.localize('wiser.actions.duplicate_new')}</ha-button
        >
      </div>
    `;
  }

  private async duplicateNew(): Promise<void> {
    if (
      !this.hass ||
      !this.config ||
      !allow_edit(this.hass, this.config) ||
      this._creating ||
      this._copy_in_progress ||
      !this._name.trim()
    )
      return;
    this._creating = true;
    this._copyError = '';
    try {
      if (!this._createdId) {
        const before = await fetchSchedules(this.hass, this.config.hub, this.schedule_type);
        await createSchedule(this.hass, this.config.hub, this.schedule_type!, this._name.trim());
        const after = await fetchSchedules(this.hass, this.config.hub, this.schedule_type);
        const created = after.filter(
          (item) => item.Name === this._name.trim() && !before.some((old) => old.Id === item.Id),
        );
        if (created.length !== 1) throw new Error(this.localize('wiser.helpers.copy_target_missing'));
        this._createdId = created[0].Id;
        this._createdName = this._name.trim();
      }
      if (this._createdName !== this._name.trim()) {
        await renameSchedule(this.hass, this.config.hub, this.schedule_type!, this._createdId, this._name.trim());
        this._createdName = this._name.trim();
      }
      await copySchedule(this.hass, this.config.hub, this.schedule_type!, this.schedule_id!, this._createdId);
      this.dispatchEvent(
        new CustomEvent('scheduleCopied', { detail: { Id: this._createdId, Type: this.schedule_type } }),
      );
    } catch (error) {
      this._copyError = (error as Error).message || this.localize('common.load_failed');
    } finally {
      this._creating = false;
    }
  }

  renderScheduleButtons(schedule: ScheduleListItem): TemplateResult {
    return html`
      <button
        type="button"
        class="schedule-button"
        id=${schedule.Id}
        size="small"
        .disabled=${this._creating || !!this._copy_in_progress || !allow_edit(this.hass!, this.config!)}
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
    if (!allow_edit(this.hass!, this.config!) || this._creating || this._copy_in_progress) return;
    const target = ev.currentTarget;
    if (target.id) {
      this._copy_in_progress = parseInt(target.id);
      this._copyError = '';
      try {
        await copySchedule(
          this.hass!,
          this.config!.hub,
          this.schedule_type!,
          this.schedule_id!,
          this._copy_in_progress,
        );
        this.dispatchEvent(
          new CustomEvent('scheduleCopied', {
            detail: { Id: this._copy_in_progress, Type: this.schedule_type },
          }),
        );
      } catch (error) {
        this._copyError = (error as Error)?.message || this.localize('common.load_failed');
      } finally {
        this._copy_in_progress = 0;
      }
    }
  }

  static get styles(): CSSResultGroup {
    return css`
      ${commonStyle}
      .new-name {
        display: grid;
        gap: 8px;
        width: 420px;
        max-width: 100%;
        margin: 20px 0;
      }
      .new-name input {
        box-sizing: border-box;
        width: 100%;
        min-height: 44px;
        padding: 10px 12px;
        font: inherit;
        color: var(--primary-text-color);
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
      }
      .save-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 24px;
      }

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
