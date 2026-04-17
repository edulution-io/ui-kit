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
