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
