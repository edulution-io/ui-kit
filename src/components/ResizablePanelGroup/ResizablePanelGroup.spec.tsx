/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ResizablePanelGroup from './ResizablePanelGroup';

vi.mock('react-resizable-panels', () => ({
  Group: ({ children, orientation, className }: any) => (
    <div
      data-testid="rp-group"
      data-orientation={orientation}
      className={className}
    >
      {children}
    </div>
  ),
}));

describe('ResizablePanelGroup', () => {
  it('falls back to "horizontal" when no orientation is provided', () => {
    render(
      <ResizablePanelGroup>
        <span>child</span>
      </ResizablePanelGroup>,
    );

    expect(screen.getByTestId('rp-group')).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('forwards the provided orientation', () => {
    render(
      <ResizablePanelGroup orientation="vertical">
        <span>child</span>
      </ResizablePanelGroup>,
    );

    expect(screen.getByTestId('rp-group')).toHaveAttribute('data-orientation', 'vertical');
  });

  it('merges the provided className with the base classes', () => {
    render(
      <ResizablePanelGroup className="my-extra-class">
        <span>child</span>
      </ResizablePanelGroup>,
    );

    const group = screen.getByTestId('rp-group');
    expect(group.className).toContain('my-extra-class');
    expect(group.className).toContain('h-full');
    expect(group.className).toContain('w-full');
  });
});
