/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, react/button-has-type, jsx-a11y/control-has-associated-label */

vi.mock('./Calendar', () => ({
  Calendar: ({ onSelect, disabled, selected, today }: any) => {
    const day = new Date(2025, 2, 30);
    return (
      <div data-testid="calendar">
        <span data-testid="calendar-selected">
          {selected ? `${selected.getFullYear()}-${selected.getMonth() + 1}-${selected.getDate()}` : 'none'}
        </span>
        <span data-testid="calendar-today">
          {today ? `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}` : 'none'}
        </span>
        <button
          data-testid="calendar-day-30"
          disabled={disabled?.(day) ?? false}
          onClick={() => onSelect?.(day)}
        >
          30
        </button>
      </div>
    );
  },
}));

vi.mock('./DropdownMenu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: React.forwardRef(({ children, onClick }: any, ref: any) => (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
    >
      {children}
    </button>
  )),
}));

vi.mock('./ScrollArea', () => ({
  ScrollArea: ({ children }: any) => <div data-radix-scroll-area-viewport>{children}</div>,
}));

vi.mock('./HourButton', () => ({
  default: ({ hour, onChangeHour }: any) => (
    <button
      data-testid={`hour-${hour}`}
      onClick={() => onChangeHour(hour)}
    >
      {hour}
    </button>
  ),
}));

vi.mock('./MinuteButton', () => ({
  default: ({ minute, onChangeMinute }: any) => (
    <button
      data-testid={`minute-${minute}`}
      onClick={() => onChangeMinute(minute)}
    >
      {minute}
    </button>
  ),
}));

import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateTimePicker, { DateTimePickerProps } from './DateTimePicker';
import DATETIME_PICKER_MODES from '../constants/dateTimePickerModes';

const NEW_YORK = 'America/New_York';

type HostProps = Partial<DateTimePickerProps> & { initial: string | null };

const INVALID_VALUE_TEXT = 'invalid';

const toIsoText = (value: Date | null) => {
  if (!value) return 'null';
  return Number.isNaN(value.getTime()) ? INVALID_VALUE_TEXT : value.toISOString();
};

const Host = ({ initial, ...props }: HostProps) => {
  const [value, setValue] = useState<Date | null>(initial === null ? null : new Date(initial));
  return (
    <>
      <DateTimePicker
        value={value}
        onChange={setValue}
        timeZone={NEW_YORK}
        displayLocale="de"
        hourLabel="Hours"
        minuteLabel="Minutes"
        fromYear={2024}
        toYear={2027}
        {...props}
      />
      <span data-testid="iso">{toIsoText(value)}</span>
    </>
  );
};

const getTrigger = () => screen.getAllByRole('button')[0];

const openPicker = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(getTrigger());
  await screen.findByTestId('calendar');
};

