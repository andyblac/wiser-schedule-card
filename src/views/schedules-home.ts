import '../components/home-navigation';
import { customElement } from '../components/register-element';
import '../components/card-header';
import { LitElement, html, css, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { SubscribeMixin } from '../components/subscribe-mixin';
import { notifyViewReady } from '../components/view-ready';
import { fetchSchedules } from '../data/websockets';
import { allow_edit } from '../helpers';
import { localizeForHass } from '../localize/localize';
import type { ScheduleListItem, WiserScheduleCardConfig, WiserEventData } from '../types';

@customElement('wiser-schedules-home')
export class SchedulesHome extends SubscribeMixin(LitElement) {
  private localize(key: string, search = '', replace = ''): string {
    return localizeForHass(this.hass, key, search, replace);
  }
  @property({ attribute: false }) config!: WiserScheduleCardConfig;
  @state() private schedules: ScheduleListItem[] = [];
  @state() private loading = true;
  @state() private error = '';
  private request = 0;
  public hassSubscribe() {
    return [
      this.hass!.connection.subscribeMessage(
        (event: WiserEventData) => {
          if (event.event === 'wiser_updated' && (!this.config.hub || event.hub === this.config.hub)) void this.load();
        },
        { type: 'wiser_updated' },
      ),
    ];
  }
  protected updated(changed: PropertyValues) {
    super.updated(changed);
    if (changed.has('config') || (changed.has('hass') && !changed.get('hass'))) void this.load();
  }
  private async load() {
    if (!this.hass || !this.config) return;
    const request = ++this.request;
    this.error = '';
    try {
      const schedules = await fetchSchedules(this.hass, this.config.hub);
      if (request === this.request) this.schedules = [...schedules].sort((a, b) => a.Name.localeCompare(b.Name));
    } catch (error) {
      if (request === this.request) this.error = (error as Error).message || this.localize('common.load_failed');
    } finally {
      if (request === this.request) {
        this.loading = false;
        await notifyViewReady(this);
      }
    }
  }
  protected render() {
    if (!this.hass) return html``;
    return html`
      <wiser-card-header .config=${this.config}>
        <div class="home-tools" role="toolbar" aria-label="Home">
          <wiser-home-navigation
            .hass=${this.hass}
            active="schedules"
            .canAdd=${allow_edit(this.hass, this.config) && !this.loading && !this.error}
          ></wiser-home-navigation></div
      ></wiser-card-header>
      <div class="heading"><h3>${this.localize('wiser.rooms.schedules')}</h3></div>
      ${
        this.error
          ? html`<p role="alert">${this.error}</p>
              <button @click=${this.load}>${this.localize('common.retry')}</button>`
          : this.loading
            ? html`<p role="status">${this.localize('common.loading')}</p>`
            : !this.schedules.length
              ? html`<p>${this.localize('wiser.home.no_schedules')}</p>`
              : html` <div class=${this.config.view_type === 'list' ? 'tiles list' : 'tiles'}>
                  ${this.schedules.map(
                    (schedule) =>
                      html`<button
                        class="schedule-tile"
                        @click=${() => this.dispatchEvent(new CustomEvent('scheduleClick', { detail: schedule }))}
                      >
                        <ha-icon .icon=${schedule.Id === 1000 ? 'mdi:water-boiler' : 'mdi:calendar-clock'}></ha-icon>
                        <span
                          ><strong>${schedule.Name}</strong
                          ><small
                            >${schedule.Type} · ${schedule.Assignments}
                            ${this.localize('wiser.home.assignments')}</small
                          ></span
                        ><span aria-hidden="true">›</span>
                      </button>`,
                  )}
                </div>`
      }
    `;
  }
  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color);
    }
    .home-tools {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    .heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    h3 {
      margin: 0;
      font-size: calc(15px + 1pt);
    }
    button {
      font: inherit;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      padding: 14px;
      min-height: 44px;
      cursor: pointer;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }
    button:hover {
      border-color: var(--primary-color);
    }
    ha-icon {
      color: var(--primary-color);
      flex-shrink: 0;
    }
    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 210px), 1fr));
      gap: 10px;
    }
    .tiles.list {
      grid-template-columns: 1fr;
    }
    .schedule-tile {
      display: flex;
      align-items: center;
      gap: 12px;
      text-align: start;
      min-height: 82px;
    }
    .schedule-tile span:first-of-type {
      flex: 1;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    strong {
      display: block;
      font-weight: 500;
    }
    small {
      display: block;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
  `;
}
