import type { Schedule, SunTimes } from '../types';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Find the next programmed slot in the Home Assistant timezone, including next week. */
export function nextScheduleChange(schedule: Schedule, now: Date, timeZone: string, sun?: SunTimes) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const number = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const today = Date.UTC(number('year'), number('month') - 1, number('day'));
  const seconds = number('hour') * 3600 + number('minute') * 60 + number('second');
  for (let offset = 0; offset <= 7; offset++) {
    const date = new Date(today + offset * 86400000);
    const day = days[date.getUTCDay()];
    const slots = schedule.ScheduleData.find((item) => item.day.toLowerCase() === day.toLowerCase())?.slots || [];
    const candidates = slots
      .map((slot) => {
        let time = slot.Time;
        if (time.toLowerCase() === 'sunrise' || time.toLowerCase() === 'sunset') {
          const times = time.toLowerCase() === 'sunrise' ? sun?.Sunrises : sun?.Sunsets;
          time = times?.find((item) => item.day.toLowerCase() === day.toLowerCase())?.time || '';
        }
        const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(time);
        if (!match) return undefined;
        const [, h, m, s = '0'] = match;
        const value = Number(h) * 3600 + Number(m) * 60 + Number(s);
        if (Number(h) > 23 || Number(m) > 59 || Number(s) > 59 || (!offset && value <= seconds)) return undefined;
        return {
          day,
          date: date.toISOString().slice(0, 10),
          time: `${h.padStart(2, '0')}:${m}`,
          setpoint: slot.Setpoint,
          seconds: value,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => a.seconds - b.seconds);
    if (candidates.length) return candidates[0];
  }
  return undefined;
}
