/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import isValidDate from './isValidDate';
import readWallClock from './readWallClock';
import type WallClock from './wallClock';

const isInvalidDate = (base: Date | null): boolean => base !== null && !isValidDate(base);

const hasDate = (patch: Partial<WallClock>): boolean =>
  patch.year !== undefined || patch.month !== undefined || patch.day !== undefined;

const withTodayForInvalidBase = (
  base: Date | null,
  patch: Partial<WallClock>,
  timeZone?: string,
): Partial<WallClock> => {
  if (!isInvalidDate(base) || hasDate(patch)) return patch;
  const { year, month, day } = readWallClock(new Date(), timeZone);
  return { year, month, day, ...patch };
};

export default withTodayForInvalidBase;
