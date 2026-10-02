/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import cn from '../utils/cn';

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const GradientText = ({ className, children, ...props }: GradientTextProps) => (
  <span
    className={cn('gradient-text inline-block w-fit max-w-full', className)}
    {...props}
  >
    {children}
  </span>
);

export default GradientText;
