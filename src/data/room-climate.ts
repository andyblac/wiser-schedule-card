import type { HomeAssistant } from 'custom-card-helpers';
import { fetchHubs } from './websockets';

interface Entity {
  entity_id: string;
  platform: string;
  device_id?: string;
  disabled_by?: string | null;
  translation_key?: string;
}
interface Device {
  id: string;
  via_device_id?: string;
  identifiers: [string, string][];
}

export interface RoomControlEntities {
  climates: Entity[];
  passiveStrategies: Entity[];
}

/** Scope room control entities to the selected hub, never infer entity IDs from display names. */
export async function fetchRoomControlEntities(hass: HomeAssistant, hub: string): Promise<RoomControlEntities> {
  const [entities, devices, hubs] = await Promise.all([
    hass.callWS<Entity[]>({ type: 'config/entity_registry/list' }),
    hass.callWS<Device[]>({ type: 'config/device_registry/list' }),
    hub ? Promise.resolve([hub]) : fetchHubs(hass),
  ]);
  const hubDevices = new Set(
    devices
      .filter((device) => device.identifiers.some(([domain, id]) => domain === 'wiser' && id === (hub || hubs[0])))
      .map((device) => device.id),
  );
  const roomDevices = new Set(
    devices.filter((device) => device.via_device_id && hubDevices.has(device.via_device_id)).map((device) => device.id),
  );
  const scoped = entities.filter(
    (entity) =>
      entity.platform === 'wiser' && !entity.disabled_by && entity.device_id && roomDevices.has(entity.device_id),
  );
  return {
    climates: scoped.filter((entity) => entity.entity_id.startsWith('climate.')),
    passiveStrategies: scoped.filter(
      (entity) => entity.entity_id.startsWith('select.') && entity.translation_key === 'passive_mode_strategy',
    ),
  };
}

export function findRoomControls(
  hass: HomeAssistant,
  candidates: RoomControlEntities,
  roomName: string,
): { climate?: string; passiveStrategy?: string } {
  const climates = candidates.climates.filter((entity) => hass.states[entity.entity_id]?.attributes.name === roomName);
  if (climates.length !== 1) return {};
  const climate = climates[0];
  const strategies = candidates.passiveStrategies.filter((entity) => entity.device_id === climate.device_id);
  return {
    climate: climate.entity_id,
    passiveStrategy: strategies.length === 1 ? strategies[0].entity_id : undefined,
  };
}