describe('DateTimePicker with a timeZone', () => {
  it('runs under a browser zone that skips the wall clock the value has in its own zone', () => {
    expect(new Date(2025, 2, 30, 2, 30).getHours()).toBe(3);
  });

  it('shows the wall clock of the value zone, including one the browser zone skips', async () => {
    const user = userEvent.setup();
    render(<Host initial="2025-03-30T06:30:00.000Z" />);

    expect(getTrigger()).toHaveTextContent('30. März 2025 um 02:30');

    await openPicker(user);
    expect(screen.getByRole('button', { name: 'Hours' })).toHaveTextContent('02');
    expect(screen.getByRole('button', { name: 'Minutes' })).toHaveTextContent('30');
  });

  it('prefills the text draft with the wall clock of the value zone', () => {
    render(<Host initial="2025-03-30T06:30:00.000Z" />);

    fireEvent.doubleClick(getTrigger());

    expect(screen.getByDisplayValue('30.03.2025 02:30')).toBeInTheDocument();
  });

  it('resolves a typed date and time in the value zone', () => {
    render(<Host initial="2025-01-10T15:00:00.000Z" />);

    fireEvent.doubleClick(getTrigger());
    const input = screen.getByDisplayValue('10.01.2025 10:00');
    fireEvent.change(input, { target: { value: '30.03.2025 02:45' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-03-30T06:45:00.000Z');
  });

  it('resolves a time typed in time mode in the value zone', () => {
    render(
      <Host
        initial="2025-01-10T15:00:00.000Z"
        mode={DATETIME_PICKER_MODES.TIME}
      />,
    );

    fireEvent.doubleClick(getTrigger());
    const input = screen.getByDisplayValue('10:00');
    fireEvent.change(input, { target: { value: '14:30' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-01-10T19:30:00.000Z');
  });

  it('drops the seconds and milliseconds of the value when a date and time are typed', () => {
    render(<Host initial="2025-01-10T15:00:45.123Z" />);

    fireEvent.doubleClick(getTrigger());
    const input = screen.getByDisplayValue('10.01.2025 10:00');
    fireEvent.change(input, { target: { value: '10.01.2025 10:30' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-01-10T15:30:00.000Z');
  });

  it('drops the seconds and milliseconds of the value when a time is typed in time mode', () => {
    render(
      <Host
        initial="2025-01-10T15:00:45.123Z"
        mode={DATETIME_PICKER_MODES.TIME}
      />,
    );

    fireEvent.doubleClick(getTrigger());
    const input = screen.getByDisplayValue('10:00');
    fireEvent.change(input, { target: { value: '10:30' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-01-10T15:30:00.000Z');
  });

  it('moves a typed time the value zone skips past a jump that ends at midnight onto the next day', () => {
    render(
      <Host
        initial="2024-03-29T14:00:00.000Z"
        timeZone="America/Nuuk"
      />,
    );

    fireEvent.doubleClick(getTrigger());
    const input = screen.getByDisplayValue('29.03.2024 12:00');
    fireEvent.change(input, { target: { value: '30.03.2024 23:30' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent('2024-03-31T01:30:00.000Z');
  });

  it('rejects a typed date that does not exist', () => {
    render(<Host initial="2025-01-10T15:00:00.000Z" />);

    fireEvent.doubleClick(getTrigger());
    const input = screen.getByDisplayValue('10.01.2025 10:00');
    fireEvent.change(input, { target: { value: '31.02.2025 10:00' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-01-10T15:00:00.000Z');
  });

  it('keeps the wall-clock time of the value zone when a date is typed in date mode', () => {
    render(
      <Host
        initial="2025-01-10T15:00:00.000Z"
        mode={DATETIME_PICKER_MODES.DATE}
      />,
    );

    fireEvent.doubleClick(getTrigger());
    const input = screen.getByDisplayValue('10.01.2025');
    fireEvent.change(input, { target: { value: '30.03.2025' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-03-30T14:00:00.000Z');
  });

  it('rejects a date that does not exist typed in date mode', () => {
    render(
      <Host
        initial="2025-01-10T15:00:00.000Z"
        mode={DATETIME_PICKER_MODES.DATE}
      />,
    );

    fireEvent.doubleClick(getTrigger());
    const input = screen.getByDisplayValue('10.01.2025');
    fireEvent.change(input, { target: { value: '31.02.2025' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-01-10T15:00:00.000Z');
  });

  it('keeps an unedited value in the earlier instant of a repeated hour when the draft is committed', () => {
    render(<Host initial="2025-11-02T05:10:00.000Z" />);

    fireEvent.doubleClick(getTrigger());
    fireEvent.keyDown(screen.getByDisplayValue('02.11.2025 01:10'), { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-11-02T05:10:00.000Z');
  });

  it('keeps an unedited value in the earlier instant of a repeated hour when a time-mode draft is committed', () => {
    render(
      <Host
        initial="2025-11-02T05:10:00.000Z"
        mode={DATETIME_PICKER_MODES.TIME}
      />,
    );

    fireEvent.doubleClick(getTrigger());
    fireEvent.keyDown(screen.getByDisplayValue('01:10'), { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-11-02T05:10:00.000Z');
  });

  it('rejects a typed two-digit year', () => {
    render(<Host initial="2025-01-10T15:00:00.000Z" />);

    fireEvent.doubleClick(getTrigger());
    const input = screen.getByDisplayValue('10.01.2025 10:00');
    fireEvent.change(input, { target: { value: '01.02.24 10:00' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-01-10T15:00:00.000Z');
  });

  it('hands the calendar the day of the value zone, not the browser day', async () => {
    const user = userEvent.setup();
    render(<Host initial="2025-03-30T03:30:00.000Z" />);

    await openPicker(user);

    expect(screen.getByTestId('calendar-selected')).toHaveTextContent('2025-3-29');
  });

  it('moves a picked day to that day in the value zone and keeps its wall-clock time there', async () => {
    const user = userEvent.setup();
    render(<Host initial="2025-03-29T06:30:00.000Z" />);

    await openPicker(user);
    await user.click(screen.getByTestId('calendar-day-30'));

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-03-30T06:30:00.000Z');
  });

  it('moves the value to the chosen year on its day in the value zone', async () => {
    const user = userEvent.setup();
    render(<Host initial="2025-03-01T03:30:00.000Z" />);

    await openPicker(user);
    await user.click(await screen.findByText('2024'));

    expect(screen.getByTestId('iso')).toHaveTextContent('2024-02-29T03:30:00.000Z');
  });

  it('resolves a picked hour in the value zone', async () => {
    const user = userEvent.setup();
    render(<Host initial="2025-03-30T06:30:00.000Z" />);

    await openPicker(user);
    await user.click(screen.getByTestId('hour-5'));

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-03-30T09:30:00.000Z');
  });

  it('moves an hour the value zone skips past the jump', async () => {
    const user = userEvent.setup();
    render(<Host initial="2025-03-09T06:30:00.000Z" />);

    await openPicker(user);
    await user.click(screen.getByTestId('hour-2'));

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-03-09T07:30:00.000Z');
    expect(screen.getByRole('button', { name: 'Hours' })).toHaveTextContent('03');
  });

  it('keeps the earlier instant of a repeated hour when a minute is picked there', async () => {
    const user = userEvent.setup();
    render(<Host initial="2025-11-02T05:10:00.000Z" />);

    await openPicker(user);
    await user.click(screen.getByTestId('minute-30'));

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-11-02T05:30:00.000Z');
  });

  it('resolves an ambiguous time typed into an empty picker to the later instant, whatever offset today has', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2025-07-15T12:00:00.000Z'));
    try {
      render(<Host initial={null} />);

      fireEvent.doubleClick(getTrigger());
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '02.11.2025 01:30' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(screen.getByTestId('iso')).toHaveTextContent('2025-11-02T06:30:00.000Z');
    } finally {
      vi.useRealTimers();
    }
  });

  it('takes the time of day of now in the value zone when a day is picked on an empty picker', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2025-01-10T15:20:00.000Z'));
    try {
      const user = userEvent.setup();
      render(<Host initial={null} />);

      await openPicker(user);
      await user.click(screen.getByTestId('calendar-day-30'));

      expect(screen.getByTestId('iso')).toHaveTextContent('2025-03-30T14:20:00.000Z');
    } finally {
      vi.useRealTimers();
    }
  });

  it('checks a month or year move against the day it lands on in the value zone', async () => {
    const user = userEvent.setup();
    const disabledDate = vi.fn(
      (date: Date) => date.getFullYear() === 2024 && date.getMonth() === 2 && date.getDate() === 29,
    );
    render(
      <Host
        initial="2025-03-30T03:30:00.000Z"
        disabledDate={disabledDate}
      />,
    );

    await openPicker(user);
    await user.click(await screen.findByText('2024'));

    expect(disabledDate).toHaveBeenCalledWith(new Date(2024, 2, 29));
    expect(screen.getByTestId('iso')).toHaveTextContent('2025-03-30T03:30:00.000Z');
  });

  it('without a time zone, resolves a typed time on the typed day instead of the day the browser skipped it', () => {
    render(
      <Host
        initial="2025-03-30T01:30:00.000Z"
        timeZone={undefined}
      />,
    );

    fireEvent.doubleClick(getTrigger());
    const input = screen.getByDisplayValue('30.03.2025 03:30');
    fireEvent.change(input, { target: { value: '29.03.2025 02:30' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent(new Date(2025, 2, 29, 2, 30).toISOString());
  });

  it('marks today as the current day in the value zone, not the browser day', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2025-11-10T23:30:00.000Z'));
    try {
      const user = userEvent.setup();
      render(<Host initial="2025-11-05T15:00:00.000Z" />);

      await openPicker(user);

      expect(screen.getByTestId('calendar-today')).toHaveTextContent('2025-11-10');
    } finally {
      vi.useRealTimers();
    }
  });

  it('leaves today to the calendar without a time zone', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial="2025-11-05T15:00:00.000Z"
        timeZone={undefined}
      />,
    );

    await openPicker(user);

    expect(screen.getByTestId('calendar-today')).toHaveTextContent('none');
  });

  it('falls back to the browser zone for an id Intl rejects', () => {
    render(
      <Host
        initial="2025-03-30T06:30:00.000Z"
        timeZone="Mars/Olympus_Mons"
      />,
    );

    expect(getTrigger()).toHaveTextContent('30. März 2025 um 08:30');
  });

  it('resolves a date and time typed over an invalid value in the value zone', () => {
    render(<Host initial={INVALID_VALUE_TEXT} />);

    fireEvent.doubleClick(getTrigger());
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '30.03.2025 10:00' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-03-30T14:00:00.000Z');
  });

  it('keeps an invalid value as it is when a month is chosen in the value zone', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateTimePicker
        value={new Date(Number.NaN)}
        onChange={onChange}
        timeZone={NEW_YORK}
        displayLocale="en"
        monthLabel="Month"
      />,
    );

    await openPicker(user);
    await user.click(screen.getByRole('button', { name: 'February' }));

    expect(screen.getByRole('button', { name: 'Month' })).toHaveTextContent('February');
    expect(onChange).not.toHaveBeenCalled();
  });

  describe('on an invalid value at a fixed now', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date('2025-07-01T02:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('opens the calendar on the month of today in the value zone', async () => {
      const user = userEvent.setup();
      render(
        <Host
          initial={INVALID_VALUE_TEXT}
          monthLabel="Month"
        />,
      );

      await openPicker(user);

      expect(screen.getByRole('button', { name: 'Month' })).toHaveTextContent('Juni');
    });

    it('replaces it with a picked hour on today in the value zone', async () => {
      const user = userEvent.setup();
      render(<Host initial={INVALID_VALUE_TEXT} />);

      await openPicker(user);
      await user.click(screen.getByTestId('hour-10'));

      expect(screen.getByTestId('iso')).toHaveTextContent('2025-06-30T14:00:00.000Z');
    });

    it('replaces it with a time typed in time mode on today in the value zone', () => {
      render(
        <Host
          initial={INVALID_VALUE_TEXT}
          mode={DATETIME_PICKER_MODES.TIME}
        />,
      );

      fireEvent.doubleClick(getTrigger());
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '10:30' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(screen.getByTestId('iso')).toHaveTextContent('2025-06-30T14:30:00.000Z');
    });
  });

  it('replaces an invalid value with midnight of the picked day in the value zone', async () => {
    const user = userEvent.setup();
    render(<Host initial={INVALID_VALUE_TEXT} />);

    await openPicker(user);
    expect(screen.getByTestId('calendar-selected')).toHaveTextContent('none');
    await user.click(screen.getByTestId('calendar-day-30'));

    expect(screen.getByTestId('iso')).toHaveTextContent('2025-03-30T04:00:00.000Z');
  });
});
