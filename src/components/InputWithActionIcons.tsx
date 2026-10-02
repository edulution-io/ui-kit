/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { type VariantProps } from 'class-variance-authority';
import cn from '../utils/cn';
import { Input, inputVariants } from './Input';

type ActionIcon = { icon: IconDefinition; onClick: () => void; className?: string; label?: string };

type InputWithActionIconsProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & { actionIcons?: ActionIcon[] };

const InputWithActionIcons = React.forwardRef<HTMLInputElement, InputWithActionIconsProps>(
  ({ actionIcons = [], className, variant, disabled, readOnly, style, ...props }, ref) => {
    const iconCount = actionIcons.length;
    const paddingRight = iconCount > 0 ? iconCount * 24 + 8 : undefined;

    return (
      <div className={cn('relative w-full', className)}>
        <Input
          {...props}
          ref={ref}
          variant={variant}
          className={cn('overflow-hidden text-ellipsis whitespace-nowrap', {
            'cursor-pointer': props.onMouseDown,
          })}
          style={{ ...style, paddingRight }}
          readOnly={readOnly}
          disabled={disabled}
        />
        {iconCount > 0 && (
          <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-2">
            {actionIcons.map(({ icon, onClick, className: btnClass, label }) => (
              <button
                key={icon.iconName}
                type="button"
                onClick={onClick}
                disabled={disabled}
                aria-label={label}
                className="flex items-center justify-center hover:opacity-60"
              >
                <FontAwesomeIcon
                  icon={icon}
                  className={cn('h-4 w-4 cursor-pointer', disabled && 'text-muted', btnClass)}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

InputWithActionIcons.displayName = 'InputWithActionIcons';

export default InputWithActionIcons;
export type { InputWithActionIconsProps, ActionIcon };
