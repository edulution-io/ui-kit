/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, className }: Record<string, unknown>) => (
      <span
        data-testid="motion-span"
        className={className as string}
      >
        {children as React.ReactNode}
      </span>
    ),
  },
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import HorizontalLoader from './HorizontalLoader';

describe('HorizontalLoader', () => {
  it('renders the loader container', () => {
    const { container } = render(<HorizontalLoader />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.className).toContain('overflow-hidden');
  });

  it('applies default height and width classes', () => {
    const { container } = render(<HorizontalLoader />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('h-1');
    expect(wrapper.className).toContain('w-full');
  });

  it('applies custom height and width classes', () => {
    const { container } = render(
      <HorizontalLoader
        height="h-2"
        width="w-1/2"
      />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('h-2');
    expect(wrapper.className).toContain('w-1/2');
  });

  it('applies default background and bar color classes', () => {
    const { container } = render(<HorizontalLoader />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('bg-accent');

    const bar = screen.getByTestId('motion-span');
    expect(bar.className).toContain('bg-primary');
  });

  it('applies custom bar color', () => {
    render(<HorizontalLoader barColor="bg-blue-500" />);
    const bar = screen.getByTestId('motion-span');
    expect(bar.className).toContain('bg-blue-500');
  });

  it('applies custom background color', () => {
    const { container } = render(<HorizontalLoader backgroundColor="bg-gray-200" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('bg-gray-200');
  });

  it('applies custom barWidth', () => {
    render(<HorizontalLoader barWidth="w-1/3" />);
    const bar = screen.getByTestId('motion-span');
    expect(bar.className).toContain('w-1/3');
  });

  it('applies custom className', () => {
    const { container } = render(<HorizontalLoader className="my-loader" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('my-loader');
  });
});
