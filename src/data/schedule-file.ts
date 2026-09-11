import { days, SPECIAL_TIMES } from '../const';
import type { Schedule, ScheduleDay } from '../types';

export function importScheduleFile(text: string, target: Schedule): Schedule {
  const file = JSON.parse(text);
  if (file.format !== 'wiser-schedule' || file.version !== 1) throw new Error('Unsupported schedule file.');
  const source = file.schedule;
  const kind = (target.SubType || target.Type).toLowerCase();
  if (!source || (source.SubType || source.Type)?.toLowerCase() !== kind)
    throw new Error('This file is for a different schedule type.');
  if (!Array.isArray(source.ScheduleData) || source.ScheduleData.length !== 7)
    throw new Error('The file must contain all seven days.');
  const seen = new Set<string>();
  let count = 0;
  const data: ScheduleDay[] = source.ScheduleData.map((day) => {
    if (!days.includes(day.day) || seen.has(day.day) || !Array.isArray(day.slots) || day.slots.length > 24)
      throw new Error('Invalid schedule days or slots.');
    seen.add(day.day);
    const times = new Set<string>();
    return {
      day: day.day,
      slots: day.slots.map((slot) => {
        const special = SPECIAL_TIMES.includes(slot.Time);
        if (
          (!special && !/^([01]\d|2[0-3]):[0-5]\d$/.test(slot.Time)) ||
          (special && !['lighting', 'shutters'].includes(kind)) ||
          times.has(slot.Time)
        )
          throw new Error('Invalid or duplicate slot time.');
        times.add(slot.Time);
        const value = String(slot.Setpoint);
        const number = Number(value);
        const valid =
          kind === 'heating'
            ? Number.isFinite(number) && (number === -20 || (number >= 5 && number <= 30))
            : ['lighting', 'shutters'].includes(kind)
              ? Number.isFinite(number) && number >= 0 && number <= 100
              : ['On', 'Off'].includes(value);
        if (!valid) throw new Error('Invalid schedule setting.');
        count++;
        return { Time: slot.Time, Setpoint: value, SpecialTime: special ? slot.Time : '' };
      }),
    };
  });
  if (!count) throw new Error('The schedule has no time slots.');
  return { ...target, ScheduleData: data };
}
