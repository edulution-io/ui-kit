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
