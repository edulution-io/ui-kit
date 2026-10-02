/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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
