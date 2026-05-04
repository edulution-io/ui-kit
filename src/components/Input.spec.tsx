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

import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Input } from './Input';
import type { InputVariant } from './Input';

describe('Input', () => {
  it('renders text input by default', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('spreads additional HTML attributes', () => {
    render(
      <Input
        data-testid="custom-input"
        aria-label="custom"
      />,
    );
    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
    expect(screen.getByLabelText('custom')).toBeInTheDocument();
  });

  it('applies disabled state', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('handles onChange for text input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'hello');

    expect(handleChange).toHaveBeenCalled();
  });

  it('trims value when shouldTrim is true', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Input
        shouldTrim
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, ' a ');

    const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
    expect(lastCall.target.value).not.toMatch(/^\s/);
  });

  it('preserves spaces when shouldTrim is false', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, ' ');

    const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
    expect(lastCall.target.value).toBe(' ');
  });

  it('calls onChange for email type', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Input
        type="email"
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'a');

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('does not throw when onChange is not provided', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="no handler" />);

    const input = screen.getByPlaceholderText('no handler');
    await expect(user.type(input, 'test')).resolves.not.toThrow();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(
      <Input
        type="password"
        placeholder="Password"
      />,
    );

    const input = screen.getByPlaceholderText('Password');
    expect(input).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('converts number input value to number type', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Input
        type="number"
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('spinbutton');
    await user.type(input, '42');

    const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
    expect(typeof lastCall.target.value).toBe('number');
  });

  it('sets inputMode to numeric for number type', () => {
    render(
      <Input
        type="number"
        placeholder="Number"
      />,
    );
    expect(screen.getByPlaceholderText('Number')).toHaveAttribute('inputMode', 'numeric');
  });

  it('renders icon when provided', () => {
    render(
      <Input
        icon={<span data-testid="custom-icon">icon</span>}
        placeholder="With icon"
      />,
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders without wrapper div for plain text input', () => {
    const { container } = render(<Input placeholder="plain" />);
    expect(container.querySelector('div.relative')).not.toBeInTheDocument();
    expect(container.firstChild).toBe(screen.getByPlaceholderText('plain'));
  });

  it('renders both toggle button and icon for password with icon', () => {
    render(
      <Input
        type="password"
        icon={<span data-testid="extra-icon">ic</span>}
        placeholder="pwd-icon"
      />,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('extra-icon')).toBeInTheDocument();
  });

  it('merges custom className with variant classes', () => {
    render(<Input className="my-custom-class" />);
    expect(screen.getByRole('textbox').className).toContain('my-custom-class');
  });

  it.each<InputVariant>(['default', 'dialog', 'login', 'lightGrayDisabled'])(
    'renders without errors for variant %s',
    (variant) => {
      render(
        <Input
          variant={variant}
          placeholder="Test"
        />,
      );
      expect(screen.getByPlaceholderText('Test')).toBeInTheDocument();
    },
  );

  it('has displayName set to Input', () => {
    expect(Input.displayName).toBe('Input');
  });

  describe('leftIcon', () => {
    it('renders a left icon when leftIcon is provided', () => {
      render(
        <Input
          leftIcon={faSearch}
          placeholder="Search"
        />,
      );

      const input = screen.getByPlaceholderText('Search');
      const wrapper = input.parentElement;
      expect(wrapper).toHaveClass('relative');
      expect(wrapper?.querySelector('svg')).toBeInTheDocument();
    });

    it('adds left padding to the input when leftIcon is provided', () => {
      render(
        <Input
          leftIcon={faSearch}
          placeholder="Search"
        />,
      );
      expect(screen.getByPlaceholderText('Search').className).toContain('pl-9');
    });

    it('does not add left padding when leftIcon is omitted', () => {
      render(<Input placeholder="No icon" />);
      expect(screen.getByPlaceholderText('No icon').className).not.toContain('pl-9');
    });

    it('wraps the input in a relative container only because of leftIcon', () => {
      const { container } = render(
        <Input
          leftIcon={faSearch}
          placeholder="search"
        />,
      );
      expect(container.querySelector('div.relative')).toBeInTheDocument();
    });
  });

  describe('onClear', () => {
    it('does not show the clear button when value is empty string', () => {
      render(
        <Input
          value=""
          onChange={() => {}}
          onClear={vi.fn()}
          placeholder="empty"
        />,
      );

      const wrapper = screen.getByPlaceholderText('empty').parentElement!;
      expect(wrapper.querySelector('button[type="button"]')).toBeNull();
    });

    it('does not show the clear button when value is undefined', () => {
      render(
        <Input
          onClear={vi.fn()}
          placeholder="undef"
        />,
      );

      const wrapper = screen.getByPlaceholderText('undef').parentElement!;
      expect(wrapper.querySelector('button[type="button"]')).toBeNull();
    });

    it('shows the clear button when value is non-empty', () => {
      render(
        <Input
          value="hello"
          onChange={() => {}}
          onClear={vi.fn()}
          placeholder="filled"
        />,
      );

      const wrapper = screen.getByPlaceholderText('filled').parentElement!;
      expect(wrapper.querySelector('button[type="button"]')).toBeInTheDocument();
    });

    it('invokes onClear when the clear button is clicked', async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      render(
        <Input
          value="hello"
          onChange={() => {}}
          onClear={onClear}
          placeholder="clear-me"
        />,
      );

      const wrapper = screen.getByPlaceholderText('clear-me').parentElement!;
      const button = wrapper.querySelector('button[type="button"]') as HTMLElement;
      await user.click(button);

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('adds right padding to the input when onClear is provided', () => {
      render(
        <Input
          value="hi"
          onChange={() => {}}
          onClear={vi.fn()}
          placeholder="pad"
        />,
      );
      expect(screen.getByPlaceholderText('pad').className).toContain('pr-8');
    });

    it('toggles the clear button visibility as a controlled value changes', async () => {
      const user = userEvent.setup();
      const ControlledClear = () => {
        const [value, setValue] = useState('');
        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue('')}
            placeholder="controlled"
          />
        );
      };

      render(<ControlledClear />);
      const input = screen.getByPlaceholderText('controlled');
      const wrapper = input.parentElement!;

      expect(wrapper.querySelector('button[type="button"]')).toBeNull();

      await user.type(input, 'a');
      expect(wrapper.querySelector('button[type="button"]')).toBeInTheDocument();

      await user.click(wrapper.querySelector('button[type="button"]') as HTMLElement);
      expect(wrapper.querySelector('button[type="button"]')).toBeNull();
    });

    it('renders both leftIcon and onClear button together', () => {
      render(
        <Input
          value="x"
          onChange={() => {}}
          leftIcon={faSearch}
          onClear={vi.fn()}
          placeholder="combo"
        />,
      );

      const input = screen.getByPlaceholderText('combo');
      expect(input.className).toContain('pl-9');
      expect(input.className).toContain('pr-8');

      const wrapper = input.parentElement!;
      expect(wrapper.querySelector('svg')).toBeInTheDocument();
      expect(wrapper.querySelector('button[type="button"]')).toBeInTheDocument();
    });
  });
});
