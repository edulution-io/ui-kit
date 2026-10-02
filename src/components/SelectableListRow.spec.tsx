/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectableListRow from './SelectableListRow';

describe('SelectableListRow', () => {
  it('wraps leading, content and trailing slots inside one row element', () => {
    const { container } = render(
      <SelectableListRow
        leading={<span data-testid="lead" />}
        trailing={<span data-testid="trail" />}
      >
        <span data-testid="content" />
      </SelectableListRow>,
    );

    const row = container.firstElementChild as HTMLElement;
    expect(row).toContainElement(screen.getByTestId('lead'));
    expect(row).toContainElement(screen.getByTestId('content'));
    expect(row).toContainElement(screen.getByTestId('trail'));
  });

  it('paints the active background on the whole row so leading and trailing share it (surface variant)', () => {
    const { container } = render(
      <SelectableListRow
        isActive
        leading={<span data-testid="lead" />}
        trailing={<span data-testid="trail" />}
      >
        content
      </SelectableListRow>,
    );

    const row = container.firstElementChild as HTMLElement;
    expect(row.className).toContain('bg-muted-light');
    expect(row.className).toContain('dark:bg-muted-background');
    expect(row).toContainElement(screen.getByTestId('lead'));
    expect(row).toContainElement(screen.getByTestId('trail'));
  });

  it('uses the primary rail and accent fill when active in the accentRail variant', () => {
    const { container } = render(
      <SelectableListRow
        isActive
        variant="accentRail"
      >
        content
      </SelectableListRow>,
    );

    const row = container.firstElementChild as HTMLElement;
    expect(row.className).toContain('border-l-primary');
    expect(row.className).toContain('bg-accent');
  });

  it('is a keyboard-activatable button when onActivate is provided', () => {
    const onActivate = vi.fn();
    render(<SelectableListRow onActivate={onActivate}>row</SelectableListRow>);

    const row = screen.getByRole('button');
    expect(row).toHaveAttribute('tabindex', '0');

    fireEvent.click(row);
    fireEvent.keyDown(row, { key: 'Enter' });
    fireEvent.keyDown(row, { key: ' ' });
    expect(onActivate).toHaveBeenCalledTimes(3);
  });

  it('is not a button and ignores keyboard when no onActivate is provided', () => {
    render(<SelectableListRow>row</SelectableListRow>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('marks the row busy and disabled while a background operation runs', () => {
    const { container } = render(
      <SelectableListRow
        isDisabled
        ariaBusy
        onActivate={vi.fn()}
      >
        row
      </SelectableListRow>,
    );

    const row = container.firstElementChild as HTMLElement;
    expect(row).toHaveAttribute('aria-busy', 'true');
    expect(row.className).toContain('pointer-events-none');
    expect(row.className).toContain('opacity-50');
  });

  it('renders a passed data-testid on the row, so a list can address its rows', () => {
    render(<SelectableListRow data-testid="member-row">row</SelectableListRow>);

    expect(screen.getByTestId('member-row')).toHaveTextContent('row');
  });

  it('forwards any further data-* attribute, so a list can mark a row by its own state', () => {
    render(
      <SelectableListRow
        data-testid="member-row"
        data-seated="true"
        data-role="student"
      >
        row
      </SelectableListRow>,
    );

    const row = screen.getByTestId('member-row');
    expect(row).toHaveAttribute('data-seated', 'true');
    expect(row).toHaveAttribute('data-role', 'student');
  });

  it('forwards nothing but data-* attributes, so an unknown prop cannot leak into the DOM', () => {
    render(
      <SelectableListRow
        data-testid="member-row"
        {...({ isSeated: 'true' } as Record<string, unknown>)}
      >
        row
      </SelectableListRow>,
    );

    expect(screen.getByTestId('member-row')).not.toHaveAttribute('isSeated');
  });

  it('passes the click event to onActivate, so the mouse and keyboard paths agree', () => {
    const onActivate = vi.fn();
    render(<SelectableListRow onActivate={onActivate}>row</SelectableListRow>);

    fireEvent.click(screen.getByRole('button'), { metaKey: true });

    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(onActivate.mock.calls[0][0]).toMatchObject({ metaKey: true });
  });

  it('passes the keyboard event too, so a row reached by Enter tells the caller as much as a click does', () => {
    const onActivate = vi.fn();
    render(<SelectableListRow onActivate={onActivate}>row</SelectableListRow>);

    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter', metaKey: true });

    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(onActivate.mock.calls[0][0]).toMatchObject({ key: 'Enter', metaKey: true });
  });

  it('passes the event on Space as well, the other key that activates the row', () => {
    const onActivate = vi.fn();
    render(<SelectableListRow onActivate={onActivate}>row</SelectableListRow>);

    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });

    expect(onActivate.mock.calls[0][0]).toMatchObject({ key: ' ' });
  });
});
