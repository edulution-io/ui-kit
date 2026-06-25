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

import React from 'react';
import { render, screen } from '@testing-library/react';
import StatValue from './StatValue';

describe('StatValue', () => {
  it('renders the emphasized value and the muted denominator', () => {
    render(
      <StatValue
        value={0}
        total={1}
      />,
    );

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('/ 1')).toBeInTheDocument();
  });

  it('appends the unit to the denominator', () => {
    render(
      <StatValue
        value="1.5"
        total="9.7"
        unit="GB"
      />,
    );

    expect(screen.getByText('1.5')).toBeInTheDocument();
    expect(screen.getByText('/ 9.7 GB', { exact: false })).toBeInTheDocument();
  });

  it('renders the optional label', () => {
    render(
      <StatValue
        value={2}
        total={5}
        label="Joined"
      />,
    );

    expect(screen.getByText('Joined')).toBeInTheDocument();
  });

  it('omits the denominator when no total is provided', () => {
    render(<StatValue value={42} />);

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.queryByText('/', { exact: false })).toBeNull();
  });
});
