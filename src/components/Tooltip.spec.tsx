/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define, @typescript-eslint/no-var-requires, global-require, jsx-a11y/label-has-associated-control, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/role-has-required-aria-props, react/button-has-type, react/display-name, react/no-array-index-key, no-underscore-dangle, no-plusplus */

vi.mock('@radix-ui/react-tooltip', () => {
  const React = require('react');
  const Provider = ({ children }: any) => <div data-testid="tooltip-provider">{children}</div>;
  const Root = ({ children }: any) => <div data-testid="tooltip-root">{children}</div>;
  const Trigger = ({ children }: any) => <div data-testid="tooltip-trigger">{children}</div>;
  const Portal = ({ children }: any) => <div data-testid="tooltip-portal">{children}</div>;
  const Content = React.forwardRef(({ children, className, sideOffset, ...props }: any, ref: any) => (
    <div
      data-testid="tooltip-content"
      className={className}
      data-side-offset={sideOffset}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ));
  Content.displayName = 'TooltipContent';
  return { Provider, Root, Trigger, Portal, Content };
});

vi.mock('../utils/cn', () => ({
  default: (...args: any[]) => args.filter(Boolean).join(' '),
}));

import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './Tooltip';

describe('TooltipContent', () => {
  it('renders children inside a portal', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByTestId('tooltip-portal')).toBeInTheDocument();
    expect(screen.getByText('Tooltip text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent className="custom-tooltip">Info</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByTestId('tooltip-content').className).toContain('custom-tooltip');
  });

  it('uses sideOffset of 2 by default', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Info</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-side-offset', '2');
  });

  it('allows overriding sideOffset', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent sideOffset={10}>Info</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-side-offset', '10');
  });

  it('forwards ref to the content element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent ref={ref}>Info</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(ref.current).toBe(screen.getByTestId('tooltip-content'));
  });
});
