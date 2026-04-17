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

/* eslint-disable @typescript-eslint/no-explicit-any, react/button-has-type, react/display-name */

vi.mock('./Button', () => ({
  Button: ({ children, variant, className, onClick, ...props }: any) => (
    <button
      data-testid="minute-button"
      data-variant={variant}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MinuteButton from './MinuteButton';

describe('MinuteButton', () => {
  it('renders the minute zero-padded', () => {
    render(
      <MinuteButton
        minute={5}
        currentMinute={0}
        onChangeMinute={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('uses btn-outline variant when minute matches currentMinute', () => {
    render(
      <MinuteButton
        minute={30}
        currentMinute={30}
        onChangeMinute={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('minute-button')).toHaveAttribute('data-variant', 'btn-outline');
  });

  it('uses btn-small variant when minute does not match currentMinute', () => {
    render(
      <MinuteButton
        minute={15}
        currentMinute={30}
        onChangeMinute={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('minute-button')).toHaveAttribute('data-variant', 'btn-small');
  });

  it('calls onChangeMinute with the minute when clicked', async () => {
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
    await user.click(screen.getByTestId('minute-button'));
    expect(handleChange).toHaveBeenCalledWith(45);
  });

  it('applies default variant classes when variant is default', () => {
    render(
      <MinuteButton
        minute={10}
        currentMinute={0}
        onChangeMinute={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('minute-button').className).toContain('bg-foreground');
  });

  it('applies dialog variant classes when variant is dialog', () => {
    render(
      <MinuteButton
        minute={10}
        currentMinute={0}
        onChangeMinute={vi.fn()}
        variant="dialog"
      />,
    );
    const { className } = screen.getByTestId('minute-button');
    expect(className).not.toContain('bg-foreground');
    expect(className).toContain('text-foreground');
  });

  it('renders minute 0 as 00', () => {
    render(
      <MinuteButton
        minute={0}
        currentMinute={5}
        onChangeMinute={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByText('00')).toBeInTheDocument();
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
    expect(screen.getByText('30')).toBeInTheDocument();
  });
});
