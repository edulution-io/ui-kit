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

import type { Mock } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DndContext, useDndContext, useDroppable } from '@dnd-kit/core';
import type MenuBarConfigItem from './MenuBarConfigItem';
import MenuBarSubItem from './MenuBarSubItem';

vi.mock('@dnd-kit/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@dnd-kit/core')>();
  return { ...actual, useDroppable: vi.fn(actual.useDroppable), useDndContext: vi.fn(actual.useDndContext) };
});

type MenuBarSubItemProps = React.ComponentProps<typeof MenuBarSubItem>;

const droppableDisabledFor = (id: string): boolean | undefined => {
  const { calls } = (useDroppable as unknown as Mock).mock;
  const lastCall = [...calls].reverse().find((c) => (c[0] as { id?: string })?.id === id);
  const [args] = lastCall ?? [];
  return (args as { disabled?: boolean } | undefined)?.disabled;
};

const makeItem = (overrides: Partial<MenuBarConfigItem> = {}): MenuBarConfigItem => ({
  id: 'item-1',
  label: 'Item One',
  action: vi.fn(),
  ...overrides,
});

const makeProps = (overrides: Partial<MenuBarSubItemProps> = {}): MenuBarSubItemProps => ({
  item: makeItem(),
  depth: 0,
  collapseLabel: 'Collapse',
  expandLabel: 'Expand',
  maxDepth: 2,
  ...overrides,
});

