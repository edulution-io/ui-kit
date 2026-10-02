/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define, @typescript-eslint/no-var-requires, global-require, import-x/no-named-as-default, jsx-a11y/label-has-associated-control, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/role-has-required-aria-props, react/button-has-type, react/display-name, react/no-array-index-key, no-underscore-dangle, no-plusplus */

vi.mock('@radix-ui/react-label', () => {
  const React = require('react');
  const Root = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <label
      data-testid="label-root"
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </label>
  ));
  Root.displayName = 'Label';
  return { Root };
});

vi.mock('class-variance-authority', () => ({
  cva: (base: string) => (overrides?: Record<string, any>) => base,
  type: {},
}));

vi.mock('../utils/cn', () => ({
  default: (...args: any[]) => args.filter(Boolean).join(' '),
}));

import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import Label from './Label';

describe('Label', () => {
  it('renders children text', () => {
    render(<Label>Username</Label>);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Label className="my-label">Email</Label>);
    const label = screen.getByTestId('label-root');
    expect(label.className).toContain('my-label');
  });

  it('forwards htmlFor prop', () => {
    render(<Label htmlFor="input-email">Email</Label>);
    const label = screen.getByTestId('label-root');
    expect(label).toHaveAttribute('for', 'input-email');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref test</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current).toBe(screen.getByTestId('label-root'));
  });
});
