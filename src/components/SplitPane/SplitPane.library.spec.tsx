/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import SplitPane from './SplitPane';

describe('SplitPane on react-resizable-panels', () => {
  it('takes an end pane that appears after the panes are mounted, without the library refusing to size it', () => {
    const { rerender } = render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        fitEndSize="12rem"
      />,
    );
    rerender(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        end={<span>e</span>}
        fitEndSize="12rem"
      />,
    );

    expect(screen.getByText('e')).toBeInTheDocument();
  });

  it('mounts with an end pane from the start', () => {
    render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        end={<span>e</span>}
        fitEndSize="12rem"
      />,
    );

    expect(screen.getByText('e')).toBeInTheDocument();
  });

  it('takes the end pane back after it was hidden', () => {
    const view = (end?: React.ReactNode) => (
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        end={end}
        fitEndSize="12rem"
      />
    );
    const { rerender } = render(view(<span>e</span>));
    rerender(view());
    rerender(view(<span>e</span>));

    expect(screen.getByText('e')).toBeInTheDocument();
  });
});
