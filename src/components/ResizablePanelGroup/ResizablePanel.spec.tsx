/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ResizablePanel from './ResizablePanel';

vi.mock('react-resizable-panels', () => ({
  Panel: ({ children, id, defaultSize, minSize, maxSize }: any) => (
    <div
      data-testid={`rp-panel-${id}`}
      data-default-size={defaultSize}
      data-min-size={minSize}
      data-max-size={maxSize}
    >
      {children}
    </div>
  ),
}));

describe('ResizablePanel', () => {
  it('forwards id, defaultSize, minSize, maxSize and children to the underlying Panel', () => {
    render(
      <ResizablePanel
        id="left"
        defaultSize="40%"
        minSize="20%"
        maxSize="80%"
      >
        <span data-testid="content">content</span>
      </ResizablePanel>,
    );

    const panel = screen.getByTestId('rp-panel-left');
    expect(panel).toHaveAttribute('data-default-size', '40%');
    expect(panel).toHaveAttribute('data-min-size', '20%');
    expect(panel).toHaveAttribute('data-max-size', '80%');
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
