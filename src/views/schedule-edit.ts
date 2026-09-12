import { toolbarColors } from '../components/toolbar-colors';
import { customElement } from '../components/register-element';
import '../components/card-header';
import { loadHaControls } from '../components/ha-controls';
import { importScheduleFile } from '../data/schedule-file';
import { notifyViewReady } from '../components/view-ready';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LitElement, html, css, TemplateResult, CSSResultGroup, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CurrentUser, fireEvent } from 'custom-card-helpers';
import type {
  WiserScheduleCardConfig,
  Schedule,
  WiserEventData,
  Room,
  Entities,
  ScheduleAssignments,
  SunTimes,
  ScheduleDay,
  ScheduleSlot,
  WiserError,
} from '../types';
import { allow_edit, isDefined } from '../helpers';
import {
  fetchScheduleById,
  fetchRoomsList,
  fetchDeviceList,
  assignSchedule,
  deleteSchedule,
  saveSchedule,
  fetchSunTimes,
  showErrorDialog,
} from '../data/websockets';
import { SubscribeMixin } from '../components/subscribe-mixin';
import { UnsubscribeFunc } from 'home-assistant-js-websocket';

import '../components/schedule-slot-editor';
import '../components/dialog-error';
import { commonStyle } from '../styles';
import { localizeForHass } from '../localize/localize';
import { days, SPECIAL_TIMES, SUPPORT_SPECIAL_TIMES } from '../const';

@customElement('wiser-schedule-edit-card')
export class SchedulerEditCard extends SubscribeMixin(LitElement) {
  private localize(key: string, search = '', replace = ''): string {
    return localizeForHass(this.hass, key, search, replace);
  }
  @property({ attribute: false }) public config!: WiserScheduleCardConfig;
  @property({ attribute: false }) public schedule_id?: number = 0;
  @property({ attribute: false }) public schedule_type?: string;
  @property({ attribute: false }) public use_heat_colors = true;
  @property({ attribute: false }) public embedded = false;

  @state() private assignmentSelection: string[] = [];
  @state() private assigningDevices = false;

  @state() schedule?: Schedule;
  @state() rooms: Room[] = [];
  @state() entities: Entities[] = [];
  @state() suntimes?: SunTimes;
  @state() component_loaded?: boolean;
  @state() _activeSlot = null;
  @state() _activeDay = null;
  @state() editMode = false;
  @state() _current_user?: CurrentUser = this.hass?.user;
  @state() _assigning_in_progress = 0;
  @state() _save_in_progress = false;
  @state() error?: WiserError;

  _tempSchedule?: Schedule;
  stepSize = 5;

  async initialise(): Promise<boolean> {
    if (await this._isComponentLoaded()) {
      this.component_loaded = true;
      await this.loadData();
    }
    return true;
  }

  public hassSubscribe(): Promise<UnsubscribeFunc>[] {
    this.initialise();
    return [
      this.hass!.connection.subscribeMessage((ev: WiserEventData) => this.handleUpdate(ev), {
        type: 'wiser_updated',
      }),
    ];
  }

  private async handleUpdate(ev: WiserEventData): Promise<void> {
    if (!this.assigningDevices && (!this.config!.hub || ev.hub == this.config!.hub) && ev.event == 'wiser_updated') {
      await this.loadData();
    }
  }

  async _isComponentLoaded(): Promise<boolean> {
    return Boolean(this.hass && this.config && this.hass.config.components.includes('wiser'));
  }

  getSunTime(day: string, time: string): string {
    if (time == SPECIAL_TIMES[0]) {
      return this.suntimes!.Sunrises[days.indexOf(day)].time;
    }
    return this.suntimes!.Sunsets[days.indexOf(day)].time;
  }

  convertLoadedSchedule(schedule: Schedule): Schedule {
    const updatedScheduleDays = schedule.ScheduleData.map((day) => this.convertLoadedScheduleDay(day));
    schedule.ScheduleData = updatedScheduleDays;
    return schedule;
  }

  convertLoadedScheduleDay(day: ScheduleDay): ScheduleDay {
    const slots = day.slots;
    const outputSlots: ScheduleSlot[] = slots
      .map((slot) => {
        return SPECIAL_TIMES.includes(slot.Time)
          ? { Time: this.getSunTime(day.day, slot.Time), Setpoint: slot.Setpoint, SpecialTime: slot.Time }
          : { Time: slot.Time, Setpoint: slot.Setpoint, SpecialTime: '' };
      })
      .sort((a, b) => (parseInt(a.Time.replace(':', '')) < parseInt(b.Time.replace(':', '')) ? 0 : 1));

    const outputSlotsSet = new Set(outputSlots.map((e) => JSON.stringify(e)));
    const res = Array.from(outputSlotsSet).map((e) => JSON.parse(e));
    const outputDay: ScheduleDay = { day: day.day, slots: res };
    return outputDay;
  }

