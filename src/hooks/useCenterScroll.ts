/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { useEffect, type RefObject } from 'react';

const useCenterScroll = (
  ref: RefObject<HTMLElement | null>,
  targetPx: number,
  containerWidth: number,
  trackWidthPx: number,
): void => {
  useEffect(() => {
    const node = ref.current;
    if (!node || containerWidth === 0) return;
    const target = targetPx - containerWidth / 2;
    const max = Math.max(0, trackWidthPx - containerWidth);
    node.scrollLeft = Math.max(0, Math.min(target, max));
  }, [ref, targetPx, containerWidth, trackWidthPx]);
};

export default useCenterScroll;
