/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createRef } from 'react';

vi.mock('@radix-ui/react-avatar', () => {
  const Root = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="avatar-root"
      className={className}
      {...props}
    >
      {children}
    </div>
  ));
  Root.displayName = 'Avatar';
  const Image = React.forwardRef(({ className, src, alt, ...props }: any, ref: any) => (
    <img
      ref={ref}
      data-testid="avatar-image"
      className={className}
      src={src}
      alt={alt}
      {...props}
    />
  ));
  Image.displayName = 'AvatarImage';
  const Fallback = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <span
      ref={ref}
      data-testid="avatar-fallback"
      className={className}
      {...props}
    >
      {children}
    </span>
  ));
  Fallback.displayName = 'AvatarFallback';
  return { Root, Image, Fallback };
});

import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';

describe('Avatar', () => {
  it('renders with default classes', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByTestId('avatar-root').className).toContain('rounded-full');
  });

  it('merges custom className', () => {
    render(
      <Avatar className="size-12">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByTestId('avatar-root').className).toContain('size-12');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Avatar ref={ref}>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('AvatarImage', () => {
  it('renders with src and alt', () => {
    render(
      <Avatar>
        <AvatarImage
          src="/photo.jpg"
          alt="User"
        />
      </Avatar>,
    );
    const img = screen.getByTestId('avatar-image');
    expect(img).toHaveAttribute('src', '/photo.jpg');
    expect(img).toHaveAttribute('alt', 'User');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLImageElement>();
    render(
      <Avatar>
        <AvatarImage
          ref={ref}
          src="/photo.jpg"
          alt="User"
        />
      </Avatar>,
    );
    expect(ref.current).toBeInstanceOf(HTMLImageElement);
  });
});

describe('AvatarFallback', () => {
  it('renders fallback text', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(
      <Avatar>
        <AvatarFallback className="bg-red-500">X</AvatarFallback>
      </Avatar>,
    );
    const fallback = screen.getByTestId('avatar-fallback');
    expect(fallback.className).toContain('bg-red-500');
    expect(fallback.className).toContain('rounded-full');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Avatar>
        <AvatarFallback ref={ref}>X</AvatarFallback>
      </Avatar>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
