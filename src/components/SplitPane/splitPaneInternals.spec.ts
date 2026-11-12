/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import {
  SPLIT_PANE_PANEL_IDS,
  SPLIT_PANE_PANEL_IDS_WITH_END,
  hasEndPane,
  hasPanelSizeChanged,
  resolveEndSize,
  resolveLeftSize,
  toPanelSetKey,
  toPercent,
} from './splitPaneInternals';

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

  describe('resolveEndSize', () => {
    it('returns the number unchanged when given a numeric size', () => {
      expect(resolveEndSize(18)).toBe(18);
    });

    it('maps a preset to its percentage', () => {
      expect(resolveEndSize('1/3')).toBeCloseTo(100 / 3);
    });

    it('falls back to the 1/4 preset when size is undefined', () => {
      expect(resolveEndSize(undefined)).toBe(25);
    });
  });

  describe('hasEndPane', () => {
    it('treats undefined, null and false as no end pane, as a conditional render produces them', () => {
      expect(hasEndPane(undefined)).toBe(false);
      expect(hasEndPane(null)).toBe(false);
      expect(hasEndPane(false)).toBe(false);
    });

    it('treats an element as an end pane', () => {
      expect(hasEndPane(React.createElement('span'))).toBe(true);
    });
  });

  describe('hasPanelSizeChanged', () => {
    it('is false for a panel the next layout does not contain', () => {
      expect(hasPanelSizeChanged({ a: 30 }, { b: 70 }, 'a')).toBe(false);
    });

    it('is true when there is no previous size to compare with', () => {
      expect(hasPanelSizeChanged(undefined, { a: 30 }, 'a')).toBe(true);
      expect(hasPanelSizeChanged({ b: 70 }, { a: 30 }, 'a')).toBe(true);
    });

    it('is true when the size moved and false when it only differs by rounding', () => {
      expect(hasPanelSizeChanged({ a: 30 }, { a: 32 }, 'a')).toBe(true);
      expect(hasPanelSizeChanged({ a: 30 }, { a: 30.004 }, 'a')).toBe(false);
    });
  });

  describe('toPanelSetKey', () => {
    it('names a set of panels independently of their order', () => {
      expect(toPanelSetKey(['b', 'a'])).toBe(toPanelSetKey(['a', 'b']));
    });

    it('tells a two-pane set from a three-pane set', () => {
      expect(toPanelSetKey(SPLIT_PANE_PANEL_IDS)).not.toBe(toPanelSetKey(SPLIT_PANE_PANEL_IDS_WITH_END));
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
