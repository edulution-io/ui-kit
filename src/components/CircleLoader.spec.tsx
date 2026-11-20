/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, className, style, 'data-edu-motion': motionRole }: Record<string, unknown>) => (
      <span
        data-testid="motion-span"
        data-edu-motion={motionRole as string}
        className={className as string}
        style={style as React.CSSProperties}
      >
        {children as React.ReactNode}
      </span>
    ),
  },
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import CircleLoader from './CircleLoader';

describe('CircleLoader', () => {
  it('renders the loader container', () => {
    const { container } = render(<CircleLoader />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.className).toContain('relative');
  });

  it('applies default height and width classes', () => {
    const { container } = render(<CircleLoader />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('h-12');
    expect(wrapper.className).toContain('w-12');
  });

  it('applies custom height and width classes', () => {
    const { container } = render(
      <CircleLoader
        height="h-8"
        width="w-8"
      />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('h-8');
    expect(wrapper.className).toContain('w-8');
  });

  it('applies custom className', () => {
    const { container } = render(<CircleLoader className="my-loader" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('my-loader');
  });

  it('marks the spinner as essential motion so reduced motion keeps it turning', () => {
    render(<CircleLoader />);
    expect(screen.getByTestId('motion-span')).toHaveAttribute('data-edu-motion', 'essential');
  });

  it('uses light mode border classes when forceLightMode is true', () => {
    render(<CircleLoader forceLightMode />);
    const spinner = screen.getByTestId('motion-span');
    expect(spinner.className).toContain('border-lightGrey');
    expect(spinner.className).toContain('border-t-primary');
  });

  it('uses default border classes when forceLightMode is false', () => {
    render(<CircleLoader />);
    const spinner = screen.getByTestId('motion-span');
    expect(spinner.className).toContain('border-accent');
    expect(spinner.className).toContain('border-t-primary');
  });

  it('applies custom transitionDurationMS to animation style', () => {
    render(<CircleLoader transitionDurationMS={2000} />);
    const spinner = screen.getByTestId('motion-span');
    expect(spinner.style.animation).toContain('2s');
  });
});
