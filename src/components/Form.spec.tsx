/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-use-before-define, react/display-name, jsx-a11y/label-has-associated-control */

vi.mock('@radix-ui/react-label', () => ({
  Root: React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <label
      ref={ref}
      data-testid="label-root"
      className={className}
      {...props}
    >
      {children}
    </label>
  )),
}));

vi.mock('@radix-ui/react-slot', () => ({
  Slot: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="slot"
      {...props}
    >
      {children}
    </div>
  )),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormItem, FormDescription, Form } from './Form';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({ defaultValues: { test: '' } });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('Form', () => {
  it('is an alias for FormProvider', () => {
    expect(Form).toBe(FormProvider);
  });
});

describe('FormItem', () => {
  it('renders a div with children', () => {
    render(
      <Wrapper>
        <FormItem data-testid="form-item">
          <span>Field content</span>
        </FormItem>
      </Wrapper>,
    );
    expect(screen.getByTestId('form-item')).toBeInTheDocument();
    expect(screen.getByText('Field content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Wrapper>
        <FormItem
          data-testid="form-item"
          className="custom-item"
        />
      </Wrapper>,
    );
    expect(screen.getByTestId('form-item').className).toContain('custom-item');
  });
});

describe('FormDescription', () => {
  it('renders a paragraph with description text', () => {
    render(
      <Wrapper>
        <FormItem>
          <FormDescription>Help text here</FormDescription>
        </FormItem>
      </Wrapper>,
    );
    expect(screen.getByText('Help text here')).toBeInTheDocument();
  });
});
