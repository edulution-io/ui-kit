/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { describe, expect, it } from 'vitest';
import normalizeWheelDelta from './normalizeWheelDelta';

const DOM_DELTA_PIXEL = 0;
const DOM_DELTA_LINE = 1;
const DOM_DELTA_PAGE = 2;

describe('normalizeWheelDelta', () => {
  it('returns deltaY unchanged for pixel-mode wheel events', () => {
    expect(normalizeWheelDelta({ deltaMode: DOM_DELTA_PIXEL, deltaY: 120 }, 300)).toBe(120);
  });

  it('scales line-mode deltas by the line height so a small line count produces a usable pixel delta', () => {
    expect(normalizeWheelDelta({ deltaMode: DOM_DELTA_LINE, deltaY: 3 }, 300)).toBe(48);
  });

  it('scales page-mode deltas by the provided page size', () => {
    expect(normalizeWheelDelta({ deltaMode: DOM_DELTA_PAGE, deltaY: 1 }, 300)).toBe(300);
  });

  it('preserves the scroll direction (sign) of the delta', () => {
    expect(normalizeWheelDelta({ deltaMode: DOM_DELTA_LINE, deltaY: -2 }, 300)).toBe(-32);
  });
});
