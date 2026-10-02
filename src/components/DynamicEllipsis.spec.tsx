/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { render } from '@testing-library/react';
import DynamicEllipsis from './DynamicEllipsis';

describe('DynamicEllipsis', () => {
  it('renders full text in the visible container', () => {
    const { container } = render(<DynamicEllipsis text="Hello World" />);
    const visibleDiv = container.querySelector('div:not(.invisible)');
    expect(visibleDiv).toBeInTheDocument();
    expect(visibleDiv.textContent).toBe('Hello World');
  });

  it('renders an invisible measurement span', () => {
    const { container } = render(<DynamicEllipsis text="Measure me" />);
    const invisibleSpan = container.querySelector('span.invisible');
    expect(invisibleSpan).toBeInTheDocument();
  });

  it('applies custom className to both elements', () => {
    const { container } = render(
      <DynamicEllipsis
        text="Styled text"
        className="custom-class"
      />,
    );
    const visibleDiv = container.querySelector('div.custom-class');
    const invisibleSpan = container.querySelector('span.custom-class');
    expect(visibleDiv).toBeInTheDocument();
    expect(invisibleSpan).toBeInTheDocument();
  });

  it('applies overflow-hidden and whitespace-nowrap to visible container', () => {
    const { container } = render(<DynamicEllipsis text="Text" />);
    const visibleDiv = container.querySelector('div') as HTMLElement;
    expect(visibleDiv.className).toContain('overflow-hidden');
    expect(visibleDiv.className).toContain('whitespace-nowrap');
  });

  it('renders empty string without error', () => {
    const { container } = render(<DynamicEllipsis text="" />);
    const visibleDiv = container.querySelector('div:not(.invisible)');
    expect(visibleDiv).toBeInTheDocument();
    expect(visibleDiv.textContent).toBe('');
  });

  it('defaults className to empty string', () => {
    const { container } = render(<DynamicEllipsis text="Default" />);
    const visibleDiv = container.querySelector('div') as HTMLElement;
    expect(visibleDiv.className).toContain('overflow-hidden');
  });
});
