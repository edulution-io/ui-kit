/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { render } from '@testing-library/react';
import CircularProgress from './CircularProgress';

const progressCircle = (container: HTMLElement) => container.querySelectorAll('circle')[1];
const offset = (container: HTMLElement) => Number(progressCircle(container).getAttribute('stroke-dashoffset'));
const dasharray = (container: HTMLElement) => Number(progressCircle(container).getAttribute('stroke-dasharray'));

describe('CircularProgress', () => {
  it('renders a track circle and a progress circle', () => {
    const { container } = render(<CircularProgress value={0.5} />);
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });

  it('shows an empty arc at value 0 (offset === full circumference)', () => {
    const { container } = render(<CircularProgress value={0} />);
    expect(offset(container)).toBeCloseTo(dasharray(container));
  });

  it('shows a full arc at value 1 (offset === 0)', () => {
    const { container } = render(<CircularProgress value={1} />);
    expect(offset(container)).toBeCloseTo(0);
  });

  it('fills half the arc at value 0.5', () => {
    const { container } = render(<CircularProgress value={0.5} />);
    expect(offset(container)).toBeCloseTo(dasharray(container) / 2);
  });

  it('clamps out-of-range values', () => {
    const { container: over } = render(<CircularProgress value={5} />);
    expect(offset(over)).toBeCloseTo(0);

    const { container: under } = render(<CircularProgress value={-3} />);
    expect(offset(under)).toBeCloseTo(dasharray(under));
  });
});
