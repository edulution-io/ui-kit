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

import * as React from 'react';
import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { INPUT_BASE_CLASSES, VARIANT_COLORS } from '../constants/inputClassNames';
import cn from '../utils/cn';

const inputVariants = cva(INPUT_BASE_CLASSES, {
  variants: {
    variant: {
      default: `${VARIANT_COLORS.default} placeholder:text-p`,
      dialog: `${VARIANT_COLORS.dialog} placeholder:text-p`,
      login: `${VARIANT_COLORS.login} placeholder:text-p focus:placeholder-muted`,
      lightGrayDisabled: `${VARIANT_COLORS.lightGrayDisabled} placeholder:text-p`,
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type InputVariant = NonNullable<VariantProps<typeof inputVariants>['variant']>;

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    shouldTrim?: boolean;
    /** Custom content rendered on the right side of the input. */
    icon?: React.ReactNode;
    /** FontAwesome icon rendered on the left side of the input. Adds left padding automatically. */
    leftIcon?: IconDefinition;
    /** Called when the clear button is clicked. Shows an X button on the right when the input has a value. */
    onClear?: () => void;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', variant, shouldTrim = false, onChange, icon, leftIcon, onClear, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const hasValue = props.value !== undefined && props.value !== '';
    const needsWrapper = isPassword || icon || leftIcon || onClear;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) {
        return;
      }

      const { value } = event.target;

      if (type === 'number') {
        onChange({
          ...event,
          target: {
            ...event.target,
            value: Number(value) as unknown as string,
          },
        });
        return;
      }

      if (shouldTrim && (type === 'text' || isPassword)) {
        onChange({
          ...event,
          target: {
            ...event.target,
            value: value.trim(),
          },
        });
        return;
      }

      onChange(event);
    };

    const inputElement = (
      <input
        type={isPassword && showPassword ? 'text' : type}
        inputMode={type === 'number' ? 'numeric' : undefined}
        className={cn(
          inputVariants({ variant }),
          isPassword && 'pr-10',
          leftIcon && 'pl-9',
          onClear && 'pr-8',
          className,
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );

    if (!needsWrapper) {
      return inputElement;
    }

    return (
      <div className="relative w-full">
        {leftIcon && (
          <FontAwesomeIcon
            icon={leftIcon}
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          />
        )}
        {inputElement}
        {isPassword && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
            <button
              type="button"
              onClickCapture={() => setShowPassword((prevValue) => !prevValue)}
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="h-5 w-5 text-ciGrey"
              />
            </button>
          </div>
        )}
        {onClear && hasValue && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="h-3.5 w-3.5"
            />
          </button>
        )}
        {icon && <div className="absolute inset-y-0 right-0 flex items-center pr-3">{icon}</div>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input, inputVariants };
