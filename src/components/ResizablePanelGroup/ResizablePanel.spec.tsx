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
