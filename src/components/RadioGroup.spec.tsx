/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createRef } from 'react';

vi.mock('@radix-ui/react-radio-group', () => {
  const Root = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="radiogroup-root"
      className={className}
      role="radiogroup"
      {...props}
    >
      {children}
    </div>
  ));
  Root.displayName = 'RadioGroup';
  const Item = React.forwardRef(({ children, className, value, disabled, ...props }: any, ref: any) => (
    <button
      ref={ref}
      type="button"
      data-testid={`radiogroup-item-${value}`}
      className={className}
      role="radio"
      aria-checked={false}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ));
  Item.displayName = 'RadioGroupItem';
  const Indicator = ({ children }: any) => <span data-testid="radiogroup-indicator">{children}</span>;
  return { Root, Item, Indicator };
});

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

import { render, screen } from '@testing-library/react';
import { RadioGroup, RadioGroupItem } from './RadioGroup';

describe('RadioGroup', () => {
  it('renders with radiogroup role', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(
      <RadioGroup className="gap-4">
        <RadioGroupItem value="a" />
      </RadioGroup>,
    );
    expect(screen.getByTestId('radiogroup-root').className).toContain('gap-4');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioGroup ref={ref}>
        <RadioGroupItem value="a" />
      </RadioGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('RadioGroupItem', () => {
  it('renders multiple items', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="opt1" />
        <RadioGroupItem value="opt2" />
      </RadioGroup>,
    );
    expect(screen.getByTestId('radiogroup-item-opt1')).toBeInTheDocument();
    expect(screen.getByTestId('radiogroup-item-opt2')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(
      <RadioGroup>
        <RadioGroupItem
          value="a"
          className="item-custom"
        />
      </RadioGroup>,
    );
    expect(screen.getByTestId('radiogroup-item-a').className).toContain('item-custom');
  });

  it('renders check icon indicator', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" />
      </RadioGroup>,
    );
    expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
  });

  it('supports disabled state', () => {
    render(
      <RadioGroup>
        <RadioGroupItem
          value="a"
          disabled
        />
      </RadioGroup>,
    );
    expect(screen.getByTestId('radiogroup-item-a')).toBeDisabled();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <RadioGroup>
        <RadioGroupItem
          ref={ref}
          value="a"
        />
      </RadioGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