  convertScheduleForSaving(schedule: Schedule): Schedule {
    const updatedScheduleDays = schedule.ScheduleData.map((day) => this.convertScheduleDayForSaving(day));
    schedule.ScheduleData = updatedScheduleDays;
    return schedule;
  }

  convertScheduleDayForSaving(day: ScheduleDay): ScheduleDay {
    const slots = day.slots;
    const outputSlots: ScheduleSlot[] = slots
      .map((slot) => {
        return SPECIAL_TIMES.includes(slot.SpecialTime)
          ? { Time: slot.SpecialTime, Setpoint: slot.Setpoint, SpecialTime: slot.SpecialTime }
          : { Time: slot.Time, Setpoint: slot.Setpoint, SpecialTime: '' };
      })
      .sort((a, b) => (a.Time.replace(':', '') < b.Time.replace(':', '') ? 0 : 1));
    const outputSlotsSet = new Set(outputSlots.map((e) => JSON.stringify(e)));
    const res = Array.from(outputSlotsSet).map((e) => JSON.parse(e));
    const outputDay: ScheduleDay = { day: day.day, slots: res };
    return outputDay;
  }

  private async loadData() {
    this.error = undefined;
    if (!this.embedded) await loadHaControls();
    if (this.schedule_type && this.schedule_id && !this.editMode) {
      await fetchSunTimes(this.hass!, this.config!.hub)
        .then((res) => {
          this.suntimes = res;
        })
        .catch((e) => {
          this.error = e;
        });

      await fetchScheduleById(this.hass!, this.config!.hub, this.schedule_type!, this.schedule_id!)
        .then((res) => {
          this.schedule = this.convertLoadedSchedule(res);
        })
        .catch((e) => {
          this.schedule = undefined;
          this.error = e;
        });

      if (this.schedule) {
        await this.get_entity_list(this.hass!, this.config!.hub)
          .then((res) => {
            this.entities = res;
            this.assignmentSelection = res
              .filter((entity) => this.isAssigned(entity))
              .map((entity) => String(entity.Id));
          })
          .catch((e) => {
            this.error = e;
          });
      }
    }
    await notifyViewReady(this);
  }

