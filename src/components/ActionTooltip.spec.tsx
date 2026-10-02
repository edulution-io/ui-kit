/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define, jsx-a11y/label-has-associated-control, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/role-has-required-aria-props, react/button-has-type, react/display-name, react/no-array-index-key, no-underscore-dangle, no-plusplus */

vi.mock('@radix-ui/react-tooltip', () => ({
  Provider: ({ children }: any) => <div>{children}</div>,
  Root: ({ children }: any) => <div>{children}</div>,
  Trigger: ({ children, asChild, ...props }: any) => (
    <div
      data-testid="tooltip-trigger"
      {...props}
    >
      {children}
    </div>
  ),
  Portal: ({ children }: any) => <div>{children}</div>,
  Content: ({ children, ...props }: any) => (
    <div
      data-testid="tooltip-content"
      {...props}
    >
      {children}
    </div>
  ),
  TooltipContent: ({ children, ...props }: any) => (
    <div
      data-testid="tooltip-content"
      {...props}
    >
      {children}
    </div>
  ),
  TooltipTrigger: ({ children, asChild, ...props }: any) => (
    <div
      data-testid="tooltip-trigger"
      {...props}
    >
      {children}
    </div>
  ),
}));

vi.mock('./Tooltip', () => ({
  Tooltip: ({ children, ...props }: any) => (
    <div
      data-testid="tooltip-root"
      {...props}
    >
      {children}
    </div>
  ),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionTooltip from './ActionTooltip';

describe('ActionTooltip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger element', () => {
    render(
      <ActionTooltip
        trigger={<span>Click me</span>}
        tooltipText="Tooltip text"
      />,
    );

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onAction on click', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <ActionTooltip
        trigger={<span>Click me</span>}
        onAction={handleAction}
        tooltipText="Tooltip text"
      />,
    );

    await user.click(screen.getByRole('button'));

    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events (Enter, Space)', () => {
    const handleAction = vi.fn();

    render(
      <ActionTooltip
        trigger={<span>Press me</span>}
        onAction={handleAction}
        tooltipText="Tooltip text"
      />,
    );

    const button = screen.getByRole('button');

    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleAction).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(button, { key: ' ' });
    expect(handleAction).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(button, { key: 'Tab' });
    expect(handleAction).toHaveBeenCalledTimes(2);
  });

  it('renders tooltip text', () => {
    render(
      <ActionTooltip
        trigger={<span>Hover me</span>}
        tooltipText="Help text"
      />,
    );

    expect(screen.getByText('Help text')).toBeInTheDocument();
  });

  it('passes openOnSide to TooltipContent', () => {
    render(
      <ActionTooltip
        trigger={<span>Trigger</span>}
        tooltipText="Side tooltip"
        openOnSide="bottom"
      />,
    );

    expect(screen.getByTestId('tooltip-content')).toHaveAttribute('side', 'bottom');
  });

  it('passes className to TooltipContent', () => {
    render(
      <ActionTooltip
        trigger={<span>Trigger</span>}
        tooltipText="Styled"
        className="custom-class"
      />,
    );

    const content = screen.getByTestId('tooltip-content');
    expect(content.className).toContain('custom-class');
  });

  it('does not throw when onAction is not provided', () => {
    render(
      <ActionTooltip
        trigger={<span>No action</span>}
        tooltipText="Tooltip"
      />,
    );

    const button = screen.getByRole('button');
    expect(() => fireEvent.click(button)).not.toThrow();
    expect(() => fireEvent.keyDown(button, { key: 'Enter' })).not.toThrow();
  });
});
