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

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SectionCard from './SectionCard';

describe('SectionCard', () => {
  it('renders children inside the body', () => {
    render(
      <SectionCard>
        <span data-testid="single-body">single body</span>
      </SectionCard>,
    );

    expect(screen.getByTestId('single-body')).toBeInTheDocument();
  });

  it('renders the header label as an h3 when label is a string', () => {
    render(
      <SectionCard label="Section title">
        <span>body</span>
      </SectionCard>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Section title' })).toBeInTheDocument();
  });

  it('uses the provided header node when both header and label are passed', () => {
    render(
      <SectionCard
        label="ignored"
        header={<div data-testid="custom-header">custom header</div>}
      >
        <span>body</span>
      </SectionCard>,
    );

    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'ignored' })).toBeNull();
  });

  it('applies the liquid-glass surface for the default variant and drops it for transparent', () => {
    const { rerender } = render(
      <SectionCard surfaceId="surface">
        <span>body</span>
      </SectionCard>,
    );

    expect(document.getElementById('surface')).toHaveClass('liquid-glass');

    rerender(
      <SectionCard
        surfaceId="surface"
        variant="transparent"
      >
        <span>body</span>
      </SectionCard>,
    );

    expect(document.getElementById('surface')).not.toHaveClass('liquid-glass');
  });

  it('forwards onClick to the surface so the whole card is clickable', () => {
    const onClick = vi.fn();
    render(
      <SectionCard
        surfaceId="surface"
        onClick={onClick}
      >
        <span>body</span>
      </SectionCard>,
    );

    fireEvent.click(document.getElementById('surface') as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
