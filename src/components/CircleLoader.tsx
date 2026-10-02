/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { motion } from 'framer-motion';
import cn from '../utils/cn';

interface CircleLoaderProps {
  className?: string;
  transitionDurationMS?: number;
  height?: string;
  width?: string;
  forceLightMode?: boolean;
}

const CircleLoader = ({
  className,
  transitionDurationMS = 1000,
  height = 'h-12',
  width = 'w-12',
  forceLightMode = false,
}: CircleLoaderProps) => (
  <div className={cn('relative box-border', height, width, className)}>
    <motion.span
      className={cn(
        'absolute left-0 top-0 z-30 box-border block rounded-full border-4 border-t-4',
        forceLightMode ? 'border-lightGrey border-t-primary' : 'border-accent border-t-primary',
        height,
        width,
      )}
      animate={{ rotate: 360 }}
      transition={{
        loop: Infinity,
        ease: 'linear',
        duration: transitionDurationMS,
      }}
      style={{
        animation: `spin ${transitionDurationMS / 1000}s linear infinite`,
      }}
    />
  </div>
);

export default CircleLoader;
export type { CircleLoaderProps };
