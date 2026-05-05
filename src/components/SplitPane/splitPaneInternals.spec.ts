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

import { resolveLeftSize, toPercent } from './splitPaneInternals';

describe('splitPaneInternals', () => {
  describe('resolveLeftSize', () => {
    it('returns the number unchanged when given a numeric size', () => {
      expect(resolveLeftSize(42)).toBe(42);
    });

    it('maps known presets to their percentage equivalents', () => {
      expect(resolveLeftSize('1/4')).toBe(25);
      expect(resolveLeftSize('1/3')).toBeCloseTo(100 / 3);
      expect(resolveLeftSize('1/2')).toBe(50);
      expect(resolveLeftSize('2/3')).toBeCloseTo(200 / 3);
      expect(resolveLeftSize('3/4')).toBe(75);
    });

    it('falls back to the 1/3 preset when size is undefined', () => {
      expect(resolveLeftSize(undefined)).toBeCloseTo(100 / 3);
    });

    it('falls back to the 1/3 preset when size is an unknown string', () => {
      expect(resolveLeftSize('5/6' as never)).toBeCloseTo(100 / 3);
    });
  });

  describe('toPercent', () => {
    it('formats numbers as percent strings', () => {
      expect(toPercent(50)).toBe('50%');
      expect(toPercent(0)).toBe('0%');
      expect(toPercent(100)).toBe('100%');
    });
  });
});
