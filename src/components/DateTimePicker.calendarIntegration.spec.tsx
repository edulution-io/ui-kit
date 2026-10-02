/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { ComponentProps, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateTimePicker from './DateTimePicker';
import DATETIME_PICKER_MODES from '../constants/dateTimePickerModes';

const PREVIOUS_MONTH_LABEL = 'Previous month';
const NEXT_MONTH_LABEL = 'Next month';
const INITIAL_VALUE = new Date(2026, 5, 15);
const CUSTOM_DAY_LABEL = 'custom day';

type CalendarLabels = ComponentProps<typeof DateTimePicker>['calendarLabels'];

const Host = ({ calendarLabels }: { calendarLabels?: CalendarLabels }) => {
  const [value, setValue] = useState<Date | null>(INITIAL_VALUE);
  return (
    <DateTimePicker
      value={value}
      onChange={setValue}
      mode={DATETIME_PICKER_MODES.DATE}
      displayLocale="en"
      monthLabel="Month"
      yearLabel="Year"
      previousMonthLabel={PREVIOUS_MONTH_LABEL}
      nextMonthLabel={NEXT_MONTH_LABEL}
      calendarLabels={calendarLabels}
    />
  );
};

const openPicker = async (calendarLabels?: CalendarLabels) => {
  const user = userEvent.setup();
  render(<Host calendarLabels={calendarLabels} />);
  await user.click(screen.getAllByRole('button')[0]);
  await screen.findByRole('button', { name: 'Month' });
};

describe('DateTimePicker with the real Calendar', () => {
  it('renders exactly one set of month navigation controls', async () => {
    await openPicker();

    expect(screen.getAllByRole('button', { name: /previous month/i })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /next month/i })).toHaveLength(1);
  });

  it('suppresses the day-picker navigation so it cannot duplicate the header controls', async () => {
    await openPicker();

    expect(document.querySelector('nav')).toBeNull();
    expect(screen.queryByRole('button', { name: /go to the (previous|next) month/i })).toBeNull();
  });

  it('hides the day-picker month caption so the month is shown only by the header dropdowns', async () => {
    await openPicker();

    const captions = Array.from(document.querySelectorAll('div')).filter((el) => el.className === 'hidden');

    expect(captions).toHaveLength(1);
    expect(captions[0].textContent).toContain('June');
  });

  it('still renders the calendar grid it is hiding the caption of', async () => {
    await openPicker();

    expect(document.querySelector('table')).not.toBeNull();
    expect(document.querySelector('td[data-day="2026-06-15"]')?.className).toContain('bg-primary');
  });

  it('forwards the calendarLabels prop to the day-picker day buttons', async () => {
    await openPicker({ labelDayButton: () => CUSTOM_DAY_LABEL });

    expect(document.querySelector('td[data-day="2026-06-15"] button')).toHaveAttribute('aria-label', CUSTOM_DAY_LABEL);
  });
});
