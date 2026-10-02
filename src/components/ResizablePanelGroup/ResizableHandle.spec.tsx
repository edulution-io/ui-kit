/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ResizableHandle from './ResizableHandle';

vi.mock('react-resizable-panels', () => ({
  Separator: ({ children, className, ...props }: any) => (
    <div
      role="separator"
      aria-label={props['aria-label']}
      className={className}
      data-testid="rp-separator"
    >
      {children}
    </div>
  ),
}));

describe('ResizableHandle', () => {
  it('renders custom children when withHandle is false', () => {
    render(
      <ResizableHandle aria-label="Resize">
        <span data-testid="custom">custom</span>
      </ResizableHandle>,
    );

    expect(screen.getByRole('separator', { name: 'Resize' })).toBeInTheDocument();
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('renders the built-in grip indicator when withHandle is true and ignores children', () => {
    render(
      <ResizableHandle withHandle>
        <span data-testid="custom">custom</span>
      </ResizableHandle>,
    );

    expect(screen.queryByTestId('custom')).toBeNull();
    const separator = screen.getByTestId('rp-separator');
    expect(separator.querySelector('span[aria-hidden="true"]')).not.toBeNull();
  });
});
