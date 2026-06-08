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
import type { Mock } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DndContext, useDroppable } from '@dnd-kit/core';
import MenuBarItem from './MenuBarItem';
import type { MenuBarItemProps } from './MenuBarItem';

vi.mock('@dnd-kit/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@dnd-kit/core')>();
  return { ...actual, useDroppable: vi.fn(actual.useDroppable), useDndContext: vi.fn(actual.useDndContext) };
});

const droppableDisabledFor = (id: string): boolean | undefined => {
  const { calls } = (useDroppable as unknown as Mock).mock;
  const lastCall = [...calls].reverse().find((c) => (c[0] as { id?: string })?.id === id);
  const [args] = lastCall ?? [];
  return (args as { disabled?: boolean } | undefined)?.disabled;
};

describe('MenuBarItem', () => {
  beforeEach(() => {
    (useDroppable as unknown as Mock).mockClear();
  });

  const defaultProps: MenuBarItemProps = {
    itemId: 'menu-item',
    icon: <span data-testid="icon">Icon</span>,
    label: 'Menu Item',
    isActive: false,
    isExpanded: false,
    activeColorClass: 'bg-secondary',
    collapseLabel: 'Collapse',
    expandLabel: 'Expand',
    onItemClick: vi.fn(),
    onToggleExpand: vi.fn(),
  };

  it('renders label correctly', () => {
    render(<MenuBarItem {...defaultProps} />);
    expect(screen.getByText('Menu Item')).toBeInTheDocument();
  });

  it('renders icon correctly', () => {
    render(<MenuBarItem {...defaultProps} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('forwards ref to the div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuBarItem
        ref={ref}
        {...defaultProps}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('calls onItemClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <MenuBarItem
        {...defaultProps}
        onItemClick={handleClick}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Menu Item' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies activeColorClass when active', () => {
    render(
      <MenuBarItem
        {...defaultProps}
        isActive
      />,
    );
    const button = screen.getByRole('button', { name: 'Menu Item' });
    expect(button.className).toContain('bg-secondary');
  });

  it('does not apply activeColorClass when inactive', () => {
    render(<MenuBarItem {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Menu Item' });
    expect(button.className).not.toContain('bg-secondary');
  });

  it('uses the primary theme color for the leading hover indicator', () => {
    render(<MenuBarItem {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Menu Item' });

    expect(button.className).toContain('before:bg-primary');
    expect(button.className).not.toContain('before:bg-colorSuccess');
  });

  it('renders aggregate badges with compact subtle styling', () => {
    render(
      <MenuBarItem
        {...defaultProps}
        aggregateChildBadges
        childItems={[{ id: 'child-1', label: 'Child 1', badge: 12 }]}
      />,
    );
    const badge = screen.getAllByLabelText('12 unread')[0];
    expect(badge.className).toContain('h-4');
    expect(badge.className).toContain('min-w-4');
    expect(badge.className).toContain('bg-accent');
    expect(badge.className).toContain('text-foreground');
    expect(badge.className).toContain('dark:text-primary-foreground');
    expect(badge.className).toContain('text-[10px]');
    expect(badge.className).toContain('font-medium');
  });

  it('shows expand button when has children', () => {
    render(
      <MenuBarItem
        {...defaultProps}
        childItems={[{ id: 'child-1', label: 'Child 1' }]}
      />,
    );
    expect(screen.getByLabelText('Expand')).toBeInTheDocument();
  });

  it('does not show expand button when no children', () => {
    render(<MenuBarItem {...defaultProps} />);
    expect(screen.queryByLabelText('Expand')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Collapse')).not.toBeInTheDocument();
  });

  it('shows collapse label when expanded', () => {
    render(
      <MenuBarItem
        {...defaultProps}
        isExpanded
        childItems={[{ id: 'child-1', label: 'Child 1' }]}
      />,
    );
    expect(screen.getByLabelText('Collapse')).toBeInTheDocument();
  });

  it('renders child items when expanded', () => {
    render(
      <MenuBarItem
        {...defaultProps}
        isExpanded
        childItems={[
          { id: 'child-1', label: 'Child 1' },
          { id: 'child-2', label: 'Child 2' },
        ]}
      />,
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('calls onChildClick when child is clicked', async () => {
    const user = userEvent.setup();
    const handleChildClick = vi.fn();
    render(
      <MenuBarItem
        {...defaultProps}
        isExpanded
        childItems={[{ id: 'child-1', label: 'Child 1' }]}
        onChildClick={handleChildClick}
      />,
    );
    await user.click(screen.getByText('Child 1'));
    expect(handleChildClick).toHaveBeenCalledWith('child-1');
  });

  it('highlights active child', () => {
    render(
      <MenuBarItem
        {...defaultProps}
        isExpanded
        childItems={[
          { id: 'child-1', label: 'Child 1' },
          { id: 'child-2', label: 'Child 2' },
        ]}
        activeChildId="child-1"
      />,
    );
    const activeChild = screen.getByText('Child 1').closest('button');
    expect(activeChild?.className).toContain('bg-accent');
    expect(activeChild?.className).toContain('font-bold');
  });

  it('calls onItemClick and onToggleExpand when clicking item with collapsed children', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const handleToggle = vi.fn();
    render(
      <MenuBarItem
        {...defaultProps}
        onItemClick={handleClick}
        onToggleExpand={handleToggle}
        childItems={[{ id: 'child-1', label: 'Child 1' }]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Menu Item' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('merges custom className', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuBarItem
        ref={ref}
        {...defaultProps}
        className="my-custom-class"
      />,
    );
    expect(ref.current?.className).toContain('my-custom-class');
  });

  describe('nested children (recursive submenus)', () => {
    const nestedChildItems = [
      {
        id: 'child-1',
        label: 'Child 1',
        children: [
          { id: 'grandchild-1', label: 'Grandchild 1' },
          { id: 'grandchild-2', label: 'Grandchild 2' },
        ],
      },
      { id: 'child-2', label: 'Child 2' },
    ];

    it('renders grandchildren when both parent and child are expanded', () => {
      render(
        <MenuBarItem
          {...defaultProps}
          isExpanded
          childItems={nestedChildItems}
          expandedItems={new Set(['child-1'])}
        />,
      );
      expect(screen.getByText('Grandchild 1')).toBeInTheDocument();
      expect(screen.getByText('Grandchild 2')).toBeInTheDocument();
    });

    it('shows chevron on child items that have their own children', () => {
      render(
        <MenuBarItem
          {...defaultProps}
          isExpanded
          childItems={nestedChildItems}
          expandedItems={new Set()}
          collapseLabel="Collapse"
          expandLabel="Expand"
        />,
      );
      expect(screen.getByLabelText('Collapse')).toBeInTheDocument();
      const childExpandButtons = screen.getAllByLabelText('Expand');
      expect(childExpandButtons).toHaveLength(1);
    });

    it('calls onChildClick with correct ID for deeply nested child', async () => {
      const user = userEvent.setup();
      const handleChildClick = vi.fn();
      render(
        <MenuBarItem
          {...defaultProps}
          isExpanded
          childItems={nestedChildItems}
          expandedItems={new Set(['child-1'])}
          onChildClick={handleChildClick}
        />,
      );
      await user.click(screen.getByText('Grandchild 1'));
      expect(handleChildClick).toHaveBeenCalledWith('grandchild-1');
    });

    it('highlights active child at depth 2', () => {
      render(
        <MenuBarItem
          {...defaultProps}
          isExpanded
          childItems={nestedChildItems}
          expandedItems={new Set(['child-1'])}
          activeChildId="grandchild-1"
        />,
      );
      const activeChild = screen.getByText('Grandchild 1').closest('button');
      expect(activeChild?.className).toContain('bg-accent');
      expect(activeChild?.className).toContain('font-bold');
    });

    it('calls onToggleChildExpand when chevron on nested child is clicked', async () => {
      const user = userEvent.setup();
      const handleToggleChildExpand = vi.fn();
      render(
        <MenuBarItem
          {...defaultProps}
          isExpanded
          childItems={nestedChildItems}
          expandedItems={new Set()}
          onToggleChildExpand={handleToggleChildExpand}
          collapseLabel="Collapse"
          expandLabel="Expand"
        />,
      );
      const expandButtons = screen.getAllByLabelText('Expand');
      const childExpandButton = expandButtons[expandButtons.length - 1];
      await user.click(childExpandButton);
      expect(handleToggleChildExpand).toHaveBeenCalledWith('child-1');
    });

    it('does not render grandchildren when child is collapsed', () => {
      render(
        <MenuBarItem
          {...defaultProps}
          isExpanded
          childItems={nestedChildItems}
          expandedItems={new Set()}
        />,
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Grandchild 1')).toBeInTheDocument();
      const grandchildRegion = screen.getByText('Grandchild 1').closest('[role="region"]');
      expect(grandchildRegion?.className).toContain('grid-rows-[0fr]');
    });
  });

  describe('drag-and-drop spring-load', () => {
    const dropData = { accepts: 'mail-message', onDrop: vi.fn() };

    it('keeps the droppable enabled for a parent with children but no dropData so it can spring-load', () => {
      render(
        <DndContext>
          <MenuBarItem
            {...defaultProps}
            childItems={[{ id: 'child-1', label: 'Child 1' }]}
          />
        </DndContext>,
      );
      expect(droppableDisabledFor('menu-item-drop')).toBe(false);
    });

    it('disables the droppable for a leaf with no children and no dropData', () => {
      render(
        <DndContext>
          <MenuBarItem {...defaultProps} />
        </DndContext>,
      );
      expect(droppableDisabledFor('menu-item-drop')).toBe(true);
    });

    it('highlights as an active drop target only when it has its own dropData', () => {
      const mock = useDroppable as unknown as Mock;
      const originalImpl = mock.getMockImplementation();
      mock.mockReturnValue({ setNodeRef: vi.fn(), isOver: true });
      try {
        const { rerender } = render(
          <DndContext>
            <MenuBarItem
              {...defaultProps}
              childItems={[{ id: 'child-1', label: 'Child 1' }]}
            />
          </DndContext>,
        );
        expect(screen.getByRole('button', { name: 'Menu Item' }).className).not.toContain('outline-primary');
        rerender(
          <DndContext>
            <MenuBarItem
              {...defaultProps}
              childItems={[{ id: 'child-1', label: 'Child 1' }]}
              dropData={dropData}
            />
          </DndContext>,
        );
        expect(screen.getByRole('button', { name: 'Menu Item' }).className).toContain('outline-primary');
      } finally {
        if (originalImpl) mock.mockImplementation(originalImpl);
      }
    });

    it('spring-loads a collapsed parent open after a drag hovers it', () => {
      vi.useFakeTimers();
      const mock = useDroppable as unknown as Mock;
      const originalImpl = mock.getMockImplementation();
      mock.mockReturnValue({ setNodeRef: vi.fn(), isOver: true });
      try {
        const onToggleExpand = vi.fn();
        render(
          <DndContext>
            <MenuBarItem
              {...defaultProps}
              onToggleExpand={onToggleExpand}
              childItems={[{ id: 'child-1', label: 'Child 1' }]}
            />
          </DndContext>,
        );
        expect(onToggleExpand).not.toHaveBeenCalled();
        act(() => {
          vi.advanceTimersByTime(600);
        });
        expect(onToggleExpand).toHaveBeenCalledTimes(1);
      } finally {
        vi.useRealTimers();
        if (originalImpl) mock.mockImplementation(originalImpl);
      }
    });

    it('does not spring-load an already expanded parent', () => {
      vi.useFakeTimers();
      const mock = useDroppable as unknown as Mock;
      const originalImpl = mock.getMockImplementation();
      mock.mockReturnValue({ setNodeRef: vi.fn(), isOver: true });
      try {
        const onToggleExpand = vi.fn();
        render(
          <DndContext>
            <MenuBarItem
              {...defaultProps}
              isExpanded
              onToggleExpand={onToggleExpand}
              childItems={[{ id: 'child-1', label: 'Child 1' }]}
            />
          </DndContext>,
        );
        act(() => {
          vi.advanceTimersByTime(600);
        });
        expect(onToggleExpand).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
        if (originalImpl) mock.mockImplementation(originalImpl);
      }
    });
  });
});
