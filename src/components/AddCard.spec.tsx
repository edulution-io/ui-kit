/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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
