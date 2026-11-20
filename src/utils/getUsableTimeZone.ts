/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

const usableTimeZones = new Map<string, boolean>();

const isUsableTimeZone = (timeZone: string): boolean => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format();
    return true;
  } catch {
    return false;
  }
};

const getUsableTimeZone = (timeZone?: string): string | undefined => {
  if (!timeZone) return undefined;
  if (!usableTimeZones.has(timeZone)) usableTimeZones.set(timeZone, isUsableTimeZone(timeZone));
  return usableTimeZones.get(timeZone) ? timeZone : undefined;
};

export default getUsableTimeZone;
