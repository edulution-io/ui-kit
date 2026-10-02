/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

vi.mock('./Progress', () => ({
  default: ({ value }: { value: number }) => (
    <div
      data-testid="progress-bar"
      data-value={value}
      role="progressbar"
    />
  ),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBox from './ProgressBox';

describe('ProgressBox', () => {
  it('renders percent value', () => {
    render(<ProgressBox data={{ id: '1', percent: 75 }} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders progress bar with correct value', () => {
    render(<ProgressBox data={{ id: '1', percent: 50 }} />);
    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('data-value', '50');
  });

  it('renders title when provided', () => {
    render(<ProgressBox data={{ id: '1', percent: 30, title: 'Upload Progress' }} />);
    expect(screen.getByText('Upload Progress')).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    const { container } = render(<ProgressBox data={{ id: '1', percent: 30 }} />);
    expect(container.querySelector('h1')).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<ProgressBox data={{ id: '1', percent: 60, description: 'Processing files...' }} />);
    expect(screen.getByText('Processing files...')).toBeInTheDocument();
  });

  it('renders statusText when provided', () => {
    render(<ProgressBox data={{ id: '1', percent: 80, statusText: '8 of 10 completed' }} />);
    expect(screen.getByText('8 of 10 completed')).toBeInTheDocument();
  });
});
