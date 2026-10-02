/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import MenuBarItemList from './MenuBarItemList';

describe('MenuBarItemList', () => {
  it('renders children correctly', () => {
    render(
      <MenuBarItemList>
        <div data-testid="child-1">Item 1</div>
        <div data-testid="child-2">Item 2</div>
      </MenuBarItemList>,
    );
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('forwards ref to the div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<MenuBarItemList ref={ref}>Content</MenuBarItemList>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies default classes for overflow and padding', () => {
    const ref = createRef<HTMLDivElement>();
    render(<MenuBarItemList ref={ref}>Content</MenuBarItemList>);
    expect(ref.current?.className).toContain('flex-1');
    expect(ref.current?.className).toContain('overflow-y-auto');
    expect(ref.current?.className).toContain('pb-10');
  });

  it('merges custom className with defaults', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuBarItemList
        ref={ref}
        className="my-custom-class"
      >
        Content
      </MenuBarItemList>,
    );
    expect(ref.current?.className).toContain('my-custom-class');
    expect(ref.current?.className).toContain('flex-1');
  });

  it('passes additional HTML attributes to the div', () => {
    render(
      <MenuBarItemList
        data-testid="item-list"
        role="list"
      >
        Content
      </MenuBarItemList>,
    );
    const element = screen.getByTestId('item-list');
    expect(element).toHaveAttribute('role', 'list');
  });

  it('renders without children', () => {
    const ref = createRef<HTMLDivElement>();
    render(<MenuBarItemList ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.childNodes).toHaveLength(0);
  });
});
