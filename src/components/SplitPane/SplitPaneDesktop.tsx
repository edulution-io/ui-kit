/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { useCallback, useEffect, useRef } from 'react';
import type { Layout, LayoutChangedMeta, PanelImperativeHandle, PanelProps } from 'react-resizable-panels';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, useResizablePanelLayout } from '../ResizablePanelGroup';
import cn from '../../utils/cn';
import {
  DEFAULT_MAX_END_SIZE,
  DEFAULT_MAX_LEFT_SIZE,
  DEFAULT_MIN_END_SIZE,
  DEFAULT_MIN_LEFT_SIZE,
  SPLIT_PANE_END_PANEL_ID,
  SPLIT_PANE_FITTED_RESIZE_BEHAVIOR,
  SPLIT_PANE_GROUP_CLASSES,
  SPLIT_PANE_LEFT_PANEL_ID,
  SPLIT_PANE_PANEL_CLASSES,
  SPLIT_PANE_PANEL_IDS,
  SPLIT_PANE_PANEL_IDS_WITH_END,
  SPLIT_PANE_RIGHT_PANEL_ID,
  hasEndPane,
  hasPanelSizeChanged,
  toPanelSetKey,
  toPercent,
} from './splitPaneInternals';
import type { SplitPaneProps } from './splitPaneInternals';

type LayoutHookResult = ReturnType<typeof useResizablePanelLayout>;

const FITTED_PANEL_IDS = [SPLIT_PANE_LEFT_PANEL_ID, SPLIT_PANE_END_PANEL_ID];

interface SplitPaneDesktopProps {
  pane: SplitPaneProps;
  leftSize: number;
  endSize: number;
  defaultLayout?: LayoutHookResult['defaultLayout'];
  onLayoutChanged?: LayoutHookResult['onLayoutChanged'];
  hasSavedLayout?: boolean;
}

const SplitPaneDesktop: React.FC<SplitPaneDesktopProps> = ({
  pane,
  leftSize,
  endSize,
  defaultLayout,
  onLayoutChanged,
  hasSavedLayout = false,
}) => {
  const {
    left,
    right,
    end,
    orientation,
    minLeftSize = DEFAULT_MIN_LEFT_SIZE,
    maxLeftSize = DEFAULT_MAX_LEFT_SIZE,
    fitLeftSize,
    minEndSize = DEFAULT_MIN_END_SIZE,
    maxEndSize = DEFAULT_MAX_END_SIZE,
    fitEndSize,
    handleAriaLabel,
    endHandleAriaLabel,
    withHandle = false,
    className,
  } = pane;
  const isEndShown = hasEndPane(end);
  const leftPanelRef = useRef<PanelImperativeHandle | null>(null);
  const endPanelRef = useRef<PanelImperativeHandle | null>(null);
  const userResizedPanelIdsRef = useRef(new Map<string, Set<string>>());
  const lastLayoutRef = useRef<Layout | undefined>(undefined);
  const isEndRegisteredRef = useRef(false);
  const shownPanelSetKey = toPanelSetKey(isEndShown ? SPLIT_PANE_PANEL_IDS_WITH_END : SPLIT_PANE_PANEL_IDS);

  const fitPanes = useCallback(() => {
    if (hasSavedLayout) return;
    const userResizedPanelIds = userResizedPanelIdsRef.current.get(shownPanelSetKey);
    if (fitLeftSize && !userResizedPanelIds?.has(SPLIT_PANE_LEFT_PANEL_ID)) leftPanelRef.current?.resize(fitLeftSize);
    if (isEndShown && fitEndSize && isEndRegisteredRef.current && !userResizedPanelIds?.has(SPLIT_PANE_END_PANEL_ID)) {
      endPanelRef.current?.resize(fitEndSize);
    }
  }, [fitLeftSize, fitEndSize, isEndShown, shownPanelSetKey, hasSavedLayout]);

  useEffect(() => fitPanes(), [fitPanes]);

  useEffect(() => {
    if (!isEndShown) isEndRegisteredRef.current = false;
  }, [isEndShown]);

  const handleEndPanelResize = useCallback<NonNullable<PanelProps['onResize']>>(
    (_panelSize, _panelId, previousPanelSize) => {
      if (previousPanelSize !== undefined) return;
      isEndRegisteredRef.current = true;
      fitPanes();
    },
    [fitPanes],
  );

  const handleLayoutChanged = useCallback(
    (layout: Layout, meta: LayoutChangedMeta) => {
      if (meta.isUserInteraction) {
        const panelSetKey = toPanelSetKey(Object.keys(layout));
        const userResizedPanelIds = userResizedPanelIdsRef.current.get(panelSetKey) ?? new Set<string>();
        FITTED_PANEL_IDS.filter((panelId) => hasPanelSizeChanged(lastLayoutRef.current, layout, panelId)).forEach(
          (panelId) => userResizedPanelIds.add(panelId),
        );
        userResizedPanelIdsRef.current.set(panelSetKey, userResizedPanelIds);
      }
      lastLayoutRef.current = layout;
      onLayoutChanged?.(layout, meta);
      fitPanes();
    },
    [onLayoutChanged, fitPanes],
  );

  return (
    <ResizablePanelGroup
      orientation={orientation}
      defaultLayout={defaultLayout}
      onLayoutChanged={handleLayoutChanged}
      className={cn(SPLIT_PANE_GROUP_CLASSES, className)}
    >
      <ResizablePanel
        id={SPLIT_PANE_LEFT_PANEL_ID}
        panelRef={leftPanelRef}
        groupResizeBehavior={fitLeftSize === undefined ? undefined : SPLIT_PANE_FITTED_RESIZE_BEHAVIOR}
        defaultSize={toPercent(leftSize)}
        minSize={toPercent(minLeftSize)}
        maxSize={toPercent(maxLeftSize)}
        className={SPLIT_PANE_PANEL_CLASSES}
      >
        {left}
      </ResizablePanel>
      <ResizableHandle
        withHandle={withHandle}
        aria-label={handleAriaLabel}
      />
      <ResizablePanel
        id={SPLIT_PANE_RIGHT_PANEL_ID}
        defaultSize={toPercent(100 - leftSize - (isEndShown ? endSize : 0))}
        className={SPLIT_PANE_PANEL_CLASSES}
      >
        {right}
      </ResizablePanel>
      {isEndShown && (
        <>
          <ResizableHandle
            withHandle={withHandle}
            aria-label={endHandleAriaLabel}
          />
          <ResizablePanel
            id={SPLIT_PANE_END_PANEL_ID}
            panelRef={endPanelRef}
            onResize={handleEndPanelResize}
            groupResizeBehavior={fitEndSize === undefined ? undefined : SPLIT_PANE_FITTED_RESIZE_BEHAVIOR}
            defaultSize={toPercent(endSize)}
            minSize={toPercent(minEndSize)}
            maxSize={toPercent(maxEndSize)}
            className={SPLIT_PANE_PANEL_CLASSES}
          >
            {end}
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default SplitPaneDesktop;
