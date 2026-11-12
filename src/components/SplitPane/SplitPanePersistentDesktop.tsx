/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { useResizablePanelLayout } from '../ResizablePanelGroup';
import SplitPaneDesktop from './SplitPaneDesktop';
import { SPLIT_PANE_PANEL_IDS, SPLIT_PANE_PANEL_IDS_WITH_END, hasEndPane } from './splitPaneInternals';
import type { SplitPaneProps } from './splitPaneInternals';

interface SplitPanePersistentDesktopProps {
  pane: SplitPaneProps;
  leftSize: number;
  endSize: number;
  autoSaveId: string;
}

const SplitPanePersistentDesktop: React.FC<SplitPanePersistentDesktopProps> = ({
  pane,
  leftSize,
  endSize,
  autoSaveId,
}) => {
  const isEndShown = hasEndPane(pane.end);
  const isFittedToContent = pane.fitLeftSize !== undefined || (isEndShown && pane.fitEndSize !== undefined);
  const { defaultLayout, onLayoutChanged } = useResizablePanelLayout(
    autoSaveId,
    isEndShown ? SPLIT_PANE_PANEL_IDS_WITH_END : SPLIT_PANE_PANEL_IDS,
    isFittedToContent ? { onlySaveAfterUserInteractions: true } : undefined,
  );

  return (
    <SplitPaneDesktop
      pane={pane}
      leftSize={leftSize}
      endSize={endSize}
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
      hasSavedLayout={defaultLayout !== undefined}
    />
  );
};

export default SplitPanePersistentDesktop;
