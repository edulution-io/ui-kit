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
    expect(container.firstElementChild.className).toContain('text-background');
  });

  it('always applies fixed height', () => {
    const { container } = render(<Badge>Tag</Badge>);
    expect(container.firstElementChild.className).toContain('h-[36px]');
  });

  it('passes additional HTML attributes', () => {
    render(<Badge data-testid="custom-badge">Tag</Badge>);
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
  });
});
