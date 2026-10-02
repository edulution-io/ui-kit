/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, react/destructuring-assignment */

vi.mock('react-day-picker', () => ({
  DayPicker: (props: any) => (
    <div
      data-testid="day-picker"
      data-show-outside={props.showOutsideDays}
      className={props.className}
    />
  ),
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ className }: any) => (
    <span
      data-testid="fa-icon"
      className={className}
    />
  ),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Calendar } from './Calendar';

describe('Calendar', () => {
  it('renders the DayPicker component', () => {
    render(<Calendar />);
    expect(screen.getByTestId('day-picker')).toBeInTheDocument();
  });

  it('shows outside days by default', () => {
    render(<Calendar />);
    expect(screen.getByTestId('day-picker')).toHaveAttribute('data-show-outside', 'true');
  });

  it('applies custom className', () => {
    render(<Calendar className="custom-cal" />);
    expect(screen.getByTestId('day-picker').className).toContain('custom-cal');
  });
});
