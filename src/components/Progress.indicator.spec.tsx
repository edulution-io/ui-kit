/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Progress from './Progress';

const indicatorClasses = () => (screen.getByRole('progressbar').firstElementChild as HTMLElement).className.split(' ');

describe('Progress indicator colour (real class merge)', () => {
  it('fills with the primary colour by default', () => {
    render(<Progress value={40} />);

    expect(indicatorClasses()).toContain('bg-primary');
  });

  it('replaces the primary colour with the indicator class', () => {
    render(
      <Progress
        value={40}
        indicatorClassName="bg-colorDanger"
      />,
    );

    expect(indicatorClasses()).toContain('bg-colorDanger');
    expect(indicatorClasses()).not.toContain('bg-primary');
  });
});
