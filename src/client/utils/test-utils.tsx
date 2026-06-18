import { render as rtlRender, type RenderOptions, type RenderResult } from '@testing-library/react';
import { type ReactElement } from 'react';
import { I18nProvider } from '../i18n';

/**
 * Wraps a component with I18nProvider for testing.
 */
function I18nWrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}

/**
 * Custom render that automatically provides I18n context.
 * Any wrapper passed via options is composed *inside* the I18nProvider.
 */
export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  },
): RenderResult {
  const { wrapper: UserWrapper, ...rest } = options ?? {};

  const CombinedWrapper = UserWrapper
    ? ({ children }: { children: React.ReactNode }) => (
        <I18nWrapper>
          <UserWrapper>{children}</UserWrapper>
        </I18nWrapper>
      )
    : I18nWrapper;

  return rtlRender(ui, { wrapper: CombinedWrapper, ...rest });
}

// Re-export everything else from testing-library
export { screen, fireEvent, waitFor, act, within } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
