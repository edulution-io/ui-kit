/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { describe, expect, it } from 'vitest';
import readWallClock from './readWallClock';

describe('readWallClock', () => {
  it('runs under a browser zone that skips the wall clock the value has in its own zone', () => {
    expect(new Date(2025, 2, 30, 2, 30).getHours()).toBe(3);
  });

  it('reads the wall clock in the given zone, including one the browser zone skips', () => {
    expect(readWallClock(new Date('2025-03-30T06:30:15.250Z'), 'America/New_York')).toEqual({
      year: 2025,
      month: 3,
      day: 30,
      hour: 2,
      minute: 30,
      second: 15,
      millisecond: 250,
    });
  });

  it('reads midnight in the given zone as hour 0', () => {
    expect(readWallClock(new Date('2025-06-10T04:00:00.000Z'), 'America/New_York').hour).toBe(0);
  });

  it('reads the browser-local fields without a zone', () => {
    expect(readWallClock(new Date(2025, 2, 30, 8, 30, 15, 250))).toEqual({
      year: 2025,
      month: 3,
      day: 30,
      hour: 8,
      minute: 30,
      second: 15,
      millisecond: 250,
    });
  });

  it('reads NaN fields from an invalid date instead of throwing', () => {
    expect(readWallClock(new Date(Number.NaN), 'America/New_York').hour).toBeNaN();
  });
});
