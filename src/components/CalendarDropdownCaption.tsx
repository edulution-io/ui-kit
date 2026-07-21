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

import React, { useMemo } from 'react';
import { CaptionProps, useDayPicker, useNavigation } from 'react-day-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from './Button';
import MonthYearSelect, { MonthYearOption } from './MonthYearSelect';
import buildMonthOptions from '../utils/buildMonthOptions';
import buildYearOptions from '../utils/buildYearOptions';

const CalendarDropdownCaption = ({ displayMonth }: CaptionProps): React.ReactElement => {
  const { goToMonth, previousMonth, nextMonth } = useNavigation();
  const { fromDate, toDate, locale, labels } = useDayPicker();

  const displayYear = displayMonth.getFullYear();
  const displayMonthIndex = displayMonth.getMonth();

  const monthFormatter = useMemo(() => new Intl.DateTimeFormat(locale?.code, { month: 'long' }), [locale]);

  const monthOptions = useMemo<MonthYearOption[]>(() => buildMonthOptions(monthFormatter), [monthFormatter]);

  const yearOptions = useMemo<MonthYearOption[]>(() => {
    const fromYear = fromDate?.getFullYear() ?? displayYear;
    const toYear = toDate?.getFullYear() ?? displayYear;
    return buildYearOptions(Math.min(fromYear, displayYear), Math.max(toYear, displayYear));
  }, [fromDate, toDate, displayYear]);

  return (
    <div className="mb-2 flex items-center justify-between gap-1">
      <Button
        variant="btn-outline"
        aria-label={previousMonth ? labels.labelPrevious(previousMonth, { locale }) : undefined}
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
        aria-label={nextMonth ? labels.labelNext(nextMonth, { locale }) : undefined}
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
