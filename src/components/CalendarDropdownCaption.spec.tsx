/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { de, enUS, Locale } from 'date-fns/locale';
import { Calendar } from './Calendar';
import CalendarDropdownCaption from './CalendarDropdownCaption';

const MONTH_LABEL = 'Month';
const YEAR_LABEL = 'Year';
const NEXT_LABEL = 'Next month';

const ControlledCalendar: React.FC<{ initial: Date; locale?: Locale }> = ({ initial, locale = enUS }) => {
  const [month, setMonth] = useState(initial);
  return (
    <Calendar
      mode="single"
      month={month}
      onMonthChange={setMonth}
      locale={locale}
      startMonth={new Date(initial.getFullYear() - 2, 0)}
      endMonth={new Date(initial.getFullYear() + 2, 11)}
      hideNavigation
      components={{ MonthCaption: CalendarDropdownCaption }}
      labels={{
        labelMonthDropdown: () => MONTH_LABEL,
        labelYearDropdown: () => YEAR_LABEL,
        labelNext: () => NEXT_LABEL,
      }}
    />
  );
};

const UnlocalizedCalendar: React.FC<{ initial: Date }> = ({ initial }) => (
  <Calendar
    mode="single"
    month={initial}
    startMonth={new Date(initial.getFullYear() - 2, 0)}
    endMonth={new Date(initial.getFullYear() + 2, 11)}
    hideNavigation
    components={{ MonthCaption: CalendarDropdownCaption }}
    labels={{
      labelMonthDropdown: () => MONTH_LABEL,
      labelYearDropdown: () => YEAR_LABEL,
      labelNext: () => NEXT_LABEL,
    }}
  />
);

