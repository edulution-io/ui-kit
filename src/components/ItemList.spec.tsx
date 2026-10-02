/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

vi.mock('./ScrollArea', () => ({
  ScrollArea: ({ children, ...props }: any) => (
    <div
      data-testid="scroll-area"
      {...props}
    >
      {children}
    </div>
  ),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import ItemList from './ItemList';

describe('ItemList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when items array is empty', () => {
    const { container } = render(<ItemList items={[]} />);

    expect(container.innerHTML).toBe('');
  });

  it('renders nothing in inline layout when items array is empty', () => {
    const { container } = render(
      <ItemList
        items={[]}
        layout="inline"
      />,
    );

    expect(container.innerHTML).toBe('');
  });

  it('renders single item as a paragraph without scroll area (list layout)', () => {
    render(<ItemList items={[{ id: '1', name: 'Only Item' }]} />);

    expect(screen.getByText('Only Item')).toBeInTheDocument();
    expect(screen.queryByTestId('scroll-area')).not.toBeInTheDocument();
  });

  it('renders multiple items inside a scroll area (list layout)', () => {
    const items = [
      { id: '1', name: 'First' },
      { id: '2', name: 'Second' },
      { id: '3', name: 'Third' },
    ];

    render(<ItemList items={items} />);

    expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('renders multiple items as a comma-separated paragraph in inline layout', () => {
    const items = [
      { id: '1', name: 'file_a.txt' },
      { id: '2', name: 'file_b.txt' },
      { id: '3', name: 'file_c.txt' },
    ];

    render(
      <ItemList
        items={items}
        layout="inline"
      />,
    );

    expect(screen.queryByTestId('scroll-area')).not.toBeInTheDocument();
    expect(screen.getByText('file_a.txt, file_b.txt, file_c.txt')).toBeInTheDocument();
  });

  it('renders a single item as comma-joined text (no join separator) in inline layout', () => {
    render(
      <ItemList
        items={[{ id: '1', name: 'solo.txt' }]}
        layout="inline"
      />,
    );

    expect(screen.queryByTestId('scroll-area')).not.toBeInTheDocument();
    expect(screen.getByText('solo.txt')).toBeInTheDocument();
  });
});
