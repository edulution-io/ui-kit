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
import buildYearOptions from './buildYearOptions';

describe('buildYearOptions', () => {
  it('builds an inclusive ascending range', () => {
    const options = buildYearOptions(2024, 2027);

    expect(options).toEqual([
      { value: 2024, label: '2024' },
      { value: 2025, label: '2025' },
      { value: 2026, label: '2026' },
      { value: 2027, label: '2027' },
    ]);
  });

  it('yields a single option when both bounds are the same year', () => {
    expect(buildYearOptions(2026, 2026)).toEqual([{ value: 2026, label: '2026' }]);
  });

  it('yields no options when the range is inverted', () => {
    expect(buildYearOptions(2027, 2024)).toEqual([]);
  });
});
