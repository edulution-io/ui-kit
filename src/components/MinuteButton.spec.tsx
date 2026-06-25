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
