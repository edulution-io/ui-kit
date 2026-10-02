/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { FC, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import cn from '../utils/cn';
import CircleLoader from './CircleLoader';

type QRCodeSize = 'sm' | 'md' | 'lg' | 'xl' | 'default';

const SIZE_CONFIG = {
  sm: { px: 64, cls: 'w-[64px]  h-[64px]' },
  md: { px: 128, cls: 'w-[128px] h-[128px]' },
  lg: { px: 200, cls: 'w-[200px] h-[200px]' },
  xl: { px: 256, cls: 'w-[256px] h-[256px]' },
  default: { px: 256, cls: 'w-[256px] h-[256px]' },
} as const satisfies Record<QRCodeSize, { px: number; cls: string }>;

interface QRCodeDisplayProps {
  value: string;
  size?: QRCodeSize;
  className?: string;
  isLoading?: boolean;
}

const QRCodeDisplay: FC<QRCodeDisplayProps> = ({ value, size = 'default', className = '', isLoading = false }) => {
  const { px: pixelSize, cls: sizeClass } = useMemo<{
    px: number;
    cls: string;
  }>(() => SIZE_CONFIG[size], [size]);

  return (
    <div className={cn('flex flex-col items-center justify-center rounded-lg bg-white p-2', sizeClass, className)}>
      {isLoading ? (
        <CircleLoader className={sizeClass} />
      ) : (
        <QRCodeSVG
          value={value}
          size={pixelSize}
        />
      )}
    </div>
  );
};

export default QRCodeDisplay;
export type { QRCodeDisplayProps, QRCodeSize };
