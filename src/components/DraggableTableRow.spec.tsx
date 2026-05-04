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

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-use-before-define, react/display-name */

const dndKitMocks = vi.hoisted(() => ({
  setActivatorNodeRef: vi.fn(),
  setDraggableNodeRef: vi.fn(),
}));

vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: { 'data-draggable': 'true' },
    listeners: {},
    setNodeRef: dndKitMocks.setDraggableNodeRef,
    setActivatorNodeRef: dndKitMocks.setActivatorNodeRef,
    isDragging: false,
  }),
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
  }),
}));

vi.mock('@tanstack/react-table', () => ({}));

vi.mock('./Table', () => ({
  TableRow: React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <tr
      ref={ref}
      data-testid="table-row"
      className={className}
      {...props}
    >
      {children}
    </tr>
  )),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DraggableTableRow from './DraggableTableRow';

const createMockRow = (overrides: Record<string, any> = {}) => ({
  id: 'row-1',
  original: { id: '1', name: 'Item A' },
  getIsSelected: vi.fn(() => false),
  ...overrides,
});

describe('DraggableTableRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children inside a table row', () => {
    const row = createMockRow();
    render(
      <table>
        <tbody>
          <DraggableTableRow
            row={row as any}
            enableDragAndDrop={false}
          >
            <td>Cell content</td>
          </DraggableTableRow>
        </tbody>
      </table>,
    );
    expect(screen.getByText('Cell content')).toBeInTheDocument();
    expect(screen.getByTestId('table-row')).toBeInTheDocument();
  });

  it('sets data-state to selected when row is selected', () => {
    const row = createMockRow({ getIsSelected: vi.fn(() => true) });
    render(
      <table>
        <tbody>
          <DraggableTableRow
            row={row as any}
            enableDragAndDrop={false}
          >
            <td>Cell</td>
          </DraggableTableRow>
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('table-row').getAttribute('data-state')).toBe('selected');
  });

  it('sets data-disabled when row is disabled', () => {
    const row = createMockRow();
    render(
      <table>
        <tbody>
          <DraggableTableRow
            row={row as any}
            enableDragAndDrop={false}
            isRowDisabled
          >
            <td>Cell</td>
          </DraggableTableRow>
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('table-row').getAttribute('data-disabled')).toBe('true');
  });

  it('calls onRowClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const row = createMockRow();
    render(
      <table>
        <tbody>
          <DraggableTableRow
            row={row as any}
            enableDragAndDrop={false}
            onRowClick={handleClick}
          >
            <td>Cell</td>
          </DraggableTableRow>
        </tbody>
      </table>,
    );
    await user.click(screen.getByTestId('table-row'));
    expect(handleClick).toHaveBeenCalledWith({ id: '1', name: 'Item A' });
  });

  it('keeps drag behavior on the row when no drag handle cell is configured', () => {
    const row = createMockRow();

    render(
      <table>
        <tbody>
          <DraggableTableRow
            row={row as any}
            enableDragAndDrop
          >
            <td>Cell</td>
          </DraggableTableRow>
        </tbody>
      </table>,
    );

    expect(screen.getByTestId('table-row')).toHaveAttribute('data-draggable', 'true');
    expect(screen.getByTestId('table-row')).toHaveClass('cursor-move');
  });

  it('moves drag activation to the configured drag handle cell while keeping the row as the draggable node', () => {
    const row = createMockRow();

    render(
      <table>
        <tbody>
          <DraggableTableRow
            row={row as any}
            enableDragAndDrop
            dragHandleCellIndex={0}
          >
            <td data-testid="name-cell">Name</td>
            <td data-testid="modified-cell">Modified</td>
          </DraggableTableRow>
        </tbody>
      </table>,
    );

    expect(screen.getByTestId('table-row')).not.toHaveAttribute('data-draggable');
    expect(screen.getByTestId('table-row')).not.toHaveClass('cursor-move');
    expect(screen.getByTestId('name-cell')).toHaveAttribute('data-draggable', 'true');
    expect(screen.getByTestId('name-cell')).toHaveClass('cursor-move');
    expect(screen.getByTestId('modified-cell')).not.toHaveAttribute('data-draggable');
    expect(dndKitMocks.setDraggableNodeRef).toHaveBeenCalledWith(screen.getByTestId('table-row'));
    expect(dndKitMocks.setActivatorNodeRef).toHaveBeenCalledWith(screen.getByTestId('name-cell'));
  });
});
