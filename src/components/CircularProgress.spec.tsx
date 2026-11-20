/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
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

  it('renders a bare ring with the primary arc when no extra props are given', () => {
    const { container } = render(
      <CircularProgress
        value={0.5}
        className="ml-1"
      />,
    );

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(container.firstElementChild?.getAttribute('class')).toBe('shrink-0 ml-1');
    expect(progressCircle(container).getAttribute('class')).toBe('stroke-primary');
  });

  it('colours the arc with the indicator class', () => {
    const { container } = render(
      <CircularProgress
        value={0.5}
        indicatorClassName="stroke-ciLightGreen"
      />,
    );

    expect(progressCircle(container).getAttribute('class')).toBe('stroke-ciLightGreen');
  });

  it('centres its children inside the ring, outside the hidden svg', () => {
    const { container, getByText } = render(
      <CircularProgress
        value={0.5}
        size={140}
        className="mx-auto"
      >
        <span>5 / 12</span>
      </CircularProgress>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper.className).toContain('mx-auto');
    expect(wrapper.style.width).toBe('140px');
    expect(container.querySelector('svg')?.getAttribute('class')).toBe('shrink-0');
    expect(getByText('5 / 12').closest('svg')).toBeNull();
  });

  it.each([
    ['false', false],
    ['null', null],
  ])('renders the bare ring when its only child is %s', (_label, child) => {
    const { container } = render(
      <CircularProgress
        value={0.5}
        className="ml-1"
      >
        {child}
      </CircularProgress>,
    );

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(container.firstElementChild?.getAttribute('class')).toBe('shrink-0 ml-1');
  });
});
