/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { MonthYearOption } from '../components/MonthYearSelect';

const buildYearOptions = (fromYear: number, toYear: number): MonthYearOption[] => {
  const options: MonthYearOption[] = [];
  for (let year = fromYear; year <= toYear; year += 1) {
    options.push({ value: year, label: String(year) });
  }
  return options;
};

export default buildYearOptions;
