/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import WallClock from './wallClock';

const ZONED_PART_TYPES = ['year', 'month', 'day', 'hour', 'minute', 'second'] as const;

type ZonedPartType = (typeof ZONED_PART_TYPES)[number];

const formatters = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (timeZone: string): Intl.DateTimeFormat => {
  const cached = formatters.get(timeZone);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  formatters.set(timeZone, formatter);
  return formatter;
};

const isZonedPartType = (type: string): type is ZonedPartType => (ZONED_PART_TYPES as readonly string[]).includes(type);

const readLocalWallClock = (date: Date): WallClock => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
  hour: date.getHours(),
  minute: date.getMinutes(),
  second: date.getSeconds(),
  millisecond: date.getMilliseconds(),
});

const readWallClock = (date: Date, timeZone?: string): WallClock => {
  if (!timeZone || Number.isNaN(date.getTime())) return readLocalWallClock(date);
  const parts: Record<ZonedPartType, number> = { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0 };
  getFormatter(timeZone)
    .formatToParts(date)
    .forEach((part) => {
      if (isZonedPartType(part.type)) parts[part.type] = Number.parseInt(part.value, 10);
    });
  return { ...parts, millisecond: date.getUTCMilliseconds() };
};

export default readWallClock;
