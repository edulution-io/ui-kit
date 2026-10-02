/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import FullScreenImage from './FullScreenImage';

describe('FullScreenImage', () => {
  it('renders the image with provided src', () => {
    render(
      <FullScreenImage
        imageSrc="https://example.com/photo.jpg"
        altText="Preview"
      />,
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('renders the image with provided alt text', () => {
    render(
      <FullScreenImage
        imageSrc="https://example.com/photo.jpg"
        altText="My image"
      />,
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'My image');
  });

  it('renders inside a full-size container', () => {
    const { container } = render(
      <FullScreenImage
        imageSrc="https://example.com/photo.jpg"
        altText="Preview"
      />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('h-full');
    expect(wrapper.className).toContain('w-full');
  });

  it('applies rounded styling to the image', () => {
    render(
      <FullScreenImage
        imageSrc="https://example.com/photo.jpg"
        altText="Preview"
      />,
    );
    const img = screen.getByRole('img');
    expect(img.className).toContain('rounded-md');
  });
});
