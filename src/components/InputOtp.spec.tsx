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

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './InputOtp';

const { mockSlots } = vi.hoisted(() => ({
  mockSlots: {
    current: Array.from({ length: 6 }, () => ({
      char: '',
      hasFakeCaret: false,
      isActive: false,
    })),
  },
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ className }: any) => (
    <span
      data-testid="fa-icon"
      className={className}
    />
  ),
}));

vi.mock('input-otp', async () => {
  const ReactModule = await import('react');
  const OTPInput = ReactModule.forwardRef(({ className, containerClassName, children, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="otp-input"
      className={containerClassName}
    >
      <input
        className={className}
        data-testid="otp-native-input"
        {...props}
      />
      {children}
    </div>
  ));
  OTPInput.displayName = 'OTPInput';

  const contextProxy = new Proxy(
    {},
    {
      get(_, prop) {
        if (prop === 'slots') return mockSlots.current;
        return undefined;
      },
    },
  );

  const OTPInputContext = ReactModule.createContext(contextProxy as { slots: typeof mockSlots.current });

  return { OTPInput, OTPInputContext };
});

vi.mock('../constants/inputOtpVariants', () => ({
  inputOTPSlotVariants: () => 'slot-base-class',
  inputOTPCaretVariants: () => 'caret-base-class',
}));

vi.mock('../utils/cn', () => ({
  default: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('InputOTP', () => {
  it('renders the OTP input container', () => {
    render(<InputOTP maxLength={6} />);
    expect(screen.getByTestId('otp-input')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <InputOTP
        maxLength={6}
        className="custom-otp"
      />,
    );

    expect(screen.getByTestId('otp-native-input').className).toContain('custom-otp');
  });

  it('applies containerClassName', () => {
    render(
      <InputOTP
        maxLength={6}
        containerClassName="container-class"
      />,
    );

    expect(screen.getByTestId('otp-input').className).toContain('container-class');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <InputOTP
        ref={ref}
        maxLength={6}
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('InputOTPGroup', () => {
  it('renders children', () => {
    render(
      <InputOTPGroup>
        <span data-testid="child">slot</span>
      </InputOTPGroup>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(
      <InputOTPGroup
        data-testid="otp-group"
        className="group-class"
      />,
    );

    expect(screen.getByTestId('otp-group').className).toContain('group-class');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<InputOTPGroup ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('InputOTPSlot', () => {
  beforeEach(() => {
    mockSlots.current = Array.from({ length: 6 }, () => ({
      char: '',
      hasFakeCaret: false,
      isActive: false,
    }));
  });

  it('applies slot variant classes', () => {
    render(
      <InputOTPSlot
        index={0}
        data-testid="otp-slot"
      />,
    );

    expect(screen.getByTestId('otp-slot').className).toContain('slot-base-class');
  });

  it('merges custom className', () => {
    render(
      <InputOTPSlot
        index={0}
        data-testid="otp-slot"
        className="slot-custom"
      />,
    );

    expect(screen.getByTestId('otp-slot').className).toContain('slot-custom');
  });

  it('displays the character from context', () => {
    mockSlots.current[0] = { char: '5', hasFakeCaret: false, isActive: false };

    render(
      <InputOTPSlot
        index={0}
        data-testid="otp-slot"
      />,
    );

    expect(screen.getByTestId('otp-slot')).toHaveTextContent('5');
  });

  it('masks the character when rendered as a pin', () => {
    mockSlots.current[0] = { char: '5', hasFakeCaret: false, isActive: false };

    render(
      <InputOTPSlot
        index={0}
        data-testid="otp-slot"
        type="pin"
      />,
    );

    expect(screen.getByTestId('otp-slot')).toHaveTextContent('•');
  });

  it('renders the fake caret when active', () => {
    mockSlots.current[0] = { char: '', hasFakeCaret: true, isActive: true };
    const { container } = render(
      <InputOTPSlot
        index={0}
        data-testid="otp-slot"
      />,
    );

    expect(screen.getByTestId('otp-slot').className).toContain('z-10');
    expect(container.querySelector('.caret-base-class')).toBeInTheDocument();
  });
});

describe('InputOTPSeparator', () => {
  it('renders with separator role', () => {
    render(<InputOTPSeparator />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders the minus icon', () => {
    render(<InputOTPSeparator />);
    expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<InputOTPSeparator ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
