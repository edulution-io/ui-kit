/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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
    expect(digitButton.className).toContain('border-darkGrey');
    expect(digitButton.className).toContain('text-darkGrey');
  });

  it('does not apply login variant styling with default variant', () => {
    const { container } = render(<NumberPad {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    const digitButton = buttons[0];
    expect(digitButton.className).not.toContain('border-darkGrey');
  });
});
