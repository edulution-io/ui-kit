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
import useMediaQuery from '../../hooks/useMediaQuery';
import cn from '../../utils/cn';
import SplitPaneDesktop from './SplitPaneDesktop';
import SplitPanePersistentDesktop from './SplitPanePersistentDesktop';
import {
  DEFAULT_MOBILE_BREAKPOINT_QUERY,
  DEFAULT_MOBILE_PANE,
  resolveLeftSize,
  SPLIT_PANE_MOBILE_CLASSES,
} from './splitPaneInternals';
import type { SplitPaneProps } from './splitPaneInternals';

const SplitPane: React.FC<SplitPaneProps> = (pane) => {
  const {
    left,
    right,
    defaultLeftSize,
    autoSaveId,
    mobilePane = DEFAULT_MOBILE_PANE,
    mobileBreakpointQuery = DEFAULT_MOBILE_BREAKPOINT_QUERY,
    className,
  } = pane;
  const isMobileView = useMediaQuery(mobileBreakpointQuery);

  if (isMobileView) {
    return <div className={cn(SPLIT_PANE_MOBILE_CLASSES, className)}>{mobilePane === 'right' ? right : left}</div>;
  }

  const leftSize = resolveLeftSize(defaultLeftSize);

  if (autoSaveId) {
    return (
      <SplitPanePersistentDesktop
        pane={pane}
        leftSize={leftSize}
        autoSaveId={autoSaveId}
      />
    );
  }

  return (
    <SplitPaneDesktop
      pane={pane}
      leftSize={leftSize}
    />
  );
};

export default SplitPane;
