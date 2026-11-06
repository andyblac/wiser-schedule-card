const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const source = ts.transpileModule(fs.readFileSync('src/data/schedule-overview.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const moduleExports = {};
new Function('exports', source)(moduleExports);
const { nextScheduleChange } = moduleExports;
const schedule = (day, slots) => ({ ScheduleData: [{ day, slots }] });
const slot = (Time, Setpoint = '20') => ({ Time, Setpoint });
test('uses HA timezone and rolls past an exact boundary to next week', () => {
  const data = schedule('Saturday', [slot('10:00'), slot('11:00')]);
  const now = new Date('2026-09-12T09:00:00Z');
  assert.equal(nextScheduleChange(data, now, 'Europe/London').time, '11:00');
  const next = nextScheduleChange(schedule('Saturday', [slot('10:00')]), now, 'Europe/London');
  assert.equal(next.date, '2026-09-19');
});
test('resolves sun slots, sorts times, and handles empty schedules', () => {
  const data = schedule('Saturday', [slot('22:00'), slot('Sunset', 'On')]);
  const next = nextScheduleChange(data, new Date('2026-09-12T09:00:00Z'), 'UTC', {
    Sunsets: [{ day: 'Saturday', time: '19:20' }],
    Sunrises: [],
  });
  assert.equal(next.time, '19:20');
  assert.equal(next.setpoint, 'On');
  assert.equal(nextScheduleChange({ ScheduleData: [] }, new Date(), 'UTC'), undefined);
});

test('all full translations match the English key and placeholder set', () => {
  const directory = 'src/localize/languages';
  const flatten = (value, prefix = '') =>
    Object.entries(value).reduce((result, [key, item]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (item && typeof item === 'object') Object.assign(result, flatten(item, path));
      else result[path] = item;
      return result;
    }, {});
  const english = flatten(JSON.parse(fs.readFileSync(`${directory}/en.json`, 'utf8')));
  const placeholders = (value) => [...String(value).matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
  for (const language of ['da', 'de', 'es', 'fi', 'fr', 'hu', 'nb', 'nl', 'pt', 'sv']) {
    const translations = flatten(JSON.parse(fs.readFileSync(`${directory}/${language}.json`, 'utf8')));
    assert.deepEqual(Object.keys(translations).sort(), Object.keys(english).sort(), `${language} keys`);
    for (const key of Object.keys(english)) {
      assert.deepEqual(placeholders(translations[key]), placeholders(english[key]), `${language}.${key} placeholders`);
    }
  }
});

test('British English contains only genuine overrides', () => {
  const english = JSON.parse(fs.readFileSync('src/localize/languages/en.json', 'utf8'));
  const british = JSON.parse(fs.readFileSync('src/localize/languages/en-GB.json', 'utf8'));
  assert.deepEqual(british, { wiser: { editor: { theme_colors: 'Use theme colours' } } });
  assert.notEqual(british.wiser.editor.theme_colors, english.wiser.editor.theme_colors);
});