  private async get_entity_list(hass, hub): Promise<Entities[]> {
    if (this.schedule!.Id === 1000) return [];
    if (this.schedule!.Type.toLowerCase() == 'heating') {
      return await fetchRoomsList(hass, hub);
    }
    return await fetchDeviceList(hass, hub, this.schedule!.SubType || this.schedule!.Type);
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('hass') || changedProps.has('component_loaded')) return true;
    if (
      changedProps.has('schedule_id') ||
      changedProps.has('schedule_type') ||
      changedProps.has('config') ||
      changedProps.has('editMode')
    ) {
      this.loadData();
      return true;
    }
    if (
      changedProps.has('schedule') ||
      changedProps.has('entities') ||
      changedProps.has('editMode') ||
      changedProps.has('_assigning_in_progress') ||
      changedProps.has('_save_in_progress') ||
      changedProps.has('assignmentSelection') ||
      changedProps.has('assigningDevices') ||
      (changedProps.has('error') && isDefined(this.error))
    ) {
      return true;
    }
    return false;
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (this.embedded) {
      this.dispatchEvent(
        new CustomEvent('editor-state', {
          detail: {
            editing: this.editMode,
            saving: this._save_in_progress,
            ready: Boolean(this.schedule && this.schedule.Id === this.schedule_id && this.suntimes && !this.error),
          },
        }),
      );
    }
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config || !this.component_loaded) return html``;
    if (isDefined(this.error)) {
      return html` <div role="alert">${this.error.message}</div> `;
    }
    if (this.schedule && this.entities && this.suntimes) {
      return html`
        <div>
          ${this.embedded ? '' : this.renderToolbar()}
          ${this.embedded || this.schedule.Id === 1000 ? '' : this.renderScheduleAssignment(this.entities, this.schedule.Assignments)}
          <div class="wrapper">
            <div class="schedules">
              <div class="slots-wrapper">
                <wiser-schedule-slot-editor
                  .hass=${this.hass}
                  .config=${this.config}
                  .schedule=${this.editMode ? this._tempSchedule : this.schedule}
                  .schedule_type=${this.schedule_type}
                  .suntimes=${this.suntimes}
                  .editMode=${this.editMode}
                  @scheduleChanged=${this.scheduleChanged}
                ></wiser-schedule-slot-editor>
              </div>
            </div>
          </div>
          ${
            this.editMode && allow_edit(this.hass, this.config)
              ? html` <div class="save-actions">
                  <ha-button .disabled=${this._save_in_progress} @click=${() => this.saveClick()}
                    >${this.hass.localize('ui.common.save')}</ha-button
                  >
                </div>`
              : ''
          }
          ${
            !this.embedded && !this.editMode && this.schedule.Id !== 1000 && allow_edit(this.hass, this.config)
              ? html`<div class="save-actions">
                  <ha-button
                    .disabled=${this.assigningDevices || this._save_in_progress || !this.entities.some((entity) => this.isAssigned(entity) !== this.assignmentSelection.includes(String(entity.Id)))}
                    @click=${() => this.applyDeviceAssignments()}
                    >${this.hass.localize('ui.common.save')}</ha-button
                  >
                </div>`
              : ''
          }
        </div>
      `;
    }
    return html``;
  }

  private isAssigned(entity: Entities): boolean {
    return Boolean(
      this.schedule?.Assignments.some((assignment) => {
        const item = assignment as typeof assignment & { id?: number; name?: string };
        const id = item.id ?? item.Id;
        return id !== undefined ? String(id) === String(entity.Id) : (item.name ?? item.Name) === entity.Name;
      }),
    );
  }

  renderScheduleAssignment(entities: Entities[], _assignments: unknown): TemplateResult | void {
    if (!this.schedule || this.editMode || this.schedule.Id === 1000) return;
    if (!allow_edit(this.hass!, this.config))
      return html`<p>
        ${
          entities
            .filter((entity) => this.isAssigned(entity))
            .map((entity) => entity.Name)
            .join(', ') || this.localize('wiser.headings.not_assigned')
        }
      </p>`;
    return html`<div class="device-assignment">
      <ha-selector
        .hass=${this.hass}
        .label=${this.localize('wiser.home.assign_devices')}
        .selector=${{ select: { multiple: true, mode: 'dropdown', options: entities.map((entity) => ({ value: String(entity.Id), label: entity.Name })) } }}
        .value=${this.assignmentSelection}
        .required=${false}
        .disabled=${this.assigningDevices || !entities.length}
        @value-changed=${(event: CustomEvent) => {
          event.stopPropagation();
          if (this.assigningDevices) return;
          const selected = event.detail.value ?? [];
          if (
            Array.isArray(selected) &&
            selected.every((value) => entities.some((entity) => String(entity.Id) === value))
          )
            this.assignmentSelection = selected;
        }}
      ></ha-selector>
      ${!entities.length ? html`<p>${this.localize('wiser.home.no_devices')}</p>` : ''}
    </div>`;
  }

  private async applyDeviceAssignments(): Promise<void> {
    if (
      !this.schedule ||
      this.assigningDevices ||
      this.editMode ||
      this.schedule.Id === 1000 ||
      !allow_edit(this.hass!, this.config)
    )
      return;
    const changes = (this.entities || []).filter(
      (entity) => this.isAssigned(entity) !== this.assignmentSelection.includes(String(entity.Id)),
    );
    this.assigningDevices = true;
    try {
      for (const entity of changes)
        await assignSchedule(
          this.hass!,
          this.config.hub,
          this.schedule.Type,
          this.schedule.Id,
          String(entity.Id),
          !this.assignmentSelection.includes(String(entity.Id)),
        );
      await this.loadData();
    } catch (error) {
      await this.loadData();
      showErrorDialog(this, 'Schedule assignment', (error as Error).message || this.localize('common.load_failed'));
    } finally {
      this.assigningDevices = false;
    }
  }

  renderEntityButton(entity: Entities, active: boolean): TemplateResult | void {
    return html`
      <button
        type="button"
        id=${entity.Id}
        class=${active ? 'active' : ''}
        appearance=${active ? 'accent' : 'plain'}
        size="small"
        ?disabled=${Boolean(this._assigning_in_progress)}
        aria-pressed=${active}
        @click=${this.entityAssignmentClick}
      >
        ${
          this._assigning_in_progress == entity.Id
            ? html`<span class="waiting"><progress aria-label="Working"></progress></span>`
            : null
        }
        ${entity.Name}
      </button>
    `;
  }

  private tool(label: string, icon: string, action: () => unknown, disabled = false): TemplateResult {
    return html`<button
      type="button"
      class="tool"
      title=${label}
      aria-label=${label}
      ?disabled=${disabled}
      @click=${action}
    >
      <ha-icon .icon=${icon} aria-hidden="true"></ha-icon>
    </button>`;
  }

  private renderToolbar(): TemplateResult {
    const editable = allow_edit(this.hass!, this.config);
    const blocked = this.assigningDevices || this._save_in_progress;
    const fixed = this.schedule!.Id === 1000;
    return html` <input
        class="import-file"
        type="file"
        accept=".json,application/json"
        hidden
        @change=${(event: Event) => {
          const input = event.target as HTMLInputElement;
          const file = input.files?.[0];
          input.value = '';
          if (file) void this.importSchedule(file);
        }}
      />
      <wiser-card-header .config=${this.config}>
        <div class="tools" role="toolbar" aria-label=${this.localize('wiser.headings.schedule_actions')}>
          ${
            this.editMode
              ? html`
                  ${this.tool(this.hass!.localize('ui.common.cancel'), 'mdi:close', () => this.cancelClick(), blocked)}
                `
              : html`
                  ${!this.config.selected_schedule ? this.tool(this.hass!.localize('ui.common.back'), 'mdi:arrow-left', () => this.backClick(), blocked) : ''}
                  ${editable ? this.tool(this.localize('wiser.actions.export'), 'mdi:download', () => this.exportSchedule(), blocked) : ''}
                  ${
                    editable
                      ? html`
                          ${this.tool(this.localize('wiser.actions.import'), 'mdi:upload', () => this.renderRoot.querySelector<HTMLInputElement>('.import-file')?.click(), blocked)}
                          ${this.tool(this.hass!.localize('ui.common.edit'), 'mdi:pencil', () => this.editClick(), blocked)}
                          ${this.tool(this.localize('wiser.actions.rename'), 'mdi:form-textbox', () => this.renameScheduleClick(), blocked)}
                          ${this.tool(this.localize('wiser.actions.copy'), 'mdi:content-copy', () => this.copyClick(), blocked || fixed)}
                          ${this.tool(this.hass!.localize('ui.common.delete'), 'mdi:delete-outline', () => this.deleteClick(), blocked || fixed)}
                        `
                      : ''
                  }
                `
          }
        </div>
      </wiser-card-header>
      <h3 class="schedule-title">${this.schedule!.Name}</h3>`;
  }

  async entityAssignmentClick(ev: Event): Promise<void> {
    const e = ev.currentTarget as HTMLElement;
    if (
      this._assigning_in_progress ||
      this.editMode ||
      this.schedule?.Id === 1000 ||
      !allow_edit(this.hass!, this.config)
    )
      return;
    this._assigning_in_progress = parseInt(e.id);
    try {
      await assignSchedule(
        this.hass!,
        this.config.hub,
        this.schedule_type!,
        this.schedule_id!,
        e.id,
        e.classList.contains('active'),
      );
      await this.loadData();
    } catch (error) {
      showErrorDialog(this, 'Schedule assignment', (error as Error).message || this.localize('common.load_failed'));
    } finally {
      this._assigning_in_progress = 0;
    }
  }

  backClick(): void {
    const myEvent = new CustomEvent('backClick');
    this.dispatchEvent(myEvent);
  }

  editClick(): void {
    if (!this.schedule || this.schedule.Id !== this.schedule_id || !allow_edit(this.hass!, this.config)) return;
    this._tempSchedule = JSON.parse(JSON.stringify(this.schedule));
    this.editMode = !this.editMode;
  }

  copyClick(): void {
    const myEvent = new CustomEvent('copyClick');
    this.dispatchEvent(myEvent);
  }

  exportSchedule(): void {
    if (!this.schedule) return;
    const schedule = this.convertScheduleForSaving(JSON.parse(JSON.stringify(this.schedule)));
    const contents = {
      format: 'wiser-schedule',
      version: 1,
      schedule: {
        Name: schedule.Name,
        Type: schedule.Type,
        SubType: schedule.SubType,
        ScheduleData: schedule.ScheduleData,
      },
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(contents, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${schedule.Name.replace(/[^a-z0-9_-]/gi, '_') || 'schedule'}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async importSchedule(file: File): Promise<void> {
    if (!this.schedule || this.editMode || !allow_edit(this.hass!, this.config)) return;
    try {
      if (file.size > 1024 * 1024) throw new Error('Schedule file is too large.');
      const draft = importScheduleFile(await file.text(), this.schedule);
      this._tempSchedule = this.convertLoadedSchedule(draft);
      this.editMode = true;
    } catch (error: unknown) {
      showErrorDialog(this, 'Import schedule', (error as Error).message);
    }
  }

  filesClick(): void {
    const myEvent = new CustomEvent('filesClick');
    this.dispatchEvent(myEvent);
  }

  async renameScheduleClick(): Promise<void> {
    const myEvent = new CustomEvent('renameClick');
    this.dispatchEvent(myEvent);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async deleteClick(ev?: Event): Promise<void> {
    if (!allow_edit(this.hass!, this.config)) return;
    const element = (ev?.target as HTMLElement) || this;
    const result = await new Promise((resolve) => {
      fireEvent(element, 'show-dialog', {
        dialogTag: 'wiser-dialog-delete-confirm',
        dialogImport: () => import('../components/dialog-delete-confirm'),
        dialogParams: {
          cancel: () => {
            resolve(false);
          },
          confirm: () => {
            resolve(true);
          },
          name: this.schedule!.Name,
        },
      });
    });
    if (result) {
      this.schedule_id = 0;
      await deleteSchedule(this.hass!, this.config!.hub, this.schedule!.Type, this.schedule!.Id);
      const myEvent = new CustomEvent('scheduleDeleted');
      this.dispatchEvent(myEvent);
    }
  }

  cancelClick(): void {
    this.editMode = false;
  }

  validateSchedule(schedule: Schedule): boolean {
    const hasSlotsForDay = schedule.ScheduleData.map((day) => {
      return day.slots;
    });
    const hasSlots = hasSlotsForDay.map((day) => {
      return day.length > 0;
    });
    return hasSlots.includes(true);
  }

  async saveClick(): Promise<void> {
    if (this._save_in_progress || !this._tempSchedule || !allow_edit(this.hass!, this.config)) return;
    this._save_in_progress = true;
    try {
      if (this.validateSchedule(this._tempSchedule)) {
        const draft = JSON.parse(JSON.stringify(this._tempSchedule)) as Schedule;
        const schedule = SUPPORT_SPECIAL_TIMES.includes(this.schedule_type!)
          ? this.convertScheduleForSaving(draft)
          : draft;
        await saveSchedule(this.hass!, this.config.hub, this.schedule_type!, this.schedule_id!, schedule);
        this.editMode = false;
      } else {
        showErrorDialog(this, 'Error Saving Schedule', 'The schedule you are trying to save has no time slots.');
      }
    } catch (error: unknown) {
      showErrorDialog(this, 'Error Saving Schedule', (error as Error)?.message || this.localize('common.load_failed'));
    } finally {
      this._save_in_progress = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  scheduleChanged(ev): void {
    this._tempSchedule = ev.detail.schedule;
    this.render();
  }

  static get styles(): CSSResultGroup {
    return css`
      ${commonStyle}
      .schedule-heading {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .schedule-title {
        margin: 16px 0 8px;
        font-size: calc(22px + 1pt);
      }
      .tools {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-inline-start: auto;
      }
      .tool {
        width: 44px;
        height: 44px;
        padding: 0;
        display: grid;
        place-items: center;
        color: var(--secondary-text-color);
      }
      .tool:disabled {
        color: var(--disabled-text-color);
        opacity: 1;
      }
      .tool:not(:disabled):hover {
        color: var(--primary-color);
      }

      .device-assignment {
        max-width: 420px;
        margin: 20px 0;
        display: grid;
        gap: 8px;
      }
      .device-assignment button {
        justify-self: start;
      }
      :host {
        display: block;
        max-width: 100%;
      }
      div.outer {
        width: 100%;
        overflow-x: hidden;
        overflow-y: hidden;
        border-radius: 5px;
      }
      div.wrapper,
      div.time-wrapper {
        white-space: nowrap;
        transition:
          width 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67),
          margin 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
      }
      div.assignment-wrapper,
      div.actions-wrapper {
        border-top: 1px solid var(--divider-color, #e8e8e8);
        padding: 5px 0px;
        min-height: 40px;
      }
      div.mode {
        position: absolute;
        right: 10px;
        top: 64px;
        background: var(--primary-color);
        padding: 2px 10px;
        border-radius: 20px;
        font-size: smaller;
        color: var(--app-header-text-color);
      }
      div.action-buttons {
        display: flow-root;
      }
      span.assignment-label {
        color: var(--primary-color);
        text-transform: uppercase;
        font-weight: 500;
        font-size: calc(var(--material-small-font-size, 12px) + 1pt);
        padding: 5px 10px;
      }
      .slot {
        float: left;
        background: rgba(var(--rgb-primary-color), 0.7);
        height: 60px;
        cursor: pointer;
        box-sizing: border-box;
        transition: background 0.1s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        position: relative;
        height: 40px;
        line-height: 40px;
        font-size: calc(10px + 1pt);
        text-align: center;
        overflow: hidden;
      }
      .slot.previous {
        cursor: default;
      }
      .slot.selected {
        background: rgba(52, 143, 255, 1);
      }
      .setpoint {
        z-index: 3;
        position: relative;
        text-align: center;
      }
      .slotoverlay {
        position: absolute;
        display: hidden;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        /*background-color: rgba(0,0,0,0.5);*/
        z-index: 2;
        cursor: pointer;
      }
      .previous {
        display: block;
        background: repeating-linear-gradient(
          135deg,
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 0) 5px,
          rgba(255, 255, 255, 0.2) 5px,
          rgba(255, 255, 255, 0.2) 10px
        );
      }
      .wrapper.selectable .slot:hover {
        background: rgba(var(--rgb-primary-color), 0.85);
      }
      .slot:not(:first-child) {
        border-left: 1px solid var(--card-background-color);
      }
      .slot:not(:last-child) {
        border-right: 1px solid var(--card-background-color);
      }
      .slot.active {
        background: rgba(var(--rgb-accent-color), 0.7);
      }
      .slot.noborder {
        border: none;
      }
      .wrapper.selectable .slot.active:hover {
        background: rgba(var(--rgb-accent-color), 0.85);
      }
      .wrapper .days .day {
        line-height: 42px;
        float: left;
        width: 100%;
      }
      .wrapper .schedules {
        position: relative;
        padding-top: 30px;
        width: 100%;
      }
      .wrapper .schedules .slots {
        height: 40px;
        border-radius: 5px;
        overflow: auto;
        margin-bottom: 2px;
        display: flex;
      }

      .setpoint.rotate {
        z-index: 3;
        transform: rotate(-90deg);
        position: absolute;
        top: 20px;
        height: 0px !important;
        width: 100%;
        overflow: visible !important;
      }
      div.schedule-action-wrapper {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      div.time-wrapper div {
        float: left;
        display: flex;
        position: relative;
        height: 25px;
        line-height: 25px;
        font-size: calc(12px + 1pt);
        text-align: center;
        align-content: center;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      div.time-wrapper div.time:before {
        content: ' ';
        background: var(--disabled-text-color);
        position: absolute;
        left: 0px;
        top: 0px;
        width: 1px;
        height: 5px;
        margin-left: 50%;
        margin-top: 0px;
      }
      .slot span {
        font-size: calc(10px + 1pt);
        color: var(--text-primary-color);
        height: 100%;
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: center;
        transition: margin 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        word-break: nowrap;
        white-space: normal;
        overflow: hidden;
        line-height: 1em;
      }
      div.handle {
        display: flex;
        height: 100%;
        width: 36px;
        margin-left: -19px;
        margin-bottom: -60px;
        align-content: center;
        align-items: center;
        justify-content: center;
      }
      div.button-holder {
        background: var(--card-background-color);
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        visibility: hidden;
        animation: 0.2s fadeIn;
        animation-fill-mode: forwards;
      }
      .schedule-action-button {
        flex: 1 1 100px;
        padding: 0 5px;
      }
      ha-icon-button {
        --mdc-icon-button-size: 36px;
        margin-top: -6px;
        margin-left: -6px;
      }
      @keyframes fadeIn {
        99% {
          visibility: hidden;
        }
        100% {
          visibility: visible;
        }
      }
      .card-header ha-icon-button {
        position: absolute;
        right: 6px;
        top: 6px;
      }
      .sub-heading {
        padding-bottom: 10px;
        font-weight: 500;
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
      .save-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 24px;
      }
      ${toolbarColors}
    `;
  }
}
