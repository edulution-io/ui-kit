/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace } from '@fortawesome/free-solid-svg-icons';
import cn from '../utils/cn';
import { Button } from './Button';

const NUMBER_PAD_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

interface NumberPadProps {
  onPress: (digit: string) => void;
  onClear: () => void;
  variant?: 'default' | 'dialog' | 'login';
}

const NumberPad: React.FC<NumberPadProps> = ({ onPress, onClear, variant = 'default' }) => (
  <div className="m-4 grid max-w-52 grid-cols-3 gap-2">
    {NUMBER_PAD_DIGITS.map((digit) => (
      <Button
        key={digit}
        variant="btn-outline"
        type="button"
        className={cn(
          'aspect-square hover:bg-ciGrey/10',
          variant === 'login' && 'border-darkGrey text-darkGrey hover:bg-darkGrey/10',
        )}
        onClick={() => onPress(digit)}
      >
        {digit}
      </Button>
    ))}
    <Button
      variant="btn-outline"
      type="button"
      className={cn(
        'w-[136px] hover:bg-ciGrey/10',
        variant === 'login' && 'border-darkGrey text-darkGrey hover:bg-darkGrey/10',
      )}
      onClick={onClear}
    >
      <FontAwesomeIcon icon={faBackspace} />
    </Button>
  </div>
);

export default NumberPad;
export type { NumberPadProps };
