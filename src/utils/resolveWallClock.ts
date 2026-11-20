/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import WallClock from './wallClock';
import readWallClock from './readWallClock';
import MIDDAY_HOUR from '../constants/middayHour';

const OFFSET_PROBE_DISTANCE_MS = 24 * 60 * 60 * 1000;
const START_OF_DAY: Pick<WallClock, 'hour' | 'minute' | 'second' | 'millisecond'> = {
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0,
};

const toNaiveUtcMs = ({ year, month, day, hour, minute, second, millisecond }: WallClock): number => {
  const naive = new Date(0);
  naive.setUTCFullYear(year, month - 1, day);
  naive.setUTCHours(hour, minute, second, millisecond);
  return naive.getTime();
};

const getOffsetMs = (instant: number, timeZone: string): number =>
  toNaiveUtcMs(readWallClock(new Date(instant), timeZone)) - instant;

const hasDatePatch = (patch: Partial<WallClock>): boolean =>
  patch.year !== undefined || patch.month !== undefined || patch.day !== undefined;

const hasTimePatch = (patch: Partial<WallClock>): boolean =>
  patch.hour !== undefined ||
  patch.minute !== undefined ||
  patch.second !== undefined ||
  patch.millisecond !== undefined;

const resolveLocalWallClock = (base: Date, patch: Partial<WallClock>): Date => {
  const baseTimeOfDay = Number.isNaN(base.getTime()) ? START_OF_DAY : {};
  const { year, month, day, hour, minute, second, millisecond } = {
    ...readWallClock(base),
    ...baseTimeOfDay,
    ...patch,
  };
  const next = new Date(base.getTime());
  if (hasDatePatch(patch)) {
    next.setHours(MIDDAY_HOUR, 0, 0, 0);
    next.setFullYear(year, month - 1, day);
    next.setHours(hour, minute, second, millisecond);
    return next;
  }
  if (hasTimePatch(patch)) next.setHours(hour, minute, second, millisecond);
  return next;
};

const resolveZonedWallClock = (base: Date, patch: Partial<WallClock>, timeZone: string, hasValue: boolean): Date => {
  const naive = toNaiveUtcMs({ ...readWallClock(base, timeZone), ...patch });
  const beforeChange = naive - getOffsetMs(naive - OFFSET_PROBE_DISTANCE_MS, timeZone);
  const afterChange = naive - getOffsetMs(naive + OFFSET_PROBE_DISTANCE_MS, timeZone);
  const matching = [...new Set([beforeChange, afterChange])].filter(
    (candidate) => getOffsetMs(candidate, timeZone) === naive - candidate,
  );
  if (matching.length === 0) return new Date(beforeChange);
  if (!hasValue) return new Date(Math.max(...matching));
  const baseOffset = getOffsetMs(base.getTime(), timeZone);
  const keepingOffset = matching.find((candidate) => naive - candidate === baseOffset);
  return new Date(keepingOffset ?? Math.max(...matching));
};

const resolveWallClock = (value: Date | null, patch: Partial<WallClock>, timeZone?: string): Date => {
  const base = value ?? new Date();
  if (!timeZone) return resolveLocalWallClock(base, patch);
  if (Number.isNaN(base.getTime())) {
    if (!hasDatePatch(patch)) return new Date(base.getTime());
    return resolveZonedWallClock(base, { ...START_OF_DAY, ...patch }, timeZone, false);
  }
  return resolveZonedWallClock(base, patch, timeZone, value !== null);
};

export default resolveWallClock;
