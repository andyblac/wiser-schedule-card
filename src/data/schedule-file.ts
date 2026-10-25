import { days, MAX_SCHEDULE_SLOTS_PER_DAY, SPECIAL_TIMES } from '../const';
import type { Schedule, ScheduleDay, ScheduleSlot } from '../types';

export function scheduleExportName(name: string, type = ''): string {
  const safeName = name.replace(/[^a-z0-9_-]/gi, '_') || 'schedule';
  const safeType = type.replace(/[^a-z0-9_-]/gi, '_');
  return `${safeType ? `${safeType}-` : ''}${safeName}.json`;
}

export function scheduleExportJson(schedule: Schedule): string {
  const passiveRange = schedule.PassiveRange === true;
  const passiveControl = schedule.PassiveControl === true;
  const passiveData = passiveRange || passiveControl;
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
        ...(passiveData ? { UpperSetpoint: slot.UpperSetpoint } : {}),
        ...(passiveControl
          ? {
              PassiveScheduled: Boolean(slot.PassiveScheduled),
              PassiveMode: slot.PassiveMode,
              PassiveStrategy: slot.PassiveStrategy,
            }
          : {}),
        SpecialTime: specialTime,
      };
    }),
  }));
  return JSON.stringify(
    {
      format: 'wiser-schedule',
      version: passiveData ? 2 : 1,
      schedule: {
        Name: schedule.Name,
        Type: schedule.Type,
        SubType: schedule.SubType,
        ...(passiveRange ? { PassiveRange: true } : {}),
        ...(passiveControl ? { PassiveControl: true } : {}),
        ScheduleData: scheduleData,
      },
    },
    null,
    2,
  );
}

export function importScheduleFile(text: string, target: Schedule): Schedule {
  const file = JSON.parse(text);
  if (file.format !== 'wiser-schedule' || ![1, 2].includes(file.version)) throw new Error('Unsupported schedule file.');
  const source = file.schedule;
  const kind = (target.SubType || target.Type).toLowerCase();
  if (!source || (source.SubType || source.Type)?.toLowerCase() !== kind)
    throw new Error('This file is for a different schedule type.');
  const passiveRange = file.version === 2 && source.PassiveRange === true;
  const passiveControl = file.version === 2 && source.PassiveControl === true;
  const passiveData = passiveRange || passiveControl;
  if (passiveData && kind !== 'heating') throw new Error('Passive scheduling requires a heating schedule.');
  if (passiveRange && !passiveControl && target.PassiveRange !== true)
    throw new Error('This schedule does not use a Passive Mode temperature range.');
  if (passiveControl && target.Capabilities?.PassiveControl !== true)
    throw new Error('This Wiser integration does not support Passive Mode scheduling.');
  if (!Array.isArray(source.ScheduleData) || source.ScheduleData.length !== 7)
    throw new Error('The file must contain all seven days.');
  const seen = new Set<string>();
  let count = 0;
  const data: ScheduleDay[] = source.ScheduleData.map((day) => {
    if (
      !days.includes(day.day) ||
      seen.has(day.day) ||
      !Array.isArray(day.slots) ||
      day.slots.length > MAX_SCHEDULE_SLOTS_PER_DAY
    )
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
        const result: ScheduleSlot = { Time: time, Setpoint: value, SpecialTime: specialTime };
        if (passiveData) {
          const scheduled = passiveControl ? slot.PassiveScheduled : false;
          const hasUpper = slot.UpperSetpoint !== undefined && slot.UpperSetpoint !== null && slot.UpperSetpoint !== '';
          const upper = Number(slot.UpperSetpoint);
          if (
            (passiveRange && !passiveControl && !hasUpper) ||
            (passiveControl && typeof scheduled !== 'boolean') ||
            (hasUpper && (!Number.isFinite(upper) || (upper !== -20 && (upper < 5 || upper > 30)) || upper < number)) ||
            (scheduled &&
              (!hasUpper ||
                typeof slot.PassiveMode !== 'boolean' ||
                !['modulating', 'temperature_limiter'].includes(slot.PassiveStrategy)))
          )
            throw new Error('Invalid passive schedule setting.');
          if (hasUpper) result.UpperSetpoint = upper;
          if (passiveControl) {
            result.PassiveScheduled = scheduled;
            if (scheduled) {
              result.PassiveMode = slot.PassiveMode;
              result.PassiveStrategy = slot.PassiveStrategy;
            }
          }
        }
        count++;
        return result;
      }),
    };
  });
  if (!count) throw new Error('The schedule has no time slots.');
  const imported = { ...target, ScheduleData: data };
  if (passiveControl) {
    imported.PassiveControl = true;
    imported.PassiveRange = true;
    imported.PassiveRangeType ??= 'scheduled';
    imported.MinUpperSetpoint ??= 5;
    imported.MaxUpperSetpoint ??= 30;
  } else if (passiveRange) {
    delete imported.PassiveControl;
    imported.PassiveRange = true;
  } else {
    delete imported.PassiveControl;
    delete imported.PassiveRange;
    delete imported.PassiveRangeType;
    delete imported.MinUpperSetpoint;
    delete imported.MaxUpperSetpoint;
  }
  return imported;
}
