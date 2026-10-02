/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { useMemo } from 'react';
import { type MonthCaptionProps, useDayPicker } from 'react-day-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from './Button';
import MonthYearSelect, { MonthYearOption } from './MonthYearSelect';
import buildMonthOptions from '../utils/buildMonthOptions';
import buildYearOptions from '../utils/buildYearOptions';
import cn from '../utils/cn';

const FALLBACK_LOCALE_CODE = 'en-US';

const CalendarDropdownCaption = ({
  calendarMonth,
  displayIndex: _displayIndex,
  className,
  ...divProps
}: MonthCaptionProps): React.ReactElement => {
  const { goToMonth, previousMonth, nextMonth, labels, dayPickerProps } = useDayPicker();
  const { startMonth, endMonth, fromMonth, toMonth, fromYear, toYear, locale } = dayPickerProps;

  const displayMonth = calendarMonth.date;
  const displayYear = displayMonth.getFullYear();
  const displayMonthIndex = displayMonth.getMonth();

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale?.code ?? FALLBACK_LOCALE_CODE, { month: 'long' }),
    [locale],
  );

  const monthOptions = useMemo<MonthYearOption[]>(() => buildMonthOptions(monthFormatter), [monthFormatter]);

  const yearOptions = useMemo<MonthYearOption[]>(() => {
    const from = (startMonth ?? fromMonth)?.getFullYear() ?? fromYear ?? displayYear;
    const to = (endMonth ?? toMonth)?.getFullYear() ?? toYear ?? displayYear;
    return buildYearOptions(Math.min(from, displayYear), Math.max(to, displayYear));
  }, [startMonth, endMonth, fromMonth, toMonth, fromYear, toYear, displayYear]);

  return (
    <div
      {...divProps}
      className={cn('mb-2 flex items-center justify-between gap-1', className)}
    >
      <Button
        variant="btn-outline"
        aria-label={labels.labelPrevious(previousMonth)}
        disabled={!previousMonth}
        className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        onClick={() => previousMonth && goToMonth(previousMonth)}
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="h-4 w-4"
        />
      </Button>
      <div className="flex min-w-0 flex-1 gap-1">
        <MonthYearSelect
          label={monthFormatter.format(displayMonth)}
          ariaLabel={labels.labelMonthDropdown()}
          options={monthOptions}
          selected={displayMonthIndex}
          onSelect={(month) => goToMonth(new Date(displayYear, month, 1))}
        />
        <MonthYearSelect
          label={String(displayYear)}
          ariaLabel={labels.labelYearDropdown()}
          options={yearOptions}
          selected={displayYear}
          onSelect={(year) => goToMonth(new Date(year, displayMonthIndex, 1))}
        />
      </div>
      <Button
        variant="btn-outline"
        aria-label={labels.labelNext(nextMonth)}
        disabled={!nextMonth}
        className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        onClick={() => nextMonth && goToMonth(nextMonth)}
      >
        <FontAwesomeIcon
          icon={faChevronRight}
          className="h-4 w-4"
        />
      </Button>
    </div>
  );
};

export default CalendarDropdownCaption;
