/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define, @typescript-eslint/no-var-requires, global-require, jsx-a11y/label-has-associated-control, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/role-has-required-aria-props, react/button-has-type, react/display-name, react/no-array-index-key, no-underscore-dangle, no-plusplus */

vi.mock('@radix-ui/react-popover', () => {
  const React = require('react');
  const Root = ({ children }: any) => <div data-testid="popover-root">{children}</div>;
  const Trigger = ({ children, ...props }: any) => (
    <button
      data-testid="popover-trigger"
      {...props}
    >
      {children}
    </button>
  );
  const Anchor = ({ children }: any) => <div data-testid="popover-anchor">{children}</div>;
  const Portal = ({ children }: any) => <div data-testid="popover-portal">{children}</div>;
  const Content = React.forwardRef(({ children, className, align, sideOffset, ...props }: any, ref: any) => (
    <div
      data-testid="popover-content"
      className={className}
      data-align={align}
      data-side-offset={sideOffset}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ));
  Content.displayName = 'PopoverContent';
  return { Root, Trigger, Anchor, Portal, Content };
});

vi.mock('../utils/cn', () => ({
  default: (...args: any[]) => args.filter(Boolean).join(' '),
}));

import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Popover, PopoverContent } from './Popover';

describe('PopoverContent', () => {
  it('renders children inside a portal', () => {
    render(
      <Popover>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>,
    );
    expect(screen.getByTestId('popover-portal')).toBeInTheDocument();
    expect(screen.getByText('Popover body')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Popover>
        <PopoverContent className="w-80">Content</PopoverContent>
      </Popover>,
    );
    expect(screen.getByTestId('popover-content').className).toContain('w-80');
  });

  it('uses the contrast-safe glass panel surface', () => {
    render(
      <Popover>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const content = screen.getByTestId('popover-content');
    expect(content.className).toContain('liquid-glass-panel');
    expect(content.className).toContain('text-foreground');
  });

  it('uses align center by default', () => {
    render(
      <Popover>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    expect(screen.getByTestId('popover-content')).toHaveAttribute('data-align', 'center');
  });

  it('uses sideOffset of 2 by default', () => {
    render(
      <Popover>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    expect(screen.getByTestId('popover-content')).toHaveAttribute('data-side-offset', '2');
  });

  it('allows overriding align and sideOffset', () => {
    render(
      <Popover>
        <PopoverContent
          align="start"
          sideOffset={8}
        >
          Content
        </PopoverContent>
      </Popover>,
    );
    const content = screen.getByTestId('popover-content');
    expect(content).toHaveAttribute('data-align', 'start');
    expect(content).toHaveAttribute('data-side-offset', '8');
  });

  it('forwards ref to the content element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover>
        <PopoverContent ref={ref}>Content</PopoverContent>
      </Popover>,
    );
    expect(ref.current).toBe(screen.getByTestId('popover-content'));
  });
});
