/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { describe, expect, it } from 'vitest';
import buildMonthOptions from './buildMonthOptions';

describe('buildMonthOptions', () => {
  it('builds twelve zero-based month options', () => {
    const options = buildMonthOptions(new Intl.DateTimeFormat('en', { month: 'long' }));

    expect(options).toHaveLength(12);
    expect(options[0]).toEqual({ value: 0, label: 'January' });
    expect(options[11]).toEqual({ value: 11, label: 'December' });
  });

  it('labels the months with the supplied formatter locale', () => {
    const options = buildMonthOptions(new Intl.DateTimeFormat('de', { month: 'long' }));

    expect(options[0].label).toBe('Januar');
    expect(options[2].label).toBe('März');
  });

  it('is unaffected by the current date', () => {
    const formatter = new Intl.DateTimeFormat('en', { month: 'long' });

    expect(buildMonthOptions(formatter)).toEqual(buildMonthOptions(formatter));
  });
});
