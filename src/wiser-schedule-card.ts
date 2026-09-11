/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, css, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, getLovelace } from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers

import type { WiserScheduleCardConfig } from './types';
import { CARD_VERSION, EViews } from './const';
import { localize } from './localize/localize';

import './views/room-schedules';
import './views/schedules-home';
import './views/schedule-edit';
import './views/schedule-add';
import './views/schedule-copy';
import './views/schedule-rename';
import './editor';

/* eslint no-console: 0 */
console.info(
  `%c  WISER-SCHEDULE-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
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
  @state() private _target_type = 'heating';
  @state() private _created_schedule?: { Id: number; Type: string };
  private _returnView = EViews.Overview;

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
      this.style.removeProperty('--wiser-view-min-height');
      this._returnView = EViews.Overview;
      this.processConfigSchedule();
    } else if (changedProps.has('_view')) {
      // Views fetch their data after mounting. Preserve the outgoing content's
      // space only until the incoming view has rendered its loaded content.
      // This avoids a loading collapse without retaining a taller view's height.
      const content = this.renderRoot.querySelector<HTMLElement>('.card-content');
      if (content) {
        this.style.setProperty('--wiser-view-min-height', `${content.getBoundingClientRect().height}px`);
      }
    }
    this.component_loaded = this._hass?.config.components.includes('wiser') ?? false;
  }

  private _viewReady(event: Event): void {
    const content = this.renderRoot.querySelector('.card-content');
    if (event.target === content?.firstElementChild) {
      this.style.removeProperty('--wiser-view-min-height');
    }
  }

  static styles = css`
    :host {
      font-size: calc(14px + 1pt);
      --mdc-typography-body1-font-size: calc(16px + 1pt);
      --mdc-typography-subtitle1-font-size: calc(16px + 1pt);
      --ha-font-size-m: calc(14px + 1pt);
      display: block;
      color: var(--primary-text-color);
    }
    ha-card {
      overflow: hidden;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 44px;
      padding: 22px 20px 20px;
    }
    .brand-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 0;
      min-width: 0;
      line-height: 1.2;
    }
    .brand-name {
      flex-shrink: 0;
      color: var(--wiser-brand-color, #279f43);
      font-family: 'Arial Rounded MT Bold', 'Trebuchet MS', sans-serif;
      font-size: calc(32px + 1pt);
      font-weight: 700;
      letter-spacing: -1.5px;
    }
    .brand-title {
      min-width: 0;
      padding-inline-start: 14px;
      border-inline-start: 1px solid var(--divider-color, #ddd);
      color: var(--primary-text-color);
      font-size: calc(15px + 1pt);
      font-weight: 500;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }
    .card-content {
      box-sizing: border-box;
      min-height: var(--wiser-view-min-height, 0px);
      padding: 0 20px 20px;
    }
    .status {
      padding: 20px;
      color: var(--secondary-text-color);
    }
    @media (max-width: 400px) {
      .card-header {
        padding: 18px 12px;
      }
      .brand-header {
        gap: 12px;
      }
      .brand-title {
        padding-inline-start: 12px;
      }
      .card-content {
        padding: 0 12px 12px;
      }
    }
  `;

  private renderHeader(): TemplateResult {
    const name = this.config?.name;
    if (!name) return html``;
    const rooms = this._view === EViews.Overview || this._view === EViews.RoomSchedule;
    const title = name === 'Wiser Schedule' ? (rooms ? '' : localize('wiser.rooms.schedules')) : name;
    return html`<header class="card-header">
      <h2 class="brand-header">
        <span class="brand-name">Wiser</span>${title ? html`<span class="brand-title">${title}</span>` : ''}
      </h2>
    </header>`;
  }

  protected render(): TemplateResult | void {
    if (!this._hass || !this.config) return html``;
    if (!this.component_loaded)
      return html`<ha-card
        ><div class="status" role="status">${localize('common.integration_unavailable')}</div></ha-card
      >`;
    const border_style = this.config.hide_card_borders ? 'border-width: 0px' : '';
    if (this._view === EViews.Overview && this.config.home_screen === 'schedules') {
      return html`<ha-card style=${border_style}
        >${this.renderHeader()}
        <div class="card-content" @wiser-view-ready=${this._viewReady}>
          <wiser-schedules-home
            .hass=${this._hass}
            .config=${this.config}
            @addScheduleClick=${this._addScheduleClick}
            @scheduleClick=${(event: CustomEvent) => {
              this._schedule_id = event.detail.Id;
              this._schedule_type = event.detail.Type;
              this._returnView = EViews.Overview;
              this._view = EViews.ScheduleEdit;
            }}
          ></wiser-schedules-home></div
      ></ha-card>`;
    }
    if (this._view === EViews.Overview || this._view === EViews.RoomSchedule) {
      return html` <ha-card style=${border_style}>
        ${this.renderHeader()}
        <div class="card-content" @wiser-view-ready=${this._viewReady}>
          <wiser-room-schedules
            .hass=${this._hass}
            .config=${this.config}
            .room_id=${this._view === EViews.RoomSchedule ? this._room_id : undefined}
            .target_type=${this._target_type}
            .created_schedule=${this._created_schedule}
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
              this._view = event.detail.action === 'rename' ? EViews.ScheduleRename : EViews.ScheduleCopy;
            }}
            @addScheduleClick=${this._addScheduleClick}
          >
          </wiser-room-schedules>
        </div>
      </ha-card>`;
    } else if (this._view == EViews.ScheduleEdit && this._schedule_id) {
      return html`
        <ha-card style=${border_style}>
          ${this.renderHeader()}
          <div class="card-content" @wiser-view-ready=${this._viewReady}>
            <wiser-schedule-edit-card
              .hass=${this._hass}
              .config=${this.config}
              .schedule_id=${this._schedule_id}
              .schedule_type=${this._schedule_type}
              @backClick=${this._backClick}
              @renameClick=${this._renameClick}
              @editClick=${this._editClick}
              @copyClick=${this._copyClick}
              @scheduleDeleted=${this._scheduleDeleted}
            ></wiser-schedule-edit-card>
          </div>
        </ha-card>
      `;
    } else if (this._view == EViews.ScheduleAdd) {
      return html`
        <ha-card style=${border_style}>
          ${this.renderHeader()}
          <div class="card-content" @wiser-view-ready=${this._viewReady}>
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
        <ha-card style=${border_style}>
          ${this.renderHeader()}
          <div class="card-content" @wiser-view-ready=${this._viewReady}>
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
    } else if (this._view == EViews.ScheduleRename) {
      return html`
        <ha-card style=${border_style}>
          ${this.renderHeader()}
          <div class="card-content" @wiser-view-ready=${this._viewReady}>
            <wiser-schedule-rename-card
              .hass=${this._hass}
              .config=${this.config}
              .schedule_id=${this._schedule_id}
              .schedule_type=${this._schedule_type}
              @backClick=${this._backClick}
              @scheduleRenamed=${this._scheduleRenamed}
            ></wiser-schedule-rename-card>
          </div>
        </ha-card>
      `;
    }
    return html``;
  }

  private _addScheduleClick() {
    this._returnView = this._view;
    this._view = EViews.ScheduleAdd;
  }

  private _renameClick() {
    this._view = EViews.ScheduleRename;
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

  private _scheduleCopied() {
    this._view = this._returnView === EViews.RoomSchedule ? EViews.RoomSchedule : EViews.ScheduleEdit;
  }

  private _scheduleRenamed() {
    this._view = this._returnView === EViews.RoomSchedule ? EViews.RoomSchedule : EViews.ScheduleEdit;
  }
}
