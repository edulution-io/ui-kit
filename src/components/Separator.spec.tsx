/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define, jsx-a11y/label-has-associated-control, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/role-has-required-aria-props, react/button-has-type, react/display-name, react/no-array-index-key, no-underscore-dangle, no-plusplus */

vi.mock('@radix-ui/react-separator', () => {
  const Root = ({ className, orientation, decorative, ...props }: any) => (
    <div
      data-testid="separator"
      className={className}
      data-orientation={orientation}
      role={decorative ? 'none' : 'separator'}
      {...props}
    />
  );
  Root.displayName = 'Separator';
  return { Root };
});

vi.mock('../utils/cn', () => ({
  default: (...args: any[]) => args.filter(Boolean).join(' '),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import Separator from './Separator';

describe('Separator', () => {
  it('renders a separator element', () => {
    render(<Separator />);
    expect(screen.getByTestId('separator')).toBeInTheDocument();
  });

  it('defaults to horizontal orientation', () => {
    render(<Separator />);
    const separator = screen.getByTestId('separator');
    expect(separator.className).toContain('h-[1px] w-full');
  });

  it('renders vertical orientation', () => {
    render(<Separator orientation="vertical" />);
    const separator = screen.getByTestId('separator');
    expect(separator.className).toContain('h-full w-[1px]');
  });

  it('applies custom className', () => {
    render(<Separator className="my-separator" />);
    expect(screen.getByTestId('separator').className).toContain('my-separator');
  });
});
