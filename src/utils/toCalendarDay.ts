/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import readWallClock from './readWallClock';
import MIDDAY_HOUR from '../constants/middayHour';

const toCalendarDay = (date: Date, timeZone?: string): Date => {
  if (!timeZone) return new Date(date.getTime());
  const { year, month, day } = readWallClock(date, timeZone);
  const calendarDay = new Date(date.getTime());
  calendarDay.setHours(MIDDAY_HOUR, 0, 0, 0);
  calendarDay.setFullYear(year, month - 1, day);
  calendarDay.setHours(0, 0, 0, 0);
  return calendarDay;
};

export default toCalendarDay;
