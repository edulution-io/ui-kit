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
