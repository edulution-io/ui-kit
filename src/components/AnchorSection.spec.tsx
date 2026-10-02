/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define, jsx-a11y/label-has-associated-control, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/role-has-required-aria-props, react/button-has-type, react/display-name, react/no-array-index-key, no-underscore-dangle, no-plusplus */

import React from 'react';
import { render, screen } from '@testing-library/react';
import AnchorSection from './AnchorSection';

describe('AnchorSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children', () => {
    render(
      <AnchorSection id="test-section">
        <p>Section content</p>
      </AnchorSection>,
    );

    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('sets the id attribute on the section element', () => {
    const { container } = render(<AnchorSection id="my-anchor">Content</AnchorSection>);

    const section = container.querySelector('section');
    expect(section).toHaveAttribute('id', 'my-anchor');
  });

  it('applies scroll-mt-20 class by default', () => {
    const { container } = render(<AnchorSection id="section-1">Content</AnchorSection>);

    const section = container.querySelector('section');
    expect(section?.className).toContain('scroll-mt-20');
  });

  it('applies additional className when provided', () => {
    const { container } = render(
      <AnchorSection
        id="section-2"
        className="extra-class"
      >
        Content
      </AnchorSection>,
    );

    const section = container.querySelector('section');
    expect(section?.className).toContain('extra-class');
  });
});
