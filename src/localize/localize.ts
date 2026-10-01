import type { HomeAssistant } from 'custom-card-helpers';
import * as en from './languages/en.json';
import * as fr from './languages/fr.json';
import * as de from './languages/de.json';
import * as enGB from './languages/en-GB.json';

const languages: Record<string, unknown> = { en, fr, de, 'en-gb': enGB };
const nativeKeys: Record<string, string> = {
  'wiser.labels.state': 'ui.dialogs.more_info_control.state',
  'wiser.labels.sunrise': 'ui.panel.config.automation.editor.triggers.type.sun.sunrise',
  'wiser.labels.sunset': 'ui.panel.config.automation.editor.triggers.type.sun.sunset',
  'wiser.labels.on': 'component.switch.entity_component._.state.on',
  'wiser.labels.off': 'component.switch.entity_component._.state.off',
  'wiser.labels.open': 'component.cover.entity_component._.state.open',
  'wiser.labels.closed': 'component.cover.entity_component._.state.closed',
  'wiser.labels.name': 'ui.common.name',
  'wiser.labels.start': 'ui.dialogs.helper_settings.schedule.start',
  'wiser.labels.end': 'ui.dialogs.helper_settings.schedule.end',
  'wiser.labels.temperature': 'ui.dialogs.more_info_control.climate.temperature',
  'wiser.editor.appearance': 'ui.panel.profile.user_preferences_header',
  'wiser.moments.unavailable': 'state.default.unavailable',
  'wiser.heating.off': 'component.climate.entity_component._.state.off',
  'wiser.heating.heating': 'component.climate.entity_component._.state_attributes.hvac_action.state.heating',
  'wiser.heating.idle': 'component.climate.entity_component._.state_attributes.hvac_action.state.idle',
  'wiser.days.monday': 'ui.weekdays.monday',
  'wiser.days.short.monday': 'ui.components.calendar.event.repeat.weekly.weekday.mo',
  'wiser.days.tuesday': 'ui.weekdays.tuesday',
  'wiser.days.short.tuesday': 'ui.components.calendar.event.repeat.weekly.weekday.tu',
  'wiser.days.wednesday': 'ui.weekdays.wednesday',
  'wiser.days.short.wednesday': 'ui.components.calendar.event.repeat.weekly.weekday.we',
  'wiser.days.thursday': 'ui.weekdays.thursday',
  'wiser.days.short.thursday': 'ui.components.calendar.event.repeat.weekly.weekday.th',
  'wiser.days.friday': 'ui.weekdays.friday',
  'wiser.days.short.friday': 'ui.components.calendar.event.repeat.weekly.weekday.fr',
  'wiser.days.saturday': 'ui.weekdays.saturday',
  'wiser.days.short.saturday': 'ui.components.calendar.event.repeat.weekly.weekday.sa',
  'wiser.days.sunday': 'ui.weekdays.sunday',
  'wiser.days.short.sunday': 'ui.components.calendar.event.repeat.weekly.weekday.su',
  'wiser.heating.auto': 'ui.common.auto',
  'wiser.heating.unknown': 'state.default.unknown',
  'wiser.heating.mode': 'ui.card.climate.mode',
  'wiser.home.overview': 'panel.states',
  'wiser.home.show': 'ui.common.show',
  'wiser.home.hide': 'ui.common.hide',
  'wiser.actions.rename': 'ui.common.rename',
  'wiser.actions.copy': 'ui.common.copy',
  'wiser.actions.add': 'ui.common.add',
  'wiser.panel.cancel': 'ui.common.cancel',
  'wiser.panel.save': 'ui.common.save',
  'wiser.panel.retry': 'ui.common.retry',
  'wiser.rooms.back': 'ui.common.back',
  'wiser.rooms.edit': 'ui.common.edit',
  'wiser.rooms.delete': 'ui.common.delete',
  'wiser.rooms.cancel_edit': 'ui.common.cancel',
  'wiser.rooms.save_edit': 'ui.common.save',
};

function lookup(language: string, key: string): string | undefined {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
      languages[language],
    );
  return typeof value === 'string' ? value : undefined;
}

export function localize(key: string, search = '', replace = '', language?: string): string {
  const selected = (language || localStorage.getItem('selectedLanguage') || 'en')
    .replace(/['"]+/g, '')
    .toLowerCase()
    .replace(/_/g, '-');
  const text = lookup(selected, key) || lookup(selected.split('-')[0], key) || lookup('en', key) || key;
  return search && replace ? text.replace(search, replace) : text;
}

/** Use HA translations for native labels; card translations only cover Wiser concepts. */
export function localizeForHass(hass: HomeAssistant | undefined, key: string, search = '', replace = ''): string {
  const nativeKey = nativeKeys[key];
  if (nativeKey) {
    const translated = hass?.localize(nativeKey) || '';
    return search && replace ? translated.replace(search, replace) : translated;
  }
  return localize(key, search, replace, hass?.locale?.language || hass?.language);
}
