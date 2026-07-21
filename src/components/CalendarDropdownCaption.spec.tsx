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

import React, { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from './Calendar';
import CalendarDropdownCaption from './CalendarDropdownCaption';

const MONTH_LABEL = 'Month';
const YEAR_LABEL = 'Year';
const NEXT_LABEL = 'Next month';

const ControlledCalendar: React.FC<{ initial: Date }> = ({ initial }) => {
  const [month, setMonth] = useState(initial);
  return (
    <Calendar
      mode="single"
      month={month}
      onMonthChange={setMonth}
      fromYear={initial.getFullYear() - 2}
      toYear={initial.getFullYear() + 2}
      components={{ Caption: CalendarDropdownCaption }}
      labels={{
        labelMonthDropdown: () => MONTH_LABEL,
        labelYearDropdown: () => YEAR_LABEL,
        labelNext: () => NEXT_LABEL,
      }}
    />
  );
};

describe('CalendarDropdownCaption', () => {
  it('renders month and year dropdown triggers for the displayed month', () => {
    render(<ControlledCalendar initial={new Date(2026, 5, 1)} />);

    expect(screen.getByRole('button', { name: MONTH_LABEL })).toHaveTextContent('June');
    expect(screen.getByRole('button', { name: YEAR_LABEL })).toHaveTextContent('2026');
  });

  it('offers a year range bounded by fromYear/toYear', async () => {
    render(<ControlledCalendar initial={new Date(2026, 5, 1)} />);

    await userEvent.click(screen.getByRole('button', { name: YEAR_LABEL }));

    expect(screen.getByRole('menuitem', { name: '2024' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '2028' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: '2029' })).not.toBeInTheDocument();
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