describe('MenuBarSubItem', () => {
  beforeEach(() => {
    (useDroppable as unknown as Mock).mockClear();
  });

  it('renders the item label', () => {
    render(<MenuBarSubItem {...makeProps()} />);
    expect(screen.getByText('Item One')).toBeInTheDocument();
  });

  it('renders the item icon when provided', () => {
    render(<MenuBarSubItem {...makeProps({ item: makeItem({ icon: <span data-testid="icon">IC</span> }) })} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onChildClick when clicked on a leaf item', async () => {
    const onChildClick = vi.fn();
    render(<MenuBarSubItem {...makeProps({ onChildClick })} />);
    await userEvent.click(screen.getByText('Item One'));
    expect(onChildClick).toHaveBeenCalledWith('item-1');
  });

  it('calls onToggleChildExpand when clicking a collapsed item with children', async () => {
    const onChildClick = vi.fn();
    const onToggleChildExpand = vi.fn();
    const item = makeItem({
      children: [makeItem({ id: 'child-1', label: 'Child' })],
    });
    render(<MenuBarSubItem {...makeProps({ item, onChildClick, onToggleChildExpand })} />);
    await userEvent.click(screen.getByText('Item One'));
    expect(onChildClick).toHaveBeenCalledWith('item-1');
    expect(onToggleChildExpand).toHaveBeenCalledWith('item-1');
  });

  it('does not call onToggleChildExpand when item is already expanded', async () => {
    const onToggleChildExpand = vi.fn();
    const item = makeItem({
      children: [makeItem({ id: 'child-1', label: 'Child' })],
    });
    render(
      <MenuBarSubItem
        {...makeProps({
          item,
          onToggleChildExpand,
          expandedItems: new Set(['item-1']),
        })}
      />,
    );
    await userEvent.click(screen.getByText('Item One'));
    expect(onToggleChildExpand).not.toHaveBeenCalled();
  });

  it('renders children when expanded', () => {
    const item = makeItem({
      children: [makeItem({ id: 'child-1', label: 'Child One' })],
    });
    render(<MenuBarSubItem {...makeProps({ item, expandedItems: new Set(['item-1']) })} />);
    expect(screen.getByText('Child One')).toBeInTheDocument();
  });

  it('applies active styling when activeChildId matches', () => {
    render(<MenuBarSubItem {...makeProps({ activeChildId: 'item-1' })} />);
    const button = screen.getByText('Item One');
    expect(button.closest('button')?.className).toContain('font-bold');
  });

  it('calls onDrillDown instead of onChildClick at maxDepth', async () => {
    const onChildClick = vi.fn();
    const onDrillDown = vi.fn();
    const item = makeItem({
      children: [makeItem({ id: 'child-1', label: 'Child' })],
    });
    render(<MenuBarSubItem {...makeProps({ item, depth: 2, maxDepth: 2, onChildClick, onDrillDown })} />);
    await userEvent.click(screen.getByText('Item One'));
    expect(onDrillDown).toHaveBeenCalledWith('item-1');
    expect(onChildClick).not.toHaveBeenCalled();
  });

  it('calls onToggleChildExpand via expand button', async () => {
    const onToggleChildExpand = vi.fn();
    const item = makeItem({
      children: [makeItem({ id: 'child-1', label: 'Child' })],
    });
    render(<MenuBarSubItem {...makeProps({ item, onToggleChildExpand })} />);
    await userEvent.click(screen.getByLabelText('Expand'));
    expect(onToggleChildExpand).toHaveBeenCalledWith('item-1');
  });

  it('sets aria-expanded on the main button for items with children', () => {
    const item = makeItem({
      children: [makeItem({ id: 'child-1', label: 'Child' })],
    });
    render(<MenuBarSubItem {...makeProps({ item })} />);
    const button = screen.getByText('Item One').closest('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not set aria-expanded on leaf items', () => {
    render(<MenuBarSubItem {...makeProps()} />);
    const button = screen.getByText('Item One').closest('button');
    expect(button).not.toHaveAttribute('aria-expanded');
  });

  it('renders badges with compact subtle styling', () => {
    render(<MenuBarSubItem {...makeProps({ item: makeItem({ badge: 12 }) })} />);
    const badge = screen.getByText('12');
    expect(badge.className).toContain('h-4');
    expect(badge.className).toContain('min-w-4');
    expect(badge.className).toContain('bg-accent');
    expect(badge.className).toContain('text-foreground');
    expect(badge.className).toContain('dark:text-primary-foreground');
    expect(badge.className).toContain('text-[10px]');
    expect(badge.className).toContain('font-medium');
  });

  it('registers an enabled droppable and stays clickable when a visible drop target', async () => {
    const onChildClick = vi.fn();
    const item = makeItem({ dropData: { accepts: 'mail-message', onDrop: vi.fn() } });
    render(
      <DndContext>
        <MenuBarSubItem {...makeProps({ item, onChildClick })} />
      </DndContext>,
    );
    expect(screen.getByText('Item One')).toBeInTheDocument();
    expect(droppableDisabledFor('item-1-drop')).toBe(false);
    await userEvent.click(screen.getByText('Item One'));
    expect(onChildClick).toHaveBeenCalledWith('item-1');
  });

  it('disables the droppable when the item has no dropData and no children', () => {
    render(
      <DndContext>
        <MenuBarSubItem {...makeProps()} />
      </DndContext>,
    );
    expect(droppableDisabledFor('item-1-drop')).toBe(true);
  });

  it('keeps the droppable enabled for a visible parent with children but no dropData so it can spring-load', () => {
    const item = makeItem({ children: [makeItem({ id: 'child-1', label: 'Child' })] });
    render(
      <DndContext>
        <MenuBarSubItem {...makeProps({ item })} />
      </DndContext>,
    );
    expect(droppableDisabledFor('item-1-drop')).toBe(false);
  });

  it('disables the droppable while hidden inside a collapsed ancestor', () => {
    const item = makeItem({ dropData: { accepts: 'mail-message', onDrop: vi.fn() } });
    render(
      <DndContext>
        <MenuBarSubItem {...makeProps({ item, isVisible: false })} />
      </DndContext>,
    );
    expect(droppableDisabledFor('item-1-drop')).toBe(true);
  });

  it('spring-loads collapsed children open after a drag hovers the parent', () => {
    vi.useFakeTimers();
    const mock = useDroppable as unknown as Mock;
    const originalImpl = mock.getMockImplementation();
    mock.mockReturnValue({ setNodeRef: vi.fn(), isOver: true });
    try {
      const onToggleChildExpand = vi.fn();
      const item = makeItem({
        dropData: { accepts: 'mail-message', onDrop: vi.fn() },
        children: [makeItem({ id: 'child-1', label: 'Child' })],
      });
      render(
        <DndContext>
          <MenuBarSubItem {...makeProps({ item, onToggleChildExpand })} />
        </DndContext>,
      );
      expect(onToggleChildExpand).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(600);
      });
      expect(onToggleChildExpand).toHaveBeenCalledWith('item-1');
    } finally {
      vi.useRealTimers();
      if (originalImpl) mock.mockImplementation(originalImpl);
    }
  });

  it('spring-loads a non-droppable parent open on hover so nested drop targets stay reachable', () => {
    vi.useFakeTimers();
    const mock = useDroppable as unknown as Mock;
    const originalImpl = mock.getMockImplementation();
    mock.mockReturnValue({ setNodeRef: vi.fn(), isOver: true });
    try {
      const onToggleChildExpand = vi.fn();
      const item = makeItem({
        children: [makeItem({ id: 'child-1', label: 'Child' })],
      });
      render(
        <DndContext>
          <MenuBarSubItem {...makeProps({ item, onToggleChildExpand })} />
        </DndContext>,
      );
      expect(onToggleChildExpand).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(600);
      });
      expect(onToggleChildExpand).toHaveBeenCalledWith('item-1');
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
      const onToggleChildExpand = vi.fn();
      const item = makeItem({
        dropData: { accepts: 'mail-message', onDrop: vi.fn() },
        children: [makeItem({ id: 'child-1', label: 'Child' })],
      });
      render(
        <DndContext>
          <MenuBarSubItem {...makeProps({ item, onToggleChildExpand, expandedItems: new Set(['item-1']) })} />
        </DndContext>,
      );
      act(() => {
        vi.advanceTimersByTime(600);
      });
      expect(onToggleChildExpand).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
      if (originalImpl) mock.mockImplementation(originalImpl);
    }
  });

  it('does not spring-load while hidden inside a collapsed ancestor', () => {
    vi.useFakeTimers();
    const mock = useDroppable as unknown as Mock;
    const originalImpl = mock.getMockImplementation();
    mock.mockReturnValue({ setNodeRef: vi.fn(), isOver: true });
    try {
      const onToggleChildExpand = vi.fn();
      const item = makeItem({
        dropData: { accepts: 'mail-message', onDrop: vi.fn() },
        children: [makeItem({ id: 'child-1', label: 'Child' })],
      });
      render(
        <DndContext>
          <MenuBarSubItem {...makeProps({ item, onToggleChildExpand, isVisible: false })} />
        </DndContext>,
      );
      act(() => {
        vi.advanceTimersByTime(600);
      });
      expect(onToggleChildExpand).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
      if (originalImpl) mock.mockImplementation(originalImpl);
    }
  });

  it('animates the children region when no drag is active', () => {
    const item = makeItem({ children: [makeItem({ id: 'child-1', label: 'Child' })] });
    render(
      <DndContext>
        <MenuBarSubItem {...makeProps({ item })} />
      </DndContext>,
    );
    expect(screen.getByRole('region', { name: /sections/i }).className).toContain('transition-all');
  });

  it('skips the children animation while a drag is active so drop positions stay accurate', () => {
    const ctxMock = useDndContext as unknown as Mock;
    const originalImpl = ctxMock.getMockImplementation();
    ctxMock.mockReturnValue({ active: { id: 'drag' } } as unknown as ReturnType<typeof useDndContext>);
    try {
      const item = makeItem({ children: [makeItem({ id: 'child-1', label: 'Child' })] });
      render(
        <DndContext>
          <MenuBarSubItem {...makeProps({ item })} />
        </DndContext>,
      );
      expect(screen.getByRole('region', { name: /sections/i }).className).not.toContain('transition-all');
    } finally {
      if (originalImpl) ctxMock.mockImplementation(originalImpl);
    }
  });
});
