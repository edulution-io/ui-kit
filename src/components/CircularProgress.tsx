/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import type { ReactNode } from 'react';
import cn from '../utils/cn';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  indicatorClassName?: string;
  children?: ReactNode;
}

const DEFAULT_SIZE = 19;
const DEFAULT_STROKE_WIDTH = 2.5;

const CircularProgress = ({
  value,
  size = DEFAULT_SIZE,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  className,
  indicatorClassName,
  children,
}: CircularProgressProps) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.min(Math.max(value, 0), 1);
  const hasCenterContent = children !== undefined && children !== null && children !== false;

  const ring = (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn('shrink-0', !hasCenterContent && className)}
      aria-hidden
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-accent"
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - fraction)}
        transform={`rotate(-90 ${center} ${center})`}
        className={cn('stroke-primary', indicatorClassName)}
      />
    </svg>
  );

  if (!hasCenterContent) return ring;

  return (
    <div
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {ring}
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
};

export default CircularProgress;
export type { CircularProgressProps };
