/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import isValidDate from './isValidDate';
import toCalendarDay from './toCalendarDay';

const toDisplayMonth = (value: unknown, timeZone?: string): Date =>
  toCalendarDay(isValidDate(value) ? value : new Date(), timeZone);

export default toDisplayMonth;
