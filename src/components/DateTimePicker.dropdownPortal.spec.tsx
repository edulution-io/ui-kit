/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, react/display-name */

vi.mock('./Calendar', () => ({
  Calendar: () => <div data-testid="calendar" />,
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ onClick, 'aria-label': ariaLabel }: any) => (
    <span
      role="presentation"
      aria-label={ariaLabel}
      onClick={onClick}
    />
  ),
}));

import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateTimePicker from './DateTimePicker';
import DATETIME_PICKER_MODES from '../constants/dateTimePickerModes';

const POPPER_CONTENT_SELECTOR = '[data-radix-popper-content-wrapper]';

const Host = () => {
  const [value, setValue] = useState<Date | null>(new Date(2026, 6, 16, 13, 45));
  return (
    <DateTimePicker
      value={value}
      onChange={setValue}
      mode={DATETIME_PICKER_MODES.DATE}
      displayLocale="de"
      placeholder="Pick"
      monthLabel="Month"
    />
  );
};

describe('DateTimePicker with the real, portaling month dropdown', () => {
  it('renders the month options outside of the popover, in their own popper', async () => {
    const user = userEvent.setup();
    render(<Host />);

    await user.click(screen.getByText('16. Juli 2026'));
    await user.click(await screen.findByRole('button', { name: 'Month' }));

    const option = await screen.findByRole('menuitem', { name: 'März' });
    const popoverContent = document.querySelector('[role="dialog"]');

    expect(document.querySelectorAll(POPPER_CONTENT_SELECTOR).length).toBe(2);
    expect(popoverContent?.contains(option)).toBe(false);
    expect(option.closest(POPPER_CONTENT_SELECTOR)).not.toBeNull();
  });

  it('keeps the popover open when a month option in its own portal is picked', async () => {
    const user = userEvent.setup();
    render(<Host />);

    await user.click(screen.getByText('16. Juli 2026'));
    expect(await screen.findByTestId('calendar')).toBeInTheDocument();

    await user.click(await screen.findByRole('button', { name: 'Month' }));
    await user.click(await screen.findByRole('menuitem', { name: 'März' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Month' })).toHaveTextContent('März'));
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });
});
