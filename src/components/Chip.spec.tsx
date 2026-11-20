/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

vi.mock('class-variance-authority', () => ({
  cva: (base: string, config?: any) => (props?: any) => {
    const variant = props?.variant || config?.defaultVariants?.variant || 'default';
    const variantClass = config?.variants?.variant?.[variant] || '';
    return [base, variantClass].filter(Boolean).join(' ');
  },
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders children content', () => {
    render(<Chip>Tag</Chip>);
    expect(screen.getByText('Tag')).toBeInTheDocument();
  });

  it('renders as a button element with type button', () => {
    const { container } = render(<Chip>Tag</Chip>);
    const button = container.firstElementChild as HTMLButtonElement;
    expect(button.tagName).toBe('BUTTON');
    expect(button.type).toBe('button');
  });

  it('applies default variant when none specified', () => {
    const { container } = render(<Chip>Tag</Chip>);
    expect(container.firstElementChild.className).toContain('bg-accent');
    expect(container.firstElementChild.className).not.toContain('cursor-pointer');
  });

  it('applies interactive variant', () => {
    const { container } = render(<Chip variant="interactive">Tag</Chip>);
    expect(container.firstElementChild.className).toContain('cursor-pointer');
    expect(container.firstElementChild.className).toContain('hover:bg-primary');
  });

  it('merges custom className', () => {
    const { container } = render(<Chip className="my-chip">Tag</Chip>);
    expect(container.firstElementChild.className).toContain('my-chip');
  });

  it('fires onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Tag</Chip>);
    fireEvent.click(screen.getByText('Tag'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('passes additional HTML attributes', () => {
    render(<Chip data-testid="custom-chip">Tag</Chip>);
    expect(screen.getByTestId('custom-chip')).toBeInTheDocument();
  });

  it('does not look selected by default', () => {
    render(<Chip>Tag</Chip>);

    expect(screen.getByRole('button').className).not.toContain('bg-primary');
  });

  it('fills a selected chip with the primary colour and leaves the ARIA state to the caller', () => {
    render(
      <Chip
        selected
        aria-pressed
      >
        Tag
      </Chip>,
    );
    const classes = screen.getByRole('button', { pressed: true }).className.split(' ');

    expect(classes).toContain('bg-primary');
    expect(classes).toContain('text-primary-foreground');
    expect(classes).not.toContain('bg-accent');
    expect(classes).not.toContain('text-foreground');
  });

  it('forwards its ref to the button', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Chip ref={ref}>Tag</Chip>);

    expect(ref.current).toBe(screen.getByRole('button'));
  });

  it('renders a static span without button semantics with asChild', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Chip
        asChild
        ref={ref}
        className="my-chip"
      >
        <span data-testid="static-chip">Last used</span>
      </Chip>,
    );
    const chip = screen.getByTestId('static-chip');

    expect(chip.tagName).toBe('SPAN');
    expect(chip).not.toHaveAttribute('type');
    expect(chip).not.toHaveAttribute('aschild');
    expect(chip).toHaveClass('bg-accent', 'my-chip');
    expect(ref.current).toBe(chip);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
