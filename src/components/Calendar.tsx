/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { DateLib, DayPicker, type ChevronProps, type Labels } from 'react-day-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import cn from '../utils/cn';
import { buttonVariants } from './Button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const CHEVRON_ICON_BY_ORIENTATION = {
  left: faChevronLeft,
  right: faChevronRight,
  up: faChevronUp,
  down: faChevronDown,
};

const FULL_DATE_FORMAT = 'PPPP';

const formatFullDate: Labels['labelGridcell'] = (date, _modifiers, options, dateLib) =>
  (dateLib ?? new DateLib(options)).format(date, FULL_DATE_FORMAT);

const LOCALIZED_DATE_LABELS: Partial<Labels> = {
  labelDayButton: formatFullDate,
  labelGridcell: formatFullDate,
};

const navButtonClassName = cn(
  buttonVariants({ variant: 'btn-outline' }),
  'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
);

const Chevron = ({ orientation = 'left', className }: ChevronProps) => (
  <FontAwesomeIcon
    icon={CHEVRON_ICON_BY_ORIENTATION[orientation]}
    className={cn('h-4 w-4', className)}
  />
);

const Calendar = ({ className, classNames, components, labels, showOutsideDays = true, ...props }: CalendarProps) => (
  <DayPicker
    showOutsideDays={showOutsideDays}
    className={cn('p-3', className)}
    classNames={{
      months: 'relative flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
      month: 'space-y-4',
      month_caption: components?.MonthCaption ? '' : 'flex justify-center pt-1 relative items-center',
      caption_label: 'text-sm font-medium',
      dropdowns: 'relative inline-flex items-center gap-2',
      dropdown_root: 'relative inline-flex items-center',
      dropdown: 'absolute inset-0 z-20 w-full cursor-pointer appearance-none border-none opacity-0',
      nav: 'pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between pt-1',
      button_previous: cn(navButtonClassName, 'pointer-events-auto ml-1'),
      button_next: cn(navButtonClassName, 'pointer-events-auto mr-1'),
      month_grid: 'w-full border-collapse space-y-1',
      weekdays: 'flex',
      weekday: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
      week: 'flex w-full mt-2',
      day: 'h-9 w-9 text-center text-sm p-0 relative aria-selected:bg-accent first:aria-selected:rounded-l-md last:aria-selected:rounded-r-md focus-within:relative focus-within:z-20',
      day_button: cn(buttonVariants({ variant: 'btn-ghost' }), 'bg-unset h-9 w-9 p-0 font-normal'),
      range_start: 'day-range-start rounded-l-md',
      range_end: 'day-range-end rounded-r-md',
      selected:
        '[&>button]:rounded-lg [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground [&>button]:focus:bg-primary [&>button]:focus:text-primary-foreground',
      today: '[&>button]:rounded-lg [&>button]:bg-accent [&>button]:text-accent-foreground',
      outside:
        'day-outside text-muted-foreground opacity-50 aria-selected:opacity-30 [&[aria-selected]>button]:bg-accent/50 [&[aria-selected]>button]:text-muted-foreground',
      disabled: 'text-muted-foreground opacity-50',
      range_middle: '[&>button]:!bg-accent [&>button]:!text-accent-foreground',
      hidden: 'invisible',
      ...classNames,
    }}
    components={{
      Chevron,
      ...components,
    }}
    labels={{ ...LOCALIZED_DATE_LABELS, ...labels }}
    {...props}
  />
);

Calendar.displayName = 'Calendar';

export { Calendar };
