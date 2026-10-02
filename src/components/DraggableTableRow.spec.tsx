/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-use-before-define, react/display-name */

const dndKitMocks = vi.hoisted(() => ({
  setActivatorNodeRef: vi.fn(),
  setDraggableNodeRef: vi.fn(),
  onPointerDown: vi.fn(),
  onKeyDown: vi.fn(),
}));

vi.mock('@dnd-kit/core', () => ({
  useDraggable: ({ disabled = false }: any) => ({
    attributes: {
      'data-draggable': 'true',
      role: 'button',
      tabIndex: 0,
      'aria-disabled': disabled,
      'aria-roledescription': 'draggable',
      'aria-describedby': 'DndDescribedBy-0',
    },
    listeners: disabled ? undefined : { onPointerDown: dndKitMocks.onPointerDown, onKeyDown: dndKitMocks.onKeyDown },
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
import { fireEvent, render, screen } from '@testing-library/react';
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

    expect(screen.getByTestId('table-row')).toHaveClass('cursor-move');
    fireEvent.pointerDown(screen.getByTestId('table-row'));
    expect(dndKitMocks.onPointerDown).toHaveBeenCalled();
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

    expect(screen.getByTestId('table-row')).not.toHaveClass('cursor-move');
    expect(screen.getByTestId('name-cell')).toHaveClass('cursor-move');
    expect(screen.getByTestId('name-cell')).not.toHaveAttribute('role');
    expect(dndKitMocks.setDraggableNodeRef).toHaveBeenCalledWith(screen.getByTestId('table-row'));
    expect(dndKitMocks.setActivatorNodeRef).toHaveBeenCalledWith(screen.getByTestId('name-cell'));

    fireEvent.pointerDown(screen.getByTestId('table-row'));
    expect(dndKitMocks.onPointerDown).not.toHaveBeenCalled();
    fireEvent.pointerDown(screen.getByTestId('modified-cell'));
    expect(dndKitMocks.onPointerDown).not.toHaveBeenCalled();
    fireEvent.pointerDown(screen.getByTestId('name-cell'));
    expect(dndKitMocks.onPointerDown).toHaveBeenCalled();
  });

  it('leaves a row without drag-and-drop free of drag attributes', () => {
    const row = createMockRow();

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

    const tableRow = screen.getByTestId('table-row');
    expect(tableRow).not.toHaveAttribute('role');
    expect(tableRow).not.toHaveAttribute('tabindex');
    expect(tableRow).not.toHaveAttribute('aria-disabled');
    expect(tableRow).not.toHaveAttribute('aria-roledescription');
    expect(tableRow).not.toHaveAttribute('aria-describedby');

    fireEvent.pointerDown(tableRow);
    expect(dndKitMocks.onPointerDown).not.toHaveBeenCalled();
  });

  it('marks a disabled, unclickable row without drag-and-drop as disabled', () => {
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

    const tableRow = screen.getByTestId('table-row');
    expect(tableRow).toHaveAttribute('data-disabled', 'true');
    expect(tableRow).toHaveAttribute('aria-disabled', 'true');
    expect(tableRow).not.toHaveAttribute('role');
    expect(tableRow).not.toHaveAttribute('tabindex');
  });

  it('activates a draggable row without overriding its table semantics', () => {
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

    const tableRow = screen.getByTestId('table-row');
    expect(tableRow).not.toHaveAttribute('role');
    expect(tableRow).not.toHaveAttribute('tabindex');
    expect(tableRow).not.toHaveAttribute('aria-disabled');
    expect(tableRow).not.toHaveAttribute('aria-roledescription');

    fireEvent.pointerDown(tableRow);
    expect(dndKitMocks.onPointerDown).toHaveBeenCalled();
  });

  it('marks a disabled, unclickable row in a drag-enabled table as disabled and undraggable', () => {
    const row = createMockRow();

    render(
      <table>
        <tbody>
          <DraggableTableRow
            row={row as any}
            enableDragAndDrop
            isRowDisabled
          >
            <td>Cell</td>
          </DraggableTableRow>
        </tbody>
      </table>,
    );

    const tableRow = screen.getByTestId('table-row');
    expect(tableRow).toHaveAttribute('data-disabled', 'true');
    expect(tableRow).toHaveAttribute('aria-disabled', 'true');
    expect(tableRow).not.toHaveAttribute('role');
    expect(tableRow).not.toHaveAttribute('tabindex');

    fireEvent.pointerDown(tableRow);
    expect(dndKitMocks.onPointerDown).not.toHaveBeenCalled();
  });

  it('leaves a disabled but clickable row free of aria-disabled', () => {
    const row = createMockRow();
    const handleRowClick = vi.fn();

    render(
      <table>
        <tbody>
          <DraggableTableRow
            row={row as any}
            enableDragAndDrop
            isRowDisabled
            onRowClick={handleRowClick}
          >
            <td>Cell</td>
          </DraggableTableRow>
        </tbody>
      </table>,
    );

    const tableRow = screen.getByTestId('table-row');
    expect(tableRow).toHaveAttribute('data-disabled', 'true');
    expect(tableRow).not.toHaveAttribute('aria-disabled');

    fireEvent.click(tableRow);
    expect(handleRowClick).toHaveBeenCalledWith(row.original);
  });

  it('leaves a drag handle cell without drag-and-drop free of drag attributes', () => {
    const row = createMockRow();

    render(
      <table>
        <tbody>
          <DraggableTableRow
            row={row as any}
            enableDragAndDrop={false}
            dragHandleCellIndex={0}
          >
            <td data-testid="name-cell">Name</td>
            <td data-testid="modified-cell">Modified</td>
          </DraggableTableRow>
        </tbody>
      </table>,
    );

    const handleCell = screen.getByTestId('name-cell');
    expect(handleCell).not.toHaveAttribute('role');
    expect(handleCell).not.toHaveAttribute('tabindex');
    expect(handleCell).not.toHaveAttribute('aria-disabled');
    expect(handleCell).not.toHaveAttribute('aria-roledescription');
    expect(handleCell).not.toHaveAttribute('aria-describedby');
    expect(handleCell).not.toHaveClass('cursor-move');

    fireEvent.pointerDown(handleCell);
    expect(dndKitMocks.onPointerDown).not.toHaveBeenCalled();
  });

  describe('keyboard activation', () => {
    const renderRow = (props: Record<string, any>, handleClick = vi.fn()) => {
      render(
        <table>
          <tbody>
            <DraggableTableRow
              row={createMockRow() as any}
              enableDragAndDrop={false}
              {...props}
              onRowClick={props.noClick ? undefined : handleClick}
            >
              <td>
                <button type="button">Inner</button>
              </td>
            </DraggableTableRow>
          </tbody>
        </table>,
      );
      return handleClick;
    };

    it('makes a clickable row focusable and activates it with Enter and Space', async () => {
      const user = userEvent.setup();
      const handleClick = renderRow({});
      const tableRow = screen.getByTestId('table-row');

      expect(tableRow).toHaveAttribute('tabindex', '0');
      tableRow.focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(2);
      expect(handleClick).toHaveBeenCalledWith({ id: '1', name: 'Item A' });
    });

    it('ignores key events that originate from an interactive child', () => {
      const handleClick = renderRow({});

      fireEvent.keyDown(screen.getByRole('button', { name: 'Inner' }), { key: 'Enter' });

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('ignores other keys', async () => {
      const user = userEvent.setup();
      const handleClick = renderRow({});

      screen.getByTestId('table-row').focus();
      await user.keyboard('a');

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('leaves a row without a click handler unfocusable', () => {
      renderRow({ noClick: true });
      const tableRow = screen.getByTestId('table-row');

      expect(tableRow).not.toHaveAttribute('tabindex');
      expect(tableRow.className).not.toContain('cursor-pointer');
    });

    it('does not take over the keyboard of a draggable row', () => {
      renderRow({ enableDragAndDrop: true });

      expect(screen.getByTestId('table-row')).not.toHaveAttribute('tabindex');
    });
  });
});
