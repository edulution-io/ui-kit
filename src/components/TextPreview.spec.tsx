/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { render, screen } from '@testing-library/react';
import TextPreview from './TextPreview';

describe('TextPreview', () => {
  it('renders content inside a pre element', () => {
    render(<TextPreview content="Hello world" />);
    const pre = screen.getByText('Hello world');
    expect(pre.tagName).toBe('PRE');
  });

  it('applies custom className', () => {
    const { container } = render(
      <TextPreview
        content="Test"
        className="custom-class"
      />,
    );
    const pre = container.querySelector('pre');
    expect(pre?.className).toContain('custom-class');
  });

  it('sets the id from contentId prop', () => {
    const { container } = render(
      <TextPreview
        content="Identified"
        contentId="preview-123"
      />,
    );
    const pre = container.querySelector('pre');
    expect(pre).toHaveAttribute('id', 'preview-123');
  });

  it('preserves whitespace in content', () => {
    const multiline = 'line1\n  line2\n    line3';
    const { container } = render(<TextPreview content={multiline} />);
    const pre = container.querySelector('pre');
    expect(pre?.textContent).toBe(multiline);
  });

  it('renders empty string without error', () => {
    const { container } = render(<TextPreview content="" />);
    const pre = container.querySelector('pre');
    expect(pre).toBeInTheDocument();
    expect(pre?.textContent).toBe('');
  });
});
