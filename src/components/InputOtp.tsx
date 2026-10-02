/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { OTPInput, OTPInputContext } from 'input-otp';
import { type VariantProps } from 'class-variance-authority';
import cn from '../utils/cn';
import { inputOTPSlotVariants, inputOTPCaretVariants } from '../constants/inputOtpVariants';

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  ),
);
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center', className)}
      {...props}
    />
  ),
);
InputOTPGroup.displayName = 'InputOTPGroup';

type InputOTPSlotProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof inputOTPSlotVariants> & {
    index: number;
    type?: 'default' | 'pin';
  };

const InputOTPSlot = React.forwardRef<React.ElementRef<'div'>, InputOTPSlotProps>(
  ({ index, className, variant = 'default', type = 'default', ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

    return (
      <div
        ref={ref}
        className={cn(inputOTPSlotVariants({ variant }), isActive && 'z-10 ring-1 ring-ring', className)}
        {...props}
      >
        {type === 'pin' && char ? '•' : char}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className={cn(inputOTPCaretVariants({ variant }))} />
          </div>
        )}
      </div>
    );
  },
);
InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
  ({ ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      {...props}
    >
      <FontAwesomeIcon
        icon={faMinus}
        className="w-1"
      />
    </div>
  ),
);
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
export type { InputOTPSlotProps };
