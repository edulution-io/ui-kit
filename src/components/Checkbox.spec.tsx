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

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-use-before-define, react/display-name, react/button-has-type, jsx-a11y/role-has-required-aria-props */

vi.mock('@radix-ui/react-checkbox', () => ({
  Root: React.forwardRef(({ children, className, id, disabled, onClick, ...props }: any, ref: any) => (
    <button
      ref={ref}
      role="checkbox"
      data-testid="checkbox-root"
      className={className}
      id={id}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )),
  Indicator: ({ children, className }: any) => (
    <span
      data-testid="checkbox-indicator"
      className={className}
    >
      {children}
    </span>
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
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('renders the checkbox', () => {
    render(<Checkbox />);
    expect(screen.getByTestId('checkbox-root')).toBeInTheDocument();
  });

  it('renders with a label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('applies disabled state', () => {
    render(<Checkbox disabled />);
    expect(screen.getByTestId('checkbox-root')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Checkbox className="custom-check" />);
    expect(screen.getByTestId('checkbox-root').className).toContain('custom-check');
  });
});
