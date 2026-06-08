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
});
