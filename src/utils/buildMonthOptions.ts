/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { MonthYearOption } from '../components/MonthYearSelect';

const MONTHS_IN_YEAR = 12;
const MONTH_SAMPLE_YEAR = 2000;

const buildMonthOptions = (monthFormatter: Intl.DateTimeFormat): MonthYearOption[] =>
  Array.from({ length: MONTHS_IN_YEAR }, (_, month) => ({
    value: month,
    label: monthFormatter.format(new Date(MONTH_SAMPLE_YEAR, month, 1)),
  }));

export default buildMonthOptions;
