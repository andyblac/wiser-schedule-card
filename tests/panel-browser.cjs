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
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.waitForFunction(() => window.ready);
    await page.evaluate(() => {
      const panel = document.createElement('wiser-schedules-panel');
      panel.hass = makeHass();
      panel.panel = { config: { panel_id: 'registry-panel', hubs: ['hub-one'], card_configs: {} } };
      document.querySelector('#mount').replaceChildren(panel);
    });
    await page.locator('wiser-schedule-card').waitFor();
    await page.evaluate(() => {
      document.querySelector('#mount').style.cssText = 'max-width:none;width:100%;height:900px';
    });
    for (const width of [1800, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      const layout = await page.locator('wiser-schedules-panel').evaluate((panel) => {
        const main = panel.shadowRoot.querySelector('main');
        const card = main.querySelector('wiser-schedule-card');
        const surface = card.shadowRoot.querySelector('ha-card');
        return {
          panel: panel.getBoundingClientRect().width,
          main: main.getBoundingClientRect().width,
          mainHeight: main.getBoundingClientRect().height,
          card: card.getBoundingClientRect().width,
          height: surface.getBoundingClientRect().height,
        };
      });
      assert.ok(Math.abs(layout.main - layout.panel) < 1);
      assert.ok(Math.abs(layout.card - (layout.panel - 32)) < 1);
      assert.ok(layout.height >= layout.mainHeight - 32 - 1, JSON.stringify(layout));
    }
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.locator('ha-button#settings').click();
    await page.waitForFunction(
      () => document.querySelector('wiser-schedules-panel').shadowRoot.querySelector('ha-dialog').open,
    );
    assert.equal(await page.locator('ha-dialog').getAttribute('header-title'), 'hub-one - Panel settings');
    assert.equal(await page.locator('ha-dialog').evaluate((dialog) => dialog.headerTitle), 'hub-one - Panel settings');
    await page.locator('wiser-schedule-card-editor').waitFor();
    assert.equal(await page.locator('wiser-schedule-card-editor .hub-picker').count(), 0);
    assert.equal(await page.locator('ha-button#save').count(), 1);
    assert.equal(await page.locator('ha-button#cancel').count(), 1);
    assert.equal(await page.locator('ha-dialog #editor-actions').getAttribute('slot'), 'footer');
    assert.equal(await page.getByLabel('Hide card background', { exact: true }).count(), 0);
    assert.equal(await page.getByLabel('Hide card borders', { exact: true }).count(), 0);
    assert.equal(await page.getByLabel('Temperatures: Low', { exact: true }).inputValue(), '#ebff00');
    assert.equal(await page.getByLabel('Temperatures: High', { exact: true }).inputValue(), '#eb0000');
    assert.equal(await page.getByLabel('Controls: On', { exact: true }).inputValue(), '#43a047');
    assert.equal(await page.getByLabel('Controls: Off', { exact: true }).inputValue(), '#db4437');
    assert.equal(await page.getByLabel('Hot water: On', { exact: true }).inputValue(), '#ff0000');
    assert.equal(await page.getByLabel('Hot water: Off', { exact: true }).inputValue(), '#8a8a8a');
    assert.deepEqual(
      await page
        .locator('wiser-schedule-card-editor .color-group')
        .nth(1)
        .locator('.color-field > span:first-child')
        .allTextContents(),
      ['Off', 'On'],
    );
    assert.deepEqual(
      await page
        .locator('wiser-schedule-card-editor .color-group')
        .nth(2)
        .locator('.color-field > span:first-child')
        .allTextContents(),
      ['Off', 'On'],
    );
    assert.equal(await page.getByLabel('Lighting: Off', { exact: true }).inputValue(), '#8a8a8a');
    assert.equal(await page.getByLabel('Lighting: On', { exact: true }).inputValue(), '#ffcc00');
    assert.equal(await page.getByLabel('Shutters: Closed', { exact: true }).inputValue(), '#8a8a8a');
    assert.equal(await page.getByLabel('Shutters: Open', { exact: true }).inputValue(), '#ffcc00');
    const resetLowColor = page.getByLabel('Temperatures: Low: Reset to default', { exact: true });
    assert.equal(await resetLowColor.isDisabled(), true);
    await page.getByLabel('Temperatures: Low', { exact: true }).focus();
    assert.equal(
      await page.getByLabel('Temperatures: Low', { exact: true }).evaluate((input) => input.matches(':focus')),
      true,
    );
    await page.locator('wiser-schedule-card-editor .version').click();
    assert.equal(
      await page.getByLabel('Temperatures: Low', { exact: true }).evaluate((input) => input.matches(':focus')),
      false,
    );
    await page.getByLabel('Temperatures: Low', { exact: true }).fill('#123456');
    assert.equal(await resetLowColor.isDisabled(), false);
    await resetLowColor.click();
    assert.equal(await page.getByLabel('Temperatures: Low', { exact: true }).inputValue(), '#ebff00');
    assert.equal(await resetLowColor.isDisabled(), true);
    await page.getByLabel('Temperatures: Low', { exact: true }).fill('#123456');
    await page.getByLabel('Controls: On', { exact: true }).fill('#abcdef');
    await page.getByLabel('Hot water: Off', { exact: true }).fill('#112233');
    await page.getByLabel('Use theme colors', { exact: true }).check();
    assert.equal(await page.locator('wiser-schedule-card-editor input[type="color"]').count(), 10);
    assert.equal(await page.locator('wiser-schedule-card-editor input[type="color"]:disabled').count(), 10);
    await page.locator('ha-button#save').click();
    await page.waitForFunction(
      () => !document.querySelector('wiser-schedules-panel').shadowRoot.querySelector('ha-dialog').open,
    );
    const call = await page.evaluate(() => fixture.calls.find((c) => c.type === 'wiser/panel/configure'));
    assert.equal(call.configs['hub-one'].theme_colors, true);
    assert.equal(call.configs['hub-one'].low_color, '#123456');
    assert.equal(call.configs['hub-one'].on_color, '#abcdef');
    assert.equal(call.configs['hub-one'].hot_water_off_color, '#112233');
    assert.equal(await page.locator('wiser-schedules-panel').count(), 1);
    assert.equal(await page.locator('#hub-tabs').isVisible(), false);
    await page.evaluate(() => {
      document.querySelector('wiser-schedules-panel').panel = {
        config: { panel_id: 'registry-panel', hubs: ['hub-one', 'hub-two'], card_configs: {} },
      };
    });
    const tabs = page.locator('#hub-tabs [role="tab"]');
    assert.equal(await page.locator('#hub-tabs').isVisible(), true);
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
        config: {
          panel_id: 'registry-panel',
          hubs: ['hub-one', 'hub-two'],
          card_configs: { 'hub-two': { hide_card_background: true } },
        },
      };
    });
    assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
    await page.evaluate(() => {
      document.querySelector('wiser-schedules-panel').panel = {
        config: { panel_id: 'registry-panel', hubs: ['hub-one'], card_configs: {} },
      };
    });
    assert.equal(await page.locator('#hub-tabs').isVisible(), false);
    assert.equal(await page.locator('wiser-schedule-card:visible').count(), 1);
    assert.deepEqual(errors, []);
    console.log('PASS bundled panel, native HA dialog/buttons, existing editor toggle and save without navigation');
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
