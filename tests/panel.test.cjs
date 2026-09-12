const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const vm = require("node:vm");

function setup() {
  class Element {
    constructor() { this.listeners = {}; }
    addEventListener(name, callback) { this.listeners[name] = callback; }
    setAttribute() {}
    removeAttribute() {}
    append(child) { (this.children ||= []).push(child); }
    showModal() { this.open = true; }
    close() { this.open = false; }
    static panelApiVersion = 1;
    static async getConfigElement() { return new Element(); }
    replaceChildren(...children) { this.children = children; }
    setConfig(config) { this.config = config; }
    dispatchEvent(event) { this.event = event; }
    attachShadow() {
      const main = new Element();
      const elements = new Map();
      this.shadowRoot = {
        querySelector: () => main,
        getElementById: (id) => {
          if (!elements.has(id)) elements.set(id, new Element());
          return elements.get(id);
        },
      };
    }
  }
  const registry = new Map([["wiser-schedule-card", Element]]);
  const context = vm.createContext({
    HTMLElement: Element,
    window: { loadCardHelpers: async () => ({}) },
    CustomEvent: class { constructor(type, options) { Object.assign(this, { type }, options); } },
    customElements: { get: (key) => registry.get(key), define: (key, value) => registry.set(key, value) },
    document: { createElement: () => new Element() },
    console: { error() {} },
  });
  vm.runInContext(readFileSync(resolve(__dirname,
    "../src/wiser-schedules-panel.js"), "utf8"), context);
  return new (registry.get("wiser-schedules-panel"))();
}

test("panel creates a schedule editor per enabled hub and forwards hass updates", () => {
  const panel = setup();
  const hass = { states: {} };
  panel.hass = hass;
  panel.panel = { config: { hubs: ["first", "second"] } };
  const cards = panel.shadowRoot.querySelector("main").children;
  assert.equal(cards.length, 2);
  assert.equal(cards[0].config.hub, "first");
  assert.equal(cards[1].config.hub, "second");
  assert.equal(cards[0].hass, hass);
  const updated = { states: { example: {} } };
  panel.hass = updated;
  assert.equal(cards[1].hass, updated);
  panel.panel = { config: { hubs: ["first", "second"] } };
  assert.equal(panel.shadowRoot.querySelector("main").children[0], cards[0]);
});

test("panel accepts hass after configuration and replaces cards when hubs change", () => {
  const panel = setup();
  panel.panel = { config: { hubs: ["first"] } };
  const hass = {};
  panel.hass = hass;
  assert.equal(panel.shadowRoot.querySelector("main").children[0].hass, hass);
  panel.panel = { config: { hubs: ["second"] } };
  const cards = panel.shadowRoot.querySelector("main").children;
  assert.equal(cards.length, 1);
  assert.equal(cards[0].config.hub, "second");
  assert.equal(cards[0].hass, hass);
});

test("menu button dispatches Home Assistant's sidebar event", () => {
  const panel = setup();
  panel.shadowRoot.getElementById("menu").listeners.click();
  assert.equal(panel.event.type, "hass-toggle-menu");
  assert.equal(panel.event.composed, true);
  assert.equal(panel.event.bubbles, true);
});

test("load errors display a retry action", async () => {
  const panel = setup();
  panel.panel = { config: { hubs: null } };
  const children = panel.shadowRoot.querySelector("main").children;
  assert.ok(children[0].textContent);
  assert.equal(children[1].textContent, "Retry");
  panel._config = { hubs: ["recovered"] };
  await children[1].listeners.click();
  assert.equal(panel.shadowRoot.querySelector("main").children[0].config.hub, "recovered");
});


test("cog saves shared integration config over websocket", async () => {
  const panel = setup();
  const calls = [];
  panel.hass = { user: { is_admin: true }, callWS: async (msg) => calls.push(msg) };
  panel.panel = { config: { hubs: ["hub"] } };
  await panel.shadowRoot.getElementById("settings").listeners.click();
  assert.equal(panel.shadowRoot.getElementById("editor-dialog").open, true);
  panel._editors[0].listeners["config-changed"]({
    stopPropagation() {}, detail: { config: { name: "My heating", hide_hw_schedule: true } },
  });
  await panel.shadowRoot.getElementById("save").listeners.click();
  assert.equal(calls[0].type, "wiser/schedules_panel/configure");
  assert.equal(calls[0].configs.hub.hide_hw_schedule, true);
  assert.equal(panel.shadowRoot.getElementById("editor-dialog").open, false);
  assert.equal(panel._cards[0].config.hide_hw_schedule, true);
  const reloaded = setup();
  reloaded.panel = { config: { hubs: ["hub"], card_configs: calls[0].configs } };
  assert.equal(reloaded._cards[0].config.name, "My heating");
});

test("failed save keeps editor open and offers retry", async () => {
  const panel = setup();
  panel.hass = { user: { is_admin: true }, callWS: async () => { throw Error("Offline"); } };
  panel.panel = { config: { hubs: ["hub"] } };
  await panel._openEditor();
  await panel._saveEditor();
  assert.equal(panel.shadowRoot.getElementById("editor-dialog").open, true);
  assert.match(panel.shadowRoot.getElementById("editor-error").textContent, /Unable to save/);
  assert.equal(panel.shadowRoot.getElementById("save").disabled, false);
});

test("Cancel leaves the card unchanged", async () => {
  const panel = setup();
  panel.hass = { user: { is_admin: true } };
  panel.panel = { config: { hubs: ["hub"] } };
  await panel._openEditor();
  panel._editors[0].listeners["config-changed"]({
    stopPropagation() {}, detail: { config: { name: "Discard me" } },
  });
  panel.shadowRoot.getElementById("cancel").listeners.click();
  assert.equal(panel._cards[0].config.name, "Wiser Schedules");
  await panel._openEditor();
  assert.equal(panel._editors[0].config.name, "Wiser Schedules");
});
