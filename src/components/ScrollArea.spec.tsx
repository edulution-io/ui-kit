/*
 * Copyright (C) [2025] [Netzint GmbH]
 * All rights reserved.
 *
 * This software is dual-licensed under the terms of:
 *
 * 1. The GNU Affero General Public License (AGPL-3.0-or-later), as published by the Free Software Foundation.
 *    You may use, modify and distribute this software under the terms of the AGPL, provided that you comply with its conditions.
 *
 *    A copy of the license can be found at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * OR
 *
 * 2. A commercial license agreement with Netzint GmbH. Licensees holding a valid commercial license from Netzint GmbH
 *    may use this software in accordance with the terms contained in such written agreement, without the obligations imposed by the AGPL.
 *
 * If you are uncertain which license applies to your use case, please contact us at info@netzint.de for clarification.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define, @typescript-eslint/no-var-requires, global-require, jsx-a11y/label-has-associated-control, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/role-has-required-aria-props, react/button-has-type, react/display-name, react/no-array-index-key, no-underscore-dangle, no-plusplus */

vi.mock('@radix-ui/react-scroll-area', () => {
  const React = require('react');
  const Root = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      data-testid="scrollarea-root"
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ));
  Root.displayName = 'ScrollArea';
  const Viewport = ({ children, className }: any) => (
    <div
      data-testid="scrollarea-viewport"
      className={className}
    >
      {children}
    </div>
  );
  const ScrollAreaScrollbar = React.forwardRef(({ children, className, orientation, ...props }: any, ref: any) => (
    <div
      data-testid="scrollarea-scrollbar"
      className={className}
      data-orientation={orientation}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ));
  ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar';
  const ScrollAreaThumb = ({ className }: any) => (
    <div
      data-testid="scrollarea-thumb"
      className={className}
    />
  );
  const Corner = () => <div data-testid="scrollarea-corner" />;
  return { Root, Viewport, ScrollAreaScrollbar, ScrollAreaThumb, Corner };
});

vi.mock('../utils/cn', () => ({
  default: (...args: any[]) => args.filter(Boolean).join(' '),
}));

import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { ScrollArea, ScrollBar } from './ScrollArea';

describe('ScrollArea', () => {
  it('renders children inside the scroll area', () => {
    render(
      <ScrollArea>
        <p>Scrollable content</p>
      </ScrollArea>,
    );
    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  it('applies custom className to the root', () => {
    render(
      <ScrollArea className="h-[200px]">
        <p>Content</p>
      </ScrollArea>,
    );
    expect(screen.getByTestId('scrollarea-root').className).toContain('h-[200px]');
  });

  it('renders ScrollBar with vertical orientation by default', () => {
    render(
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>,
    );
    const scrollbar = screen.getByTestId('scrollarea-scrollbar');
    expect(scrollbar).toHaveAttribute('data-orientation', 'vertical');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref}>
        <p>Content</p>
      </ScrollArea>,
    );
    expect(ref.current).toBe(screen.getByTestId('scrollarea-root'));
  });
});

describe('ScrollBar', () => {
  it('applies vertical orientation classes by default', () => {
    render(<ScrollBar />);
    const scrollbar = screen.getByTestId('scrollarea-scrollbar');
    expect(scrollbar).toHaveAttribute('data-orientation', 'vertical');
    expect(scrollbar.className).toContain('h-full w-2.5 border-l border-l-transparent p-[1px]');
  });

  it('applies horizontal orientation classes', () => {
    render(<ScrollBar orientation="horizontal" />);
    const scrollbar = screen.getByTestId('scrollarea-scrollbar');
    expect(scrollbar).toHaveAttribute('data-orientation', 'horizontal');
    expect(scrollbar.className).toContain('h-2.5 flex-col border-t border-t-transparent p-[1px]');
  });

  it('applies custom className', () => {
    render(<ScrollBar className="custom-scrollbar" />);
    expect(screen.getByTestId('scrollarea-scrollbar').className).toContain('custom-scrollbar');
  });

  it('forwards ref to the scrollbar element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ScrollBar ref={ref} />);
    expect(ref.current).toBe(screen.getByTestId('scrollarea-scrollbar'));
  });
});
