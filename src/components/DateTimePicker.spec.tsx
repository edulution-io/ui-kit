/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, react/button-has-type, jsx-a11y/control-has-associated-label, react/display-name, @typescript-eslint/no-use-before-define */

vi.mock('./Calendar', () => ({
  Calendar: ({ onSelect, disabled, hideNavigation }: any) => {
    const day = new Date(2026, 2, 15);
    return (
      <div
        data-testid="calendar"
        data-hide-navigation={String(!!hideNavigation)}
      >
        <button
          data-testid="calendar-day-15"
          disabled={disabled?.(day) ?? false}
          onClick={() => onSelect?.(day)}
        >
          15
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

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ className, onClick, visibility, 'aria-label': ariaLabel }: any) => (
    <span
      data-testid="fa-icon"
      aria-label={ariaLabel}
      className={className}
      role="button"
      tabIndex={0}
      style={{ visibility }}
      onClick={onClick}
      onKeyDown={() => undefined}
    />
  ),
}));

import React, { useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateTimePicker, { DateTimePickerProps } from './DateTimePicker';
import DATETIME_PICKER_MODES from '../constants/dateTimePickerModes';
import { Dialog, DialogContent, DialogTitle } from './Dialog';

const runOpenDelay = () =>
  act(() => {
    vi.runAllTimers();
  });

const clickWithPointer = (element: HTMLElement) => {
  fireEvent.pointerDown(element);
  fireEvent.click(element);
};

type HostProps = Partial<DateTimePickerProps> & { initial?: Date | null };

const Host = ({ initial = null, ...props }: HostProps) => {
  const [value, setValue] = useState<Date | null>(initial);
  return (
    <>
      <DateTimePicker
        value={value}
        onChange={setValue}
        {...props}
      />
      <span data-testid="value">{value ? `${value.getHours()}:${value.getMinutes()}` : 'null'}</span>
      <span data-testid="iso">{value ? value.toISOString() : 'null'}</span>
    </>
  );
};

describe('DateTimePicker', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.useRealTimers());

  it('shows the placeholder when no value is set', () => {
    render(
      <Host
        placeholder="Pick a date"
        mode={DATETIME_PICKER_MODES.DATE}
      />,
    );
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('date mode renders the calendar but no time list', async () => {
    const user = userEvent.setup();
    render(
      <Host
        placeholder="Pick"
        mode={DATETIME_PICKER_MODES.DATE}
      />,
    );
    await user.click(screen.getByText('Pick'));

    expect(await screen.findByTestId('calendar')).toBeInTheDocument();
    expect(screen.queryByTestId('hour-0')).not.toBeInTheDocument();
  });

  it('time mode renders the time list but no calendar', async () => {
    const user = userEvent.setup();
    render(
      <Host
        placeholder="Pick"
        mode={DATETIME_PICKER_MODES.TIME}
      />,
    );
    await user.click(screen.getByText('Pick'));

    expect(await screen.findByTestId('hour-0')).toBeInTheDocument();
    expect(screen.queryByTestId('calendar')).not.toBeInTheDocument();
  });

  it('datetime mode renders both calendar and time list', async () => {
    const user = userEvent.setup();
    render(<Host placeholder="Pick" />);
    await user.click(screen.getByText('Pick'));

    expect(await screen.findByTestId('calendar')).toBeInTheDocument();
    expect(screen.getByTestId('hour-0')).toBeInTheDocument();
    expect(screen.getByTestId('minute-0')).toBeInTheDocument();
  });

  it('selecting a day emits the picked calendar date and preserves the existing time of day', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 0, 5, 9, 45)}
        mode={DATETIME_PICKER_MODES.DATE}
      />,
    );
    await user.click(screen.getAllByRole('button')[0]);
    await user.click(await screen.findByTestId('calendar-day-15'));

    expect(screen.getByTestId('iso').textContent).toBe(new Date(2026, 2, 15, 9, 45).toISOString());
  });

  it('changing the year without a picked date only updates the displayed year', async () => {
    const user = userEvent.setup();
    render(
      <Host
        placeholder="Pick"
        yearLabel="Year"
      />,
    );
    await user.click(screen.getByText('Pick'));

    await user.click(await screen.findByText('1990'));

    expect(screen.getByRole('button', { name: 'Year' })).toHaveTextContent('1990');
    expect(screen.getByTestId('iso').textContent).toBe('null');
  });

  it('changing the month without a picked date only updates the displayed month', async () => {
    const user = userEvent.setup();
    render(
      <Host
        placeholder="Pick"
        monthLabel="Month"
      />,
    );
    await user.click(screen.getByText('Pick'));

    await user.click(await screen.findByRole('button', { name: 'February' }));

    expect(screen.getByRole('button', { name: 'Month' })).toHaveTextContent('February');
    expect(screen.getByTestId('iso').textContent).toBe('null');
  });

  it('moves a picked date to the chosen year, keeping its day and time', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 9, 20, 14, 30)}
        yearLabel="Year"
      />,
    );
    await user.click(screen.getAllByRole('button')[0]);

    await user.click(await screen.findByText('2027'));

    expect(screen.getByTestId('iso').textContent).toBe(new Date(2027, 9, 20, 14, 30).toISOString());
    expect(screen.getByRole('button', { name: 'Year' })).toHaveTextContent('2027');
  });

  it('moves a picked date to the chosen month, keeping its day and time', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 9, 20, 14, 30)}
        monthLabel="Month"
      />,
    );
    await user.click(screen.getAllByRole('button')[0]);

    await user.click(await screen.findByText('December'));

    expect(screen.getByTestId('iso').textContent).toBe(new Date(2026, 11, 20, 14, 30).toISOString());
    expect(screen.getByRole('button', { name: 'Month' })).toHaveTextContent('December');
  });

  it('moves a picked day that the chosen month lacks to that month’s last day', async () => {
    const user = userEvent.setup();
    render(<Host initial={new Date(2026, 0, 31, 8, 0)} />);
    await user.click(screen.getAllByRole('button')[0]);

    await user.click(await screen.findByText('February'));

    expect(screen.getByTestId('iso').textContent).toBe(new Date(2026, 1, 28, 8, 0).toISOString());
  });

  it('moves a picked date to the month and year the header shows after browsing with the chevrons', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 9, 20, 14, 30)}
        monthLabel="Month"
        nextMonthLabel="Next month"
      />,
    );
    await user.click(screen.getAllByRole('button')[0]);
    await user.click(await screen.findByRole('button', { name: 'Next month' }));

    await user.click(await screen.findByText('2027'));

    expect(screen.getByTestId('iso').textContent).toBe(new Date(2027, 10, 20, 14, 30).toISOString());
    expect(screen.getByRole('button', { name: 'Month' })).toHaveTextContent('November');
  });

  it('only navigates when the chosen month would move a picked date onto a disabled day', async () => {
    const user = userEvent.setup();
    const picked = new Date(2026, 10, 20, 14, 30);
    render(
      <Host
        initial={picked}
        monthLabel="Month"
        disabledDate={(date) => date < new Date(2026, 9, 1)}
      />,
    );
    await user.click(screen.getAllByRole('button')[0]);

    await user.click(await screen.findByText('January'));

    expect(screen.getByTestId('iso').textContent).toBe(picked.toISOString());
    expect(screen.getByRole('button', { name: 'Month' })).toHaveTextContent('January');
  });

  it('clicking an hour updates the value', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 2, 15, 8, 30)}
        mode={DATETIME_PICKER_MODES.TIME}
      />,
    );
    await user.click(screen.getAllByRole('button')[0]);

    await user.click(await screen.findByTestId('hour-5'));

    expect(screen.getByTestId('value').textContent).toBe('5:30');
  });

  it('double-click time editing commits a typed value', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 2, 15, 8, 30)}
        mode={DATETIME_PICKER_MODES.TIME}
        hourLabel="Hours"
      />,
    );
    await user.click(screen.getAllByRole('button')[0]);

    fireEvent.doubleClick(await screen.findByRole('button', { name: 'Hours' }));
    const input = screen.getByRole('textbox', { name: 'Hours' });
    fireEvent.change(input, { target: { value: '21' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('value').textContent).toBe('21:30');
  });

  it('commits a two-digit hour typed character by character', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 2, 15, 8, 30)}
        mode={DATETIME_PICKER_MODES.TIME}
        hourLabel="Hours"
      />,
    );
    await user.click(screen.getAllByRole('button')[0]);

    fireEvent.doubleClick(await screen.findByRole('button', { name: 'Hours' }));
    const input = screen.getByRole('textbox', { name: 'Hours' });
    await user.keyboard('15');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('value').textContent).toBe('15:30');
  });

  it('clamps an out-of-range typed hour to the maximum', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 2, 15, 8, 30)}
        mode={DATETIME_PICKER_MODES.TIME}
        hourLabel="Hours"
      />,
    );
    await user.click(screen.getAllByRole('button')[0]);

    fireEvent.doubleClick(await screen.findByRole('button', { name: 'Hours' }));
    const input = screen.getByRole('textbox', { name: 'Hours' });
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('value').textContent).toBe('23:30');
  });

  it('clear button resets the value to null', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 2, 15, 8, 30)}
        clearAriaLabel="Clear date"
        mode={DATETIME_PICKER_MODES.DATE}
      />,
    );

    await user.click(screen.getByLabelText('Clear date'));

    expect(screen.getByTestId('iso').textContent).toBe('null');
  });

  it('forwards the disabledDate matcher to the calendar', async () => {
    const user = userEvent.setup();
    render(
      <Host
        placeholder="Pick"
        mode={DATETIME_PICKER_MODES.DATE}
        disabledDate={() => true}
      />,
    );
    await user.click(screen.getByText('Pick'));

    expect(await screen.findByTestId('calendar-day-15')).toBeDisabled();
  });

  it('does not submit a surrounding form when the field is clicked or double-clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Host
          initial={new Date(2026, 5, 30, 14, 5)}
          mode={DATETIME_PICKER_MODES.DATE}
          displayLocale="de"
        />
      </form>,
    );

    await user.click(screen.getAllByRole('button')[0]);
    fireEvent.doubleClick(screen.getAllByRole('button')[0]);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('opens the calendar popover on a single click', async () => {
    const user = userEvent.setup();
    render(
      <Host
        placeholder="Pick"
        mode={DATETIME_PICKER_MODES.DATE}
      />,
    );

    await user.click(screen.getByText('Pick'));

    expect(await screen.findByTestId('calendar')).toBeInTheDocument();
  });

  it('closes the popover when the outside click never reaches the document', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Host
          placeholder="Pick"
          mode={DATETIME_PICKER_MODES.DATE}
        />
        <button
          data-testid="outside-submit"
          onClick={(event) => event.stopPropagation()}
        >
          Save
        </button>
      </>,
    );

    await user.click(screen.getByText('Pick'));
    expect(await screen.findByTestId('calendar')).toBeInTheDocument();

    await user.click(screen.getByTestId('outside-submit'));

    expect(screen.queryByTestId('calendar')).not.toBeInTheDocument();
  });

  it('closes the popover when a button outside of it is clicked', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Host
          placeholder="Pick"
          mode={DATETIME_PICKER_MODES.DATE}
        />
        <button data-testid="outside-submit">Save</button>
      </>,
    );

    await user.click(screen.getByText('Pick'));
    expect(await screen.findByTestId('calendar')).toBeInTheDocument();

    await user.click(screen.getByTestId('outside-submit'));

    expect(screen.queryByTestId('calendar')).not.toBeInTheDocument();
  });

  it('commits an in-progress time edit when a pointer goes down outside', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Host
          initial={new Date(2026, 5, 30, 14, 5)}
          mode={DATETIME_PICKER_MODES.TIME}
          hourLabel="Hours"
        />
        <button data-testid="outside-submit">Save</button>
      </>,
    );

    await user.click(screen.getAllByRole('button')[0]);
    fireEvent.doubleClick(await screen.findByRole('button', { name: 'Hours' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Hours' }), { target: { value: '07' } });

    await user.click(screen.getByTestId('outside-submit'));

    expect(screen.getByTestId('value').textContent).toBe('7:5');
  });

  it('cancels a pending single-click open when a pointer goes down outside', () => {
    vi.useFakeTimers();
    render(
      <>
        <Host
          placeholder="Pick"
          mode={DATETIME_PICKER_MODES.DATE}
        />
        <button data-testid="outside-submit">Save</button>
      </>,
    );

    fireEvent.click(screen.getByText('Pick'));
    fireEvent.pointerDown(screen.getByTestId('outside-submit'));
    runOpenDelay();

    expect(screen.queryByTestId('calendar')).not.toBeInTheDocument();
  });

  it('closes the popover when the trigger is clicked a second time', () => {
    vi.useFakeTimers();
    render(
      <Host
        placeholder="Pick"
        mode={DATETIME_PICKER_MODES.DATE}
      />,
    );
    const trigger = screen.getAllByRole('button')[0];

    clickWithPointer(trigger);
    runOpenDelay();
    expect(screen.getByTestId('calendar')).toBeInTheDocument();

    clickWithPointer(trigger);
    runOpenDelay();

    expect(screen.queryByTestId('calendar')).not.toBeInTheDocument();
  });

  it('opens the popover on keyboard activation after a mouse open and close cycle', () => {
    vi.useFakeTimers();
    render(
      <Host
        placeholder="Pick"
        mode={DATETIME_PICKER_MODES.DATE}
      />,
    );
    const trigger = screen.getAllByRole('button')[0];

    clickWithPointer(trigger);
    runOpenDelay();
    expect(screen.getByTestId('calendar')).toBeInTheDocument();

    clickWithPointer(trigger);
    runOpenDelay();
    expect(screen.queryByTestId('calendar')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    runOpenDelay();

    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });

  it('double-clicking the field switches to text editing without opening the popover', () => {
    render(
      <Host
        initial={new Date(2026, 5, 30, 14, 5)}
        mode={DATETIME_PICKER_MODES.DATETIME}
        displayLocale="de"
      />,
    );

    fireEvent.doubleClick(screen.getAllByRole('button')[0]);

    expect(screen.getByDisplayValue('30.06.2026 14:05')).toBeInTheDocument();
    expect(screen.queryByTestId('calendar')).not.toBeInTheDocument();
  });

  it('commits a typed date and time from the field on Enter', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 5, 30, 14, 5)}
        mode={DATETIME_PICKER_MODES.DATETIME}
        displayLocale="de"
      />,
    );

    fireEvent.doubleClick(screen.getAllByRole('button')[0]);
    const input = screen.getByDisplayValue('30.06.2026 14:05');
    await user.clear(input);
    await user.type(input, '24.12.2026 09:45');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso').textContent).toBe(new Date(2026, 11, 24, 9, 45).toISOString());
  });

  it('discards an invalid typed date and keeps the previous value', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 5, 30, 14, 5)}
        mode={DATETIME_PICKER_MODES.DATE}
        displayLocale="de"
      />,
    );

    fireEvent.doubleClick(screen.getAllByRole('button')[0]);
    const input = screen.getByDisplayValue('30.06.2026');
    await user.clear(input);
    await user.type(input, '32.13.2026');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByTestId('iso').textContent).toBe(new Date(2026, 5, 30, 14, 5).toISOString());
  });

  it('scrolls the time viewport on wheel, normalizing the delta across deltaMode', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 2, 15, 8, 30)}
        mode={DATETIME_PICKER_MODES.TIME}
      />,
    );
    await user.click(screen.getAllByRole('button')[0]);

    const wheelTarget = (await screen.findByTestId('hour-0')).parentElement as HTMLElement;
    const viewport = wheelTarget.closest('[data-radix-scroll-area-viewport]') as HTMLElement;
    let scrollTop = 0;
    Object.defineProperty(viewport, 'scrollTop', {
      configurable: true,
      get: () => scrollTop,
      set: (next: number) => {
        scrollTop = next;
      },
    });

    fireEvent.wheel(wheelTarget, { deltaY: 3, deltaMode: 1 });

    expect(viewport.scrollTop).toBe(48);
  });

  it('navigates to the previous and next month via the chevron controls', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 5, 15)}
        mode={DATETIME_PICKER_MODES.DATE}
        displayLocale="en"
        monthLabel="Month"
        previousMonthLabel="Previous month"
        nextMonthLabel="Next month"
      />,
    );
    await user.click(screen.getAllByRole('button')[0]);

    expect(await screen.findByRole('button', { name: 'Month' })).toHaveTextContent('June');

    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('button', { name: 'Month' })).toHaveTextContent('July');

    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('button', { name: 'Month' })).toHaveTextContent('May');
    expect(screen.getByTestId('iso').textContent).toBe(new Date(2026, 5, 15).toISOString());
  });

  it('asks the calendar to hide the day-picker navigation because it renders its own month controls', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 5, 15)}
        mode={DATETIME_PICKER_MODES.DATE}
        displayLocale="en"
        monthLabel="Month"
        previousMonthLabel="Previous month"
        nextMonthLabel="Next month"
      />,
    );
    await user.click(screen.getAllByRole('button')[0]);

    expect(await screen.findByTestId('calendar')).toHaveAttribute('data-hide-navigation', 'true');
  });

  it('cancels field text editing on Escape', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 5, 30, 14, 5)}
        mode={DATETIME_PICKER_MODES.DATE}
        displayLocale="de"
      />,
    );

    fireEvent.doubleClick(screen.getAllByRole('button')[0]);
    const input = screen.getByDisplayValue('30.06.2026');
    await user.clear(input);
    await user.type(input, '24.12.2026');
    await user.keyboard('{Escape}');

    expect(screen.queryByDisplayValue('24.12.2026')).not.toBeInTheDocument();
    expect(screen.getByTestId('iso').textContent).toBe(new Date(2026, 5, 30, 14, 5).toISOString());
  });

  it('commits an edit made after an earlier one was cancelled with Escape', async () => {
    const user = userEvent.setup();
    render(
      <Host
        initial={new Date(2026, 5, 30, 14, 5)}
        mode={DATETIME_PICKER_MODES.DATE}
        displayLocale="de"
      />,
    );

    fireEvent.doubleClick(screen.getAllByRole('button')[0]);
    const abandoned = screen.getByDisplayValue('30.06.2026');
    await user.clear(abandoned);
    await user.type(abandoned, '24.12.2026');
    await user.keyboard('{Escape}');

    fireEvent.doubleClick(screen.getAllByRole('button')[0]);
    const retried = screen.getByDisplayValue('30.06.2026');
    await user.clear(retried);
    await user.type(retried, '25.12.2026');
    await user.keyboard('{Enter}');

    expect(screen.getByTestId('iso').textContent).toBe(new Date(2026, 11, 25, 14, 5).toISOString());
    expect(screen.queryByDisplayValue('25.12.2026')).not.toBeInTheDocument();
  });

  it('keeps a surrounding dialog open when Escape cancels field text editing, and closes it on the second Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        open
        onOpenChange={onOpenChange}
      >
        <DialogContent>
          <DialogTitle>Event</DialogTitle>
          <input
            type="text"
            aria-label="Comment"
          />
          <Host
            initial={new Date(2026, 5, 30, 14, 5)}
            mode={DATETIME_PICKER_MODES.DATE}
            displayLocale="de"
          />
        </DialogContent>
      </Dialog>,
    );

    await user.type(screen.getByLabelText('Comment'), 'do not lose me');
    const [trigger] = screen.getAllByRole('button', { expanded: false });
    fireEvent.doubleClick(trigger);
    const input = screen.getByDisplayValue('30.06.2026');
    await user.clear(input);
    await user.type(input, '24.12.2026');

    await user.keyboard('{Escape}');

    expect(screen.queryByDisplayValue('24.12.2026')).not.toBeInTheDocument();
    expect(screen.getByTestId('iso').textContent).toBe(new Date(2026, 5, 30, 14, 5).toISOString());
    expect(screen.getByLabelText('Comment')).toHaveValue('do not lose me');
    expect(onOpenChange).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('cancels a time segment edit on the first Escape, closes the popover on the second and the dialog on the third', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        open
        onOpenChange={onOpenChange}
      >
        <DialogContent>
          <DialogTitle>Event</DialogTitle>
          <Host
            initial={new Date(2026, 2, 15, 8, 30)}
            mode={DATETIME_PICKER_MODES.TIME}
            hourLabel="Hours"
          />
        </DialogContent>
      </Dialog>,
    );

    const [trigger] = screen.getAllByRole('button', { expanded: false });
    await user.click(trigger);

    fireEvent.doubleClick(await screen.findByRole('button', { name: 'Hours' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Hours' }), { target: { value: '21' } });

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('textbox', { name: 'Hours' })).not.toBeInTheDocument();
    expect(screen.getByTestId('hour-5')).toBeInTheDocument();
    expect(screen.getByTestId('value').textContent).toBe('8:30');
    expect(onOpenChange).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');

    expect(screen.queryByTestId('hour-5')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  describe('on a narrow viewport', () => {
    const VIEWPORT_RECT = { left: 0, top: 0, width: 100, height: 100 };
    const SELECTED_RECT = { left: 500, top: 300, width: 20, height: 20 };
    const scrollOffsets = new WeakMap<Element, { left: number; top: number }>();
    let selectedTestIds = ['hour-15', 'minute-45'];
    const originalScrollLeft = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollLeft');
    const originalScrollTop = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop');

    const toRect = ({ left, top, width, height }: typeof VIEWPORT_RECT) =>
      ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top }) as DOMRect;

    beforeEach(() => {
      Object.defineProperty(Element.prototype, 'scrollLeft', {
        configurable: true,
        get(this: Element) {
          return scrollOffsets.get(this)?.left ?? 0;
        },
        set(this: Element, left: number) {
          scrollOffsets.set(this, { top: scrollOffsets.get(this)?.top ?? 0, left });
        },
      });
      Object.defineProperty(Element.prototype, 'scrollTop', {
        configurable: true,
        get(this: Element) {
          return scrollOffsets.get(this)?.top ?? 0;
        },
        set(this: Element, top: number) {
          scrollOffsets.set(this, { left: scrollOffsets.get(this)?.left ?? 0, top });
        },
      });
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect(this: Element) {
        const testId = this.getAttribute('data-testid');
        if (testId && selectedTestIds.includes(testId)) return toRect(SELECTED_RECT);
        return toRect(VIEWPORT_RECT);
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
      selectedTestIds = ['hour-15', 'minute-45'];
      if (originalScrollLeft) Object.defineProperty(Element.prototype, 'scrollLeft', originalScrollLeft);
      if (originalScrollTop) Object.defineProperty(Element.prototype, 'scrollTop', originalScrollTop);
    });

    it('lists the hours from 0 to 23', async () => {
      const user = userEvent.setup();
      render(
        <Host
          initial={new Date(2026, 2, 15, 15, 45)}
          mode={DATETIME_PICKER_MODES.TIME}
        />,
      );
      await user.click(screen.getAllByRole('button')[0]);
      await screen.findByTestId('hour-0');

      const hourIds = screen.getAllByTestId(/^hour-\d+$/).map((button) => button.getAttribute('data-testid'));

      expect(hourIds).toEqual(Array.from({ length: 24 }, (_, hour) => `hour-${hour}`));
    });

    it('scrolls the selected hour and minute into the middle of their lists when it opens', async () => {
      const user = userEvent.setup();
      render(
        <Host
          initial={new Date(2026, 2, 15, 15, 45)}
          mode={DATETIME_PICKER_MODES.TIME}
        />,
      );
      await user.click(screen.getAllByRole('button')[0]);

      const hourViewport = (await screen.findByTestId('hour-15')).closest('[data-radix-scroll-area-viewport]');
      const minuteViewport = screen.getByTestId('minute-45').closest('[data-radix-scroll-area-viewport]');

      const centered = { left: 500 - (100 - 20) / 2, top: 300 - (100 - 20) / 2 };
      expect({ left: hourViewport?.scrollLeft, top: hourViewport?.scrollTop }).toEqual(centered);
      expect({ left: minuteViewport?.scrollLeft, top: minuteViewport?.scrollTop }).toEqual(centered);
    });

    it('scrolls to the time picked last when it opens again, not to the time it started with', async () => {
      const user = userEvent.setup();
      render(
        <Host
          initial={new Date(2026, 2, 15, 15, 45)}
          mode={DATETIME_PICKER_MODES.TIME}
        />,
      );
      await user.click(screen.getAllByRole('button')[0]);
      await user.click(await screen.findByTestId('hour-9'));
      await user.click(screen.getByTestId('minute-10'));
      expect(screen.getByTestId('value')).toHaveTextContent('9:10');

      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByTestId('hour-9')).toBeNull());
      selectedTestIds = ['hour-9', 'minute-10'];
      await user.click(screen.getAllByRole('button')[0]);

      const hourViewport = (await screen.findByTestId('hour-9')).closest('[data-radix-scroll-area-viewport]');
      const minuteViewport = screen.getByTestId('minute-10').closest('[data-radix-scroll-area-viewport]');

      const centered = { left: 500 - (100 - 20) / 2, top: 300 - (100 - 20) / 2 };
      expect({ left: hourViewport?.scrollLeft, top: hourViewport?.scrollTop }).toEqual(centered);
      expect({ left: minuteViewport?.scrollLeft, top: minuteViewport?.scrollTop }).toEqual(centered);
    });

    it('caps the popover to the space the viewport leaves for it', async () => {
      const user = userEvent.setup();
      render(<Host initial={new Date(2026, 2, 15, 15, 45)} />);
      await user.click(screen.getAllByRole('button')[0]);

      const popover = await screen.findByRole('dialog');

      expect(popover.className).toContain('max-h-[var(--radix-popover-content-available-height)]');
      expect(popover.className).toContain('overflow-y-auto');
    });

    describe('when the popover is capped', () => {
      const resizeCallbacks: ResizeObserverCallback[] = [];
      const CAPPED_HEIGHT = 365;

      beforeEach(() => {
        resizeCallbacks.length = 0;
        vi.stubGlobal(
          'ResizeObserver',
          class {
            private readonly callback: ResizeObserverCallback;

            constructor(callback: ResizeObserverCallback) {
              this.callback = callback;
            }

            observe = () => {
              resizeCallbacks.push(this.callback);
            };

            disconnect = () => {
              const index = resizeCallbacks.indexOf(this.callback);
              if (index >= 0) resizeCallbacks.splice(index, 1);
            };

            unobserve = vi.fn();
          },
        );
      });

      afterEach(() => {
        vi.unstubAllGlobals();
      });

      const triggerResize = () =>
        act(() => {
          [...resizeCallbacks].forEach((callback) => callback([], {} as ResizeObserver));
        });

      const openWithStripsEndingAt = async (stripsBottom: number) => {
        const user = userEvent.setup();
        render(<Host initial={new Date(2026, 2, 15, 15, 45)} />);
        await user.click(screen.getAllByRole('button')[0]);
        const popover = await screen.findByRole('dialog');
        const strips = (await screen.findByTestId('hour-15')).closest('[data-radix-scroll-area-viewport]')
          ?.parentElement as HTMLElement;
        Object.defineProperty(popover, 'clientHeight', { configurable: true, value: CAPPED_HEIGHT });
        const defaultRect = Element.prototype.getBoundingClientRect.getMockImplementation();
        vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect(this: Element) {
          if (this === strips) return toRect({ left: 0, top: stripsBottom - 100, width: 100, height: 100 });
          return defaultRect?.call(this) ?? toRect(VIEWPORT_RECT);
        });
        return popover;
      };

      it('scrolls the popover just far enough to show the hour and minute strips cut off below it', async () => {
        const popover = await openWithStripsEndingAt(444);

        triggerResize();

        expect(popover.scrollTop).toBe(444 - CAPPED_HEIGHT);
      });

      it('scrolls the popover only once, so it does not pull the user back after they scroll up', async () => {
        const popover = await openWithStripsEndingAt(444);
        triggerResize();

        popover.scrollTop = 0;
        triggerResize();

        expect(popover.scrollTop).toBe(0);
      });

      it('leaves the popover scroll alone while the strips are already in view', async () => {
        const popover = await openWithStripsEndingAt(CAPPED_HEIGHT);

        triggerResize();

        expect(popover.scrollTop).toBe(0);
      });
    });
  });
});
