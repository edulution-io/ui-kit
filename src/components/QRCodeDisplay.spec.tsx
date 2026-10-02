/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

vi.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value, size, ...props }: Record<string, unknown>) => (
    <svg
      data-testid="qr-svg"
      data-value={value as string}
      data-size={String(size)}
      {...props}
    />
  ),
}));

vi.mock('./CircleLoader', () => ({
  default: ({ className }: { className?: string }) => (
    <div
      data-testid="circle-loader"
      className={className}
    />
  ),
}));

import { render, screen } from '@testing-library/react';
import QRCodeDisplay from './QRCodeDisplay';

describe('QRCodeDisplay', () => {
  it('renders QRCodeSVG with the given value and default size (256)', () => {
    render(<QRCodeDisplay value="https://example.com" />);
    const svg = screen.getByTestId('qr-svg');
    expect(svg.getAttribute('data-value')).toBe('https://example.com');
    expect(svg.getAttribute('data-size')).toBe('256');
  });

  it('renders with sm size (64px)', () => {
    render(
      <QRCodeDisplay
        value="test"
        size="sm"
      />,
    );
    expect(screen.getByTestId('qr-svg').getAttribute('data-size')).toBe('64');
  });

  it('renders with md size (128px)', () => {
    render(
      <QRCodeDisplay
        value="test"
        size="md"
      />,
    );
    expect(screen.getByTestId('qr-svg').getAttribute('data-size')).toBe('128');
  });

  it('renders with lg size (200px)', () => {
    render(
      <QRCodeDisplay
        value="test"
        size="lg"
      />,
    );
    expect(screen.getByTestId('qr-svg').getAttribute('data-size')).toBe('200');
  });

  it('renders with xl size (256px)', () => {
    render(
      <QRCodeDisplay
        value="test"
        size="xl"
      />,
    );
    expect(screen.getByTestId('qr-svg').getAttribute('data-size')).toBe('256');
  });

  it('shows CircleLoader when isLoading is true', () => {
    render(
      <QRCodeDisplay
        value="test"
        isLoading
      />,
    );
    expect(screen.getByTestId('circle-loader')).toBeInTheDocument();
    expect(screen.queryByTestId('qr-svg')).not.toBeInTheDocument();
  });

  it('shows QRCode when isLoading is false', () => {
    render(
      <QRCodeDisplay
        value="test"
        isLoading={false}
      />,
    );
    expect(screen.getByTestId('qr-svg')).toBeInTheDocument();
    expect(screen.queryByTestId('circle-loader')).not.toBeInTheDocument();
  });

  it('applies custom className to the container', () => {
    const { container } = render(
      <QRCodeDisplay
        value="test"
        className="custom-qr"
      />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom-qr');
  });
});
