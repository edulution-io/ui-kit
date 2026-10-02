/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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

  it('uses the liquid glass panel surface in desktop mode', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuBarLayout
        ref={ref}
        isDesktop
      >
        Desktop
      </MenuBarLayout>,
    );
    expect(ref.current?.className).toContain('liquid-glass');
    expect(ref.current?.className).toContain('liquid-glass-panel');
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

  it('uses the liquid glass panel surface in mobile mode', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuBarLayout
        ref={ref}
        isDesktop={false}
      >
        Mobile
      </MenuBarLayout>,
    );
    expect(ref.current?.className).toContain('liquid-glass');
    expect(ref.current?.className).toContain('liquid-glass-panel');
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
