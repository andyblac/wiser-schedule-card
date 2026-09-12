const { chromium } = require('playwright');
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const assert = require('node:assert/strict');
(async () => {
  const server = createServer(async (req, res) => {
    const script = req.url.split('?')[0] === '/card.js';
    res.setHeader('Content-Type', script ? 'text/javascript' : 'text/html');
    res.end(await readFile(script ? 'dist/wiser-schedule-card.js' : 'tests/fixture.html'));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.waitForFunction(() => window.ready);
    await page.evaluate(() => {
      const panel = document.createElement('wiser-schedules-panel');
      panel.hass = makeHass();
      panel.panel = { config: { hubs: ['hub-one'], card_configs: {} } };
      document.querySelector('#mount').replaceChildren(panel);
    });
    await page.locator('wiser-schedule-card').waitFor();
    await page.locator('ha-button#settings').click();
    await page.waitForFunction(() => document.querySelector('wiser-schedules-panel').shadowRoot.querySelector('ha-dialog').open);
    await page.locator('wiser-schedule-card-editor').waitFor();
    assert.equal(await page.locator('wiser-schedule-card-editor .hub-picker').count(), 0);
    assert.equal(await page.locator('ha-button#save').count(), 1);
    assert.equal(await page.locator('ha-button#cancel').count(), 1);
    assert.equal(await page.locator('ha-dialog #editor-actions').getAttribute('slot'), 'footer');
    assert.equal(await page.getByLabel('Hide card background', { exact: true }).count(), 0);
    assert.equal(await page.getByLabel('Hide card borders', { exact: true }).count(), 0);
    await page.getByLabel('Use theme colours', { exact: true }).check();
    await page.locator('ha-button#save').click();
    await page.waitForFunction(() => !document.querySelector('wiser-schedules-panel').shadowRoot.querySelector('ha-dialog').open);
    const call = await page.evaluate(() => fixture.calls.find(c => c.type === 'wiser/schedules_panel/configure'));
    assert.equal(call.configs['hub-one'].theme_colors, true);
    assert.equal(await page.locator('wiser-schedules-panel').count(), 1);
    assert.equal(await page.locator('#hub-tabs').isVisible(), true);
    await page.evaluate(() => {
      document.querySelector('wiser-schedules-panel').panel = {
        config: { hubs: ['hub-one', 'hub-two'], card_configs: {} },
      };
    });
    const tabs = page.locator('#hub-tabs [role="tab"]');
    assert.deepEqual(await tabs.allTextContents(), ['hub-one', 'hub-two']);
    assert.equal(await page.locator('wiser-schedule-card:visible').count(), 1);
    await tabs.nth(1).click();
    assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('wiser-schedule-card:visible').getAttribute('id'), 'hub-panel-1');
    await tabs.nth(1).press('ArrowLeft');
    assert.equal(await tabs.nth(0).getAttribute('aria-selected'), 'true');
    await tabs.nth(0).press('End');
    assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
    await page.evaluate(() => {
      document.querySelector('wiser-schedules-panel').panel = {
        config: { hubs: ['hub-one', 'hub-two'], card_configs: { 'hub-two': { hide_card_background: true } } },
      };
    });
    assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
    await page.evaluate(() => {
      document.querySelector('wiser-schedules-panel').panel = {
        config: { hubs: ['hub-one'], card_configs: {} },
      };
    });
    assert.equal(await page.locator('#hub-tabs').isVisible(), true);
    assert.equal(await page.locator('wiser-schedule-card:visible').count(), 1);
    assert.deepEqual(errors, []);
    console.log('PASS bundled panel, native HA dialog/buttons, existing editor toggle and save without navigation');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
