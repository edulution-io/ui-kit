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
});
