/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import resolveWallClock from './resolveWallClock';

const NEW_YORK = 'America/New_York';
const LORD_HOWE = 'Australia/Lord_Howe';
const NUUK = 'America/Nuuk';

const resolveIso = (baseIso: string, patch: Parameters<typeof resolveWallClock>[1], timeZone?: string) =>
  resolveWallClock(new Date(baseIso), patch, timeZone).toISOString();

describe('resolveWallClock', () => {
  it('runs under a browser zone whose DST gap differs from the value zone', () => {
    expect(new Date(2025, 2, 30, 2, 30).getHours()).toBe(3);
  });

  describe('with a time zone', () => {
    it('moves the hour in the value zone and keeps minutes, seconds and milliseconds', () => {
      expect(resolveIso('2025-06-10T13:45:12.345Z', { hour: 20 }, NEW_YORK)).toBe('2025-06-11T00:45:12.345Z');
    });

    it('moves the day in the value zone and keeps the time of day there', () => {
      expect(resolveIso('2025-06-10T13:45:00.000Z', { year: 2025, month: 1, day: 20 }, NEW_YORK)).toBe(
        '2025-01-20T14:45:00.000Z',
      );
    });

    it('resolves a wall clock the browser zone skips but the value zone does not', () => {
      expect(resolveIso('2025-03-29T10:00:00.000Z', { day: 30, hour: 2, minute: 30 }, NEW_YORK)).toBe(
        '2025-03-30T06:30:00.000Z',
      );
    });

    it('moves a wall clock the value zone skips past the jump by the length of the gap', () => {
      expect(resolveIso('2025-03-08T15:00:00.000Z', { day: 9, hour: 2, minute: 30 }, NEW_YORK)).toBe(
        '2025-03-09T07:30:00.000Z',
      );
    });

    it('keeps the earlier instant of a repeated hour when the value already has its offset', () => {
      expect(resolveIso('2025-11-02T05:10:00.000Z', { minute: 30 }, NEW_YORK)).toBe('2025-11-02T05:30:00.000Z');
    });

    it('keeps the later instant of a repeated hour when the value already has its offset', () => {
      expect(resolveIso('2025-11-02T06:10:00.000Z', { minute: 30 }, NEW_YORK)).toBe('2025-11-02T06:30:00.000Z');
    });

    it('takes the later instant of a repeated wall clock when the value has neither offset', () => {
      expect(
        resolveIso('1980-05-31T14:00:00.000Z', { year: 2025, month: 4, day: 6, hour: 1, minute: 45 }, LORD_HOWE),
      ).toBe('2025-04-05T15:15:00.000Z');
    });

    it('takes the later instant of a repeated wall clock when there is no value, whatever offset today has', () => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date('2025-07-15T12:00:00.000Z'));
      try {
        expect(
          resolveWallClock(null, { year: 2025, month: 11, day: 2, hour: 1, minute: 30 }, NEW_YORK).toISOString(),
        ).toBe('2025-11-02T06:30:00.000Z');
      } finally {
        vi.useRealTimers();
      }
    });
    it('starts a new day at midnight in the value zone when the base is an invalid date', () => {
      expect(resolveWallClock(new Date(Number.NaN), { year: 2025, month: 3, day: 30 }, NEW_YORK).toISOString()).toBe(
        '2025-03-30T04:00:00.000Z',
      );
    });

    it('resolves a typed date and time in the value zone when the base is an invalid date', () => {
      expect(
        resolveWallClock(
          new Date(Number.NaN),
          { year: 2025, month: 3, day: 30, hour: 10, minute: 0 },
          NEW_YORK,
        ).toISOString(),
      ).toBe('2025-03-30T14:00:00.000Z');
    });

    it('keeps an invalid base invalid for a time-only change in the value zone', () => {
      expect(Number.isNaN(resolveWallClock(new Date(Number.NaN), { hour: 3 }, NEW_YORK).getTime())).toBe(true);
    });

    it('takes the time of day of now in the value zone when a day is picked without a value', () => {
      vi.useFakeTimers({ toFake: ['Date'] });
      try {
        vi.setSystemTime(new Date('2025-01-10T15:20:00.000Z'));

        expect(resolveWallClock(null, { year: 2025, month: 3, day: 30 }, NEW_YORK).toISOString()).toBe(
          '2025-03-30T14:20:00.000Z',
        );
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('without a time zone', () => {
    it('matches Date#setHours, including the browser zone normalising a skipped wall clock', () => {
      const base = new Date(2025, 2, 30, 1, 30, 15, 250);
      const expected = new Date(base.getTime());
      expected.setHours(2);

      expect(resolveWallClock(base, { hour: 2 }).getTime()).toBe(expected.getTime());
    });

    it('matches Date#setFullYear for a date change and keeps the time of day', () => {
      const base = new Date(2026, 0, 5, 9, 45, 30);
      const expected = new Date(base.getTime());
      expected.setFullYear(2026, 2, 15);

      expect(resolveWallClock(base, { year: 2026, month: 3, day: 15 }).getTime()).toBe(expected.getTime());
    });

    it('resolves a typed time on the typed day, not on the day the browser zone skipped it', () => {
      const base = new Date(2025, 2, 30, 3, 30);

      expect(resolveWallClock(base, { year: 2025, month: 3, day: 29, hour: 2, minute: 30 }).getTime()).toBe(
        new Date(2025, 2, 29, 2, 30).getTime(),
      );
    });

    it('starts a new day at midnight when the base is an invalid date, as Date#setFullYear does', () => {
      const invalid = new Date(Number.NaN);
      const expected = new Date(Number.NaN);
      expected.setFullYear(2025, 2, 30);

      expect(resolveWallClock(invalid, { year: 2025, month: 3, day: 30 }).getTime()).toBe(expected.getTime());
    });

    it('keeps an invalid base invalid for a time-only change, as Date#setHours does', () => {
      expect(Number.isNaN(resolveWallClock(new Date(Number.NaN), { hour: 3 }).getTime())).toBe(true);
    });

    it('does not mutate the base date', () => {
      const base = new Date(2026, 0, 5, 9, 45);
      resolveWallClock(base, { hour: 3 }, NEW_YORK);
      resolveWallClock(base, { hour: 3 });

      expect(base.getHours()).toBe(9);
    });
  });

  describe('without a time zone, in a browser zone whose DST gap ends at midnight', () => {
    const originalTimeZone = process.env.TZ;

    beforeAll(() => {
      process.env.TZ = NUUK;
    });

    afterAll(() => {
      process.env.TZ = originalTimeZone;
    });

    it('runs under a browser zone that skips 23:00-24:00 on the transition Saturday', () => {
      expect(new Date(2024, 2, 30, 23, 30).getDate()).toBe(31);
    });

    it('keeps a typed date and time on the typed day when the kept time of day does not exist there', () => {
      const base = new Date(2024, 2, 20, 23, 30);

      expect(resolveWallClock(base, { year: 2024, month: 3, day: 30, hour: 10, minute: 0 }).getTime()).toBe(
        new Date(2024, 2, 30, 10, 0).getTime(),
      );
    });

    it('moves a kept time of day that the typed day skips past the jump, as the Date constructor does', () => {
      const base = new Date(2024, 2, 20, 23, 30);

      expect(resolveWallClock(base, { year: 2024, month: 3, day: 30 }).getTime()).toBe(
        new Date(2024, 2, 30, 23, 30).getTime(),
      );
    });
  });
});
