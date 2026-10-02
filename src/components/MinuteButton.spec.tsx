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
      data-label={format ? format(value) : String(value)}
      onClick={() => onChange(value)}
    />
  ),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MinuteButton from './MinuteButton';

describe('MinuteButton', () => {
  it('passes minute as value', () => {
    render(
      <MinuteButton
        minute={15}
        currentMinute={0}
        onChangeMinute={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('time-unit-button')).toHaveAttribute('data-value', '15');
  });

  it('passes currentMinute as currentValue', () => {
    render(
      <MinuteButton
        minute={15}
        currentMinute={30}
        onChangeMinute={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('time-unit-button')).toHaveAttribute('data-current', '30');
  });

  it('calls onChangeMinute when onChange fires', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MinuteButton
        minute={45}
        currentMinute={0}
        onChangeMinute={handleChange}
        variant="default"
      />,
    );
    await user.click(screen.getByTestId('time-unit-button'));
    expect(handleChange).toHaveBeenCalledWith(45);
  });

  it('zero-pads single-digit minutes via format', () => {
    render(
      <MinuteButton
        minute={5}
        currentMinute={0}
        onChangeMinute={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('time-unit-button')).toHaveAttribute('data-label', '05');
  });

  it('does not pad two-digit minutes', () => {
    render(
      <MinuteButton
        minute={30}
        currentMinute={0}
        onChangeMinute={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('time-unit-button')).toHaveAttribute('data-label', '30');
  });

  it('formats 0 as 00', () => {
    render(
      <MinuteButton
        minute={0}
        currentMinute={5}
        onChangeMinute={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('time-unit-button')).toHaveAttribute('data-label', '00');
  });

  it('passes variant through', () => {
    render(
      <MinuteButton
        minute={10}
        currentMinute={0}
        onChangeMinute={vi.fn()}
        variant="dialog"
      />,
    );
    expect(screen.getByTestId('time-unit-button')).toHaveAttribute('data-variant', 'dialog');
  });
});
