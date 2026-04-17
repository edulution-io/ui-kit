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
