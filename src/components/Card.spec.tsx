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

import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardContent } from './Card';
import type { CardVariant } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card content here</Card>);
    expect(screen.getByText('Card content here')).toBeInTheDocument();
  });

  it('forwards ref to the div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref test</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('spreads additional HTML attributes', () => {
    render(
      <Card
        data-testid="custom-card"
        aria-label="custom"
      >
        Test
      </Card>,
    );
    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    expect(screen.getByLabelText('custom')).toBeInTheDocument();
  });

  it('applies default variant classes when no variant is specified', () => {
    render(<Card data-testid="card">Default</Card>);
    const card = screen.getByTestId('card');
    expect(card.className).toContain('border-primary');
  });

  it('applies variant classes', () => {
    render(<Card variant="security">Secure content</Card>);
    const card = screen.getByText('Secure content');
    expect(card.className).toContain('gradient-box');
  });

  it('applies base classes', () => {
    render(<Card data-testid="card">Base</Card>);
    const card = screen.getByTestId('card');
    expect(card.className).toContain('rounded-xl');
    expect(card.className).toContain('bg-card');
    expect(card.className).toContain('border-solid');
  });

  it('merges custom className with variant classes', () => {
    render(
      <Card
        className="my-custom-class"
        data-testid="card"
      >
        Styled
      </Card>,
    );
    expect(screen.getByTestId('card').className).toContain('my-custom-class');
  });

  it.each<CardVariant>([
    'collaboration',
    'organisation',
    'infrastructure',
    'security',
    'modal',
    'text',
    'dialog',
    'grid',
    'gridSelected',
    'tile',
    'tileSelected',
  ])('renders without errors for variant %s', (variant) => {
    render(
      <Card
        variant={variant}
        data-testid="card"
      >
        Test
      </Card>,
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('has displayName set to Card', () => {
    expect(Card.displayName).toBe('Card');
  });
});

describe('CardContent', () => {
  it('renders children correctly', () => {
    render(<CardContent>Inner content</CardContent>);
    expect(screen.getByText('Inner content')).toBeInTheDocument();
  });

  it('forwards ref to the div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Ref test</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies default padding class', () => {
    render(<CardContent data-testid="content">Padded</CardContent>);
    expect(screen.getByTestId('content').className).toContain('p-[20px]');
  });

  it('merges custom className', () => {
    render(
      <CardContent
        className="extra-class"
        data-testid="content"
      >
        Styled
      </CardContent>,
    );
    expect(screen.getByTestId('content').className).toContain('extra-class');
  });

  it('spreads additional HTML attributes', () => {
    render(
      <CardContent
        data-testid="content"
        aria-label="content-label"
      >
        Test
      </CardContent>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByLabelText('content-label')).toBeInTheDocument();
  });

  it('has displayName set to CardContent', () => {
    expect(CardContent.displayName).toBe('CardContent');
  });
});
