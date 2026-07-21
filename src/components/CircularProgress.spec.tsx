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
