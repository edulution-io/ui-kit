/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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

  it('scales the value and the denominator down for the sm size', () => {
    render(
      <StatValue
        value={42}
        total={9}
        size="sm"
      />,
    );

    expect(screen.getByText('42')).toHaveClass('text-lg');
    expect(screen.getByText('/ 9')).toHaveClass('text-sm');
  });

  it('falls back to the card-sized md scale when no size is given', () => {
    render(
      <StatValue
        value={42}
        total={9}
      />,
    );

    expect(screen.getByText('42')).toHaveClass('text-2xl');
    expect(screen.getByText('/ 9')).toHaveClass('text-base');
  });

  it('uses the hero-sized lg scale', () => {
    render(
      <StatValue
        value={42}
        total={9}
        size="lg"
      />,
    );

    expect(screen.getByText('42')).toHaveClass('text-4xl');
    expect(screen.getByText('/ 9')).toHaveClass('text-xl');
  });
});