describe('CalendarDropdownCaption', () => {
  it('keeps its own layout instead of inheriting the calendar caption base', () => {
    const { container } = render(
      <Calendar
        mode="single"
        month={new Date(2026, 5, 1)}
        hideNavigation
        components={{ MonthCaption: CalendarDropdownCaption }}
      />,
    );

    const caption = container.querySelector<HTMLDivElement>('div.justify-between');
    expect(caption).not.toBeNull();
    expect(caption?.className).not.toContain('justify-center');
  });

  it('applies the month_caption class the calendar passes down without dropping its own', () => {
    const { container } = render(
      <Calendar
        mode="single"
        month={new Date(2026, 5, 1)}
        hideNavigation
        components={{ MonthCaption: CalendarDropdownCaption }}
        classNames={{ month_caption: 'test-caption' }}
      />,
    );

    const caption = container.querySelector('div.test-caption');
    expect(caption).not.toBeNull();
    expect(caption?.className).toContain('flex items-center justify-between');
  });

  it('forwards the style and animation hook the calendar puts on the caption', () => {
    const { container } = render(
      <Calendar
        mode="single"
        month={new Date(2026, 5, 1)}
        hideNavigation
        animate
        components={{ MonthCaption: CalendarDropdownCaption }}
        classNames={{ month_caption: 'test-caption' }}
        styles={{ month_caption: { outlineWidth: '3px' } }}
      />,
    );

    const caption = container.querySelector<HTMLDivElement>('div.test-caption');
    expect(caption).toHaveAttribute('data-animated-caption', 'true');
    expect(caption?.style.outlineWidth).toBe('3px');
  });

  it('keeps the react-day-picker displayIndex prop off the rendered dom node', () => {
    const { container } = render(
      <Calendar
        mode="single"
        month={new Date(2026, 5, 1)}
        hideNavigation
        components={{ MonthCaption: CalendarDropdownCaption }}
        classNames={{ month_caption: 'test-caption' }}
      />,
    );

    expect(container.querySelector('div.test-caption')).not.toHaveAttribute('displayIndex');
  });

  it('formats month names with the locale passed to the calendar', () => {
    render(
      <ControlledCalendar
        initial={new Date(2026, 5, 1)}
        locale={de}
      />,
    );

    expect(screen.getByRole('button', { name: MONTH_LABEL })).toHaveTextContent('Juni');
  });

  it('falls back to English month names when the calendar is given no locale', () => {
    render(<UnlocalizedCalendar initial={new Date(2026, 5, 1)} />);

    expect(screen.getByRole('button', { name: MONTH_LABEL })).toHaveTextContent('June');
  });

  it('renders month and year dropdown triggers for the displayed month', () => {
    render(<ControlledCalendar initial={new Date(2026, 5, 1)} />);

    expect(screen.getByRole('button', { name: MONTH_LABEL })).toHaveTextContent('June');
    expect(screen.getByRole('button', { name: YEAR_LABEL })).toHaveTextContent('2026');
  });

  it('offers a year range bounded by startMonth/endMonth', async () => {
    render(<ControlledCalendar initial={new Date(2026, 5, 1)} />);

    await userEvent.click(screen.getByRole('button', { name: YEAR_LABEL }));

    expect(screen.getByRole('menuitem', { name: '2024' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '2028' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: '2029' })).not.toBeInTheDocument();
  });

  it('offers a year range bounded by the deprecated fromYear/toYear', async () => {
    render(
      <Calendar
        mode="single"
        month={new Date(2026, 5, 1)}
        fromYear={2020}
        toYear={2030}
        hideNavigation
        components={{ MonthCaption: CalendarDropdownCaption }}
        labels={{ labelMonthDropdown: () => MONTH_LABEL, labelYearDropdown: () => YEAR_LABEL }}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: YEAR_LABEL }));

    expect(screen.getAllByRole('menuitem')).toHaveLength(11);
    expect(screen.getByRole('menuitem', { name: '2020' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '2030' })).toBeInTheDocument();
  });

  it('offers a year range bounded by the deprecated fromMonth/toMonth', async () => {
    render(
      <Calendar
        mode="single"
        month={new Date(2026, 5, 1)}
        fromMonth={new Date(2024, 0, 1)}
        toMonth={new Date(2028, 11, 31)}
        hideNavigation
        components={{ MonthCaption: CalendarDropdownCaption }}
        labels={{ labelMonthDropdown: () => MONTH_LABEL, labelYearDropdown: () => YEAR_LABEL }}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: YEAR_LABEL }));

    expect(screen.getAllByRole('menuitem')).toHaveLength(5);
  });

  it('prefers startMonth/endMonth over the deprecated props when both are given', async () => {
    render(
      <Calendar
        mode="single"
        month={new Date(2026, 5, 1)}
        startMonth={new Date(2025, 0, 1)}
        endMonth={new Date(2027, 11, 31)}
        fromYear={2000}
        toYear={2050}
        hideNavigation
        components={{ MonthCaption: CalendarDropdownCaption }}
        labels={{ labelMonthDropdown: () => MONTH_LABEL, labelYearDropdown: () => YEAR_LABEL }}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: YEAR_LABEL }));

    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('navigates the calendar when a year is selected', async () => {
    render(<ControlledCalendar initial={new Date(2026, 5, 1)} />);

    await userEvent.click(screen.getByRole('button', { name: YEAR_LABEL }));
    await userEvent.click(screen.getByRole('menuitem', { name: '2028' }));

    expect(screen.getByRole('button', { name: YEAR_LABEL })).toHaveTextContent('2028');
    expect(screen.getByRole('button', { name: MONTH_LABEL })).toHaveTextContent('June');
  });

  it('navigates the calendar when a month is selected, preserving the year', async () => {
    render(<ControlledCalendar initial={new Date(2026, 5, 1)} />);

    await userEvent.click(screen.getByRole('button', { name: MONTH_LABEL }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'September' }));

    expect(screen.getByRole('button', { name: MONTH_LABEL })).toHaveTextContent('September');
    expect(screen.getByRole('button', { name: YEAR_LABEL })).toHaveTextContent('2026');
  });

  it('navigates to the next month via the chevron button', async () => {
    render(<ControlledCalendar initial={new Date(2026, 5, 1)} />);

    await userEvent.click(screen.getByRole('button', { name: NEXT_LABEL }));

    expect(screen.getByRole('button', { name: MONTH_LABEL })).toHaveTextContent('July');
  });
});
