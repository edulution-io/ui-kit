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
  it('renders header with title (icon slot was removed)', () => {
    const config = createConfig();
    render(
      <MenuBar
        {...defaultProps}
        config={config}
      />,
    );
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.queryByTestId('header-icon')).not.toBeInTheDocument();
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

  describe('context actions (kebab) integration', () => {
    it('renders the kebab trigger on a top-level item that supplies contextActions', () => {
      const config = createConfig({
        items: [
          {
            id: 'item-1',
            label: 'Item 1',
            icon: <span>I1</span>,
            action: vi.fn(),
            contextActions: [{ id: 'rename', label: 'Rename', onClick: vi.fn() }],
          },
        ],
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
          itemActionsLabel="Manage entry"
        />,
      );
      expect(screen.getByRole('button', { name: 'Manage entry' })).toBeInTheDocument();
    });

    it('does not render a kebab when an item has no contextActions', () => {
      const config = createConfig();
      render(
        <MenuBar
          {...defaultProps}
          config={config}
          itemActionsLabel="Manage entry"
        />,
      );
      expect(screen.queryByRole('button', { name: 'Manage entry' })).not.toBeInTheDocument();
    });

    it('opens the kebab menu and invokes the action onClick through MenuBarItem', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const config = createConfig({
        items: [
          {
            id: 'item-1',
            label: 'Item 1',
            icon: <span>I1</span>,
            action: vi.fn(),
            contextActions: [{ id: 'rename', label: 'Rename', onClick }],
          },
        ],
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
          itemActionsLabel="Manage entry"
        />,
      );
      await user.click(screen.getByRole('button', { name: 'Manage entry' }));
      await user.click(screen.getByText('Rename'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('propagates itemActionsLabel down to a child kebab via MenuBarSubItem', () => {
      const config = createConfig({
        items: [
          {
            id: 'item-1',
            label: 'Item 1',
            icon: <span>I1</span>,
            action: vi.fn(),
            children: [
              {
                id: 'child-1',
                label: 'Child 1',
                action: vi.fn(),
                contextActions: [{ id: 'delete', label: 'Delete', onClick: vi.fn() }],
              },
            ],
          },
        ],
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
          activeItemId="item-1"
          itemActionsLabel="Manage entry"
        />,
      );
      expect(screen.getByRole('button', { name: 'Manage entry' })).toBeInTheDocument();
    });
  });

  describe('search integration (opt-in)', () => {
    const createDeepConfig = (searchOverride?: MenuBarConfig['search']): MenuBarConfig =>
      createConfig({
        items: [
          {
            id: 'root',
            label: 'Root',
            icon: <span>R</span>,
            action: vi.fn(),
            children: [
              {
                id: 'branch-a',
                label: 'BranchAlpha',
                action: vi.fn(),
                children: [
                  { id: 'leaf-target', label: 'TargetLeaf', action: vi.fn() },
                  { id: 'leaf-other', label: 'OtherLeaf', action: vi.fn() },
                ],
              },
              { id: 'branch-b', label: 'BranchBeta', action: vi.fn() },
            ],
          },
          {
            id: 'sibling',
            label: 'Sibling',
            icon: <span>S</span>,
            action: vi.fn(),
          },
        ],
        search: searchOverride,
      });

    it('does not render a search input when config.search is absent', () => {
      const config = createDeepConfig();
      render(
        <MenuBar
          {...defaultProps}
          config={config}
        />,
      );
      expect(screen.queryByPlaceholderText('Find…')).not.toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('renders the search input with the consumer placeholder when config.search is set', () => {
      const config = createDeepConfig({
        query: '',
        onQueryChange: vi.fn(),
        placeholder: 'Find pages',
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
        />,
      );
      expect(screen.getByPlaceholderText('Find pages')).toBeInTheDocument();
    });

    it('leaves items visible when the query is empty', () => {
      const config = createDeepConfig({
        query: '',
        onQueryChange: vi.fn(),
        placeholder: 'Find',
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
        />,
      );
      expect(screen.getByText('Root')).toBeInTheDocument();
      expect(screen.getByText('Sibling')).toBeInTheDocument();
    });

    it('treats a whitespace-only query as empty (no filtering)', () => {
      const config = createDeepConfig({
        query: '   ',
        onQueryChange: vi.fn(),
        placeholder: 'Find',
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
        />,
      );
      expect(screen.getByText('Root')).toBeInTheDocument();
      expect(screen.getByText('Sibling')).toBeInTheDocument();
      expect(screen.queryByText('No matches')).not.toBeInTheDocument();
    });

    it('keeps a top-level match visible and filters siblings out', () => {
      const config = createDeepConfig({
        query: 'sibling',
        onQueryChange: vi.fn(),
        placeholder: 'Find',
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
        />,
      );
      expect(screen.getByText('Sibling')).toBeInTheDocument();
      expect(screen.queryByText('Root')).not.toBeInTheDocument();
    });

    it('auto-expands ancestors when only a deep descendant matches', () => {
      const config = createDeepConfig({
        query: 'targetleaf',
        onQueryChange: vi.fn(),
        placeholder: 'Find',
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
          activeItemId="sibling"
        />,
      );
      expect(screen.getByText('Root')).toBeInTheDocument();
      expect(screen.getByText('BranchAlpha')).toBeInTheDocument();
      expect(screen.getByText('TargetLeaf')).toBeInTheDocument();
      expect(screen.queryByText('OtherLeaf')).not.toBeInTheDocument();
      expect(screen.queryByText('BranchBeta')).not.toBeInTheDocument();
      expect(screen.queryByText('Sibling')).not.toBeInTheDocument();
    });

    it('matches case-insensitively', () => {
      const config = createDeepConfig({
        query: 'SIBLING',
        onQueryChange: vi.fn(),
        placeholder: 'Find',
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
        />,
      );
      expect(screen.getByText('Sibling')).toBeInTheDocument();
    });

    it('renders the consumer no-matches label when nothing matches', () => {
      const config = createDeepConfig({
        query: 'zzz-no-hit',
        onQueryChange: vi.fn(),
        placeholder: 'Find',
        noMatchesLabel: 'Nothing here',
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
        />,
      );
      expect(screen.getByText('Nothing here')).toBeInTheDocument();
      expect(screen.queryByText('Root')).not.toBeInTheDocument();
    });

    it('falls back to a default "No matches" label when none provided', () => {
      const config = createDeepConfig({
        query: 'zzz-no-hit',
        onQueryChange: vi.fn(),
        placeholder: 'Find',
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
        />,
      );
      expect(screen.getByText('No matches')).toBeInTheDocument();
    });

    it('calls onQueryChange with empty string when the clear button is pressed', async () => {
      const onQueryChange = vi.fn();
      const config = createDeepConfig({
        query: 'sibling',
        onQueryChange,
        placeholder: 'Find',
      });
      const user = userEvent.setup();
      render(
        <MenuBar
          {...defaultProps}
          config={config}
        />,
      );
      await user.click(screen.getByRole('button', { name: 'Clear' }));
      expect(onQueryChange).toHaveBeenCalledWith('');
    });

    it('clears via Escape without bubbling the key event to wrapping dialogs', async () => {
      const onQueryChange = vi.fn();
      const parentKeyDown = vi.fn();
      const config = createDeepConfig({
        query: 'sibling',
        onQueryChange,
        placeholder: 'Find',
      });
      const user = userEvent.setup();
      render(
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div onKeyDown={parentKeyDown}>
          <MenuBar
            {...defaultProps}
            config={config}
          />
        </div>,
      );
      screen.getByPlaceholderText('Find').focus();
      await user.keyboard('{Escape}');
      expect(onQueryChange).toHaveBeenCalledWith('');
      expect(parentKeyDown).not.toHaveBeenCalled();
    });

    it('fires onSubmit with the trimmed query on Enter', async () => {
      const onSubmit = vi.fn();
      const config = createDeepConfig({
        query: '  target  ',
        onQueryChange: vi.fn(),
        placeholder: 'Find',
        onSubmit,
      });
      const user = userEvent.setup();
      render(
        <MenuBar
          {...defaultProps}
          config={config}
        />,
      );
      screen.getByPlaceholderText('Find').focus();
      await user.keyboard('{Enter}');
      expect(onSubmit).toHaveBeenCalledWith('target');
    });

    it('does not fire onSubmit on Enter when the query is effectively empty', async () => {
      const onSubmit = vi.fn();
      const config = createDeepConfig({
        query: '   ',
        onQueryChange: vi.fn(),
        placeholder: 'Find',
        onSubmit,
      });
      const user = userEvent.setup();
      render(
        <MenuBar
          {...defaultProps}
          config={config}
        />,
      );
      screen.getByPlaceholderText('Find').focus();
      await user.keyboard('{Enter}');
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('still renders the search input in mobile layout', () => {
      matchMediaMatches = true;
      const config = createDeepConfig({
        query: '',
        onQueryChange: vi.fn(),
        placeholder: 'Find mobile',
      });
      render(
        <MenuBar
          {...defaultProps}
          config={config}
          isOpen
        />,
      );
      expect(screen.getByPlaceholderText('Find mobile')).toBeInTheDocument();
    });

    it('restores the original expansion state after the query clears', () => {
      const config = createDeepConfig({
        query: 'targetleaf',
        onQueryChange: vi.fn(),
        placeholder: 'Find',
      });
      const { rerender } = render(
        <MenuBar
          {...defaultProps}
          config={config}
          activeItemId="sibling"
        />,
      );
      expect(screen.getByText('TargetLeaf')).toBeInTheDocument();
      expect(screen.queryByText('Sibling')).not.toBeInTheDocument();

      const clearedConfig = createDeepConfig({
        query: '',
        onQueryChange: vi.fn(),
        placeholder: 'Find',
      });
      rerender(
        <MenuBar
          {...defaultProps}
          config={clearedConfig}
          activeItemId="sibling"
        />,
      );
      expect(screen.getByText('Sibling')).toBeInTheDocument();
      const rootRegion = screen.getByText('BranchAlpha').closest('[role="region"]');
      expect(rootRegion?.className).toContain('grid-rows-[0fr]');
    });
  });
});
