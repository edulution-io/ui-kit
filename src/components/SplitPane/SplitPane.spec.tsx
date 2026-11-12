/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import SplitPane from './SplitPane';

const mediaQueryMatches = vi.fn<[string], boolean>(() => false);
const useDefaultLayoutMock = vi.fn();
const resizeLeftPanel = vi.fn();
const resizeEndPanel = vi.fn();
const panelResizeHandlers: Record<string, (size: unknown, id: string, previousSize: unknown) => void> = {};
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
  Panel: ({ children, id, defaultSize, minSize, maxSize, panelRef, groupResizeBehavior, onResize }: any) => {
    if (onResize) panelResizeHandlers[id] = onResize;
    if (panelRef)
      Object.assign(panelRef, { current: { resize: id === 'split-pane-end' ? resizeEndPanel : resizeLeftPanel } });
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
  resizeEndPanel.mockReset();
  Object.keys(panelResizeHandlers).forEach((id) => delete panelResizeHandlers[id]);
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

  describe('with an end pane', () => {
    const renderWithEnd = (props: Partial<React.ComponentProps<typeof SplitPane>> = {}) =>
      render(
        <SplitPane
          left={<span data-testid="left">left</span>}
          right={<span data-testid="right">right</span>}
          end={<span data-testid="end">end</span>}
          {...props}
        />,
      );

    it('renders the end pane after the right pane, behind a second separator with its own label', () => {
      renderWithEnd({ handleAriaLabel: 'Resize list', endHandleAriaLabel: 'Resize palette' });

      expect(screen.getByTestId('rp-panel-split-pane-end')).toContainElement(screen.getByTestId('end'));
      expect(screen.getAllByTestId('rp-separator')).toHaveLength(2);
      expect(screen.getByRole('separator', { name: 'Resize palette' })).toBeInTheDocument();
      expect(screen.getByTestId('rp-panel-split-pane-right').compareDocumentPosition(screen.getByTestId('end'))).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });

    it('gives the right pane what the left and the end pane leave', () => {
      renderWithEnd({ defaultLeftSize: '1/4', defaultEndSize: '1/4', minEndSize: 15, maxEndSize: 35 });

      expect(screen.getByTestId('rp-panel-split-pane-right')).toHaveAttribute('data-default-size', '50%');
      const endPanel = screen.getByTestId('rp-panel-split-pane-end');
      expect(endPanel).toHaveAttribute('data-default-size', '25%');
      expect(endPanel).toHaveAttribute('data-min-size', '15%');
      expect(endPanel).toHaveAttribute('data-max-size', '35%');
    });

    it('starts the end pane at a quarter, bounded to 10 to 40 percent, when no sizes are given', () => {
      renderWithEnd();

      const endPanel = screen.getByTestId('rp-panel-split-pane-end');
      expect(endPanel).toHaveAttribute('data-default-size', '25%');
      expect(endPanel).toHaveAttribute('data-min-size', '10%');
      expect(endPanel).toHaveAttribute('data-max-size', '40%');
    });

    it('keeps the two-pane layout when end is false, as a conditional end renders it', () => {
      renderWithEnd({ end: false, defaultLeftSize: '1/4' });

      expect(screen.queryByTestId('rp-panel-split-pane-end')).toBeNull();
      expect(screen.getAllByTestId('rp-separator')).toHaveLength(1);
      expect(screen.getByTestId('rp-panel-split-pane-right')).toHaveAttribute('data-default-size', '75%');
    });

    it('keeps the end pane out of the mobile view while mobilePane is not "end"', () => {
      mediaQueryMatches.mockReturnValue(true);
      renderWithEnd({ mobilePane: 'right' });

      expect(screen.getByTestId('right')).toBeInTheDocument();
      expect(screen.queryByTestId('end')).toBeNull();
    });

    it('shows only the end pane on mobile when mobilePane is "end", as a view the page switches to', () => {
      mediaQueryMatches.mockReturnValue(true);
      renderWithEnd({ mobilePane: 'end' });

      expect(screen.getByTestId('end')).toBeInTheDocument();
      expect(screen.queryByTestId('right')).toBeNull();
      expect(screen.queryByTestId('left')).toBeNull();
    });

    it('falls back to the right pane on mobile when mobilePane is "end" but there is no end pane', () => {
      mediaQueryMatches.mockReturnValue(true);
      renderWithEnd({ mobilePane: 'end', end: false });

      expect(screen.getByTestId('right')).toBeInTheDocument();
      expect(screen.queryByTestId('left')).toBeNull();
    });

    it('stores the three-pane layout under its own panel ids, apart from the two-pane one', () => {
      renderWithEnd({ autoSaveId: 'three-pane-id' });

      expect(useDefaultLayoutMock).toHaveBeenCalledWith({
        id: 'three-pane-id',
        panelIds: ['split-pane-left', 'split-pane-right', 'split-pane-end'],
      });
    });

    const registerEndPane = () =>
      act(() =>
        panelResizeHandlers['split-pane-end']({ asPercentage: 25, inPixels: 200 }, 'split-pane-end', undefined),
      );

    it('sizes the end pane to fitEndSize once the library has mounted it, and keeps its pixel width while nobody has dragged a handle', () => {
      const { rerender } = renderWithEnd({ fitEndSize: '11rem' });

      expect(resizeEndPanel).not.toHaveBeenCalled();

      registerEndPane();

      expect(resizeEndPanel).toHaveBeenLastCalledWith('11rem');
      expect(resizeLeftPanel).not.toHaveBeenCalled();
      expect(screen.getByTestId('rp-panel-split-pane-end')).toHaveAttribute(
        'data-group-resize-behavior',
        'preserve-pixel-size',
      );

      resizeEndPanel.mockClear();
      group.onLayoutChanged?.(
        { 'split-pane-left': 30, 'split-pane-right': 50, 'split-pane-end': 20 },
        { isUserInteraction: true },
      );
      rerender(
        <SplitPane
          left={<span>l</span>}
          right={<span>r</span>}
          end={<span>e</span>}
          fitEndSize="14rem"
        />,
      );

      expect(resizeEndPanel).not.toHaveBeenCalled();
    });

    const fittedView = (end?: React.ReactNode) => (
      <SplitPane
        left={<span>l</span>}
        right={<span>r</span>}
        end={end}
        fitLeftSize="280px"
        fitEndSize="12rem"
      />
    );

    it('fits both panes when an end pane appears after the user dragged the left handle, as the library lays the three panes out afresh', () => {
      const { rerender } = render(fittedView());
      group.onLayoutChanged?.({ 'split-pane-left': 40, 'split-pane-right': 60 }, { isUserInteraction: true });

      rerender(fittedView(<span>e</span>));
      resizeLeftPanel.mockClear();
      registerEndPane();

      expect(resizeEndPanel).toHaveBeenLastCalledWith('12rem');
      expect(resizeLeftPanel).toHaveBeenLastCalledWith('280px');
    });

    it('does not fit a left pane the user dragged without an end pane again once the end pane is gone', () => {
      const { rerender } = render(fittedView());
      group.onLayoutChanged?.({ 'split-pane-left': 40, 'split-pane-right': 60 }, { isUserInteraction: true });
      rerender(fittedView(<span>e</span>));
      registerEndPane();
      resizeLeftPanel.mockClear();

      rerender(fittedView());

      expect(resizeLeftPanel).not.toHaveBeenCalled();
    });

    it('fits both panes when the end pane appears and only a two-pane layout was saved, as that drag says nothing about three panes', () => {
      useDefaultLayoutMock.mockImplementation(({ panelIds }: { panelIds: string[] }) => ({
        defaultLayout: panelIds.length === 2 ? { 'split-pane-left': 40, 'split-pane-right': 60 } : undefined,
        onLayoutChanged: vi.fn(),
      }));
      const view = (end?: React.ReactNode) => (
        <SplitPane
          left={<span>l</span>}
          right={<span>r</span>}
          end={end}
          autoSaveId="two-pane-saved-id"
          fitLeftSize="280px"
          fitEndSize="12rem"
        />
      );
      const { rerender } = render(view());

      expect(resizeLeftPanel).not.toHaveBeenCalled();

      rerender(view(<span>e</span>));
      registerEndPane();

      expect(resizeEndPanel).toHaveBeenLastCalledWith('12rem');
      expect(resizeLeftPanel).toHaveBeenLastCalledWith('280px');
    });

    it('keeps fitting the left pane after the user dragged only the end handle, and stops fitting the end pane', () => {
      const view = (fitLeftSize: string, fitEndSize: string) => (
        <SplitPane
          left={<span>l</span>}
          right={<span>r</span>}
          end={<span>e</span>}
          fitLeftSize={fitLeftSize}
          fitEndSize={fitEndSize}
        />
      );
      const { rerender } = render(view('280px', '12rem'));
      registerEndPane();
      group.onLayoutChanged?.(
        { 'split-pane-left': 30, 'split-pane-right': 50, 'split-pane-end': 20 },
        { isUserInteraction: false },
      );
      group.onLayoutChanged?.(
        { 'split-pane-left': 30, 'split-pane-right': 40, 'split-pane-end': 30 },
        { isUserInteraction: true },
      );
      resizeLeftPanel.mockClear();
      resizeEndPanel.mockClear();

      rerender(view('300px', '14rem'));

      expect(resizeLeftPanel).toHaveBeenLastCalledWith('300px');
      expect(resizeEndPanel).not.toHaveBeenCalled();
    });

    it('waits for an end pane that appears later until the library has mounted it, then fits it', () => {
      const view = (end?: React.ReactNode) => (
        <SplitPane
          left={<span>l</span>}
          right={<span>r</span>}
          end={end}
          fitEndSize="12rem"
        />
      );
      const { rerender } = render(view());

      rerender(view(<span>e</span>));

      expect(resizeEndPanel).not.toHaveBeenCalled();

      registerEndPane();

      expect(resizeEndPanel).toHaveBeenCalledWith('12rem');
    });

    it('waits again for the library to mount an end pane that was hidden and is shown again before fitting it', () => {
      const view = (end?: React.ReactNode) => (
        <SplitPane
          left={<span>l</span>}
          right={<span>r</span>}
          end={end}
          fitEndSize="12rem"
        />
      );
      const { rerender } = render(view(<span>e</span>));
      registerEndPane();
      rerender(view());
      resizeEndPanel.mockClear();

      rerender(view(<span>e</span>));

      expect(resizeEndPanel).not.toHaveBeenCalled();

      registerEndPane();

      expect(resizeEndPanel).toHaveBeenCalledWith('12rem');
    });

    it('keeps the three-pane widths saved earlier when the end pane appears after mount, instead of fitting over them', () => {
      useDefaultLayoutMock.mockImplementation(({ panelIds }: { panelIds: string[] }) => ({
        defaultLayout:
          panelIds.length === 3 ? { 'split-pane-left': 25, 'split-pane-right': 55, 'split-pane-end': 20 } : undefined,
        onLayoutChanged: vi.fn(),
      }));
      const view = (end?: React.ReactNode) => (
        <SplitPane
          left={<span>l</span>}
          right={<span>r</span>}
          end={end}
          autoSaveId="late-end-id"
          fitLeftSize="280px"
          fitEndSize="12rem"
        />
      );
      const { rerender } = render(view());

      expect(resizeLeftPanel).toHaveBeenLastCalledWith('280px');

      resizeLeftPanel.mockClear();
      rerender(view(<span>e</span>));
      registerEndPane();

      expect(resizeLeftPanel).not.toHaveBeenCalled();
      expect(resizeEndPanel).not.toHaveBeenCalled();
    });

    it('fits the end pane only on the call that reports it mounted, not on every later resize', () => {
      renderWithEnd({ fitEndSize: '11rem' });
      registerEndPane();
      resizeEndPanel.mockClear();

      act(() =>
        panelResizeHandlers['split-pane-end']({ asPercentage: 30, inPixels: 240 }, 'split-pane-end', {
          asPercentage: 25,
          inPixels: 200,
        }),
      );

      expect(resizeEndPanel).not.toHaveBeenCalled();
    });

    it('saves only dragged layouts once the end pane fits its content', () => {
      renderWithEnd({ autoSaveId: 'fitted-end-id', fitEndSize: '11rem' });

      expect(useDefaultLayoutMock).toHaveBeenCalledWith({
        id: 'fitted-end-id',
        panelIds: ['split-pane-left', 'split-pane-right', 'split-pane-end'],
        onlySaveAfterUserInteractions: true,
      });
    });
  });
});
