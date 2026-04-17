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

  it('renders icon correctly', () => {
    render(<MenuBarHeader {...defaultProps} />);
    expect(screen.getByAltText('test icon')).toBeInTheDocument();
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
