/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import SplitPane from './SplitPane';

const mediaQueryMatches = vi.fn<[string], boolean>(() => false);
const useDefaultLayoutMock = vi.fn();
const resizeLeftPanel = vi.fn();
const group: { onLayoutChanged?: (layout: Record<string, number>, meta: { isUserInteraction: boolean }) => void } = {};

vi.mock('../../hooks/useMediaQuery', () => ({
  default: (query: string) => mediaQueryMatches(query),
}));

vi.mock('react-resizable-panels', () => ({
  Group: ({ children, orientation, className, onLayoutChanged }: any) => {
    group.onLayoutChanged = onLayoutChanged;
    return (
      <div
        data-testid="rp-group"
        data-orientation={orientation}
        className={className}
      >
        {children}
      </div>
    );
  },
  Panel: ({ children, id, defaultSize, minSize, maxSize, panelRef, groupResizeBehavior }: any) => {
    if (panelRef) Object.assign(panelRef, { current: { resize: resizeLeftPanel } });
    return (
      <div
        data-testid={`rp-panel-${id}`}
        data-default-size={defaultSize}
        data-min-size={minSize}
        data-max-size={maxSize}
        data-group-resize-behavior={groupResizeBehavior}
      >
        {children}
      </div>
    );
  },
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
  resizeLeftPanel.mockReset();
  group.onLayoutChanged = undefined;
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

  it('sizes the left pane to fitLeftSize and follows it while nobody has dragged the handle', () => {
    const { rerender } = render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        fitLeftSize="280px"
      />,
    );

    expect(resizeLeftPanel).toHaveBeenLastCalledWith('280px');

    group.onLayoutChanged?.({ 'split-pane-left': 30, 'split-pane-right': 70 }, { isUserInteraction: false });
    rerender(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        fitLeftSize="320px"
      />,
    );

    expect(resizeLeftPanel).toHaveBeenLastCalledWith('320px');
  });

  it('leaves the left pane at the width the user dragged it to', () => {
    const { rerender } = render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        fitLeftSize="280px"
      />,
    );
    resizeLeftPanel.mockClear();

    group.onLayoutChanged?.({ 'split-pane-left': 40, 'split-pane-right': 60 }, { isUserInteraction: true });
    group.onLayoutChanged?.({ 'split-pane-left': 50, 'split-pane-right': 50 }, { isUserInteraction: false });
    rerender(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        fitLeftSize="320px"
      />,
    );

    expect(resizeLeftPanel).not.toHaveBeenCalled();
  });

  it('fits the left pane again after a layout change the user did not make, so a narrowed window does not keep it clamped', () => {
    render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        fitLeftSize="280px"
      />,
    );
    resizeLeftPanel.mockClear();

    group.onLayoutChanged?.({ 'split-pane-left': 25, 'split-pane-right': 75 }, { isUserInteraction: false });

    expect(resizeLeftPanel).toHaveBeenCalledWith('280px');
  });

  it('keeps a fitted left pane at its pixel width when the window changes width', () => {
    render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        fitLeftSize="280px"
      />,
    );

    expect(screen.getByTestId('rp-panel-split-pane-left')).toHaveAttribute(
      'data-group-resize-behavior',
      'preserve-pixel-size',
    );
    expect(screen.getByTestId('rp-panel-split-pane-right')).not.toHaveAttribute('data-group-resize-behavior');
  });

  it('lets the left pane scale with the window when it does not fit its content', () => {
    render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
      />,
    );

    expect(screen.getByTestId('rp-panel-split-pane-left')).not.toHaveAttribute('data-group-resize-behavior');

    group.onLayoutChanged?.({ 'split-pane-left': 30, 'split-pane-right': 70 }, { isUserInteraction: false });

    expect(resizeLeftPanel).not.toHaveBeenCalled();
  });

  it('waits for a measured size while fitLeftSize is null', () => {
    render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        fitLeftSize={null}
      />,
    );

    expect(resizeLeftPanel).not.toHaveBeenCalled();
  });

  it('saves only dragged widths once the left pane fits its content, so a fitted width never counts as chosen', () => {
    render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        autoSaveId="fit-save-id"
        fitLeftSize={null}
      />,
    );

    expect(useDefaultLayoutMock).toHaveBeenCalledWith({
      id: 'fit-save-id',
      panelIds: ['split-pane-left', 'split-pane-right'],
      onlySaveAfterUserInteractions: true,
    });
  });

  it('fits the left pane while no width has been saved under its autoSaveId', () => {
    useDefaultLayoutMock.mockReturnValue({ defaultLayout: undefined, onLayoutChanged: vi.fn() });

    render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        autoSaveId="fit-save-id"
        fitLeftSize="280px"
      />,
    );

    expect(resizeLeftPanel).toHaveBeenLastCalledWith('280px');
  });

  it('keeps a width the user saved earlier instead of fitting the content', () => {
    useDefaultLayoutMock.mockReturnValue({
      defaultLayout: { 'split-pane-left': 45, 'split-pane-right': 55 },
      onLayoutChanged: vi.fn(),
    });

    render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        autoSaveId="fit-save-id"
        fitLeftSize="280px"
      />,
    );

    expect(resizeLeftPanel).not.toHaveBeenCalled();
  });

  it('still hands every layout change to the persistence hook', () => {
    const save = vi.fn();
    useDefaultLayoutMock.mockReturnValue({ defaultLayout: undefined, onLayoutChanged: save });
    render(
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        autoSaveId="fit-save-id"
        fitLeftSize="280px"
      />,
    );

    const layout = { 'split-pane-left': 40, 'split-pane-right': 60 };
    group.onLayoutChanged?.(layout, { isUserInteraction: true });

    expect(save).toHaveBeenCalledWith(layout, { isUserInteraction: true });
  });
});
