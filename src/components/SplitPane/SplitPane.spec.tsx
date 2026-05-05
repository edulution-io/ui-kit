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
import SplitPane from './SplitPane';

const mediaQueryMatches = vi.fn<[string], boolean>(() => false);
const useDefaultLayoutMock = vi.fn();

vi.mock('../../hooks/useMediaQuery', () => ({
  default: (query: string) => mediaQueryMatches(query),
}));

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
  Separator: ({ children, ...rest }: any) => (
    <div
      role="separator"
      aria-label={rest['aria-label']}
      data-testid="rp-separator"
    >
      {children}
    </div>
  ),
  useDefaultLayout: (args: { id: string; panelIds: string[] }) => useDefaultLayoutMock(args),
}));

beforeEach(() => {
  mediaQueryMatches.mockReset();
  mediaQueryMatches.mockReturnValue(false);
  useDefaultLayoutMock.mockReset();
  useDefaultLayoutMock.mockReturnValue({ defaultLayout: undefined, onLayoutChanged: undefined });
});

describe('SplitPane', () => {
  it('renders only the left pane on mobile by default', () => {
    mediaQueryMatches.mockReturnValue(true);
    render(
      <SplitPane
        left={<span data-testid="left">left</span>}
        right={<span data-testid="right">right</span>}
      />,
    );

    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.queryByTestId('right')).toBeNull();
    expect(screen.queryByTestId('rp-group')).toBeNull();
  });

  it('renders only the right pane on mobile when mobilePane is "right"', () => {
    mediaQueryMatches.mockReturnValue(true);
    render(
      <SplitPane
        left={<span data-testid="left">left</span>}
        right={<span data-testid="right">right</span>}
        mobilePane="right"
      />,
    );

    expect(screen.queryByTestId('left')).toBeNull();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('renders both panes plus a separator on desktop', () => {
    render(
      <SplitPane
        left={<span data-testid="left">left</span>}
        right={<span data-testid="right">right</span>}
        handleAriaLabel="Resize"
      />,
    );

    expect(screen.getByTestId('rp-group')).toBeInTheDocument();
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
    expect(screen.getByRole('separator', { name: 'Resize' })).toBeInTheDocument();
  });

  it('forwards orientation, defaultLeftSize and min/max sizes to the underlying panels', () => {
    render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        orientation="vertical"
        defaultLeftSize="2/3"
        minLeftSize={20}
        maxLeftSize={80}
      />,
    );

    expect(screen.getByTestId('rp-group')).toHaveAttribute('data-orientation', 'vertical');

    const leftPanel = screen.getByTestId('rp-panel-split-pane-left');
    expect(leftPanel).toHaveAttribute('data-default-size', `${200 / 3}%`);
    expect(leftPanel).toHaveAttribute('data-min-size', '20%');
    expect(leftPanel).toHaveAttribute('data-max-size', '80%');

    expect(screen.getByTestId('rp-panel-split-pane-right')).toHaveAttribute('data-default-size', `${100 - 200 / 3}%`);
  });

  it('does not call useDefaultLayout when no autoSaveId is provided', () => {
    render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
      />,
    );

    expect(useDefaultLayoutMock).not.toHaveBeenCalled();
  });

  it('calls useDefaultLayout with the autoSaveId when provided', () => {
    render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        autoSaveId="custom-save-id"
      />,
    );

    expect(useDefaultLayoutMock).toHaveBeenCalledWith({
      id: 'custom-save-id',
      panelIds: ['split-pane-left', 'split-pane-right'],
    });
  });
});
