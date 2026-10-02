/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { render, screen } from '@testing-library/react';
import CountBadge from './CountBadge';

describe('CountBadge', () => {
  it('renders the count', () => {
    render(<CountBadge count={5} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('clamps counts above the default max to "99+"', () => {
    render(<CountBadge count={150} />);

    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('clamps counts above a custom max', () => {
    render(
      <CountBadge
        count={42}
        max={9}
      />,
    );

    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('applies a passed className alongside the base classes', () => {
    render(
      <CountBadge
        count={1}
        className="ml-2"
      />,
    );

    const badge = screen.getByText('1');
    expect(badge).toHaveClass('ml-2');
    expect(badge).toHaveClass('bg-accent');
  });

  it('forwards arbitrary span attributes such as aria-label', () => {
    render(
      <CountBadge
        count={3}
        aria-label="3 unread"
      />,
    );

    expect(screen.getByLabelText('3 unread')).toBeInTheDocument();
  });
});
