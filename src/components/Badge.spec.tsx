/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
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

import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children content', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders as a div element', () => {
    const { container } = render(<Badge>Badge</Badge>);
    expect(container.firstElementChild.tagName).toBe('DIV');
  });

  it('merges custom className', () => {
    const { container } = render(<Badge className="my-badge">Tag</Badge>);
    expect(container.firstElementChild.className).toContain('my-badge');
  });

  it('applies default variant when none specified', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstElementChild.className).toContain('bg-primary');
  });

  it('applies destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>);
    expect(container.firstElementChild.className).toContain('bg-destructive');
  });

  it('applies secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Info</Badge>);
    expect(container.firstElementChild.className).toContain('bg-accent');
  });

  it('applies outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    expect(container.firstElementChild.className).toContain('text-foreground');
  });

  it('always applies fixed height', () => {
    const { container } = render(<Badge>Tag</Badge>);
    expect(container.firstElementChild.className).toContain('h-[36px]');
  });

  it('caps its width at the width of its container', () => {
    const { container } = render(<Badge>Tag</Badge>);
    expect(container.firstElementChild.className).toContain('max-w-full');
  });

  it('wraps a text child in a truncating element that carries the full text as its title', () => {
    render(<Badge>A label that is longer than its container</Badge>);

    const label = screen.getByText('A label that is longer than its container');
    expect(label.tagName).toBe('SPAN');
    expect(label.className).toContain('truncate');
    expect(label.className).toContain('min-w-0');
    expect(label).toHaveAttribute('title', 'A label that is longer than its container');
  });

  it('keeps an element child next to the truncating element instead of inside it', () => {
    const { container } = render(
      <Badge>
        Label
        <button type="button">delete</button>
      </Badge>,
    );

    expect(screen.getByRole('button', { name: 'delete' }).parentElement).toBe(container.firstElementChild);
    expect(screen.getByText('Label').querySelector('button')).toBeNull();
  });

  it('renders adjacent text children as one truncating element so the space between them stays', () => {
    const running = true;
    const name = 'sshd';
    const { container } = render(
      <Badge>
        {running ? '●' : '○'} {name}
      </Badge>,
    );

    expect(container.firstElementChild.children).toHaveLength(1);
    const label = container.firstElementChild.firstElementChild;
    expect(label.tagName).toBe('SPAN');
    expect(label.textContent).toBe('● sshd');
    expect(label).toHaveAttribute('title', '● sshd');
  });

  it('joins a number with the text next to it into one title', () => {
    const count = 3;
    render(<Badge>{count} new</Badge>);

    expect(screen.getByText('3 new')).toHaveAttribute('title', '3 new');
  });

  it('keeps text on both sides of an element child in two separate truncating elements', () => {
    const { container } = render(
      <Badge>
        Before
        <button type="button">delete</button>
        After
      </Badge>,
    );

    expect(Array.from(container.firstElementChild.children).map((child) => child.tagName)).toEqual([
      'SPAN',
      'BUTTON',
      'SPAN',
    ]);
    expect(screen.getByText('Before')).toHaveAttribute('title', 'Before');
    expect(screen.getByText('After')).toHaveAttribute('title', 'After');
  });

  it('leaves a badge that holds only elements unwrapped', () => {
    const { container } = render(
      <Badge>
        <em>custom</em>
      </Badge>,
    );

    expect(container.firstElementChild.children).toHaveLength(1);
    expect(container.firstElementChild.firstElementChild.tagName).toBe('EM');
  });

  it('passes additional HTML attributes', () => {
    render(<Badge data-testid="custom-badge">Tag</Badge>);
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
  });
});
