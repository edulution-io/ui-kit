/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
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

  it('draws the image border in the danger colour when the image fails to load', () => {
    render(<ImageComponent {...defaultProps} />);
    const img = screen.getByAltText('Test image');
    fireEvent.error(img);
    expect(img).toHaveClass('border', 'border-colorDanger');
  });

  it('shows the error text in the danger colour', () => {
    render(<ImageComponent {...defaultProps} />);
    fireEvent.error(screen.getByAltText('Test image'));
    expect(screen.getByText('Failed to load image')).toHaveClass('text-colorDanger');
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

  describe('fitting the image into its container (issue 4077)', () => {
    it('caps the image at its container instead of stretching it to the full width', () => {
      render(<ImageComponent {...defaultProps} />);
      const img = screen.getByAltText('Test image');
      expect(img).toHaveClass('max-h-full', 'max-w-full');
      expect(img).not.toHaveClass('w-full');
    });

    it('fills its container and centres the image in it', () => {
      render(<ImageComponent {...defaultProps} />);
      const wrapper = screen.getByAltText('Test image').parentElement;
      expect(wrapper).toHaveClass('flex', 'h-full', 'w-full', 'items-center', 'justify-center');
    });

    it('lets the image shrink, so the error text below a tall placeholder stays inside the container', () => {
      render(<ImageComponent {...defaultProps} />);
      expect(screen.getByAltText('Test image')).toHaveClass('min-h-0');
    });

    it('stacks the error text below the image', () => {
      render(<ImageComponent {...defaultProps} />);
      const img = screen.getByAltText('Test image');
      fireEvent.error(img);
      expect(img.parentElement).toHaveClass('flex-col');
      expect(img.nextElementSibling).toHaveTextContent('Failed to load image');
    });
  });
});
