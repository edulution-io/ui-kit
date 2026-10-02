/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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
