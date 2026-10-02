/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { useCallback, useEffect, useRef } from 'react';
import type { Layout, LayoutChangedMeta, PanelImperativeHandle } from 'react-resizable-panels';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, useResizablePanelLayout } from '../ResizablePanelGroup';
import cn from '../../utils/cn';
import {
  DEFAULT_MAX_LEFT_SIZE,
  DEFAULT_MIN_LEFT_SIZE,
  SPLIT_PANE_FITTED_RESIZE_BEHAVIOR,
  SPLIT_PANE_GROUP_CLASSES,
  SPLIT_PANE_LEFT_PANEL_ID,
  SPLIT_PANE_PANEL_CLASSES,
  SPLIT_PANE_RIGHT_PANEL_ID,
  toPercent,
} from './splitPaneInternals';
import type { SplitPaneProps } from './splitPaneInternals';

type LayoutHookResult = ReturnType<typeof useResizablePanelLayout>;

interface SplitPaneDesktopProps {
  pane: SplitPaneProps;
  leftSize: number;
  defaultLayout?: LayoutHookResult['defaultLayout'];
  onLayoutChanged?: LayoutHookResult['onLayoutChanged'];
  hasSavedLayout?: boolean;
}

const SplitPaneDesktop: React.FC<SplitPaneDesktopProps> = ({
  pane,
  leftSize,
  defaultLayout,
  onLayoutChanged,
  hasSavedLayout = false,
}) => {
  const {
    left,
    right,
    orientation,
    minLeftSize = DEFAULT_MIN_LEFT_SIZE,
    maxLeftSize = DEFAULT_MAX_LEFT_SIZE,
    fitLeftSize,
    handleAriaLabel,
    withHandle = false,
    className,
  } = pane;
  const leftPanelRef = useRef<PanelImperativeHandle | null>(null);
  const hasUserSizedLeftRef = useRef(hasSavedLayout);

  const fitLeftPane = useCallback(() => {
    if (!fitLeftSize || hasUserSizedLeftRef.current) return;
    leftPanelRef.current?.resize(fitLeftSize);
  }, [fitLeftSize]);

  useEffect(() => fitLeftPane(), [fitLeftPane]);

  const handleLayoutChanged = useCallback(
    (layout: Layout, meta: LayoutChangedMeta) => {
      if (meta.isUserInteraction) hasUserSizedLeftRef.current = true;
      onLayoutChanged?.(layout, meta);
      fitLeftPane();
    },
    [onLayoutChanged, fitLeftPane],
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
        defaultSize={toPercent(100 - leftSize)}
        className={SPLIT_PANE_PANEL_CLASSES}
      >
        {right}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default SplitPaneDesktop;
