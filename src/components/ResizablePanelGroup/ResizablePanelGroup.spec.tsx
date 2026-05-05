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
