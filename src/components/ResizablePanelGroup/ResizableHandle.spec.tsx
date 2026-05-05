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
