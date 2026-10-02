/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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
  FontAwesomeIcon: ({ className, icon }: any) => (
    <span
      data-testid="fa-icon"
      data-icon={icon.iconName}
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

  it('gives two checkboxes sharing a label distinct ids, so a label click cannot toggle the other one', () => {
    render(
      <>
        <Checkbox label="Subscribe" />
        <Checkbox label="Subscribe" />
      </>,
    );

    const [first, second] = screen.getAllByTestId('checkbox-root');
    expect(first.id).not.toBe(second.id);
    expect(first.id).toBeTruthy();
  });

  it('points each label at its own checkbox', () => {
    render(<Checkbox label="Subscribe" />);

    expect(screen.getByText('Subscribe').closest('label')).toHaveAttribute(
      'for',
      screen.getByTestId('checkbox-root').id,
    );
  });

  it('lets a caller pin the id explicitly', () => {
    render(
      <Checkbox
        label="Subscribe"
        id="subscribe-jane"
      />,
    );

    expect(screen.getByTestId('checkbox-root')).toHaveAttribute('id', 'subscribe-jane');
    expect(screen.getByText('Subscribe').closest('label')).toHaveAttribute('for', 'subscribe-jane');
  });

  it('draws a check mark when checked', () => {
    render(<Checkbox checked />);
    expect(screen.getByTestId('fa-icon')).toHaveAttribute('data-icon', 'check');
  });

  it('draws a dash instead of a check mark when indeterminate', () => {
    render(<Checkbox checked="indeterminate" />);
    expect(screen.getByTestId('fa-icon')).toHaveAttribute('data-icon', 'minus');
  });
});
