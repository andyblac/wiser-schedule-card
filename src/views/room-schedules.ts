import { toolbarColors } from '../components/toolbar-colors';
import '../components/heating-status';
import { fetchRoomClimateEntities, findRoomClimate } from '../data/room-climate';
import '../components/home-navigation';
import { nextScheduleChange } from '../data/schedule-overview';
import type { SunTimes } from '../types';
import { customElement } from '../components/register-element';
import '../components/card-header';
import '../components/moments';
import { plugIcon } from '../components/plug-icon';
import { loadHaControls } from '../components/ha-controls';
import { SchedulerEditCard } from './schedule-edit';
import { LitElement, html, css, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { SubscribeMixin } from '../components/subscribe-mixin';
import { notifyViewReady } from '../components/view-ready';
import {
  fetchSunTimes,
  fetchRoomsList,
  fetchDeviceList,
  fetchSchedules,
  fetchScheduleById,
  assignSchedule,
} from '../data/websockets';
import { allow_edit } from '../helpers';
import { localizeForHass } from '../localize/localize';
import type { Room, Schedule, WiserScheduleCardConfig, WiserEventData } from '../types';

@customElement('wiser-room-schedules')
export class RoomSchedules extends SubscribeMixin(LitElement) {
  private localize(key: string, search = '', replace = ''): string {
    return localizeForHass(this.hass, key, search, replace);
  }
  @property({ attribute: false }) config!: WiserScheduleCardConfig;
  @state() private climateEntities: string[] = [];
  @state() private sun?: SunTimes;
  @state() private now = new Date();
  @state() private expandedDevices: Record<string, boolean> = {};
  private clock?: ReturnType<typeof setInterval>;

  connectedCallback() {
    super.connectedCallback();
    this.clock = setInterval(() => {
      this.now = new Date();
    }, 30000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.clock);
  }

  @property({ attribute: false }) room_id?: number;
  @property({ attribute: false }) target_type = 'heating';
  @property({ attribute: false }) created_schedule?: { Id: number; Type: string };
  private openCreatedEditor = false;
  @state() private devices: (Room & { kind: string })[] = [];
  @state() private rooms: Room[] = [];
  @state() private schedules: Schedule[] = [];
  @state() private loading = true;
  @state() private loaded = false;
  @state() private error = '';
  @state() private saving = false;
  @state() private selected = '';
  @state() private saved = false;
  @state() private editing = false;
  @state() private editorSaving = false;
  @state() private editorReady = false;
  private requestId = 0;

  public hassSubscribe() {
    return [
      this.hass!.connection.subscribeMessage(
        (event: WiserEventData) => {
          if (
            event.event === 'wiser_updated' &&
            (!this.config.hub || event.hub === this.config.hub) &&
            !this.saving &&
            !this.editing
          ) {
            void this.loadData();
          }
        },
        { type: 'wiser_updated' },
      ),
    ];
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (
      changed.has('config') ||
      changed.has('room_id') ||
      changed.has('target_type') ||
      (changed.has('hass') && !changed.get('hass'))
    ) {
      this.loaded = false;
      this.selected = '';
      this.saved = false;
      void this.loadData();
    }
  }

  private compatible(kind: string): Schedule[] {
    return this.schedules.filter((schedule) =>
      kind === 'hotwater'
        ? schedule.Id === 1000
        : schedule.Id !== 1000 &&
          (kind === 'heating' ? schedule.Type : schedule.SubType || schedule.Type).toLowerCase() === kind,
    );
  }

  private get target(): Room | undefined {
    return this.target_type === 'heating'
      ? this.rooms.find((item) => item.Id === this.room_id)
      : this.devices.find((item) => item.Id === this.room_id && item.kind === this.target_type);
  }

  private currentSchedule(room: Room, kind = this.target_type): Schedule | undefined {
    if (kind === 'hotwater') return this.schedules.find((schedule) => schedule.Id === 1000);
    return this.compatible(kind).find((schedule) =>
      schedule.Assignments.some((assignment) => {
        // API schedule assignments use lowercase keys; accept capitalised keys too.
        const item = assignment as typeof assignment & { id?: number; name?: string };
        const id = item.id ?? item.Id;
        return id !== undefined ? String(id) === String(room.Id) : (item.name ?? item.Name) === room.Name;
      }),
    );
  }

  private async loadData(): Promise<void> {
    if (!this.hass || !this.config) return;
    const request = ++this.requestId;
    this.loading = true;
    this.error = '';
    try {
      await loadHaControls();
      const [rooms, schedules, sun, climateEntities, ...deviceLists] = await Promise.all([
        fetchRoomsList(this.hass, this.config.hub),
        fetchSchedules(this.hass, this.config.hub),
        fetchSunTimes(this.hass, this.config.hub).catch(() => undefined),
        fetchRoomClimateEntities(this.hass, this.config.hub).catch(() => []),
        ...['lighting', 'onoff', 'shutters'].map((kind) => fetchDeviceList(this.hass!, this.config.hub, kind)),
      ]);
      const details = await Promise.all(
        schedules.map((schedule) => fetchScheduleById(this.hass!, this.config.hub, schedule.Type, schedule.Id)),
      );
      if (request !== this.requestId) return;
      this.rooms = [...rooms].sort((a, b) => a.Name.localeCompare(b.Name));
      this.schedules = details;
      this.sun = sun;
      this.climateEntities = climateEntities;
      this.devices = deviceLists.reduce<(Room & { kind: string })[]>(
        (all, items, index) =>
          all.concat(items.map((item) => ({ ...item, kind: ['lighting', 'onoff', 'shutters'][index] }))),
        [],
      );
      if (details.some((schedule) => schedule.Id === 1000))
        this.devices.unshift({ Id: 1000, Name: this.localize('wiser.home.hotwater'), kind: 'hotwater' });
      this.loaded = true;
      const room = this.target;
      if (room) {
        const choices = this.compatible(this.target_type);
        if (
          this.created_schedule &&
          choices.some(
            (schedule) => schedule.Id === this.created_schedule!.Id && schedule.Type === this.created_schedule!.Type,
          )
        ) {
          this.selected = String(this.created_schedule.Id);
          this.openCreatedEditor = true;
          this.dispatchEvent(new CustomEvent('createdScheduleOpened'));
        } else if (this.selected === 'none') {
          // Keep an explicit unassignment selection through refreshes.
        } else if (choices.length <= 1) this.selected = String(choices[0]?.Id ?? '');
        else if (!choices.some((schedule) => String(schedule.Id) === this.selected))
          this.selected = String(this.currentSchedule(room)?.Id ?? 'none');
      }
    } catch (error: unknown) {
      if (request === this.requestId) this.error = (error as Error)?.message || this.localize('common.load_failed');
    } finally {
      if (request === this.requestId) {
        this.loading = false;
        await this.updateComplete;
        // An embedded timeline announces readiness after its own data renders.
        if (!this.editor || this.editorReady) await notifyViewReady(this);
      }
    }
  }

  private async assign(): Promise<void> {
    const room = this.target;
    const removing = this.selected === 'none';
    const schedule =
      removing && room
        ? this.currentSchedule(room)
        : this.compatible(this.target_type).find((item) => String(item.Id) === this.selected);
    if (this.target_type === 'hotwater' || !room || !schedule || this.saving || !allow_edit(this.hass!, this.config))
      return;
    this.saving = true;
    this.saved = false;
    this.error = '';
    try {
      await assignSchedule(this.hass!, this.config.hub, schedule.Type, schedule.Id, String(room.Id), removing);
      await this.loadData();
      this.saved = !this.error;
    } catch (error: unknown) {
      this.error = (error as Error)?.message || this.localize('common.load_failed');
    } finally {
      this.saving = false;
      await notifyViewReady(this);
    }
  }

  private get editor(): SchedulerEditCard | null {
    return this.renderRoot.querySelector<SchedulerEditCard>('wiser-schedule-edit-card');
  }

  private scheduleAction(schedule: Schedule, action: string): void {
    this.dispatchEvent(
      new CustomEvent('scheduleAction', {
        detail: { schedule_type: schedule.Type, schedule_id: schedule.Id, action },
      }),
    );
  }

  private tool(label: string, icon: string, action: () => void, disabled = false) {
    const text = this.localize(label);
    return html`<button
      class="tool"
      type="button"
      aria-label=${text}
      title=${text}
      ?disabled=${disabled}
      @click=${action}
    >
      <ha-icon .icon=${icon} aria-hidden="true"></ha-icon>
    </button>`;
  }

  protected render() {
    if (!this.hass || !this.config) return html``;
    const room = this.target;
    const back =
      this.room_id !== undefined
        ? html`<button
            class="back"
            ?disabled=${this.saving}
            @click=${() => this.dispatchEvent(new CustomEvent('roomsBack'))}
          >
            ← ${this.localize('wiser.rooms.back')}
          </button>`
        : '';
    if (this.loading && !this.loaded)
      return html`<wiser-card-header .config=${this.config}></wiser-card-header>${back}
        <div class="status" role="status">${this.localize('common.loading')}</div>`;
    if (this.error)
      return html`<wiser-card-header .config=${this.config}></wiser-card-header>${back}
        <div class="status" role="alert">${this.error}</div>
        <button @click=${() => this.loadData()}>${this.localize('common.retry')}</button>`;
    if (this.room_id !== undefined) {
      if (!room)
        return html`<wiser-card-header .config=${this.config}></wiser-card-header>${back}
          <div class="status">${this.localize('wiser.rooms.missing')}</div>`;
      const current = this.currentSchedule(room);
      const choices = this.compatible(this.target_type);
      const fixed = this.target_type === 'hotwater';
      const viewed =
        this.selected === 'none'
          ? undefined
          : choices.find((schedule) => String(schedule.Id) === this.selected) || current;
      const editable = allow_edit(this.hass, this.config);
      const blocked = this.saving || this.editing || this.editorSaving;
      return html`
        <input
          class="import-file"
          type="file"
          accept=".json,application/json"
          hidden
          @change=${(event: Event) => {
            const input = event.target as HTMLInputElement;
            const file = input.files?.[0];
            input.value = '';
            if (file) void this.editor?.importSchedule(file);
          }}
        />
        <wiser-card-header .config=${this.config}>
          <div class="tools">
            ${
              this.editing
                ? html`
                    ${this.tool('wiser.rooms.cancel_edit', 'mdi:close', () => this.editor?.cancelClick(), this.editorSaving)}
                  `
                : html`
                    ${this.tool('wiser.rooms.back', 'mdi:arrow-left', () => this.dispatchEvent(new CustomEvent('roomsBack')), blocked)}
                    ${editable && viewed ? this.tool('wiser.actions.export', 'mdi:download', () => this.editor?.exportSchedule(), blocked || !this.editorReady) : ''}
                    ${editable && viewed ? this.tool('wiser.actions.import', 'mdi:upload', () => this.renderRoot.querySelector<HTMLInputElement>('.import-file')?.click(), blocked || !this.editorReady) : ''}
                    ${
                      editable && viewed
                        ? html`
                            ${this.tool('wiser.rooms.edit', 'mdi:pencil', () => this.editor?.editClick(), blocked || !this.editorReady)}
                            ${this.tool('wiser.actions.rename', 'mdi:form-textbox', () => this.scheduleAction(viewed, 'rename'), blocked)}
                            ${this.tool('wiser.actions.copy', 'mdi:content-copy', () => this.scheduleAction(viewed, 'copy'), blocked || fixed)}
                            ${this.tool(
                              'wiser.rooms.delete',
                              'mdi:delete-outline',
                              () => {
                                void this.editor?.deleteClick();
                              },
                              blocked || !this.editorReady || fixed,
                            )}
                          `
                        : ''
                    }
                    ${
                      editable && !fixed
                        ? html`
                            ${this.tool('wiser.actions.add_schedule', 'mdi:plus', () => this.dispatchEvent(new CustomEvent('addScheduleClick')), blocked)}
                          `
                        : ''
                    }
                  `
            }
          </div>
        </wiser-card-header>
        <h3>${room.Name}</h3>
        <p class="secondary">
          ${this.localize('wiser.rooms.current')}:
          <strong>${current?.Name ?? this.localize('wiser.rooms.unassigned')}</strong>
        </p>
        ${
          editable && !fixed
            ? html`
                ${
                  choices.length > 0
                    ? html`<ha-selector
                        class="schedule-picker"
                        .hass=${this.hass}
                        .label=${this.localize('wiser.rooms.choose')}
                        .selector=${{ select: { mode: 'dropdown', options: choices.map((schedule) => ({ value: String(schedule.Id), label: schedule.Name })) } }}
                        .value=${this.selected === 'none' ? undefined : this.selected || undefined}
                        .required=${false}
                        .disabled=${blocked}
                        @value-changed=${(event: CustomEvent<{ value?: string | null }>) => {
                          event.stopPropagation();
                          if (
                            blocked ||
                            (event.detail.value != null &&
                              event.detail.value !== '' &&
                              !choices.some((schedule) => String(schedule.Id) === event.detail.value))
                          )
                            return;
                          this.selected = event.detail.value || 'none';
                          this.saved = false;
                        }}
                      ></ha-selector>`
                    : choices.length === 1 && !current
                      ? html`<p class="secondary">
                          ${this.localize('wiser.rooms.available')}: <strong>${choices[0].Name}</strong>
                        </p>`
                      : ''
                }
                ${!choices.length ? html`<p class="secondary">${this.localize('wiser.rooms.no_schedules')}</p>` : ''}
              `
            : ''
        }
        ${
          viewed
            ? html`
                <wiser-schedule-edit-card
                  .hass=${this.hass}
                  .config=${this.config}
                  .embedded=${true}
                  .schedule_id=${viewed.Id}
                  .schedule_type=${viewed.Type}
                  @editor-state=${(event: CustomEvent) => {
                    this.editing = event.detail.editing;
                    this.editorSaving = event.detail.saving;
                    this.editorReady = event.detail.ready;
                    if (this.openCreatedEditor && event.detail.ready && !event.detail.editing) {
                      this.openCreatedEditor = false;
                      this.editor?.editClick();
                    }
                  }}
                  @scheduleDeleted=${() => {
                    this.selected = '';
                    void this.loadData();
                  }}
                >
                </wiser-schedule-edit-card>
              `
            : ''
        }
        ${this.saved ? html`<p role="status">${this.localize(this.selected === 'none' ? 'wiser.rooms.removed' : 'wiser.rooms.saved')}</p>` : ''}
        ${viewed && viewed.Assignments.length > 1 ? html`<p class="secondary">${this.localize('wiser.rooms.shared')}</p>` : ''}
        ${this.saving ? html`<p role="status">${this.localize('wiser.rooms.assigning')}</p>` : ''}
        ${
          editable && !fixed && !this.editing
            ? html`<div class="save-actions">
                <ha-button
                  .disabled=${blocked || !this.selected || (this.selected === 'none' ? !current : this.selected === String(current?.Id))}
                  @click=${() => this.assign()}
                  >${this.localize('wiser.rooms.save_edit')}</ha-button
                >
              </div>`
            : ''
        }
      `;
    }
    const groups = [
      { title: 'heating', items: this.rooms.map((room) => ({ ...room, kind: 'heating' })) },
      { title: 'hotwater', items: this.devices.filter((item) => item.kind === 'hotwater') },
      { title: 'devices', items: this.devices.filter((item) => item.kind !== 'hotwater') },
    ];
    return html`
      <wiser-card-header .config=${this.config}
        ><wiser-home-navigation
          .hass=${this.hass}
          active="overview"
          @home-view-changed=${(event: CustomEvent) => {
            if (event.detail !== 'overview') return;
            event.stopPropagation();
            const buttons = Array.from(
              this.renderRoot.querySelectorAll<HTMLButtonElement>('.details-toggle:not(:disabled)'),
            );
            const expand = buttons.some((button) => button.getAttribute('aria-expanded') !== 'true');
            this.expandedDevices = {
              ...this.expandedDevices,
              ...buttons.reduce<Record<string, boolean>>((values, button) => {
                values[button.dataset.key!] = expand;
                return values;
              }, {}),
            };
            void notifyViewReady(this);
          }}
        ></wiser-home-navigation
      ></wiser-card-header>
      <h3>${this.localize('wiser.home.overview')}</h3>
      ${this.config.home_screen !== 'overview' || this.config.overview_details !== false ? html`<p class="secondary">${this.localize('wiser.home.overview_hint')}</p>` : ''}
      ${groups
        .filter((group) => group.items.length)
        .map(
          (group) =>
            html` <section>
              <h3 class="section-heading">${this.localize('wiser.home.' + group.title)}</h3>
              <div class="overview-grid">${group.items.map((item) => this.renderDeviceOverview(item))}</div>
            </section>`,
        )}
      ${!this.rooms.length && !this.devices.length ? html`<p class="secondary">${this.localize('wiser.home.empty')}</p>` : ''}
      <wiser-moments .hass=${this.hass} .hub=${this.config.hub || ''}></wiser-moments>
    `;
  }

  private renderDeviceOverview(item: Room & { kind: string }) {
    const schedule = this.currentSchedule(item, item.kind);
    const next = schedule
      ? nextScheduleChange(schedule, this.now, this.hass!.config.time_zone || 'UTC', this.sun)
      : undefined;
    const setting = next
      ? `${next.setpoint}${item.kind === 'heating' ? '°C' : ['lighting', 'shutters'].includes(item.kind) ? '%' : ''}`
      : '';
    const key = `${item.kind}-${item.Id}`;
    const expanded =
      this.expandedDevices[key] ?? (this.config.home_screen !== 'overview' || this.config.overview_details !== false);
    const row = (label: string, value: string | number) =>
      html`<div>
        <dt>${this.localize('wiser.home.' + label)}</dt>
        <dd>${value}</dd>
      </div>`;
    return html`<article class="device-overview">
      <div class="device-heading">
        <button
          class="details-toggle"
          type="button"
          data-key=${key}
          aria-label=${this.localize('wiser.home.device_details') + ': ' + item.Name}
          title=${this.localize('wiser.home.device_details')}
          aria-expanded=${Boolean((schedule || item.kind === 'heating') && expanded)}
          aria-controls=${'details-' + key}
          ?disabled=${!schedule && item.kind !== 'heating'}
          @click=${() => {
            this.expandedDevices = { ...this.expandedDevices, [key]: !expanded };
            void notifyViewReady(this);
          }}
        >
          <ha-icon
            .icon=${{ heating: 'mdi:home-thermometer-outline', hotwater: 'mdi:water-boiler', lighting: 'mdi:lightbulb-outline', onoff: plugIcon((this.hass?.config as { country?: string })?.country), shutters: 'mdi:window-shutter' }[item.kind]}
          ></ha-icon>
        </button>
        <button
          class="overview-device"
          type="button"
          @click=${() => this.dispatchEvent(new CustomEvent('roomClick', { detail: { id: item.Id, kind: item.kind } }))}
        >
          <span class="device-summary"
            ><strong>${item.Name}</strong
            ><span class="secondary">${schedule?.Name || this.localize('wiser.rooms.unassigned')}</span></span
          ><span aria-hidden="true">›</span>
        </button>
      </div>
      ${
        schedule
          ? html`<div class="device-details" id=${'details-' + key} ?hidden=${!expanded}>
              <dl>
                ${row('schedule_name', schedule.Name)}${row('schedule_id', schedule.Id)}
                ${row('schedule_type', schedule.SubType || schedule.Type)}
                ${next ? html`${row('next_day', this.localize('wiser.days.' + next.day.toLowerCase()))}${row('next_change', new Intl.DateTimeFormat(this.hass!.locale?.language || 'en', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(next.date + 'T00:00:00Z')) + ' · ' + next.time)}${row('next_setting', setting)}` : html`<p class="secondary">${this.localize('wiser.home.no_next_change')}</p>`}
              </dl>
              ${item.kind === 'heating' ? this.renderHeating(item, true) : ''}
            </div>`
          : item.kind === 'heating'
            ? html`<div class="device-details" id=${'details-' + key} ?hidden=${!expanded}>
                ${this.renderHeating(item, false)}
              </div>`
            : ''
      }
    </article>`;
  }

  private renderHeating(item: Room, assigned: boolean) {
    return html`<wiser-heating-status
      .hass=${this.hass}
      .entityId=${findRoomClimate(this.hass!, this.climateEntities, item.Name)}
      .editable=${allow_edit(this.hass!, this.config)}
      .assigned=${assigned}
    ></wiser-heating-status>`;
  }

  static styles = css`
    .device-heading {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .device-heading .details-toggle {
      flex: 0 0 44px;
      padding: 0;
      width: 44px;
      border: 0;
      background: transparent;
      color: var(--primary-color);
    }
    .device-heading .overview-device {
      border: 0;
      background: transparent;
      padding: 8px;
      min-width: 0;
    }
    .overview-grid {
      align-items: start;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
      gap: 12px;
    }
    .device-overview {
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      padding: 16px;
      background: var(--card-background-color);
      min-width: 0;
    }
    .overview-device {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      text-align: start;
    }
    .device-summary {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .device-summary {
      flex: 1;
      overflow-wrap: anywhere;
    }
    .overview-device ha-icon {
      color: var(--primary-color);
    }
    dl {
      margin: 12px 0 0;
    }
    dl > div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 8px 0;
    }
    dt {
      color: var(--secondary-text-color);
    }
    dd {
      margin: 0;
      text-align: end;
      overflow-wrap: anywhere;
    }

    :host {
      display: block;
      color: var(--primary-text-color);
    }
    section + section {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--divider-color, #ddd);
    }
    .room-heading {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .tools {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-inline-start: auto;
    }
    .tool {
      width: 44px;
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

    h3 {
      margin: 16px 0 8px;
      font-size: calc(22px + 1pt);
    }
    .section-heading {
      font-size: calc(15px + 1pt);
      font-weight: 600;
      margin: 0 0 8px;
    }
    .intro,
    .secondary {
      color: var(--secondary-text-color);
      font-size: calc(14px + 1pt);
      line-height: 1.5;
    }
    .intro {
      margin: 0 0 16px;
    }
    button,
    select {
      font: inherit;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 12px;
      background: var(--card-background-color, white);
      min-height: 44px;
      padding: 10px 14px;
    }
    button {
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    button:not(:disabled):hover {
      border-color: var(--primary-color);
    }
    button:focus-visible,
    select:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }
    .back {
      border: 0;
      background: none;
      color: var(--primary-color);
      padding-inline-start: 0;
    }
    .schedule-picker {
      display: block;
      width: 100%;
      max-width: 420px;
      margin: 20px 0 12px;
    }
    label {
      display: grid;
      gap: 8px;
      margin: 20px 0 12px;
      font-size: calc(14px + 1pt);
    }
    select {
      width: 100%;
      box-sizing: border-box;
    }
    .primary {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
      border-color: transparent;
    }
    .schedule-link {
      margin-top: 24px;
      border-top: 1px solid var(--divider-color, #ddd);
      padding-top: 16px;
    }
    .status {
      padding: 24px;
      border-radius: 12px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }
    .save-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }
    ${toolbarColors}
  `;
}
