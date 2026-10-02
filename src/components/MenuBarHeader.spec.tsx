/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuBarHeader from './MenuBarHeader';

describe('MenuBarHeader', () => {
  const defaultProps = {
    icon: (
      <img
        src="icon.png"
        alt="test icon"
      />
    ),
    title: 'Test Title',
    onHeaderClick: vi.fn(),
  };

  it('renders title correctly', () => {
    render(<MenuBarHeader {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not render the icon (icon slot was removed)', () => {
    render(<MenuBarHeader {...defaultProps} />);
    expect(screen.queryByAltText('test icon')).not.toBeInTheDocument();
  });

  it('forwards ref to the div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuBarHeader
        ref={ref}
        {...defaultProps}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('calls onHeaderClick when button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <MenuBarHeader
        {...defaultProps}
        onHeaderClick={handleClick}
      />,
    );
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('merges custom className', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MenuBarHeader
        ref={ref}
        {...defaultProps}
        className="my-custom-class"
      />,
    );
    expect(ref.current?.className).toContain('my-custom-class');
  });
});
