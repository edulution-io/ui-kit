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

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import AddCard from './AddCard';

describe('AddCard', () => {
  it('renders the title, description and icon', () => {
    render(
      <AddCard
        icon={<span data-testid="icon">+</span>}
        title="Neue Konferenz"
        description="Raum anlegen, einladen, loslegen."
      />,
    );

    expect(screen.getByText('Neue Konferenz')).toBeInTheDocument();
    expect(screen.getByText('Raum anlegen, einladen, loslegen.')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders as a button and triggers onClick', () => {
    const onClick = vi.fn();
    render(
      <AddCard
        title="Neue Konferenz"
        onClick={onClick}
      />,
    );

    const button = screen.getByRole('button', { name: 'Neue Konferenz' });
    expect(button).toHaveAttribute('type', 'button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('uses the shared liquid-glass surface and does not fire onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <AddCard
        title="Neue Konferenz"
        onClick={onClick}
        disabled
      />,
    );

    const button = screen.getByRole('button', { name: 'Neue Konferenz' });
    expect(button).toHaveClass('liquid-glass');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
