// HA's installation country is an ISO 3166-1 alpha-2 code. Do not infer
// electrical hardware from the user's display language or browser locale.
const countryIcons: Record<string, string> = {
  GB: 'uk',
  IE: 'uk',
  MT: 'uk',
  CY: 'uk',
  SG: 'uk',
  MY: 'uk',
  HK: 'uk',
  US: 'us',
  CA: 'us',
  MX: 'us',
  AU: 'au',
  NZ: 'au',
  CN: 'au',
  AR: 'au',
  JP: 'jp',
  CH: 'ch',
  LI: 'ch',
  IT: 'it',
  FR: 'fr',
  BE: 'fr',
  PL: 'fr',
  CZ: 'fr',
  SK: 'fr',
  DE: 'de',
  AT: 'de',
  NL: 'de',
  ES: 'de',
  PT: 'de',
  SE: 'de',
  NO: 'de',
  FI: 'de',
  IS: 'de',
  GR: 'de',
};

export function plugIcon(country?: string | null): string {
  const variant = countryIcons[country?.trim().toUpperCase() || ''];
  return variant ? `mdi:power-socket-${variant}` : 'mdi:power-plug';
}
