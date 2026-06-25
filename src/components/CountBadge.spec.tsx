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
