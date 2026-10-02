/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import TimeUnitButton from './TimeUnitButton';
import { DropdownVariant } from './DropdownSelect';

export interface MinuteButtonProps {
  minute: number;
  currentMinute: number;
  onChangeMinute: (minute: number) => void;
  variant: DropdownVariant;
}

const padMinute = (v: number): string => v.toString().padStart(2, '0');

const MinuteButton: React.FC<MinuteButtonProps> = ({ minute, currentMinute, onChangeMinute, variant }) => (
  <TimeUnitButton
    value={minute}
    currentValue={currentMinute}
    onChange={onChangeMinute}
    variant={variant}
    format={padMinute}
  />
);

export default MinuteButton;
