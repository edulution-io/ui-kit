/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { useResizablePanelLayout } from '../ResizablePanelGroup';
import SplitPaneDesktop from './SplitPaneDesktop';
import { SPLIT_PANE_PANEL_IDS } from './splitPaneInternals';
import type { SplitPaneProps } from './splitPaneInternals';

interface SplitPanePersistentDesktopProps {
  pane: SplitPaneProps;
  leftSize: number;
  autoSaveId: string;
}

const SplitPanePersistentDesktop: React.FC<SplitPanePersistentDesktopProps> = ({ pane, leftSize, autoSaveId }) => {
  const isFittedToContent = pane.fitLeftSize !== undefined;
  const { defaultLayout, onLayoutChanged } = useResizablePanelLayout(
    autoSaveId,
    SPLIT_PANE_PANEL_IDS,
    isFittedToContent ? { onlySaveAfterUserInteractions: true } : undefined,
  );

  return (
    <SplitPaneDesktop
      pane={pane}
      leftSize={leftSize}
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
      hasSavedLayout={defaultLayout !== undefined}
    />
  );
};

export default SplitPanePersistentDesktop;
