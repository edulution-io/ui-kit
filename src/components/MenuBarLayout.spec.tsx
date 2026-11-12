/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
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

  it('uses the plain liquid glass surface of the app sidebar in desktop mode', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuBarLayout
        ref={ref}
        isDesktop
      >
        Desktop
      </MenuBarLayout>,
    );
    expect(ref.current).toHaveClass('liquid-glass');
    expect(ref.current).not.toHaveClass('liquid-glass-panel');
    expect(ref.current).not.toHaveClass('liquid-glass-overlay');
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

  it('uses the tinted liquid glass overlay surface of the mobile app sidebar so it stays legible over page content', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuBarLayout
        ref={ref}
        isDesktop={false}
      >
        Mobile
      </MenuBarLayout>,
    );
    expect(ref.current).toHaveClass('liquid-glass');
    expect(ref.current).toHaveClass('liquid-glass-overlay');
    expect(ref.current).not.toHaveClass('liquid-glass-panel');
  });

  it('widens the mobile drawer by the left safe area and keeps its content clear of it', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuBarLayout
        ref={ref}
        isDesktop={false}
      >
        Mobile
      </MenuBarLayout>,
    );
    expect(ref.current).toHaveClass('w-[calc(16rem+env(safe-area-inset-left))]', 'pl-[env(safe-area-inset-left)]');
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
