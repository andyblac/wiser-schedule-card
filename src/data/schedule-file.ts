import { days, SPECIAL_TIMES } from '../const';
import type { Schedule, ScheduleDay } from '../types';

export function scheduleExportName(name: string, type = ''): string {
  const safeName = name.replace(/[^a-z0-9_-]/gi, '_') || 'schedule';
  const safeType = type.replace(/[^a-z0-9_-]/gi, '_');
  return `${safeType ? `${safeType}-` : ''}${safeName}.json`;
}

export function scheduleExportJson(schedule: Schedule): string {
  const scheduleData = schedule.ScheduleData.map((day) => ({
    day: day.day,
    slots: day.slots.map((slot) => {
      const specialTime = SPECIAL_TIMES.includes(slot.SpecialTime)
        ? slot.SpecialTime
        : SPECIAL_TIMES.includes(slot.Time)
          ? slot.Time
          : '';
      return {
        Time: specialTime || slot.Time,
        Setpoint: slot.Setpoint,
        SpecialTime: specialTime,
      };
    }),
  }));
  return JSON.stringify(
    {
      format: 'wiser-schedule',
      version: 1,
      schedule: {
        Name: schedule.Name,
        Type: schedule.Type,
        SubType: schedule.SubType,
        ScheduleData: scheduleData,
      },
    },
    null,
    2,
  );
}

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
        const timeSpecial = SPECIAL_TIMES.includes(slot.Time) ? slot.Time : '';
        const fieldSpecial = SPECIAL_TIMES.includes(slot.SpecialTime) ? slot.SpecialTime : '';
        if ((slot.SpecialTime && !fieldSpecial) || (timeSpecial && fieldSpecial && timeSpecial !== fieldSpecial))
          throw new Error('Invalid special time.');
        const specialTime = fieldSpecial || timeSpecial;
        const special = Boolean(specialTime);
        const time = specialTime || slot.Time;
        if (
          (!special && !/^([01]\d|2[0-3]):[0-5]\d$/.test(slot.Time)) ||
          (special && !['lighting', 'shutters'].includes(kind)) ||
          times.has(time)
        )
          throw new Error('Invalid or duplicate slot time.');
        times.add(time);
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
        return { Time: time, Setpoint: value, SpecialTime: specialTime };
      }),
    };
  });
  if (!count) throw new Error('The schedule has no time slots.');
  return { ...target, ScheduleData: data };
}
