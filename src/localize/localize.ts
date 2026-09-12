import type { HomeAssistant } from 'custom-card-helpers';
import * as en from './languages/en.json';
import * as fr from './languages/fr.json';

const languages: Record<string, unknown> = { en, fr };
const nativeKeys: Record<string, string> = {
  'wiser.heating.auto': 'ui.common.auto',
  'wiser.heating.unknown': 'state.default.unknown',
  'wiser.heating.mode': 'ui.card.climate.mode',
  'wiser.home.overview': 'panel.states',
  'wiser.home.show': 'ui.common.show',
  'wiser.home.hide': 'ui.common.hide',
  'wiser.actions.rename': 'ui.common.rename',
  'wiser.actions.copy': 'ui.common.copy',
  'wiser.actions.add': 'ui.common.add',
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
    .split(/[-_]/)[0];
  const text = lookup(selected, key) || lookup('en', key) || key;
  return search && replace ? text.replace(search, replace) : text;
}

/** Prefer HA's shared translations, with card translations for missing keys and Wiser concepts. */
export function localizeForHass(hass: HomeAssistant | undefined, key: string, search = '', replace = ''): string {
  const nativeKey = nativeKeys[key];
  const translated = nativeKey ? hass?.localize(nativeKey) : undefined;
  if (translated && translated !== nativeKey)
    return search && replace ? translated.replace(search, replace) : translated;
  return localize(key, search, replace, hass?.locale?.language || hass?.language);
}
