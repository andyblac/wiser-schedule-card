import { customElement } from '../components/register-element';
import '../components/card-header';
import { notifyViewReady } from '../components/view-ready';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import type { WiserScheduleCardConfig, NewSchedule } from '../types';
import { createSchedule, fetchScheduleTypes, fetchSchedules, assignSchedule } from '../data/websockets';

import '../components/dialog-delete-confirm';
import { allow_edit } from '../helpers';
import { commonStyle } from '../styles';
import { localizeForHass } from '../localize/localize';

@customElement('wiser-schedule-add-card')
export class ScheduleAddCard extends LitElement {
  private localize(key: string, search = '', replace = ''): string {
    return localizeForHass(this.hass, key, search, replace);
  }
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: WiserScheduleCardConfig;
  @property({ attribute: false }) public component_loaded = false;

  @property({ attribute: false }) public allowed_types?: string[];
  @property({ attribute: false }) public assign_to?: number;
  @state() private _saving = false;

  @state() private _schedule_types: string[] = [];
  @state() private _schedule_info?: NewSchedule = { Name: '', Type: '' };

  @state() private _loadError = '';

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
    const types = await fetchScheduleTypes(this.hass!, this.config!.hub);
    this._schedule_types = types.filter(
      (type) =>
        !this.allowed_types || this.allowed_types.some((allowed) => allowed.toLowerCase() === type.toLowerCase()),
    );
    this._schedule_info = { Name: '', Type: this._schedule_types[0] || '' };
    if (!this._schedule_types.length) throw new Error(this.localize('wiser.helpers.no_supported_types'));
  }

  render(): TemplateResult {
    if (!this.hass || !this.config) return html``;
    if (this._loadError)
      return html`<div role="alert">${this._loadError}</hui-warning
        ><button type="button" @click=${this.cancelClick}>${this.hass.localize('ui.common.back')}</button>`;
    if (!this.component_loaded) return html`<div role="status">${this.localize('common.loading')}</div>`;
    return html`
      <wiser-card-header .config=${this.config}>
        <div class="header-actions" role="toolbar">
          <button type="button" appearance="plain" @click=${this.cancelClick}>
            ${this.hass.localize('ui.common.cancel')}
          </button>
        </div>
      </wiser-card-header>
      <div>
        <div>${this.localize('wiser.actions.add_schedule')}</div>
        <div class="wrapper" style="white-space: normal">
          ${this.localize(this._schedule_types.length === 1 ? 'wiser.helpers.add_schedule_name' : 'wiser.helpers.add_schedule')}
        </div>
        ${this._schedule_types.length > 1 ? html`<div class="wrapper">${this._schedule_types.map((t, i) => this.renderScheduleTypeButtons(t, i))}</div>` : ''}
        <label class="schedule-name">
          <span>${this.localize('wiser.headings.schedule_name')}</span>
          <input
            type="text"
            required
            autocomplete="off"
            .value=${this._schedule_info?.Name || ''}
            ?disabled=${this._saving}
            @input=${(event: Event) => {
              this._schedule_info = { ...this._schedule_info!, Name: (event.target as HTMLInputElement).value };
            }}
          />
        </label>
      </div>
      <div class="save-actions">
        <ha-button
          .disabled=${this._saving || !this._schedule_info?.Name.trim() || !this._schedule_info?.Type}
          @click=${this.confirmClick}
        >
          ${this.hass.localize('ui.common.save')}
        </ha-button>
      </div>
    `;
  }

  renderScheduleTypeButtons(schedule_type: string, index: number): TemplateResult {
    return html`
      <button
        type="button"
        id=${index}
        size="small"
        appearance=${this._schedule_info && this._schedule_info.Type == schedule_type ? 'filled' : 'plain'}
        @click=${this._valueChanged}
        .configValue=${'Type'}
        .value=${schedule_type}
      >
        ${schedule_type}
      </button>
    `;
  }

  async confirmClick(): Promise<void> {
    await this.createSchedule();
  }

  async createSchedule(): Promise<void> {
    const info = this._schedule_info;
    if (
      !this.hass ||
      !this.config ||
      !allow_edit(this.hass, this.config) ||
      this._saving ||
      !info?.Name.trim() ||
      !this._schedule_types.includes(info.Type)
    )
      return;
    this._saving = true;
    try {
      const before = await fetchSchedules(this.hass, this.config.hub, info.Type);
      await createSchedule(this.hass, this.config.hub, info.Type, info.Name.trim());
      const after = await fetchSchedules(this.hass, this.config.hub, info.Type);
      const created = after.find(
        (schedule) =>
          schedule.Name === info.Name.trim() &&
          !before.some((old) => old.Id === schedule.Id && old.Type === schedule.Type),
      );
      if (created && this.assign_to !== undefined)
        await assignSchedule(this.hass, this.config.hub, created.Type, created.Id, String(this.assign_to));
      this.dispatchEvent(new CustomEvent('scheduleAdded', { detail: created }));
    } catch (error: unknown) {
      this._loadError = (error as Error)?.message || this.localize('common.load_failed');
    } finally {
      this._saving = false;
    }
  }

  cancelClick(): void {
    const myEvent = new CustomEvent('backClick');
    this.dispatchEvent(myEvent);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _valueChanged(ev): void {
    const target = ev.currentTarget;
    if (target.configValue) {
      this._schedule_info = {
        ...this._schedule_info!,
        [target.configValue]: target.checked !== undefined ? target.checked : target.value,
      };
    }
  }

  static get styles(): CSSResultGroup {
    return css`
      ${commonStyle}
      .save-actions {
        display: flex;
        justify-content: flex-end;
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
      div.wrapper {
        color: var(--primary-text-color);
        padding: 5px 0;
      }
      .schedule-type-select {
        margin: 20px 0 0 0;
      }
      .schedule-name {
        max-width: 420px;
        display: grid;
        gap: 8px;
        color: var(--primary-text-color);
        margin: 20px 0 0 0;
        width: 100%;
      }
      input {
        box-sizing: border-box;
        width: 100%;
        min-height: 44px;
        padding: 10px 12px;
        border: 1px solid var(--divider-color, #aaa);
        border-radius: 10px;
        background: var(--card-background-color, white);
        color: var(--primary-text-color, #222);
        font: inherit;
      }
      input:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
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
