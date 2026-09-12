/** Keep the existing element when HA loads the bundle through another resource URL. */
export function customElement(name: string) {
  return (constructor: CustomElementConstructor): void => {
    if (!customElements.get(name)) customElements.define(name, constructor);
  };
}
