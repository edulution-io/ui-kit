/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
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
import { act, fireEvent, render, screen } from '@testing-library/react';
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

  it('changing the year updates the displayed year', async () => {
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
});
