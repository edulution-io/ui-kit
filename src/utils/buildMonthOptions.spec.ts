/*
 * Copyright (C) [2025] [Netzint GmbH]
 * All rights reserved.
 *
 * This software is dual-licensed under the terms of:
 *
 * 1. The GNU Affero General Public License (AGPL-3.0-or-later), as published by the Free Software Foundation.
 *    You may use, modify and distribute this software under the terms of the AGPL, provided that you comply with its conditions.
 *
 *    A copy of the license can be found at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * OR
 *
 * 2. A commercial license agreement with Netzint GmbH. Licensees holding a valid commercial license from Netzint GmbH
 *    may use this software in accordance with the terms contained in such written agreement, without the obligations imposed by the AGPL.
 *
 * If you are uncertain which license applies to your use case, please contact us at info@netzint.de for clarification.
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
