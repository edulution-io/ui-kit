/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import TimeUnitButton from './TimeUnitButton';
import { DropdownVariant } from './DropdownSelect';

export interface HourButtonProps {
  hour: number;
  currentHour: number;
  onChangeHour: (hour: number) => void;
  variant: DropdownVariant;
}

const HourButton: React.FC<HourButtonProps> = ({ hour, currentHour, onChangeHour, variant }) => (
  <TimeUnitButton
    value={hour}
    currentValue={currentHour}
    onChange={onChangeHour}
    variant={variant}
  />
);

export default HourButton;
