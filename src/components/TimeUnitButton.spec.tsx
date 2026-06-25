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
      data-testid="time-unit-button"
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
import TimeUnitButton from './TimeUnitButton';

describe('TimeUnitButton', () => {
  it('renders the value as a string by default', () => {
    render(
      <TimeUnitButton
        value={14}
        currentValue={10}
        onChange={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('applies a custom format function to the label', () => {
    render(
      <TimeUnitButton
        value={5}
        currentValue={0}
        onChange={vi.fn()}
        variant="default"
        format={(v) => v.toString().padStart(2, '0')}
      />,
    );
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('uses btn-outline variant when value matches currentValue', () => {
    render(
      <TimeUnitButton
        value={5}
        currentValue={5}
        onChange={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('time-unit-button')).toHaveAttribute('data-variant', 'btn-outline');
  });

  it('uses btn-small variant when value does not match currentValue', () => {
    render(
      <TimeUnitButton
        value={5}
        currentValue={10}
        onChange={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('time-unit-button')).toHaveAttribute('data-variant', 'btn-small');
  });

  it('calls onChange with the value when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <TimeUnitButton
        value={8}
        currentValue={0}
        onChange={handleChange}
        variant="default"
      />,
    );
    await user.click(screen.getByTestId('time-unit-button'));
    expect(handleChange).toHaveBeenCalledWith(8);
  });

  it('applies default variant background class', () => {
    render(
      <TimeUnitButton
        value={3}
        currentValue={0}
        onChange={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByTestId('time-unit-button').className).toContain('bg-foreground');
  });

  it('applies dialog unselected classes', () => {
    render(
      <TimeUnitButton
        value={3}
        currentValue={0}
        onChange={vi.fn()}
        variant="dialog"
      />,
    );
    const { className } = screen.getByTestId('time-unit-button');
    expect(className).toContain('bg-background/10');
    expect(className).toContain('dark:border-foreground/15');
    expect(className).toContain('text-foreground');
    expect(className).not.toContain('text-background');
  });

  it('applies dialog selected classes', () => {
    render(
      <TimeUnitButton
        value={3}
        currentValue={3}
        onChange={vi.fn()}
        variant="dialog"
      />,
    );
    const { className } = screen.getByTestId('time-unit-button');
    expect(className).toContain('bg-primary');
    expect(className).toContain('text-primary-foreground');
  });

  it('renders value 0 correctly', () => {
    render(
      <TimeUnitButton
        value={0}
        currentValue={5}
        onChange={vi.fn()}
        variant="default"
      />,
    );
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
