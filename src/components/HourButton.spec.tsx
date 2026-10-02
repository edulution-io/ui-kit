/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, react/display-name */

vi.mock('./TimeUnitButton', () => ({
  default: ({ value, currentValue, onChange, variant, format }: any) => (
    <button
      type="button"
      data-testid="time-unit-button"
      data-value={value}
      data-current={currentValue}
      data-variant={variant}
      data-format={format ? 'custom' : 'default'}
      onClick={() => onChange(value)}
    />
  ),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HourButton from './HourButton';

describe('HourButton', () => {
  it('passes hour as value', () => {
    render(
      <HourButton
        hour={14}
        currentHour={10}
        onChangeHour={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('time-unit-button')).toHaveAttribute('data-value', '14');
  });

  it('passes currentHour as currentValue', () => {
    render(
      <HourButton
        hour={14}
        currentHour={10}
        onChangeHour={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('time-unit-button')).toHaveAttribute('data-current', '10');
  });

  it('calls onChangeHour when onChange fires', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <HourButton
        hour={8}
        currentHour={0}
        onChangeHour={handleChange}
        variant="default"
      />,
    );
    await user.click(screen.getByTestId('time-unit-button'));
    expect(handleChange).toHaveBeenCalledWith(8);
  });

  it('uses no custom format (hours are displayed as-is)', () => {
    render(
      <HourButton
        hour={3}
        currentHour={0}
        onChangeHour={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('time-unit-button')).toHaveAttribute('data-format', 'default');
  });

  it('passes variant through', () => {
    render(
      <HourButton
        hour={3}
        currentHour={0}
        onChangeHour={vi.fn()}
        variant="dialog"
      />,
    );
    expect(screen.getByTestId('time-unit-button')).toHaveAttribute('data-variant', 'dialog');
  });
});
