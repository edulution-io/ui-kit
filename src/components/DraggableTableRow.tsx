/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { Children, cloneElement, isValidElement, useCallback } from 'react';
import type { HTMLAttributes, KeyboardEvent, MutableRefObject, ReactElement, ReactNode, Ref } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Row } from '@tanstack/react-table';
import cn from '../utils/cn';
import { TableRow } from './Table';
import type { TableRowVariant } from './Table';

export interface DraggableTableRowProps<TData> {
  row: Row<TData>;
  children: ReactNode;
  /**
   * Suppresses dragging and sets `data-disabled`. `aria-disabled` follows only on a row that carries no
   * `onRowClick`, because that state applies to the row's focusable descendants as well: a row that is
   * still clickable conveys its state through its own controls, which the caller must render disabled.
   */
  isRowDisabled?: boolean;
  enableDragAndDrop: boolean;
  canDropOnRow?: (row: TData) => boolean;
  variant?: TableRowVariant;
  isKeyboardFocused?: boolean;
  onRowClick?: (item: TData) => void;
  dragHandleCellIndex?: number;
}

type DragHandleCellProps = HTMLAttributes<HTMLTableCellElement> & {
  ref?: Ref<HTMLTableCellElement>;
};

const assignRef = <TElement,>(ref: Ref<TElement> | undefined, value: TElement | null) => {
  if (!ref) return;

  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  const mutableRef = ref as MutableRefObject<TElement | null>;
  mutableRef.current = value;
};

const DraggableTableRow = <TData,>({
  row,
  children,
  isRowDisabled,
  enableDragAndDrop,
  canDropOnRow,
  variant = 'default',
  isKeyboardFocused = false,
  onRowClick,
  dragHandleCellIndex,
}: DraggableTableRowProps<TData>) => {
  const {
    listeners,
    setNodeRef: setDragRef,
    setActivatorNodeRef,
    isDragging,
  } = useDraggable({
    id: row.id,
    data: row.original as Record<string, unknown>,
    disabled: !enableDragAndDrop || isRowDisabled,
  });

  const canDrop = canDropOnRow?.(row.original) ?? false;

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: row.id,
    disabled: !enableDragAndDrop || !canDrop,
    data: row.original as Record<string, unknown>,
  });

  const childrenArray = Children.toArray(children);
  const hasDragHandle =
    typeof dragHandleCellIndex === 'number' &&
    dragHandleCellIndex >= 0 &&
    isValidElement(childrenArray[dragHandleCellIndex]);

  const dragProps = listeners ?? {};
  const isInoperable = isRowDisabled && !onRowClick;

  const rowRef = useCallback(
    (element: HTMLTableRowElement | null) => {
      setDragRef(element);
      setDropRef(element);
    },
    [setDragRef, setDropRef],
  );

  const isSelected = row.getIsSelected();

  const handleClick = useCallback(() => {
    onRowClick?.(row.original);
  }, [onRowClick, row.original]);

  const isRowKeyboardActivatable = !!onRowClick && !(enableDragAndDrop && !hasDragHandle);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTableRowElement>) => {
      if (event.target !== event.currentTarget) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      onRowClick?.(row.original);
    },
    [onRowClick, row.original],
  );

  const dragHandleChildren = hasDragHandle
    ? childrenArray.map((child, index) => {
        if (index !== dragHandleCellIndex || !isValidElement<DragHandleCellProps>(child)) {
          return child;
        }

        const childElement = child as ReactElement<DragHandleCellProps> & { ref?: Ref<HTMLTableCellElement> };
        const childRef = childElement.ref;

        return cloneElement(childElement, {
          ...dragProps,
          ref: (element: HTMLTableCellElement | null) => {
            assignRef(childRef, element);
            setActivatorNodeRef(element);
          },
          className: cn(childElement.props.className, enableDragAndDrop && !isRowDisabled && 'cursor-move'),
        });
      })
    : children;

  return (
    <TableRow
      ref={rowRef}
      variant={variant}
      data-row-id={row.id}
      data-state={isSelected ? 'selected' : undefined}
      data-disabled={isRowDisabled ? 'true' : undefined}
      aria-disabled={isInoperable || undefined}
      className={cn(
        !hasDragHandle && enableDragAndDrop && !isRowDisabled && 'cursor-move',
        isDragging && 'opacity-30',
        isDragging && isSelected && 'outline outline-2 outline-offset-2 outline-primary',
        isOver && canDrop && 'bg-primary/10 outline outline-2 -outline-offset-2 outline-primary',
        isKeyboardFocused && 'relative z-10 outline outline-2 -outline-offset-2 outline-primary',
        isRowKeyboardActivatable &&
          'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
      )}
      onClick={handleClick}
      {...(isRowKeyboardActivatable ? { tabIndex: 0, onKeyDown: handleKeyDown } : {})}
      {...(hasDragHandle ? {} : dragProps)}
    >
      {dragHandleChildren}
    </TableRow>
  );
};

export default DraggableTableRow;
