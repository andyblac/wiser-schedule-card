import { customElement } from './components/register-element';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, css, TemplateResult, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, getLovelace } from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers

import type { WiserScheduleCardConfig } from './types';
import { CARD_VERSION, EViews } from './const';
import { localize } from './localize/localize';

import './views/room-schedules';
import './views/schedules-home';
import './views/schedule-edit';
import './views/schedule-add';
import './views/schedule-copy';
import './editor';
import './wiser-schedules-panel.js';

/* eslint no-console: 0 */
console.info(
  `%c  WISER-SCHEDULE-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
if (!(window as any).customCards.some((card: { type: string }) => card.type === 'wiser-schedule-card'))
  (window as any).customCards.push({
    type: 'wiser-schedule-card',
    name: 'Wiser Schedule Card',
    description: 'A card to manage Wiser schedules',
    preview: false,
  });

@customElement('wiser-schedule-card')
export class WiserScheduleCard extends LitElement {
  @property({ attribute: false }) private _hass?: HomeAssistant;
  @state() private config?: WiserScheduleCardConfig;
  @state() private _view: EViews = EViews.Overview;
  @state() private component_loaded?: boolean = false;
  @state() private _schedule_id?: number = 0;
  @state() private _schedule_type?: string = 'heating';
  @state() private _room_id?: number;
  @state() private _homeView: 'schedules' | 'overview' = 'schedules';
  @state() private _schedulesHomeMounted = true;
  @state() private _overviewHomeMounted = false;
  @state() private _target_type = 'heating';
  @state() private _created_schedule?: { Id: number; Type: string };
  private _returnView = EViews.Overview;
  private _pendingHomeView?: 'schedules' | 'overview';
  private _schedulesHomeReady = false;
  private _overviewHomeReady = false;

  public static readonly panelApiVersion = 1;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('wiser-schedule-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  public setConfig(config: WiserScheduleCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      name: 'Wiser Schedule',
      ...config,
      home_screen: (config.home_screen as string) === 'devices' ? 'overview' : (config.home_screen ?? 'schedules'),
    };
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  processConfigSchedule(): void {
    if (this.config?.selected_schedule) {
      this._schedule_type = this.config?.selected_schedule.split('|')[0];
      this._schedule_id = parseInt(this.config?.selected_schedule.split('|')[1]);
      this._view = EViews.ScheduleEdit;
    } else {
      this._schedule_type = '';
      this._schedule_id = 0;
      this._view = EViews.Overview;
    }
  }

  public getCardSize(): number {
    return 9;
  }

  protected willUpdate(changedProps: PropertyValues): void {
    if (changedProps.has('config')) {
      this.style.removeProperty('--wiser-navigation-min-height');
      this._returnView = EViews.Overview;
      this._homeView = this.config?.home_screen || 'schedules';
      this._resetHomeViews();
      this.processConfigSchedule();
    } else if (changedProps.has('_view') || changedProps.has('_homeView')) {
      this._preserveNavigationHeight();
      if (changedProps.has('_view') && this._view !== EViews.Overview && this._view !== EViews.RoomSchedule)
        this._resetHomeViews();
    }
    this.component_loaded = this._hass?.config.components.includes('wiser') ?? false;
  }

  private _preserveNavigationHeight = (): void => {
    const height = Math.ceil(this.getBoundingClientRect().height);
    const preservedHeight = Number.parseFloat(this.style.getPropertyValue('--wiser-navigation-min-height')) || 0;
    if (height > preservedHeight) {
      this.style.setProperty('--wiser-navigation-min-height', `${height}px`);
    }
  };

  static styles = css`
    :host {
      font-size: calc(14px + 1pt);
      --mdc-typography-body1-font-size: calc(16px + 1pt);
      --mdc-typography-subtitle1-font-size: calc(16px + 1pt);
      --ha-font-size-m: calc(14px + 1pt);
      display: block;
      min-height: var(--wiser-navigation-min-height, 0px);
      color: var(--primary-text-color);
    }
    ha-card {
      flex: 1;
      overflow: hidden;
    }
    :host([panel-mode]) ha-card {
      border-width: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }
    .card-content {
      box-sizing: border-box;
      padding: 22px 20px 20px;
    }
    :host([panel-mode]) .card-content {
      padding: 24px clamp(12px, 3vw, 32px) 40px;
    }
    .status {
      padding: 20px;
      color: var(--secondary-text-color);
    }
    @media (max-width: 400px) {
      .card-content {
        padding: 18px 12px 12px;
      }
      :host([panel-mode]) .card-content {
        padding: 20px 16px 32px;
      }
    }
    .home-view[hidden] {
      display: none;
    }
  `;

  protected render(): TemplateResult | void {
    if (!this._hass || !this.config) return html``;
    const cardStyle = `${this.config.hide_card_borders ? 'border-width: 0px;' : ''}${this.config.hide_card_background ? 'background: transparent; box-shadow: none; backdrop-filter: none;' : ''}`;
    if (!this.component_loaded)
      return html`<ha-card style=${cardStyle}
        ><div class="status" role="status">${localize('common.integration_unavailable')}</div></ha-card
      >`;

    if (this._view === EViews.Overview || this._view === EViews.RoomSchedule) {
      return html`<ha-card style=${cardStyle}>
        <div class="card-content" @home-view-changed=${this._homeViewChanged}>
          ${
            this._view === EViews.Overview && this._schedulesHomeMounted
              ? html`<div class="home-view" ?hidden=${this._homeView !== 'schedules'}>
                  <wiser-schedules-home
                    .hass=${this._hass}
                    .config=${this.config}
                    @wiser-view-ready=${() => this._homeViewReady('schedules')}
                    @addScheduleClick=${this._addScheduleClick}
                    @scheduleClick=${(event: CustomEvent) => {
                      this._schedule_id = event.detail.Id;
                      this._schedule_type = event.detail.Type;
                      this._returnView = EViews.Overview;
                      this._view = EViews.ScheduleEdit;
                    }}
                  ></wiser-schedules-home>
                </div>`
              : ''
          }
          ${
            this._overviewHomeMounted || this._view === EViews.RoomSchedule
              ? html`<div class="home-view" ?hidden=${this._view === EViews.Overview && this._homeView !== 'overview'}>
                  ${this._renderRoomSchedules()}
                </div>`
              : ''
          }
        </div>
      </ha-card>`;
    }
    if (this._view == EViews.ScheduleEdit && this._schedule_id) {
      return html`
        <ha-card style=${cardStyle}>
          <div
            class="card-content"
            @home-view-changed=${(event: CustomEvent) => {
              if (event.detail === 'schedules' || event.detail === 'overview') this._homeView = event.detail;
            }}
          >
            <wiser-schedule-edit-card
              .hass=${this._hass}
              .config=${this.config}
              .schedule_id=${this._schedule_id}
              .schedule_type=${this._schedule_type}
              @backClick=${this._backClick}
              @editClick=${this._editClick}
              @copyClick=${this._copyClick}
              @scheduleDeleted=${this._scheduleDeleted}
            ></wiser-schedule-edit-card>
          </div>
        </ha-card>
      `;
    } else if (this._view == EViews.ScheduleAdd) {
      return html`
        <ha-card style=${cardStyle}>
          <div
            class="card-content"
            @home-view-changed=${(event: CustomEvent) => {
              if (event.detail === 'schedules' || event.detail === 'overview') this._homeView = event.detail;
            }}
          >
            <wiser-schedule-add-card
              .assign_to=${this._returnView === EViews.RoomSchedule ? this._room_id : undefined}
              .allowed_types=${this._returnView === EViews.RoomSchedule ? [this._target_type] : undefined}
              .hass=${this._hass}
              .config=${this.config}
              @backClick=${this._backClick}
              @scheduleAdded=${this._scheduleAdded}
            ></wiser-schedule-add-card>
          </div>
        </ha-card>
      `;
    } else if (this._view == EViews.ScheduleCopy) {
      return html`
        <ha-card style=${cardStyle}>
          <div
            class="card-content"
            @home-view-changed=${(event: CustomEvent) => {
              if (event.detail === 'schedules' || event.detail === 'overview') this._homeView = event.detail;
            }}
          >
            <wiser-schedule-copy-card
              .hass=${this._hass}
              .config=${this.config}
              .schedule_id=${this._schedule_id}
              .schedule_type=${this._schedule_type}
              @backClick=${this._backClick}
              @scheduleCopied=${this._scheduleCopied}
            ></wiser-schedule-copy-card>
          </div>
        </ha-card>
      `;
    }
    return html``;
  }

  private _resetHomeViews(): void {
    this._pendingHomeView = undefined;
    this._schedulesHomeMounted = this._homeView === 'schedules';
    this._overviewHomeMounted = this._homeView === 'overview';
    this._schedulesHomeReady = false;
    this._overviewHomeReady = false;
  }

  private _homeViewChanged(event: CustomEvent): void {
    const target = event.detail;
    if (target !== 'schedules' && target !== 'overview') return;
    if (target === this._homeView) {
      this._pendingHomeView = undefined;
      return;
    }

    if (target === 'schedules') this._schedulesHomeMounted = true;
    else this._overviewHomeMounted = true;

    const ready = target === 'schedules' ? this._schedulesHomeReady : this._overviewHomeReady;
    if (ready) {
      this._pendingHomeView = undefined;
      this._homeView = target;
    } else {
      // Keep the current home screen visible while the heavier target view loads.
      this._pendingHomeView = target;
    }
  }

  private _homeViewReady(view: 'schedules' | 'overview'): void {
    if (view === 'schedules') this._schedulesHomeReady = true;
    else this._overviewHomeReady = true;
    if (this._pendingHomeView === view) {
      this._pendingHomeView = undefined;
      this._homeView = view;
    }
  }

  private _renderRoomSchedules(): TemplateResult {
    return html`<wiser-room-schedules
      .hass=${this._hass}
      .config=${this.config}
      .room_id=${this._view === EViews.RoomSchedule ? this._room_id : undefined}
      .target_type=${this._target_type}
      .created_schedule=${this._created_schedule}
      @wiser-view-ready=${() => {
        if (this._view === EViews.Overview) this._homeViewReady('overview');
      }}
      @createdScheduleOpened=${() => {
        this._created_schedule = undefined;
      }}
      @roomClick=${(event: CustomEvent<{ id: number; kind: string }>) => {
        this._room_id = event.detail.id;
        this._target_type = event.detail.kind;
        this._view = EViews.RoomSchedule;
      }}
      @roomsBack=${() => {
        this._view = EViews.Overview;
      }}
      @scheduleAction=${(event: CustomEvent) => {
        this._schedule_id = event.detail.schedule_id;
        this._schedule_type = event.detail.schedule_type;
        this._returnView = EViews.RoomSchedule;
        this._view = EViews.ScheduleCopy;
      }}
      @addScheduleClick=${this._addScheduleClick}
    ></wiser-room-schedules>`;
  }

  private _addScheduleClick() {
    this._returnView = this._view;
    this._view = EViews.ScheduleAdd;
  }

  private _editClick() {
    this._view = EViews.ScheduleEdit;
  }

  private _copyClick() {
    this._view = EViews.ScheduleCopy;
  }

  private _backClick(ev: { detail: EViews }) {
    if (ev.detail) {
      this._view =
        ev.detail === EViews.ScheduleEdit && this._returnView === EViews.RoomSchedule ? EViews.RoomSchedule : ev.detail;
    } else {
      this._view = this._returnView;
    }
  }

  private _scheduleDeleted() {
    this._view = this._returnView;
  }

  private _scheduleAdded(event: CustomEvent<{ Id: number; Type: string }>) {
    this._created_schedule = event.detail;
    if (this.config?.home_screen === 'schedules' && event.detail) {
      this._schedule_id = event.detail.Id;
      this._schedule_type = event.detail.Type;
      this._view = EViews.ScheduleEdit;
      return;
    }
    this._view = this._returnView;
  }

  private _scheduleCopied(event: CustomEvent<{ Id: number; Type: string } | undefined>) {
    if (event.detail) {
      this._schedule_id = event.detail.Id;
      this._schedule_type = event.detail.Type;
      this._returnView = EViews.Overview;
      this._view = EViews.ScheduleEdit;
      return;
    }
    this._view = this._returnView === EViews.RoomSchedule ? EViews.RoomSchedule : EViews.ScheduleEdit;
  }
}
