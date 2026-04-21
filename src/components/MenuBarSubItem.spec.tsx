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
import type MenuBarConfigItem from './MenuBarConfigItem';
import MenuBarSubItem from './MenuBarSubItem';

type MenuBarSubItemProps = React.ComponentProps<typeof MenuBarSubItem>;

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
});
