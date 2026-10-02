/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { motion } from 'framer-motion';
import cn from '../utils/cn';

interface HorizontalLoaderProps {
  className?: string;
  transitionDurationMS?: number;
  height?: string;
  width?: string;
  barWidth?: string;
  barColor?: string;
  backgroundColor?: string;
}

const HorizontalLoader = ({
  className,
  transitionDurationMS = 4000,
  height = 'h-1',
  width = 'w-full',
  barWidth = 'w-1/2',
  barColor = 'bg-primary',
  backgroundColor = 'bg-accent',
}: HorizontalLoaderProps) => (
  <div className={cn('relative overflow-hidden rounded-lg', height, width, backgroundColor, className)}>
    <motion.span
      className={cn('absolute bottom-0 left-0 top-0', barWidth, barColor)}
      animate={{ x: ['0%', '100%', '0%'] }}
      transition={{
        duration: transitionDurationMS / 1000,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  </div>
);

export default HorizontalLoader;
export type { HorizontalLoaderProps };
