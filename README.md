# Wiser Schedule Card

A Home Assistant dashboard card for managing schedules provided by the Wiser integration. Start with your Wiser rooms and devices, choose their schedules, and edit their daily time slots.

Originally created by [Mark Parker (@msp1974)](https://github.com/msp1974).

## Installation

Release versions of Wiser Schedule Card are included with the [wiserHomeAssistantPlatform](https://github.com/asantaga/wiserHomeAssistantPlatform) integration. Install or update the integration to receive the bundled card; no separate card installation is needed.

Add **Wiser Schedule Card** through the dashboard card picker and select the Wiser hub in the editor, or use YAML:

```yaml
type: custom:wiser-schedule-card
hub: your_hub_name
```

### Testing a development build

Manual bundle replacement is only needed when testing a development version, using the same method as Wiser Zigbee Card:

1. Run `npm run build:dev` to produce `dist/wiser-schedule-card.js`.
2. Replace the integration’s `config/custom_components/wiser/frontend/wiser-schedule-card.js` with that bundle.
3. Update the existing dashboard resource to the version printed by the build, for example `/wiser/wiser-schedule-card.js?v=2.0.0-dev.57`, with type **JavaScript module**.
4. Reload Home Assistant.

Keep a single resource entry for the schedule card. An integration update may replace the development bundle with its included release version.

## Rooms and schedules

The **Wiser Home** screen groups available controls into **Heating**, **Hot water**, **Lighting & devices**, and **Moments**, with no toolbar. Empty sections are hidden. Tiles show room or device names and their assigned schedules. Moments open the corresponding Home Assistant button controls; they are preset actions, not weekly schedule editors. Use Home Assistant automations for timed activation. Moment discovery is restricted to the selected Wiser hub and requires access to the entity/device registries.
Select a room to see its toolbar, schedule-name assignment chooser, and full weekly timeline:

- **Back arrow:** return home.
- **Pencil:** edit the timeline directly on the room screen; save/cancel buttons appear while editing.
- **Rename, copy, and delete:** manage the current schedule.
- **Plus:** create a schedule.
- **Check mark:** assign the selected schedule to this room.

Selecting an option does not change the assignment until you press the check mark.
Only compatible heating schedules appear in the room chooser. Rooms without an assignment
remain visible. Shared schedules are labelled because editing their times affects every
room using them. Read-only users can view schedules but cannot assign or create them.

The room view uses the integration’s existing room and schedule endpoints; no backend change is required.

## Configuration

The visual editor provides hub, schedule, layout, appearance, and permission settings. Existing configuration keys remain supported.

| Option              | Default             | Purpose                                                              |
| ------------------- | ------------------- | -------------------------------------------------------------------- |
| `name`              | `Wiser Schedule`    | Card title.                                                          |
| `hub`               | Integration default | Select a hub; use the editor for installations with multiple hubs.   |
| `selected_schedule` | Unset               | Open one schedule directly, formatted as `Heating\|1` (type and ID). |
| `view_type`         | `default`           | Room tiles; `list` shows room rows.                                  |
| `theme_colors`      | `false`             | Use theme colours for schedule time slots.                           |
| `display_only`      | `false`             | Hide editing actions.                                                |
| `admin_only`        | `false`             | Show editing actions only to administrators.                         |
| `hide_card_borders` | `false`             | Remove the outer card border for stacked layouts.                    |

Legacy `show_badges` and `show_schedule_id` settings are ignored; their schedule-list view has been removed.

Permission options control the card interface. The integration and Home Assistant remain responsible for authorising service calls.

## Development

Use Node.js 24 (see `.nvmrc`).

```sh
npm ci
npm run build
```

The build checks TypeScript and writes `dist/wiser-schedule-card.js`. It does not reformat source files. Dependencies are pinned by the committed lockfile.

```sh
npm start             # Watch source; serve the bundle at http://127.0.0.1:5000
npm run typecheck     # TypeScript validation
npm run format       # Format source and configuration
npm run format:check # Check formatting without changing files
npx playwright install chromium
npm test             # Browser regression checks; run npm run build first
```

Browser checks use mocked Home Assistant elements and Wiser WebSocket responses. They cover loading and error states, empty schedules, navigation, mobile layout, configuration changes, and subscription cleanup. Validate the built card in a real Home Assistant dashboard before release, including saving/copying schedules and device assignments.

## Development builds for testing

The release version is **2.0.0**. To create a numbered development build:

```sh
npm run build:dev
```

The first successful build is `2.0.0-dev.1`; the next is `2.0.0-dev.2`, and so on.
Each build writes `dist/wiser-schedule-card.js` with that version embedded in the
card, plus `dist/build-info.json` containing the version and dashboard resource URL.
The command prints the URL, for example:

```text
/wiser/wiser-schedule-card.js?v=2.0.0-dev.1
```

Copy `dist/wiser-schedule-card.js` over the integration’s
`config/custom_components/wiser/frontend/wiser-schedule-card.js`, then update the
existing `/wiser/wiser-schedule-card.js` dashboard resource query string to the
printed version and reload Home Assistant. The Wiser integration provides the
`/wiser/` route. The build command only creates the local bundle; it does not
upload it to Home Assistant.

`npm start` also increments the dev number on each successful watch rebuild.
The local counter is saved in `.dev-build.json`, outside `dist`, and excluded from
Git. It survives cleaning `dist` and resets to 1 when the release version changes.
Counters are local to each checkout. `npm run build` produces the stable release
version without incrementing the dev counter. Release and dev builds both replace
the bundle in `dist`.

## Modernisation

- Responsive schedule tiles, theme-aware styling, keyboard focus indicators, and semantic list headers.
- Standard form controls in the configuration editor, replacing the legacy Material wrappers.
- Reactive integration readiness and explicit loading/error states, with retry on the overview.
- Empty installations can create their first schedule from the overview.
- Simplified ES module build, reproducible installs, and corrected release asset upload.

## Licence

[MIT](LICENSE).

### Wiser Home

The home page groups available controls into Heating, Hot water, Lighting & devices, and Moments. Empty device sections are hidden. Room and device tiles show the assigned schedule and open its controls; schedule choices are limited to compatible types. Hot water opens its fixed schedule, with copy and delete disabled. Moments open Home Assistant controls and can be timed using Home Assistant automations. The home page has no toolbar.

Creating a schedule from a room or device offers only its compatible schedule types. A single supported type is selected automatically, so you only need to enter the schedule name.

Forms use native browser buttons, text fields, range sliders and checkboxes, styled with Home Assistant theme colours. Home Assistant card, icon and dialog containers remain for dashboard integration.

Creating a schedule from a room or device automatically assigns it to that room or device and opens the new schedule in edit mode. Existing schedules can also be selected and edited before assigning them.

The schedule chooser uses Home Assistant’s native selector, loaded explicitly on first use. The chooser and create/rename name fields are limited to 420px and shrink to fit smaller screens.

The detail toolbar can export the selected schedule as a versioned JSON file and import a compatible export. Import validates the file and opens an editable draft; Save applies its times and settings to the current schedule while preserving its name and assignments.

Smart-plug tiles choose a regional socket icon using Home Assistant’s configured country. Unset or unmapped countries use a generic plug icon; browser language does not determine the socket type.

### Home screen selection

In the card editor, **Home screen → Devices / Schedules** chooses the starting view. Schedules is the default. Schedules shows schedule tiles; selecting one opens editing and a multiple-selection HA device picker containing compatible rooms or devices. **Apply assignments** adds or removes the selected schedule’s assignments without deleting schedules. Hot water retains its fixed assignment. Changing Home screen clears a pinned schedule so the chosen home screen can appear. YAML: `home_screen: schedules` or `home_screen: devices`.

The visual editor omits the legacy Title, pinned Schedule, and Layout fields. Existing YAML settings remain readable for compatibility.

Use **Hide card background** in Appearance to make the outer card transparent. This is independent of **Hide card borders**. YAML: `hide_card_background: true`.
