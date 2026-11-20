/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { describe, expect, it } from 'vitest';
import getUsableTimeZone from './getUsableTimeZone';

describe('getUsableTimeZone', () => {
  it('returns a valid IANA zone unchanged', () => {
    expect(getUsableTimeZone('America/New_York')).toBe('America/New_York');
  });

  it('returns undefined for an id Intl rejects', () => {
    expect(getUsableTimeZone('Mars/Olympus_Mons')).toBeUndefined();
  });

  it('returns undefined when no zone is given', () => {
    expect(getUsableTimeZone(undefined)).toBeUndefined();
    expect(getUsableTimeZone('')).toBeUndefined();
  });
});
