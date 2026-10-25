const { chromium } = require('playwright');
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const assert = require('node:assert/strict');

const readStoredZip = (buffer) => {
  const files = new Map();
  let offset = 0;
  while (offset + 30 <= buffer.length && buffer.readUInt32LE(offset) === 0x04034b50) {
    const size = buffer.readUInt32LE(offset + 18);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const contentsStart = nameStart + nameLength + extraLength;
    files.set(
      buffer.subarray(nameStart, nameStart + nameLength).toString('utf8'),
      buffer.subarray(contentsStart, contentsStart + size).toString('utf8'),
    );
    offset = contentsStart + size;
  }
  return files;
};

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
    const roomsReady = () => page.waitForSelector('button.overview-device');
    const checkCreateType = async (type) => {
      await button('Add Schedule').click();
      await page.getByText('Enter a name for the new schedule', { exact: true }).waitFor();
      assert.equal(await page.locator('wiser-schedule-add-card wiser-card-header').count(), 0);
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
      await button('save').waitFor();
      await button('cancel').waitFor();
      const editor = page.locator('wiser-schedule-edit-card');
      assert.equal(await editor.evaluate((el) => el.schedule.Name), 'Test ' + type);
      await button('cancel').click();
      const assigned = await page.evaluate(() =>
        fixture.calls.filter((c) => c.type === 'wiser/schedule/assign').at(-1),
      );
      const createdId = await editor.evaluate((el) => el.schedule.Id);
      assert.equal(assigned.schedule_id, createdId);
      assert.equal(await button('save').isDisabled(), true);
    };

    await fresh();
    await page.evaluate(() => mountCard());
    await roomsReady();
    assert.equal(await page.locator('button.overview-device').count(), 4);
    assert.equal(await button('Add Schedule').isDisabled(), true, 'device home keeps Add dimmed');
    assert.equal(await button('Manage schedules').count(), 0);
    assert.match(
      await page.locator('button.overview-device').filter({ hasText: 'Lounge' }).textContent(),
      /Living room/,
    );
    assert.match(
      await page.locator('button.overview-device').filter({ hasText: 'Spare bedroom' }).textContent(),
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
    await page.locator('button.overview-device').filter({ hasText: 'Lounge' }).focus();
    await page.keyboard.press('Enter');
    await page.getByLabel('Choose a schedule').waitFor();
    assert.equal(await button('Manage schedules').count(), 0, 'redundant calendar button removed');
    assert.equal(await button('save').isDisabled(), true);
    assert.equal(await page.locator('select option').filter({ hasText: 'Evening lights' }).count(), 0);
    await page.getByLabel('Choose a schedule').selectOption('2');
    assert.equal(
      await page.evaluate(() => fixture.calls.filter((c) => c.type === 'wiser/schedule/assign').length),
      0,
      'selection alone never assigns',
    );
    await button('save').click();
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
    assert.equal(await button('save').isDisabled(), true);
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
    const roomToolbar = page.locator('wiser-room-schedules .tools[role="toolbar"]');
    await roomToolbar.scrollIntoViewIfNeeded();
    const roomToolbarBeforeEdit = await roomToolbar.boundingBox();
    const undoButton = page.getByRole('button', { name: /^undo$/i });
    const redoButton = page.getByRole('button', { name: /^redo$/i });
    assert.equal(await undoButton.count(), 1, 'Undo is always present in the room toolbar');
    assert.equal(await redoButton.count(), 1, 'Redo is always present in the room toolbar');
    assert.equal(await undoButton.isDisabled(), true);
    assert.equal(await redoButton.isDisabled(), true);
    const requestedPeriod = page.locator('wiser-schedule-slot-editor [id="Tuesday|1"]');
    assert.ok(
      (await requestedPeriod.getAttribute('class')).includes('selectable'),
      'view periods indicate they can be edited',
    );
    await requestedPeriod.locator('.slotoverlay span').click();
    await page.waitForFunction(() => {
      const editor = document
        .querySelector('wiser-schedule-card')
        .shadowRoot.querySelector('wiser-room-schedules')
        ?.shadowRoot.querySelector('wiser-schedule-edit-card');
      const slots = editor?.shadowRoot.querySelector('wiser-schedule-slot-editor');
      return editor?.editMode && slots?._activeDay === 'Tuesday' && slots?._activeSlot === 1;
    });
    assert.equal(
      await page
        .locator('wiser-schedule-slot-editor [id="Tuesday|1"]')
        .getAttribute('class')
        .then((value) => value.includes('selected')),
      true,
      'clicking a view period opens the editor with that period selected',
    );
    assert.equal(await page.getByLabel('Choose a schedule').isDisabled(), true);
    assert.equal(await page.locator('wiser-room-schedules wiser-card-header').count(), 1);
    const editToolbarBox = await roomToolbar.boundingBox();
    assert.ok(Math.abs(editToolbarBox.x - roomToolbarBeforeEdit.x) < 2, 'toolbar keeps its horizontal position');
    assert.ok(Math.abs(editToolbarBox.y - roomToolbarBeforeEdit.y) < 2, 'toolbar keeps its vertical position');
    assert.ok(Math.abs(editToolbarBox.width - roomToolbarBeforeEdit.width) < 2, 'toolbar keeps its width');
    const undoBox = await undoButton.boundingBox();
    const redoBox = await redoButton.boundingBox();
    assert.ok(Math.abs(undoBox.y - redoBox.y) < 2, 'Undo and Redo share one row');
    assert.ok(redoBox.x > undoBox.x && redoBox.x - (undoBox.x + undoBox.width) <= 8, 'Undo and Redo stay together');
    const editBox = await button('edit').boundingBox();
    assert.ok(editBox.x > redoBox.x, 'Undo and Redo remain immediately before Edit');
    assert.equal(await undoButton.isDisabled(), true);
    assert.equal(await redoButton.isDisabled(), true);
    const addPeriodButton = roomToolbar.getByRole('button', { name: 'Add period', exact: true });
    const deletePeriodButton = roomToolbar.getByRole('button', { name: 'Delete period', exact: true });
    assert.equal(await page.getByRole('button', { name: 'Add period', exact: true }).count(), 1);
    assert.equal(await page.getByRole('button', { name: 'Delete period', exact: true }).count(), 1);
    await requestedPeriod.locator('.slotoverlay span').click();
    assert.equal(await addPeriodButton.isDisabled(), true, 'toolbar Add waits for a selected period');
    assert.equal(await deletePeriodButton.isDisabled(), true, 'toolbar Trash waits for a selected period');
    const selectedPeriodPanel = page.locator('wiser-schedule-slot-editor .selected-period');
    await selectedPeriodPanel.waitFor();
    assert.equal(await selectedPeriodPanel.getAttribute('aria-disabled'), 'true');
    const editorHeightWithoutSelection = (await page.locator('wiser-schedule-slot-editor').boundingBox()).height;
    await page.locator('wiser-schedule-slot-editor [slot="0"] .slotoverlay span').first().click();
    assert.equal(await selectedPeriodPanel.getAttribute('aria-disabled'), 'false');
    const editorHeightWithSelection = (await page.locator('wiser-schedule-slot-editor').boundingBox()).height;
    assert.ok(
      Math.abs(editorHeightWithSelection - editorHeightWithoutSelection) < 2,
      'selecting a period does not change the editor height',
    );
    assert.equal(await addPeriodButton.isEnabled(), true, 'toolbar Add controls periods while editing');
    assert.equal(await deletePeriodButton.isEnabled(), true, 'toolbar Trash controls periods while editing');
    const initialPeriodCount = await page
      .locator('wiser-schedule-slot-editor')
      .evaluate((el) => el.schedule.ScheduleData[0].slots.length);
    await addPeriodButton.click();
    assert.equal(
      await page.locator('wiser-schedule-slot-editor').evaluate((el) => el.schedule.ScheduleData[0].slots.length),
      initialPeriodCount + 1,
      'toolbar Add inserts a period',
    );
    await deletePeriodButton.click();
    assert.equal(
      await page.locator('wiser-schedule-slot-editor').evaluate((el) => el.schedule.ScheduleData[0].slots.length),
      initialPeriodCount,
      'toolbar Trash deletes the selected period',
    );
    await page.getByRole('slider', { name: 'Temperature' }).fill('21');
    assert.equal(await undoButton.isEnabled(), true);
    await roomToolbar.getByRole('button', { name: 'back', exact: true }).click();
    assert.equal(await page.getByLabel('Choose a schedule').isEnabled(), true, 'toolbar Back cancels editing');
    assert.deepEqual(
      await page.locator('wiser-schedule-edit-card').evaluate((el) => [el._undoHistory.length, el._redoHistory.length]),
      [0, 0],
      'Cancel clears edit history',
    );
    await button('edit').click();
    assert.equal(await undoButton.isDisabled(), true);
    assert.equal(await redoButton.isDisabled(), true);
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
    await undoButton.click();
    assert.deepEqual(
      await page
        .locator('wiser-schedule-slot-editor')
        .evaluate((el) => el.schedule.ScheduleData[0].slots.map((slot) => slot.Time)),
      ['06:00', '22:00'],
      'Undo restores the previous schedule state',
    );
    assert.equal(await redoButton.isEnabled(), true);
    await redoButton.click();
    assert.deepEqual(
      await page
        .locator('wiser-schedule-slot-editor')
        .evaluate((el) => el.schedule.ScheduleData[0].slots.map((slot) => slot.Time)),
      draggedTimes,
      'Redo reapplies the schedule state',
    );
    await page.locator('wiser-schedule-slot-editor [slot="0"] .slotoverlay span').first().click();
    const startHandle = page.locator('.handle:not(.end-handle) .time-handle').first();
    const startBox = await startHandle.boundingBox();
    await page.mouse.move(startBox.x + startBox.width / 2, startBox.y + startBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(startBox.x + startBox.width / 2 + 40, startBox.y + startBox.height / 2);
    await page.mouse.up();
    const movedStart = await page
      .locator('wiser-schedule-slot-editor')
      .evaluate((el) => el.schedule.ScheduleData[0].slots[0].Time);
    assert.notEqual(movedStart, '06:00', 'whole start handle moves the selected boundary');
    const beforeBlockDrag = await page
      .locator('wiser-schedule-slot-editor')
      .evaluate((el) => el.schedule.ScheduleData[0].slots.slice(0, 2).map((slot) => slot.Time));
    const selectedBlock = page.locator('.slot.selected.movable .slotoverlay').first();
    const selectedBlockBox = await selectedBlock.boundingBox();
    await page.mouse.move(
      selectedBlockBox.x + selectedBlockBox.width / 2,
      selectedBlockBox.y + selectedBlockBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      selectedBlockBox.x + selectedBlockBox.width / 2 + 50,
      selectedBlockBox.y + selectedBlockBox.height / 2,
    );
    await page.mouse.up();
    const afterBlockDrag = await page
      .locator('wiser-schedule-slot-editor')
      .evaluate((el) => el.schedule.ScheduleData[0].slots.slice(0, 2).map((slot) => slot.Time));
    const minutes = (value) => {
      const [hours, mins] = value.split(':').map(Number);
      return hours * 60 + mins;
    };
    const startDelta = minutes(afterBlockDrag[0]) - minutes(beforeBlockDrag[0]);
    const endDelta = minutes(afterBlockDrag[1]) - minutes(beforeBlockDrag[1]);
    assert.notEqual(startDelta, 0, 'dragging selected period moves its start');
    assert.equal(endDelta, startDelta, 'dragging selected period preserves its duration');
    const beforeDayCopy = await page.locator('wiser-schedule-slot-editor').evaluate((el) => ({
      source: structuredClone(el.schedule.ScheduleData[0].slots),
      start: el.schedule.ScheduleData[0].slots[0].Time,
      end: el.schedule.ScheduleData[0].slots[1].Time,
      setpoint: el.schedule.ScheduleData[0].slots[0].Setpoint,
    }));
    // Home Assistant can place the card inside a transformed view. A fixed
    // descendant then uses that view as its containing block instead of the
    // viewport, which used to offset the drag preview below the hovered row.
    await page.locator('wiser-schedule-edit-card').evaluate((el) => (el.style.transform = 'translateZ(0)'));
    const blockForCopy = await selectedBlock.boundingBox();
    const tuesdayRow = await page.locator('wiser-schedule-slot-editor .outer#Tuesday').boundingBox();
    await page.mouse.move(blockForCopy.x + blockForCopy.width / 2, blockForCopy.y + blockForCopy.height * 0.25);
    await page.mouse.down();
    await page.mouse.move(blockForCopy.x + blockForCopy.width / 2, tuesdayRow.y + tuesdayRow.height * 0.75);
    assert.equal(await page.locator('wiser-schedule-slot-editor .outer#Tuesday.drop-target').count(), 1);
    const dragGhost = page.locator('wiser-schedule-slot-editor .period-drag-ghost.valid');
    assert.equal(await dragGhost.count(), 1, 'cross-day drag displays a copy of the selected period');
    const dragGhostBox = await dragGhost.boundingBox();
    assert.ok(
      Math.abs(dragGhostBox.x + dragGhostBox.width / 2 - (blockForCopy.x + blockForCopy.width / 2)) < 2 &&
        Math.abs(dragGhostBox.y + dragGhostBox.height / 2 - (tuesdayRow.y + tuesdayRow.height / 2)) < 2,
      'dragged period copy aligns with the destination row',
    );
    await page.mouse.up();
    await page.locator('wiser-schedule-edit-card').evaluate((el) => (el.style.transform = ''));
    assert.equal(await page.locator('wiser-schedule-slot-editor .period-drag-ghost').count(), 0);
    const afterDayCopy = await page.locator('wiser-schedule-slot-editor').evaluate((el) => ({
      source: el.schedule.ScheduleData[0].slots,
      target: el.schedule.ScheduleData[1].slots,
    }));
    assert.deepEqual(afterDayCopy.source, beforeDayCopy.source, 'cross-day copy preserves the source period');
    assert.equal(
      afterDayCopy.target.find((slot) => slot.Time === beforeDayCopy.start)?.Setpoint,
      beforeDayCopy.setpoint,
      'cross-day copy adds the selected period to the target day',
    );
    assert.ok(
      afterDayCopy.target.some((slot) => slot.Time === beforeDayCopy.end),
      'cross-day copy restores the target schedule at the copied period end',
    );
    await button('save').click();
    await button('edit').waitFor();
    assert.deepEqual(
      await page.locator('wiser-schedule-edit-card').evaluate((el) => [el._undoHistory.length, el._redoHistory.length]),
      [0, 0],
      'Save clears edit history',
    );
    const savedSchedule = await page.evaluate(() => fixture.calls.find((c) => c.type === 'wiser/schedule/save'));
    assert.equal(savedSchedule.schedule_id, 2);
    assert.equal(Number(savedSchedule.schedule.ScheduleData[0].slots[0].Setpoint), Number(beforeDayCopy.setpoint));
    assert.equal(await page.getByLabel('Choose a schedule').isDisabled(), false);
    const downloadPromise = page.waitForEvent('download');
    await button('Export schedule').click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), 'Heating-Bedrooms.json');
    const exported = JSON.parse(await readFile(await download.path(), 'utf8'));
    assert.equal(exported.format, 'wiser-schedule');
    assert.equal(exported.schedule.Type, 'Heating');
    assert.equal(exported.schedule.Assignments, undefined);
    await page.locator('wiser-schedule-edit-card').evaluate((el) => {
      el.schedule.PassiveRange = true;
      el.schedule.PassiveRangeType = 'external';
      for (const day of el.schedule.ScheduleData)
        for (const slot of day.slots) slot.UpperSetpoint = Number(slot.Setpoint) + 2;
    });
    const rangeDownloadPromise = page.waitForEvent('download');
    await button('Export schedule').click();
    const rangeDownload = await rangeDownloadPromise;
    const exportedRange = JSON.parse(await readFile(await rangeDownload.path(), 'utf8'));
    assert.equal(exportedRange.version, 2);
    assert.equal(exportedRange.schedule.PassiveRange, true);
    assert.equal(exportedRange.schedule.PassiveControl, undefined);
    assert.equal(
      exportedRange.schedule.ScheduleData[0].slots[0].UpperSetpoint,
      Number(exportedRange.schedule.ScheduleData[0].slots[0].Setpoint) + 2,
      'Passive Mode range exports preserve upper temperatures',
    );
    await page.locator('wiser-schedule-edit-card').evaluate((el) => {
      delete el.schedule.PassiveRange;
      delete el.schedule.PassiveRangeType;
      for (const day of el.schedule.ScheduleData) for (const slot of day.slots) delete slot.UpperSetpoint;
    });
    const saveCount = await page.evaluate(() => fixture.calls.filter((c) => c.type === 'wiser/schedule/save').length);
    exported.schedule.Name = 'File name must not overwrite';
    exported.schedule.ScheduleData[0].slots[0].Setpoint = '23';
    await page.locator('input.import-file').setInputFiles({
      name: 'schedule.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(exported)),
    });
    await button('save').waitFor();
    await page.waitForFunction(
      () =>
        document
          .querySelector('wiser-schedule-card')
          .shadowRoot.querySelector('wiser-room-schedules')
          ?.shadowRoot.querySelector('wiser-schedule-edit-card')?.editMode,
    );
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
    await button('cancel').click();
    await page.waitForFunction(
      () =>
        !document
          .querySelector('wiser-schedule-card')
          .shadowRoot.querySelector('wiser-room-schedules')
          ?.shadowRoot.querySelector('wiser-schedule-edit-card')?.editMode,
    );
    const passiveFile = structuredClone(exported);
    passiveFile.version = 2;
    passiveFile.schedule.PassiveRange = true;
    passiveFile.schedule.PassiveControl = true;
    for (const day of passiveFile.schedule.ScheduleData) {
      for (const slot of day.slots) {
        slot.UpperSetpoint = Number(slot.Setpoint) + 2;
        slot.PassiveScheduled = true;
        slot.PassiveMode = true;
        slot.PassiveStrategy = 'modulating';
      }
    }
    const unscheduledPassiveSlot = passiveFile.schedule.ScheduleData[1].slots[0];
    unscheduledPassiveSlot.PassiveScheduled = false;
    delete unscheduledPassiveSlot.UpperSetpoint;
    delete unscheduledPassiveSlot.PassiveMode;
    delete unscheduledPassiveSlot.PassiveStrategy;
    await page.locator('input.import-file').setInputFiles({
      name: 'passive-schedule.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(passiveFile)),
    });
    await page.waitForFunction(
      () =>
        document
          .querySelector('wiser-schedule-card')
          .shadowRoot.querySelector('wiser-room-schedules')
          ?.shadowRoot.querySelector('wiser-schedule-edit-card')?._tempSchedule?.PassiveControl === true,
    );
    assert.deepEqual(
      await page.locator('wiser-schedule-edit-card').evaluate((el) => ({
        enabled: el._tempSchedule.PassiveControl,
        rangeType: el._tempSchedule.PassiveRangeType,
        slot: el._tempSchedule.ScheduleData[0].slots[0],
        unscheduledSlot: el._tempSchedule.ScheduleData[1].slots[0],
      })),
      {
        enabled: true,
        rangeType: 'scheduled',
        slot: {
          Time: passiveFile.schedule.ScheduleData[0].slots[0].Time,
          Setpoint: String(passiveFile.schedule.ScheduleData[0].slots[0].Setpoint),
          UpperSetpoint: passiveFile.schedule.ScheduleData[0].slots[0].UpperSetpoint,
          PassiveScheduled: true,
          PassiveMode: true,
          PassiveStrategy: 'modulating',
          SpecialTime: passiveFile.schedule.ScheduleData[0].slots[0].SpecialTime,
        },
        unscheduledSlot: {
          Time: unscheduledPassiveSlot.Time,
          Setpoint: String(unscheduledPassiveSlot.Setpoint),
          PassiveScheduled: false,
          SpecialTime: unscheduledPassiveSlot.SpecialTime,
        },
      },
      'v2 import preserves scheduled Passive mode controls',
    );
    await button('cancel').click();
    await page.waitForFunction(
      () =>
        !document
          .querySelector('wiser-schedule-card')
          .shadowRoot.querySelector('wiser-room-schedules')
          ?.shadowRoot.querySelector('wiser-schedule-edit-card')?.editMode,
    );
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
    assert.equal(await page.locator('wiser-schedule-edit-card').evaluate((el) => el.editMode), false);
    assert.equal(await button('save').isDisabled(), true);
    console.log('PASS JSON export, import draft, preserved identity and incompatible type rejection');
    await button('edit').click();
    await page.getByRole('textbox', { name: 'Schedule Name', exact: true }).waitFor();
    await page.locator('wiser-schedule-slot-editor').waitFor();
    assert.equal(await button('Rename').count(), 0);
    assert.equal(await page.getByRole('textbox', { name: 'Schedule Name' }).inputValue(), 'Bedrooms');
    await page.getByRole('textbox', { name: 'Schedule Name' }).fill('Renamed schedule');
    await button('save').click();
    await button('edit').waitFor();
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
    await button('back').click();
    await roomsReady();
    assert.match(await page.locator('button.overview-device').filter({ hasText: 'Lounge' }).textContent(), /Bedrooms/);
    if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/wiser-desktop.png` });
    await page.locator('button.overview-device').filter({ hasText: 'Lounge' }).click();
    await page.getByLabel('Choose a schedule').waitFor();
    await page.waitForSelector('wiser-schedule-slot-editor');
    if (process.env.SCREENSHOT_DIR)
      await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/wiser-room-detail.png` });
    console.log('PASS overview navigation and disabled home Add, explicit assignment, shared rooms and return height');

    await page.getByLabel('Choose a schedule').selectOption('3');
    await page.evaluate(() => (fixture.failAssign = true));
    await button('save').click();
    await page.getByRole('alert').waitFor();
    assert.equal(await page.evaluate(() => fixture.assignments[10]), 2, 'failed assignment preserves current schedule');
    await page.evaluate(() => (fixture.failAssign = false));
    await button('Try again').click();
    await button('save').click();
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
    await page.getByRole('heading', { name: 'Lighting', exact: true }).waitFor();
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
          const tile = [...room.shadowRoot.querySelectorAll('button.overview-device')].find((el) =>
            el.textContent.includes('Desk plug'),
          );
          return tile.closest('.device-overview').querySelector('ha-icon').icon === expected;
        },
        icon ? `mdi:power-socket-${icon}` : 'mdi:power-plug',
      );
    }
    console.log('PASS country-specific plug icons and unknown-country fallback');

    await page.getByRole('heading', { name: 'Hot water', exact: true }).waitFor();
    assert.equal(await page.locator('.tools').count(), 0);
    await page.locator('button.overview-device').filter({ hasText: 'Hall light' }).click();
    await button('edit').waitFor();
    assert.equal(await page.locator('select').count(), 1, 'single schedule still permits unassignment');
    await checkCreateType('Lighting');
    await page.waitForSelector('wiser-schedule-slot-editor');
    await button('back').click();
    await page.locator('button.overview-device').filter({ hasText: 'Desk plug' }).click();
    await button('Add Schedule').waitFor();
    assert.equal(await page.locator('select').count(), 1);
    await checkCreateType('OnOff');
    await button('back').click();
    await page.locator('button.overview-device').filter({ hasText: 'Lounge blind' }).click();
    await button('Add Schedule').waitFor();
    assert.equal(await page.locator('select').count(), 1);
    await checkCreateType('Shutters');
    await button('back').click();
    await page.locator('button.overview-device').filter({ hasText: 'Hot water' }).click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    assert.equal(await page.locator('select').count(), 0);
    assert.equal(await button('delete').isDisabled(), true);
    await button('back').click();
    if (process.env.SCREENSHOT_DIR)
      await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/wiser-home-sections.png` });

    await fresh();
    await page.evaluate(() => {
      fixture.schedules.push(
        { Id: 1000, Type: 'OnOff', SubType: 'HotWater', Name: 'Wiser Hot Water', Assignments: 0 },
        { Id: -1000, Type: 'HotWater', Name: 'OpenTherm Hot Water', Assignments: 1 },
      );
      mountCard();
    });
    await roomsReady();
    await page.getByRole('heading', { name: 'Hot water', exact: true }).waitFor();
    assert.equal(
      await page.locator('button.overview-device').filter({ hasText: 'Hot Water' }).count(),
      2,
      'native and OpenTherm hot-water controls both remain available',
    );
    assert.equal(
      await page.locator('button.overview-device').filter({ hasText: 'OpenTherm Hot Water' }).count(),
      1,
      'OpenTherm hot-water control has a distinct Overview label',
    );
    await page.locator('button.overview-device').filter({ hasText: 'OpenTherm Hot Water' }).click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    assert.equal(await page.locator('select').count(), 0);
    assert.equal(await button('delete').isDisabled(), true);
    assert.equal(await page.locator('wiser-schedule-edit-card').evaluate((el) => el.schedule.Id), -1000);
    console.log('PASS OpenTherm hot-water Overview appears only when its fixed schedule is exposed');

    await fresh();
    await page.evaluate(() => mountCard());
    await roomsReady();
    assert.equal(await page.getByRole('heading', { name: 'Lighting', exact: true }).count(), 0);
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
    await page.locator('button.overview-device').filter({ hasText: 'Spare bedroom' }).click();
    await page.getByLabel('Choose a schedule').waitFor();
    assert.equal(await page.locator('select option').filter({ hasText: 'Hot water' }).count(), 0);
    await page.getByLabel('Choose a schedule').selectOption('1');
    await button('save').click();
    await page.getByText('Schedule assigned.', { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => fixture.assignments[13]), 1);

    await fresh();
    await page.evaluate(() => mountCard({ display_only: true, view_type: 'list' }));
    await roomsReady();
    await page.locator('button.overview-device').first().click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    assert.equal(await button('Manage schedules').count(), 0);
    assert.equal(await button('save').count(), 0);
    assert.equal(await button('Add Schedule').count(), 0);
    assert.equal(await page.locator('select').count(), 0);
    assert.equal(await button('edit').count(), 0);
    await page.waitForSelector('wiser-schedule-slot-editor');
    const readOnlyPeriod = page.locator('wiser-schedule-slot-editor [slot="0"]').first();
    assert.equal((await readOnlyPeriod.getAttribute('class')).includes('selectable'), false);
    await readOnlyPeriod.click();
    assert.equal(await page.locator('wiser-schedule-edit-card').evaluate((el) => el.editMode), false);
    await fresh();
    await page.evaluate(() => {
      const card = mountCard({ admin_only: true });
      card.hass = { ...makeHass(), user: { is_admin: false } };
    });
    await roomsReady();
    await page.locator('button.overview-device').first().click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    assert.equal(await button('Manage schedules').count(), 0);
    assert.equal(await button('save').count(), 0);
    assert.equal(await page.locator('.tools button').count(), 1, 'non-admin device toolbar only has Back');
    assert.equal(await button('Export schedule').count(), 0);
    console.log('PASS unassigned rooms, compatible schedule filter, read-only and admin restrictions');
    await fresh();
    await page.evaluate(() => {
      fixture.schedules = fixture.schedules.filter((s) => s.Id === 1);
      mountCard();
    });
    await roomsReady();
    await page.locator('button.overview-device').filter({ hasText: 'Spare bedroom' }).click();
    await page.getByLabel('Choose a schedule').waitFor();
    assert.equal(await page.locator('select').count(), 1);
    assert.equal(await page.evaluate(() => fixture.assignments[13]), undefined, 'preselection does not assign');
    await button('save').click();
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
    await button('save').click();
    await page.getByText('Schedule unassigned.', { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => fixture.assignments[13]), undefined);
    assert.equal(await page.evaluate(() => fixture.schedules.length), 1, 'schedule is preserved');
    assert.equal(
      await page.evaluate(() => fixture.calls.filter((c) => c.type === 'wiser/schedule/assign').at(-1).remove),
      true,
    );
    await page.getByLabel('Choose a schedule').selectOption('1');
    await button('save').click();
    await page.getByText('Schedule assigned.', { exact: true }).waitFor();

    await fresh();
    await page.evaluate(() => {
      fixture.delay = 150;
      fixture.schedules = [];
      mountCard();
    });
    await page.getByText('Loading schedules…').waitFor();
    await roomsReady();
    await page.locator('button.overview-device').first().click();
    await button('Add Schedule').waitFor();
    assert.equal(await button('save').isDisabled(), true);
    await button('Add Schedule').click();
    await page.getByRole('textbox', { name: 'Schedule Name' }).waitFor();
    await button('cancel').click();
    await button('Add Schedule').waitFor();
    assert.equal(await page.locator('select').count(), 0, 'no schedules hides picker');
    await checkCreateType('Heating');
    assert.equal(await button('save').isDisabled(), true);
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
    await button('edit').click();
    await page.getByRole('textbox', { name: 'Schedule Name', exact: true }).waitFor();
    console.log('PASS pinned schedules and rename navigation');

    await page.locator('wiser-schedule-edit-card').evaluate((el) => {
      const slots = Array.from({ length: 9 }, (_, index) => ({
        Time: `${String(index * 2).padStart(2, '0')}:00`,
        Setpoint: String(18 + (index % 5) * 0.5),
        SpecialTime: '',
      }));
      el._tempSchedule = {
        ...el._tempSchedule,
        ScheduleData: el._tempSchedule.ScheduleData.map((day) => ({
          ...day,
          slots: structuredClone(slots),
        })),
      };
      el.requestUpdate();
    });
    const savesBeforeLimitCheck = await page.evaluate(
      () => fixture.calls.filter((call) => call.type === 'wiser/schedule/save').length,
    );
    await button('save').click();
    await page.getByRole('alert').filter({ hasText: 'has too many periods' }).waitFor();
    assert.equal(
      await page.evaluate(() => fixture.calls.filter((call) => call.type === 'wiser/schedule/save').length),
      savesBeforeLimitCheck,
      'a schedule over the Wiser daily limit is not sent to the hub',
    );
    await page.locator('wiser-schedule-edit-card').evaluate((el) => {
      el._tempSchedule = {
        ...el._tempSchedule,
        ScheduleData: el._tempSchedule.ScheduleData.map((day) => ({
          ...day,
          slots: day.slots.slice(0, 8),
        })),
      };
      el.requestUpdate();
    });
    assert.equal(
      await page.locator('wiser-schedule-slot-editor').evaluate((el) => {
        el._activeDay = 'Monday';
        el._activeSlot = 0;
        return el.canAddPeriod;
      }),
      false,
      'Add period is unavailable at the Wiser daily limit',
    );
    await page.evaluate(() => (fixture.delay = 700));
    await button('save').click();
    const savingStatus = page.getByRole('status').filter({ hasText: 'Saving schedule…' });
    await savingStatus.waitFor();
    assert.equal(await page.getByRole('textbox', { name: 'Schedule Name', exact: true }).count(), 1);
    assert.equal(await page.locator('wiser-schedule-slot-editor').count(), 1);
    assert.equal(
      await page
        .locator('wiser-schedule-edit-card .tools button')
        .evaluateAll((buttons) => buttons.every((item) => item.disabled)),
      true,
      'schedule toolbar is disabled while saving is pending',
    );
    const largeSave = await page.evaluate(() =>
      fixture.calls.filter((call) => call.type === 'wiser/schedule/save').at(-1),
    );
    assert.equal(
      largeSave.schedule.ScheduleData.reduce((total, day) => total + day.slots.length, 0),
      56,
      'large schedule is sent with every slot',
    );
    await page.evaluate(() => (fixture.delay = 0));
    await savingStatus.waitFor({ state: 'detached' });
    console.log('PASS large schedule saving keeps its context visible and reports progress');

    await fresh();
    await page.evaluate(() => {
      document.addEventListener(
        'show-dialog',
        async (event) => {
          const dialog = document.createElement(event.detail.dialogTag);
          dialog.hass = makeHass();
          document.body.append(dialog);
          await dialog.showDialog(event.detail.dialogParams);
        },
        { once: true },
      );
      mountCard({ selected_schedule: 'Heating|1' });
    });
    await page.waitForSelector('wiser-schedule-slot-editor');
    await button('delete').click();
    const deleteDialog = page.locator('wiser-dialog-delete-confirm');
    await deleteDialog.getByRole('button', { name: 'delete', exact: true }).waitFor();
    await page.evaluate(() => (fixture.delay = 700));
    await deleteDialog.getByRole('button', { name: 'delete', exact: true }).click();
    const deletingStatus = page.getByRole('status').filter({ hasText: 'Deleting schedule…' });
    await deletingStatus.waitFor();
    assert.equal(await page.getByRole('heading', { name: 'Living room', exact: true }).count(), 1);
    assert.equal(
      await page
        .locator('wiser-schedule-edit-card .tools button')
        .evaluateAll((buttons) => buttons.every((item) => item.disabled)),
      true,
      'schedule toolbar is disabled while deletion is pending',
    );
    const loadsBeforeDeleteUpdate = await page.evaluate(
      () => fixture.calls.filter((call) => call.type === 'wiser/schedule/id').length,
    );
    await page.evaluate(() => fixture.notify({ hub: 'hub-one', event: 'wiser_updated' }));
    await page.waitForTimeout(50);
    assert.equal(
      await page.evaluate(() => fixture.calls.filter((call) => call.type === 'wiser/schedule/id').length),
      loadsBeforeDeleteUpdate,
      'integration updates do not replace the schedule while deletion is pending',
    );
    await roomsReady();
    assert.equal(
      await page.evaluate(() => fixture.calls.filter((call) => call.type === 'wiser/schedule/delete').length),
      1,
    );
    await page.evaluate(() => (fixture.delay = 0));
    console.log('PASS schedule deletion keeps its context visible and reports progress');

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
        card.setConfig({ type: 'custom:wiser-schedule-card', hub: 'hub-one', home_screen: 'overview' });
        card.hass = makeHass();
        mount.append(card);
      }, nested);
      await roomsReady();
      const bottomScroll = await page.evaluate(() => {
        fixture.delay = 250;
        testScroller.scrollTop = testScroller.scrollHeight;
        return testScroller.scrollTop;
      });
      await page
        .locator('button.overview-device')
        .first()
        .evaluate((button) => button.click());
      await page.waitForTimeout(100);
      assert.equal(
        await page.locator('wiser-room-schedules wiser-card-header').count(),
        1,
        'room navigation keeps the card visible while its timeline loads',
      );
      assert.notEqual(
        await page
          .locator('wiser-schedule-card')
          .evaluate((el) => el.style.getPropertyValue('--wiser-navigation-min-height')),
        '',
        'navigation preserves the outgoing card height',
      );
      assert.equal(
        await page.evaluate(() => testScroller.scrollTop),
        bottomScroll,
        'loading does not move the dashboard',
      );
      await page.getByLabel('Choose a schedule').waitFor();
      assert.equal(
        await page.evaluate(() => testScroller.scrollTop),
        bottomScroll,
        'loaded view does not move the dashboard',
      );
      const detailHeight = (await page.locator('wiser-schedule-card').boundingBox()).height;
      await button('back').evaluate((backButton) => backButton.click());
      await roomsReady();
      assert.ok(
        (await page.locator('wiser-schedule-card').boundingBox()).height >= detailHeight,
        'returning to the main card retains the expanded navigation height',
      );
      assert.equal(
        await page.evaluate(() => testScroller.scrollTop),
        bottomScroll,
        'returning to the main card does not move the dashboard',
      );
    }
    console.log('PASS document and shadow dashboards preserve card height and scroll through navigation');

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
    await page.locator('button.overview-device').first().click();
    await page.getByLabel('Choose a schedule').waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'toolbar fits mobile');
    const mobileToolTops = await page
      .locator('.tools button')
      .evaluateAll((buttons) => buttons.map((button) => Math.round(button.getBoundingClientRect().top)));
    assert.equal(new Set(mobileToolTops).size, 1, 'all mobile toolbar buttons stay on one row');
    await page.waitForSelector('wiser-schedule-slot-editor');
    if (process.env.SCREENSHOT_DIR)
      await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/wiser-room-mobile.png`, fullPage: true });
    console.log('PASS mobile overview and toolbar');

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
    const exportAllButton = button('Export all schedules');
    const addScheduleButton = button('Add Schedule');
    const exportAllBox = await exportAllButton.boundingBox();
    const addScheduleBox = await addScheduleButton.boundingBox();
    assert.ok(exportAllBox.x < addScheduleBox.x, 'Export all sits immediately before Add');
    await page.evaluate(() => (fixture.specialExport = true));
    const allSchedulesDownload = page.waitForEvent('download');
    await exportAllButton.click();
    const schedulesZip = await allSchedulesDownload;
    assert.equal(schedulesZip.suggestedFilename(), 'hub-one-schedules.zip');
    const zippedSchedules = readStoredZip(await readFile(await schedulesZip.path()));
    assert.equal(zippedSchedules.size, 4);
    assert.deepEqual(
      [...zippedSchedules.keys()],
      ['Heating-Bedrooms.json', 'Lighting-Evening_lights.json', 'Heating-Home_office.json', 'Heating-Living_room.json'],
    );
    for (const contents of zippedSchedules.values()) {
      const exported = JSON.parse(contents);
      assert.equal(exported.format, 'wiser-schedule');
      assert.equal(exported.version, 1);
      assert.equal(exported.schedule.Assignments, undefined);
      assert.equal(exported.schedule.ScheduleData.length, 7);
    }
    const specialSchedule = JSON.parse(zippedSchedules.get('Lighting-Evening_lights.json'));
    assert.deepEqual(specialSchedule.schedule.ScheduleData[0].slots[0], {
      Time: 'Sunrise',
      Setpoint: '20',
      SpecialTime: 'Sunrise',
    });
    assert.deepEqual(specialSchedule.schedule.ScheduleData[0].slots[1], {
      Time: 'Sunset',
      Setpoint: '16',
      SpecialTime: 'Sunset',
    });
    await page.evaluate(() => (fixture.specialExport = false));
    specialSchedule.schedule.ScheduleData[0].slots[0].Time = '06:00';
    await page.locator('button.schedule-tile').filter({ hasText: 'Evening lights' }).click();
    await page.getByLabel('Assigned rooms / devices').waitFor();
    await page.locator('input.import-file').setInputFiles({
      name: 'special-time.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(specialSchedule)),
    });
    await page.waitForFunction(
      () =>
        document.querySelector('wiser-schedule-card').shadowRoot.querySelector('wiser-schedule-edit-card')?.editMode,
    );
    assert.deepEqual(
      await page.locator('wiser-schedule-edit-card').evaluate((el) => {
        const slot = el._tempSchedule.ScheduleData[0].slots[0];
        return { Time: slot.Time, SpecialTime: slot.SpecialTime };
      }),
      { Time: '06:00', SpecialTime: 'Sunrise' },
      'import accepts SpecialTime when Time contains its resolved clock time',
    );
    await button('cancel').click();
    await button('back').click();
    await page.waitForSelector('button.schedule-tile');
    assert.equal(await page.locator('button.schedule-tile').count(), 4);
    assert.equal(await page.locator('button.overview-device').count(), 0);
    await page.locator('button.schedule-tile').filter({ hasText: 'Living room' }).click();
    await page.getByLabel('Assigned rooms / devices').waitFor();
    assert.equal(await page.locator('wiser-schedule-edit-card .actions-wrapper').count(), 0);
    assert.equal(await page.getByRole('toolbar').getByRole('button', { name: 'edit', exact: true }).count(), 1);
    const toolbarLabels = await page
      .getByRole('toolbar')
      .getByRole('button')
      .evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-label')?.toLowerCase()));
    assert.ok(toolbarLabels.indexOf('undo') < toolbarLabels.indexOf('edit'));
    assert.equal(toolbarLabels.indexOf('redo'), toolbarLabels.indexOf('undo') + 1);
    const headerBox = await page.locator('wiser-card-header').boundingBox();
    const titleBox = await page.getByRole('heading', { name: 'Living room', exact: true }).boundingBox();
    const toolbarBox = await page.getByRole('toolbar').boundingBox();
    assert.ok(
      toolbarBox.y >= headerBox.y && toolbarBox.y + toolbarBox.height <= headerBox.y + headerBox.height + 1,
      'toolbar sits in the top card header',
    );
    assert.ok(
      titleBox.y >= headerBox.y && titleBox.y + titleBox.height <= headerBox.y + headerBox.height + 1,
      'schedule title shares the top card header with its toolbar',
    );
    await page.getByLabel('Assigned rooms / devices').selectOption(['10', '11', '13']);
    assert.equal(await page.evaluate(() => fixture.assignments[11]), 2, 'selection is not applied early');
    await button('save').click();
    await page.waitForFunction(
      () => fixture.assignments[11] === 1 && fixture.assignments[13] === 1 && fixture.assignments[12] === undefined,
    );
    await button('save').isDisabled();
    const directAssignmentBox = await page.locator('.device-assignment').boundingBox();
    const directTimelineBox = await page.locator('wiser-schedule-slot-editor').boundingBox();
    await button('edit').click();
    const directEditToolbarBox = await page.getByRole('toolbar').boundingBox();
    assert.ok(Math.abs(directEditToolbarBox.x - toolbarBox.x) < 2, 'standalone toolbar keeps its horizontal position');
    assert.ok(Math.abs(directEditToolbarBox.y - toolbarBox.y) < 2, 'standalone toolbar keeps its vertical position');
    assert.ok(Math.abs(directEditToolbarBox.width - toolbarBox.width) < 2, 'standalone toolbar keeps its width');
    assert.equal(
      await page.getByRole('toolbar').getByRole('button', { name: 'Add period', exact: true }).count(),
      1,
      'standalone editor uses toolbar Add period',
    );
    assert.equal(
      await page.getByRole('button', { name: 'Delete period', exact: true }).count(),
      1,
      'standalone editor uses only the toolbar Delete period action',
    );
    assert.equal(
      await page.locator('.device-assignment').count(),
      1,
      'assignment controls remain visible while editing',
    );
    assert.equal(
      await page.getByLabel('Assigned rooms / devices').isDisabled(),
      true,
      'assignment controls are dimmed and disabled while editing',
    );
    const editingAssignmentBox = await page.locator('.device-assignment').boundingBox();
    const editingTimelineBox = await page.locator('wiser-schedule-slot-editor').boundingBox();
    assert.ok(Math.abs(editingAssignmentBox.y - directAssignmentBox.y) < 2, 'assignment section keeps its position');
    assert.ok(Math.abs(editingTimelineBox.y - directTimelineBox.y) < 2, 'timeline does not jump when editing starts');
    const directSelectedPeriod = page.locator('wiser-schedule-slot-editor .selected-period');
    await directSelectedPeriod.waitFor();
    assert.equal(await directSelectedPeriod.getAttribute('aria-disabled'), 'true');
    const directHeightWithoutSelection = (await page.locator('wiser-schedule-slot-editor').boundingBox()).height;
    await page.locator('wiser-schedule-slot-editor [slot="0"] .slotoverlay span').first().click();
    assert.equal(await directSelectedPeriod.getAttribute('aria-disabled'), 'false');
    const directHeightWithSelection = (await page.locator('wiser-schedule-slot-editor').boundingBox()).height;
    assert.ok(
      Math.abs(directHeightWithSelection - directHeightWithoutSelection) < 2,
      'standalone period selection does not change the editor height',
    );
    await page.getByRole('toolbar').getByRole('button', { name: 'back', exact: true }).click();
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
    assert.equal(await button('save').count(), 0);
    assert.equal(await button('edit').count(), 0);
    assert.equal(await page.getByRole('toolbar').getByRole('button').count(), 3);
    assert.equal(await page.getByRole('button', { name: /^undo$/i }).isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: /^redo$/i }).isDisabled(), true);
    await page.evaluate(() => {
      const card = mountCard({ home_screen: 'schedules', admin_only: true });
      card.hass = { ...makeHass(), user: { is_admin: false } };
    });
    await page.locator('button.schedule-tile').filter({ hasText: 'Living room' }).click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    assert.equal(await page.getByRole('toolbar').getByRole('button').count(), 3);
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
    assert.equal(await page.getByRole('radio', { name: 'Hide', exact: true }).count(), 0);
    assert.equal(await page.evaluate(() => lastConfig.selected_schedule), undefined);
    await page.getByRole('radio', { name: 'Overview', exact: true }).click();
    assert.equal(await page.evaluate(() => lastConfig.home_screen), 'overview');
    await page.getByRole('radio', { name: 'Hide', exact: true }).click();
    assert.equal(await page.evaluate(() => lastConfig.overview_details), false);
    await page.getByRole('radio', { name: 'Show', exact: true }).click();
    assert.equal(await page.evaluate(() => lastConfig.overview_details), true);
    assert.equal(await page.getByRole('radio', { name: 'Devices', exact: true }).count(), 0);
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
    await page.evaluate(() => mountCard({ home_screen: 'schedules' }));
    await button('Overview').click();
    await page.waitForSelector('.device-overview');
    assert.equal(await button('Add Schedule').isDisabled(), true);
    const overviewDevice = page.locator('.device-overview').filter({ hasText: 'Living room' }).first();
    assert.ok((await overviewDevice.innerText()).includes('Next scheduled setting'));
    assert.ok((await overviewDevice.innerText()).includes('°C'));
    assert.ok(
      (await page.locator('.device-overview').filter({ hasText: 'Spare bedroom' }).innerText()).includes(
        'No schedule assigned',
      ),
    );
    await overviewDevice.locator('.overview-device').click();
    await page.waitForSelector('wiser-schedule-slot-editor');
    await button('back').click();
    await page.waitForSelector('.device-overview');
    await button('Schedules').click();
    await page.waitForSelector('button.schedule-tile');
    await page.setViewportSize({ width: 360, height: 850 });
    await button('Overview').click();
    await page.waitForSelector('.device-overview');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await page.evaluate(() => mountCard({ home_screen: 'devices', overview_details: false }));
    await page.waitForSelector('.device-overview');
    assert.equal(await page.locator('.device-overview dl:visible').count(), 0);
    const expandable = page
      .locator('.device-overview')
      .filter({ has: page.locator('.device-details') })
      .first();
    await expandable.locator('.details-toggle').click();
    assert.equal(await expandable.locator('dl').isVisible(), true);
    assert.equal(await page.locator('.device-overview dl:visible').count(), 1);
    await page.evaluate(() => window.dispatchEvent(new Event('resize')));
    await expandable.locator('.details-toggle').focus();
    await page.keyboard.press('Enter');
    assert.equal(await expandable.locator('dl').isVisible(), false);
    await button('Overview').click();
    assert.equal(await page.locator('.device-overview .device-details[hidden]').count(), 0);
    await button('Overview').click();
    assert.equal(await page.locator('.device-overview dl:visible').count(), 0);
    await expandable.locator('.details-toggle').click();
    await button('Overview').click();
    assert.equal(await page.locator('.device-overview .device-details[hidden]').count(), 0);

    assert.ok((await page.locator('.device-overview').first().innerText()).length > 0);
    await page.evaluate(() => mountCard({ home_screen: 'schedules', overview_details: false }));
    await button('Overview').click();
    await page.waitForSelector('.device-overview dl');
    await page.evaluate(() => mountCard({ home_screen: 'overview', overview_details: true }));
    await page.waitForSelector('.device-overview dl');
    await button('Overview').click();
    assert.equal(await page.locator('.device-overview dl:visible').count(), 0);
    await button('Overview').click();
    assert.equal(await page.locator('.device-overview .device-details[hidden]').count(), 0);
    console.log('PASS overview details, unassigned devices, navigation round trip and mobile layout');

    await fresh();
    await page.evaluate(() => {
      const editor = document.createElement('wiser-schedule-card-editor');
      const hass = makeHass();
      hass.locale = { ...hass.locale, language: 'fr-CA' };
      hass.localize = (key) =>
        ({ 'panel.states': 'HA Vue générale', 'ui.common.show': 'HA Afficher', 'ui.common.hide': 'HA Masquer' })[key] ||
        '';
      editor.hass = hass;
      editor.setConfig({ type: 'custom:wiser-schedule-card', home_screen: 'overview' });
      document.querySelector('#mount').append(editor);
    });
    await page.getByRole('radio', { name: 'HA Vue générale', exact: true }).waitFor();
    await page.getByRole('radio', { name: 'HA Afficher', exact: true }).waitFor();
    await page.getByRole('radio', { name: 'HA Masquer', exact: true }).waitFor();
    await page.getByText('Autorisations', { exact: true }).waitFor();

    await fresh();
    await page.evaluate(() => {
      const editor = document.createElement('wiser-schedule-card-editor');
      const hass = makeHass();
      hass.locale = { ...hass.locale, language: 'hu-HU' };
      editor.hass = hass;
      editor.setConfig({ type: 'custom:wiser-schedule-card', home_screen: 'overview' });
      document.querySelector('#mount').append(editor);
    });
    await page.getByText('Jogosultságok', { exact: true }).waitFor();
    await page.getByText('Téma színeinek használata', { exact: true }).waitFor();
    console.log('PASS native HA labels and regional-language selection for Wiser translations');
    await fresh();
    await page.evaluate(() => {
      fixture.climateRegistry = [
        { entity_id: 'climate.renamed', platform: 'wiser', device_id: 'room-device' },
        {
          entity_id: 'select.renamed_passive_mode_strategy',
          platform: 'wiser',
          device_id: 'room-device',
          translation_key: 'passive_mode_strategy',
        },
        { entity_id: 'climate.other_hub', platform: 'wiser', device_id: 'foreign-room' },
        {
          entity_id: 'select.foreign_passive_mode_strategy',
          platform: 'wiser',
          device_id: 'foreign-room',
          translation_key: 'passive_mode_strategy',
        },
      ];
      fixture.climateDevices = [
        { id: 'room-device', identifiers: [], via_device_id: 'hub-device' },
        { id: 'foreign-room', identifiers: [], via_device_id: 'other-hub' },
      ];
      const card = mountCard({ home_screen: 'overview' });
      const hass = makeHass();
      hass.states['climate.renamed'] = {
        entity_id: 'climate.renamed',
        state: 'auto',
        attributes: {
          name: fixture.rooms[0].Name,
          hvac_modes: ['auto', 'heat', 'off'],
          target_temperature_origin: 'FromSchedule',
          is_heating: false,
          is_override: false,
          is_boosted: false,
          preset_modes: ['Cancel Overrides'],
        },
      };
      hass.states['climate.other_hub'] = { ...hass.states['climate.renamed'], entity_id: 'climate.other_hub' };
      hass.states['select.renamed_passive_mode_strategy'] = {
        entity_id: 'select.renamed_passive_mode_strategy',
        state: 'temperature_limiter',
        attributes: {},
      };
      hass.states['select.foreign_passive_mode_strategy'] = {
        entity_id: 'select.foreign_passive_mode_strategy',
        state: 'modulating',
        attributes: {},
      };
      window.serviceCalls = [];
      hass.callService = async (domain, service, data) => {
        serviceCalls.push({ domain, service, data });
        if (window.failHeating) throw new Error('Heating service failed');
        const attributes = { ...hass.states['climate.renamed'].attributes };
        if (service === 'set_preset_mode') {
          attributes.is_override = false;
          attributes.target_temperature_origin = 'FromSchedule';
        }
        hass.states = {
          ...hass.states,
          'climate.renamed': { ...hass.states['climate.renamed'], state: data.hvac_mode || 'auto', attributes },
        };
        card.hass = { ...hass };
      };
      window.heatingHass = hass;
      card.hass = hass;
    });
    const heating = page.locator('wiser-heating-status').filter({ hasText: 'Following schedule' });
    await heating.waitFor();
    await page.evaluate(() => {
      const entity = heatingHass.states['climate.renamed'];
      heatingHass.states = {
        ...heatingHass.states,
        'climate.renamed': {
          ...entity,
          attributes: { ...entity.attributes, is_passive: true },
        },
      };
      document.querySelector('wiser-schedule-card').hass = { ...heatingHass };
    });
    await page.getByText('Schedule status: Passive mode', { exact: true }).waitFor();
    await page.getByText('Passive strategy: Temperature limiter', { exact: true }).waitFor();
    await page.evaluate(() => {
      const entity = heatingHass.states['climate.renamed'];
      heatingHass.states = {
        ...heatingHass.states,
        'climate.renamed': {
          ...entity,
          attributes: { ...entity.attributes, is_passive: false },
        },
      };
      document.querySelector('wiser-schedule-card').hass = { ...heatingHass };
    });
    await page.getByText('Schedule status: Following schedule', { exact: true }).waitFor();
    assert.equal(await page.getByText('Passive strategy: Temperature limiter', { exact: true }).count(), 0);
    await page.getByText('Activity: Idle', { exact: true }).waitFor();
    await heating.getByLabel('Mode', { exact: true }).selectOption('heat');
    await page.getByText('Schedule status: Manual', { exact: true }).waitFor();
    assert.deepEqual(await page.evaluate(() => serviceCalls[0]), {
      domain: 'climate',
      service: 'set_hvac_mode',
      data: { entity_id: 'climate.renamed', hvac_mode: 'heat' },
    });
    await page.evaluate(() => {
      const entity = heatingHass.states['climate.renamed'];
      heatingHass.states = {
        ...heatingHass.states,
        'climate.renamed': {
          ...entity,
          state: 'auto',
          attributes: { ...entity.attributes, is_override: true, target_temperature_origin: 'FromManualOverride' },
        },
      };
      document.querySelector('wiser-schedule-card').hass = { ...heatingHass };
    });
    await page.getByText('Schedule status: Temporary override', { exact: true }).waitFor();
    await button('Resume schedule').click();
    await page.getByText('Schedule status: Following schedule', { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => serviceCalls.at(-1).service), 'set_preset_mode');
    await page.evaluate(() => {
      window.failHeating = true;
    });
    await page
      .locator('wiser-heating-status')
      .filter({ hasText: 'Following schedule' })
      .getByLabel('Mode', { exact: true })
      .selectOption('off');
    await page.getByRole('alert').filter({ hasText: 'Heating service failed' }).waitFor();
    await page.evaluate(() => {
      const card = document.querySelector('wiser-schedule-card');
      card.setConfig({ type: 'custom:wiser-schedule-card', hub: 'hub-one', home_screen: 'overview', admin_only: true });
      card.hass = { ...heatingHass, user: { is_admin: false } };
    });
    await page.getByText('Schedule status: Following schedule', { exact: true }).waitFor();
    assert.equal(await page.locator('wiser-heating-status ha-selector').count(), 0);
    console.log(
      'PASS live heating status, hub-scoped entity matching, mode changes, resume overrides, errors and permissions',
    );
    await page.evaluate(() => {
      const card = document.querySelector('wiser-schedule-card');
      card.setConfig({
        type: 'custom:wiser-schedule-card',
        hub: 'hub-one',
        home_screen: 'overview',
        display_only: true,
      });
      card.hass = { ...heatingHass, user: { is_admin: true } };
    });
    await page.getByText('Schedule status: Following schedule', { exact: true }).waitFor();
    assert.equal(
      await page.locator('wiser-heating-status ha-selector').count(),
      0,
      'read-only blocks heating changes even for admins',
    );
    assert.equal(await button('Resume schedule').count(), 0);
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
    await fresh();
    await page.evaluate(() => mountCard());
    await roomsReady();
    await page.locator('button.overview-device').filter({ hasText: 'Lounge' }).click();
    await button('Copy').click();
    await page.locator('wiser-schedule-copy-card wiser-schedule-slot-editor').waitFor();
    assert.equal(await page.locator('wiser-schedule-copy-card wiser-card-header').count(), 0);
    await page.getByLabel('New schedule name', { exact: true }).fill('Winter duplicate');
    await page.evaluate(() => (fixture.failCopy = true));
    await button('Duplicate to new schedule').click();
    await page.getByRole('alert').filter({ hasText: 'Copy failed' }).waitFor();
    const createCount = await page.evaluate(
      () => fixture.calls.filter((c) => c.type === 'wiser/schedule/create').length,
    );
    await page.getByLabel('New schedule name', { exact: true }).fill('Renamed duplicate');
    await page.evaluate(() => (fixture.failCopy = false));
    await button('Duplicate to new schedule').click();
    await page.getByLabel('Assigned rooms / devices').waitFor();
    const duplicate = await page.evaluate(() => ({
      created: fixture.schedules.find((s) => s.Name === 'Winter duplicate'),
      copy: fixture.calls.filter((c) => c.type === 'wiser/schedule/copy').at(-1),
      creates: fixture.calls.filter((c) => c.type === 'wiser/schedule/create').length,
      rename: fixture.calls.filter((c) => c.type === 'wiser/schedule/rename').at(-1),
    }));
    assert.equal(duplicate.creates, createCount);
    assert.equal(duplicate.copy.to_schedule_id, duplicate.created.Id);
    assert.equal(duplicate.rename.schedule_id, duplicate.created.Id);
    assert.equal(duplicate.rename.schedule_name, 'Renamed duplicate');
    assert.notEqual(duplicate.copy.schedule_id, duplicate.created.Id);
    assert.equal(duplicate.created.Assignments, 0);
    await button('edit').click();
    await page.locator('wiser-schedule-slot-editor').waitFor();
    await page.getByLabel('Schedule Name', { exact: true }).fill('Edited duplicate');
    await page.evaluate(() => (fixture.failRename = true));
    await button('save').click();
    await page.getByRole('alert').filter({ hasText: 'Rename failed' }).waitFor();
    assert.equal(await page.getByLabel('Schedule Name', { exact: true }).isEnabled(), true);
    assert.equal(await page.getByLabel('Schedule Name', { exact: true }).inputValue(), 'Edited duplicate');
    assert.equal(await button('cancel').isEnabled(), true);
    await page.evaluate(() => (fixture.failRename = false));
    await button('save').click();
    await button('edit').waitFor();
    const rename = await page.evaluate(() => fixture.calls.filter((c) => c.type === 'wiser/schedule/rename').at(-1));
    assert.equal(rename.schedule_id, duplicate.created.Id);
    assert.equal(rename.schedule_name, 'Edited duplicate');
    assert.equal(await page.locator('wiser-schedule-edit-card').evaluate((el) => el.schedule_id), duplicate.created.Id);
    await button('Copy').click();
    const destination = await page
      .locator('wiser-schedule-copy-card button.schedule-button')
      .first()
      .getAttribute('id');
    await page.locator('wiser-schedule-copy-card button.schedule-button').first().click();
    await button('edit').waitFor();
    assert.equal(await page.locator('wiser-schedule-edit-card').evaluate((el) => el.schedule_id), Number(destination));
    await page.evaluate(() => {
      fixture.schedules = [
        { Id: 1, Name: 'Heating', Type: 'Heating', Assignments: 0 },
        { Id: 2, Name: 'Dimmer', Type: 'Level', SubType: 'Lighting', Assignments: 0 },
        { Id: 3, Name: 'Blind', Type: 'Level', SubType: 'Shutters', Assignments: 0 },
        { Id: 4, Name: 'Switch', Type: 'OnOff', Assignments: 0 },
        { Id: 5, Name: 'Lamp', Type: 'Lighting', Assignments: 0 },
        { Id: 1000, Name: 'Native hot water', Type: 'OnOff', SubType: 'HotWater', Assignments: 0 },
        { Id: -1000, Name: 'OpenTherm hot water', Type: 'HotWater', Assignments: 0 },
        { Id: 6, Name: 'Future product', Type: 'FutureProduct', Assignments: 0 },
      ];
      mountCard({ home_screen: 'schedules' });
    });
    await page.locator('button.schedule-tile').first().waitFor();
    assert.equal(await page.locator('section[data-category="lighting"] button.schedule-tile').count(), 2);
    assert.equal(await page.locator('section[data-category="shutters"] button.schedule-tile').count(), 1);
    assert.equal(await page.locator('section[data-category="onoff"] button.schedule-tile').count(), 1);
    assert.equal(await page.locator('section[data-category="hotwater"] button.schedule-tile').count(), 2);
    assert.equal(await page.locator('section[data-category="other"] button.schedule-tile').count(), 1);
    for (const name of [
      'Heating',
      'Switch',
      'Dimmer',
      'Blind',
      'Lamp',
      'Native hot water',
      'OpenTherm hot water',
      'Future product',
    ]) {
      await page.locator('button.schedule-tile').filter({ hasText: name }).click();
      const period = page.locator('wiser-schedule-slot-editor [id="Monday|0"]');
      await period.waitFor();
      assert.ok((await period.getAttribute('class')).includes('selectable'), `${name} periods can open the editor`);
      await period.click();
      await page.waitForFunction(
        () =>
          document.querySelector('wiser-schedule-card')?.shadowRoot.querySelector('wiser-schedule-edit-card')?.editMode,
      );
      assert.deepEqual(
        await page.locator('wiser-schedule-slot-editor').evaluate((editor) => [editor._activeDay, editor._activeSlot]),
        ['Monday', 0],
        `${name} opens with the requested period selected`,
      );
      await button('cancel').click();
      await button('edit').waitFor();
      await button('back').click();
      await page.locator('button.schedule-tile').first().waitFor();
    }
    // Native controls and centered alignment for every schedule type, including narrow layouts.
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const kind of ['Heating', 'OnOff', 'Lighting', 'Shutters']) {
        await page.evaluate((kind) => {
          const editor = document.createElement('wiser-schedule-slot-editor');
          editor.hass = makeHass();
          editor.config = { hub: 'hub-one' };
          editor.editMode = true;
          editor.compactCopyPlacement = true;
          editor.schedule_type = kind;
          if (kind === 'OnOff') {
            editor.style.setProperty('--green-color', '#00ff00');
            editor.style.setProperty('--red-color', '#ff0000');
          }
          editor.schedule = {
            Type: kind,
            ScheduleData: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
              day,
              slots: [
                {
                  Time: '00:00',
                  Setpoint: kind === 'OnOff' ? 'On' : kind === 'Heating' ? 18 : 100,
                  SpecialTime: '',
                },
              ],
            })),
          };
          editor.suntimes = {
            Sunrises: Array.from({ length: 7 }, () => ({ time: '06:30' })),
            Sunsets: Array.from({ length: 7 }, () => ({ time: '19:30' })),
          };
          editor._activeDay = 'Monday';
          editor._activeSlot = 0;
          document.querySelector('#mount').replaceChildren(editor);
        }, kind);
        const editor = page.locator('wiser-schedule-slot-editor');
        if (width > 600) await editor.evaluate((el) => el.style.setProperty('--wiser-schedule-picker-width', '300px'));
        const editorBox = await editor.boundingBox();
        const slotsBox = await editor.locator('.slots-wrapper').boundingBox();
        const panelBox = await editor.locator('.selected-period').boundingBox();
        const panelHeadingBox = await editor.locator('.selected-period-header').boundingBox();
        const copyBox = await editor.locator('.copy-section').boundingBox();
        const editorCenter = editorBox.x + editorBox.width / 2;
        const controlsCenter = editorCenter;
        assert.ok(Math.abs(panelBox.x + panelBox.width / 2 - controlsCenter) < 2);
        assert.ok(
          Math.abs(panelHeadingBox.x - panelBox.x - (width <= 600 ? 12 : 22)) < 2,
          'the selected-period heading aligns with the panel padding',
        );
        if (width <= 600) {
          assert.ok(Math.abs(panelBox.x - editorBox.x) < 2, 'mobile period editor uses the full available width');
          assert.ok(
            Math.abs(panelBox.width - editorBox.width) < 2,
            'mobile period editor uses the full available width',
          );
          assert.ok(copyBox.y >= panelBox.y + panelBox.height, 'mobile Copy controls remain below the period editor');
          assert.equal(
            await editor.locator('.copy-section').evaluate((copy) => getComputedStyle(copy).position),
            'static',
          );
        } else if (editorBox.width >= 1350) {
          assert.ok(
            Math.abs(copyBox.y + copyBox.height - (slotsBox.y - 42)) < 2,
            'desktop Copy controls align with the bottom of the schedule picker',
          );
          assert.ok(
            Math.abs(copyBox.x - editorBox.x - 320) < 2,
            'desktop Copy controls follow the responsive schedule-picker width',
          );
          assert.equal(
            await editor.locator('.copy-section').evaluate((copy) => getComputedStyle(copy).position),
            'absolute',
            'desktop Copy controls reuse existing space instead of increasing editor height',
          );
        } else {
          assert.ok(copyBox.y >= panelBox.y + panelBox.height, 'narrow desktop Copy controls follow the period editor');
          assert.equal(
            await editor.locator('.copy-section').evaluate((copy) => getComputedStyle(copy).position),
            'static',
            'narrow desktop Copy controls respond to the card width rather than the viewport width',
          );
        }
        const rowBoxes = await editor.locator('.editor-control-row').evaluateAll((rows) =>
          rows.map((row) => {
            const box = row.getBoundingClientRect();
            return { x: box.x, width: box.width };
          }),
        );
        assert.ok(rowBoxes.length >= 1);
        for (const box of rowBoxes) {
          assert.ok(Math.abs(box.x + box.width / 2 - controlsCenter) < 2);
          assert.ok(Math.abs(box.x - rowBoxes[0].x) < 2);
          assert.ok(Math.abs(box.width - rowBoxes[0].width) < 2);
        }
        if (width <= 600 && ['Lighting', 'Shutters'].includes(kind)) {
          const specialRow = editor.locator('.editor-control-row').first();
          const timeHeadingBox = await specialRow.locator('.section-header').boundingBox();
          const specialTimesBox = await specialRow.locator('.special-times').boundingBox();
          assert.ok(timeHeadingBox.y + timeHeadingBox.height <= specialTimesBox.y + 1, 'Time sits above its selector');
          const specialButtonTops = await specialRow
            .locator('.special-times ha-button')
            .evaluateAll((buttons) => buttons.map((button) => Math.round(button.getBoundingClientRect().top)));
          assert.equal(new Set(specialButtonTops).size, 1, 'special-time choices stay on one row');
          assert.equal(
            await editor.locator('.level-control-row > .section-header').isVisible(),
            false,
            'mobile level editor hides its redundant label',
          );
        }
        if (width <= 600 && kind === 'OnOff') {
          const stateHeadingBox = await editor.locator('.editor-control-row > .section-header').boundingBox();
          const stateControlsBox = await editor.locator('.state-controls').boundingBox();
          assert.ok(
            Math.abs(
              stateHeadingBox.y + stateHeadingBox.height / 2 - stateControlsBox.y - stateControlsBox.height / 2,
            ) < 2,
            'State shares one compact row with the On/Off choices',
          );
        }
        assert.equal(await editor.locator('.add-period-row, .delete-period-row').count(), 0);
        assert.equal(await editor.locator('.selected-period').count(), 1);
        assert.equal(await editor.locator('ha-button#Tuesday').count(), 1);
        assert.equal(await editor.locator('ha-button#Monday').count(), 0);
        if (kind === 'OnOff') {
          await editor.getByRole('radio', { name: 'On', exact: true }).waitFor();
          assert.equal(await editor.getByRole('radio', { name: 'On', exact: true }).isChecked(), true);
          assert.equal(
            await editor
              .locator('.slot')
              .first()
              .evaluate((slot) => getComputedStyle(slot).backgroundColor),
            'rgb(0, 255, 0)',
            'smart-plug On periods use green',
          );
          await editor.getByRole('radio', { name: 'Off', exact: true }).check();
          assert.equal(await editor.evaluate((el) => el.schedule.ScheduleData[0].slots[0].Setpoint), 'Off');
          assert.equal(await editor.getByRole('radio', { name: 'On', exact: true }).isChecked(), false);
          await editor.evaluate((el) => el.updateComplete);
          await page.waitForTimeout(150);
          assert.equal(
            await editor
              .locator('.slot')
              .first()
              .evaluate((slot) => getComputedStyle(slot).backgroundColor),
            'rgb(255, 0, 0)',
            'smart-plug Off periods use red',
          );
        } else {
          const range = editor.getByRole('slider');
          await range.waitFor();
          const rangeBox = await range.boundingBox();
          const heading = editor.locator('.editor-control-row > .section-header').last();
          if (width <= 600 && ['Heating', 'Lighting', 'Shutters'].includes(kind)) {
            assert.equal(await heading.isVisible(), false, `mobile ${kind} editor hides its redundant label`);
          } else {
            const headingBox = await heading.boundingBox();
            assert.ok(
              Math.abs(headingBox.y + headingBox.height / 2 - rangeBox.y - rangeBox.height / 2) < 2,
              JSON.stringify({ width, kind, headingBox, rangeBox }),
            );
          }
          if (['Lighting', 'Shutters'].includes(kind)) {
            assert.equal(
              await editor
                .locator('.slot')
                .first()
                .evaluate((el) => getComputedStyle(el.querySelector('span')).color),
              'rgb(28, 28, 28)',
            );
          }
          await range.fill(kind === 'Heating' ? '5' : '0');
          assert.equal(
            await editor.evaluate((el) => el.schedule.ScheduleData[0].slots[0].Setpoint),
            kind === 'Heating' ? 5 : 0,
          );
          if (['Lighting', 'Shutters'].includes(kind)) {
            await editor.evaluate((el) => el.updateComplete);
            await page.waitForTimeout(150);
            const inactiveAppearance = await editor.evaluate((el) => {
              const slot = el.shadowRoot.querySelector('.slot');
              return {
                background: getComputedStyle(slot).backgroundColor,
                inlineStyle: slot.getAttribute('style'),
                scheduleType: el.schedule_type,
                setpoint: el.schedule.ScheduleData[0].slots[0].Setpoint,
                themeColors: el.config.theme_colors,
              };
            });
            assert.equal(inactiveAppearance.background, 'rgb(240, 245, 245)', JSON.stringify(inactiveAppearance));
            assert.equal(
              await editor
                .locator('.slot')
                .first()
                .evaluate((el) => getComputedStyle(el.querySelector('span')).color),
              'rgb(32, 48, 68)',
            );
          }
        }
        if (kind === 'Shutters') {
          await editor.getByText('Closed', { exact: true }).waitFor();
          await editor.getByText('Open', { exact: true }).waitFor();
        }
        if (['Lighting', 'Shutters'].includes(kind)) {
          assert.equal(await editor.locator('.special-times ha-button').count(), 3);
          assert.equal(await editor.locator('.special-times ha-icon').count(), 0);
          assert.equal(await editor.locator('.special-times ha-button.selected').getAttribute('id'), 'fixed');
          await editor.locator('.special-times ha-button#sunrise').click();
          assert.equal(await editor.evaluate((el) => el.schedule.ScheduleData[0].slots[0].SpecialTime), 'Sunrise');
          assert.equal(await editor.locator('ha-icon-button.time-handle').count(), 0);
          assert.equal(await editor.locator('.tooltip ha-icon[icon="hass:weather-sunny"]').count(), 1);
          await editor.evaluate((el) => {
            el.editMode = false;
          });
          assert.equal(await editor.locator('.special-time-marker[aria-label="Sunrise"]').count(), 1);
          assert.equal(await editor.locator('.special-time-marker ha-icon[icon="hass:weather-sunny"]').count(), 1);
          assert.match(await editor.locator('.slot').first().textContent(), /100%/);
          assert.equal(
            await editor.locator('.special-time-marker').evaluate((el) => getComputedStyle(el).borderRadius),
            '0px',
          );
          const markerBox = await editor.locator('.special-time-marker').boundingBox();
          const markerIconBox = await editor.locator('.special-time-marker ha-icon').boundingBox();
          const specialSlotBox = await editor.locator('.special-time-marker').locator('..').boundingBox();
          assert.equal(
            await editor.locator('.special-time-marker ha-icon').evaluate((el) => getComputedStyle(el).color),
            'rgb(32, 48, 68)',
          );
          assert.ok(
            Math.abs(markerBox.x + markerBox.width / 2 - specialSlotBox.x) < 1,
            'special-time icon is centred on the slot boundary',
          );
          assert.ok(
            Math.abs(markerIconBox.x + markerIconBox.width / 2 - (markerBox.x + markerBox.width / 2)) < 1 &&
              Math.abs(markerIconBox.y + markerIconBox.height / 2 - (markerBox.y + markerBox.height / 2)) < 1,
            'special-time icon is centred on its boundary marker',
          );
          await editor.evaluate((el) => {
            el.editMode = true;
            el._activeDay = 'Monday';
            el._activeSlot = 0;
          });
          assert.equal(await editor.locator('.special-time-marker').count(), 0);
          await editor.evaluate((el) => el.addPeriod());
          await editor.evaluate((el) => {
            el._activeSlot = -99;
            el._activeDay = '';
          });
          assert.equal(
            await editor.locator('.special-time-marker[aria-label="Sunrise"]').count(),
            1,
            'special-time markers remain visible in the editor without a selection',
          );
          await editor.evaluate((el) => {
            el._activeDay = 'Monday';
            el._activeSlot = 0;
          });
          const addedBeforeSunrise = await editor.evaluate((el) => ({
            activeSlot: el._activeSlot,
            slots: structuredClone(el.schedule.ScheduleData[0].slots),
          }));
          assert.equal(addedBeforeSunrise.activeSlot, 0);
          assert.equal(addedBeforeSunrise.slots.length, 2);
          assert.equal(addedBeforeSunrise.slots[0].SpecialTime, '');
          assert.equal(addedBeforeSunrise.slots[1].SpecialTime, 'Sunrise');
          assert.ok(minutes(addedBeforeSunrise.slots[0].Time) < minutes(addedBeforeSunrise.slots[1].Time));
          await editor.evaluate((el) => {
            el._activeSlot = 1;
          });
          await editor.locator('.special-times ha-button#sunset').click();
          const lastPeriodSunset = await editor.evaluate((el) => ({
            activeSlot: el._activeSlot,
            slots: structuredClone(el.schedule.ScheduleData[0].slots),
          }));
          assert.equal(lastPeriodSunset.slots.at(-1).SpecialTime, 'Sunset');
          assert.equal(lastPeriodSunset.slots[lastPeriodSunset.activeSlot].SpecialTime, 'Sunset');

          await editor.evaluate((el) => {
            el.schedule.ScheduleData[0].slots = [
              { Time: '00:00', Setpoint: '100', SpecialTime: '' },
              { Time: '12:00', Setpoint: '0', SpecialTime: '' },
            ];
            el._activeSlot = 0;
            el.requestUpdate();
          });
          await editor.locator('.special-times ha-button#sunrise').click();
          await editor.locator('.special-times ha-button#sunset').click();
          const sunriseToSunset = await editor.evaluate((el) => ({
            activeSlot: el._activeSlot,
            slots: structuredClone(el.schedule.ScheduleData[0].slots),
          }));
          assert.deepEqual(
            sunriseToSunset.slots.map((slot) => slot.SpecialTime),
            ['Sunrise', 'Sunset'],
          );
          assert.equal(sunriseToSunset.activeSlot, 0, 'setting the end keeps the same period selected');
          assert.deepEqual(
            await editor
              .locator('.special-times ha-button.selected')
              .evaluateAll((buttons) => buttons.map((button) => button.id)),
            ['sunrise', 'sunset'],
          );
          await editor.locator('.special-times ha-button#sunrise').click();
          assert.equal(
            await editor.evaluate(
              (el) => el.schedule.ScheduleData[0].slots.filter((slot) => slot.SpecialTime === 'Sunrise').length,
            ),
            1,
            'a day has only one Sunrise boundary',
          );
        }
        await editor.evaluate((el) => {
          el._activeSlot = -99;
        });
        for (const input of await editor.locator('input[type="radio"], input[type="range"]').all())
          assert.equal(await input.isDisabled(), true);
      }
    }
    await page.setViewportSize({ width: 1600, height: 900 });
    const constrainedEditor = page.locator('wiser-schedule-slot-editor');
    await constrainedEditor.evaluate((el) => {
      el.style.width = '900px';
    });
    const constrainedEditorBox = await constrainedEditor.boundingBox();
    const constrainedCopyBox = await constrainedEditor.locator('.copy-section').boundingBox();
    assert.equal(
      await constrainedEditor.locator('.copy-section').evaluate((copy) => getComputedStyle(copy).position),
      'static',
      'compact Copy controls use the card width rather than the wider browser viewport',
    );
    assert.ok(
      constrainedCopyBox.x + constrainedCopyBox.width <= constrainedEditorBox.x + constrainedEditorBox.width + 1,
      'Copy controls stay within a constrained desktop card',
    );
    const constrainedPanelBox = await constrainedEditor.locator('.selected-period').boundingBox();
    assert.ok(
      constrainedCopyBox.y >= constrainedPanelBox.y + constrainedPanelBox.height,
      'Copy controls move below the selected-period panel in a constrained desktop card',
    );
    await page.setViewportSize({ width: 390, height: 900 });
    await page.evaluate(() => {
      const editor = document.createElement('wiser-schedule-slot-editor');
      editor.hass = makeHass();
      editor.config = { hub: 'hub-one' };
      editor.schedule_type = 'OnOff';
      editor.style.setProperty('--red-color', '#ff0000');
      editor.schedule = {
        Id: 1000,
        Type: 'OnOff',
        SubType: 'HotWater',
        ScheduleData: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
          (day, index) => ({
            day,
            slots: [{ Time: '00:00', Setpoint: index === 0 ? 'On' : 'Off', SpecialTime: '' }],
          }),
        ),
      };
      editor.suntimes = { Sunrises: [], Sunsets: [] };
      document.querySelector('#mount').replaceChildren(editor);
    });
    const nativeHotWaterSlots = page.locator('wiser-schedule-slot-editor .slot');
    assert.equal(
      await nativeHotWaterSlots.nth(0).evaluate((slot) => getComputedStyle(slot).backgroundColor),
      'rgb(255, 0, 0)',
      'native hot-water On periods use red',
    );
    assert.equal(
      await nativeHotWaterSlots.nth(1).evaluate((slot) => getComputedStyle(slot).backgroundColor),
      'rgb(138, 138, 138)',
      'native hot-water Off periods use grey',
    );
    await page.locator('wiser-schedule-slot-editor').evaluate(async (editor) => {
      editor.config.hot_water_on_color = '#123456';
      editor.config.hot_water_off_color = '#654321';
      editor.requestUpdate();
      await editor.updateComplete;
    });
    await page.waitForTimeout(150);
    const customHotWaterSlots = page.locator('wiser-schedule-slot-editor .slot');
    assert.equal(
      await customHotWaterSlots.nth(0).evaluate((slot) => getComputedStyle(slot).backgroundColor),
      'rgb(18, 52, 86)',
      'custom On colour overrides the native hot-water default',
    );
    assert.equal(
      await customHotWaterSlots.nth(1).evaluate((slot) => getComputedStyle(slot).backgroundColor),
      'rgb(101, 67, 33)',
      'custom Off colour overrides the native hot-water default',
    );
    await page.evaluate(() => {
      const editor = document.createElement('wiser-schedule-slot-editor');
      editor.hass = makeHass();
      editor.config = { hub: 'hub-one', on_color: '#234567', off_color: '#765432' };
      editor.schedule_type = 'OnOff';
      editor.schedule = {
        Id: 42,
        Type: 'OnOff',
        ScheduleData: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
          (day, index) => ({
            day,
            slots: [{ Time: '00:00', Setpoint: index === 0 ? 'On' : 'Off', SpecialTime: '' }],
          }),
        ),
      };
      editor.suntimes = { Sunrises: [], Sunsets: [] };
      document.querySelector('#mount').replaceChildren(editor);
    });
    const customControlSlots = page.locator('wiser-schedule-slot-editor .slot');
    assert.equal(
      await customControlSlots.nth(0).evaluate((slot) => getComputedStyle(slot).backgroundColor),
      'rgb(35, 69, 103)',
      'custom control On colour is independent of hot water',
    );
    assert.equal(
      await customControlSlots.nth(1).evaluate((slot) => getComputedStyle(slot).backgroundColor),
      'rgb(118, 84, 50)',
      'custom control Off colour is independent of hot water',
    );
    await page.evaluate(() => {
      const editor = document.createElement('wiser-schedule-slot-editor');
      editor.hass = makeHass();
      editor.config = { hub: 'hub-one', low_color: '#102030', high_color: '#a0b0c0' };
      editor.schedule_type = 'HotWater';
      editor.schedule = {
        Id: 1001,
        Type: 'HotWater',
        ScheduleData: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
          (day, index) => ({
            day,
            slots: [{ Time: '00:00', Setpoint: index === 0 ? '20' : '65', SpecialTime: '' }],
          }),
        ),
      };
      editor.suntimes = { Sunrises: [], Sunsets: [] };
      document.querySelector('#mount').replaceChildren(editor);
    });
    const customTemperatureSlots = page.locator('wiser-schedule-slot-editor .slot');
    assert.equal(
      await customTemperatureSlots.nth(0).evaluate((slot) => getComputedStyle(slot).backgroundColor),
      'rgb(16, 32, 48)',
      'custom low colour is used at the low end of the temperature scale',
    );
    assert.equal(
      await customTemperatureSlots.nth(1).evaluate((slot) => getComputedStyle(slot).backgroundColor),
      'rgb(160, 176, 192)',
      'custom high colour is used at the high end of the temperature scale',
    );
    await page.evaluate(() => {
      const editor = document.createElement('wiser-schedule-slot-editor');
      editor.hass = makeHass();
      editor.config = { hub: 'hub-one', lighting_off_color: '#010203', lighting_on_color: '#aabbcc' };
      editor.schedule_type = 'Lighting';
      editor.schedule = {
        Id: 1002,
        Type: 'Lighting',
        ScheduleData: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
          (day, index) => ({
            day,
            slots: [{ Time: '00:00', Setpoint: index === 0 ? '0' : '100', SpecialTime: '' }],
          }),
        ),
      };
      editor.suntimes = { Sunrises: [], Sunsets: [] };
      document.querySelector('#mount').replaceChildren(editor);
    });
    const customLightingSlots = page.locator('wiser-schedule-slot-editor .slot');
    assert.equal(
      await customLightingSlots.nth(0).evaluate((slot) => getComputedStyle(slot).backgroundColor),
      'rgb(1, 2, 3)',
      'custom lighting Off colour is used at zero percent',
    );
    assert.equal(
      await customLightingSlots.nth(1).evaluate((slot) => getComputedStyle(slot).backgroundColor),
      'rgb(170, 187, 204)',
      'custom lighting On colour is used at 100 percent',
    );
    await page.evaluate(() => {
      const editor = document.createElement('wiser-schedule-slot-editor');
      editor.hass = makeHass();
      editor.config = { hub: 'hub-one', shutter_closed_color: '#112233', shutter_open_color: '#ddeeff' };
      editor.schedule_type = 'Shutters';
      editor.schedule = {
        Id: 1003,
        Type: 'Shutters',
        ScheduleData: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
          (day, index) => ({
            day,
            slots: [{ Time: '00:00', Setpoint: index === 0 ? '0' : '100', SpecialTime: '' }],
          }),
        ),
      };
      editor.suntimes = { Sunrises: [], Sunsets: [] };
      document.querySelector('#mount').replaceChildren(editor);
    });
    const customShutterSlots = page.locator('wiser-schedule-slot-editor .slot');
    assert.equal(
      await customShutterSlots.nth(0).evaluate((slot) => getComputedStyle(slot).backgroundColor),
      'rgb(17, 34, 51)',
      'custom shutter Closed colour is used at zero percent',
    );
    assert.equal(
      await customShutterSlots.nth(1).evaluate((slot) => getComputedStyle(slot).backgroundColor),
      'rgb(221, 238, 255)',
      'custom shutter Open colour is used at 100 percent',
    );
    await page.evaluate(() => {
      const editor = document.createElement('wiser-schedule-slot-editor');
      editor.hass = makeHass();
      editor.config = { hub: 'hub-one' };
      editor.editMode = true;
      editor.schedule_type = 'Heating';
      editor.schedule = {
        Type: 'Heating',
        Capabilities: { PassiveControl: true },
        PassiveControlDefaults: { Enabled: true, Strategy: 'temperature_limiter' },
        PassiveRange: true,
        PassiveRangeType: 'external',
        MinUpperSetpoint: 5,
        MaxUpperSetpoint: 30,
        ScheduleData: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
          day,
          slots: [{ Time: '00:00', Setpoint: '14', UpperSetpoint: 20, SpecialTime: '' }],
        })),
      };
      editor.suntimes = {
        Sunrises: Array.from({ length: 7 }, () => ({ time: '06:30' })),
        Sunsets: Array.from({ length: 7 }, () => ({ time: '19:30' })),
      };
      editor._activeDay = 'Monday';
      editor._activeSlot = 0;
      editor.scheduleChangeCount = 0;
      editor.addEventListener('scheduleChanged', () => editor.scheduleChangeCount++);
      document.querySelector('#mount').replaceChildren(editor);
    });
    const rangeEditor = page.locator('wiser-schedule-slot-editor');
    await rangeEditor.getByRole('slider').first().waitFor();
    await rangeEditor.evaluate((el) => {
      delete el.schedule.Capabilities;
      el.requestUpdate();
    });
    await rangeEditor.evaluate((el) => el.updateComplete);
    assert.equal(
      await rangeEditor.getByLabel('Schedule passive mode').count(),
      0,
      'older integrations keep the existing editor without scheduled Passive controls',
    );
    await rangeEditor.evaluate((el) => {
      delete el.schedule.PassiveRange;
      delete el.schedule.PassiveRangeType;
      delete el.schedule.MinUpperSetpoint;
      delete el.schedule.MaxUpperSetpoint;
      for (const day of el.schedule.ScheduleData) for (const slot of day.slots) delete slot.UpperSetpoint;
      el.requestUpdate();
    });
    await rangeEditor.evaluate((el) => el.updateComplete);
    assert.equal(await rangeEditor.getByRole('slider').count(), 1);
    assert.equal(await rangeEditor.getByText('Temperature', { exact: true }).count(), 1);
    assert.equal(await rangeEditor.getByText('Lower temperature', { exact: true }).count(), 0);
    assert.equal(await rangeEditor.getByText('Upper temperature', { exact: true }).count(), 0);
    assert.equal(
      await rangeEditor.getByLabel('Schedule passive mode').count(),
      0,
      'v4.0.1 schedule payloads stay on the original single-temperature editor',
    );
    await rangeEditor.evaluate((el) => {
      el.schedule.Capabilities = { PassiveControl: true };
      el.schedule.PassiveRange = true;
      el.schedule.PassiveRangeType = 'external';
      el.schedule.MinUpperSetpoint = 5;
      el.schedule.MaxUpperSetpoint = 30;
      for (const day of el.schedule.ScheduleData)
        for (const slot of day.slots) slot.UpperSetpoint = Number(slot.Setpoint) + 6;
      el.requestUpdate();
    });
    await rangeEditor.evaluate((el) => el.updateComplete);
    assert.equal(await rangeEditor.getByLabel('Schedule passive mode').count(), 1);
    const passivePanelBox = await rangeEditor.locator('.selected-period').boundingBox();
    const passiveEditorBox = await rangeEditor.boundingBox();
    const passiveHeadingBox = await rangeEditor.getByText('Schedule passive mode', { exact: true }).boundingBox();
    assert.ok(Math.abs(passivePanelBox.x - passiveEditorBox.x) < 2);
    assert.ok(Math.abs(passivePanelBox.width - passiveEditorBox.width) < 2);
    assert.ok(
      passiveHeadingBox.x >= passivePanelBox.x &&
        passiveHeadingBox.x + passiveHeadingBox.width <= passivePanelBox.x + passivePanelBox.width,
      'the Passive scheduling label stays inside the selected-period panel',
    );
    assert.equal(await rangeEditor.getByText('Lower temperature', { exact: true }).count(), 1);
    assert.equal(await rangeEditor.getByText('Upper temperature', { exact: true }).count(), 1);
    assert.match(await rangeEditor.locator('.slot').first().textContent(), /14°C–20°C/);
    const temperatureSliders = rangeEditor.getByRole('slider');
    assert.equal(await temperatureSliders.count(), 2);
    const lowerSliderBox = await temperatureSliders.nth(0).boundingBox();
    const upperSliderBox = await temperatureSliders.nth(1).boundingBox();
    assert.ok(lowerSliderBox && upperSliderBox);
    assert.ok(Math.abs(lowerSliderBox.x - upperSliderBox.x) < 1, 'temperature slider tracks start together');
    assert.ok(Math.abs(lowerSliderBox.width - upperSliderBox.width) < 1, 'temperature slider tracks are equal length');
    assert.equal(await temperatureSliders.nth(1).getAttribute('min'), '5');
    await rangeEditor.evaluate((el) => {
      el.schedule.ScheduleData[0].slots[0].Time = '07:00';
      el.schedule.ScheduleData[6].slots[0].Setpoint = '17';
      el.schedule.ScheduleData[6].slots[0].UpperSetpoint = 22;
      el.requestUpdate();
    });
    await rangeEditor.evaluate((el) => el.updateComplete);
    assert.match(
      await rangeEditor.locator('.slot.previous').first().textContent(),
      /17°C–22°C/,
      'the shaded period before the first slot displays the inherited temperature range',
    );
    await temperatureSliders.nth(1).evaluate((input) => {
      input.value = '21.5';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    });
    assert.deepEqual(
      await rangeEditor.evaluate((el) => ({
        upper: el.schedule.ScheduleData[0].slots[0].UpperSetpoint,
        commits: el.scheduleChangeCount,
      })),
      { upper: 21.5, commits: 0 },
      'slider movement previews locally without rebuilding schedule history',
    );
    await temperatureSliders
      .nth(1)
      .evaluate((input) => input.dispatchEvent(new Event('change', { bubbles: true, composed: true })));
    assert.equal(await rangeEditor.evaluate((el) => el.scheduleChangeCount), 1);
    await temperatureSliders.nth(1).fill('22');
    assert.equal(await rangeEditor.evaluate((el) => el.schedule.ScheduleData[0].slots[0].UpperSetpoint), 22);
    await temperatureSliders.nth(0).fill('18');
    assert.equal(
      await rangeEditor.evaluate((el) => el.schedule.ScheduleData[0].slots[0].UpperSetpoint),
      22,
      'changing the lower value within range does not move the upper value',
    );
    assert.equal(await temperatureSliders.nth(1).getAttribute('min'), '5');
    await temperatureSliders.nth(0).fill('23');
    assert.deepEqual(
      await rangeEditor.evaluate((el) => ({
        lower: el.schedule.ScheduleData[0].slots[0].Setpoint,
        upper: el.schedule.ScheduleData[0].slots[0].UpperSetpoint,
      })),
      { lower: 23, upper: 23 },
    );
    await rangeEditor.evaluate((el) => {
      el.schedule.PassiveRange = true;
      el.schedule.PassiveRangeType = 'native';
      el.requestUpdate();
    });
    await rangeEditor.evaluate((el) => el.updateComplete);
    assert.equal(
      await rangeEditor.getByRole('slider').count(),
      2,
      'native Passive Mode schedules use the same paired temperature editor',
    );
    await rangeEditor.evaluate((el) => {
      el.schedule.ScheduleData[0].slots[0].Setpoint = 17;
      el.schedule.ScheduleData[0].slots[0].UpperSetpoint = 22;
      el.requestUpdate();
    });
    await rangeEditor.evaluate((el) => el.updateComplete);
    await rangeEditor.getByLabel('Schedule passive mode').check();
    const passiveToggleHeadingBox = await rangeEditor.locator('.passive-period-toggle > .section-header').boundingBox();
    const passiveToggleBox = await rangeEditor.getByLabel('Schedule passive mode').boundingBox();
    assert.ok(
      Math.abs(
        passiveToggleHeadingBox.y +
          passiveToggleHeadingBox.height / 2 -
          passiveToggleBox.y -
          passiveToggleBox.height / 2,
      ) < 2,
      'the mobile Passive scheduling label and switch share one row',
    );
    const passiveChoiceBoxes = await rangeEditor
      .locator('.passive-strategy-controls ha-button')
      .evaluateAll((buttons) =>
        buttons.map((button) => {
          const box = button.getBoundingClientRect();
          return {
            text: button.textContent.trim(),
            top: Math.round(box.top),
            left: Math.round(box.left),
            width: Math.round(box.width),
            height: Math.round(box.height),
          };
        }),
      );
    assert.equal(
      new Set(passiveChoiceBoxes.map((box) => box.top)).size,
      1,
      `mobile Passive strategy choices stay on one row: ${JSON.stringify(passiveChoiceBoxes)}`,
    );
    const passiveEditorWidths = await rangeEditor.evaluate((el) => ({
      client: el.clientWidth,
      scroll: el.scrollWidth,
    }));
    assert.ok(
      passiveEditorWidths.scroll <= passiveEditorWidths.client + 1,
      `the Passive period editor does not overflow at phone width: ${JSON.stringify(passiveEditorWidths)}`,
    );
    assert.deepEqual(
      await rangeEditor.evaluate((el) => ({
        enabled: el.schedule.PassiveControl,
        type: el.schedule.PassiveRangeType,
        slot: el.schedule.ScheduleData[0].slots[0],
      })),
      {
        enabled: true,
        type: 'native',
        slot: {
          Time: '07:00',
          Setpoint: 17,
          UpperSetpoint: 22,
          PassiveScheduled: true,
          PassiveMode: true,
          PassiveStrategy: 'temperature_limiter',
          SpecialTime: '',
        },
      },
      'period scheduling starts from the room mode and strategy without changing its temperature range',
    );
    await rangeEditor
      .getByRole('button', { name: 'Temperature limiter', exact: true })
      .evaluate((button) => button.click());
    assert.deepEqual(
      await rangeEditor.evaluate((el) => ({
        enabled: el.schedule.ScheduleData[0].slots[0].PassiveMode,
        strategy: el.schedule.ScheduleData[0].slots[0].PassiveStrategy,
      })),
      { enabled: true, strategy: 'temperature_limiter' },
    );
    await rangeEditor
      .getByRole('radiogroup', { name: 'Passive mode', exact: true })
      .getByRole('button', { name: 'Off', exact: true })
      .evaluate((button) => button.click());
    assert.equal(await rangeEditor.evaluate((el) => el.schedule.ScheduleData[0].slots[0].PassiveMode), false);
    assert.equal(
      await rangeEditor.getByRole('slider').inputValue(),
      '17',
      'Off after Temperature limiter uses the lower temperature',
    );
    assert.match(await rangeEditor.locator('.slot').first().textContent(), /17°C/);
    await rangeEditor.getByRole('button', { name: 'Modulating', exact: true }).evaluate((button) => button.click());
    await rangeEditor
      .getByRole('radiogroup', { name: 'Passive mode', exact: true })
      .getByRole('button', { name: 'Off', exact: true })
      .evaluate((button) => button.click());
    assert.equal(
      await rangeEditor.getByRole('slider').inputValue(),
      '22',
      'Off after Modulating uses the upper temperature',
    );
    assert.match(await rangeEditor.locator('.slot').first().textContent(), /22°C/);
    await rangeEditor.getByLabel('Schedule passive mode').uncheck();
    assert.deepEqual(
      await rangeEditor.evaluate((el) => ({
        enabled: el.schedule.PassiveControl,
        range: el.schedule.PassiveRange,
        upper: el.schedule.ScheduleData[0].slots[0].UpperSetpoint,
        scheduled: el.schedule.ScheduleData[0].slots[0].PassiveScheduled,
        strategy: el.schedule.ScheduleData[0].slots[0].PassiveStrategy,
      })),
      { enabled: undefined, range: true, upper: 22, scheduled: undefined, strategy: undefined },
      'disabling one period returns it to the room configuration without losing the temperature schedule',
    );
    assert.equal(await rangeEditor.getByRole('slider').count(), 2);
    await page.evaluate(() => {
      const editor = document.createElement('wiser-schedule-slot-editor');
      editor.hass = makeHass();
      editor.config = { hub: 'hub-one' };
      editor.editMode = true;
      editor.schedule_type = 'HotWater';
      editor.schedule = {
        Type: 'HotWater',
        MinSetpoint: 35,
        MaxSetpoint: 55,
        PresetOptions: [
          { name: 'Hand wash', icon: 'mdi:hand-wash', temperature: 42 },
          { name: 'Shower', icon: 'mdi:shower', temperature: 48 },
        ],
        ScheduleData: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
          (day, index) => ({
            day,
            slots: [{ Time: '00:00', Setpoint: String([35, 45, 55, 65, 35, 45, 55][index]), SpecialTime: '' }],
          }),
        ),
      };
      editor.suntimes = { Sunrises: [], Sunsets: [] };
      editor._activeDay = 'Monday';
      editor._activeSlot = 0;
      document.querySelector('#mount').replaceChildren(editor);
    });
    const hotWaterEditor = page.locator('wiser-schedule-slot-editor');
    await hotWaterEditor.getByRole('radio', { name: 'Temperature', exact: true }).waitFor();
    assert.deepEqual(
      await hotWaterEditor
        .locator('.slot')
        .evaluateAll((slots) => slots.slice(0, 4).map((slot) => getComputedStyle(slot).backgroundColor)),
      ['rgb(235, 170, 0)', 'rgb(235, 113, 0)', 'rgb(235, 56, 0)', 'rgb(235, 0, 0)'],
      'hot water keeps the warm palette across its absolute temperature range',
    );
    assert.equal(
      await hotWaterEditor.locator('input[name="scheduled-hot-water-preset"]').count(),
      3,
      'the card renders custom temperature plus the schedule-safe presets supplied by the integration',
    );
    await hotWaterEditor.getByRole('radio', { name: 'Hand wash', exact: true }).check();
    assert.equal(await hotWaterEditor.evaluate((el) => el.schedule.ScheduleData[0].slots[0].Setpoint), 'Hand wash');
    assert.match(await hotWaterEditor.locator('.slot').first().textContent(), /Hand wash/);
    assert.doesNotMatch(await hotWaterEditor.locator('.slot').first().textContent(), /Hand wash°C/);
    assert.equal(await hotWaterEditor.getByRole('slider').inputValue(), '42');
    await hotWaterEditor.getByRole('slider').fill('44');
    assert.equal(await hotWaterEditor.evaluate((el) => el.schedule.ScheduleData[0].slots[0].Setpoint), 44);
    assert.equal(await hotWaterEditor.getByRole('radio', { name: 'Temperature', exact: true }).isChecked(), true);
    const normalizedSpecialTimes = await page.evaluate(() => {
      const card = document.createElement('wiser-schedule-edit-card');
      card.suntimes = {
        Sunrises: [
          { day: 'Tuesday', time: '07:04' },
          { day: 'Monday', time: '06:58' },
        ],
        Sunsets: [
          { day: 'Tuesday', time: '18:45' },
          { day: 'Monday', time: '18:47' },
        ],
      };
      return card.convertLoadedScheduleDay({
        day: 'Tuesday',
        slots: [
          { Time: '13:20', Setpoint: '58', SpecialTime: '' },
          { Time: 'Sunrise', Setpoint: '0', SpecialTime: '' },
        ],
      }).slots;
    });
    assert.deepEqual(
      normalizedSpecialTimes.map((slot) => [slot.Time, slot.SpecialTime]),
      [
        ['07:04', 'Sunrise'],
        ['13:20', ''],
      ],
      'loaded special times resolve by day name and sort chronologically',
    );
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
