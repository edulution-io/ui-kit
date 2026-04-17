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
import MenuBarLayout from './MenuBarLayout';

describe('MenuBarLayout', () => {
  it('renders children correctly', () => {
    render(<MenuBarLayout isDesktop>Menu content</MenuBarLayout>);
    expect(screen.getByText('Menu content')).toBeInTheDocument();
  });

  it('forwards ref to the inner div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuBarLayout
        ref={ref}
        isDesktop
      >
        Ref test
      </MenuBarLayout>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders as aside in desktop mode', () => {
    render(
      <MenuBarLayout
        isDesktop
        data-testid="layout"
      >
        Desktop
      </MenuBarLayout>,
    );
    const aside = screen.getByText('Desktop').closest('aside');
    expect(aside).toBeInTheDocument();
  });

  it('renders as fixed drawer in mobile mode', () => {
    render(
      <MenuBarLayout
        isDesktop={false}
        data-testid="layout"
      >
        Mobile
      </MenuBarLayout>,
    );
    const aside = screen.getByText('Mobile').closest('aside');
    expect(aside).not.toBeInTheDocument();
  });

  it('applies translate-x-0 when mobile drawer is open', () => {
    const { container } = render(
      <MenuBarLayout
        isDesktop={false}
        isOpen
      >
        Open
      </MenuBarLayout>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('translate-x-0');
    expect(wrapper.className).not.toContain('-translate-x-full');
  });

  it('applies -translate-x-full when mobile drawer is closed', () => {
    const { container } = render(
      <MenuBarLayout
        isDesktop={false}
        isOpen={false}
      >
        Closed
      </MenuBarLayout>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('-translate-x-full');
  });

  it('merges custom className', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuBarLayout
        ref={ref}
        isDesktop
        className="my-custom-class"
      >
        Styled
      </MenuBarLayout>,
    );
    expect(ref.current?.className).toContain('my-custom-class');
  });
});
