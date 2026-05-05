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

import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, useResizablePanelLayout } from '../ResizablePanelGroup';
import cn from '../../utils/cn';
import {
  DEFAULT_MAX_LEFT_SIZE,
  DEFAULT_MIN_LEFT_SIZE,
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
}

const SplitPaneDesktop: React.FC<SplitPaneDesktopProps> = ({ pane, leftSize, defaultLayout, onLayoutChanged }) => {
  const {
    left,
    right,
    orientation,
    minLeftSize = DEFAULT_MIN_LEFT_SIZE,
    maxLeftSize = DEFAULT_MAX_LEFT_SIZE,
    handleAriaLabel,
    withHandle = false,
    className,
  } = pane;

  return (
    <ResizablePanelGroup
      orientation={orientation}
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
      className={cn(SPLIT_PANE_GROUP_CLASSES, className)}
    >
      <ResizablePanel
        id={SPLIT_PANE_LEFT_PANEL_ID}
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
