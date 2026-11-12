/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import cn from '../../utils/cn';
import SplitPaneDesktop from './SplitPaneDesktop';
import SplitPanePersistentDesktop from './SplitPanePersistentDesktop';
import {
  DEFAULT_MOBILE_BREAKPOINT_QUERY,
  DEFAULT_MOBILE_PANE,
  pickMobilePane,
  resolveEndSize,
  resolveLeftSize,
  SPLIT_PANE_MOBILE_CLASSES,
} from './splitPaneInternals';
import type { SplitPaneProps } from './splitPaneInternals';

const SplitPane: React.FC<SplitPaneProps> = (pane) => {
  const {
    left,
    right,
    end,
    defaultLeftSize,
    defaultEndSize,
    autoSaveId,
    mobilePane = DEFAULT_MOBILE_PANE,
    mobileBreakpointQuery = DEFAULT_MOBILE_BREAKPOINT_QUERY,
    className,
  } = pane;
  const isMobileView = useMediaQuery(mobileBreakpointQuery);

  if (isMobileView) {
    return (
      <div className={cn(SPLIT_PANE_MOBILE_CLASSES, className)}>{pickMobilePane({ left, right, end }, mobilePane)}</div>
    );
  }

  const leftSize = resolveLeftSize(defaultLeftSize);
  const endSize = resolveEndSize(defaultEndSize);

  if (autoSaveId) {
    return (
      <SplitPanePersistentDesktop
        pane={pane}
        leftSize={leftSize}
        endSize={endSize}
        autoSaveId={autoSaveId}
      />
    );
  }

  return (
    <SplitPaneDesktop
      pane={pane}
      leftSize={leftSize}
      endSize={endSize}
    />
  );
};

export default SplitPane;
