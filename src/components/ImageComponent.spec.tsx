/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageComponent from './ImageComponent';

describe('ImageComponent', () => {
  const defaultProps = {
    downloadLink: 'https://example.com/image.png',
    altText: 'Test image',
    errorText: 'Failed to load image',
  };

  it('renders the image with correct src and alt', () => {
    render(<ImageComponent {...defaultProps} />);
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.png');
  });

  it('does not show error message initially', () => {
    render(<ImageComponent {...defaultProps} />);
    expect(screen.queryByText('Failed to load image')).not.toBeInTheDocument();
  });

  it('shows error message when image fails to load', () => {
    render(<ImageComponent {...defaultProps} />);
    const img = screen.getByAltText('Test image');
    fireEvent.error(img);
    expect(screen.getByText('Failed to load image')).toBeInTheDocument();
  });

  it('applies error border class when image fails to load', () => {
    render(<ImageComponent {...defaultProps} />);
    const img = screen.getByAltText('Test image');
    fireEvent.error(img);
    expect(img.className).toContain('border-text-colorDanger');
  });

  it('switches to placeholder image on error when placeholder is provided', () => {
    render(
      <ImageComponent
        {...defaultProps}
        placeholder="https://example.com/placeholder.png"
      />,
    );
    const img = screen.getByAltText('Test image');
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', 'https://example.com/placeholder.png');
  });

  it('keeps original src on error when no placeholder is provided', () => {
    render(<ImageComponent {...defaultProps} />);
    const img = screen.getByAltText('Test image');
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', 'https://example.com/image.png');
  });
});
