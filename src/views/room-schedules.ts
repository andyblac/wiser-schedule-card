import '../components/moments';
import { plugIcon } from '../components/plug-icon';
import { loadHaControls } from '../components/ha-controls';
import { SchedulerEditCard } from './schedule-edit';
import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { SubscribeMixin } from '../components/subscribe-mixin';
import { notifyViewReady } from '../components/view-ready';
import { fetchRoomsList, fetchDeviceList, fetchSchedules, fetchScheduleById, assignSchedule } from '../data/websockets';
import { allow_edit } from '../helpers';
import { localize } from '../localize/localize';
import type { Room, Schedule, WiserScheduleCardConfig, WiserEventData } from '../types';

@customElement('wiser-room-schedules')
export class RoomSchedules extends SubscribeMixin(LitElement) {
  @property({ attribute: false }) config!: WiserScheduleCardConfig;
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
      const [rooms, schedules, ...deviceLists] = await Promise.all([
        fetchRoomsList(this.hass, this.config.hub),
        fetchSchedules(this.hass, this.config.hub),
        ...['lighting', 'onoff', 'shutters'].map((kind) => fetchDeviceList(this.hass!, this.config.hub, kind)),
      ]);
      const details = await Promise.all(
        schedules.map((schedule) => fetchScheduleById(this.hass!, this.config.hub, schedule.Type, schedule.Id)),
      );
      if (request !== this.requestId) return;
      this.rooms = [...rooms].sort((a, b) => a.Name.localeCompare(b.Name));
      this.schedules = details;
      this.devices = deviceLists.reduce<(Room & { kind: string })[]>(
        (all, items, index) =>
          all.concat(items.map((item) => ({ ...item, kind: ['lighting', 'onoff', 'shutters'][index] }))),
        [],
      );
      if (details.some((schedule) => schedule.Id === 1000))
        this.devices.unshift({ Id: 1000, Name: localize('wiser.home.hotwater'), kind: 'hotwater' });
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
      if (request === this.requestId) this.error = (error as Error)?.message || localize('common.load_failed');
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
      this.error = (error as Error)?.message || localize('common.load_failed');
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
    const text = localize(label);
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
            ← ${localize('wiser.rooms.back')}
          </button>`
        : '';
    if (this.loading && !this.loaded)
      return html`${back}
        <div class="status" role="status">${localize('common.loading')}</div>`;
    if (this.error)
      return html`${back}
        <div class="status" role="alert">${this.error}</div>
        <button @click=${() => this.loadData()}>${localize('common.retry')}</button>`;
    if (this.room_id !== undefined) {
      if (!room)
        return html`${back}
          <div class="status">${localize('wiser.rooms.missing')}</div>`;
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
        <div class="room-heading">
          <h3>${room.Name}</h3>
          <div class="tools">
            ${
              this.editing
                ? html`
                    ${this.tool('wiser.rooms.cancel_edit', 'mdi:close', () => this.editor?.cancelClick(), this.editorSaving)}
                    ${this.tool(
                      'wiser.rooms.save_edit',
                      'mdi:content-save',
                      () => {
                        void this.editor?.saveClick();
                      },
                      this.editorSaving,
                    )}
                  `
                : html`
                    ${this.tool('wiser.rooms.back', 'mdi:arrow-left', () => this.dispatchEvent(new CustomEvent('roomsBack')), blocked)}
                    ${viewed ? this.tool('wiser.actions.export', 'mdi:download', () => this.editor?.exportSchedule(), blocked || !this.editorReady) : ''}
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
                            ${this.tool(
                              'wiser.rooms.assign',
                              'mdi:check',
                              () => {
                                void this.assign();
                              },
                              blocked ||
                                !this.selected ||
                                (this.selected === 'none' ? !current : this.selected === String(current?.Id)),
                            )}
                          `
                        : ''
                    }
                  `
            }
          </div>
        </div>
        <p class="secondary">
          ${localize('wiser.rooms.current')}: <strong>${current?.Name ?? localize('wiser.rooms.unassigned')}</strong>
        </p>
        ${
          editable && !fixed
            ? html`
                ${
                  choices.length > 0
                    ? html`<ha-selector
                        class="schedule-picker"
                        .hass=${this.hass}
                        .label=${localize('wiser.rooms.choose')}
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
                          ${localize('wiser.rooms.available')}: <strong>${choices[0].Name}</strong>
                        </p>`
                      : ''
                }
                ${!choices.length ? html`<p class="secondary">${localize('wiser.rooms.no_schedules')}</p>` : ''}
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
        ${this.saved ? html`<p role="status">${localize(this.selected === 'none' ? 'wiser.rooms.removed' : 'wiser.rooms.saved')}</p>` : ''}
        ${viewed && viewed.Assignments.length > 1 ? html`<p class="secondary">${localize('wiser.rooms.shared')}</p>` : ''}
        ${this.saving ? html`<p role="status">${localize('wiser.rooms.assigning')}</p>` : ''}
      `;
    }
    const groups = [
      { title: 'heating', items: this.rooms.map((room) => ({ ...room, kind: 'heating' })) },
      { title: 'hotwater', items: this.devices.filter((item) => item.kind === 'hotwater') },
      { title: 'devices', items: this.devices.filter((item) => item.kind !== 'hotwater') },
    ];
    return html`
      ${groups
        .filter((group) => group.items.length)
        .map(
          (group) =>
            html` <section>
              <h3 class="section-heading">${localize('wiser.home.' + group.title)}</h3>
              <div class=${this.config.view_type === 'list' ? 'rooms list' : 'rooms'}>
                ${group.items.map(
                  (item) =>
                    html` <button
                      class="room"
                      @click=${() => this.dispatchEvent(new CustomEvent('roomClick', { detail: { id: item.Id, kind: item.kind } }))}
                    >
                      <span class="icon" aria-hidden="true"
                        ><ha-icon
                          .icon=${{ heating: 'mdi:home-thermometer-outline', hotwater: 'mdi:water-boiler', lighting: 'mdi:lightbulb-outline', onoff: plugIcon((this.hass?.config as { country?: string | null })?.country), shutters: 'mdi:window-shutter' }[item.kind]}
                        ></ha-icon
                      ></span>
                      <span class="room-text"
                        ><strong>${item.Name}</strong
                        ><span class="secondary"
                          >${this.currentSchedule(item, item.kind)?.Name ?? localize('wiser.rooms.unassigned')}</span
                        ></span
                      >
                      <span class="chevron" aria-hidden="true">›</span>
                    </button>`,
                )}
              </div>
            </section>`,
        )}
      ${!this.rooms.length && !this.devices.length ? html`<p class="secondary">${localize('wiser.home.empty')}</p>` : ''}
      <wiser-moments .hass=${this.hass} .hub=${this.config.hub || ''}></wiser-moments>
    `;
  }

  static styles = css`
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
    .rooms {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 210px), 1fr));
      gap: 10px;
    }
    .rooms.list {
      grid-template-columns: 1fr;
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
    .room {
      display: flex;
      gap: 12px;
      align-items: center;
      text-align: start;
      padding: 14px;
      min-height: 82px;
    }
    .room-text {
      display: flex;
      flex: 1;
      min-width: 0;
      flex-direction: column;
      gap: 3px;
      overflow-wrap: anywhere;
    }
    .room-text strong {
      font-weight: 500;
    }
    .room-text .secondary {
      font-size: calc(12px + 1pt);
    }
    .icon {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 38px;
      height: 38px;
      border-radius: 11px;
      background: var(--secondary-background-color);
      color: var(--primary-color);
    }
    .chevron {
      color: var(--secondary-text-color);
      font-size: calc(24px + 1pt);
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
  `;
}
