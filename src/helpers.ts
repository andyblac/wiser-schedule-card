import { Schedule, ScheduleColorConfig, ScheduleDay, ScheduleSlot, WiserScheduleCardConfig } from './types';
import { FrontendLocaleData, HomeAssistant, NumberFormat, TimeFormat } from 'custom-card-helpers';

import hexRgb from 'hex-rgb';
import { LitElement } from 'lit';
import { days, DEFAULT_SCHEDULE_COLORS, SEC_PER_HOUR } from './const';

const int = Math.trunc;

export function isDefined<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export function capitalize(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function PrettyPrintName(input: string): string {
  if (typeof input != typeof 'x') input = String(input);
  return capitalize(input.replace(/_/g, ' '));
}

export function isHex(hex: string): boolean {
  hex = String(hex).replace('#', '');
  return hex.length === 6 && !isNaN(Number('0x' + hex));
}

export function hexToRgbString(hex: string): string {
  if (isHex(hex)) {
    const rgb = hexRgb(hex);
    return String(rgb.red + ',' + rgb.green + ',' + rgb.blue + ',' + rgb.alpha);
  }
  return '100,100,100';
}

function interpolateHexColors(lowColor: string, highColor: string, progress: number): string {
  const low = hexRgb(lowColor);
  const high = hexRgb(highColor);
  const position = Math.max(0, Math.min(1, progress));
  const channel = (start: number, end: number) => Math.floor(start + (end - start) * position);
  return `${channel(low.red, high.red)},${channel(low.green, high.green)},${channel(low.blue, high.blue)},1`;
}

export function getCSSVariable(element: HTMLElement, style_name: string): string {
  return getComputedStyle(element).getPropertyValue(style_name).trim();
}

export function getGreyToYellow(percent: number): string {
  if (percent == 0) {
    return '50,50,50';
  }
  const r_max = 255;
  const g_max = 204;
  const min = 50;
  const r = int(min + ((r_max - min) / 100) * percent);
  const g = int(min + ((g_max - min) / 100) * percent);
  return r + ',' + g + ',' + 0;
}

export function color_map(
  element: LitElement,
  schedule_type: string,
  setPoint: string,
  nativeHotWaterTimer = false,
  colors: ScheduleColorConfig = {},
): string {
  if (setPoint == 'Unknown') return '100,100,100';
  const type = schedule_type.toLowerCase();
  if (type === 'onoff' && nativeHotWaterTimer) {
    if (setPoint.trim().toLowerCase() === 'on') {
      return isHex(colors.hot_water_on_color || '')
        ? hexToRgbString(colors.hot_water_on_color!)
        : hexToRgbString(getCSSVariable(element, '--red-color'));
    }
    return isHex(colors.hot_water_off_color || '') ? hexToRgbString(colors.hot_water_off_color!) : '138,138,138,1';
  } else if (type === 'onoff') {
    if (setPoint.trim().toLowerCase() === 'on') {
      return isHex(colors.on_color || '')
        ? hexToRgbString(colors.on_color!)
        : hexToRgbString(getCSSVariable(element, '--green-color'));
    }
    return isHex(colors.off_color || '')
      ? hexToRgbString(colors.off_color!)
      : hexToRgbString(getCSSVariable(element, '--red-color'));
  } else if (['lighting', 'shutters'].includes(type)) {
    const lowColor = type === 'lighting' ? colors.lighting_off_color : colors.shutter_closed_color;
    const highColor = type === 'lighting' ? colors.lighting_on_color : colors.shutter_open_color;
    if (!isHex(lowColor || '') && !isHex(highColor || '')) return getGreyToYellow(parseInt(setPoint)) + ',1';
    const defaultLow =
      type === 'lighting' ? DEFAULT_SCHEDULE_COLORS.lighting_off : DEFAULT_SCHEDULE_COLORS.shutter_closed;
    const defaultHigh =
      type === 'lighting' ? DEFAULT_SCHEDULE_COLORS.lighting_on : DEFAULT_SCHEDULE_COLORS.shutter_open;
    return interpolateHexColors(
      isHex(lowColor || '') ? lowColor! : defaultLow,
      isHex(highColor || '') ? highColor! : defaultHigh,
      parseInt(setPoint) / 100,
    );
  } else {
    if (parseFloat(setPoint) == -20) {
      return '138, 138, 138';
    }
    // Hot water uses the same warm palette as heating, but across an
    // appropriate absolute range so 35°C does not appear fully hot.
    const maxc = type === 'hotwater' ? 65 : 45;
    const minc = type === 'hotwater' ? 20 : -10;
    return interpolateHexColors(
      isHex(colors.low_color || '') ? colors.low_color! : DEFAULT_SCHEDULE_COLORS.low,
      isHex(colors.high_color || '') ? colors.high_color! : DEFAULT_SCHEDULE_COLORS.high,
      (parseFloat(setPoint) - minc) / (maxc - minc),
    );
  }
}

export function allow_edit(hass: HomeAssistant, config: WiserScheduleCardConfig): boolean {
  if (config.display_only) return false;
  if ((config.admin_only && hass.user.is_admin) || !config.admin_only) return true;
  return false;
}

export function get_start_time(day: ScheduleDay, index: number): string {
  if (day.slots.length == 0) {
    return '00:00';
  }
  return day.slots[index].Time;
}

export function get_end_time(day: ScheduleDay, index: number): string {
  if (day.slots.length == 0 || day.slots.length - 1 == index) {
    return '23:59';
  }
  return day.slots[index + 1].Time;
}

export function find_previous_slot(day: ScheduleDay, schedule: Schedule): ScheduleSlot | undefined {
  const day_order = [...days.slice(days.indexOf(day.day)), ...days.slice(0, days.indexOf(day.day))].reverse();
  let search_day: string;
  for (search_day of day_order) {
    const d = schedule.ScheduleData.filter((rday) => rday.day == search_day)[0];
    if (d && d.slots.length > 0) {
      return d.slots[d.slots.length - 1];
    }
  }
  return undefined;
}

export function find_previous_setpoint(day: ScheduleDay, schedule: Schedule): string {
  const slot = find_previous_slot(day, schedule);
  if (slot) return slot.Setpoint;
  return 'Unknown';
}

export function get_setpoint(day: ScheduleDay, index: number, schedule: Schedule): string {
  if (index == -1) {
    return find_previous_setpoint(day, schedule);
  }
  return day.slots[index].Setpoint;
}

export function stringTimeToSeconds(t: string): number {
  const [hours, mins] = t.split(':');
  return +hours * SEC_PER_HOUR + +mins * 60;
}

export const getLocale = (hass: HomeAssistant): FrontendLocaleData =>
  hass.locale || {
    language: hass.selectedLanguage,
    number_format: NumberFormat.system,
    time_format: TimeFormat.system,
  };
