import type { HomeAssistant } from 'custom-card-helpers';
import { fetchHubs } from './websockets';

interface Entity {
  entity_id: string;
  platform: string;
  device_id?: string;
  disabled_by?: string | null;
}
interface Device {
  id: string;
  via_device_id?: string;
  identifiers: [string, string][];
}

/** Scope room climate entities to the selected hub, never infer entity IDs from display names. */
export async function fetchRoomClimateEntities(hass: HomeAssistant, hub: string): Promise<string[]> {
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
  return entities
    .filter(
      (entity) =>
        entity.platform === 'wiser' &&
        entity.entity_id.startsWith('climate.') &&
        !entity.disabled_by &&
        entity.device_id &&
        roomDevices.has(entity.device_id),
    )
    .map((entity) => entity.entity_id);
}

export function findRoomClimate(hass: HomeAssistant, candidates: string[], roomName: string): string | undefined {
  const matches = candidates.filter((id) => hass.states[id]?.attributes.name === roomName);
  return matches.length === 1 ? matches[0] : undefined;
}
