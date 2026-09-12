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
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 720, height: 850 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const button = (name) => page.getByRole('button', { name, exact: true });
    const fresh = async () => {
      await page.goto(`http://127.0.0.1:${server.address().port}`);
      await page.waitForFunction(() => window.ready);
    };
    const roomsReady = () => page.waitForSelector('button.room');
    const checkCreateType = async (type) => {
      await button('Add Schedule').click();
      await page.getByText('Enter a name for the new schedule', { exact: true }).waitFor();
      for (const other of ['Heating', 'OnOff', 'Lighting', 'Shutters'])
        assert.equal(await button(other).count(), 0, 'single compatible type needs no picker');
      assert.equal(await button('save').isDisabled(), true);
      await page.getByRole('textbox', { name: 'Schedule Name' }).fill('Test ' + type);
      await button('save').click();
      await page.waitForSelector('wiser-room-schedules');
      const request = await page.evaluate(() =>
        fixture.calls.filter((call) => call.type === 'wiser/schedule/create').at(-1),
      );
      assert.equal(request.schedule_type, type);
      assert.equal(request.name, 'Test ' + type);
      await button('Save schedule').waitFor();
      const editor = page.locator('wiser-schedule-edit-card');
      assert.equal(await editor.evaluate((el) => el.schedule.Name), 'Test ' + type);
      await button('Cancel editing').click();
      const assigned = await page.evaluate(() =>
        fixture.calls.filter((c) => c.type === 'wiser/schedule/assign').at(-1),
      );
      const createdId = await editor.evaluate((el) => el.schedule.Id);
      assert.equal(assigned.schedule_id, createdId);
      assert.equal(await button('Assign schedule').isDisabled(), true);
    };

    const settleHeight = () =>
      page.waitForFunction(
        () => !document.querySelector('wiser-schedule-card').style.getPropertyValue('--wiser-view-min-height'),
      );

    await fresh();
    await page.evaluate(() => mountCard());
    await roomsReady();
    assert.equal(await page.locator('button.room').count(), 4);
    assert.equal(await button('Add Schedule').count(), 0, 'home has no toolbar');
    assert.equal(await button('Manage schedules').count(), 0);
    assert.match(await page.locator('button.room').filter({ hasText: 'Lounge' }).textContent(), /Living room/);
    assert.match(
      await page.locator('button.room').filter({ hasText: 'Spare bedroom' }).textContent(),
      /No schedule assigned/,
    );
    await page.getByRole('heading', { name: 'Heating', exact: true }).waitFor();
    await page.getByRole('heading', { name: 'Moments', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Movie night Open controls' }).waitFor();
    await page.evaluate(() =>
      document.addEventListener('hass-more-info', (event) => (window.openedMoment = event.detail.entityId)),
    );
    await page.getByRole('button', { name: 'Movie night Open controls' }).click();
    assert.equal(await page.evaluate(() => window.openedMoment), 'button.wiser_movie');
    const homeHeight = (await page.locator('wiser-schedule-card').boundingBox()).height;
    await page.locator('button.room').filter({ hasText: 'Lounge' }).focus();
    await page.keyboard.press('Enter');
    await page.getByLabel('Choose a schedule').waitFor();
    assert.equal(await button('Manage schedules').count(), 0, 'redundant calendar button removed');
    assert.equal(await button('Assign schedule').isDisabled(), true);
    assert.equal(await page.locator('select option').filter({ hasText: 'Evening lights' }).count(), 0);
    await page.getByLabel('Choose a schedule').selectOption('2');
    assert.equal(
      await page.evaluate(() => fixture.calls.filter((c) => c.type === 'wiser/schedule/assign').length),
      0,
      'selection alone never assigns',
    );
    await button('Assign schedule').click();
    await page.getByText('Schedule assigned.', { exact: true }).waitFor();
    assert.deepEqual(await page.evaluate(() => fixture.calls.find((c) => c.type === 'wiser/schedule/assign')), {
      type: 'wiser/schedule/assign',
      hub: 'hub-one',
      schedule_type: 'Heating',
      schedule_id: 2,
      entity_id: '10',
      remove: false,
    });
    assert.equal(await page.evaluate(() => fixture.assignments[12]), 1, 'other rooms retain their schedules');
    assert.equal(await button('Assign schedule').isDisabled(), true);
    await page.waitForSelector('wiser-room-schedules wiser-schedule-slot-editor');
    assert.equal(
      await page.locator('wiser-schedule-edit-card .assignment-wrapper').count(),
      0,
      'room assignments replaced with schedule choice',
    );
    assert.equal(await page.evaluate(() => fixture.subscribers), 2);
    const chooserBox = await page.getByLabel('Choose a schedule').boundingBox();
    const timelineBox = await page.locator('wiser-schedule-slot-editor').boundingBox();
    assert.ok(chooserBox.y + chooserBox.height <= timelineBox.y, 'schedule chooser is above timeline');
    assert.equal(
      await page.evaluate(() => customElements.get('wiser-schedule-list-card') === undefined),
      true,
      'unused schedule list is not bundled',
    );
    await button('Edit schedule').click();
    assert.equal(await page.getByLabel('Choose a schedule').isDisabled(), true);
    await button('Cancel editing').click();
    await button('Edit schedule').click();
    await page.locator('wiser-schedule-slot-editor [slot="0"] .slotoverlay span').first().click();
    assert.equal(await page.locator('.time-handle').count(), 2, 'selected slot has both movable boundaries');
    const endHandle = page.locator('.end-handle .time-handle');
    const endBox = await endHandle.boundingBox();
    await page.mouse.move(endBox.x + endBox.width / 2, endBox.y + endBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(endBox.x - 25, endBox.y + endBox.height / 2);
    await page.mouse.up();
    const draggedTimes = await page
      .locator('wiser-schedule-slot-editor')
      .evaluate((el) => el.schedule.ScheduleData[0].slots.map((slot) => slot.Time));
    assert.equal(draggedTimes[0], '06:00', 'end handle preserves selected start');
    assert.notEqual(draggedTimes[1], '22:00', 'end handle moves next boundary');
    const temperature = page.getByRole('slider', { name: 'Temperature' });
    await temperature.focus();
    await temperature.press('ArrowRight');
    await temperature.press('ArrowRight');
    await button('Save schedule').click();
    await button('Edit schedule').waitFor();
    const savedSchedule = await page.evaluate(() => fixture.calls.find((c) => c.type === 'wiser/schedule/save'));
    assert.equal(savedSchedule.schedule_id, 2);
    assert.equal(Number(savedSchedule.schedule.ScheduleData[0].slots[0].Setpoint), 21);
    assert.equal(await page.getByLabel('Choose a schedule').isDisabled(), false);
    const downloadPromise = page.waitForEvent('download');
    await button('Export schedule').click();
    const download = await downloadPromise;
    const exported = JSON.parse(await readFile(await download.path(), 'utf8'));
    assert.equal(exported.format, 'wiser-schedule');
    assert.equal(exported.schedule.Type, 'Heating');
    assert.equal(exported.schedule.Assignments, undefined);
    const saveCount = await page.evaluate(() => fixture.calls.filter((c) => c.type === 'wiser/schedule/save').length);
    exported.schedule.Name = 'File name must not overwrite';
    exported.schedule.ScheduleData[0].slots[0].Setpoint = '23';
    await page.locator('input.import-file').setInputFiles({
      name: 'schedule.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(exported)),
    });
    await button('Save schedule').waitFor();
    assert.equal(await page.locator('wiser-schedule-edit-card').evaluate((el) => el._tempSchedule.Name), 'Bedrooms');
    assert.equal(
      await page
        .locator('wiser-schedule-edit-card')
        .evaluate((el) => el._tempSchedule.ScheduleData[0].slots[0].Setpoint),
      '23',
    );
    assert.equal(
      await page.evaluate(() => fixture.calls.filter((c) => c.type === 'wiser/schedule/save').length),
      saveCount,
      'import stays a draft',
    );
    await button('Cancel editing').click();
    await page.evaluate(() =>
      document.addEventListener('show-dialog', (event) => (window.importError = event.detail.dialogParams.error)),
    );
    exported.schedule.SubType = 'OnOff';
    await page.locator('input.import-file').setInputFiles({
      name: 'wrong-type.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(exported)),
    });
    await page.waitForFunction(() => window.importError?.includes('different schedule type'));
    assert.equal(await button('Save schedule').count(), 0);
    console.log('PASS JSON export, import draft, preserved identity and incompatible type rejection');
    await button('Rename').click();
    await page.waitForSelector('wiser-schedule-rename-card input');
    assert.equal(await page.getByRole('textbox', { name: 'Schedule Name' }).inputValue(), 'Bedrooms');
    await page.getByRole('textbox', { name: 'Schedule Name' }).fill('Renamed schedule');
    await button('save').click();
    await page.getByLabel('Choose a schedule').waitFor();
    assert.equal(
      await page.evaluate(() => fixture.calls.find((c) => c.type === 'wiser/schedule/rename').schedule_name),
      'Renamed schedule',
    );
    await page.getByLabel('Choose a schedule').waitFor();
    await button('Copy').click();
    await page.waitForSelector('wiser-schedule-copy-card');
    await button('cancel').click();
    await page.getByLabel('Choose a schedule').waitFor();
    await button('Back to home').click();
    await roomsReady();
    await settleHeight();
    assert.ok(Math.abs((await page.locator('wiser-schedule-card').boundingBox()).height - homeHeight) < 1);
    assert.match(await page.locator('button.room').filter({ hasText: 'Lounge' }).textContent(), /Bedrooms/);
    if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/wiser-desktop.png` });
    await page.locator('button.room').filter({ hasText: 'Lounge' }).click();
    await page.getByLabel('Choose a schedule').waitFor();
    await page.waitForSelector('wiser-schedule-slot-editor');
    if (process.env.SCREENSHOT_DIR)
      await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/wiser-room-detail.png` });
    console.log('PASS room-first navigation, no home toolbar, explicit assignment, shared rooms and return height');

    await page.getByLabel('Choose a schedule').selectOption('3');
    await page.evaluate(() => (fixture.failAssign = true));
    await button('Assign schedule').click();
    await page.getByRole('alert').waitFor();
    assert.equal(await page.evaluate(() => fixture.assignments[10]), 2, 'failed assignment preserves current schedule');
    await page.evaluate(() => (fixture.failAssign = false));
    await button('Try again').click();
    await button('Assign schedule').click();
    await page.getByText('Schedule assigned.', { exact: true }).waitFor();
    console.log('PASS assignment failure and retry');

    await fresh();
    await page.evaluate(() => {
      fixture.devices = {
        lighting: [{ Id: 21, Name: 'Hall light' }],
        onoff: [{ Id: 22, Name: 'Desk plug' }],
        shutters: [{ Id: 23, Name: 'Lounge blind' }],
      };
      fixture.schedules.push(
        { Id: 1000, Type: 'OnOff', SubType: 'HotWater', Name: 'Water timer', Assignments: 0 },
        { Id: 5, Type: 'OnOff', Name: 'Plug timer', Assignments: 0 },
        { Id: 6, Type: 'Level', SubType: 'Shutters', Name: 'Blind timer', Assignments: 0 },
      );
      fixture.assignments[21] = 4;
      fixture.assignments[22] = 5;
      fixture.assignments[23] = 6;
      mountCard();
    });
    await page.getByRole('heading', { name: 'Lighting & devices', exact: true }).waitFor();
    for (const [country, icon] of [
      ['GB', 'uk'],
      ['US', 'us'],
      ['AU', 'au'],
      ['DE', 'de'],
      ['FR', 'fr'],
      ['CH', 'ch'],
      ['IT', 'it'],
      ['JP', 'jp'],
      [null, null],
    ]) {
      await page.evaluate((country) => {
        const hass = makeHass();
        hass.config.country = country;
        document.querySelector('wiser-schedule-card').hass = hass;
      }, country);
      await page.waitForFunction(
        (expected) => {
          const room = document.querySelector('wiser-schedule-card').shadowRoot.querySelector('wiser-room-schedules');
          const tile = [...room.shadowRoot.querySelectorAll('button.room')].find((el) =>
            el.textContent.includes('Desk plug'),
          );
          return tile.querySelector('ha-icon').icon === expected;
        },
        icon ? `mdi:power-socket-${icon}` : 'mdi:power-plug',
      );
    }
    console.log('PASS country-specific plug icons and unknown-country fallback');

    await page.getByRole('heading', { name: 'Hot water', exact: true }).waitFor();
    assert.equal(await page.locator('.tools').count(), 0);
    await page.locator('button.room').filter({ hasText: 'Hall light' }).click();
    await button('Edit schedule').waitFor();
    assert.equal(await page.locator('select').count(), 1, 'single schedule still permits unassignment');
    await checkCreateType('Lighting');
    await page.waitForSelector('wiser-schedule-slot-editor');
    await button('Back to home').click();
    await page.locator('button.room').filter({ hasText: 'Desk plug' }).click();
    await button('Add Schedule').waitFor();
    assert.equal(await page.locator('select').count(), 1);
    await checkCreateType('OnOff');
    await button('Back to home').click();
    await page.locator('button.room').filter({ hasText: 'Lounge blind' }).click();
    await button('Add Schedule').waitFor();
    assert.equal(await page.locator('select').count(), 1);
    await checkCreateType('Shutters');
    await button('Back to home').click();
    await page.locator('button.room').filter({ hasText: 'Hot water' }).click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    assert.equal(await page.locator('select').count(), 0);
    assert.equal(await button('Delete schedule').isDisabled(), true);
    await button('Back to home').click();
    if (process.env.SCREENSHOT_DIR)
      await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/wiser-home-sections.png` });
    await fresh();
    await page.evaluate(() => mountCard());
    await roomsReady();
    assert.equal(await page.getByRole('heading', { name: 'Lighting & devices', exact: true }).count(), 0);
    assert.equal(await page.getByRole('heading', { name: 'Hot water', exact: true }).count(), 0);
    await page.evaluate(() => {
      const card = document.querySelector('wiser-schedule-card');
      const hass = makeHass();
      hass.states = {};
      card.hass = hass;
    });
    await page.waitForFunction(
      () =>
        !document
          .querySelector('wiser-schedule-card')
          .shadowRoot.querySelector('wiser-room-schedules')
          .shadowRoot.querySelector('wiser-moments')
          .shadowRoot.querySelector('h3'),
    );
    console.log('PASS conditional home sections, device compatibility, hot-water controls and empty Moments');

    // Test cached selection against real updates and exclude the reserved hot-water schedule.
    await fresh();
    await page.evaluate(() => {
      fixture.schedules.push({ Id: 1000, Type: 'Heating', Name: 'Hot water', Assignments: 0 });
      mountCard();
    });
    await roomsReady();
    await page.locator('button.room').filter({ hasText: 'Spare bedroom' }).click();
    await page.getByLabel('Choose a schedule').waitFor();
    assert.equal(await page.locator('select option').filter({ hasText: 'Hot water' }).count(), 0);
    await page.getByLabel('Choose a schedule').selectOption('1');
    await button('Assign schedule').click();
    await page.getByText('Schedule assigned.', { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => fixture.assignments[13]), 1);

    await fresh();
    await page.evaluate(() => mountCard({ display_only: true, view_type: 'list' }));
    await roomsReady();
    await page.locator('button.room').first().click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    assert.equal(await button('Manage schedules').count(), 0);
    assert.equal(await button('Assign schedule').count(), 0);
    assert.equal(await button('Add Schedule').count(), 0);
    assert.equal(await page.locator('select').count(), 0);
    assert.equal(await button('Edit schedule').count(), 0);
    await page.waitForSelector('wiser-schedule-slot-editor');
    await fresh();
    await page.evaluate(() => {
      const card = mountCard({ admin_only: true });
      card.hass = { ...makeHass(), user: { is_admin: false } };
    });
    await roomsReady();
    await page.locator('button.room').first().click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    assert.equal(await button('Manage schedules').count(), 0);
    assert.equal(await button('Assign schedule').count(), 0);
    assert.equal(await page.locator('.tools button').count(), 1, 'non-admin device toolbar only has Back');
    assert.equal(await button('Export schedule').count(), 0);
    console.log('PASS unassigned rooms, compatible schedule filter, read-only and admin restrictions');
    await fresh();
    await page.evaluate(() => {
      fixture.schedules = fixture.schedules.filter((s) => s.Id === 1);
      mountCard();
    });
    await roomsReady();
    await page.locator('button.room').filter({ hasText: 'Spare bedroom' }).click();
    await page.getByLabel('Choose a schedule').waitFor();
    assert.equal(await page.locator('select').count(), 1);
    assert.equal(await page.evaluate(() => fixture.assignments[13]), undefined, 'preselection does not assign');
    await button('Assign schedule').click();
    await page.getByText('Schedule assigned.', { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => fixture.assignments[13]), 1);
    assert.equal(await page.locator('select option').filter({ hasText: 'No schedule' }).count(), 0);
    await page
      .locator('ha-selector')
      .evaluate((el) =>
        el.dispatchEvent(
          new CustomEvent('value-changed', { detail: { value: undefined }, bubbles: true, composed: true }),
        ),
      );
    assert.equal(await page.locator('ha-selector').evaluate((el) => el.required), false);
    assert.equal(await page.evaluate(() => fixture.assignments[13]), 1, 'selection alone does not unassign');
    await button('Assign schedule').click();
    await page.getByText('Schedule unassigned.', { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => fixture.assignments[13]), undefined);
    assert.equal(await page.evaluate(() => fixture.schedules.length), 1, 'schedule is preserved');
    assert.equal(
      await page.evaluate(() => fixture.calls.filter((c) => c.type === 'wiser/schedule/assign').at(-1).remove),
      true,
    );
    await page.getByLabel('Choose a schedule').selectOption('1');
    await button('Assign schedule').click();
    await page.getByText('Schedule assigned.', { exact: true }).waitFor();

    await fresh();
    await page.evaluate(() => {
      fixture.delay = 150;
      fixture.schedules = [];
      mountCard();
    });
    await page.getByText('Loading schedules…').waitFor();
    await roomsReady();
    await page.locator('button.room').first().click();
    await button('Add Schedule').waitFor();
    assert.equal(await button('Assign schedule').isDisabled(), true);
    await button('Add Schedule').click();
    await page.getByRole('textbox', { name: 'Schedule Name' }).waitFor();
    await button('cancel').click();
    await button('Add Schedule').waitFor();
    assert.equal(await page.locator('select').count(), 0, 'no schedules hides picker');
    await checkCreateType('Heating');
    assert.equal(await button('Assign schedule').isDisabled(), true);
    await fresh();
    await page.evaluate(() => {
      fixture.rooms = [];
      mountCard();
    });
    await page.getByText('No scheduled Wiser rooms or devices found.').waitFor();
    await fresh();
    await page.evaluate(() => {
      fixture.fail = true;
      mountCard();
    });
    await page.getByRole('alert').waitFor();
    await page.evaluate(() => (fixture.fail = false));
    await button('Try again').click();
    await roomsReady();
    console.log('PASS loading, empty states, create navigation and connection error recovery');

    await fresh();
    await page.evaluate(() => mountCard({ selected_schedule: 'Heating|1' }));
    await page.waitForSelector('wiser-schedule-slot-editor');
    await button('Rename').click();
    await page.waitForSelector('wiser-schedule-rename-card input');
    console.log('PASS pinned schedules and rename navigation');

    for (const nested of [false, true]) {
      await fresh();
      await page.setViewportSize({ width: 720, height: 500 });
      await page.evaluate((nested) => {
        const mount = document.querySelector('#mount');
        const spacer = document.createElement('div');
        spacer.style.height = '650px';
        if (nested) {
          const host = document.createElement('div');
          const shadow = host.attachShadow({ mode: 'open' });
          const scroller = document.createElement('div');
          scroller.style.cssText = 'height:450px;overflow:auto';
          shadow.append(scroller);
          document.body.append(host);
          scroller.append(spacer, mount);
          window.testScroller = scroller;
        } else {
          mount.before(spacer);
          window.testScroller = document.scrollingElement;
        }
        const card = document.createElement('wiser-schedule-card');
        card.setConfig({ type: 'custom:wiser-schedule-card', hub: 'hub-one', home_screen: 'devices' });
        card.hass = makeHass();
        mount.append(card);
      }, nested);
      await roomsReady();
      const before = await page.evaluate(() => {
        fixture.delay = 250;
        testScroller.scrollTop = 650;
        return testScroller.scrollTop;
      });
      await page.locator('button.room').first().click();
      await page.waitForTimeout(100);
      assert.equal(await page.evaluate(() => testScroller.scrollTop), before, 'no loading collapse in dashboard');
      await page.getByLabel('Choose a schedule').waitFor();
    }
    console.log('PASS document and shadow dashboard scroll during room loading');

    await fresh();
    await page.setViewportSize({ width: 360, height: 800 });
    await page.evaluate(() => {
      document.body.classList.add('dark');
      fixture.rooms[0].Name = 'A very long living room name that should wrap';
      mountCard();
    });
    await roomsReady();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (process.env.SCREENSHOT_DIR)
      await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/wiser-mobile.png`, fullPage: true });
    await page.locator('button.room').first().click();
    await page.getByLabel('Choose a schedule').waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'toolbar fits mobile');
    await page.waitForSelector('wiser-schedule-slot-editor');
    if (process.env.SCREENSHOT_DIR)
      await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/wiser-room-mobile.png`, fullPage: true });
    console.log('PASS mobile room list and toolbar');

    await fresh();
    await page.evaluate(() => {
      const card = mountCard();
      card.hass = { ...makeHass(), config: { components: [] } };
    });
    await page.getByText('The Wiser integration is not available.').waitFor();
    await page.evaluate(() => (document.querySelector('wiser-schedule-card').hass = makeHass()));
    await roomsReady();
    await fresh();
    await page.evaluate(() => {
      const editor = document.createElement('wiser-schedule-card-editor');
      editor.hass = makeHass();
      editor.setConfig({ type: 'custom:wiser-schedule-card', selected_schedule: 'Heating|1' });
      editor.addEventListener('config-changed', (event) => (window.lastConfig = event.detail.config));
      document.querySelector('#mount').append(editor);
    });
    await page.getByLabel('Wiser hub').waitFor();
    await page.getByLabel('Wiser hub').selectOption('hub-two');
    await page.waitForFunction(() => lastConfig.hub === 'hub-two');
    assert.equal(await page.evaluate(() => lastConfig.selected_schedule), undefined);
    await page.getByLabel('Read-only mode').check();
    assert.equal(await page.evaluate(() => lastConfig.display_only), true);
    await page.getByLabel('Hide card background', { exact: true }).check();
    assert.equal(await page.evaluate(() => lastConfig.hide_card_background), true);
    assert.equal(await page.getByLabel('Only admins can manage schedules').isDisabled(), true);
    await fresh();
    await page.evaluate(async () => {
      window.dialogCounts = { cancel: 0, confirm: 0 };
      const dialog = document.createElement('wiser-dialog-delete-confirm');
      dialog.hass = makeHass();
      document.querySelector('#mount').append(dialog);
      window.deleteDialog = dialog;
      window.dialogParams = {
        name: 'Test schedule',
        cancel: () => dialogCounts.cancel++,
        confirm: () => dialogCounts.confirm++,
      };
      await dialog.showDialog(dialogParams);
    });
    await button('cancel').waitFor();
    await button('delete').waitFor();
    assert.equal(await page.locator('wiser-dialog-delete-confirm .actions').getAttribute('slot'), 'footer');
    await button('cancel').click();
    assert.deepEqual(await page.evaluate(() => dialogCounts), { cancel: 1, confirm: 0 });
    await page.evaluate(() => deleteDialog.showDialog(dialogParams));
    await button('delete').click();
    assert.deepEqual(await page.evaluate(() => dialogCounts), { cancel: 1, confirm: 1 });
    assert.equal(await page.locator('ha-dialog').count(), 0);
    await page.evaluate(async () => {
      await deleteDialog.showDialog(dialogParams);
      deleteDialog.shadowRoot.querySelector('ha-dialog').dispatchEvent(new Event('closed'));
    });
    assert.deepEqual(await page.evaluate(() => dialogCounts), { cancel: 2, confirm: 1 });
    console.log('PASS HA dialog footer, cancel, delete and dismissal callbacks');
    await fresh();
    await page.evaluate(() => mountCard({ home_screen: undefined }));
    await page.waitForSelector('button.schedule-tile');
    assert.equal(await page.locator('button.schedule-tile').count(), 4);
    assert.equal(await page.locator('button.room').count(), 0);
    await page.locator('button.schedule-tile').filter({ hasText: 'Living room' }).click();
    await page.getByLabel('Assigned rooms / devices').waitFor();
    assert.equal(await page.locator('wiser-schedule-edit-card .actions-wrapper').count(), 0);
    assert.equal(await page.getByRole('toolbar').getByRole('button', { name: 'edit', exact: true }).count(), 1);
    const headerBox = await page.locator('wiser-card-header').boundingBox();
    const toolbarBox = await page.getByRole('toolbar').boundingBox();
    assert.ok(
      toolbarBox.y >= headerBox.y && toolbarBox.y + toolbarBox.height <= headerBox.y + headerBox.height + 1,
      'toolbar sits in the top card header',
    );
    await page.getByLabel('Assigned rooms / devices').selectOption(['10', '11', '13']);
    assert.equal(await page.evaluate(() => fixture.assignments[11]), 2, 'selection is not applied early');
    await button('Apply assignments').click();
    await page.waitForFunction(
      () => fixture.assignments[11] === 1 && fixture.assignments[13] === 1 && fixture.assignments[12] === undefined,
    );
    await button('Apply assignments').isDisabled();
    await button('edit').click();
    await button('cancel').click();
    await button('back').click();
    await page.waitForSelector('button.schedule-tile');
    await page.evaluate(() => {
      fixture.devices = { lighting: [{ Id: 21, Name: 'Hall light' }], onoff: [{ Id: 22, Name: 'Desk plug' }] };
    });
    await page.locator('button.schedule-tile').filter({ hasText: 'Evening lights' }).click();
    await page.getByLabel('Assigned rooms / devices').waitFor();
    assert.equal(await page.locator('.device-assignment option').filter({ hasText: 'Hall light' }).count(), 1);
    assert.equal(await page.locator('.device-assignment option').filter({ hasText: 'Desk plug' }).count(), 0);
    await button('back').click();
    await page.waitForSelector('button.schedule-tile');
    await page.evaluate(() => mountCard({ home_screen: 'schedules', display_only: true }));
    await page.locator('button.schedule-tile').filter({ hasText: 'Living room' }).click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    assert.equal(await button('Apply assignments').count(), 0);
    assert.equal(await button('edit').count(), 0);
    assert.equal(await page.getByRole('toolbar').getByRole('button').count(), 1);
    await page.evaluate(() => {
      const card = mountCard({ home_screen: 'schedules', admin_only: true });
      card.hass = { ...makeHass(), user: { is_admin: false } };
    });
    await page.locator('button.schedule-tile').filter({ hasText: 'Living room' }).click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    assert.equal(await page.getByRole('toolbar').getByRole('button').count(), 1);
    assert.equal(await button('back').count(), 1);
    await fresh();
    await page.evaluate(() => {
      const editor = document.createElement('wiser-schedule-card-editor');
      editor.hass = makeHass();
      editor.setConfig({ type: 'custom:wiser-schedule-card', selected_schedule: 'Heating|1' });
      editor.addEventListener('config-changed', (event) => (window.lastConfig = event.detail.config));
      document.querySelector('#mount').append(editor);
    });
    assert.equal(await page.getByLabel('Title', { exact: true }).count(), 0);
    assert.equal(await page.getByLabel('Schedule', { exact: true }).count(), 0);
    assert.equal(await page.getByLabel('Layout', { exact: true }).count(), 0);
    await page.getByRole('radio', { name: 'Schedules', exact: true }).click();
    assert.equal(await page.evaluate(() => lastConfig.home_screen), 'schedules');
    assert.equal(await page.evaluate(() => lastConfig.selected_schedule), undefined);
    await page.getByRole('radio', { name: 'Devices', exact: true }).click();
    assert.equal(await page.evaluate(() => lastConfig.home_screen), 'devices');
    console.log(
      'PASS schedule-first home, multiple compatible assignments, return navigation, permissions and editor toggle',
    );
    await fresh();
    const duplicateLoad = await page.evaluate(async () => {
      const original = customElements.get('wiser-schedule-card');
      const header = customElements.get('wiser-card-header');
      await import('/card.js?duplicate=1');
      await import('/card.js?duplicate=2');
      mountCard({ home_screen: 'schedules' });
      return {
        sameCard: customElements.get('wiser-schedule-card') === original,
        sameHeader: customElements.get('wiser-card-header') === header,
        pickerEntries: window.customCards.filter((card) => card.type === 'wiser-schedule-card').length,
      };
    });
    assert.deepEqual(duplicateLoad, { sameCard: true, sameHeader: true, pickerEntries: 1 });
    await page.locator('button.schedule-tile').first().click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    console.log('PASS repeated resource URLs preserve registered elements and a single picker entry');
    await fresh();
    await page.evaluate(() => mountCard({ home_screen: 'schedules', hide_card_background: true }));
    await page.waitForSelector('button.schedule-tile');
    assert.equal(
      await page.locator('ha-card').evaluate((el) => getComputedStyle(el).backgroundColor),
      'rgba(0, 0, 0, 0)',
    );
    await page.locator('button.schedule-tile').first().click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    assert.equal(await page.locator('ha-card').evaluate((el) => el.style.background), 'transparent');
    await page.evaluate(() => mountCard({ hide_card_background: false }));
    await roomsReady();
    assert.equal(await page.locator('ha-card').evaluate((el) => el.style.background), '');
    assert.deepEqual(errors, [], 'no uncaught browser errors');
    console.log('PASS integration readiness and configuration editor');
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
