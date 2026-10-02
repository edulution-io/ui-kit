/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define, @typescript-eslint/no-var-requires, global-require, jsx-a11y/label-has-associated-control, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/role-has-required-aria-props, react/button-has-type, react/display-name, react/no-array-index-key, no-underscore-dangle, no-plusplus */

vi.mock('@radix-ui/react-switch', () => {
  const React = require('react');
  const Root = React.forwardRef(({ children, className, onCheckedChange, disabled, ...props }: any, ref: any) => (
    <button
      data-testid="switch-root"
      className={className}
      role="switch"
      disabled={disabled}
      onClick={() => onCheckedChange?.(!props.checked)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  ));
  Root.displayName = 'Switch';
  const Thumb = ({ className }: any) => (
    <span
      data-testid="switch-thumb"
      className={className}
    />
  );
  return { Root, Thumb };
});

vi.mock('../utils/cn', () => ({
  default: (...args: any[]) => args.filter(Boolean).join(' '),
}));

import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Switch from './Switch';

describe('Switch', () => {
  it('renders the switch with root and thumb', () => {
    render(<Switch />);
    expect(screen.getByTestId('switch-root')).toBeInTheDocument();
    expect(screen.getByTestId('switch-thumb')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Switch className="custom-class" />);
    expect(screen.getByTestId('switch-root').className).toContain('custom-class');
  });

  it('forwards disabled prop', () => {
    render(<Switch disabled />);
    expect(screen.getByTestId('switch-root')).toBeDisabled();
  });

  it('calls onCheckedChange when toggled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch onCheckedChange={handleChange} />);

    await user.click(screen.getByTestId('switch-root'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByTestId('switch-root'));
  });
});
