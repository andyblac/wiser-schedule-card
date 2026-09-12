import { css } from 'lit';

export const toolbarColors = css`
  .tool {
    color: var(--secondary-text-color);
  }
  .tool[aria-pressed='true'],
  .tool:not(:disabled):hover {
    color: var(--primary-color);
  }
  .tool:disabled {
    color: var(--disabled-text-color);
    opacity: 1;
  }
`;
