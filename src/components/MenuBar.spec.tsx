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
        isChildActive={(item) => item.id === 'child-1'}
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

  describe('deeply nested submenus', () => {
    const createNestedConfig = () =>
      createConfig({
        items: [
          {
            id: 'item-1',
            label: 'Item 1',
            icon: <span data-testid="item-1-icon">I1</span>,
            action: vi.fn(),
            children: [
              {
                id: 'child-1',
                label: 'Child 1',
                action: vi.fn(),
                children: [
                  { id: 'grandchild-1', label: 'Grandchild 1', action: vi.fn() },
                  { id: 'grandchild-2', label: 'Grandchild 2', action: vi.fn() },
                ],
              },
              { id: 'child-2', label: 'Child 2', action: vi.fn() },
            ],
          },
        ],
      });

    it('auto-expands ancestors of active child at depth 2', () => {
      const config = createNestedConfig();
      render(
        <MenuBar
          {...defaultProps}
          config={config}
          activeItemId="item-1"
          isChildActive={(item) => item.id === 'grandchild-1'}
        />,
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Grandchild 1')).toBeInTheDocument();
    });

    it('calls correct action for deeply nested child click', async () => {
      const user = userEvent.setup();
      const config = createNestedConfig();
      render(
        <MenuBar
          {...defaultProps}
          config={config}
          activeItemId="item-1"
          isChildActive={(item) => item.id === 'grandchild-1'}
        />,
      );
      await user.click(screen.getByText('Grandchild 1'));
      const grandchild = config.items[0].children?.[0].children?.[0];
      expect(grandchild?.action).toHaveBeenCalledTimes(1);
    });

    it('single-level children still work identically (backward compat)', async () => {
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
      expect(config.items[1].children?.[0].action).toHaveBeenCalledTimes(1);
    });

    it('does not highlight any child when isChildActive returns false everywhere', () => {
      const config = createNestedConfig();
      render(
        <MenuBar
          {...defaultProps}
          config={config}
          activeItemId="item-1"
          isChildActive={() => false}
        />,
      );
      const grandchild = screen.getByText('Grandchild 1').closest('button');
      expect(grandchild?.className).not.toContain('font-bold');
    });

    it('fires onChildClick before the child action runs', async () => {
      const user = userEvent.setup();
      const onChildClick = vi.fn();
      const childAction = vi.fn();
      const config = createConfig({
        items: [
          {
            id: 'item-1',
            label: 'Item 1',
            icon: <span>I1</span>,
            action: vi.fn(),
            children: [{ id: 'child-1', label: 'Child 1', action: childAction }],
          },
        ],
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
          activeItemId="item-1"
          onChildClick={onChildClick}
        />,
      );
      await user.click(screen.getByText('Child 1'));
      expect(onChildClick).toHaveBeenCalledWith('child-1');
      expect(childAction).toHaveBeenCalledTimes(1);
      const onChildClickOrder = onChildClick.mock.invocationCallOrder[0];
      const childActionOrder = childAction.mock.invocationCallOrder[0];
      expect(onChildClickOrder).toBeLessThan(childActionOrder);
    });

    it('switches to drill-down view at maxDepth and restores via back button', async () => {
      const user = userEvent.setup();
      const config = createNestedConfig();
      render(
        <MenuBar
          {...defaultProps}
          config={config}
          activeItemId="item-1"
          maxDepth={0}
          backLabel="Zurück"
        />,
      );
      expect(screen.queryByRole('button', { name: 'Zurück' })).not.toBeInTheDocument();
      expect(screen.queryByText('Grandchild 1')).not.toBeInTheDocument();
      await user.click(screen.getByText('Child 1'));
      const backButton = screen.getByRole('button', { name: 'Zurück' });
      expect(backButton).toBeInTheDocument();
      expect(screen.getByText('Grandchild 1')).toBeInTheDocument();
      expect(screen.getByText('Grandchild 2')).toBeInTheDocument();
      await user.click(backButton);
      expect(screen.queryByRole('button', { name: 'Zurück' })).not.toBeInTheDocument();
      expect(screen.queryByText('Grandchild 1')).not.toBeInTheDocument();
      expect(screen.getByText('Child 1')).toBeInTheDocument();
    });

    it('collapses previous top-level when activeItemId changes (single-expand)', () => {
      const config = createConfig();
      const { rerender } = render(
        <MenuBar
          {...defaultProps}
          config={config}
          activeItemId="item-2"
        />,
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      const item2ChildrenRegion = screen.getByText('Child 1').closest('[role="region"]');
      expect(item2ChildrenRegion?.className).toContain('grid-rows-[1fr]');

      rerender(
        <MenuBar
          {...defaultProps}
          config={config}
          activeItemId="item-1"
        />,
      );
      const collapsedRegion = screen.getByText('Child 1').closest('[role="region"]');
      expect(collapsedRegion?.className).toContain('grid-rows-[0fr]');
    });

    it('preserves drill-down state across parent re-renders with fresh config refs', async () => {
      const user = userEvent.setup();
      const makeConfig = () => createNestedConfig();
      const { rerender } = render(
        <MenuBar
          {...defaultProps}
          config={makeConfig()}
          activeItemId="item-1"
          maxDepth={0}
          backLabel="Zurück"
        />,
      );
      await user.click(screen.getByText('Child 1'));
      expect(screen.getByRole('button', { name: 'Zurück' })).toBeInTheDocument();
      expect(screen.getByText('Grandchild 1')).toBeInTheDocument();
      rerender(
        <MenuBar
          {...defaultProps}
          config={makeConfig()}
          activeItemId="item-1"
          maxDepth={0}
          backLabel="Zurück"
        />,
      );
      expect(screen.getByRole('button', { name: 'Zurück' })).toBeInTheDocument();
      expect(screen.getByText('Grandchild 1')).toBeInTheDocument();
    });

    it('reflects updated isChildActive predicate on re-render', () => {
      const config = createNestedConfig();
      const { rerender } = render(
        <MenuBar
          {...defaultProps}
          config={config}
          activeItemId="item-1"
          isChildActive={(item) => item.id === 'grandchild-1'}
        />,
      );
      expect(screen.getByText('Grandchild 1').closest('button')?.className).toContain('font-bold');
      rerender(
        <MenuBar
          {...defaultProps}
          config={config}
          activeItemId="item-1"
          isChildActive={(item) => item.id === 'grandchild-2'}
        />,
      );
      expect(screen.getByText('Grandchild 2').closest('button')?.className).toContain('font-bold');
      expect(screen.getByText('Grandchild 1').closest('button')?.className).not.toContain('font-bold');
    });
  });
});
