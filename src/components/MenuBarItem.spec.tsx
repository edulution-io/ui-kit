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
import userEvent from '@testing-library/user-event';
import MenuBarItem from './MenuBarItem';
import type { MenuBarItemProps } from './MenuBarItem';

describe('MenuBarItem', () => {
  const defaultProps: MenuBarItemProps = {
    itemId: 'menu-item',
    icon: <span data-testid="icon">Icon</span>,
    label: 'Menu Item',
    isActive: false,
    isExpanded: false,
    activeColorClass: 'bg-primary',
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
    expect(button.className).toContain('bg-primary');
  });

  it('does not apply activeColorClass when inactive', () => {
    render(<MenuBarItem {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Menu Item' });
    expect(button.className).not.toContain('bg-primary');
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
});
