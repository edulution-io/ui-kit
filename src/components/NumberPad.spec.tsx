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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberPad from './NumberPad';

describe('NumberPad', () => {
  const defaultProps = {
    onPress: vi.fn(),
    onClear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all digit buttons (0-9)', () => {
    render(<NumberPad {...defaultProps} />);
    for (let i = 0; i <= 9; i += 1) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it('renders 11 buttons total (10 digits + 1 clear)', () => {
    const { container } = render(<NumberPad {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(11);
  });

  it('calls onPress with correct digit when button clicked', async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();
    render(
      <NumberPad
        onPress={handlePress}
        onClear={vi.fn()}
      />,
    );

    await user.click(screen.getByText('5'));
    expect(handlePress).toHaveBeenCalledWith('5');

    await user.click(screen.getByText('0'));
    expect(handlePress).toHaveBeenCalledWith('0');
  });

  it('calls onClear when backspace button clicked', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();
    render(
      <NumberPad
        onPress={vi.fn()}
        onClear={handleClear}
      />,
    );

    const buttons = screen.getAllByRole('button');
    const clearButton = buttons[buttons.length - 1];
    await user.click(clearButton);
    expect(handleClear).toHaveBeenCalledOnce();
  });

  it('applies login variant styling to digit buttons', () => {
    const { container } = render(
      <NumberPad
        {...defaultProps}
        variant="login"
      />,
    );
    const buttons = container.querySelectorAll('button');
    const digitButton = buttons[0];
    expect(digitButton.className).toContain('border-ciDarkGrey');
    expect(digitButton.className).toContain('text-ciDarkGrey');
  });

  it('does not apply login variant styling with default variant', () => {
    const { container } = render(<NumberPad {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    const digitButton = buttons[0];
    expect(digitButton.className).not.toContain('border-ciDarkGrey');
  });
});
