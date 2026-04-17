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
