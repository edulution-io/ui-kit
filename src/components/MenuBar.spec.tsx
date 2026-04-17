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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuBar from './MenuBar';
import type { MenuBarProps, MenuBarConfig } from './MenuBar';

const createConfig = (overrides?: Partial<MenuBarConfig>): MenuBarConfig => ({
  title: 'Test App',
  icon: <span data-testid="header-icon">Icon</span>,
  color: 'bg-primary',
  onHeaderClick: vi.fn(),
  items: [
    {
      id: 'item-1',
      label: 'Item 1',
      icon: <span data-testid="item-1-icon">I1</span>,
      action: vi.fn(),
    },
    {
      id: 'item-2',
      label: 'Item 2',
      icon: <span data-testid="item-2-icon">I2</span>,
      action: vi.fn(),
      children: [
        { id: 'child-1', label: 'Child 1', action: vi.fn() },
        { id: 'child-2', label: 'Child 2', action: vi.fn() },
      ],
    },
  ],
  ...overrides,
});

const defaultProps: Omit<MenuBarProps, 'config'> = {
  activeItemId: 'item-1',
  isOpen: false,
  onOpenChange: vi.fn(),
  collapseLabel: 'Collapse',
  expandLabel: 'Expand',
};

let matchMediaMatches = false;

beforeEach(() => {
  matchMediaMatches = false;
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matchMediaMatches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});

describe('MenuBar', () => {
  it('renders header with title and icon', () => {
    const config = createConfig();
    render(
      <MenuBar
        {...defaultProps}
        config={config}
      />,
    );
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByTestId('header-icon')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    const config = createConfig();
    render(
      <MenuBar
        {...defaultProps}
        config={config}
      />,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('calls onHeaderClick when header is clicked', async () => {
    const user = userEvent.setup();
    const config = createConfig();
    render(
      <MenuBar
        {...defaultProps}
        config={config}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Test App/i }).closest('button'));
    expect(config.onHeaderClick).toHaveBeenCalledTimes(1);
  });

  it('calls item action when item is clicked', async () => {
    const user = userEvent.setup();
    const config = createConfig();
    render(
      <MenuBar
        {...defaultProps}
        config={config}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Item 1' }));
    expect(config.items[0].action).toHaveBeenCalledTimes(1);
  });

  it('applies active color class to active item', () => {
    const config = createConfig();
    render(
      <MenuBar
        {...defaultProps}
        config={config}
        activeItemId="item-1"
      />,
    );
    const itemButton = screen.getByRole('button', { name: 'Item 1' });
    expect(itemButton.className).toContain('bg-primary');
  });

  it('auto-expands active item with children', () => {
    const config = createConfig();
    render(
      <MenuBar
        {...defaultProps}
        config={config}
        activeItemId="item-2"
      />,
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('calls child action when child is clicked', async () => {
    const user = userEvent.setup();
    const config = createConfig();
    render(
      <MenuBar
        {...defaultProps}
        config={config}
        activeItemId="item-2"
      />,
    );
    await user.click(screen.getByText('Child 1'));
    expect(config.items[1].children[0].action).toHaveBeenCalledTimes(1);
  });

  it('highlights active child', () => {
    const config = createConfig();
    render(
      <MenuBar
        {...defaultProps}
        config={config}
        activeItemId="item-2"
        activeChildId="child-1"
      />,
    );
    const activeChild = screen.getByText('Child 1').closest('button');
    expect(activeChild?.className).toContain('bg-accent');
  });

  it('renders footer when provided', () => {
    const config = createConfig();
    render(
      <MenuBar
        {...defaultProps}
        config={config}
        footer={<div data-testid="footer">Footer</div>}
      />,
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders as aside in desktop mode', () => {
    matchMediaMatches = false;
    const config = createConfig();
    render(
      <MenuBar
        {...defaultProps}
        config={config}
      />,
    );
    expect(screen.getByText('Test App').closest('aside')).toBeInTheDocument();
  });
});
