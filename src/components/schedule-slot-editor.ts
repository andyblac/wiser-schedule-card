import { customElement } from './register-element';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { nativeControlStyle } from '../styles';
import { mdiRadiatorOff, mdiUnfoldMoreVertical } from '@mdi/js';
import type { WiserScheduleCardConfig, ScheduleSlot, Schedule, ScheduleDay, SunTimes } from '../types';
import { color_map, getLocale, get_end_time, get_setpoint, stringTimeToSeconds } from '../helpers';
import {
  HEATING_TYPES,
  SEC_PER_DAY,
  day_short_width,
  days,
  DefaultSetpoint,
  SetpointUnits,
  SPECIAL_TIMES,
  SUPPORT_SPECIAL_TIMES,
  SPECIAL_DAYS,
  weekdays,
  weekends,
} from '../const';
import './dialog-delete-confirm';
import { roundTime, stringToTime, timeToString, timeToStringShort } from '../data/date-time/time';
import { formatTime } from '../data/date-time/format_time';
import { stringToDate } from '../data/date-time/string_to_date';
import './variable-slider';
import './time-bar';
import { localizeForHass } from '../localize/localize';

@customElement('wiser-schedule-slot-editor')
export class ScheduleSlotEditor extends LitElement {
  private localize(key: string, search = '', replace = ''): string {
    return localizeForHass(this.hass, key, search, replace);
  }
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) config?: WiserScheduleCardConfig;

  @property({ attribute: false }) schedule?: Schedule;
  @property({ attribute: false }) suntimes?: SunTimes;

  @property({ attribute: false }) editMode = false;

  @state() _activeSlot = -99;
  @state() _activeDay = '';
  @state() _show_short_days = false;
  @state() _dropDay = '';
  @state() private _dragGhost?: {
    left: number;
    top: number;
    width: number;
    height: number;
    background: string;
    colour: string;
    label: string;
    valid: boolean;
  };

  schedule_type?: string = HEATING_TYPES[0];
  activeMarker: number | null = 0;
  isDragging = false;
  currentTime = 0;
  timer = 0;
  timeout = 0;
  zoomFactor = 1;

  @state() rangeMin = 0; //lower bound of zoomed timeframe

  @state() rangeMax: number = SEC_PER_DAY; //upper bound of zoomed timeframe

  @state() stepSize = 5;

  constructor() {
    super();
    this.initialise();
  }

  async initialise(): Promise<boolean> {
    if (this.schedule) {
      this.schedule_type = this.schedule.Type;
    }
    return true;
  }

  protected shouldUpdate(): boolean {
    if (!this.editMode) {
      this._activeSlot = -99;
      this._activeDay = '';
    }
    return true;
  }

  public clearSelection(): void {
    this._activeSlot = -99;
    this._activeDay = '';
    this._dropDay = '';
    this._dragGhost = undefined;
    this.isDragging = false;
  }

  render(): TemplateResult {
    const fullWidth = parseFloat(getComputedStyle(this).getPropertyValue('width'));
    this._show_short_days = fullWidth < day_short_width;
    if (!this.hass || !this.config || !this.suntimes || !this.schedule) return html``;
    return html`
            <div class = "slots-wrapper">
                ${days.map((day) =>
                  this.renderDay(
                    this.schedule!.ScheduleData.filter((rday) => rday.day == day)[0]
                      ? this.schedule!.ScheduleData.filter((rday) => rday.day == day)[0]
                      : { day: day, slots: [] },
                  ),
                )}
                <div class="wrapper" style="display:flex; height:28px;">
                    <div class="day  ${this._show_short_days ? 'short' : ''}">&nbsp;</div>
                        <wiser-time-bar style="width:100%"
                            .hass=${this.hass}
                            ></wiser-time-bar>
                    </div>
                </div>
            </div>
            ${
              this.editMode
                ? html`
                    <div class="schedule-editor-area ${this._show_short_days ? 'short' : ''}">
                      ${this.renderAddButton()} ${this._activeSlot >= 0 ? this.renderSelectedPeriod() : null}
                    </div>
                  `
                : null
            }
            ${this.editMode ? this.renderCopyDay() : null}
            ${
              this._dragGhost
                ? html`<div
                    class="period-drag-ghost ${this._dragGhost.valid ? 'valid' : ''}"
                    style="left:${this._dragGhost.left}px; top:${this._dragGhost.top}px; width:${this._dragGhost.width}px; height:${this._dragGhost.height}px; background:${this._dragGhost.background}; color:${this._dragGhost.colour};"
                    aria-hidden="true"
                  >
                    ${this._dragGhost.label}
                  </div>`
                : ''
            }
        `;
  }

  renderDay(day: ScheduleDay): TemplateResult {
    const slot: ScheduleSlot = { Time: '23:59', Setpoint: '0', SpecialTime: '' };
    return html`
      <div class="wrapper">
        ${this.computeDayLabel(day.day)}
        <div class="outer ${this._dropDay === day.day ? 'drop-target' : ''}" id="${day.day}">
          <div class="wrapper selectable">
            ${
              day.slots.length > 0
                ? day.slots.map((slot, index) => this.renderSlot(slot, index, day))
                : this.renderEmptySlot(slot, -1, day, true)
            }
          </div>
        </div>
      </div>
    `;
  }

  renderEmptySlot(slot: ScheduleSlot, index: number, day: ScheduleDay, onlySlot = false) {
    const start_time = '00:00';
    const end_time = slot.Time;
    const setpoint = get_setpoint(day, index, this.schedule!);
    const fullWidth = parseFloat(getComputedStyle(this).getPropertyValue('width'));
    const inactiveLevel =
      !this.config!.theme_colors && ['Lighting', 'Shutters'].includes(this.schedule_type!) && Number(setpoint) === 0;
    const colour = this.config!.theme_colors
      ? 'rgba(var(--rgb-primary-color), 0.7)'
      : inactiveLevel
        ? 'var(--secondary-background-color, #eeeeee)'
        : 'rgba(' + color_map(this, this.schedule_type!, setpoint) + ')';
    const labelColour =
      this.config!.theme_colors || inactiveLevel ? 'var(--primary-text-color)' : this.contrastColour(colour);
    const width = ((stringTimeToSeconds(end_time) - stringTimeToSeconds(start_time)) / SEC_PER_DAY) * 100;
    const title =
      this.localize('wiser.labels.start') +
      ' - ' +
      start_time +
      '\n' +
      this.localize('wiser.labels.end') +
      ' - ' +
      end_time +
      '\n' +
      this.localize('wiser.labels.setting') +
      ' - ' +
      this.computeSetpointLabel(setpoint);
    const label_class = (width / 100) * fullWidth < 35 ? 'setpoint rotate' : 'setpoint';
    return html`
      <div
        id=${day.day + '|-1'}
        class="slot previous ${this.editMode && onlySlot ? 'selectable' : null} ${
          this._activeSlot == index && this._activeDay == day.day ? 'selected' : null
        } ${this.config!.theme_colors ? 'theme-colors' : null} ${inactiveLevel ? 'inactive-level' : null}"
        style="width:${Math.floor(width * 1000) / 1000}%; background:${colour}; --slot-label-color:${labelColour};"
        title="${title}"
        @click=${onlySlot ? this._slotClick : null}
        slot="${-1}"
      >
        <div class="slotoverlay previous">
          <span class="${label_class}">${this.computeSetpointLabel(setpoint)}</span>
        </div>
      </div>
    `;
  }

  renderSlot(slot: ScheduleSlot, index: number, day: ScheduleDay) {
    const start_time = slot.Time;
    const end_time = get_end_time(day, index);
    const setpoint = slot.Setpoint;
    const width = ((stringTimeToSeconds(end_time) - stringTimeToSeconds(start_time)) / SEC_PER_DAY) * 100;
    const inactiveLevel =
      !this.config!.theme_colors && ['Lighting', 'Shutters'].includes(this.schedule_type!) && Number(setpoint) === 0;
    const colour = this.config!.theme_colors
      ? 'rgba(var(--rgb-primary-color), 0.7)'
      : inactiveLevel
        ? 'var(--secondary-background-color, #eeeeee)'
        : 'rgba(' + color_map(this, this.schedule_type!, setpoint) + ')';
    const labelColour =
      this.config!.theme_colors || inactiveLevel ? 'var(--primary-text-color)' : this.contrastColour(colour);
    const selected = this._activeSlot == index && this._activeDay == day.day;
    const selectedBoundary =
      this.editMode && this._activeDay === day.day && (index === this._activeSlot || index === this._activeSlot + 1);
    const movable =
      selected &&
      index < day.slots.length - 1 &&
      !SPECIAL_TIMES.includes(slot.SpecialTime) &&
      !SPECIAL_TIMES.includes(day.slots[index + 1].SpecialTime);
    const fullWidth = parseFloat(getComputedStyle(this).getPropertyValue('width'));
    const label_class = (width / 100) * fullWidth < 35 ? 'setpoint rotate' : 'setpoint';
    const title =
      this.localize('wiser.labels.start') +
      ' - ' +
      (slot.SpecialTime ? slot.SpecialTime + ' (' + start_time + ')' : start_time) +
      '\n' +
      this.localize('wiser.labels.end') +
      ' - ' +
      end_time +
      '\n' +
      this.localize('wiser.labels.setting') +
      ' - ' +
      this.computeSetpointLabel(setpoint);

    return html`
      ${index == 0 && start_time != '00:00' && start_time != '0:00' ? this.renderEmptySlot(slot, -1, day, false) : ''}
      <div
        id=${day.day + '|' + index}
        class="slot ${this.editMode ? 'selectable' : null} ${selected ? 'selected' : null} ${
          movable ? 'movable' : null
        } ${inactiveLevel ? 'inactive-level' : null}"
        style="width:${Math.floor(width * 1000) / 1000}%; background:${colour}; --slot-label-color:${labelColour};"
        title="${title}"
        @click=${this._slotClick}
        @pointerdown=${movable ? (event: PointerEvent) => this._handleSlotPointerStart(event, day, index) : null}
        slot="${index}"
      >
        <div class="slotoverlay ${this.editMode ? 'selectable' : null}">
          <span class="${label_class}">${this.computeSetpointLabel(setpoint)}</span>
        </div>
        ${SPECIAL_TIMES.includes(slot.SpecialTime) && !selectedBoundary ? this.renderSpecialTimeMarker(slot.SpecialTime) : ''}
        ${
          selected
            ? html`
                ${stringToTime(day.slots[index].Time) > 0 ? this.renderBoundaryHandle(day, index, false) : ''}
                ${index < day.slots.length - 1 ? this.renderBoundaryHandle(day, index + 1, true) : ''}
              `
            : ''
        }
      </div>
    `;
  }

  private renderBoundaryHandle(day: ScheduleDay, boundary: number, end: boolean): TemplateResult {
    const specialTime = day.slots[boundary]?.SpecialTime;
    if (SPECIAL_TIMES.includes(specialTime)) {
      return this.renderTooltip(day, boundary, end);
    }
    return html`
      <div
        class=${end ? 'handle end-handle' : 'handle'}
        data-boundary=${boundary}
        @click=${(event: Event) => event.stopPropagation()}
        @pointerdown=${this._handlePointerStart}
      >
        <div class="button-holder">
          <ha-icon-button
            class="time-handle"
            .label=${end ? 'Adjust end time' : 'Adjust start time'}
            .path=${mdiUnfoldMoreVertical}
            @click=${(event: Event) => event.stopPropagation()}
          ></ha-icon-button>
        </div>
      </div>
      ${this.renderTooltip(day, boundary, end)}
    `;
  }

  private renderSpecialTimeMarker(specialTime: string): TemplateResult {
    const label = this.localize(`wiser.labels.${specialTime.toLowerCase()}`);
    return html`<span class="special-time-marker" role="img" aria-label=${label} title=${label}>
      <ha-icon
        icon="hass:${specialTime === SPECIAL_TIMES[0] ? 'weather-sunny' : 'weather-night'}"
        aria-hidden="true"
      ></ha-icon>
    </span>`;
  }

  private contrastColour(colour: string): string {
    const values = colour
      .match(/[\d.]+/g)
      ?.slice(0, 3)
      .map(Number);
    if (!values || values.length < 3) return 'var(--primary-text-color)';
    const [red, green, blue] = values.map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.42 ? '#1c1c1c' : '#ffffff';
  }

  private activeSlot(): ScheduleSlot | undefined {
    if (!this._activeDay || this._activeSlot < 0) return undefined;
    return this.schedule?.ScheduleData.find((day) => day.day === this._activeDay)?.slots[this._activeSlot];
  }

  private activePeriodLabel(): string {
    const day = this.schedule?.ScheduleData.find((item) => item.day === this._activeDay);
    const slot = this.activeSlot();
    if (!day || !slot) return '';
    const start = formatTime(stringToDate(timeToString(stringToTime(slot.Time))), getLocale(this.hass!));
    const end = formatTime(
      stringToDate(timeToString(stringToTime(get_end_time(day, this._activeSlot)))),
      getLocale(this.hass!),
    );
    return `${start}\u2013${end}`;
  }

  renderSelectedPeriod(): TemplateResult {
    return html`
      <section class="selected-period" aria-label=${this.localize('wiser.labels.selected_period')}>
        <div class="selected-period-header">
          <div>
            <h3>${this.localize('wiser.labels.selected_period')}</h3>
            <span>${this.activePeriodLabel()}</span>
          </div>
        </div>
        <div class="selected-period-controls">
          ${SUPPORT_SPECIAL_TIMES.includes(this.schedule_type!) ? this.renderSpecialTimeButtons() : null}
          ${this.renderSetPointControl()}
        </div>
        <div class="delete-period-row">
          <ha-button variant="danger" @click=${this._removeSlot}>
            <ha-icon slot="start" icon="hass:delete-outline" class="padded-right"></ha-icon>
            ${this.localize('wiser.actions.delete_period')}
          </ha-button>
        </div>
      </section>
    `;
  }

  renderSpecialTimeButtons(): TemplateResult {
    const day = this._activeDay ? this.schedule!.ScheduleData.find((rday) => rday.day === this._activeDay) : null;
    const slot = day?.slots[this._activeSlot];
    const endSlot = day?.slots[this._activeSlot + 1];
    const sunriseSelected = slot?.SpecialTime === 'Sunrise';
    const sunsetSelected = (endSlot || slot)?.SpecialTime === 'Sunset';
    const fixedSelected = !sunriseSelected && !sunsetSelected;
    return html`
      <div class="editor-control-row">
        <div class="section-header" aria-disabled=${!slot}>${this.localize('wiser.labels.time')}</div>
        <div
          class="control-content special-times"
          role="group"
          aria-label=${this.localize('wiser.labels.special_time')}
        >
          <ha-button
            id="fixed"
            class=${fixedSelected ? 'selected' : ''}
            appearance="plain"
            @click=${this._setSpecialTime}
            .disabled=${!slot}
          >
            ${this.localize('wiser.labels.fixed')}
          </ha-button>
          <ha-button
            id="sunrise"
            class=${sunriseSelected ? 'selected' : ''}
            appearance="plain"
            @click=${this._setSpecialTime}
            .disabled=${!slot}
          >
            ${this.localize('wiser.labels.sunrise')}
          </ha-button>
          <ha-button
            id="sunset"
            class=${sunsetSelected ? 'selected' : ''}
            appearance="plain"
            @click=${this._setSpecialTime}
            .disabled=${!slot}
          >
            ${this.localize('wiser.labels.sunset')}
          </ha-button>
        </div>
      </div>
    `;
  }

  renderAddButton(): TemplateResult {
    let slotCount = 0;
    if (this.schedule!.ScheduleData.filter((day) => day.day == this._activeDay).length > 0) {
      slotCount = this._activeDay
        ? this.schedule!.ScheduleData.filter((day) => day.day == this._activeDay)[0].slots.length
        : 0;
    }
    return html`
      <div class="add-period-row">
        <ha-button @click=${this._addSlot} .disabled=${this._activeSlot < -1 || slotCount >= 24}>
          <ha-icon slot="start" icon="hass:plus-circle-outline" class="padded-right"></ha-icon>
          ${this.localize('wiser.actions.add_period')}
        </ha-button>
      </div>
    `;
  }

  renderSetPointControl(): TemplateResult {
    let slots = {};
    if (this.editMode) {
      if (this.schedule!.ScheduleData.filter((day) => day.day == this._activeDay).length > 0) {
        slots = this._activeDay
          ? this.schedule!.ScheduleData.filter((rday) => rday.day == this._activeDay)[0].slots
          : {};
      }
      if (this.schedule_type == 'Heating') {
        return html`
          <div class="editor-control-row heating-control-row">
            <div class="section-header" aria-disabled=${this._activeSlot < 0}>
              ${this.localize('wiser.labels.temperature')}
            </div>
            <div class="control-content temperature-input">
              <button
                type="button"
                aria-label=${this.localize('wiser.heating.off')}
                class="set-off-button"
                .disabled=${this._activeSlot < 0}
                @click=${() => this._updateSetPoint('-20')}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d=${mdiRadiatorOff}></path></svg>
              </button>
              <wiser-variable-slider
                min="5"
                max="30"
                step="0.5"
                value=${this._activeSlot >= 0 ? parseFloat(slots![this._activeSlot!].Setpoint) : 0}
                unit="°C"
                .label=${this.localize('wiser.labels.temperature')}
                .optional=${false}
                .disabled=${this._activeSlot < 0}
                @value-changed=${(ev: CustomEvent) => {
                  this._updateSetPoint(Number(ev.detail.value));
                }}
              >
              </wiser-variable-slider>
            </div>
          </div>
        `;
      } else if (this.schedule_type == 'OnOff') {
        return html`
          <div class="editor-control-row state-control-row">
            <div class="section-header" aria-disabled=${this._activeSlot < 0}>
              ${this.localize('wiser.labels.state')}
            </div>
            <div
              class="control-content state-controls"
              role="radiogroup"
              aria-label=${this.localize('wiser.labels.state')}
            >
              ${['Off', 'On'].map(
                (value) => html`
                  <label class="state-choice">
                    <span>${this.localize('wiser.labels.' + value.toLowerCase())}</span>
                    <input
                      type="radio"
                      name="scheduled-state"
                      value=${value}
                      .checked=${this._activeSlot >= 0 && slots[this._activeSlot!].Setpoint === value}
                      .disabled=${this._activeSlot < 0}
                      @change=${() => this._updateSetPoint(value)}
                    />
                  </label>
                `,
              )}
            </div>
          </div>
        `;
      } else if (['Lighting', 'Shutters'].includes(this.schedule_type!)) {
        return html`
          <div class="editor-control-row level-control-row">
            <div class="section-header" aria-disabled=${this._activeSlot < 0}>
              ${this.localize('wiser.labels.level')}
            </div>
            <div class="control-content level-control">
              <wiser-variable-slider
                min="0"
                max="100"
                step="1"
                value=${this._activeSlot >= 0 ? parseFloat(slots![this._activeSlot!].Setpoint) : 0}
                unit="%"
                .label=${this.localize('wiser.labels.level')}
                .minLabel=${this.schedule_type === 'Shutters' ? this.localize('wiser.labels.closed') : ''}
                .maxLabel=${this.schedule_type === 'Shutters' ? this.localize('wiser.labels.open') : ''}
                .optional=${false}
                .disabled=${this._activeSlot < 0}
                @value-changed=${(ev: CustomEvent) => this._updateSetPoint(Number(ev.detail.value))}
              ></wiser-variable-slider>
            </div>
          </div>
        `;
      }
      return html``;
    }
    return html``;
  }

  renderCopyDay(): TemplateResult {
    return html`
      <div class="copy-section">
        <div>
          <div class="section-header" aria-disabled=${!this._activeDay}>
            ${
              this._activeDay
                ? this.localize('wiser.actions.copy') +
                  ' ' +
                  this.localize('wiser.days.' + this._activeDay.toLowerCase()) +
                  ' ' +
                  this.localize('wiser.labels.to')
                : this.localize('wiser.actions.copy') + ' ' + this.localize('wiser.labels.to')
            }
          </div>
          <div class="copy-options">
            ${days
              .concat(SPECIAL_DAYS)
              .concat('All')
              .filter((day) => day !== this._activeDay)
              .map((day) => this.renderCopyToButton(day))}
          </div>
        </div>
      </div>
    `;
  }

  renderCopyToButton(day: string): TemplateResult {
    return html`
      <ha-button
        appearance="plain"
        id=${day}
        @click=${this._copyDay}
        .disabled=${this._activeDay == day || !this._activeDay}
      >
        ${
          days.includes(day) && this._show_short_days
            ? this.localize('wiser.days.short.' + day.toLowerCase())
            : this.localize('wiser.days.' + day.toLowerCase())
        }
      </ha-button>
    `;
  }

  renderTooltip(day: ScheduleDay, i: number, end = false): TemplateResult {
    const slots = day.slots;
    const res = SPECIAL_TIMES.includes(slots![i].SpecialTime);
    return html`
      <div class=${end ? 'tooltip-container center end-time' : 'tooltip-container center'}>
        <div class="tooltip ${this._activeSlot === i ? 'active' : ''}">
          ${
            res
              ? html`
                  <ha-icon
                    icon="hass:${slots![i].SpecialTime == SPECIAL_TIMES[0] ? 'weather-sunny' : 'weather-night'}"
                  ></ha-icon>
                  ${slots![i].SpecialTime}
                `
              : formatTime(stringToDate(timeToString(stringToTime(slots![i].Time))), getLocale(this.hass!))
          }
        </div>
      </div>
    `;
  }

  private _slotClick(ev): void {
    if (this.isDragging) return;
    const target = ev.currentTarget;
    if (target.id) {
      const day = target.id.split('|')[0];
      const slot = target.id.split('|')[1];
      if (!(slot == this._activeSlot && day == this._activeDay)) {
        this._activeSlot = parseInt(slot);
        this._activeDay = day;
      } else {
        this._activeSlot = -99;
        this._activeDay = '';
      }
      const myEvent = new CustomEvent('slotClicked', {
        detail: { day: this._activeDay, slot: this._activeSlot },
      });
      this.dispatchEvent(myEvent);
    }
  }

  private _copyDay(ev): void {
    const target = ev.currentTarget;
    const slotData = JSON.stringify(this.schedule!.ScheduleData[days.indexOf(this._activeDay!)].slots);
    if (days.includes(target.id)) {
      this.schedule!.ScheduleData[days.indexOf(target.id)].slots = JSON.parse(slotData);
    } else if (target.id == SPECIAL_DAYS[0]) {
      weekdays.map((day) => {
        this.schedule!.ScheduleData[days.indexOf(day)].slots = JSON.parse(slotData);
      });
    } else if (target.id == SPECIAL_DAYS[1]) {
      weekends.map((day) => {
        this.schedule!.ScheduleData[days.indexOf(day)].slots = JSON.parse(slotData);
      });
    } else if (target.id == 'All') {
      days.map((day) => {
        this.schedule!.ScheduleData[days.indexOf(day)].slots = JSON.parse(slotData);
      });
    }
    this.requestUpdate();
  }

  _updateSetPoint(setpoint: string | number): void {
    this.schedule!.ScheduleData[days.indexOf(this._activeDay!)].slots = Object.assign(
      this.schedule!.ScheduleData[days.indexOf(this._activeDay!)].slots,
      {
        [this._activeSlot!]: {
          ...this.schedule!.ScheduleData[days.indexOf(this._activeDay!)].slots![this._activeSlot!],
          Setpoint: setpoint,
        },
      },
    );
    const myEvent = new CustomEvent('scheduleChanged', {
      detail: { schedule: this.schedule },
    });
    this.dispatchEvent(myEvent);
    this.requestUpdate();
  }

  getSunTime(day: string, time: string): string {
    const times = time === SPECIAL_TIMES[0] ? this.suntimes!.Sunrises : this.suntimes!.Sunsets;
    return (
      times.find((item) => item.day?.toLowerCase() === day.toLowerCase())?.time ||
      times[days.indexOf(day)]?.time ||
      '00:00'
    );
  }

  convertScheduleDay(day: ScheduleDay): ScheduleDay {
    const slots = day.slots;
    const outputSlots: ScheduleSlot[] = slots
      .map((slot) => {
        return SPECIAL_TIMES.includes(slot.SpecialTime)
          ? { Time: this.getSunTime(day.day, slot.SpecialTime), Setpoint: slot.Setpoint, SpecialTime: slot.SpecialTime }
          : { Time: slot.Time, Setpoint: slot.Setpoint, SpecialTime: slot.SpecialTime };
      })
      .sort((a, b) => stringToTime(a.Time) - stringToTime(b.Time));

    const outputSlotsSet = new Set(outputSlots.map((e) => JSON.stringify(e)));
    const res = Array.from(outputSlotsSet).map((e) => JSON.parse(e));
    const outputDay: ScheduleDay = { day: day.day, slots: res };
    return outputDay;
  }

  private _setSpecialTime(ev) {
    const titleCase = (str) => {
      return str.replace(/\w\S*/g, (t) => {
        return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
      });
    };
    const specialTime = titleCase(ev.currentTarget.id);
    if (this._activeDay && this._activeSlot >= 0) {
      const dayIndex = days.indexOf(this._activeDay);
      const day = this.schedule!.ScheduleData[dayIndex];
      const activeSlot = day.slots[this._activeSlot];
      if (!activeSlot) return;

      if (specialTime === 'Fixed') {
        day.slots[this._activeSlot] = { ...activeSlot, SpecialTime: '' };
        if (day.slots[this._activeSlot + 1]) {
          day.slots[this._activeSlot + 1] = { ...day.slots[this._activeSlot + 1], SpecialTime: '' };
        }
        this.dispatchEvent(new CustomEvent('scheduleChanged', { detail: { schedule: this.schedule } }));
        this.requestUpdate();
        return;
      }

      const selectedStart = {
        Time: activeSlot.Time,
        Setpoint: activeSlot.Setpoint,
        SpecialTime: activeSlot.SpecialTime,
      };
      const sunsetStartsLastPeriod = specialTime === 'Sunset' && this._activeSlot === day.slots.length - 1;
      const targetIndex = specialTime === 'Sunrise' || sunsetStartsLastPeriod ? this._activeSlot : this._activeSlot + 1;
      const existingBoundary = day.slots[targetIndex];
      const boundary: ScheduleSlot = {
        ...(existingBoundary || activeSlot),
        Time: this.getSunTime(this._activeDay, specialTime),
        SpecialTime: specialTime,
      };
      const withBoundary = existingBoundary
        ? day.slots.map((slot, index) => (index === targetIndex ? boundary : slot))
        : [...day.slots, boundary];
      day.slots = withBoundary.filter((slot) => slot === boundary || slot.SpecialTime !== specialTime);

      //Resort slots
      this.schedule!.ScheduleData[dayIndex] = this.convertScheduleDay(day);

      // Keep the same period selected: Sunrise changes its start, while Sunset
      // changes the following boundary that ends it.
      const sortedSlots = this.schedule!.ScheduleData[dayIndex].slots;
      const activeIndex = sortedSlots.findIndex((slot) =>
        specialTime === 'Sunrise' || sunsetStartsLastPeriod
          ? slot.SpecialTime === specialTime
          : slot.Time === selectedStart.Time &&
            slot.Setpoint === selectedStart.Setpoint &&
            slot.SpecialTime === selectedStart.SpecialTime,
      );
      this._activeSlot = activeIndex >= 0 ? activeIndex : Math.min(this._activeSlot, sortedSlots.length - 1);
      this.dispatchEvent(new CustomEvent('scheduleChanged', { detail: { schedule: this.schedule } }));
      this.requestUpdate();
    }
  }

  private _addSlot() {
    if (this._activeSlot < -1) return;

    const activeDayIndex = days.indexOf(this._activeDay);
    if (this._activeSlot < 0) {
      this.schedule!.ScheduleData[activeDayIndex].slots = [
        {
          Time: timeToStringShort(stringToTime('06:00')),
          Setpoint: DefaultSetpoint[this.schedule_type!],
          SpecialTime: '',
        },
      ];
      this._activeSlot = 0;
    } else {
      const activeSlot = this.schedule!.ScheduleData[activeDayIndex].slots[this._activeSlot];
      let startTime = stringToTime(activeSlot.Time);
      let endTime = stringToTime(get_end_time(this.schedule!.ScheduleData[activeDayIndex], this._activeSlot));
      if (endTime < startTime) endTime += SEC_PER_DAY;
      const newStop = roundTime(startTime + (endTime - startTime) / 2, this.stepSize);

      if (!activeSlot.SpecialTime) {
        this.schedule!.ScheduleData[activeDayIndex].slots = [
          ...this.schedule!.ScheduleData[activeDayIndex].slots.slice(0, this._activeSlot),
          {
            Time: timeToStringShort(startTime),
            Setpoint: activeSlot.Setpoint,
            SpecialTime: '',
          },
          {
            ...this.schedule!.ScheduleData[activeDayIndex].slots[this._activeSlot!],
            Time: timeToStringShort(newStop),
          },
          ...this.schedule!.ScheduleData[activeDayIndex].slots.slice(this._activeSlot + 1),
        ];
        this._activeSlot++;
      } else {
        startTime = roundTime(startTime - stringToTime('01:00'), this.stepSize);
        this.schedule!.ScheduleData[activeDayIndex].slots = [
          ...this.schedule!.ScheduleData[activeDayIndex].slots.slice(0, this._activeSlot),
          {
            Time: timeToStringShort(startTime),
            Setpoint: activeSlot.Setpoint,
            SpecialTime: '',
          },
          ...this.schedule!.ScheduleData[activeDayIndex].slots.slice(this._activeSlot),
        ];
      }
    }

    const myEvent = new CustomEvent('scheduleChanged', {
      detail: { schedule: this.schedule },
    });
    this.dispatchEvent(myEvent);
    this.requestUpdate();
  }

  private _removeSlot() {
    if (this._activeSlot < 0) return;
    const activeDayIndex = days.indexOf(this._activeDay);
    const cutIndex = this._activeSlot!;
    if (cutIndex == 0) {
      this.schedule!.ScheduleData[activeDayIndex].slots = [
        ...this.schedule!.ScheduleData[activeDayIndex].slots.slice(cutIndex + 1),
      ];
    } else {
      this.schedule!.ScheduleData[activeDayIndex].slots = [
        ...this.schedule!.ScheduleData[activeDayIndex].slots!.slice(0, cutIndex),
        ...this.schedule!.ScheduleData[activeDayIndex].slots.slice(cutIndex + 1),
      ];
    }
    if (this._activeSlot == this.schedule!.ScheduleData[activeDayIndex].slots.length) this._activeSlot!--;
    const myEvent = new CustomEvent('scheduleChanged', {
      detail: { schedule: this.schedule },
    });
    this.dispatchEvent(myEvent);
    this.requestUpdate();
  }

  private _handlePointerStart(ev: PointerEvent) {
    if (ev.button !== 0) return;
    ev.preventDefault();
    ev.stopPropagation();
    const activeDayIndex = days.indexOf(this._activeDay);
    let slots = this.schedule!.ScheduleData.filter((rday) => rday.day == this._activeDay)[0].slots;
    const marker = ev.currentTarget as HTMLElement;
    let m = marker;
    while (!m.classList.contains('outer')) m = m.parentElement as HTMLElement;

    const fullWidth = parseFloat(getComputedStyle(m).getPropertyValue('width'));
    const width = (SEC_PER_DAY / (this.rangeMax - this.rangeMin)) * fullWidth;
    const left = (-this.rangeMin / (this.rangeMax - this.rangeMin)) * fullWidth;
    const Toffset = (-left / width) * SEC_PER_DAY;

    let el = marker;
    while (!el.classList.contains('slot')) el = el.parentElement as HTMLElement;

    const rightSlot = el;
    const i = Number(marker.dataset.boundary);
    if (!Number.isInteger(i) || i < 0 || i >= slots.length) return;

    const Tmin = i > 0 ? stringToTime(slots![i - 1].Time) + 60 * this.stepSize : 0;

    const Tmax =
      i < slots!.length - 1
        ? (stringToTime(get_end_time(this.schedule!.ScheduleData[activeDayIndex], i)!) || SEC_PER_DAY) -
          60 * this.stepSize
        : SEC_PER_DAY - this.stepSize * 60;

    this.isDragging = true;

    const trackElement = (rightSlot.parentElement as HTMLElement).parentElement as HTMLElement;
    const trackCoords = trackElement.getBoundingClientRect();

    const pointerId = ev.pointerId;
    marker.setPointerCapture?.(pointerId);

    let pointerMoveHandler = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return;
      moveEvent.preventDefault();
      let x = moveEvent.clientX - trackCoords.left;
      if (x > fullWidth - 1) x = fullWidth - 1;
      if (x < -18) x = -18;
      let time = Math.round((x / width) * SEC_PER_DAY + Toffset);

      if (time < Tmin) time = Tmin;
      if (time > Tmax) time = Tmax;

      this.currentTime = time;

      time = Math.round(time) >= SEC_PER_DAY ? SEC_PER_DAY : roundTime(time, this.stepSize);
      const timeString = timeToStringShort(time);

      if (timeString == get_end_time(this.schedule!.ScheduleData[activeDayIndex], i)) return;

      slots = Object.assign(slots, {
        [i]: {
          ...slots![i],
          Time: timeString,
          SpecialTime: '',
        },
      });
      this.requestUpdate();
    };

    const pointerUpHandler = (upEvent?: PointerEvent) => {
      if (upEvent && upEvent.pointerId !== pointerId) return;
      window.removeEventListener('pointermove', pointerMoveHandler);
      window.removeEventListener('pointerup', pointerUpHandler);
      window.removeEventListener('pointercancel', pointerUpHandler);
      window.removeEventListener('blur', blurHandler);
      if (marker.hasPointerCapture?.(pointerId)) marker.releasePointerCapture(pointerId);
      pointerMoveHandler = () => {
        /**/
      };
      setTimeout(() => {
        this.isDragging = false;
      }, 100);
      marker.blur();
      const myEvent = new CustomEvent('scheduleChanged', {
        detail: { schedule: this.schedule },
      });
      this.dispatchEvent(myEvent);
    };

    const blurHandler = () => pointerUpHandler();
    window.addEventListener('pointerup', pointerUpHandler);
    window.addEventListener('pointercancel', pointerUpHandler);
    window.addEventListener('blur', blurHandler);
    window.addEventListener('pointermove', pointerMoveHandler, { passive: false });
  }

  private _handleSlotPointerStart(ev: PointerEvent, day: ScheduleDay, index: number): void {
    if (ev.button !== 0 || index >= day.slots.length - 1) return;
    ev.preventDefault();

    const slotElement = ev.currentTarget as HTMLElement;
    const trackElement = slotElement.parentElement?.parentElement as HTMLElement | undefined;
    if (!trackElement) return;

    const trackWidth = trackElement.getBoundingClientRect().width;
    const slots = this.schedule!.ScheduleData[days.indexOf(day.day)].slots;
    const originalStart = stringToTime(slots[index].Time);
    const originalEnd = stringToTime(slots[index + 1].Time);
    const previousStart = index > 0 ? stringToTime(slots[index - 1].Time) : -this.stepSize * 60;
    const followingEnd = index + 2 < slots.length ? stringToTime(slots[index + 2].Time) : SEC_PER_DAY;
    const minimumStart = Math.max(0, previousStart + this.stepSize * 60);
    const maximumEnd = followingEnd - this.stepSize * 60;
    const minimumDelta = minimumStart - originalStart;
    const maximumDelta = maximumEnd - originalEnd;
    const pointerId = ev.pointerId;
    const startX = ev.clientX;
    const startY = ev.clientY;
    const sourceRect = slotElement.getBoundingClientRect();
    const hostRect = this.getBoundingClientRect();
    const pointerOffsetX = startX - sourceRect.left;
    const pointerOffsetY = startY - sourceRect.top;
    const sourceStyle = getComputedStyle(slotElement);
    const sourceLabel = slotElement.querySelector<HTMLElement>('.setpoint');
    const ghostAppearance = {
      width: sourceRect.width,
      height: sourceRect.height,
      background: sourceStyle.backgroundColor,
      colour: sourceLabel ? getComputedStyle(sourceLabel).color : sourceStyle.color,
      label: sourceLabel?.textContent?.trim() || '',
    };
    let moved = false;
    let copying = false;

    this.isDragging = true;
    slotElement.setPointerCapture?.(pointerId);

    let pointerMoveHandler = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return;
      moveEvent.preventDefault();
      const hit = this.shadowRoot?.elementFromPoint(moveEvent.clientX, moveEvent.clientY) as HTMLElement | null;
      const targetDay = hit?.closest<HTMLElement>('.outer')?.id || '';
      const nextDropDay = targetDay && targetDay !== day.day && days.includes(targetDay) ? targetDay : '';
      if (nextDropDay) {
        const targetTrack = this.shadowRoot?.querySelector<HTMLElement>(`.outer#${CSS.escape(nextDropDay)}`);
        const targetRect = targetTrack?.getBoundingClientRect();
        copying = true;
        slots[index] = { ...slots[index], Time: timeToStringShort(originalStart) };
        slots[index + 1] = { ...slots[index + 1], Time: timeToStringShort(originalEnd) };
        this._dropDay = nextDropDay;
        this._dragGhost = {
          ...ghostAppearance,
          left: moveEvent.clientX - pointerOffsetX - hostRect.left,
          // Once a destination day is under the pointer, align the preview with
          // that row. Keeping the source grab offset here can make the preview
          // appear above or below the row even though that row will receive it.
          top: (targetRect?.top ?? moveEvent.clientY - pointerOffsetY) - hostRect.top,
          height: targetRect?.height ?? ghostAppearance.height,
          valid: true,
        };
        moved = true;
        this.requestUpdate();
        return;
      }
      if (copying && targetDay !== day.day) {
        this._dropDay = '';
        this._dragGhost = {
          ...ghostAppearance,
          left: moveEvent.clientX - pointerOffsetX - hostRect.left,
          top: moveEvent.clientY - pointerOffsetY - hostRect.top,
          valid: false,
        };
        this.requestUpdate();
        return;
      }
      copying = false;
      this._dragGhost = undefined;
      if (this._dropDay) {
        this._dropDay = '';
        this.requestUpdate();
      }
      const rawDelta = ((moveEvent.clientX - startX) / trackWidth) * SEC_PER_DAY;
      const roundedDelta = roundTime(rawDelta, this.stepSize, { wrapAround: false, maxHours: 24 });
      const delta = Math.min(maximumDelta, Math.max(minimumDelta, roundedDelta));
      if (delta === 0 && !moved) return;

      slots[index] = {
        ...slots[index],
        Time: timeToStringShort(originalStart + delta),
        SpecialTime: '',
      };
      slots[index + 1] = {
        ...slots[index + 1],
        Time: timeToStringShort(originalEnd + delta),
        SpecialTime: '',
      };
      moved = true;
      this.requestUpdate();
    };

    const pointerUpHandler = (upEvent?: PointerEvent) => {
      if (upEvent && upEvent.pointerId !== pointerId) return;
      window.removeEventListener('pointermove', pointerMoveHandler);
      window.removeEventListener('pointerup', pointerUpHandler);
      window.removeEventListener('pointercancel', pointerUpHandler);
      window.removeEventListener('blur', blurHandler);
      if (slotElement.hasPointerCapture?.(pointerId)) slotElement.releasePointerCapture(pointerId);
      const dropDay = this._dropDay;
      this._dropDay = '';
      this._dragGhost = undefined;
      pointerMoveHandler = () => {
        /**/
      };
      setTimeout(() => {
        this.isDragging = false;
      }, 100);
      if (dropDay) {
        slots[index] = { ...slots[index], Time: timeToStringShort(originalStart) };
        slots[index + 1] = { ...slots[index + 1], Time: timeToStringShort(originalEnd) };
        this._copyPeriodToDay(day.day, index, dropDay, originalStart, originalEnd);
      } else if (moved) {
        this.dispatchEvent(new CustomEvent('scheduleChanged', { detail: { schedule: this.schedule } }));
      }
    };

    const blurHandler = () => pointerUpHandler();
    window.addEventListener('pointerup', pointerUpHandler);
    window.addEventListener('pointercancel', pointerUpHandler);
    window.addEventListener('blur', blurHandler);
    window.addEventListener('pointermove', pointerMoveHandler, { passive: false });
  }

  private _copyPeriodToDay(
    sourceDay: string,
    sourceIndex: number,
    targetDayName: string,
    startTime: number,
    endTime: number,
  ): void {
    const source = this.schedule!.ScheduleData[days.indexOf(sourceDay)].slots[sourceIndex];
    const targetDay = this.schedule!.ScheduleData[days.indexOf(targetDayName)];
    const originalTargetSlots = [...targetDay.slots].sort(
      (left, right) => stringToTime(left.Time) - stringToTime(right.Time),
    );
    let restoreSetpoint = get_setpoint(targetDay, -1, this.schedule!);
    for (const targetSlot of originalTargetSlots) {
      if (stringToTime(targetSlot.Time) <= endTime) restoreSetpoint = targetSlot.Setpoint;
      else break;
    }

    const copiedSlots = originalTargetSlots.filter((targetSlot) => {
      const time = stringToTime(targetSlot.Time);
      return time < startTime || time >= endTime;
    });
    copiedSlots.push({ Time: timeToStringShort(startTime), Setpoint: source.Setpoint, SpecialTime: '' });

    if (endTime < SEC_PER_DAY && !copiedSlots.some((targetSlot) => stringToTime(targetSlot.Time) === endTime)) {
      copiedSlots.push({ Time: timeToStringShort(endTime), Setpoint: restoreSetpoint, SpecialTime: '' });
    }

    targetDay.slots = copiedSlots.sort((left, right) => stringToTime(left.Time) - stringToTime(right.Time));
    this.dispatchEvent(new CustomEvent('scheduleChanged', { detail: { schedule: this.schedule } }));
    this.requestUpdate();
  }

  computeDayLabel(day: string): TemplateResult {
    return html`
      <div class="day  ${this._show_short_days ? 'short' : ''}">
        ${
          this._show_short_days
            ? this.localize('wiser.days.short.' + day.toLowerCase())
            : this.localize('wiser.days.' + day.toLowerCase())
        }
      </div>
    `;
  }

  computeSetpointLabel(setPoint) {
    if (setPoint == 'Unknown') return setPoint;
    if (this.schedule_type == 'Heating' && setPoint == -20) {
      return 'Off';
    }
    return setPoint + SetpointUnits[this.schedule_type!];
  }

  static get styles(): CSSResultGroup {
    return css`
      ${nativeControlStyle}
      :host {
        display: block;
        position: relative;
        max-width: 100%;
      }
      div.outer {
        width: 100%;
        overflow: visible;
      }
      div.outer.drop-target {
        border-radius: 7px;
        outline: 3px solid var(--primary-color);
        outline-offset: 2px;
        background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      }
      .period-drag-ghost {
        position: absolute;
        z-index: 1000;
        box-sizing: border-box;
        display: grid;
        place-items: center;
        overflow: hidden;
        border: 2px dashed var(--disabled-text-color);
        border-radius: 5px;
        opacity: 0.62;
        box-shadow: var(--ha-card-box-shadow, 0 4px 12px rgba(0, 0, 0, 0.3));
        font-size: calc(12px + 1pt);
        font-weight: 700;
        line-height: 1;
        pointer-events: none;
        user-select: none;
      }
      .period-drag-ghost.valid {
        border-color: var(--primary-color);
        opacity: 0.82;
      }
      div.wrapper,
      div.time-wrapper {
        white-space: nowrap;
        transition:
          width 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67),
          margin 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        display: flex;
      }
      div.sub-section {
        display: flex;
        justify-content: center;
        width: 100%;
      }
      .schedule-editor-area {
        box-sizing: border-box;
        width: calc(100% - min(20%, 100px));
        margin-inline-start: min(20%, 100px);
      }
      .schedule-editor-area.short {
        width: calc(100% - min(20%, 50px));
        margin-inline-start: min(20%, 50px);
      }
      .add-period-row {
        display: flex;
        justify-content: center;
        margin: 14px 0 8px;
      }
      .selected-period {
        box-sizing: border-box;
        width: min(100% - 24px, 660px);
        margin: 0 auto 14px;
        padding: 18px 22px 16px;
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        background: var(--ha-card-background, var(--card-background-color));
        box-shadow: var(--ha-card-box-shadow, none);
      }
      .selected-period-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--divider-color);
      }
      .selected-period-header h3 {
        margin: 0 0 3px;
        color: var(--primary-text-color);
        font-size: var(--ha-font-size-l, 18px);
        line-height: 1.3;
      }
      .selected-period-header span {
        color: var(--secondary-text-color);
        font-size: var(--ha-font-size-s, 14px);
      }
      .selected-period-controls {
        padding-top: 4px;
      }
      .editor-control-row {
        display: grid;
        grid-template-columns: minmax(88px, 110px) minmax(0, 1fr);
        align-items: start;
        gap: 12px;
        width: 100%;
        padding-top: 10px;
      }
      .editor-control-row > .section-header {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-height: 44px;
        box-sizing: border-box;
        padding-inline: 0;
        text-align: end;
      }
      .heating-control-row > .section-header {
        transform: translateY(3px);
      }
      .level-control-row > .section-header {
        transform: translateY(-4px);
      }
      .control-content {
        min-width: 0;
      }
      .special-times,
      .state-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        min-height: 44px;
      }
      .special-times {
        overflow: hidden;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--secondary-background-color, var(--card-background-color));
      }
      .special-times ha-button {
        flex: 1 1 0;
        min-height: 46px;
        border: 0;
        border-radius: 0;
        color: var(--primary-text-color);
        background: transparent;
        --mdc-theme-primary: var(--primary-text-color);
        --ha-button-height: 46px;
      }
      .special-times ha-button:first-child {
        border-radius: 11px 0 0 11px;
      }
      .special-times ha-button + ha-button {
        border-left: 1px solid var(--divider-color);
      }
      .special-times ha-button.selected {
        color: var(--text-primary-color, #fff);
        background: var(--primary-color);
        --mdc-theme-primary: var(--text-primary-color, #fff);
        --ha-button-filled-container-color: var(--primary-color);
        --ha-button-filled-label-text-color: var(--text-primary-color, #fff);
      }
      .special-times ha-button::part(base) {
        min-height: 46px;
        border: 0;
        border-radius: 0;
        color: var(--primary-text-color);
        background: transparent;
      }
      .special-times ha-button.selected::part(base) {
        color: var(--text-primary-color, #fff);
        background: var(--primary-color);
      }
      .state-controls {
        gap: 20px;
      }
      .state-choice {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        cursor: pointer;
      }
      .state-choice:has(input:disabled) {
        opacity: 0.38;
        cursor: default;
      }
      .temperature-input {
        display: flex;
        align-items: center;
        width: 100%;
      }
      .temperature-input wiser-variable-slider,
      .level-control wiser-variable-slider {
        display: block;
        min-width: 0;
      }
      .section-header {
        color: var(--primary-text-color);
        text-transform: uppercase;
        font-weight: 500;
        font-size: calc(var(--material-small-font-size, 12px) + 1pt);
        padding: 5px 10px;
      }
      .delete-period-row {
        display: flex;
        justify-content: flex-end;
        padding-top: 12px;
      }
      .delete-period-row ha-button {
        --mdc-theme-primary: var(--error-color);
      }
      .copy-section {
        box-sizing: border-box;
        width: min(100% - 24px, 1040px);
        margin: 0 auto;
        padding-top: 2px;
      }
      .copy-section > div > .section-header {
        padding-inline: 0;
      }
      .copy-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .copy-options ha-button {
        border: 1px solid var(--primary-color);
        border-radius: 10px;
      }
      @media (max-width: 600px) {
        .schedule-editor-area,
        .schedule-editor-area.short {
          width: 100%;
          margin-inline-start: 0;
        }
        .selected-period {
          width: 100%;
          padding: 14px 12px;
        }
        .editor-control-row {
          grid-template-columns: minmax(0, 1fr);
          gap: 4px;
        }
        .editor-control-row > .section-header {
          justify-content: flex-start;
          min-height: 28px;
          text-align: start;
        }
        .special-times {
          width: 100%;
          flex-wrap: nowrap;
          gap: 0;
        }
        .special-times ha-button,
        .special-times ha-button:first-child,
        .special-times ha-button:last-child {
          flex: 1 1 0;
          border: 0;
        }
        .special-times ha-button + ha-button {
          border-top: 0;
          border-left: 1px solid var(--divider-color);
        }
        .heating-control-row > .section-header,
        .level-control-row > .section-header {
          display: none;
        }
        .state-control-row {
          grid-template-columns: minmax(72px, 88px) minmax(0, 1fr);
          gap: 8px;
        }
        .state-control-row > .section-header {
          justify-content: flex-end;
          min-height: 44px;
          text-align: end;
        }
      }
      .slot {
        float: left;
        background: rgba(var(--rgb-primary-color), 0.7);
        height: 60px;
        box-sizing: border-box;
        transition: background 0.1s cubic-bezier(0.17, 0.67, 0.83, 0.67);
        position: relative;
        height: 40px;
        line-height: 40px;
        font-size: calc(10px + 1pt);
        text-align: center;
      }
      .slot:first-child {
        border-radius: 5px 0 0 5px;
      }
      .slot:last-child {
        border-radius: 0 5px 5px 0;
      }
      .slot:only-child {
        border-radius: 5px;
      }
      .slot.previous {
        cursor: default;
      }
      .slot.selected {
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
      }
      .slot.selected.movable,
      .slot.selected.movable .slotoverlay {
        cursor: grab;
        touch-action: none;
        user-select: none;
      }
      .slot.selected.movable:active,
      .slot.selected.movable:active .slotoverlay {
        cursor: grabbing;
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
      }
      div.slot.selectable {
        cursor: pointer;
      }

      .previous {
        display: block;
        background: repeating-linear-gradient(
          135deg,
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 0) 7px,
          rgba(255, 255, 255, 0.12) 7px,
          rgba(255, 255, 255, 0.12) 12px
        );
        border-radius: 5px 0 0 5px;
      }
      .previous.selected {
        border: 2px solid var(--primary-color);
      }
      .previous.selected.theme-colors {
        border: 2px solid var(--warning-color);
      }
      .wrapper.selectable .slot:hover {
        background: rgba(var(--rgb-primary-color), 0.85);
      }
      .wrapper.selectable .slot.inactive-level:hover {
        background: var(--secondary-background-color, #eeeeee);
      }
      .slot:not(:first-child) {
        border-left: 1px solid var(--card-background-color);
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
      .wrapper .day.short {
        max-width: 50px;
      }
      .wrapper .day {
        line-height: 42px;
        float: left;
        width: 20%;
        max-width: 100px;
      }
      .wrapper .schedule {
        position: relative;
        width: 100%;
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
        font-size: calc(12px + 1pt);
        color: var(--slot-label-color, var(--text-primary-color));
        font-weight: 700;
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
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 36px;
        transform: translateX(-50%);
        display: grid;
        place-items: center;
        z-index: 5;
        cursor: ew-resize;
        touch-action: none;
        user-select: none;
      }
      div.handle.end-handle {
        left: 100%;
      }
      div.tooltip-container.end-time {
        left: 100%;
      }
      div.button-holder {
        line-height: 0;
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
      }
      ha-icon-button.time-handle {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
        --ha-button-height: 32px;
        --wa-form-control-height: 32px;
        --ha-icon-button-padding-inline: 0px;
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 24px;
        --ha-icon-button-size: 32px;
        width: 32px;
        height: 32px;
        margin: 0;
        padding: 0;
        color: var(--primary-color);
        cursor: ew-resize;
        touch-action: none;
        pointer-events: none;
      }
      .slot .special-time-marker {
        position: absolute;
        z-index: 4;
        top: 0;
        bottom: 0;
        left: -1px;
        width: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateX(-50%);
        line-height: 0;
        --primary-color: var(--primary-text-color);
        color: var(--primary-text-color);
        filter: drop-shadow(0 0 1px var(--card-background-color));
        pointer-events: none;
      }
      .slot .special-time-marker ha-icon {
        display: block;
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        color: var(--primary-text-color) !important;
      }
      div.tooltip-container {
        position: absolute;
        margin-top: 0;
        margin-left: -40px;
        width: 80px;
        height: 0px;
        text-align: center;
        line-height: 35px;
        z-index: 3;
        top: -48px;
      }

      div.tooltip-container.visible {
        display: block;
      }
      div.tooltip-container.left {
        margin-left: -80px;
        text-align: right;
      }
      div.tooltip-container.right {
        margin-left: 0px;
        text-align: left;
      }
      div.tooltip {
        display: inline-flex;
        margin: 0px auto;
        border-radius: 5px;
        color: var(--text-primary-color);
        font-size: calc(18px + 1pt);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        padding: 4px 10px;
        text-align: center;
        line-height: 28px;
        z-index: 5;
        transition: all 0.1s ease-in;
        transform-origin: center bottom;
        --tooltip-color: var(--primary-color);
        background: var(--primary-color);
      }
      div.tooltip.active {
        --tooltip-color: rgba(var(--rgb-accent-color), 0.7);
      }
      div.tooltip-container.left div.tooltip {
        transform-origin: right bottom;
      }
      div.tooltip-container.right div.tooltip {
        transform-origin: left bottom;
      }
      div.tooltip-container.center div.tooltip:before {
        content: ' ';
        width: 0px;
        height: 0px;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 10px solid var(--primary-color);
        position: absolute;
        margin-top: 36px;
        margin-left: calc(50% - 6px);
        top: 0px;
        left: 0px;
      }
      div.tooltip-container.left div.tooltip:before {
        content: ' ';
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 8px solid var(--tooltip-color);
        opacity: 1;
        position: absolute;
        margin-top: 15px;
        margin-left: calc(100% - 8px);
        left: 0px;
        top: 0px;
        width: 0px;
        height: 0px;
      }
      div.tooltip-container.right div.tooltip:before {
        content: ' ';
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 8px solid var(--tooltip-color);
        opacity: 1;
        position: absolute;
        margin-top: 15px;
        margin-left: 0px;
        left: 0px;
        top: 0px;
        width: 0px;
        height: 0px;
      }
      div.tooltip ha-icon {
        --mdc-icon-size: 18px;
      }

      mwc-button.state-button {
        padding: 0px 10px;
        margin: 0 2px;
        max-width: 100px;
      }

      mwc-button.warning {
        --mdc-theme-primary: var(--error-color);
      }
      mwc-button.warning .mdc-button .mdc-button__label {
        color: var(--primary-text-color);
      }
      mwc-button.right {
        float: right;
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

      mwc-button ha-icon {
        margin-right: 2px;
      }
      mwc-button.active {
        background: var(--primary-color);
        --mdc-theme-primary: var(--text-primary-color);
        border-radius: 4px;
      }
      ha-icon-button.set-off-button {
        margin-left: 0px;
      }
      .sub-heading {
        padding: 0px 10px 0px 10px;
        font-weight: 500;
      }
      .section-header[aria-disabled='true'] {
        color: var(--disabled-text-color);
      }
    `;
  }
}
