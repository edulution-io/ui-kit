/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define, jsx-a11y/label-has-associated-control, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/role-has-required-aria-props, react/button-has-type, react/display-name, react/no-array-index-key, no-underscore-dangle, no-plusplus */

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, className }: any) => (
    <span
      data-testid={`fa-icon-${icon?.iconName || 'unknown'}`}
      className={className}
    />
  ),
}));

vi.mock('./Input', () => ({
  inputVariants: () => 'input-base',
  Input: React.forwardRef<HTMLInputElement, any>(({ variant, shouldTrim, icon, ...props }, ref) => (
    <input
      ref={ref}
      data-testid="inner-input"
      {...props}
    />
  )),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputWithActionIcons from './InputWithActionIcons';

const mockIcon = { iconName: 'search', prefix: 'fas', icon: [512, 512, [], '', ''] } as any;
const mockIcon2 = { iconName: 'times', prefix: 'fas', icon: [512, 512, [], '', ''] } as any;

describe('InputWithActionIcons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders an input element', () => {
    render(<InputWithActionIcons placeholder="Type here" />);

    expect(screen.getByTestId('inner-input')).toBeInTheDocument();
  });

  it('renders action icons', () => {
    const actionIcons = [
      { icon: mockIcon, onClick: vi.fn() },
      { icon: mockIcon2, onClick: vi.fn() },
    ];

    render(<InputWithActionIcons actionIcons={actionIcons} />);

    expect(screen.getByTestId('fa-icon-search')).toBeInTheDocument();
    expect(screen.getByTestId('fa-icon-times')).toBeInTheDocument();
  });

  it('calls onClick when an action icon is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const actionIcons = [{ icon: mockIcon, onClick: handleClick }];

    render(<InputWithActionIcons actionIcons={actionIcons} />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables icon buttons when disabled is true', () => {
    const actionIcons = [{ icon: mockIcon, onClick: vi.fn() }];

    render(
      <InputWithActionIcons
        actionIcons={actionIcons}
        disabled
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not render icon container when no action icons', () => {
    const { container } = render(<InputWithActionIcons />);

    expect(container.querySelectorAll('button')).toHaveLength(0);
  });

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();

    render(<InputWithActionIcons ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes readOnly to the input', () => {
    render(<InputWithActionIcons readOnly />);

    expect(screen.getByTestId('inner-input')).toHaveAttribute('readOnly');
  });

  it('applies className to the wrapper div', () => {
    const { container } = render(<InputWithActionIcons className="custom-wrapper" />);

    expect(container.firstChild).toHaveClass('custom-wrapper');
  });

  it('names an icon button after its label', () => {
    const actionIcons = [{ icon: mockIcon, onClick: vi.fn(), label: 'Add tag' }];

    render(<InputWithActionIcons actionIcons={actionIcons} />);

    expect(screen.getByRole('button', { name: 'Add tag' })).toBeInTheDocument();
  });

  it('leaves an icon button without a label unnamed', () => {
    const actionIcons = [{ icon: mockIcon, onClick: vi.fn() }];

    render(<InputWithActionIcons actionIcons={actionIcons} />);

    expect(screen.getByRole('button')).not.toHaveAttribute('aria-label');
  });

  it('applies custom className to action icon', () => {
    const actionIcons = [{ icon: mockIcon, onClick: vi.fn(), className: 'icon-red' }];

    render(<InputWithActionIcons actionIcons={actionIcons} />);

    expect(screen.getByTestId('fa-icon-search')).toHaveClass('icon-red');
  });
});
